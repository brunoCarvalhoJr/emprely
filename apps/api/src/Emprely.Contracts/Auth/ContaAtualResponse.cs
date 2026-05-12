namespace Emprely.Contracts.Auth;

public sealed record ContaAtualResponse(
    Guid Id,
    string Nome,
    string Slug,
    string Papel);
