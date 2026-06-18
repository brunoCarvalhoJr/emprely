namespace Emprely.Domain.Comunicacoes;

public enum StatusEmailTransacional
{
    Pendente = 1,
    Enviado = 2,
    Falhou = 3,
    Bounce = 4,
    Complaint = 5,
    Suprimido = 6,
}
