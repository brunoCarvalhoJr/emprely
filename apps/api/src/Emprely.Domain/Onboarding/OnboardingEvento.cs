using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Onboarding;

public sealed class OnboardingEvento : EntidadeBase
{
    private OnboardingEvento()
    {
        Tipo = string.Empty;
    }

    private OnboardingEvento(
        Guid contaId,
        Guid usuarioId,
        string tipo,
        string? etapa,
        Guid? propostaId)
    {
        ContaId = contaId;
        UsuarioId = usuarioId;
        Tipo = NormalizarObrigatorio(tipo, nameof(tipo));
        Etapa = NormalizarOpcional(etapa);
        PropostaId = propostaId;
    }

    public Guid ContaId { get; private set; }

    public Guid UsuarioId { get; private set; }

    public string Tipo { get; private set; }

    public string? Etapa { get; private set; }

    public Guid? PropostaId { get; private set; }

    public Conta? Conta { get; private set; }

    public static OnboardingEvento Create(
        Guid contaId,
        Guid usuarioId,
        string tipo,
        string? etapa = null,
        Guid? propostaId = null)
    {
        return new OnboardingEvento(contaId, usuarioId, tipo, etapa, propostaId);
    }

    private static string NormalizarObrigatorio(string valor, string nomeParametro)
    {
        var valorNormalizado = valor.Trim();

        if (string.IsNullOrWhiteSpace(valorNormalizado))
        {
            throw new ArgumentException("Valor obrigatorio.", nomeParametro);
        }

        return valorNormalizado;
    }

    private static string? NormalizarOpcional(string? valor)
    {
        var valorNormalizado = valor?.Trim();
        return string.IsNullOrWhiteSpace(valorNormalizado) ? null : valorNormalizado;
    }
}
