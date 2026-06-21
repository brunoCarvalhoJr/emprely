import { expect, type Page, type Route, test } from "@playwright/test";

type ClienteMock = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  documento: string | null;
  observacoes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

type ServicoMock = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  preco: number;
  unidade: string;
  tipo: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

type PropostaItemMock = {
  id: string;
  servicoId: string | null;
  nome: string;
  descricao: string | null;
  quantidade: number;
  valorUnitario: number;
  total: number;
  ordem: number;
};

type PropostaMock = {
  id: string;
  numero: number;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  validadeDias: number;
  templateVisual: string;
  descontoValor: number;
  condicoesPagamento: string | null;
  itensInclusos: string[];
  itensNaoInclusos: string[];
  cronograma: string[];
  beneficios: string[];
  status: string;
  total: number;
  itens: PropostaItemMock[];
  createdAt: string;
  updatedAt: string | null;
};

test("remove sessao expirada salva no navegador", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "emprely.authSession",
      JSON.stringify({
        accessToken: "token-expirado",
        expiresAtUtc: new Date(Date.now() - 60_000).toISOString(),
        usuario: {
          id: "usuario-expirado",
          nome: "Usuario Expirado",
          email: "expirado@emprely.dev",
        },
        conta: {
          id: "conta-expirada",
          nome: "Emprely",
          slug: "emprely",
          papel: "Dono",
          plano: "Trial",
          statusComercial: "TrialAtivo",
          trialEndsAt: new Date(Date.now() + 60_000).toISOString(),
          trialDiasRestantes: 1,
          planoFundadorAtivadoAt: null,
          planoFundadorPrecoMensal: 49,
        },
      }),
    );
  });

  await page.goto("/");

  await expect(page.getByText("Sessao expirada. Entre novamente.")).toBeVisible();
  await expect(page.getByText("Usuario Expirado")).toHaveCount(0);
  await expect(
    page.evaluate(() => window.localStorage.getItem("emprely.authSession")),
  ).resolves.toBeNull();
});

test("limpa sessao quando endpoint autenticado retorna 401", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "emprely.authSession",
      JSON.stringify({
        accessToken: "token-invalido",
        expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        usuario: {
          id: "usuario-invalido",
          nome: "Usuario Invalido",
          email: "invalido@emprely.dev",
        },
        conta: {
          id: "conta-invalida",
          nome: "Emprely",
          slug: "emprely",
          papel: "Dono",
          plano: "Trial",
          statusComercial: "TrialAtivo",
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          trialDiasRestantes: 7,
          planoFundadorAtivadoAt: null,
          planoFundadorPrecoMensal: 49,
        },
      }),
    );
  });

  await page.route("**/api/**", async (route) => {
    await fulfillJson(route, 401, { message: "Sessao invalida." });
  });

  await page.goto("/");

  await expect(page.getByText("Sessao expirada. Entre novamente.")).toBeVisible();
  await expect(page.getByText("Usuario Invalido")).toHaveCount(0);
  await expect(
    page.evaluate(() => window.localStorage.getItem("emprely.authSession")),
  ).resolves.toBeNull();
});

