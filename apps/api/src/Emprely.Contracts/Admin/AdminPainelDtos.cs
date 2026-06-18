namespace Emprely.Contracts.Admin;

public sealed record AdminLoginRequest(
    string Email,
    string Senha);

public sealed record AdminLoginResponse(
    string AccessToken,
    DateTimeOffset ExpiresAtUtc,
    AdminAtualResponse Admin);

public sealed record AdminAtualResponse(
    Guid Id,
    string Nome,
    string Email,
    string Perfil,
    bool IsOwner);

public sealed record AdminPainelAdminResponse(
    Guid Id,
    string Nome,
    string Email,
    string Perfil,
    string Status,
    DateTimeOffset? UltimoLoginAt,
    DateTimeOffset CreatedAt);

public sealed record AdminCriarAdminRequest(
    string Nome,
    string Email,
    string Senha,
    string Perfil,
    string Motivo);

public sealed record AdminAlterarPerfilAdminRequest(
    string Perfil,
    string Motivo);

public sealed record AdminUsuariosPainelResponse(
    AdminUsuariosMetricasResponse Metricas,
    IReadOnlyList<AdminUsuarioResumoResponse> Usuarios,
    int Total);

public sealed record AdminUsuariosMetricasResponse(
    int TotalUsuarios,
    int TrialsAtivos,
    int Fundadores,
    int ContasSuspensas,
    int UsuariosBloqueados,
    int UsuariosSemConta);

public sealed record AdminUsuarioResumoResponse(
    Guid Id,
    string Nome,
    string Email,
    string? Telefone,
    bool EmailConfirmado,
    bool Bloqueado,
    Guid? ContaId,
    string? ContaNome,
    string? PapelConta,
    string? Plano,
    string? StatusComercial,
    string? StatusConta,
    DateTimeOffset? TrialEndsAt,
    bool DiasGratisAtivo,
    DateTimeOffset? UltimoEmailEnviadoAt,
    DateTimeOffset CreatedAt);

public sealed record AdminContaCriadaResponse(
    Guid ContaId,
    Guid UsuarioOwnerId,
    string NomeConta,
    string Plano,
    string StatusComercial);

public sealed record AdminUsuarioDetalheResponse(
    AdminUsuarioResumoResponse Usuario,
    IReadOnlyList<AdminEmailHistoricoResponse> Emails,
    IReadOnlyList<AdminAuditoriaResponse> Auditoria);

public sealed record AdminAuditoriaResponse(
    Guid Id,
    Guid AdminUsuarioId,
    string AdminEmail,
    string AdminPerfil,
    string Acao,
    string AlvoTipo,
    Guid? AlvoId,
    string? Motivo,
    string? Detalhes,
    string? Ip,
    string? UserAgent,
    string Resultado,
    DateTimeOffset CreatedAt);

public sealed record AdminCriarUsuarioRequest(
    string Nome,
    string Email,
    string? Telefone,
    string SenhaTemporaria,
    bool EmailConfirmadoPeloAdmin,
    bool EnviarLinkConfirmacao,
    bool CriarConta,
    string? NomeConta,
    string? PlanoInicial,
    string Motivo);

public sealed record AdminCriarContaRequest(
    string NomeConta,
    Guid UsuarioOwnerId,
    string PlanoInicial,
    string Motivo);

public sealed record AdminAlterarPlanoContaRequest(
    string Plano,
    string Motivo,
    bool EnviarEmail);

public sealed record AdminDiasGratisContaRequest(
    DateTimeOffset InicioAt,
    DateTimeOffset FimAt,
    string Motivo);

public sealed record AdminDiasGratisLoteRequest(
    IReadOnlyList<Guid> ContaIds,
    DateTimeOffset InicioAt,
    DateTimeOffset FimAt,
    string Motivo);

public sealed record AdminSuspenderContaRequest(
    string Motivo,
    bool EnviarEmail);

public sealed record AdminMotivoRequest(
    string Motivo);

public sealed record AdminEmailPersonalizadoRequest(
    IReadOnlyList<Guid> UsuarioIds,
    string Assunto,
    string Html,
    IReadOnlyList<AdminEmailAnexoRequest> Anexos,
    string Motivo);

public sealed record AdminEmailAnexoRequest(
    string NomeArquivo,
    string ContentType,
    string ConteudoBase64);
