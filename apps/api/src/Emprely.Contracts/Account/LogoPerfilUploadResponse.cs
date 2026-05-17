namespace Emprely.Contracts.Account;

public sealed record LogoPerfilUploadResponse(
    string LogoUrl,
    long TamanhoOriginalBytes,
    int Largura,
    int Altura);
