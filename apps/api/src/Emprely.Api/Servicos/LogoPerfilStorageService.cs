using Amazon.S3;
using Amazon.S3.Model;
using Emprely.Api.Configuracoes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using System.Globalization;

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
        using var imagemProcessada = await LogoPerfilImageProcessor.ProcessarAsync(arquivo, cancellationToken);

        var contaSegmento = contaId.ToString("N");
        var nomeArquivo = $"{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}.webp";
        var relativeDirectory = Path.Combine("uploads", "account-logos", contaSegmento);
        var webRootPath = environment.WebRootPath
            ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        var targetDirectory = Path.Combine(webRootPath, relativeDirectory);
        var targetPath = Path.Combine(targetDirectory, nomeArquivo);

        Directory.CreateDirectory(targetDirectory);
        await using var outputStream = File.Create(targetPath);
        await imagemProcessada.Conteudo.CopyToAsync(outputStream, cancellationToken);

        return new LogoPerfilStorageResultado(
            $"/uploads/account-logos/{contaSegmento}/{nomeArquivo}",
            imagemProcessada.TamanhoOriginalBytes,
            imagemProcessada.Largura,
            imagemProcessada.Altura);
    }
}

public sealed class S3LogoPerfilStorageService : ILogoPerfilStorageService
{
    private readonly IAmazonS3 s3Client;
    private readonly LogoPerfilStorageOptions options;

    public S3LogoPerfilStorageService(
        IAmazonS3 s3Client,
        IOptions<LogoPerfilStorageOptions> options)
    {
        this.s3Client = s3Client;
        this.options = options.Value;
    }

    public async Task<LogoPerfilStorageResultado> SalvarLogoPerfilAsync(
        Guid contaId,
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        using var imagemProcessada = await LogoPerfilImageProcessor.ProcessarAsync(arquivo, cancellationToken);

        var contaSegmento = contaId.ToString("N");
        var nomeArquivo = $"{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}.webp";
        var key = BuildLogoKey(options.S3KeyPrefix, contaSegmento, nomeArquivo);

        imagemProcessada.Conteudo.Position = 0;

        var request = new PutObjectRequest
        {
            BucketName = options.S3BucketName,
            Key = key,
            InputStream = imagemProcessada.Conteudo,
            ContentType = "image/webp",
            AutoCloseStream = false,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256,
        };
        request.Metadata["account-id"] = contaId.ToString("D");
        request.Metadata["original-size-bytes"] = imagemProcessada.TamanhoOriginalBytes.ToString(CultureInfo.InvariantCulture);

        await s3Client.PutObjectAsync(request, cancellationToken);

        return new LogoPerfilStorageResultado(
            BuildPublicUrl(options.S3PublicBaseUrl!, key),
            imagemProcessada.TamanhoOriginalBytes,
            imagemProcessada.Largura,
            imagemProcessada.Altura);
    }

    private static string BuildLogoKey(
        string keyPrefix,
        string contaSegmento,
        string nomeArquivo)
    {
        var prefixoNormalizado = keyPrefix.Replace('\\', '/').Trim('/');

        if (string.IsNullOrWhiteSpace(prefixoNormalizado))
        {
            return $"{contaSegmento}/{nomeArquivo}";
        }

        return $"{prefixoNormalizado}/{contaSegmento}/{nomeArquivo}";
    }

    private static string BuildPublicUrl(string publicBaseUrl, string key)
    {
        var encodedKey = string.Join(
            "/",
            key.Split('/', StringSplitOptions.RemoveEmptyEntries)
                .Select(Uri.EscapeDataString));

        return $"{publicBaseUrl.Trim().TrimEnd('/')}/{encodedKey}";
    }
}

public sealed class DisabledLogoPerfilStorageService : ILogoPerfilStorageService
{
    public Task<LogoPerfilStorageResultado> SalvarLogoPerfilAsync(
        Guid contaId,
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        throw new LogoPerfilStorageException(
            "Upload de logomarca indisponivel neste ambiente. Use uma URL de imagem no perfil ou habilite o storage S3.");
    }
}

internal static class LogoPerfilImageProcessor
{
    private const int MaiorLadoMaximoPixels = 512;
    private const int QualidadeWebp = 84;

    private static readonly HashSet<string> ContentTypesPermitidos = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
    };

    public static async Task<LogoPerfilImagemProcessada> ProcessarAsync(
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        ValidarArquivo(arquivo);

        await using var inputStream = arquivo.OpenReadStream();
        using var imagem = await CarregarImagemAsync(inputStream, cancellationToken);

        RedimensionarImagem(imagem);

        var outputStream = new MemoryStream();
        var encoder = new WebpEncoder
        {
            Quality = QualidadeWebp,
        };

        await imagem.SaveAsWebpAsync(outputStream, encoder, cancellationToken);
        outputStream.Position = 0;

        return new LogoPerfilImagemProcessada(
            outputStream,
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

        if (arquivo.Length > LogoPerfilStorageService.TamanhoMaximoArquivoBytes)
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

internal sealed class LogoPerfilImagemProcessada : IDisposable
{
    public LogoPerfilImagemProcessada(
        Stream conteudo,
        long tamanhoOriginalBytes,
        int largura,
        int altura)
    {
        Conteudo = conteudo;
        TamanhoOriginalBytes = tamanhoOriginalBytes;
        Largura = largura;
        Altura = altura;
    }

    public Stream Conteudo { get; }
    public long TamanhoOriginalBytes { get; }
    public int Largura { get; }
    public int Altura { get; }

    public void Dispose()
    {
        Conteudo.Dispose();
    }
}
