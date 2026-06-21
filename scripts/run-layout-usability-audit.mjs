import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const requireFromWeb = createRequire(resolve("apps/web/package.json"));
const { chromium } = requireFromWeb("@playwright/test");

const baseUrl = process.env.EMPRELY_AUDIT_URL ?? "https://app.emprely.com.br";
const outputDir = resolve(
  process.env.EMPRELY_AUDIT_OUTPUT ??
    "docs/testing/evidencias/layout-usabilidade-2026-06-20",
);
const credentialsPath =
  process.env.EMPRELY_TEST_CREDENTIALS ??
  "D:/Emprely/Testes/credenciais-teste.md";

mkdirSync(outputDir, { recursive: true });

const credentialsText = readFileSync(credentialsPath, "utf8");

function extractSectionValue(sectionTitle, label) {
  const sectionStart = credentialsText.indexOf(`## ${sectionTitle}`);
  if (sectionStart < 0) {
    throw new Error(`Secao de credenciais nao encontrada: ${sectionTitle}`);
  }

  const nextSection = credentialsText.indexOf("\n## ", sectionStart + 1);
  const section = credentialsText.slice(
    sectionStart,
    nextSection < 0 ? undefined : nextSection,
  );
  const match = section.match(new RegExp(`- ${label}:\\s*(.+)`));
  if (!match) {
    throw new Error(`Campo de credenciais nao encontrado: ${sectionTitle} / ${label}`);
  }

  return match[1].trim();
}

const credentials = {
  userEmail: extractSectionValue("Usuario comum", "E-mail"),
  userPass: extractSectionValue("Usuario comum", "Senha"),
  adminEmail: extractSectionValue("Usuario administrador", "E-mail"),
  adminPass: extractSectionValue("Usuario administrador", "Senha"),
};

const viewports = [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "mobile", width: 390, height: 844 },
];

const result = {
  startedAt: new Date().toISOString(),
  baseUrl,
  outputDir,
  viewports,
  pages: [],
  errors: [],
};

function slug(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function waitUi(page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(700);
}

async function closeOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.getByTestId("proposal-view-modal-close").click({ timeout: 800 }).catch(() => {});
  await page.getByRole("button", { name: /fechar/i }).last().click({ timeout: 800 }).catch(() => {});
}

async function loginUser(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await waitUi(page);
  const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
  if (!bodyText.includes("Dashboard")) {
    await page.getByLabel("E-mail").fill(credentials.userEmail);
    await page.getByLabel("Senha").fill(credentials.userPass);
    await page.getByRole("button", { name: /Entrar/ }).last().click();
    await waitUi(page);
  }
}

async function loginAdmin(page) {
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await waitUi(page);
  const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
  if (/E-mail admin/i.test(bodyText)) {
    await page.getByLabel("E-mail admin").fill(credentials.adminEmail);
    await page.getByLabel("Senha admin").fill(credentials.adminPass);
    await page.getByRole("button", { name: /Entrar/i }).click();
    await waitUi(page);
  }
}

async function nav(page, label) {
  await closeOverlays(page);
  const selectorMap = {
    dashboard: 'button[aria-label="Dashboard"]',
    clientes: 'button[aria-label="Clientes"]',
    servicos: 'button[aria-label^="Serv"]',
    propostas: 'button[aria-label="Propostas"]',
    suporte: 'button[aria-label="Suporte"]',
  };
  const selector = selectorMap[label];
  if (!selector) throw new Error(`Navegacao desconhecida: ${label}`);

  const target = page.locator(selector).first();
  if (!(await target.isVisible().catch(() => false))) {
    const drawerLabels = {
      dashboard: /^(Inicio|Dashboard)$/i,
      clientes: /^Clientes$/i,
      servicos: /^Servi/i,
      propostas: /^Propostas$/i,
      suporte: /^Suporte$/i,
    };
    await page.getByRole("button", { name: "Abrir menu" }).click({ timeout: 10_000 });
    const drawer = page.getByRole("dialog", { name: "Menu principal" });
    await drawer.getByRole("button", { name: drawerLabels[label] }).first().click({ timeout: 10_000 });
    await waitUi(page);
    return;
  }

  await target.click({ timeout: 15_000 });
  await waitUi(page);
}

