using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Emprely.Api.Auth;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions options;

    public JwtTokenService(IOptions<JwtOptions> options)
    {
        this.options = options.Value;
    }

    public JwtTokenResult GenerateTokenUsuario(
        Guid usuarioId,
        string nome,
        string email,
        Guid contaId,
        string papel)
    {
        if (options.SigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey deve ter pelo menos 32 caracteres.");
        }

        var expiresAtUtc = DateTimeOffset.UtcNow.AddMinutes(options.ExpirationMinutes);
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, usuarioId.ToString()),
            new(ClaimTypes.NameIdentifier, usuarioId.ToString()),
            new(ClaimTypes.Name, nome),
            new(ClaimTypes.Email, email),
            new(JwtClaimsEmprely.ContaId, contaId.ToString()),
            new(JwtClaimsEmprely.Papel, papel),
        };

        var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Audience,
            claims: claims,
            expires: expiresAtUtc.UtcDateTime,
            signingCredentials: credentials);

        return new JwtTokenResult(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAtUtc);
    }
}
