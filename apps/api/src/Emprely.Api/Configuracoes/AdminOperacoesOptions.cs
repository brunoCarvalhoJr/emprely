namespace Emprely.Api.Configuracoes;

public sealed class AdminOperacoesOptions
{
    public const string HeaderName = "X-Emprely-Admin-Key";

    public const string SectionName = "AdminOperacoes";

    public string OperationsKey { get; init; } = string.Empty;
}

public sealed class AdminPainelOptions
{
    public const string SectionName = "AdminPainel";

    public string OwnerEmail { get; init; } = string.Empty;
}
