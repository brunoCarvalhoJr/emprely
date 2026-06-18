using System.Text;
using System.Text.RegularExpressions;
using Emprely.Api.Comunicacoes;
using Emprely.Api.Configuracoes;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Admin;
using Emprely.Domain.Admin;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/usuarios")]
public sealed class AdminUsuariosController : AdminControllerBase
{
    private readonly EmprelyDbContext dbContext;
    private readonly UserManager<UsuarioAplicacao> userManager;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly AppPublicOptions appPublicOptions;

    public AdminUsuariosController(
        EmprelyDbContext dbContext,
        UserManager<UsuarioAplicacao> userManager,
        IEmailTransacionalService emailTransacionalService,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.dbContext = dbContext;
        this.userManager = userManager;
        this.emailTransacionalService = emailTransacionalService;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [HttpGet]
    public async Task<ActionResult<AdminUsuariosPainelResponse>> GetUsuarios(
        [FromQuery] string? busca,
        [FromQuery] string? plano,
        [FromQuery] string? statusComercial,
        [FromQuery] string? statusConta,
        [FromQuery] string? papelConta,
        [FromQuery] bool? emailConfirmado,
        [FromQuery] bool? bloqueado,
        [FromQuery] bool? semConta,
        [FromQuery] bool? trialAtivo,
        [FromQuery] bool? trialExpirado,
        [FromQuery] bool? diasGratisAtivo,
        [FromQuery] DateTimeOffset? criadoDe,
        [FromQuery] DateTimeOffset? criadoAte,
        [FromQuery] DateTimeOffset? ultimoEmailDe,
        [FromQuery] DateTimeOffset? ultimoEmailAte,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken cancellationToken = default)
    {
        _ = GetAdminAtual();

        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivosContaIds = await GetDiasGratisAtivosContaIds(agora, cancellationToken);
        var rows = await GetUsuariosFiltradosAsync(
            new AdminUsuariosFiltros(
                busca,
                plano,
                statusComercial,
                statusConta,
                papelConta,
                emailConfirmado,
                bloqueado,
                semConta,
                trialAtivo,
                trialExpirado,
                diasGratisAtivo,
                criadoDe,
                criadoAte,
                ultimoEmailDe,
                ultimoEmailAte),
            diasGratisAtivosContaIds,
            agora,
            cancellationToken);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var total = rows.Count;
        var usuarios = rows
            .OrderByDescending(usuario => usuario.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var metricas = await BuildMetricasAsync(diasGratisAtivosContaIds, cancellationToken);

        return Ok(new AdminUsuariosPainelResponse(
            metricas,
            usuarios.Select(usuario => BuildUsuarioResumo(usuario, diasGratisAtivosContaIds, agora)).ToList(),
            total));
    }

    [HttpGet("{usuarioId:guid}")]
    public async Task<ActionResult<AdminUsuarioDetalheResponse>> GetUsuario(
        Guid usuarioId,
        CancellationToken cancellationToken)
    {
        _ = GetAdminAtual();

        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivosContaIds = await GetDiasGratisAtivosContaIds(agora, cancellationToken);
        var usuario = await BuildUsuariosQuery(diasGratisAtivosContaIds)
            .FirstOrDefaultAsync(usuarioAtual => usuarioAtual.Id == usuarioId, cancellationToken);

        if (usuario is null)
        {
            return NotFound(new { message = "Usuario nao encontrado." });
        }

        var emails = await dbContext.EmailsTransacionais
            .Where(email => email.UsuarioId == usuarioId)
            .OrderByDescending(email => email.CreatedAt)
            .Take(30)
            .Select(email => new AdminEmailHistoricoResponse(
                email.Id,
                email.ContaId,
                email.UsuarioId,
                email.Tipo.ToString(),
                email.Destinatario,
                email.Status.ToString(),
                email.ProviderMessageId,
                email.Erro,
                email.CreatedAt))
            .ToListAsync(cancellationToken);

        var auditorias = await dbContext.AdminAuditorias
            .Where(auditoria => auditoria.AlvoId == usuarioId)
            .OrderByDescending(auditoria => auditoria.CreatedAt)
            .Take(30)
            .Select(auditoria => new AdminAuditoriaResponse(
                auditoria.Id,
                auditoria.AdminUsuarioId,
                auditoria.AdminEmail,
                auditoria.AdminPerfil,
                auditoria.Acao,
                auditoria.AlvoTipo,
                auditoria.AlvoId,
                auditoria.Motivo,
                auditoria.Detalhes,
                auditoria.Ip,
                auditoria.UserAgent,
                auditoria.Resultado,
                auditoria.CreatedAt))
            .ToListAsync(cancellationToken);

        return Ok(new AdminUsuarioDetalheResponse(
            BuildUsuarioResumo(usuario, diasGratisAtivosContaIds, agora),
            emails,
            auditorias));
    }

    [HttpPost]
    public async Task<ActionResult<AdminUsuarioResumoResponse>> CriarUsuario(
        AdminCriarUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        var email = request.Email.Trim().ToLowerInvariant();
        if (await userManager.FindByEmailAsync(email) is not null)
        {
            return Conflict(new { message = "E-mail ja cadastrado." });
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            return ValidationProblem("Motivo administrativo obrigatorio.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var usuario = new UsuarioAplicacao
        {
            Id = Guid.CreateVersion7(),
            Nome = request.Nome.Trim(),
            Email = email,
            UserName = email,
            PhoneNumber = request.Telefone?.Trim(),
            EmailConfirmed = request.EmailConfirmadoPeloAdmin,
        };

        var createResult = await userManager.CreateAsync(usuario, request.SenhaTemporaria);
        if (!createResult.Succeeded)
        {
            foreach (var error in createResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        Conta? conta = null;
        if (request.CriarConta)
        {
            if (string.IsNullOrWhiteSpace(request.NomeConta))
            {
                return ValidationProblem("Nome da conta e obrigatorio para criar conta.");
            }

            conta = Conta.CreateConta(request.NomeConta);
            conta.DefinirPlano(ParsePlano(request.PlanoInicial));
            dbContext.Contas.Add(conta);
            dbContext.MembrosConta.Add(MembroConta.CreateOwner(conta.Id, usuario.Id));
            dbContext.PerfisConta.Add(PerfilConta.CreatePerfilConta(
                conta.Id,
                request.NomeConta,
                email,
                request.Telefone?.Trim(),
                null,
                null,
                null,
                PerfilConta.CorPrimariaPadrao,
                PerfilConta.CorSecundariaPadrao,
                null));
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        if (request.EnviarLinkConfirmacao)
        {
            var token = await userManager.GenerateEmailConfirmationTokenAsync(usuario);
            var tokenUrl = Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var confirmUrl = BuildPublicWebUrl($"?auth=confirm-email&userId={usuario.Id}&token={Uri.EscapeDataString(tokenUrl)}");

            await emailTransacionalService.EnviarAsync(
                EmailTransacionalTemplateBuilder.Build(
                    conta?.Id,
                    usuario.Id,
                    TipoEmailTransacional.ConfirmacaoEmail,
                    email,
                    "Acesse sua conta no Emprely",
                    $"Seu acesso foi criado por um administrador. Defina e confirme seu acesso pelo link: {confirmUrl}",
                    appPublicOptions.PublicWebUrl),
                cancellationToken);
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "UsuarioCriado",
            "Usuario",
            usuario.Id,
            request.Motivo,
            request.CriarConta ? $"Conta criada: {conta?.Nome}" : "Usuario criado sem conta",
            cancellationToken);

        await transaction.CommitAsync(cancellationToken);

        var diasGratisAtivosContaIds = await GetDiasGratisAtivosContaIds(DateTimeOffset.UtcNow, cancellationToken);
        var usuarioResumo = await BuildUsuariosQuery(diasGratisAtivosContaIds)
            .FirstAsync(usuarioAtual => usuarioAtual.Id == usuario.Id, cancellationToken);

        return Ok(BuildUsuarioResumo(usuarioResumo, diasGratisAtivosContaIds, DateTimeOffset.UtcNow));
    }

    [HttpPost("{usuarioId:guid}/bloquear")]
    public async Task<IActionResult> BloquearUsuario(
        Guid usuarioId,
        AdminMotivoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var usuario = await userManager.FindByIdAsync(usuarioId.ToString());
        if (usuario is null)
        {
            return NotFound(new { message = "Usuario nao encontrado." });
        }

        usuario.BloqueadoAdministrativamenteAt = DateTimeOffset.UtcNow;
        await userManager.SetLockoutEnabledAsync(usuario, true);
        await userManager.SetLockoutEndDateAsync(usuario, DateTimeOffset.MaxValue);
        await userManager.UpdateSecurityStampAsync(usuario);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "UsuarioBloqueado",
            "Usuario",
            usuario.Id,
            request.Motivo,
            null,
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{usuarioId:guid}/desbloquear")]
    public async Task<IActionResult> DesbloquearUsuario(
        Guid usuarioId,
        AdminMotivoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var usuario = await userManager.FindByIdAsync(usuarioId.ToString());
        if (usuario is null)
        {
            return NotFound(new { message = "Usuario nao encontrado." });
        }

        usuario.BloqueadoAdministrativamenteAt = null;
        await userManager.SetLockoutEndDateAsync(usuario, null);
        await userManager.UpdateSecurityStampAsync(usuario);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "UsuarioDesbloqueado",
            "Usuario",
            usuario.Id,
            request.Motivo,
            null,
            cancellationToken);

        return NoContent();
    }

    [HttpPost("emails/personalizado")]
    public async Task<IActionResult> EnviarEmailPersonalizado(
        AdminEmailPersonalizadoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();

        if (request.UsuarioIds.Count == 0)
        {
            return ValidationProblem("Selecione ao menos um usuario.");
        }

        if (string.IsNullOrWhiteSpace(request.Assunto) || string.IsNullOrWhiteSpace(request.Html))
        {
            return ValidationProblem("Assunto e HTML sao obrigatorios.");
        }

        var usuarios = await dbContext.Users
            .Where(usuario => request.UsuarioIds.Contains(usuario.Id))
            .ToListAsync(cancellationToken);

        foreach (var usuario in usuarios)
        {
            var membro = await dbContext.MembrosConta
                .FirstOrDefaultAsync(membroAtual => membroAtual.UsuarioId == usuario.Id, cancellationToken);

            await emailTransacionalService.EnviarAsync(
                new EmailTransacionalMensagem(
                    membro?.ContaId,
                    usuario.Id,
                    TipoEmailTransacional.AdminPersonalizado,
                    usuario.Email ?? string.Empty,
                    request.Assunto.Trim(),
                    request.Html,
                    StripHtml(request.Html),
                    null,
                    request.Anexos.Select(anexo => new EmailTransacionalAnexo(
                        anexo.NomeArquivo,
                        anexo.ContentType,
                        anexo.ConteudoBase64)).ToList()),
                cancellationToken);

            await RegistrarAuditoriaAsync(
                dbContext,
                admin,
                "EmailPersonalizadoEnviado",
                "Usuario",
                usuario.Id,
                request.Motivo,
                $"Assunto: {request.Assunto}; anexos: {request.Anexos.Count}",
                cancellationToken);
        }

        return NoContent();
    }

    [HttpGet("export.csv")]
    public async Task<IActionResult> ExportCsv(
        [FromQuery] string? busca,
        [FromQuery] string? plano,
        [FromQuery] string? statusComercial,
        [FromQuery] string? statusConta,
        [FromQuery] string? papelConta,
        [FromQuery] bool? emailConfirmado,
        [FromQuery] bool? bloqueado,
        [FromQuery] bool? semConta,
        [FromQuery] bool? trialAtivo,
        [FromQuery] bool? trialExpirado,
        [FromQuery] bool? diasGratisAtivo,
        [FromQuery] DateTimeOffset? criadoDe,
        [FromQuery] DateTimeOffset? criadoAte,
        [FromQuery] DateTimeOffset? ultimoEmailDe,
        [FromQuery] DateTimeOffset? ultimoEmailAte,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivosContaIds = await GetDiasGratisAtivosContaIds(agora, cancellationToken);
        var usuarios = await GetUsuariosFiltradosAsync(
            new AdminUsuariosFiltros(
                busca,
                plano,
                statusComercial,
                statusConta,
                papelConta,
                emailConfirmado,
                bloqueado,
                semConta,
                trialAtivo,
                trialExpirado,
                diasGratisAtivo,
                criadoDe,
                criadoAte,
                ultimoEmailDe,
                ultimoEmailAte),
            diasGratisAtivosContaIds,
            agora,
            cancellationToken);

        var csv = new StringBuilder();
        csv.AppendLine("id,nome,email,telefone,email_confirmado,bloqueado,conta_id,conta_nome,papel_conta,plano,status_comercial,status_conta,trial_fim,dias_gratis_ativo,ultimo_email,criado_em");
        foreach (var usuario in usuarios.OrderBy(usuario => usuario.Email))
        {
            var resumo = BuildUsuarioResumo(usuario, diasGratisAtivosContaIds, agora);
            csv.AppendLine(string.Join(',', [
                Csv(resumo.Id.ToString()),
                Csv(resumo.Nome),
                Csv(resumo.Email),
                Csv(resumo.Telefone ?? string.Empty),
                Csv(resumo.EmailConfirmado.ToString()),
                Csv(resumo.Bloqueado.ToString()),
                Csv(resumo.ContaId?.ToString() ?? string.Empty),
                Csv(resumo.ContaNome ?? string.Empty),
                Csv(resumo.PapelConta ?? string.Empty),
                Csv(resumo.Plano ?? string.Empty),
                Csv(resumo.StatusComercial ?? string.Empty),
                Csv(resumo.StatusConta ?? string.Empty),
                Csv(resumo.TrialEndsAt?.ToString("O") ?? string.Empty),
                Csv(resumo.DiasGratisAtivo.ToString()),
                Csv(resumo.UltimoEmailEnviadoAt?.ToString("O") ?? string.Empty),
                Csv(resumo.CreatedAt.ToString("O")),
            ]));
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "UsuariosCsvExportado",
            "Usuario",
            null,
            "Exportacao CSV simples",
            $"Registros: {usuarios.Count}",
            cancellationToken);

        return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv; charset=utf-8", "emprely-admin-usuarios.csv");
    }

    private IQueryable<AdminUsuarioQueryRow> BuildUsuariosQuery(IReadOnlySet<Guid> diasGratisAtivosContaIds)
    {
        return dbContext.Users
            .Select(usuario => new AdminUsuarioQueryRow
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                PhoneNumber = usuario.PhoneNumber,
                EmailConfirmed = usuario.EmailConfirmed,
                BloqueadoAdministrativamenteAt = usuario.BloqueadoAdministrativamenteAt,
                LockoutEnd = usuario.LockoutEnd,
                CreatedAt = usuario.CreatedAt,
                Membro = dbContext.MembrosConta
                    .Include(membro => membro.Conta)
                    .Where(membro => membro.UsuarioId == usuario.Id)
                    .OrderBy(membro => membro.CreatedAt)
                    .FirstOrDefault(),
                UltimoEmailEnviadoAt = dbContext.EmailsTransacionais
                    .Where(email => email.UsuarioId == usuario.Id)
                    .Select(email => (DateTimeOffset?)email.CreatedAt)
                    .Max(),
            });
    }

    private async Task<List<AdminUsuarioQueryRow>> GetUsuariosFiltradosAsync(
        AdminUsuariosFiltros filtros,
        IReadOnlySet<Guid> diasGratisAtivosContaIds,
        DateTimeOffset agora,
        CancellationToken cancellationToken)
    {
        var query = BuildUsuariosQuery(diasGratisAtivosContaIds);

        if (!string.IsNullOrWhiteSpace(filtros.Busca))
        {
            var termo = filtros.Busca.Trim().ToLowerInvariant();
            query = query.Where(usuario =>
                usuario.Nome.ToLower().Contains(termo) ||
                (usuario.Email != null && usuario.Email.ToLower().Contains(termo)) ||
                (usuario.PhoneNumber != null && usuario.PhoneNumber.Contains(termo)) ||
                (usuario.Membro != null && usuario.Membro.Conta != null && usuario.Membro.Conta.Nome.ToLower().Contains(termo)));
        }

        if (!string.IsNullOrWhiteSpace(filtros.Plano))
        {
            query = query.Where(usuario => usuario.Membro != null && usuario.Membro.Conta != null && usuario.Membro.Conta.Plano.ToString() == filtros.Plano);
        }

        if (!string.IsNullOrWhiteSpace(filtros.StatusConta))
        {
            query = query.Where(usuario => usuario.Membro != null && usuario.Membro.Conta != null && usuario.Membro.Conta.Status.ToString() == filtros.StatusConta);
        }

        if (!string.IsNullOrWhiteSpace(filtros.PapelConta))
        {
            query = query.Where(usuario => usuario.Membro != null && usuario.Membro.Papel.ToString() == filtros.PapelConta);
        }

        if (filtros.EmailConfirmado.HasValue)
        {
            query = query.Where(usuario => usuario.EmailConfirmed == filtros.EmailConfirmado.Value);
        }

        if (filtros.Bloqueado.HasValue)
        {
            query = query.Where(usuario => (usuario.BloqueadoAdministrativamenteAt != null) == filtros.Bloqueado.Value);
        }

        if (filtros.SemConta.HasValue)
        {
            query = filtros.SemConta.Value
                ? query.Where(usuario => usuario.Membro == null)
                : query.Where(usuario => usuario.Membro != null);
        }

        if (filtros.CriadoDe.HasValue)
        {
            query = query.Where(usuario => usuario.CreatedAt >= filtros.CriadoDe.Value);
        }

        if (filtros.CriadoAte.HasValue)
        {
            query = query.Where(usuario => usuario.CreatedAt <= filtros.CriadoAte.Value);
        }

        if (filtros.UltimoEmailDe.HasValue)
        {
            query = query.Where(usuario => usuario.UltimoEmailEnviadoAt >= filtros.UltimoEmailDe.Value);
        }

        if (filtros.UltimoEmailAte.HasValue)
        {
            query = query.Where(usuario => usuario.UltimoEmailEnviadoAt <= filtros.UltimoEmailAte.Value);
        }

        var rows = await query.ToListAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(filtros.StatusComercial))
        {
            rows = rows
                .Where(usuario => usuario.Membro?.Conta is not null &&
                    GetStatusComercial(usuario.Membro.Conta, diasGratisAtivosContaIds, agora) == filtros.StatusComercial)
                .ToList();
        }

        if (filtros.TrialAtivo.HasValue)
        {
            rows = rows
                .Where(usuario => (usuario.Membro?.Conta?.IsTrialAtivo(agora) == true) == filtros.TrialAtivo.Value)
                .ToList();
        }

        if (filtros.TrialExpirado.HasValue)
        {
            rows = rows
                .Where(usuario =>
                    (usuario.Membro?.Conta is { Plano: PlanoConta.Trial } conta && conta.TrialEndsAt <= agora) == filtros.TrialExpirado.Value)
                .ToList();
        }

        if (filtros.DiasGratisAtivo.HasValue)
        {
            rows = rows
                .Where(usuario =>
                    (usuario.Membro?.Conta is not null && diasGratisAtivosContaIds.Contains(usuario.Membro.Conta.Id)) == filtros.DiasGratisAtivo.Value)
                .ToList();
        }

        return rows;
    }

    private async Task<AdminUsuariosMetricasResponse> BuildMetricasAsync(
        IReadOnlySet<Guid> diasGratisAtivosContaIds,
        CancellationToken cancellationToken)
    {
        var usuarios = await BuildUsuariosQuery(diasGratisAtivosContaIds).ToListAsync(cancellationToken);

        return new AdminUsuariosMetricasResponse(
            usuarios.Count,
            usuarios.Count(usuario => usuario.Membro?.Conta is not null &&
                GetStatusComercial(usuario.Membro.Conta, diasGratisAtivosContaIds, DateTimeOffset.UtcNow) == StatusComercialConta.TrialAtivo.ToString()),
            usuarios.Count(usuario => usuario.Membro?.Conta?.Plano == PlanoConta.Fundador),
            usuarios.Count(usuario => usuario.Membro?.Conta?.Status == StatusConta.Suspensa),
            usuarios.Count(usuario => usuario.BloqueadoAdministrativamenteAt is not null || usuario.LockoutEnd > DateTimeOffset.UtcNow),
            usuarios.Count(usuario => usuario.Membro is null));
    }

    private static AdminUsuarioResumoResponse BuildUsuarioResumo(
        AdminUsuarioQueryRow usuario,
        IReadOnlySet<Guid> diasGratisAtivosContaIds,
        DateTimeOffset agora)
    {
        var conta = usuario.Membro?.Conta;

        return new AdminUsuarioResumoResponse(
            usuario.Id,
            usuario.Nome,
            usuario.Email ?? string.Empty,
            usuario.PhoneNumber,
            usuario.EmailConfirmed,
            usuario.BloqueadoAdministrativamenteAt is not null || usuario.LockoutEnd > agora,
            conta?.Id,
            conta?.Nome,
            usuario.Membro?.Papel.ToString(),
            conta?.Plano.ToString(),
            conta is null ? null : GetStatusComercial(conta, diasGratisAtivosContaIds, agora),
            conta?.Status.ToString(),
            conta?.TrialEndsAt,
            conta is not null && diasGratisAtivosContaIds.Contains(conta.Id),
            usuario.UltimoEmailEnviadoAt,
            usuario.CreatedAt);
    }

    private static string GetStatusComercial(
        Conta conta,
        IReadOnlySet<Guid> diasGratisAtivosContaIds,
        DateTimeOffset agora)
    {
        if (conta.Plano == PlanoConta.Fundador)
        {
            return StatusComercialConta.FundadorAtivo.ToString();
        }

        if (conta.IsTrialAtivo(agora) || diasGratisAtivosContaIds.Contains(conta.Id))
        {
            return StatusComercialConta.TrialAtivo.ToString();
        }

        return StatusComercialConta.TrialExpirado.ToString();
    }

    private async Task<IReadOnlySet<Guid>> GetDiasGratisAtivosContaIds(
        DateTimeOffset agora,
        CancellationToken cancellationToken)
    {
        var contaIds = await dbContext.DiasGratisConta
            .Where(dias => dias.InicioAt <= agora && dias.FimAt > agora)
            .Select(dias => dias.ContaId)
            .Distinct()
            .ToListAsync(cancellationToken);

        return contaIds.ToHashSet();
    }

    private static PlanoConta ParsePlano(string? plano)
    {
        return Enum.TryParse<PlanoConta>(plano, ignoreCase: true, out var planoConta)
            ? planoConta
            : PlanoConta.Trial;
    }

    private string BuildPublicWebUrl(string pathAndQuery)
    {
        var baseUrl = appPublicOptions.PublicWebUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/{pathAndQuery.TrimStart('/')}";
    }

    private static string StripHtml(string html)
    {
        return Regex.Replace(html, "<.*?>", string.Empty).Trim();
    }

    private static string Csv(string valor)
    {
        return $"\"{valor.Replace("\"", "\"\"")}\"";
    }

    private sealed class AdminUsuarioQueryRow
    {
        public Guid Id { get; init; }
        public string Nome { get; init; } = string.Empty;
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }
        public bool EmailConfirmed { get; init; }
        public DateTimeOffset? BloqueadoAdministrativamenteAt { get; init; }
        public DateTimeOffset? LockoutEnd { get; init; }
        public DateTimeOffset CreatedAt { get; init; }
        public MembroConta? Membro { get; init; }
        public DateTimeOffset? UltimoEmailEnviadoAt { get; init; }
    }

    private sealed record AdminUsuariosFiltros(
        string? Busca,
        string? Plano,
        string? StatusComercial,
        string? StatusConta,
        string? PapelConta,
        bool? EmailConfirmado,
        bool? Bloqueado,
        bool? SemConta,
        bool? TrialAtivo,
        bool? TrialExpirado,
        bool? DiasGratisAtivo,
        DateTimeOffset? CriadoDe,
        DateTimeOffset? CriadoAte,
        DateTimeOffset? UltimoEmailDe,
        DateTimeOffset? UltimoEmailAte);
}
