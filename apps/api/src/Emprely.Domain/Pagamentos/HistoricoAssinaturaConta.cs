using Emprely.Domain.Common;

namespace Emprely.Domain.Pagamentos;

public sealed class HistoricoAssinaturaConta : EntidadeBase
{
    private HistoricoAssinaturaConta()
    {
        Evento = string.Empty;
    }

    private HistoricoAssinaturaConta(
        Guid contaId,
        Guid? assinaturaContaId,
        Guid? pagamentoContaId,
        string evento,
        string? detalhes)
    {
        ContaId = contaId;
        AssinaturaContaId = assinaturaContaId;
        PagamentoContaId = pagamentoContaId;
        Evento = evento;
        Detalhes = detalhes;
    }

    public Guid ContaId { get; private set; }

    public Guid? AssinaturaContaId { get; private set; }

    public Guid? PagamentoContaId { get; private set; }

    public string Evento { get; private set; }

    public string? Detalhes { get; private set; }

    public static HistoricoAssinaturaConta Create(
        Guid contaId,
        Guid? assinaturaContaId,
        Guid? pagamentoContaId,
        string evento,
        string? detalhes = null)
    {
        return new HistoricoAssinaturaConta(contaId, assinaturaContaId, pagamentoContaId, evento, detalhes);
    }
}
