using Amazon;
using Amazon.Lambda.AspNetCoreServer.Hosting;
using Amazon.S3;
using Emprely.Application;
using Emprely.Application.Auth;
using Emprely.Api.Auth;
using Emprely.Api.Configuracoes;
using Emprely.Api.Endpoints;
using Emprely.Api.Middleware;
using Emprely.Api.Servicos;
using Emprely.Infrastructure;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
var executandoEmLambda = !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("AWS_LAMBDA_FUNCTION_NAME"));

builder.Services.AddControllers();
builder.Services.AddEmprelyApplication();
builder.Services.AddEmprelyInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();

if (executandoEmLambda)
{
    builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
}

builder.Services.AddScoped<ICurrentContaContext, CurrentContaContext>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<CorsAplicacaoOptions>(builder.Configuration.GetSection(CorsAplicacaoOptions.SectionName));
builder.Services.Configure<AdminOperacoesOptions>(builder.Configuration.GetSection(AdminOperacoesOptions.SectionName));
builder.Services.Configure<AdminPainelOptions>(builder.Configuration.GetSection(AdminPainelOptions.SectionName));
builder.Services.Configure<RateLimitAplicacaoOptions>(builder.Configuration.GetSection(RateLimitAplicacaoOptions.SectionName));
builder.Services.Configure<LogoPerfilStorageOptions>(builder.Configuration.GetSection(LogoPerfilStorageOptions.SectionName));
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var logoPerfilStorageUsaArquivosLocais = ConfigureLogoPerfilStorage(builder.Services, builder.Configuration);

var corsOptions = builder.Configuration.GetSection(CorsAplicacaoOptions.SectionName).Get<CorsAplicacaoOptions>()
    ?? new CorsAplicacaoOptions();
var origensPermitidasCors = corsOptions.OrigensPermitidas
    .Where(origem => !string.IsNullOrWhiteSpace(origem))
    .Select(origem => origem.Trim().TrimEnd('/'))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

if (origensPermitidasCors.Length == 0)
{
    throw new InvalidOperationException("Cors:OrigensPermitidas deve ter pelo menos uma origem configurada.");
}

var rateLimitOptions = builder.Configuration.GetSection(RateLimitAplicacaoOptions.SectionName).Get<RateLimitAplicacaoOptions>()
    ?? new RateLimitAplicacaoOptions();
var rateLimitWindow = TimeSpan.FromSeconds(Math.Max(1, rateLimitOptions.WindowSeconds));
var authPermitLimit = Math.Max(1, rateLimitOptions.AuthPermitLimit);
var adminPermitLimit = Math.Max(1, rateLimitOptions.AdminPermitLimit);
var publicSupportPermitLimit = Math.Max(1, rateLimitOptions.PublicSupportPermitLimit);

builder.Services
    .AddIdentity<UsuarioAplicacao, IdentityRole<Guid>>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<EmprelyDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IPasswordHasher<Emprely.Domain.Admin.AdminUsuario>, PasswordHasher<Emprely.Domain.Admin.AdminUsuario>>();

var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("Configuracao Jwt ausente.");

