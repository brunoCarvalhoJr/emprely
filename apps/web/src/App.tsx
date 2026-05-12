import {
  ArrowRight,
  BadgeCheck,
  FileText,
  PackageCheck,
  UsersRound,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  getUsuarioAtual,
  loginUsuario,
  registerUsuario,
} from "@/lib/api";
import type {
  AuthUsuarioResponse,
  LoginUsuarioInput,
  RegisterUsuarioInput,
} from "@/types/auth";

const metricasDashboard = [
  { label: "Propostas", value: "12", detail: "4 em rascunho" },
  { label: "Clientes", value: "8", detail: "2 adicionados hoje" },
  { label: "Serviços", value: "16", detail: "Pacotes reutilizáveis" },
];

const acoesPrincipais = [
  {
    icon: FileText,
    title: "Nova proposta",
    description: "Monte uma proposta visual com cliente, escopo e investimento.",
  },
  {
    icon: UsersRound,
    title: "Cadastrar cliente",
    description: "Guarde contatos e perfis para reaproveitar nas próximas propostas.",
  },
  {
    icon: PackageCheck,
    title: "Salvar serviço",
    description: "Crie pacotes de posts, reels, publis ou tráfego pago.",
  },
];

const registerSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um email valido."),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  nomeConta: z.string().min(2, "Informe o nome da conta."),
});

const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  senha: z.string().min(1, "Informe a senha."),
});

type AuthMode = "cadastro" | "login";

