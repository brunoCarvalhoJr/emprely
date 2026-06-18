namespace Emprely.Infrastructure.Comunicacoes;

public sealed class AppPublicOptions
{
    public const string SectionName = "App";

    public string PublicWebUrl { get; init; } = "https://app.emprely.com.br";
}