async function openAccountMenu(page, itemText) {
  await closeOverlays(page);
  const mobileMenuButton = page.getByRole("button", { name: "Abrir menu" });
  if (await mobileMenuButton.isVisible().catch(() => false)) {
    await mobileMenuButton.click({ timeout: 10_000 });
    const drawer = page.getByRole("dialog", { name: "Menu principal" });
    await drawer.getByRole("button", { name: new RegExp(itemText, "i") }).click({ timeout: 10_000 });
    await waitUi(page);
    return;
  }

  await page.locator(".sidebar-account-button").click({ timeout: 10_000 });
  await page.getByRole("menuitem", { name: new RegExp(itemText, "i") }).click({ timeout: 10_000 });
  await waitUi(page);
}

async function auditCurrentPage(page, viewport, name) {
  await closeOverlays(page);
  await waitUi(page);
  const screenshot = `${viewport.id}-${slug(name)}.png`;
  const screenshotPath = join(outputDir, screenshot);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const metrics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity || "1") > 0.05
      );
    }

    function shortText(element) {
      return (element.innerText || element.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
    }

    function rectInfo(element) {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }

    function selectorHint(element) {
      const id = element.id ? `#${element.id}` : "";
      const testId = element.getAttribute("data-testid")
        ? `[data-testid="${element.getAttribute("data-testid")}"]`
        : "";
      const cls = String(element.className || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .join(".");
      return `${element.tagName.toLowerCase()}${id}${testId}${cls ? `.${cls}` : ""}`;
    }

    function parseRgb(value) {
      const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
    }

    function luminance(rgb) {
      const values = rgb.map((channel) => {
        const n = channel / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    }

    function contrast(fg, bg) {
      const l1 = luminance(fg);
      const l2 = luminance(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    function backgroundColorFor(element) {
      let node = element;
      while (node && node !== document.documentElement) {
        const bg = window.getComputedStyle(node).backgroundColor;
        const rgb = parseRgb(bg);
        if (rgb && !/rgba\(\d+,\s*\d+,\s*\d+,\s*0\)/.test(bg)) {
          return rgb;
        }
        node = node.parentElement;
      }
      return [255, 255, 255];
    }

    const all = Array.from(document.body.querySelectorAll("*")).filter(isVisible);
    const interactive = all.filter((element) =>
      element.matches("button,a,input,select,textarea,[role='button'],[role='menuitem']"),
    );
    const textElements = all.filter((element) => shortText(element).length > 0);

    const horizontalOverflow = Math.max(
      0,
      document.documentElement.scrollWidth - viewportWidth,
      document.body.scrollWidth - viewportWidth,
    );

    const offscreen = all
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -2 || rect.right > viewportWidth + 2;
      })
      .slice(0, 30)
      .map((element) => ({
        selector: selectorHint(element),
        text: shortText(element),
        rect: rectInfo(element),
      }));

    const clippedText = textElements
      .filter((element) => {
        const style = window.getComputedStyle(element);
        return (
          element.scrollWidth > element.clientWidth + 2 &&
          style.whiteSpace !== "normal" &&
          style.overflow !== "visible"
        );
      })
      .slice(0, 30)
      .map((element) => ({
        selector: selectorHint(element),
        text: shortText(element),
        rect: rectInfo(element),
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }));

    const smallTargets = interactive
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const disabled = element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
        return !disabled && (rect.width < 44 || rect.height < 44);
      })
      .slice(0, 40)
      .map((element) => ({
        selector: selectorHint(element),
        text: shortText(element) || element.getAttribute("aria-label") || "",
        rect: rectInfo(element),
      }));

    const unnamedControls = interactive
      .filter((element) => {
        const name =
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.getAttribute("placeholder") ||
          shortText(element);
        return !name;
      })
      .slice(0, 30)
      .map((element) => ({ selector: selectorHint(element), rect: rectInfo(element) }));

    const lowContrastText = textElements
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const fontSize = Number.parseFloat(style.fontSize || "0");
        if (fontSize < 12) return false;
        const fg = parseRgb(style.color);
        const bg = backgroundColorFor(element);
        if (!fg || !bg) return false;
        return contrast(fg, bg) < 4.5;
      })
      .slice(0, 30)
      .map((element) => {
        const style = window.getComputedStyle(element);
        const fg = parseRgb(style.color);
        const bg = backgroundColorFor(element);
        return {
          selector: selectorHint(element),
          text: shortText(element),
          rect: rectInfo(element),
          ratio: Number(contrast(fg, bg).toFixed(2)),
          color: style.color,
          background: window.getComputedStyle(element).backgroundColor,
        };
      });

    const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
      .filter(isVisible)
      .map((element) => ({
        level: element.tagName.toLowerCase(),
        text: shortText(element),
      }));

    return {
      url: location.href,
      title: document.title,
      viewport: { width: viewportWidth, height: viewportHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      horizontalOverflow,
      counts: {
        visibleElements: all.length,
        interactive: interactive.length,
        offscreen: offscreen.length,
        clippedText: clippedText.length,
        smallTargets: smallTargets.length,
        unnamedControls: unnamedControls.length,
        lowContrastText: lowContrastText.length,
      },
      headings,
      offscreen,
      clippedText,
      smallTargets,
      unnamedControls,
      lowContrastText,
    };
  });

  result.pages.push({
    viewport: viewport.id,
    name,
    screenshot,
    metrics,
  });
}

