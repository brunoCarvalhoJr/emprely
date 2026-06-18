using Emprely.Application.Comunicacoes;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.DataProtection;
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

        services.AddDataProtection()
            .SetApplicationName("Emprely")
            .PersistKeysToDbContext<EmprelyDbContext>();

        services.Configure<AppPublicOptions>(configuration.GetSection(AppPublicOptions.SectionName));
        services.Configure<EmailTransacionalOptions>(configuration.GetSection(EmailTransacionalOptions.SectionName));
        services.AddScoped<IEmailTransacionalService, EmailTransacionalService>();

        return services;
    }
}
