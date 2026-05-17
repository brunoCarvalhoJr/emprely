using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Emprely.Infrastructure.Persistence;

public sealed class EmprelyDbContextDesignTimeFactory : IDesignTimeDbContextFactory<EmprelyDbContext>
{
    private const string LocalDevConnectionString =
        "Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev";

    public EmprelyDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__EmprelyDb")
            ?? Environment.GetEnvironmentVariable("EMPRELY_DB_CONNECTION")
            ?? LocalDevConnectionString;

        var options = new DbContextOptionsBuilder<EmprelyDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new EmprelyDbContext(options);
    }
}
