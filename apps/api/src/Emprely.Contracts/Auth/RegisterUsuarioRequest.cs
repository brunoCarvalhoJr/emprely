using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record RegisterUsuarioRequest(
    [Required, MaxLength(160)] string Nome,
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MinLength(8)] string Senha,
    [Required, MaxLength(160)] string NomeConta);
