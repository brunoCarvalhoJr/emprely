using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record RegisterUsuarioRequest(
    [property: Required, MaxLength(160)] string Nome,
    [property: Required, EmailAddress, MaxLength(256)] string Email,
    [property: Required, MinLength(8)] string Senha,
    [property: Required, MaxLength(160)] string NomeConta);
