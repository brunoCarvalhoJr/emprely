namespace Emprely.Infrastructure.Comunicacoes;

public sealed class EmailTransacionalOptions
{
    public const string SectionName = "EmailTransacional";

    public string Provider { get; init; } = "Fake";

    public string FromEmail { get; init; } = "contato@emprely.com.br";

    public string FromName { get; init; } = "Emprely";

    public string SesRegion { get; init; } = "us-east-1";

    public string SuporteDestinoEmail { get; init; } = "contato@emprely.com.br";
}
