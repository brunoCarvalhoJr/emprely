using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEmprely(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHealthChecks("/health");

        endpoints.MapGet("/health/live", GetLivenessEmprely)
            .WithName("GetHealthLive");

        endpoints.MapGet("/health/ready", GetReadinessEmprelyAsync)
            .WithName("GetHealthReady");

        return endpoints;
    }

    private static IResult GetLivenessEmprely(IHostEnvironment environment)
    {
        return Results.Ok(new HealthEmprelyResponse(
            "Healthy",
            "Emprely.Api",
            environment.EnvironmentName,
            DateTimeOffset.UtcNow));
    }

    private static async Task<IResult> GetReadinessEmprelyAsync(
        EmprelyDbContext dbContext,
        IHostEnvironment environment,
        CancellationToken cancellationToken)
    {
        var databaseConectado = await dbContext.Database.CanConnectAsync(cancellationToken);

        var response = new ReadinessEmprelyResponse(
            databaseConectado ? "Ready" : "Unavailable",
            "Emprely.Api",
            environment.EnvironmentName,
            databaseConectado,
            DateTimeOffset.UtcNow);

        if (databaseConectado)
        {
            return Results.Ok(response);
        }

        return Results.Json(response, statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    private sealed record HealthEmprelyResponse(
        string Status,
        string Service,
        string Environment,
        DateTimeOffset CheckedAtUtc);

    private sealed record ReadinessEmprelyResponse(
        string Status,
        string Service,
        string Environment,
        bool Database,
        DateTimeOffset CheckedAtUtc);
}