test("fluxo principal do MVP no web", async ({ page }) => {
  await configurarApiMockada(page);
  await adicionarSessaoValida(page);

  await page.goto("/");

  await expect(page.locator(".sidebar-account-button")).toBeVisible();
  await expect(page.getByText("Primeiros passos")).toBeVisible();
  await expect(
    page.getByText("Crie sua primeira proposta profissional em minutos"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Clientes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Clientes", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Novo cliente" }).first().click();
  await page.getByLabel("Nome").fill("Cliente E2E");
  await page.getByRole("textbox", { name: "Telefone" }).fill("(11) 99999-9999");
  await page.getByRole("button", { name: "Salvar cliente" }).click();
  await expect(page.getByText("Cliente salvo.")).toBeVisible();
  await page.getByRole("button", { name: "Clientes", exact: true }).click();
  await expect(page.getByText("Cliente E2E")).toBeVisible();

  await page.getByRole("button", { name: "Serviços", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Meus serviços e pacotes" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Novo serviço" }).first().click();
  await page.getByLabel("Nome").fill("Consultoria MVP");
  await page.getByLabel("Categoria").fill("Estrategia");
  await page.getByLabel("Preço").fill("1500");
  await page.getByLabel("Descrição").fill("Diagnostico e plano de execucao.");
  await page.getByRole("button", { name: "Salvar serviço" }).click();
  await expect(page.getByText("Serviço salvo.")).toBeVisible();
  await page.getByRole("button", { name: "Serviços", exact: true }).click();
  await expect(page.getByText("Consultoria MVP")).toBeVisible();

  await page.getByRole("button", { name: "Propostas", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Propostas", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Nova proposta" }).first().click();
  await page.getByRole("button", { name: /Cliente já cadastrado/ }).click();
  await page.getByRole("button", { name: /Cliente E2E/ }).click();
  await page.getByLabel("Título").fill("Proposta MVP E2E");
  await page.getByRole("button", { name: /^Pr.*ximo$/ }).click();
  await page.getByLabel("Selecionar do catálogo").selectOption("servico-1");
  await page.getByRole("button", { name: "Adicionar" }).click();
  await page.getByRole("button", { name: /^Pr.*ximo$/ }).click();
  await page.getByRole("button", { name: /^Pr.*ximo$/ }).click();
  await page.getByRole("button", { name: /^Pr.*ximo$/ }).click();
  await page.getByRole("button", { name: "Salvar rascunho" }).click();
  await expect(page.getByRole("heading", { name: "Editar proposta" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Proposta MVP E2E" }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Gerar proposta" }).first().click();
  await expect(
    page.getByText("Proposta gerada. Agora você pode imprimir ou enviar pelo WhatsApp."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /WhatsApp/ }).first(),
  ).toBeVisible();
  await expect(page.getByTestId("proposal-view-modal-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("proposal-view-modal-dialog")).toBeHidden();

  await page.getByTestId("proposal-actions-proposta-1-menu").click();
  await page.getByTestId("proposal-action-view-proposta-1").click();
  await expect(page.getByTestId("proposal-view-modal-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("proposal-view-modal-dialog")).toBeHidden();

  await page.getByTestId("proposal-actions-proposta-1-menu").click();
  await page.getByTestId("proposal-action-duplicate-proposta-1").click();
  await expect(page.getByTestId("system-confirm-dialog")).toBeVisible();
  await page.getByTestId("system-confirm-confirm").click();
  await expect(page.getByText("Proposta duplicada como rascunho.")).toBeVisible();
  await expect(page.getByText("Proposta MVP E2E (cópia)")).toBeVisible();
});

test("exibe perfil da conta unificado sem plano e seguranca", async ({ page }) => {
  await configurarApiMockada(page);
  await adicionarSessaoValida(page);

  await page.goto("/");
  await page.locator(".sidebar-account-button").click();
  await expect(
    page.getByRole("menuitem", { name: "Perfil da conta" }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "Personalização" }),
  ).toBeHidden();
  await page.getByText("Primeiros passos").click();
  await expect(
    page.getByRole("menuitem", { name: "Perfil da conta" }),
  ).toBeHidden();
  await page.locator(".sidebar-account-button").click();
  await page.getByRole("menuitem", { name: "Perfil da conta" }).click();
  await expect(page.getByRole("heading", { name: "Perfil da conta" })).toBeVisible();
  await expect(page.getByText("Passo Perfil da conta")).toBeVisible();
  await expect(page.getByText("Template, cores e formatos de envio")).toBeVisible();
  await page.getByRole("button", { name: /Escuro/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /Claro/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await expect(page.getByLabel("Responsável")).toHaveValue("Bruno Carvalho");
  await expect(page.getByLabel("E-mail de acesso")).toHaveValue("bruno@emprely.dev");
  await expect(page.getByLabel("E-mail de acesso")).toHaveAttribute("readonly", "");
  await expect(page.getByLabel("E-mail de contato")).toHaveValue("bruno@emprely.dev");
  await expect(page.getByLabel("Telefone").first()).toHaveValue("(11) 99999-9999");
  await expect(page.getByText("Logomarca do negócio")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Salvar perfil", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Plano e segurança")).toBeHidden();
  await expect(page.getByLabel("Senha atual")).toBeHidden();
  await expect(page.getByRole("button", { name: "Atualizar senha" })).toBeHidden();
});

test("exibe perfil da conta unificado no drawer mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await configurarApiMockada(page);
  await adicionarSessaoValida(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Abrir mais opcoes" }).click();
  await expect(
    page.getByRole("button", { name: "Perfil da conta" }),
  ).toBeVisible();
  await expect(page.getByText("Personalizacao")).toBeHidden();
  await page.getByRole("button", { name: "Perfil da conta" }).click();

  await expect(page.getByRole("heading", { name: "Perfil da conta" })).toBeVisible();
  await expect(page.getByText("Passo Perfil da conta")).toBeVisible();
  await expect(page.getByText("Template, cores e formatos de envio")).toBeVisible();
  await expect(page.getByLabel("E-mail de acesso")).toHaveAttribute("readonly", "");

  const topoTemplate = await page
    .getByRole("heading", { name: "Templates dos orçamentos" })
    .boundingBox();
  const topoCores = await page.getByRole("heading", { name: "Paleta da proposta" }).boundingBox();
  const topoFormato = await page.getByRole("heading", { name: "Formato preferido" }).boundingBox();

  expect(topoTemplate?.y ?? 0).toBeLessThan(topoCores?.y ?? 0);
  expect(topoCores?.y ?? 0).toBeLessThan(topoFormato?.y ?? 0);

  await page.getByLabel("Nome comercial").fill("Conta Mobile Codex");
  await page.getByLabel("Segmento").fill("Consultoria mobile");
  await page.getByLabel("Cidade/UF").fill("Itajubá/MG");
  await page.getByLabel("E-mail de contato").fill("mobile.codex@emprely.dev");
  await page.getByRole("textbox", { name: "Telefone" }).fill("(35) 99738-9755");
  await page.getByLabel("Site").fill("https://emprely.com.br");
  await page.getByLabel("Instagram").fill("@emprely");

  await expect(page.getByLabel("Nome comercial")).toHaveValue("Conta Mobile Codex");
  await expect(page.getByLabel("E-mail de contato")).toHaveValue(
    "mobile.codex@emprely.dev",
  );
  await page.getByRole("button", { name: "Salvar perfil", exact: true }).click();
  await expect(page.getByText("Perfil salvo.")).toBeVisible();

  const possuiOverflowHorizontal = await page.evaluate(() => {
    const larguraDocumento = document.documentElement.scrollWidth;
    const larguraViewport = document.documentElement.clientWidth;
    return larguraDocumento > larguraViewport + 1;
  });

  expect(possuiOverflowHorizontal).toBe(false);
});

test("cadastro exige confirmacao e recuperacao de senha usa fluxo interno", async ({ page }) => {
  await configurarApiMockada(page);

  await page.goto("/");
  await preencherCadastroInicial(page);
  await page.getByRole("button", { name: "Iniciar teste de 7 dias" }).click();

  await expect(page.getByText("Confirme seu email")).toBeVisible();
  await page.getByRole("button", { name: "Reenviar confirmação" }).click();
  await page.getByRole("tab", { name: "Entrar" }).click();
  await page.getByRole("button", { name: "Esqueci minha senha" }).click();
  await page.getByLabel("E-mail").fill("bruno@emprely.dev");
  await page.getByRole("button", { name: "Enviar link de recuperação" }).click();
  await expect(
    page.getByText("Se houver uma conta com este email, enviaremos um link de recuperação."),
  ).toBeVisible();
});

async function configurarApiMockada(page: Page) {
  const agora = new Date().toISOString();
  let usuario = {
    id: "usuario-1",
    nome: "Bruno Carvalho",
    email: "bruno@emprely.dev",
  };
  let conta = {
    id: "conta-1",
    nome: "Emprely",
    slug: "emprely",
    papel: "Dono",
    plano: "Trial",
    statusComercial: "TrialAtivo",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    trialDiasRestantes: 7,
    planoFundadorAtivadoAt: null,
    planoFundadorPrecoMensal: 49,
  };
  let perfil = {
    id: null,
    contaId: conta.id,
    nomeComercial: conta.nome,
    emailContato: null,
    telefoneContato: "(11) 99999-9999",
    siteUrl: null,
    instagram: null,
    documento: null,
    corPrimaria: "#2563EB",
    corSecundaria: "#14B8A6",
    logoUrl: null,
    updatedAt: null,
  };

  let clientes: ClienteMock[] = [];
  let servicos: ServicoMock[] = [];
  let propostas: PropostaMock[] = [];
  let proximoNumeroProposta = 1;
  let emailConfirmado = false;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (method === "OPTIONS") {
      await fulfillJson(route, 204, {});
      return;
    }

    if (method === "POST" && path === "/api/auth/register") {
      const input = request.postDataJSON() as {
        nome: string;
        email: string;
        telefone: string;
        nomeConta: string;
      };
      usuario = {
        ...usuario,
        nome: input.nome,
        email: input.email,
      };
      conta = {
        ...conta,
        nome: input.nomeConta,
      };
      perfil = {
        ...perfil,
        nomeComercial: input.nomeConta,
        emailContato: input.email,
        telefoneContato: input.telefone,
      };
      emailConfirmado = false;
      await fulfillJson(route, 200, {
        usuarioId: usuario.id,
        email: usuario.email,
        emailConfirmationRequired: true,
        message: "Cadastro criado. Confirme seu email para entrar.",
      });
      return;
    }

    if (method === "POST" && path === "/api/auth/login") {
      if (!emailConfirmado) {
        await fulfillJson(route, 403, {
          code: "EmailNotConfirmed",
          message: "Confirme seu email antes de entrar.",
        });
        return;
      }

      await fulfillJson(route, 200, buildAuthMock(usuario, conta));
      return;
    }

    if (method === "POST" && path === "/api/auth/resend-confirmation") {
      await fulfillJson(route, 204, {});
      return;
    }

    if (method === "POST" && path === "/api/auth/forgot-password") {
      await fulfillJson(route, 204, {});
      return;
    }

    if (method === "GET" && path === "/api/me") {
      await fulfillJson(route, 200, { usuario, conta });
      return;
    }

    if (method === "PUT" && path === "/api/me/password") {
      const input = request.postDataJSON() as {
        senhaAtual?: string;
        novaSenha?: string;
        confirmarNovaSenha?: string;
      };

      if (input.novaSenha !== input.confirmarNovaSenha) {
        await fulfillJson(route, 400, {
          errors: {
            confirmarNovaSenha: ["A confirmacao deve ser igual a nova senha."],
          },
        });
        return;
      }

      await fulfillJson(route, 204, {});
      return;
    }

    if (method === "GET" && path === "/api/account/profile") {
      await fulfillJson(route, 200, perfil);
      return;
    }

    if (method === "PUT" && path === "/api/account/profile") {
      const input = request.postDataJSON() as Partial<typeof perfil>;
      perfil = {
        ...perfil,
        ...input,
        updatedAt: agora,
      };
      await fulfillJson(route, 200, perfil);
      return;
    }

    if (method === "GET" && path === "/api/customers") {
      await fulfillJson(route, 200, clientes);
      return;
    }

    if (method === "POST" && path === "/api/customers") {
      const input = request.postDataJSON() as Partial<ClienteMock>;
      const cliente: ClienteMock = {
        id: `cliente-${clientes.length + 1}`,
        nome: input.nome ?? "Cliente",
        email: input.email ?? null,
        telefone: input.telefone ?? null,
        documento: input.documento ?? null,
        observacoes: input.observacoes ?? null,
        status: "Ativo",
        createdAt: agora,
        updatedAt: null,
      };
      clientes = [cliente, ...clientes];
      await fulfillJson(route, 201, cliente);
      return;
    }

    if (method === "GET" && path === "/api/services") {
      await fulfillJson(route, 200, servicos);
      return;
    }

    if (method === "POST" && path === "/api/services") {
      const input = request.postDataJSON() as Partial<ServicoMock>;
      const servico: ServicoMock = {
        id: `servico-${servicos.length + 1}`,
        nome: input.nome ?? "Servico",
        descricao: input.descricao ?? null,
        categoria: input.categoria ?? null,
        preco: input.preco ?? 0,
        unidade: input.unidade ?? "Unico",
        tipo: input.tipo ?? "Servico",
        status: "Ativo",
        createdAt: agora,
        updatedAt: null,
      };
      servicos = [servico, ...servicos];
      await fulfillJson(route, 201, servico);
      return;
    }

    if (method === "GET" && path === "/api/proposals") {
      await fulfillJson(route, 200, propostas);
      return;
    }

    if (method === "POST" && path === "/api/proposals") {
      const input = request.postDataJSON() as {
        clienteId: string;
        titulo: string;
        introducao: string | null;
        observacoes: string | null;
        validadeDias: number;
        templateVisual?: string;
        descontoValor?: number;
        condicoesPagamento?: string | null;
        itensInclusos?: string[];
        itensNaoInclusos?: string[];
        cronograma?: string[];
        beneficios?: string[];
        itens: Array<{
          servicoId: string | null;
          nome: string;
          descricao: string | null;
          quantidade: number;
          valorUnitario: number;
        }>;
      };
      const cliente = clientes.find((item) => item.id === input.clienteId);
      const itens = input.itens.map((item, index) => ({
        id: `item-${index + 1}`,
        servicoId: item.servicoId,
        nome: item.nome,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        total: item.quantidade * item.valorUnitario,
        ordem: index + 1,
      }));
      const proposta: PropostaMock = {
        id: `proposta-${propostas.length + 1}`,
        numero: proximoNumeroProposta,
        clienteId: input.clienteId,
        clienteNome: cliente?.nome ?? "",
        titulo: input.titulo,
        introducao: input.introducao,
        observacoes: input.observacoes,
        validadeDias: input.validadeDias,
        templateVisual: input.templateVisual ?? "Emprely",
        descontoValor: input.descontoValor ?? 0,
        condicoesPagamento: input.condicoesPagamento ?? null,
        itensInclusos: input.itensInclusos ?? [],
        itensNaoInclusos: input.itensNaoInclusos ?? [],
        cronograma: input.cronograma ?? [],
        beneficios: input.beneficios ?? [],
        status: "Rascunho",
        total:
          itens.reduce((total, item) => total + item.total, 0) -
          (input.descontoValor ?? 0),
        itens,
        createdAt: agora,
        updatedAt: null,
      };
      proximoNumeroProposta++;
      propostas = [proposta, ...propostas];
      await fulfillJson(route, 201, proposta);
      return;
    }

    const generateMatch = path.match(/^\/api\/proposals\/([^/]+)\/generate$/);
    if (method === "POST" && generateMatch) {
      const propostaId = generateMatch[1];
      propostas = propostas.map((proposta) =>
        proposta.id === propostaId
          ? { ...proposta, status: "Gerada", updatedAt: agora }
          : proposta,
      );
      await fulfillJson(
        route,
        200,
        propostas.find((proposta) => proposta.id === propostaId),
      );
      return;
    }

    const duplicateMatch = path.match(/^\/api\/proposals\/([^/]+)\/duplicate$/);
    if (method === "POST" && duplicateMatch) {
      const propostaId = duplicateMatch[1];
      const propostaOriginal = propostas.find((proposta) => proposta.id === propostaId);

      if (!propostaOriginal) {
        await fulfillJson(route, 404, { message: "Proposta nao encontrada." });
        return;
      }

      const propostaDuplicada: PropostaMock = {
        ...propostaOriginal,
        id: `proposta-${propostas.length + 1}`,
        numero: proximoNumeroProposta,
        titulo: `${propostaOriginal.titulo} (cópia)`,
        status: "Rascunho",
        createdAt: agora,
        updatedAt: null,
        itens: propostaOriginal.itens.map((item, index) => ({
          ...item,
          id: `item-duplicado-${index + 1}`,
        })),
      };

      proximoNumeroProposta++;
      propostas = [propostaDuplicada, ...propostas];
      await fulfillJson(route, 201, propostaDuplicada);
      return;
    }

    await fulfillJson(route, 404, { message: `Rota mock nao encontrada: ${method} ${path}` });
  });
}

async function preencherCadastroInicial(page: Page) {
  await page.getByRole("tab", { name: "Testar 7 dias" }).click();
  await page.getByLabel("Nome completo").fill("Bruno Carvalho");
  await page
    .getByRole("textbox", { name: "E-mail profissional" })
    .fill("bruno@emprely.dev");
  await page.getByLabel("Telefone").fill("(11) 99999-9999");
  await page.getByLabel("Senha", { exact: true }).fill("Senha123");
  await page.getByLabel("Nome da empresa").fill("Emprely");
}

async function adicionarSessaoValida(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "emprely.authSession",
      JSON.stringify({
        accessToken: "token-e2e",
        expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        usuario: {
          id: "usuario-1",
          nome: "Bruno Carvalho",
          email: "bruno@emprely.dev",
        },
        conta: {
          id: "conta-1",
          nome: "Emprely",
          slug: "emprely",
          papel: "Dono",
          plano: "Trial",
          statusComercial: "TrialAtivo",
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          trialDiasRestantes: 7,
          planoFundadorAtivadoAt: null,
          planoFundadorPrecoMensal: 49,
        },
      }),
    );
  });
}

function buildAuthMock(usuario: unknown, conta: unknown) {
  return {
    accessToken: "token-e2e",
    expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    usuario,
    conta,
  };
}

async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    body: status === 204 ? "" : JSON.stringify(body),
  });
}
