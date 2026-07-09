using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Emprely.Contracts.Account;
using Emprely.Contracts.Admin;
using Emprely.Contracts.Auth;
using Emprely.Contracts.Customers;
using Emprely.Contracts.Onboarding;
using Emprely.Contracts.Proposals;
using Emprely.Contracts.Services;
using Emprely.Contracts.Suporte;
using Emprely.Domain.Admin;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
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
    public async Task SuportePublico_DeveAceitarContatoSemTokenERegistrarEmail()
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/support/public")
        {
            Content = JsonContent.Create(
                new CreateContatoPublicoRequest(
                    "Bruno Carvalho",
                    "lead@emprely.dev",
                    "(11) 99999-9999",
                    "Emprely Lead",
                    "plano-fundador",
                    "Quero conversar sobre o Plano Fundador."),
                options: JsonOptions),
        };
        request.Headers.Host = "suporte-publico.emprely.test";

        var response = await httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.True(
            response.StatusCode == HttpStatusCode.OK,
            $"Status esperado: OK. Status recebido: {response.StatusCode}. Body: {responseBody}");

        var payload = JsonSerializer.Deserialize<ContatoPublicoResponse>(responseBody, JsonOptions)
            ?? throw new InvalidOperationException("Resposta de contato publico vazia inesperada.");

        Assert.Equal("Recebemos sua mensagem.", payload.Mensagem);

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
        var emailContato = dbContext.EmailsTransacionais
            .OrderByDescending(email => email.CreatedAt)
            .FirstOrDefault(email =>
                email.Tipo == TipoEmailTransacional.SuporteRecebido &&
                email.Destinatario == "contato@emprely.com.br" &&
                email.ContaId == null &&
                email.UsuarioId == null);

        Assert.NotNull(emailContato);
        Assert.Equal(StatusEmailTransacional.Enviado, emailContato.Status);
        Assert.Contains("plano-fundador", emailContato.Assunto, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task AdminPainel_DeveLogarSuperAdminCriarUsuarioEBloquearAcesso()
    {
        await CriarAdminDiretoAsync("Bruno Carvalho", "Bruno.jr.ti@hotmail.com", "Senha123", PerfilAdminUsuario.SuperAdmin);

        var adminAuth = await PostJsonAsync<AdminLoginResponse>(
            "/api/admin/auth/login",
            new AdminLoginRequest("Bruno.jr.ti@hotmail.com", "Senha123"),
            HttpStatusCode.OK);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminAuth.AccessToken);

        var suporteAdmin = await PostJsonAsync<AdminPainelAdminResponse>(
            "/api/admin/admins",
            new AdminCriarAdminRequest(
                "Suporte Emprely",
                "suporte-admin@emprely.dev",
                "Senha123",
                "Suporte",
                "Teste de criacao de admin suporte"),
            HttpStatusCode.Created);

        Assert.Equal("Suporte", suporteAdmin.Perfil);

        var admins = await GetJsonAsync<IReadOnlyList<AdminPainelAdminResponse>>("/api/admin/admins");
        Assert.Contains(admins, admin => admin.Email == "suporte-admin@emprely.dev");

        httpClient.DefaultRequestHeaders.Authorization = null;
        var suporteAuth = await PostJsonAsync<AdminLoginResponse>(
            "/api/admin/auth/login",
            new AdminLoginRequest("suporte-admin@emprely.dev", "Senha123"),
            HttpStatusCode.OK);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", suporteAuth.AccessToken);
        var suporteListarAdminsResponse = await httpClient.GetAsync("/api/admin/admins");
        Assert.Equal(HttpStatusCode.Forbidden, suporteListarAdminsResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminAuth.AccessToken);

        var usuario = await PostJsonAsync<AdminUsuarioResumoResponse>(
            "/api/admin/usuarios",
            new AdminCriarUsuarioRequest(
                "Usuario Admin Criado",
                "admin-criado@emprely.dev",
                "(11) 98888-7777",
                "Senha123",
                EmailConfirmadoPeloAdmin: true,
                EnviarLinkConfirmacao: false,
                CriarConta: true,
                "Conta Admin Criada",
                "Trial",
                "Teste de criacao administrativa"),
            HttpStatusCode.OK);

        Assert.NotNull(usuario.ContaId);
        Assert.Equal("Trial", usuario.Plano);

        var painel = await GetJsonAsync<AdminUsuariosPainelResponse>("/api/admin/usuarios?busca=admin-criado");
        Assert.Contains(painel.Usuarios, usuarioAtual => usuarioAtual.Email == "admin-criado@emprely.dev");

        var usuarioSemConta = await PostJsonAsync<AdminUsuarioResumoResponse>(
            "/api/admin/usuarios",
            new AdminCriarUsuarioRequest(
                "Usuario Sem Conta",
                "usuario-sem-conta@emprely.dev",
                null,
                "Senha123",
                EmailConfirmadoPeloAdmin: true,
                EnviarLinkConfirmacao: false,
                CriarConta: false,
                null,
                null,
                "Teste de usuario sem conta"),
            HttpStatusCode.OK);

        Assert.Null(usuarioSemConta.ContaId);

        var painelSemConta = await GetJsonAsync<AdminUsuariosPainelResponse>("/api/admin/usuarios?semConta=true");
        Assert.Contains(painelSemConta.Usuarios, usuarioAtual => usuarioAtual.Email == "usuario-sem-conta@emprely.dev");

        var contaCriada = await PostJsonAsync<AdminContaCriadaResponse>(
            "/api/admin/contas",
            new AdminCriarContaRequest(
                "Conta Usuario Existente",
                usuarioSemConta.Id,
                "Trial",
                "Teste de criacao de conta para usuario existente"),
            HttpStatusCode.OK);

        Assert.Equal(usuarioSemConta.Id, contaCriada.UsuarioOwnerId);
        Assert.Equal("Trial", contaCriada.Plano);

        var inicioDiasGratis = DateTimeOffset.UtcNow.AddMinutes(-5);
        var fimDiasGratis = DateTimeOffset.UtcNow.AddDays(3);
        var diasGratisResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/contas/{contaCriada.ContaId}/dias-gratis",
            new AdminDiasGratisContaRequest(inicioDiasGratis, fimDiasGratis, "Teste de filtro dias gratis"),
            JsonOptions);
        Assert.Equal(HttpStatusCode.NoContent, diasGratisResponse.StatusCode);

        var diasGratisInvalidoResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/contas/{contaCriada.ContaId}/dias-gratis",
            new { motivo = "Payload sem datas nao deve gerar erro interno" },
            JsonOptions);
        Assert.Equal(HttpStatusCode.BadRequest, diasGratisInvalidoResponse.StatusCode);
        Assert.Contains("inicio e fim", await diasGratisInvalidoResponse.Content.ReadAsStringAsync());

        var painelDiasGratis = await GetJsonAsync<AdminUsuariosPainelResponse>("/api/admin/usuarios?diasGratisAtivo=true");
        Assert.Contains(painelDiasGratis.Usuarios, usuarioAtual => usuarioAtual.Id == usuarioSemConta.Id && usuarioAtual.DiasGratisAtivo);

        var bloquearResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/usuarios/{usuario.Id}/bloquear",
            new AdminMotivoRequest("Bloqueio administrativo de teste"),
            JsonOptions);
        Assert.Equal(HttpStatusCode.NoContent, bloquearResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;
        var loginBloqueadoResponse = await httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginUsuarioRequest("admin-criado@emprely.dev", "Senha123"),
            JsonOptions);

        Assert.Equal(HttpStatusCode.Forbidden, loginBloqueadoResponse.StatusCode);
        Assert.Contains("Conta Bloqueada", await loginBloqueadoResponse.Content.ReadAsStringAsync());

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminAuth.AccessToken);
        var suspenderResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/contas/{contaCriada.ContaId}/suspender",
            new AdminSuspenderContaRequest("Suspensao administrativa de teste", EnviarEmail: false),
            JsonOptions);
        Assert.Equal(HttpStatusCode.NoContent, suspenderResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;
        var loginSuspensoResponse = await httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginUsuarioRequest("usuario-sem-conta@emprely.dev", "Senha123"),
            JsonOptions);

        Assert.Equal(HttpStatusCode.Forbidden, loginSuspensoResponse.StatusCode);
        Assert.Contains("Conta Suspensa", await loginSuspensoResponse.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task AdminAuth_DeveAlterarPropriaSenhaComSenhaAtual()
    {
        await CriarAdminDiretoAsync("Admin Senha", "admin-senha@emprely.dev", "Senha123", PerfilAdminUsuario.SuperAdmin);

        var adminAuth = await PostJsonAsync<AdminLoginResponse>(
            "/api/admin/auth/login",
            new AdminLoginRequest("admin-senha@emprely.dev", "Senha123"),
            HttpStatusCode.OK);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminAuth.AccessToken);

        var senhaErradaResponse = await httpClient.PostAsJsonAsync(
            "/api/admin/auth/password",
            new AdminAlterarSenhaPropriaRequest("senha-errada", "NovaSenha123", "NovaSenha123"),
            JsonOptions);
        Assert.Equal(HttpStatusCode.BadRequest, senhaErradaResponse.StatusCode);

        var senhaCorretaResponse = await httpClient.PostAsJsonAsync(
            "/api/admin/auth/password",
            new AdminAlterarSenhaPropriaRequest("Senha123", "NovaSenha123", "NovaSenha123"),
            JsonOptions);
        Assert.Equal(HttpStatusCode.NoContent, senhaCorretaResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;

        var loginSenhaAntigaResponse = await httpClient.PostAsJsonAsync(
            "/api/admin/auth/login",
            new AdminLoginRequest("admin-senha@emprely.dev", "Senha123"),
            JsonOptions);
        Assert.Equal(HttpStatusCode.Unauthorized, loginSenhaAntigaResponse.StatusCode);

        _ = await PostJsonAsync<AdminLoginResponse>(
            "/api/admin/auth/login",
            new AdminLoginRequest("admin-senha@emprely.dev", "NovaSenha123"),
            HttpStatusCode.OK);
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
                "Rua das Flores",
                "123",
                "Sao Paulo",
                "@brunocarvalho",
                "facebook.com/brunocarvalho",
                "@brunotiktok",
                null),
            HttpStatusCode.Created);
        Assert.Equal("Rua das Flores", cliente.Endereco);
        Assert.Equal("123", cliente.Numero);
        Assert.Equal("Sao Paulo", cliente.Cidade);
        Assert.Equal("@brunocarvalho", cliente.Instagram);
        Assert.Equal("facebook.com/brunocarvalho", cliente.Facebook);
        Assert.Equal("@brunotiktok", cliente.TikTok);

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

        var atualizarAceitaResponse = await httpClient.PutAsJsonAsync(
            $"/api/proposals/{proposta.Id}",
            new UpdatePropostaRequest(
                cliente.Id,
                "Proposta aceita ajustada",
                null,
                null,
                15,
                new[]
                {
                    new PropostaItemRequest(servico.Id, servico.Nome, servico.Descricao, 1, servico.Preco),
                }),
            JsonOptions);
        Assert.Equal(HttpStatusCode.Conflict, atualizarAceitaResponse.StatusCode);

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
    public async Task Onboarding_DeveAbrirAdiarConcluirPerfilEGerarPrimeiraProposta()
    {
        var auth = await RegisterUsuarioAsync("mvp-onboarding@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var onboardingInicial = await GetJsonAsync<OnboardingResponse>("/api/onboarding");

        Assert.True(onboardingInicial.DeveAbrirAutomaticamente);
        Assert.Equal("NaoIniciado", onboardingInicial.ConfiguracaoConta.Status);
        Assert.Equal("NaoIniciado", onboardingInicial.PrimeiraProposta.Status);

        var onboardingPulado = await PostJsonAsync<OnboardingResponse>(
            "/api/onboarding/events",
            new CreateOnboardingEventoRequest("Pulou", "boas-vindas"),
            HttpStatusCode.OK);

        Assert.True(onboardingPulado.DeveLembrarAposPular);
        Assert.Equal("Pulado", onboardingPulado.ConfiguracaoConta.Status);

        var perfilAtualizado = await httpClient.PutAsJsonAsync(
            "/api/account/profile",
            new UpdatePerfilContaRequest(
                "Emprely Testes",
                "mvp-onboarding@emprely.dev",
                "(11) 99999-9999",
                "https://emprely.dev",
                "@emprely",
                null,
                "#2563eb",
                "#10b981",
                null,
                "ComercialMinimalista",
                "#2563eb",
                "#10b981",
                "PdfImagem",
                "Consultoria",
                "Sao Paulo/SP"),
            JsonOptions);

        Assert.Equal(HttpStatusCode.OK, perfilAtualizado.StatusCode);

        var onboardingPerfilConcluido = await GetJsonAsync<OnboardingResponse>("/api/onboarding");

        Assert.Equal("Concluido", onboardingPerfilConcluido.ConfiguracaoConta.Status);
        Assert.True(onboardingPerfilConcluido.ConfiguracaoConta.ConcluidoPorDados);
        Assert.True(onboardingPerfilConcluido.DeveLembrarAposPular);

        var cliente = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Onboarding",
                "cliente-onboarding@emprely.dev",
                "(11) 98888-7777",
                null,
                null,
                null,
                "Sao Paulo",
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        var servico = await PostJsonAsync<ServicoResponse>(
            "/api/services",
            new CreateServicoRequest(
                "Diagnostico comercial",
                "Mapeamento de oportunidades e plano de acao.",
                "Consultoria",
                900,
                "Unico",
                "Servico"),
            HttpStatusCode.Created);

        var proposta = await PostJsonAsync<PropostaResponse>(
            "/api/proposals",
            new CreatePropostaRequest(
                cliente.Id,
                "Proposta de diagnostico comercial",
                "Plano inicial para melhorar o processo comercial.",
                null,
                10,
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

        using (var salvarRascunhoRequest = new HttpRequestMessage(HttpMethod.Patch, "/api/onboarding"))
        {
            salvarRascunhoRequest.Content = JsonContent.Create(
                new UpdateOnboardingRequest(
                    StatusPrimeiraProposta: "EmAndamento",
                    EtapaPrimeiraProposta: "orcamento",
                    PropostaRascunhoId: proposta.Id),
                options: JsonOptions);
            var salvarRascunhoResponse = await httpClient.SendAsync(salvarRascunhoRequest);
            Assert.Equal(HttpStatusCode.OK, salvarRascunhoResponse.StatusCode);
            var onboardingComRascunho = await salvarRascunhoResponse.Content.ReadFromJsonAsync<OnboardingResponse>(JsonOptions);
            Assert.Equal(proposta.Id, onboardingComRascunho?.PropostaRascunhoId);
        }

        using (var limparRascunhoRequest = new HttpRequestMessage(HttpMethod.Patch, "/api/onboarding"))
        {
            limparRascunhoRequest.Content = JsonContent.Create(
                new UpdateOnboardingRequest(LimparPropostaRascunhoId: true),
                options: JsonOptions);
            var limparRascunhoResponse = await httpClient.SendAsync(limparRascunhoRequest);
            Assert.Equal(HttpStatusCode.OK, limparRascunhoResponse.StatusCode);
            var onboardingSemRascunho = await limparRascunhoResponse.Content.ReadFromJsonAsync<OnboardingResponse>(JsonOptions);
            Assert.Null(onboardingSemRascunho?.PropostaRascunhoId);
        }

        await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/generate",
            new { },
            HttpStatusCode.OK);

        var onboardingConcluido = await GetJsonAsync<OnboardingResponse>("/api/onboarding");

        Assert.Equal("Concluido", onboardingConcluido.ConfiguracaoConta.Status);
        Assert.Equal("Concluido", onboardingConcluido.PrimeiraProposta.Status);
        Assert.True(onboardingConcluido.PrimeiraProposta.ConcluidoPorDados);
        Assert.False(onboardingConcluido.DeveAbrirAutomaticamente);
    }

    [Fact]
    public async Task Admin_DeveResetarTourInicialDeUsuario()
    {
        var auth = await RegisterUsuarioAsync("mvp-reset-tour@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var onboardingComTourConcluido = await PostJsonAsync<OnboardingResponse>(
            "/api/onboarding/events",
            new CreateOnboardingEventoRequest("TourConcluiu", "dashboard"),
            HttpStatusCode.OK);

        Assert.Equal("Concluido", onboardingComTourConcluido.Tour.Status);
        Assert.NotNull(onboardingComTourConcluido.Tour.ConcluidaAt);

        await CriarAdminDiretoAsync("Super Admin Reset Tour", "super-reset-tour@emprely.dev", "Senha123", PerfilAdminUsuario.SuperAdmin);
        httpClient.DefaultRequestHeaders.Authorization = null;

        var adminAuth = await PostJsonAsync<AdminLoginResponse>(
            "/api/admin/auth/login",
            new AdminLoginRequest("super-reset-tour@emprely.dev", "Senha123"),
            HttpStatusCode.OK);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminAuth.AccessToken);

        var resetResponse = await httpClient.PostAsJsonAsync(
            $"/api/admin/usuarios/{auth.Usuario.Id}/reset-tour",
            new AdminMotivoRequest("Reabrir tour inicial para validacao de suporte"),
            JsonOptions);

        Assert.Equal(HttpStatusCode.NoContent, resetResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        var onboardingResetado = await GetJsonAsync<OnboardingResponse>("/api/onboarding");

        Assert.Equal("NaoIniciado", onboardingResetado.Tour.Status);
        Assert.Null(onboardingResetado.Tour.IniciadaAt);
        Assert.Null(onboardingResetado.Tour.PuladaAt);
        Assert.Null(onboardingResetado.Tour.ConcluidaAt);
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
                null,
                null,
                null,
                null,
                null,
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
                null,
                null,
                null,
                null,
                null,
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

        var propostaGerada = await PostJsonAsync<PropostaResponse>(
            $"/api/proposals/{proposta.Id}/duplicate",
            new { },
            HttpStatusCode.Created);

        var enviarResponse = await httpClient.PostAsJsonAsync(
            $"/api/proposals/{propostaGerada.Id}/send",
            new { });

        Assert.Equal(HttpStatusCode.Forbidden, enviarResponse.StatusCode);
    }

    [Fact]
    public async Task Propostas_DeveRejeitarQuantidadeDecimal()
    {
        var auth = await RegisterUsuarioAsync("mvp-quantidade-inteira@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var cliente = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Quantidade",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        var response = await httpClient.PostAsJsonAsync(
            "/api/proposals",
            new CreatePropostaRequest(
                cliente.Id,
                "Proposta com quantidade decimal",
                null,
                null,
                7,
                new[]
                {
                    new PropostaItemRequest(null, "Item decimal", null, 1.5m, 100m),
                }),
            JsonOptions);
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Quantidade deve ser um numero inteiro.", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Clientes_DeveBloquearDuplicidadeNaCriacao()
    {
        var auth = await RegisterUsuarioAsync("mvp-cliente-duplicado@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Matriz",
                "cliente@emprely.dev",
                "+55 11 99999-0000",
                "123.456.789-00",
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        var duplicadoResponse = await httpClient.PostAsJsonAsync(
            "/api/customers",
            new CreateClienteRequest(
                " cliente   matriz ",
                "CLIENTE@emprely.dev",
                "(11) 99999-0000",
                "12345678900",
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            JsonOptions);
        var duplicadoBody = await duplicadoResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, duplicadoResponse.StatusCode);
        Assert.Contains("Ja existe um cliente ativo com este nome.", duplicadoBody, StringComparison.Ordinal);
        Assert.Contains("Ja existe um cliente ativo com este telefone.", duplicadoBody, StringComparison.Ordinal);
        Assert.Contains("Ja existe um cliente ativo com este e-mail.", duplicadoBody, StringComparison.Ordinal);
        Assert.Contains("Ja existe um cliente ativo com este CPF/CNPJ.", duplicadoBody, StringComparison.Ordinal);

        await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Sem Telefone",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Sem Telefone 2",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);
    }

    [Fact]
    public async Task Clientes_DeveBloquearDuplicidadeNaEdicao()
    {
        var auth = await RegisterUsuarioAsync("mvp-cliente-edicao-duplicada@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var clienteOrigem = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Origem",
                "origem@emprely.dev",
                "(11) 98888-0000",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        var clienteDestino = await PostJsonAsync<ClienteResponse>(
            "/api/customers",
            new CreateClienteRequest(
                "Cliente Destino",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            HttpStatusCode.Created);

        var duplicadoResponse = await httpClient.PutAsJsonAsync(
            $"/api/customers/{clienteDestino.Id}",
            new UpdateClienteRequest(
                clienteOrigem.Nome,
                null,
                clienteOrigem.Telefone,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null),
            JsonOptions);

        Assert.Equal(HttpStatusCode.BadRequest, duplicadoResponse.StatusCode);
    }

    [Fact]
    public async Task PlanoFundador_DeveRemoverRotasLegadasDeAtivacao()
    {
        var auth = await RegisterUsuarioAsync("mvp-admin-fundador@emprely.dev");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);

        var autoAtivacaoResponse = await httpClient.PostAsJsonAsync(
            "/api/account/activate-founder",
            new { });

        Assert.Equal(HttpStatusCode.NotFound, autoAtivacaoResponse.StatusCode);

        httpClient.DefaultRequestHeaders.Authorization = null;

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"/api/admin/accounts/{auth.Conta.Id}/activate-founder")
        {
            Content = JsonContent.Create(new { }),
        };
        request.Headers.Add("X-Emprely-Admin-Key", AdminOperacoesKeyDev);

        var adminResponse = await httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, adminResponse.StatusCode);
    }

    [Fact]
    public async Task Auth_DeveExigirConfirmacaoEmailAntesDoLoginERegistrarEmailFake()
    {
        const string email = "mvp-confirmacao@emprely.dev";

        var cadastro = await PostJsonAsync<RegisterUsuarioResponse>(
            "/api/auth/register",
            new RegisterUsuarioRequest(
                "Usuario Confirmacao",
                email,
                "Senha123",
                "(11) 99999-9999",
                "Emprely Confirmacao"),
            HttpStatusCode.OK);

        Assert.True(cadastro.EmailConfirmationRequired);
        Assert.Equal(email, cadastro.Email);

        var loginSemConfirmar = await httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginUsuarioRequest(email, "Senha123"),
            JsonOptions);

        Assert.Equal(HttpStatusCode.Forbidden, loginSemConfirmar.StatusCode);

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
        var emailConfirmacao = dbContext.EmailsTransacionais.FirstOrDefault(
            emailTransacional =>
                emailTransacional.UsuarioId == cadastro.UsuarioId &&
                emailTransacional.Tipo == TipoEmailTransacional.ConfirmacaoEmail);

        Assert.NotNull(emailConfirmacao);
        Assert.Equal(StatusEmailTransacional.Enviado, emailConfirmacao.Status);
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
        var cadastro = await PostJsonAsync<RegisterUsuarioResponse>(
            "/api/auth/register",
            new RegisterUsuarioRequest(
                "Usuario MVP",
                email,
                "Senha123",
                "(11) 99999-9999",
                "Emprely Testes"),
            HttpStatusCode.OK);

        await ConfirmarEmailUsuarioDiretoAsync(cadastro.UsuarioId);

        return await PostJsonAsync<AuthUsuarioResponse>(
            "/api/auth/login",
            new LoginUsuarioRequest(email, "Senha123"),
            HttpStatusCode.OK);
    }

    private async Task CriarAdminDiretoAsync(
        string nome,
        string email,
        string senha,
        PerfilAdminUsuario perfil)
    {
        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUsuario>>();
        var admin = AdminUsuario.Create(nome, email.Trim().ToLowerInvariant(), perfil);
        admin.DefinirSenhaHash(passwordHasher.HashPassword(admin, senha));
        dbContext.AdminUsuarios.Add(admin);
        await dbContext.SaveChangesAsync();
    }

    private async Task ConfirmarEmailUsuarioDiretoAsync(Guid usuarioId)
    {
        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<EmprelyDbContext>();
        var usuario = await dbContext.Users.FindAsync(usuarioId)
            ?? throw new InvalidOperationException("Usuario de teste nao encontrado.");

        usuario.EmailConfirmed = true;
        await dbContext.SaveChangesAsync();
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
