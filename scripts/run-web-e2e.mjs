import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
let finalizado = false;
let passou = false;
let falhou = false;
let outputBuffer = "";
let totalTestesEsperados = null;
let ultimoTesteOk = 0;

const comando = getPnpmCommand(["--dir", "apps/web", "test:e2e"]);

const child = spawn(comando.command, comando.args, {
  cwd: repoRoot,
  stdio: ["ignore", "pipe", "pipe"],
  shell: comando.shell,
});

function handleOutput(chunk, stream = process.stdout) {
  const texto = chunk.toString();
  stream.write(texto);
  outputBuffer = `${outputBuffer}${texto}`.slice(-4000);

  if (
    /^\s*x\s+\d+\s+\[/gim.test(outputBuffer) ||
    /\b\d+\s+failed\b/i.test(outputBuffer) ||
    /\bfailed\b/i.test(outputBuffer)
  ) {
    falhou = true;
  }

  const totalMatch = outputBuffer.match(/Running\s+(\d+)\s+tests?\s+using/i);
  if (totalMatch) {
    totalTestesEsperados = Number.parseInt(totalMatch[1], 10);
  }

  const okMatches = [...outputBuffer.matchAll(/^\s*ok\s+(\d+)\s+\[/gim)];
  for (const match of okMatches) {
    ultimoTesteOk = Math.max(ultimoTesteOk, Number.parseInt(match[1], 10));
  }

  if (!falhou && /\b\d+\s+passed\b/.test(outputBuffer)) {
    passou = true;
    setTimeout(() => finalizar(0), 500);
    return;
  }

  if (!falhou && totalTestesEsperados && ultimoTesteOk >= totalTestesEsperados) {
    passou = true;
    setTimeout(() => finalizar(0), 500);
  }
}

child.stdout.on("data", handleOutput);
child.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`E2E web finalizado por sinal ${signal}.`);
    finalizar(1);
    return;
  }

  finalizar(passou && !falhou ? 0 : code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  finalizar(1);
});

setTimeout(() => finalizar(1), 90_000);

function finalizar(code) {
  if (finalizado) {
    return;
  }

  finalizado = true;

  if (child.pid && child.exitCode === null) {
    encerrarProcesso(child.pid, () => process.exit(code));
    return;
  }

  process.exit(code);
}

function getPnpmCommand(args) {
  if (process.platform === "win32") {
    return {
      command: ["pnpm.cmd", ...args].join(" "),
      args: [],
      shell: true,
    };
  }

  if (isWsl()) {
    return {
      command: "cmd.exe",
      args: ["/c", "pnpm", ...args],
      shell: false,
    };
  }

  return {
    command: "pnpm",
    args,
    shell: false,
  };
}

function encerrarProcesso(pid, done) {
  if (process.platform === "win32" || isWsl()) {
    const killer = spawn("taskkill.exe", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
    });
    killer.on("close", done);
    killer.on("error", () => {
      matarComSinal(pid);
      done();
    });
    return;
  }

  matarComSinal(pid);
  done();
}

function matarComSinal(pid) {
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Processo ja finalizado.
  }
}

function isWsl() {
  return Boolean(process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP);
}
