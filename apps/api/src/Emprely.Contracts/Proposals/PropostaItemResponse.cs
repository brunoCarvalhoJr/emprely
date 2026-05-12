namespace Emprely.Contracts.Proposals;

public sealed record PropostaItemResponse(
    Guid Id,
    Guid? ServicoId,
    string Nome,
    string? Descricao,
    decimal Quantidade,
    decimal ValorUnitario,
    decimal Total,
    int Ordem);