async function safeAudit(page, viewport, name, action) {
  try {
    await action();
    await auditCurrentPage(page, viewport, name);
  } catch (error) {
    result.errors.push({
      viewport: viewport.id,
      page: name,
      error: String(error.stack || error.message || error),
    });
  }
}

async function runUserAuditForViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.id === "mobile" ? 2 : 1,
    isMobile: viewport.id === "mobile",
    hasTouch: viewport.id !== "desktop",
  });
  const page = await context.newPage();

  await safeAudit(page, viewport, "login-publico", async () => {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await waitUi(page);
  });

  await loginUser(page);

  await safeAudit(page, viewport, "dashboard", async () => {
    await nav(page, "dashboard");
  });
  await safeAudit(page, viewport, "clientes-lista", async () => {
    await nav(page, "clientes");
  });
  await safeAudit(page, viewport, "clientes-formulario", async () => {
    await nav(page, "clientes");
    await page.getByRole("button", { name: /Novo cliente/i }).first().click({ timeout: 10_000 });
  });
  await safeAudit(page, viewport, "servicos-lista", async () => {
    await nav(page, "servicos");
  });
  await safeAudit(page, viewport, "servicos-formulario", async () => {
    await nav(page, "servicos");
    await page.getByRole("button", { name: /^Novo servi/i }).first().click({ timeout: 10_000 });
  });
  await safeAudit(page, viewport, "propostas-lista", async () => {
    await nav(page, "propostas");
  });
  await safeAudit(page, viewport, "proposta-assistente-inicio", async () => {
    await nav(page, "propostas");
    await page.getByRole("button", { name: /Nova proposta/i }).first().click({ timeout: 10_000 });
  });
  await safeAudit(page, viewport, "suporte", async () => {
    await nav(page, "suporte");
  });
  await safeAudit(page, viewport, "personalizacao", async () => {
    await openAccountMenu(page, "Personaliza");
  });
  await safeAudit(page, viewport, "configuracoes-conta", async () => {
    await openAccountMenu(page, "Configura");
  });

  await context.close();
}

async function runAdminAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const viewport = { id: "desktop-admin", width: 1440, height: 1000 };

  await safeAudit(page, viewport, "admin-login-dashboard", async () => {
    await loginAdmin(page);
  });

  await context.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    await runUserAuditForViewport(browser, viewport);
  }
  await runAdminAudit(browser);
} finally {
  await browser.close();
}

const jsonPath = join(outputDir, "audit-layout-usabilidade.json");
writeFileSync(jsonPath, JSON.stringify(result, null, 2), "utf8");
console.log(JSON.stringify({ outputDir, jsonPath, pages: result.pages.length, errors: result.errors.length }, null, 2));
