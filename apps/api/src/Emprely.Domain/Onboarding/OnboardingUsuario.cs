using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Onboarding;

public sealed class OnboardingUsuario : EntidadeBase
{
    public const string StatusNaoIniciado = "NaoIniciado";
    public const string StatusEmAndamento = "EmAndamento";
    public const string StatusPulado = "Pulado";
    public const string StatusConcluido = "Concluido";
    public const string EtapaInicial = "boas-vindas";
    public const string EtapaTour = "tour";

    private static readonly string[] StatusValidos =
    [
        StatusNaoIniciado,
        StatusEmAndamento,
        StatusPulado,
        StatusConcluido,
    ];

    private OnboardingUsuario()
    {
        StatusConfiguracaoConta = StatusNaoIniciado;
        EtapaConfiguracaoConta = EtapaInicial;
        StatusPrimeiraProposta = StatusNaoIniciado;
        EtapaPrimeiraProposta = EtapaInicial;
        StatusTour = StatusNaoIniciado;
    }

    private OnboardingUsuario(Guid contaId, Guid usuarioId)
        : this()
    {
        ContaId = contaId;
        UsuarioId = usuarioId;
    }

    public Guid ContaId { get; private set; }

    public Guid UsuarioId { get; private set; }

    public string StatusConfiguracaoConta { get; private set; }

    public string EtapaConfiguracaoConta { get; private set; }

    public DateTimeOffset? ConfiguracaoContaIniciadaAt { get; private set; }

    public DateTimeOffset? ConfiguracaoContaPuladaAt { get; private set; }

    public DateTimeOffset? ConfiguracaoContaConcluidaAt { get; private set; }

    public string StatusPrimeiraProposta { get; private set; }

    public string EtapaPrimeiraProposta { get; private set; }

    public DateTimeOffset? PrimeiraPropostaIniciadaAt { get; private set; }

    public DateTimeOffset? PrimeiraPropostaPuladaAt { get; private set; }

    public DateTimeOffset? PrimeiraPropostaConcluidaAt { get; private set; }

    public Guid? PropostaRascunhoId { get; private set; }

    public string StatusTour { get; private set; }

    public DateTimeOffset? TourExibidoAt { get; private set; }

    public DateTimeOffset? TourPuladoAt { get; private set; }

    public DateTimeOffset? TourConcluidoAt { get; private set; }

    public Conta? Conta { get; private set; }

    public static OnboardingUsuario Create(Guid contaId, Guid usuarioId)
    {
        return new OnboardingUsuario(contaId, usuarioId);
    }

    public void Atualizar(
        string? statusConfiguracaoConta,
        string? etapaConfiguracaoConta,
        string? statusPrimeiraProposta,
        string? etapaPrimeiraProposta,
        Guid? propostaRascunhoId,
        string? statusTour)
    {
        var agora = DateTimeOffset.UtcNow;

        if (!string.IsNullOrWhiteSpace(statusConfiguracaoConta))
        {
            StatusConfiguracaoConta = NormalizarStatus(statusConfiguracaoConta);
            AtualizarTimestampsConfiguracao(agora);
        }

        if (!string.IsNullOrWhiteSpace(etapaConfiguracaoConta))
        {
            EtapaConfiguracaoConta = NormalizarEtapa(etapaConfiguracaoConta);
        }

        if (!string.IsNullOrWhiteSpace(statusPrimeiraProposta))
        {
            StatusPrimeiraProposta = NormalizarStatus(statusPrimeiraProposta);
            AtualizarTimestampsPrimeiraProposta(agora);
        }

        if (!string.IsNullOrWhiteSpace(etapaPrimeiraProposta))
        {
            EtapaPrimeiraProposta = NormalizarEtapa(etapaPrimeiraProposta);
        }

        if (propostaRascunhoId.HasValue)
        {
            PropostaRascunhoId = propostaRascunhoId;
        }

        if (!string.IsNullOrWhiteSpace(statusTour))
        {
            StatusTour = NormalizarStatus(statusTour);
            AtualizarTimestampsTour(agora);
        }

        UpdatedAt = agora;
    }

