using Emprely.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Emprely.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddEmprelyInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("EmprelyDb");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'EmprelyDb' nao foi configurada.");
        }

        services.AddDbContext<EmprelyDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}
