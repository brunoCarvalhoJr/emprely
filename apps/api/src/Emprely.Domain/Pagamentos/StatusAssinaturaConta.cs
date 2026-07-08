namespace Emprely.Domain.Pagamentos;

public enum StatusAssinaturaConta
{
    AguardandoPagamento = 1,
    PagamentoEmAnalise = 2,
    Ativa = 3,
    Inadimplente = 4,
    CancelamentoAgendado = 5,
    Cancelada = 6,
    Suspensa = 7,
    Reembolsada = 8,
}
