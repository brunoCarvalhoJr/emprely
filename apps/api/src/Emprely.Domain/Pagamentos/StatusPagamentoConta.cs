namespace Emprely.Domain.Pagamentos;

public enum StatusPagamentoConta
{
    Criado = 1,
    AguardandoPagamento = 2,
    EmAnalise = 3,
    Confirmado = 4,
    Recebido = 5,
    Vencido = 6,
    Falhou = 7,
    Cancelado = 8,
    ReembolsadoParcial = 9,
    Reembolsado = 10,
}
