using Emprely.Domain.Common;

namespace Emprely.Domain.Contas;

public sealed class MembroConta : EntidadeBase
{
    private MembroConta()
    {
        Papel = PapelMembroConta.Member;
        Status = StatusMembroConta.Ativo;
    }

    private MembroConta(Guid contaId, Guid usuarioId, PapelMembroConta papel)
    {
        ContaId = contaId;
        UsuarioId = usuarioId;
        Papel = papel;
        Status = StatusMembroConta.Ativo;
    }

    public Guid ContaId { get; private set; }

    public Guid UsuarioId { get; private set; }

    public PapelMembroConta Papel { get; private set; }

    public StatusMembroConta Status { get; private set; }

    public Conta? Conta { get; private set; }

    public static MembroConta CreateOwner(Guid contaId, Guid usuarioId)
    {
        return new MembroConta(contaId, usuarioId, PapelMembroConta.Owner);
    }
}
