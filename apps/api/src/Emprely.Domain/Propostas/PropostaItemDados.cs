namespace Emprely.Domain.Propostas;

public sealed record PropostaItemDados(
    Guid? ServicoId,
    string Nome,
    string? Descricao,
    decimal Quantidade,
    decimal ValorUnitario);
