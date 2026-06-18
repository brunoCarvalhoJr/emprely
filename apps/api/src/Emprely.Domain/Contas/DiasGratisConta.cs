using Emprely.Domain.Common;

namespace Emprely.Domain.Contas;

public sealed class DiasGratisConta : EntidadeBase
{
    private DiasGratisConta()
    {
        Motivo = string.Empty;
    }

    private DiasGratisConta(Guid contaId, DateTimeOffset inicioAt, DateTimeOffset fimAt, string motivo)
    {
        ContaId = contaId;
        InicioAt = inicioAt;
        FimAt = fimAt;
        Motivo = motivo.Trim();
    }

    public Guid ContaId { get; private set; }

    public DateTimeOffset InicioAt { get; private set; }

    public DateTimeOffset FimAt { get; private set; }

    public string Motivo { get; private set; }

    public Guid? CriadoPorAdminId { get; private set; }

    public Conta? Conta { get; private set; }

    public static DiasGratisConta Create(
        Guid contaId,
        DateTimeOffset inicioAt,
        DateTimeOffset fimAt,
        string motivo,
        Guid? criadoPorAdminId)
    {
        if (fimAt <= inicioAt)
        {
            throw new ArgumentException("Data final dos dias gratis deve ser posterior a data inicial.");
        }

        if (string.IsNullOrWhiteSpace(motivo))
        {
            throw new ArgumentException("Motivo dos dias gratis e obrigatorio.", nameof(motivo));
        }

        var diasGratis = new DiasGratisConta(contaId, inicioAt, fimAt, motivo)
        {
            CriadoPorAdminId = criadoPorAdminId,
        };

        return diasGratis;
    }

    public bool IsAtivo(DateTimeOffset agora)
    {
        return InicioAt <= agora && FimAt > agora;
    }
}
