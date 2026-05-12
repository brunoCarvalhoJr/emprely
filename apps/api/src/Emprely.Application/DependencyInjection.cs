using Microsoft.Extensions.DependencyInjection;

namespace Emprely.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddEmprelyApplication(this IServiceCollection services)
    {
        return services;
    }
}
