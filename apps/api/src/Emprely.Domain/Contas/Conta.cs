using Emprely.Domain.Common;
using Emprely.Domain.Clientes;
using Emprely.Domain.Propostas;
using Emprely.Domain.Servicos;

namespace Emprely.Domain.Contas;

public sealed class Conta : EntidadeBase
{
    public const int TrialDias = 7;

    private Conta()
    {
        Nome = string.Empty;
        Slug = string.Empty;
        Status = StatusConta.Ativa;
        Plano = PlanoConta.Trial;
        TrialEndsAt = CreatedAt.AddDays(TrialDias);
    }

    private Conta(string nome, string slug)
    {
        Nome = nome;
        Slug = slug;
        Status = StatusConta.Ativa;
        Plano = PlanoConta.Trial;
        TrialEndsAt = CreatedAt.AddDays(TrialDias);
    }

    public string Nome { get; private set; }

    public string Slug { get; private set; }

    public StatusConta Status { get; private set; }

    public PlanoConta Plano { get; private set; }

    public DateTimeOffset TrialEndsAt { get; private set; }

    public DateTimeOffset? PlanoFundadorAtivadoAt { get; private set; }

    public ICollection<MembroConta> Membros { get; private set; } = new List<MembroConta>();

    public PerfilConta? Perfil { get; private set; }

    public ICollection<Cliente> Clientes { get; private set; } = new List<Cliente>();

    public ICollection<Servico> Servicos { get; private set; } = new List<Servico>();

    public ICollection<Proposta> Propostas { get; private set; } = new List<Proposta>();

    public static Conta CreateConta(string nome)
    {
        var nomeNormalizado = nome.Trim();

        if (string.IsNullOrWhiteSpace(nomeNormalizado))
        {
            throw new ArgumentException("Nome da conta e obrigatorio.", nameof(nome));
        }

        return new Conta(nomeNormalizado, BuildSlugConta(nomeNormalizado));
    }

    public void ActivatePlanoFundador()
    {
        if (Plano == PlanoConta.Fundador)
        {
            return;
        }

        var agora = DateTimeOffset.UtcNow;
        Plano = PlanoConta.Fundador;
        PlanoFundadorAtivadoAt = agora;
        UpdatedAt = agora;
    }

    public bool IsTrialAtivo(DateTimeOffset agora)
    {
        return Plano == PlanoConta.Trial && TrialEndsAt > agora;
    }

    public int GetDiasRestantesTrial(DateTimeOffset agora)
    {
        if (!IsTrialAtivo(agora))
        {
            return 0;
        }

        return Math.Max(0, (int)Math.Ceiling((TrialEndsAt - agora).TotalDays));
    }

    public StatusComercialConta GetStatusComercialConta(DateTimeOffset agora)
    {
        if (Plano == PlanoConta.Fundador)
        {
            return StatusComercialConta.FundadorAtivo;
        }

        return IsTrialAtivo(agora)
            ? StatusComercialConta.TrialAtivo
            : StatusComercialConta.TrialExpirado;
    }

    public bool CanGenerateProposta(DateTimeOffset agora)
    {
        return Plano == PlanoConta.Fundador || IsTrialAtivo(agora);
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
