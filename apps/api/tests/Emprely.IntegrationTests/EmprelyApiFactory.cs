using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace Emprely.IntegrationTests;

public sealed class EmprelyApiFactory : WebApplicationFactory<Program>
{
    private static readonly ServiceProvider InMemoryServiceProvider = new ServiceCollection()
        .AddEntityFrameworkInMemoryDatabase()
        .BuildServiceProvider();

    private readonly string databaseName = $"emprely-integracao-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureTestServices(services =>
        {
            var dbContextOptions = services
                .Where(descriptor =>
                    descriptor.ServiceType == typeof(DbContextOptions) ||
                    descriptor.ServiceType == typeof(DbContextOptions<EmprelyDbContext>))
                .ToList();

            foreach (var descriptor in dbContextOptions)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<EmprelyDbContext>(options =>
                options
                    .UseInMemoryDatabase(databaseName)
                    .UseInternalServiceProvider(InMemoryServiceProvider)
                    .ConfigureWarnings(warnings =>
                        warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)));

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
        });
    }
}
