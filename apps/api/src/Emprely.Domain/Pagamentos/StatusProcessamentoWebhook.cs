namespace Emprely.Domain.Pagamentos;

public enum StatusProcessamentoWebhook
{
    Recebido = 1,
    Processado = 2,
    Erro = 3,
    Ignorado = 4,
    EmProcessamento = 5,
}
