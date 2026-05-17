using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Emprely.Contracts.Account;
using Emprely.Contracts.Admin;
using Emprely.Contracts.Auth;
using Emprely.Contracts.Customers;
using Emprely.Contracts.Proposals;
using Emprely.Contracts.Services;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace Emprely.IntegrationTests;

public sealed class MvpFluxoApiTests : IClassFixture<EmprelyApiFactory>
{
    private const string AdminOperacoesKeyDev = "dev-only-emprely-admin-operations-key-32";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly EmprelyApiFactory factory;
    private readonly HttpClient httpClient;

    public MvpFluxoApiTests(EmprelyApiFactory factory)
    {
        this.factory = factory;
        httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Health_DeveResponderLiveEReady()
    {
        var liveResponse = await httpClient.GetAsync("/health/live");
        var readyResponse = await httpClient.GetAsync("/health/ready");

        Assert.Equal(HttpStatusCode.OK, liveResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, readyResponse.StatusCode);
        AssertHeader(liveResponse, "X-Content-Type-Options", "nosniff");
        AssertHeader(liveResponse, "X-Frame-Options", "DENY");
        AssertHeader(liveResponse, "Referrer-Policy", "no-referrer");
    }

    [Fact]
    public async Task Auth_DeveBloquearMeSemToken()
    {
        var response = await httpClient.GetAsync("/api/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Hardening_DeveAplicarRateLimitAuthQuandoExcedido()
    {
        HttpResponseMessage? ultimaRespostaPermitida = null;

        for (var tentativa = 0; tentativa < 120; tentativa++)
        {
            ultimaRespostaPermitida = await SendLoginRateLimitAsync();
        }

        var tentativaExcedente = await SendLoginRateLimitAsync();

        Assert.NotNull(ultimaRespostaPermitida);
        Assert.Equal(HttpStatusCode.Unauthorized, ultimaRespostaPermitida.StatusCode);
        Assert.Equal(HttpStatusCode.TooManyRequests, tentativaExcedente.StatusCode);
    }

    [Fact]
    public async Task FluxoMvp_DeveCriarGerarEnviarAceitarEDuplicarProposta()
    {
        var auth = await RegisterUsuarioAsync("mvp-fluxo@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        Assert.Equal("Trial", auth.Conta.Plano);
        Assert.Equal("TrialAtivo", auth.Conta.StatusComercial);

        var perfilResponse = await httpClient.GetAsync("/api/account/profile");
        Assert.Equal(HttpStatusCode.OK, perfilResponse.StatusCode);
        var perfil = await perfilResponse.Content.ReadFromJsonAsync<PerfilContaResponse>(JsonOptions)
            ?? throw new InvalidOperationException("Perfil de conta vazio inesperado.");
        Assert.Equal("Emprely Testes", perfil.NomeComercial);
        Assert.Equal("mvp-fluxo@emprely.dev", perfil.EmailContato);
        Assert.Equal("(11) 99999-9999", perfil.TelefoneContato);

        var cliente = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Bruno Carvalho",
                "bruno@emprely.dev",
                "(11) 99999-9999",
                null,
                null),
            HttpStatusCode.Created);

        var servico = await PostJsonAsync<ServicoResponse>(
            "/api/services",
            new CreateServicoRequest(
                "Site institucional",
                "Criacao de site com paginas essenciais.",
                "Web",
                2500,
                "Unico",
                "Servico"),
            HttpStatusCode.Created);

        var proposta = await PostJsonAsync<PropostaResponse>(
            "/api/proposals",
            new CreatePropostaRequest(
                cliente.Id,
                "Proposta de site institucional",
                "Diagnostico e execucao do projeto.",
                null,
                15,
                new[]
                {
                    new PropostaItemRequest(
                        servico.Id,
                        servico.Nome,
                        servico.Descricao,
                        1,
                        servico.Preco),
                }),
            HttpStatusCode.Created);

        Assert.Equal(1, proposta.Numero);
        Assert.Equal("Rascunho", proposta.Status);
        Assert.Equal(2500, proposta.Total);

        var propostaGerada = await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/generate",
            new { },
            HttpStatusCode.OK);
        Assert.Equal("Gerada", propostaGerada.Status);

        var propostaEnviada = await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/send",
            new { },
            HttpStatusCode.OK);
        Assert.Equal("Enviada", propostaEnviada.Status);

        var propostaAceita = await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/accept",
            new { },
            HttpStatusCode.OK);
        Assert.Equal("Aceita", propostaAceita.Status);

