using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Emprely.Infrastructure.Persistence;

public sealed class EmprelyDbContextFactory : IDesignTimeDbContextFactory<EmprelyDbContext>
{
    public EmprelyDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<EmprelyDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev")
            .Options;

        return new EmprelyDbContext(options);
    }
}
