using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Emprely.Api.Servicos;

public interface ILogoPerfilStorageService
{
    Task<LogoPerfilStorageResultado> SalvarLogoPerfilAsync(
        Guid contaId,
        IFormFile arquivo,
        CancellationToken cancellationToken);
}

public sealed record LogoPerfilStorageResultado(
    string LogoUrl,
    long TamanhoOriginalBytes,
    int Largura,
    int Altura);

public sealed class LogoPerfilStorageException : Exception
{
    public LogoPerfilStorageException(string message)
        : base(message)
    {
    }
}

public sealed class LogoPerfilStorageService : ILogoPerfilStorageService
{
    public const long TamanhoMaximoArquivoBytes = 2 * 1024 * 1024;

    private const int MaiorLadoMaximoPixels = 512;
    private const int QualidadeWebp = 84;

    private static readonly HashSet<string> ContentTypesPermitidos = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
    };

    private readonly IWebHostEnvironment environment;

    public LogoPerfilStorageService(IWebHostEnvironment environment)
    {
        this.environment = environment;
    }

    public async Task<LogoPerfilStorageResultado> SalvarLogoPerfilAsync(
        Guid contaId,
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        ValidarArquivo(arquivo);

        await using var inputStream = arquivo.OpenReadStream();
        using var imagem = await CarregarImagemAsync(inputStream, cancellationToken);

        RedimensionarImagem(imagem);

        var contaSegmento = contaId.ToString("N");
        var nomeArquivo = $"{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}.webp";
        var relativeDirectory = Path.Combine("uploads", "account-logos", contaSegmento);
        var webRootPath = environment.WebRootPath
            ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        var targetDirectory = Path.Combine(webRootPath, relativeDirectory);
        var targetPath = Path.Combine(targetDirectory, nomeArquivo);

        Directory.CreateDirectory(targetDirectory);

        var encoder = new WebpEncoder
        {
            Quality = QualidadeWebp,
        };

        await imagem.SaveAsWebpAsync(targetPath, encoder, cancellationToken);

        return new LogoPerfilStorageResultado(
            $"/uploads/account-logos/{contaSegmento}/{nomeArquivo}",
            arquivo.Length,
            imagem.Width,
            imagem.Height);
    }

    private static void ValidarArquivo(IFormFile arquivo)
    {
        if (arquivo.Length <= 0)
        {
            throw new LogoPerfilStorageException("Anexe uma imagem valida para usar como logomarca.");
        }

        if (arquivo.Length > TamanhoMaximoArquivoBytes)
        {
            throw new LogoPerfilStorageException("A logomarca deve ter no maximo 2 MB.");
        }

        if (!ContentTypesPermitidos.Contains(arquivo.ContentType))
        {
            throw new LogoPerfilStorageException("Use uma imagem PNG, JPG ou WebP para a logomarca.");
        }
    }

    private static async Task<Image> CarregarImagemAsync(
        Stream inputStream,
        CancellationToken cancellationToken)
    {
        try
        {
            return await Image.LoadAsync(inputStream, cancellationToken);
        }
        catch (Exception exception) when (
            exception is UnknownImageFormatException ||
            exception is InvalidImageContentException ||
            exception is NotSupportedException)
        {
            throw new LogoPerfilStorageException("Nao foi possivel processar a imagem enviada.");
        }
    }

    private static void RedimensionarImagem(Image imagem)
    {
        var maiorLado = Math.Max(imagem.Width, imagem.Height);

        if (maiorLado <= MaiorLadoMaximoPixels)
        {
            return;
        }

        var escala = MaiorLadoMaximoPixels / (double)maiorLado;
        var largura = Math.Max(1, (int)Math.Round(imagem.Width * escala));
        var altura = Math.Max(1, (int)Math.Round(imagem.Height * escala));

        imagem.Mutate(context => context.Resize(largura, altura));
    }
}
