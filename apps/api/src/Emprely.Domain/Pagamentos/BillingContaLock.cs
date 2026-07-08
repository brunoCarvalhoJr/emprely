using Emprely.Domain.Common;

namespace Emprely.Domain.Pagamentos;

public sealed class BillingContaLock : EntidadeBase
{
    private BillingContaLock()
    {
    }

    private BillingContaLock(Guid contaId)
    {
        ContaId = contaId;
        TouchedAt = DateTimeOffset.UtcNow;
    }

    public Guid ContaId { get; private set; }

    public DateTimeOffset TouchedAt { get; private set; }

    public static BillingContaLock Create(Guid contaId)
    {
        return new BillingContaLock(contaId);
    }

    public void Touch()
    {
        TouchedAt = DateTimeOffset.UtcNow;
        UpdatedAt = TouchedAt;
    }
}