if (jwtOptions.SigningKey.Length < 32)
{
    throw new InvalidOperationException("Jwt:SigningKey deve ter pelo menos 32 caracteres.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var tokenTipo = context.Principal?.FindFirstValue(JwtClaimsEmprely.TokenTipo);
                if (string.Equals(tokenTipo, JwtClaimsEmprely.AdminTokenTipo, StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                var usuarioIdValor = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                var contaIdValor = context.Principal?.FindFirstValue(JwtClaimsEmprely.ContaId);
                if (!Guid.TryParse(usuarioIdValor, out var usuarioId) ||
                    !Guid.TryParse(contaIdValor, out var contaId))
                {
                    context.Fail("Token de usuario invalido.");
                    return;
                }

                var dbContext = context.HttpContext.RequestServices.GetRequiredService<EmprelyDbContext>();
                var usuario = await dbContext.Users.FindAsync([usuarioId], context.HttpContext.RequestAborted);
                if (usuario is null ||
                    usuario.BloqueadoAdministrativamenteAt is not null ||
                    usuario.LockoutEnd > DateTimeOffset.UtcNow)
                {
                    context.Fail("Usuario bloqueado.");
                    return;
                }

                var membroConta = await dbContext.MembrosConta
                    .Include(membro => membro.Conta)
                    .FirstOrDefaultAsync(
                        membro => membro.UsuarioId == usuarioId && membro.ContaId == contaId,
                        context.HttpContext.RequestAborted);

                if (membroConta?.Conta is null ||
                    membroConta.Status != Emprely.Domain.Contas.StatusMembroConta.Ativo ||
                    membroConta.Conta.Status != Emprely.Domain.Contas.StatusConta.Ativa)
                {
                    context.Fail("Conta sem acesso ativo.");
                }
            },
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsAplicacaoOptions.PolicyName, policy =>
        policy.WithOrigins(origensPermitidasCors)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        if (context.Request.Path.StartsWithSegments("/api/auth"))
        {
            return RateLimitPartition.GetFixedWindowLimiter(
                GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.AuthPolicyName),
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = authPermitLimit,
                    Window = rateLimitWindow,
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                });
        }

        if (context.Request.Path.StartsWithSegments("/api/admin"))
        {
            return RateLimitPartition.GetFixedWindowLimiter(
                GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.AdminPolicyName),
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = adminPermitLimit,
                    Window = rateLimitWindow,
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                });
        }

        if (context.Request.Path.StartsWithSegments("/api/support/public"))
        {
            return RateLimitPartition.GetFixedWindowLimiter(
                GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.PublicSupportPolicyName),
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = publicSupportPermitLimit,
                    Window = rateLimitWindow,
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                });
        }

        return RateLimitPartition.GetNoLimiter("sem-limite");
    });
    options.AddPolicy(RateLimitAplicacaoOptions.AuthPolicyName, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.AuthPolicyName),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = authPermitLimit,
                Window = rateLimitWindow,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            }));
    options.AddPolicy(RateLimitAplicacaoOptions.AdminPolicyName, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.AdminPolicyName),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = adminPermitLimit,
                Window = rateLimitWindow,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            }));
    options.AddPolicy(RateLimitAplicacaoOptions.PublicSupportPolicyName, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            GetRateLimitPartitionKey(context, RateLimitAplicacaoOptions.PublicSupportPolicyName),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = publicSupportPermitLimit,
                Window = rateLimitWindow,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            }));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseSecurityHeadersEmprely();
app.UseCors(CorsAplicacaoOptions.PolicyName);

if (logoPerfilStorageUsaArquivosLocais)
{
    var webRootPath = app.Environment.WebRootPath
        ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
    Directory.CreateDirectory(webRootPath);

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(webRootPath),
    });
}

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthEmprely();
app.MapControllers();

app.Run();

static string GetRateLimitPartitionKey(HttpContext context, string policyName)
{
    var usuarioId = context.User.Identity?.IsAuthenticated == true
        ? context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        : null;
    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown-ip";

    return $"{policyName}|{context.Request.Host.Value}|{usuarioId ?? ip}";
}

static bool ConfigureLogoPerfilStorage(IServiceCollection services, IConfiguration configuration)
{
    var options = configuration.GetSection(LogoPerfilStorageOptions.SectionName).Get<LogoPerfilStorageOptions>()
        ?? new LogoPerfilStorageOptions();
    var provider = options.Provider.Trim();
    var executandoEmLambda = !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("AWS_LAMBDA_FUNCTION_NAME"));

    if (string.Equals(provider, LogoPerfilStorageOptions.ProviderLocal, StringComparison.OrdinalIgnoreCase))
    {
        if (executandoEmLambda)
        {
            throw new InvalidOperationException(
                "LogoPerfilStorage:Provider=Local nao pode ser usado em AWS Lambda. Configure S3 ou Disabled.");
        }

        services.AddScoped<ILogoPerfilStorageService, LogoPerfilStorageService>();
        return true;
    }

    if (string.Equals(provider, LogoPerfilStorageOptions.ProviderS3, StringComparison.OrdinalIgnoreCase))
    {
        if (string.IsNullOrWhiteSpace(options.S3BucketName))
        {
            throw new InvalidOperationException("LogoPerfilStorage:S3BucketName deve ser configurado quando Provider=S3.");
        }

        if (string.IsNullOrWhiteSpace(options.S3PublicBaseUrl))
        {
            throw new InvalidOperationException("LogoPerfilStorage:S3PublicBaseUrl deve ser configurado quando Provider=S3.");
        }

        services.AddSingleton<IAmazonS3>(_ => CreateS3Client(options));
        services.AddScoped<ILogoPerfilStorageService, S3LogoPerfilStorageService>();
        return false;
    }

    if (string.Equals(provider, LogoPerfilStorageOptions.ProviderDisabled, StringComparison.OrdinalIgnoreCase))
    {
        services.AddScoped<ILogoPerfilStorageService, DisabledLogoPerfilStorageService>();
        return false;
    }

    throw new InvalidOperationException(
        "LogoPerfilStorage:Provider deve ser Local, S3 ou Disabled.");
}

static IAmazonS3 CreateS3Client(LogoPerfilStorageOptions options)
{
    if (!string.IsNullOrWhiteSpace(options.S3Region))
    {
        return new AmazonS3Client(RegionEndpoint.GetBySystemName(options.S3Region.Trim()));
    }

    return new AmazonS3Client();
}

public partial class Program;
