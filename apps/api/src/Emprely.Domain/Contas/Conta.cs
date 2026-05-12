using Emprely.Domain.Common;

namespace Emprely.Domain.Contas;

public sealed class Conta : EntidadeBase
{
    private Conta()
    {
        Nome = string.Empty;
        Slug = string.Empty;
        Status = StatusConta.Ativa;
    }

    private Conta(string nome, string slug)
    {
        Nome = nome;
        Slug = slug;
        Status = StatusConta.Ativa;
    }

    public string Nome { get; private set; }

    public string Slug { get; private set; }

    public StatusConta Status { get; private set; }

    public ICollection<MembroConta> Membros { get; private set; } = new List<MembroConta>();

    public PerfilConta? Perfil { get; private set; }

    public static Conta CreateConta(string nome)
    {
        var nomeNormalizado = nome.Trim();

        if (string.IsNullOrWhiteSpace(nomeNormalizado))
        {
            throw new ArgumentException("Nome da conta e obrigatorio.", nameof(nome));
        }

        return new Conta(nomeNormalizado, BuildSlugConta(nomeNormalizado));
    }

    private static string BuildSlugConta(string nome)
    {
        var slugBase = new string(
            nome.Trim()
                .ToLowerInvariant()
                .Select(caractere => char.IsLetterOrDigit(caractere) ? caractere : '-')
                .ToArray());

        slugBase = string.Join('-', slugBase.Split('-', StringSplitOptions.RemoveEmptyEntries));

        if (string.IsNullOrWhiteSpace(slugBase))
        {
            slugBase = "conta";
        }

        return $"{slugBase}-{Guid.NewGuid():N}"[..Math.Min(slugBase.Length + 9, 64)];
    }
}