        var propostaDuplicada = await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/duplicate",
            new { },
            HttpStatusCode.Created);

        Assert.Equal(2, propostaDuplicada.Numero);
        Assert.Equal("Rascunho", propostaDuplicada.Status);
        Assert.Equal(proposta.Total, propostaDuplicada.Total);
        Assert.EndsWith(" (copia)", propostaDuplicada.Titulo, StringComparison.Ordinal);
    }

    [Fact]
    public async Task FluxoMvp_DeveRejeitarTelefoneInvalidoEBloquearGeracaoComTrialExpirado()
    {
        var auth = await RegisterUsuarioAsync("mvp-bloqueio@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var telefoneInvalidoResponse = await httpClient.PostAsJsonAsync(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Sem DDD",
                null,
                "9999",
                null,
                null));

        Assert.Equal(HttpStatusCode.BadRequest, telefoneInvalidoResponse.StatusCode);

        var cliente = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Trial",
                null,
                "11999999999",
                null,
                null),
            HttpStatusCode.Created);

        var servico = await PostJsonAsync<ServicoResponse>(
            "/api/services",
            new CreateServicoRequest(
                "Consultoria",
                null,
                null,
                500,
                "PorHora",
                "Servico"),
            HttpStatusCode.Created);

        var proposta = await PostJsonAsync<PropostaResponse>(
            "/api/proposals",
            new CreatePropostaRequest(
                cliente.Id,
                "Proposta bloqueada por trial",
                null,
                null,
                7,
                new[]
                {
                    new PropostaItemRequest(servico.Id, servico.Nome, null, 2, servico.Preco),
                }),
            HttpStatusCode.Created);

        await ExpirarTrialContaAsync(auth.Conta.Id);

        var gerarResponse = await httpClient.PostAsJsonAsync(
            $"/api/proposals/{proposta.Id}/generate",
            new { });

        Assert.Equal(HttpStatusCode.Forbidden, gerarResponse.StatusCode);
    }

    [Fact]
    public async Task PlanoFundador_DeveBloquearAutoativacaoEPermitirOperacaoAdmin()
    {
        var auth = await RegisterUsuarioAsync("mvp-admin-fundador@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var autoAtivacaoResponse = await httpClient.PostAsJsonAsync(
            "/api/account/activate-founder",
            new { });

        Assert.Equal(HttpStatusCode.Forbidden, autoAtivacaoResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;

        var semChaveResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/accounts/{auth.Conta.Id}/activate-founder",
            new { });

        Assert.Equal(HttpStatusCode.Unauthorized, semChaveResponse.StatusCode);

        using var chaveInvalidaRequest = new HttpRequestMessage(
            HttpMethod.Post,
            $"/api/admin/accounts/{auth.Conta.Id}/activate-founder")
        {
            Content = JsonContent.Create(new { }),
        };
        chaveInvalidaRequest.Headers.Add("X-Emprely-Admin-Key", "chave-admin-invalida-com-mais-de-32-caracteres");

        var chaveInvalidaResponse = await httpClient.SendAsync(chaveInvalidaRequest);

        Assert.Equal(HttpStatusCode.Forbidden, chaveInvalidaResponse.StatusCode);

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"/api/admin/accounts/{auth.Conta.Id}/activate-founder")
        {
            Content = JsonContent.Create(new { }),
        };
        request.Headers.Add("X-Emprely-Admin-Key", AdminOperacoesKeyDev);

        var adminResponse = await httpClient.SendAsync(request);
        var responseBody = await adminResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, adminResponse.StatusCode);

        var conta = JsonSerializer.Deserialize<AdminContaResponse>(responseBody, JsonOptions)
            ?? throw new InvalidOperationException("Resposta admin vazia inesperada.");

        Assert.Equal(auth.Conta.Id, conta.Id);
        Assert.Equal("Fundador", conta.Plano);
        Assert.Equal("FundadorAtivo", conta.StatusComercial);
        Assert.NotNull(conta.PlanoFundadorAtivadoAt);
    }

    [Fact]
    public async Task Auth_DeveTrocarSenhaUsuarioAtual()
    {
        const string email = "mvp-troca-senha@emprely.dev";
        const string senhaAntiga = "Senha123";
        const string senhaNova = "NovaSenha123";

        var auth = await RegisterUsuarioAsync(email);
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var senhaIncorretaResponse = await httpClient.PutAsJsonAsync(
            "/api/me/password",
            new ChangeSenhaUsuarioRequest("senha-incorreta", senhaNova, senhaNova),
            JsonOptions);

        Assert.Equal(HttpStatusCode.BadRequest, senhaIncorretaResponse.StatusCode);

        var trocaSenhaResponse = await httpClient.PutAsJsonAsync(
            "/api/me/password",
            new ChangeSenhaUsuarioRequest(senhaAntiga, senhaNova, senhaNova),
            JsonOptions);

        Assert.Equal(HttpStatusCode.NoContent, trocaSenhaResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;

        var loginSenhaAntigaResponse = await httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginUsuarioRequest(email, senhaAntiga),
            JsonOptions);

        Assert.Equal(HttpStatusCode.Unauthorized, loginSenhaAntigaResponse.StatusCode);

        var loginSenhaNova = await PostJsonAsync<AuthUsuarioResponse>(
            "/api/auth/login",
            new LoginUsuarioRequest(email, senhaNova),
            HttpStatusCode.OK);

        Assert.Equal(email, loginSenhaNova.Usuario.Email);
    }

    [Fact]
    public async Task Perfil_DeveEnviarLogoComoWebpSemGravarReferenciaAntesDoSalvar()
    {
        var auth = await RegisterUsuarioAsync("mvp-logo@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        using var content = new MultipartFormDataContent();
        using var fileContent = new ByteArrayContent(GetLogoPngTesteBytes());
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        content.Add(fileContent, "file", "logo.png");

        var response = await httpClient.PostAsync("/api/account/profile/logo", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.True(
            response.StatusCode == HttpStatusCode.OK,
            $"Status esperado: OK. Status recebido: {response.StatusCode}. Body: {responseBody}");

        var upload = JsonSerializer.Deserialize<LogoPerfilUploadResponse>(responseBody, JsonOptions)
            ?? throw new InvalidOperationException("Upload de logo vazio inesperado.");

        Assert.NotNull(upload.LogoUrl);
        Assert.StartsWith("/uploads/account-logos/", upload.LogoUrl, StringComparison.Ordinal);
        Assert.EndsWith(".webp", upload.LogoUrl, StringComparison.Ordinal);

        var perfilAntesSalvar = await GetJsonAsync<PerfilContaResponse>("/api/account/profile");

        Assert.Null(perfilAntesSalvar.LogoUrl);

        var salvarPerfilResponse = await httpClient.PutAsJsonAsync(
            "/api/account/profile",
            new UpdatePerfilContaRequest(
                perfilAntesSalvar.NomeComercial,
                perfilAntesSalvar.EmailContato,
                perfilAntesSalvar.TelefoneContato,
                perfilAntesSalvar.SiteUrl,
                perfilAntesSalvar.Instagram,
                perfilAntesSalvar.Documento,
                perfilAntesSalvar.CorPrimaria,
                perfilAntesSalvar.CorSecundaria,
                upload.LogoUrl),
            JsonOptions);
        var salvarPerfilBody = await salvarPerfilResponse.Content.ReadAsStringAsync();

        Assert.True(
            salvarPerfilResponse.StatusCode == HttpStatusCode.OK,
            $"Status esperado: OK. Status recebido: {salvarPerfilResponse.StatusCode}. Body: {salvarPerfilBody}");

        var perfilSalvo = JsonSerializer.Deserialize<PerfilContaResponse>(salvarPerfilBody, JsonOptions)
            ?? throw new InvalidOperationException("Perfil de conta salvo vazio inesperado.");

        Assert.Equal(upload.LogoUrl, perfilSalvo.LogoUrl);

        var logoResponse = await httpClient.GetAsync(upload.LogoUrl);

        Assert.Equal(HttpStatusCode.OK, logoResponse.StatusCode);
        Assert.Equal("image/webp", logoResponse.Content.Headers.ContentType?.MediaType);

        var limparPerfilResponse = await httpClient.PutAsJsonAsync(
            "/api/account/profile",
            new UpdatePerfilContaRequest(
                perfilSalvo.NomeComercial,
                perfilSalvo.EmailContato,
                perfilSalvo.TelefoneContato,
                perfilSalvo.SiteUrl,
                perfilSalvo.Instagram,
                perfilSalvo.Documento,
                perfilSalvo.CorPrimaria,
                perfilSalvo.CorSecundaria,
                null),
            JsonOptions);
        var limparPerfilBody = await limparPerfilResponse.Content.ReadAsStringAsync();

        Assert.True(
            limparPerfilResponse.StatusCode == HttpStatusCode.OK,
            $"Status esperado: OK. Status recebido: {limparPerfilResponse.StatusCode}. Body: {limparPerfilBody}");

        var perfilLimpo = JsonSerializer.Deserialize<PerfilContaResponse>(limparPerfilBody, JsonOptions)
            ?? throw new InvalidOperationException("Perfil de conta limpo vazio inesperado.");

        Assert.Null(perfilLimpo.LogoUrl);
    }

    private async Task<AuthUsuarioResponse> RegisterUsuarioAsync(string email)
    {
        return await PostJsonAsync<AuthUsuarioResponse>(
            "/api/auth/register",
            new RegisterUsuarioRequest(
                "Usuario MVP",
                email,
                "Senha123",
                "(11) 99999-9999",
                "Emprely Testes"),
            HttpStatusCode.OK);
    }

    private async Task<TResponse> PostJsonAsync<TResponse>(
        string url,
        object payload,
        HttpStatusCode expectedStatusCode)
    {
        var response = await httpClient.PostAsJsonAsync(url, payload, JsonOptions);

        var responseBody = await response.Content.ReadAsStringAsync();
        Assert.True(
            response.StatusCode == expectedStatusCode,
            $"Status esperado: {expectedStatusCode}. Status recebido: {response.StatusCode}. Body: {responseBody}");

        var responsePayload = JsonSerializer.Deserialize<TResponse>(responseBody, JsonOptions);
        return responsePayload ?? throw new InvalidOperationException("Resposta vazia inesperada.");
    }

    private async Task<TResponse> GetJsonAsync<TResponse>(string url)
    {
        var response = await httpClient.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.True(
            response.StatusCode == HttpStatusCode.OK,
            $"Status esperado: OK. Status recebido: {response.StatusCode}. Body: {responseBody}");

        var responsePayload = JsonSerializer.Deserialize<TResponse>(responseBody, JsonOptions);
        return responsePayload ?? throw new InvalidOperationException("Resposta vazia inesperada.");
    }

    private async Task<HttpResponseMessage> SendLoginRateLimitAsync()
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(
                new LoginUsuarioRequest("rate-limit@emprely.dev", "Senha123"),
                options: JsonOptions),
        };
        request.Headers.Host = "rate-limit.emprely.test";

        return await httpClient.SendAsync(request);
    }

    private async Task ExpirarTrialContaAsync(Guid contaId)
    {
        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
        var conta = await dbContext.Contas.FindAsync(contaId)
            ?? throw new InvalidOperationException("Conta de teste nao encontrada.");

        dbContext.Entry(conta)
            .Property(nameof(Conta.TrialEndsAt))
            .CurrentValue = DateTimeOffset.UtcNow.AddDays(-1);

        await dbContext.SaveChangesAsync();
    }

    private static byte[] GetLogoPngTesteBytes()
    {
        return Convert.FromBase64String(
            "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHUlEQVR4nGPMs/j/n4GBgWFp/z4QxcAEJpEAYQEAHdcEnhyjINEAAAAASUVORK5CYII=");
    }

    private static void AssertHeader(HttpResponseMessage response, string name, string expectedValue)
    {
        Assert.True(response.Headers.TryGetValues(name, out var values), $"Header {name} nao encontrado.");
        Assert.Contains(expectedValue, values);
    }
}
