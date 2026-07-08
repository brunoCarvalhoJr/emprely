using Emprely.Api.Comunicacoes;
using Emprely.Api.Configuracoes;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Admin;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/contas")]
public sealed class AdminContasController : AdminControllerBase
{
    private readonly EmprelyDbContext dbContext;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly AppPublicOptions appPublicOptions;

    public AdminContasController(
        EmprelyDbContext dbContext,
        IEmailTransacionalService emailTransacionalService,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.dbContext = dbContext;
        this.emailTransacionalService = emailTransacionalService;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [HttpPost]
    public async Task<ActionResult<AdminContaCriadaResponse>> CriarConta(
        AdminCriarContaRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            return BadRequest(new { message = "Motivo e obrigatorio." });
        }

        var usuarioOwner = await dbContext.Users
            .FirstOrDefaultAsync(usuario => usuario.Id == request.UsuarioOwnerId, cancellationToken);
        if (usuarioOwner is null)
        {
            return NotFound(new { message = "Usuario owner nao encontrado." });
        }

        var usuarioJaPossuiConta = await dbContext.MembrosConta
            .AnyAsync(membro => membro.UsuarioId == request.UsuarioOwnerId, cancellationToken);
        if (usuarioJaPossuiConta)
        {
            return Conflict(new { message = "Usuario ja possui conta vinculada." });
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var conta = Conta.CreateConta(request.NomeConta);
        conta.DefinirPlano(ParsePlano(request.PlanoInicial));
        dbContext.Contas.Add(conta);
        dbContext.MembrosConta.Add(MembroConta.CreateOwner(conta.Id, usuarioOwner.Id));
        dbContext.PerfisConta.Add(PerfilConta.CreatePerfilConta(
            conta.Id,
            request.NomeConta,
            usuarioOwner.Email,
            usuarioOwner.PhoneNumber,
            null,
            null,
            null,
            PerfilConta.CorPrimariaPadrao,
            PerfilConta.CorSecundariaPadrao,
            null));

        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "ContaCriadaParaUsuario",
            "Conta",
            conta.Id,
            request.Motivo,
            $"UsuarioOwnerId={usuarioOwner.Id};Plano={conta.Plano}",
            cancellationToken);

        await transaction.CommitAsync(cancellationToken);

        return Ok(new AdminContaCriadaResponse(
            conta.Id,
            usuarioOwner.Id,
            conta.Nome,
            conta.Plano.ToString(),
            conta.GetStatusComercialConta(DateTimeOffset.UtcNow).ToString()));
    }

    [HttpPost("{contaId:guid}/plano")]
    public async Task<ActionResult<AdminContaResponse>> AlterarPlano(
        Guid contaId,
        AdminAlterarPlanoContaRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        var conta = await dbContext.Contas.FirstOrDefaultAsync(contaAtual => contaAtual.Id == contaId, cancellationToken);
        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        conta.DefinirPlano(ParsePlano(request.Plano));
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "ContaPlanoAlterado",
            "Conta",
            conta.Id,
            request.Motivo,
            $"Plano: {conta.Plano}",
            cancellationToken);

        return Ok(BuildAdminContaResponse(conta));
    }

    [HttpPost("{contaId:guid}/dias-gratis")]
    public async Task<IActionResult> CriarDiasGratis(
        Guid contaId,
        AdminDiasGratisContaRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var conta = await dbContext.Contas.FirstOrDefaultAsync(contaAtual => contaAtual.Id == contaId, cancellationToken);
        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        var diasGratis = DiasGratisConta.Create(contaId, request.InicioAt, request.FimAt, request.Motivo, admin.Id);
        dbContext.DiasGratisConta.Add(diasGratis);
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "ContaDiasGratisCriado",
            "Conta",
            contaId,
            request.Motivo,
            $"{request.InicioAt:O} - {request.FimAt:O}",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("dias-gratis/lote")]
    public async Task<IActionResult> CriarDiasGratisLote(
        AdminDiasGratisLoteRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();

        foreach (var contaId in request.ContaIds.Distinct())
        {
            if (!await dbContext.Contas.AnyAsync(conta => conta.Id == contaId, cancellationToken))
            {
                continue;
            }

            dbContext.DiasGratisConta.Add(DiasGratisConta.Create(
                contaId,
                request.InicioAt,
                request.FimAt,
                request.Motivo,
                admin.Id));

            await RegistrarAuditoriaAsync(
                dbContext,
                admin,
                "ContaDiasGratisCriadoLote",
                "Conta",
                contaId,
                request.Motivo,
                $"{request.InicioAt:O} - {request.FimAt:O}",
                cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{contaId:guid}/suspender")]
    public async Task<IActionResult> SuspenderConta(
        Guid contaId,
        AdminSuspenderContaRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        var conta = await dbContext.Contas.FirstOrDefaultAsync(contaAtual => contaAtual.Id == contaId, cancellationToken);
        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        conta.Suspender();
        await dbContext.SaveChangesAsync(cancellationToken);

        if (request.EnviarEmail)
        {
            await EnviarEmailContaSuspensa(conta, cancellationToken);
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "ContaSuspensa",
            "Conta",
            conta.Id,
            request.Motivo,
            $"Email enviado: {request.EnviarEmail}",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{contaId:guid}/reativar")]
    public async Task<IActionResult> ReativarConta(
        Guid contaId,
        AdminMotivoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        var conta = await dbContext.Contas.FirstOrDefaultAsync(contaAtual => contaAtual.Id == contaId, cancellationToken);
        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        conta.Reativar();
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "ContaReativada",
            "Conta",
            conta.Id,
            request.Motivo,
            null,
            cancellationToken);

        return NoContent();
    }

    private async Task EnviarEmailContaSuspensa(Conta conta, CancellationToken cancellationToken)
    {
        var owner = await dbContext.MembrosConta
            .Where(membro => membro.ContaId == conta.Id && membro.Papel == PapelMembroConta.Owner)
            .Join(
                dbContext.Users,
                membro => membro.UsuarioId,
                usuario => usuario.Id,
                (membro, usuario) => usuario)
            .FirstOrDefaultAsync(cancellationToken);

        if (owner?.Email is null)
        {
            return;
        }

        await emailTransacionalService.EnviarAsync(
            EmailTransacionalTemplateBuilder.Build(
                conta.Id,
                owner.Id,
                TipoEmailTransacional.AdminContaSuspensa,
                owner.Email,
                "Acesso da conta Emprely suspenso",
                "O acesso da sua conta Emprely foi suspenso por uma acao administrativa. Responda este email se precisar de suporte.",
                appPublicOptions.PublicWebUrl),
            cancellationToken);
    }

    private static PlanoConta ParsePlano(string plano)
    {
        return Enum.TryParse<PlanoConta>(plano, ignoreCase: true, out var planoConta)
            ? planoConta
            : PlanoConta.Trial;
    }

    private static AdminContaResponse BuildAdminContaResponse(Conta conta)
    {
        var agora = DateTimeOffset.UtcNow;

        return new AdminContaResponse(
            conta.Id,
            conta.Nome,
            conta.Slug,
            conta.Plano.ToString(),
            conta.GetStatusComercialConta(agora).ToString(),
            conta.TrialEndsAt,
            conta.PlanoFundadorAtivadoAt,
            19.99m);
    }
}