    public void MarcarConfiguracaoContaConcluida()
    {
        StatusConfiguracaoConta = StatusConcluido;
        EtapaConfiguracaoConta = "concluido";
        ConfiguracaoContaIniciadaAt ??= DateTimeOffset.UtcNow;
        ConfiguracaoContaConcluidaAt ??= DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarcarPrimeiraPropostaConcluida(Guid propostaId)
    {
        StatusPrimeiraProposta = StatusConcluido;
        EtapaPrimeiraProposta = "concluido";
        PropostaRascunhoId = propostaId;
        PrimeiraPropostaIniciadaAt ??= DateTimeOffset.UtcNow;
        PrimeiraPropostaConcluidaAt ??= DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RegistrarEvento(string tipo)
    {
        var tipoNormalizado = tipo.Trim();
        var agora = DateTimeOffset.UtcNow;

        if (tipoNormalizado.Equals("Iniciou", StringComparison.OrdinalIgnoreCase))
        {
            StatusConfiguracaoConta = StatusEmAndamento;
            ConfiguracaoContaIniciadaAt ??= agora;
        }
        else if (tipoNormalizado.Equals("Pulou", StringComparison.OrdinalIgnoreCase))
        {
            StatusConfiguracaoConta = StatusPulado;
            StatusPrimeiraProposta = StatusPulado;
            ConfiguracaoContaPuladaAt = agora;
            PrimeiraPropostaPuladaAt = agora;
        }
        else if (tipoNormalizado.Equals("ConcluiuConta", StringComparison.OrdinalIgnoreCase))
        {
            MarcarConfiguracaoContaConcluida();
        }
        else if (tipoNormalizado.Equals("TourExibido", StringComparison.OrdinalIgnoreCase))
        {
            StatusTour = StatusEmAndamento;
            TourExibidoAt ??= agora;
        }
        else if (tipoNormalizado.Equals("TourPulou", StringComparison.OrdinalIgnoreCase))
        {
            StatusTour = StatusPulado;
            TourPuladoAt = agora;
        }
        else if (tipoNormalizado.Equals("TourConcluiu", StringComparison.OrdinalIgnoreCase))
        {
            StatusTour = StatusConcluido;
            TourConcluidoAt = agora;
        }

        UpdatedAt = agora;
    }

    private void AtualizarTimestampsConfiguracao(DateTimeOffset agora)
    {
        if (StatusConfiguracaoConta == StatusEmAndamento)
        {
            ConfiguracaoContaIniciadaAt ??= agora;
        }
        else if (StatusConfiguracaoConta == StatusPulado)
        {
            ConfiguracaoContaPuladaAt = agora;
        }
        else if (StatusConfiguracaoConta == StatusConcluido)
        {
            ConfiguracaoContaIniciadaAt ??= agora;
            ConfiguracaoContaConcluidaAt ??= agora;
        }
    }

    private void AtualizarTimestampsPrimeiraProposta(DateTimeOffset agora)
    {
        if (StatusPrimeiraProposta == StatusEmAndamento)
        {
            PrimeiraPropostaIniciadaAt ??= agora;
        }
        else if (StatusPrimeiraProposta == StatusPulado)
        {
            PrimeiraPropostaPuladaAt = agora;
        }
        else if (StatusPrimeiraProposta == StatusConcluido)
        {
            PrimeiraPropostaIniciadaAt ??= agora;
            PrimeiraPropostaConcluidaAt ??= agora;
        }
    }

    private void AtualizarTimestampsTour(DateTimeOffset agora)
    {
        if (StatusTour == StatusEmAndamento)
        {
            TourExibidoAt ??= agora;
        }
        else if (StatusTour == StatusPulado)
        {
            TourPuladoAt = agora;
        }
        else if (StatusTour == StatusConcluido)
        {
            TourConcluidoAt ??= agora;
        }
    }

    private static string NormalizarStatus(string valor)
    {
        var valorNormalizado = valor.Trim();
        var status = StatusValidos.FirstOrDefault(
            statusValido => statusValido.Equals(valorNormalizado, StringComparison.OrdinalIgnoreCase));

        if (status is null)
        {
            throw new ArgumentException("Status de onboarding invalido.", nameof(valor));
        }

        return status;
    }

    private static string NormalizarEtapa(string valor)
    {
        var valorNormalizado = valor.Trim();

        if (string.IsNullOrWhiteSpace(valorNormalizado) || valorNormalizado.Length > 80)
        {
            throw new ArgumentException("Etapa de onboarding invalida.", nameof(valor));
        }

        return valorNormalizado;
    }
}
