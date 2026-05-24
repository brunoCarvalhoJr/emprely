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
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEmprelyApplication();
builder.Services.AddEmprelyInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentContaContext, CurrentContaContext>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<ILogoPerfilStorageService, LogoPerfilStorageService>();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<CorsAplicacaoOptions>(builder.Configuration.GetSection(CorsAplicacaoOptions.SectionName));
builder.Services.Configure<AdminOperacoesOptions>(builder.Configuration.GetSection(AdminOperacoesOptions.SectionName));
builder.Services.Configure<RateLimitAplicacaoOptions>(builder.Configuration.GetSection(RateLimitAplicacaoOptions.SectionName));

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
});

var app = builder.Build();
var webRootPath = app.Environment.WebRootPath
    ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRootPath);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseSecurityHeadersEmprely();
app.UseCors(CorsAplicacaoOptions.PolicyName);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath),
});
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

public partial class Program;
