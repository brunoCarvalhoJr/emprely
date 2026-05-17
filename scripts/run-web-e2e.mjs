import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
let finalizado = false;
let passou = false;
let outputBuffer = "";

const child = spawn("pnpm.cmd --dir apps/web test:e2e", {
  cwd: repoRoot,
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
});

function handleOutput(chunk) {
  const texto = chunk.toString();
  process.stdout.write(texto);
  outputBuffer = `${outputBuffer}${texto}`.slice(-4000);

  if (/\b\d+\s+passed\b/.test(outputBuffer)) {
    passou = true;
    setTimeout(() => finalizar(0), 500);
  }
}

child.stdout.on("data", handleOutput);
child.stderr.on("data", (chunk) => process.stderr.write(chunk));

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`E2E web finalizado por sinal ${signal}.`);
    finalizar(1);
    return;
  }

  finalizar(passou ? 0 : code ?? 1);
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
    const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    killer.on("close", () => process.exit(code));
    return;
  }

  process.exit(code);
}
