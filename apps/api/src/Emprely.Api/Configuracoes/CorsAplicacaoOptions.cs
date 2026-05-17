namespace Emprely.Api.Configuracoes;

public sealed class CorsAplicacaoOptions
{
    public const string PolicyName = "WebApp";

    public const string SectionName = "Cors";

    public string[] OrigensPermitidas { get; init; } = [];
}