const tokenStorageKey = "emprely.accessToken";

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("cadastro");
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    window.localStorage.getItem(tokenStorageKey),
  );
  const [authUsuario, setAuthUsuario] = useState<AuthUsuarioResponse | null>(
    null,
  );

  const usuarioAtualQuery = useQuery({
    queryKey: ["usuario-atual", accessToken],
    queryFn: () => getUsuarioAtual(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const registerForm = useForm<RegisterUsuarioInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "Bruno Carvalho",
      email: "bruno@emprely.dev",
      senha: "Senha123",
      nomeConta: "Emprely",
    },
  });

  const loginForm = useForm<LoginUsuarioInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "bruno@emprely.dev",
      senha: "Senha123",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUsuario,
    onSuccess: handleAuthSuccess,
  });

  const loginMutation = useMutation({
    mutationFn: loginUsuario,
    onSuccess: handleAuthSuccess,
  });

  function handleAuthSuccess(response: AuthUsuarioResponse) {
    window.localStorage.setItem(tokenStorageKey, response.accessToken);
    setAccessToken(response.accessToken);
    setAuthUsuario(response);
  }

  function logoutUsuario() {
    window.localStorage.removeItem(tokenStorageKey);
    setAccessToken(null);
    setAuthUsuario(null);
  }

  const usuario = authUsuario?.usuario ?? usuarioAtualQuery.data?.usuario;
  const conta = authUsuario?.conta ?? usuarioAtualQuery.data?.conta;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Emprely</p>
            <h1 className="font-heading text-2xl font-semibold leading-8 md:text-3xl">
              Orçamentos
            </h1>
          </div>
          {usuario ? (
            <button
              onClick={logoutUsuario}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
            >
              Sair
            </button>
          ) : (
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              <FileText size={18} aria-hidden="true" />
              Nova proposta
            </button>
          )}
        </header>

        <main className="grid flex-1 gap-5 py-6 lg:grid-cols-[240px_1fr]">
          <nav className="rounded-md border border-border bg-surface p-3">
            {["Dashboard", "Clientes", "Serviços", "Propostas"].map((item) => (
              <button
                key={item}
                className="flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium text-muted transition hover:bg-slate-100 hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </nav>

          <section className="space-y-5">
            {usuario && conta ? (
              <section className="rounded-md border border-border bg-surface p-5">
                <p className="text-sm font-medium text-accent">Sessão ativa</p>
                <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                  {usuario.nome}
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <InfoLinha label="Email" value={usuario.email} />
                  <InfoLinha label="Conta" value={conta.nome} />
                  <InfoLinha label="Papel" value={conta.papel} />
                </div>
              </section>
            ) : (
              <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-md border border-border bg-surface p-5">
                  <div className="inline-flex rounded-md border border-border bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode("cadastro")}
                      className={`h-9 rounded px-3 text-sm font-semibold ${
                        authMode === "cadastro"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted"
                      }`}
                    >
                      Cadastro
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`h-9 rounded px-3 text-sm font-semibold ${
                        authMode === "login"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted"
                      }`}
                    >
                      Login
                    </button>
                  </div>

                  {authMode === "cadastro" ? (
                    <form
                      className="mt-5 space-y-4"
                      onSubmit={registerForm.handleSubmit(input =>
                        registerMutation.mutate(input),
                      )}
                    >
                      <CampoTexto
                        label="Nome"
                        error={registerForm.formState.errors.nome?.message}
                        {...registerForm.register("nome")}
                      />
                      <CampoTexto
                        label="Email"
                        type="email"
                        error={registerForm.formState.errors.email?.message}
                        {...registerForm.register("email")}
                      />
                      <CampoTexto
                        label="Senha"
                        type="password"
                        error={registerForm.formState.errors.senha?.message}
                        {...registerForm.register("senha")}
                      />
                      <CampoTexto
                        label="Conta"
                        error={registerForm.formState.errors.nomeConta?.message}
                        {...registerForm.register("nomeConta")}
                      />
                      <SubmitButton
                        label="Criar conta"
                        loading={registerMutation.isPending}
                      />
                      <MensagemErro error={registerMutation.error} />
                    </form>
                  ) : (
                    <form
                      className="mt-5 space-y-4"
                      onSubmit={loginForm.handleSubmit(input =>
                        loginMutation.mutate(input),
                      )}
                    >
                      <CampoTexto
                        label="Email"
                        type="email"
                        error={loginForm.formState.errors.email?.message}
                        {...loginForm.register("email")}
                      />
                      <CampoTexto
                        label="Senha"
                        type="password"
                        error={loginForm.formState.errors.senha?.message}
                        {...loginForm.register("senha")}
                      />
                      <SubmitButton
                        label="Entrar"
                        loading={loginMutation.isPending}
                      />
                      <MensagemErro error={loginMutation.error} />
                    </form>
                  )}
                  {usuarioAtualQuery.isError ? (
                    <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      Sessão expirada. Entre novamente.
                    </p>
                  ) : null}
                </div>

                <div className="rounded-md border border-border bg-surface p-5">
                  <p className="text-sm font-medium text-primary">API local</p>
                  <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                    Autenticação e conta
                  </h2>
                  <div className="mt-5 space-y-3 text-sm text-muted">
                    <p>POST /api/auth/register</p>
                    <p>POST /api/auth/login</p>
                    <p>GET /api/me</p>
                    <p>GET /api/account</p>
                  </div>
                </div>
              </section>
            )}

            <div className="rounded-md border border-border bg-surface p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-accent">MVP funcional</p>
                  <h2 className="font-heading text-xl font-semibold leading-7">
                    Base pronta para cadastrar clientes, serviços e propostas.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    O próximo incremento implementa autenticação, conta, perfil
                    profissional e fluxo guiado de proposta.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                  <BadgeCheck size={18} aria-hidden="true" />
                  Trial com marca d&apos;água
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {metricasDashboard.map((metrica) => (
                <article
                  key={metrica.label}
                  className="rounded-md border border-border bg-surface p-4"
                >
                  <p className="text-sm font-medium text-muted">
                    {metrica.label}
                  </p>
                  <strong className="mt-2 block text-3xl font-semibold">
                    {metrica.value}
                  </strong>
                  <span className="mt-1 block text-sm text-muted">
                    {metrica.detail}
                  </span>
                </article>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {acoesPrincipais.map((acao) => {
                const Icon = acao.icon;

                return (
                  <article
                    key={acao.title}
                    className="flex min-h-44 flex-col justify-between rounded-md border border-border bg-surface p-4"
                  >
                    <div>
                      <Icon
                        className="text-primary"
                        size={24}
                        aria-hidden="true"
                      />
                      <h3 className="mt-4 font-heading text-lg font-semibold">
                        {acao.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {acao.description}
                      </p>
                    </div>
                    <button className="mt-5 inline-flex h-10 items-center gap-2 self-start rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary">
                      Abrir
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

type CampoTextoProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ label, error, ...props }, ref) => {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        ref={ref}
        className="mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
  },
);

CampoTexto.displayName = "CampoTexto";

function SubmitButton({ label, loading }: { label: string; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Processando..." : label}
    </button>
  );
}

function MensagemErro({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {error.message}
    </p>
  );
}

function InfoLinha({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <p className="text-xs font-medium uppercase text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
