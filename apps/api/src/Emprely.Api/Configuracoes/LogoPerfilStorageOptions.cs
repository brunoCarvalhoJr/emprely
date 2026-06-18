namespace Emprely.Api.Configuracoes;

public sealed class LogoPerfilStorageOptions
{
    public const string SectionName = "LogoPerfilStorage";
    public const string ProviderLocal = "Local";
    public const string ProviderS3 = "S3";
    public const string ProviderDisabled = "Disabled";

    public string Provider { get; init; } = ProviderLocal;
    public string? S3BucketName { get; init; }
    public string S3KeyPrefix { get; init; } = "uploads/account-logos";
    public string? S3PublicBaseUrl { get; init; }
    public string? S3Region { get; init; }
}
