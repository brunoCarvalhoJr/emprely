import {
  Archive,
  ArrowRight,
  BadgeCheck,
  Building2,
  Edit3,
  FileText,
  PackageCheck,
  Palette,
  Plus,
  Save,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useEffect,
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type {
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import {
  createCliente,
  createServico,
  deleteCliente,
  deleteServico,
  getClientesConta,
  getPerfilContaAtual,
  getServicosConta,
  getUsuarioAtual,
  loginUsuario,
  registerUsuario,
  updateCliente,
  updatePerfilConta,
  createProposta,
  deleteProposta,
  getPropostasConta,
  updateProposta,
  updateServico,
} from "@/lib/api";
import type {
  AuthUsuarioResponse,
  LoginUsuarioInput,
  RegisterUsuarioInput,
} from "@/types/auth";
import type {
  ClienteResponse,
  CreateClienteInput,
  UpdateClienteInput,
} from "@/types/customer";
import type {
  CreateServicoInput,
  ServicoResponse,
  TipoServico,
  UnidadeServico,
  UpdateServicoInput,
} from "@/types/service";
import type {
  CreatePropostaInput,
  PropostaResponse,
  UpdatePropostaInput,
} from "@/types/proposal";

const metricasDashboard = [
  { label: "Propostas", value: "0", detail: "Rascunhos ativos" },
  { label: "Clientes", value: "0", detail: "Base ativa" },
  { label: "Servicos", value: "0", detail: "Pacotes reutilizaveis" },
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
    description: "Guarde contatos e perfis para reaproveitar nas proximas propostas.",
  },
  {
    icon: PackageCheck,
    title: "Salvar servico",
    description: "Crie pacotes de posts, reels, publis ou trafego pago.",
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

const perfilContaSchema = z.object({
  nomeComercial: z.string().min(2, "Informe o nome comercial.").max(160),
  emailContato: z
    .string()
    .max(256)
    .refine(
      (valor) => valor.length === 0 || z.email().safeParse(valor).success,
      "Informe um email valido.",
    ),
  telefoneContato: z.string().max(40),
  siteUrl: z
    .string()
    .max(300)
    .refine(
      (valor) => valor.length === 0 || isUrlValida(valor),
      "Informe uma URL valida.",
    ),
  instagram: z.string().max(80),
  documento: z.string().max(40),
  corPrimaria: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB."),
  corSecundaria: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB."),
  logoUrl: z
    .string()
    .max(500)
    .refine(
      (valor) => valor.length === 0 || isUrlValida(valor),
      "Informe uma URL valida.",
    ),
});

const clienteSchema = z.object({
  nome: z.string().min(2, "Informe o nome do cliente.").max(160),
  email: z
    .string()
    .max(256)
    .refine(
      (valor) => valor.length === 0 || z.email().safeParse(valor).success,
      "Informe um email valido.",
    ),
  telefone: z.string().max(40),
  documento: z.string().max(40),
  observacoes: z.string().max(1000),
});

const servicoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do servico.").max(160),
  descricao: z.string().max(1000),
  categoria: z.string().max(80),
  preco: z
    .number()
    .min(0, "Informe um preco maior ou igual a zero.")
    .max(9999999999.99, "Informe um preco menor."),
  unidade: z.enum(["Unico", "Mensal", "PorHora", "PorItem"]),
  tipo: z.enum(["Servico", "Pacote"]),
});

const propostaItemSchema = z.object({
  servicoId: z.string(),
  nome: z.string().min(2, "Informe o nome do item.").max(160),
  descricao: z.string().max(1000),
  quantidade: z
    .number()
    .min(0.01, "Informe uma quantidade maior que zero.")
    .max(9999999999.99, "Informe uma quantidade menor."),
  valorUnitario: z
    .number()
    .min(0, "Informe um valor maior ou igual a zero.")
    .max(9999999999.99, "Informe um valor menor."),
});

const propostaSchema = z.object({
  clienteId: z.string().min(1, "Selecione um cliente."),
  titulo: z.string().min(2, "Informe o titulo da proposta.").max(160),
  introducao: z.string().max(1000),
  observacoes: z.string().max(1000),
  validadeDias: z
    .number()
    .min(1, "Validade minima de 1 dia.")
    .max(365, "Validade maxima de 365 dias."),
  itens: z
    .array(propostaItemSchema)
    .min(1, "Adicione pelo menos um item.")
    .max(50, "Limite de 50 itens."),
});

type AuthMode = "cadastro" | "login";
type AppView = "dashboard" | "clientes" | "servicos" | "propostas" | "conta";
type PerfilContaFormInput = z.infer<typeof perfilContaSchema>;
type ClienteFormInput = z.infer<typeof clienteSchema>;
type ServicoFormInput = z.infer<typeof servicoSchema>;
type PropostaFormInput = z.infer<typeof propostaSchema>;
type PropostaPreviewInput = Partial<Omit<PropostaFormInput, "itens">> & {
  itens?: Array<Partial<PropostaFormInput["itens"][number]>>;
};

const tokenStorageKey = "emprely.accessToken";
const perfilContaDefaultValues: PerfilContaFormInput = {
  nomeComercial: "Emprely",
  emailContato: "",
  telefoneContato: "",
  siteUrl: "",
  instagram: "",
  documento: "",
  corPrimaria: "#2563EB",
  corSecundaria: "#14B8A6",
  logoUrl: "",
};

const clienteDefaultValues: ClienteFormInput = {
  nome: "",
  email: "",
  telefone: "",
  documento: "",
  observacoes: "",
};

const servicoDefaultValues: ServicoFormInput = {
  nome: "",
  descricao: "",
  categoria: "",
  preco: 0,
  unidade: "Unico",
  tipo: "Servico",
};

const propostaDefaultValues: PropostaFormInput = {
  clienteId: "",
  titulo: "",
  introducao: "",
  observacoes: "",
  validadeDias: 7,
  itens: [],
};

export default function App() {
  const queryClient = useQueryClient();
  const [authMode, setAuthMode] = useState<AuthMode>("cadastro");
  const [appView, setAppView] = useState<AppView>("dashboard");
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    window.localStorage.getItem(tokenStorageKey),
  );
  const [authUsuario, setAuthUsuario] = useState<AuthUsuarioResponse | null>(
    null,
  );
  const [perfilMensagem, setPerfilMensagem] = useState<string | null>(null);
  const [clienteMensagem, setClienteMensagem] = useState<string | null>(null);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(
    null,
  );
  const [servicoMensagem, setServicoMensagem] = useState<string | null>(null);
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<string | null>(
    null,
  );
  const [propostaMensagem, setPropostaMensagem] = useState<string | null>(null);
  const [propostaSelecionadaId, setPropostaSelecionadaId] = useState<string | null>(
    null,
  );
  const [servicoParaAdicionarId, setServicoParaAdicionarId] = useState("");

  const usuarioAtualQuery = useQuery({
    queryKey: ["usuario-atual", accessToken],
    queryFn: () => getUsuarioAtual(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const perfilContaQuery = useQuery({
    queryKey: ["perfil-conta", accessToken],
    queryFn: () => getPerfilContaAtual(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const clientesQuery = useQuery({
    queryKey: ["clientes", accessToken],
    queryFn: () => getClientesConta(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const servicosQuery = useQuery({
    queryKey: ["servicos", accessToken],
    queryFn: () => getServicosConta(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const propostasQuery = useQuery({
    queryKey: ["propostas", accessToken],
    queryFn: () => getPropostasConta(accessToken!),
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

  const perfilForm = useForm<PerfilContaFormInput>({
    resolver: zodResolver(perfilContaSchema),
    defaultValues: perfilContaDefaultValues,
  });

  const clienteForm = useForm<ClienteFormInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: clienteDefaultValues,
  });

  const servicoForm = useForm<ServicoFormInput>({
    resolver: zodResolver(servicoSchema),
    defaultValues: servicoDefaultValues,
  });

  const propostaForm = useForm<PropostaFormInput>({
    resolver: zodResolver(propostaSchema),
    defaultValues: propostaDefaultValues,
  });

  const {
    fields: propostaItemFields,
    append: appendPropostaItem,
    remove: removePropostaItem,
  } = useFieldArray({
    control: propostaForm.control,
    name: "itens",
  });

  const { reset: resetPerfilForm } = perfilForm;
  const { reset: resetClienteForm } = clienteForm;
  const { reset: resetServicoForm } = servicoForm;
  const { reset: resetPropostaForm } = propostaForm;

  const clientes = clientesQuery.data ?? [];
  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === clienteSelecionadoId,
  );
  const servicos = servicosQuery.data ?? [];
  const servicoSelecionado = servicos.find(
    (servico) => servico.id === servicoSelecionadoId,
  );
  const propostas = propostasQuery.data ?? [];
  const propostaSelecionada = propostas.find(
    (proposta) => proposta.id === propostaSelecionadaId,
  );
  const propostaPreview = useWatch({
    control: propostaForm.control,
  });
  const propostaItensPreview = propostaPreview.itens ?? [];
  const propostaTotalPreview = calcularTotalItens(propostaItensPreview);
  const clientePreview = clientes.find(
    (cliente) => cliente.id === propostaPreview.clienteId,
  );

  useEffect(() => {
    if (perfilContaQuery.data) {
      resetPerfilForm(mapPerfilContaForm(perfilContaQuery.data));
    }
  }, [perfilContaQuery.data, resetPerfilForm]);

  useEffect(() => {
    if (clienteSelecionado) {
      resetClienteForm(mapClienteForm(clienteSelecionado));
    }
  }, [clienteSelecionado, resetClienteForm]);

  useEffect(() => {
    if (servicoSelecionado) {
      resetServicoForm(mapServicoForm(servicoSelecionado));
    }
  }, [servicoSelecionado, resetServicoForm]);

  useEffect(() => {
    if (propostaSelecionada) {
      resetPropostaForm(mapPropostaForm(propostaSelecionada));
    }
  }, [propostaSelecionada, resetPropostaForm]);

  const registerMutation = useMutation({
    mutationFn: registerUsuario,
    onSuccess: handleAuthSuccess,
  });

  const loginMutation = useMutation({
    mutationFn: loginUsuario,
    onSuccess: handleAuthSuccess,
  });

  const perfilMutation = useMutation({
    mutationFn: (input: PerfilContaFormInput) =>
      updatePerfilConta(buildPerfilContaPayload(input), accessToken!),
    onSuccess: (response) => {
      queryClient.setQueryData(["perfil-conta", accessToken], response);
      resetPerfilForm(mapPerfilContaForm(response));
      setPerfilMensagem("Perfil salvo.");
    },
  });

  const salvarClienteMutation = useMutation({
    mutationFn: (input: ClienteFormInput) => {
      const payload = buildClientePayload(input);

      if (clienteSelecionadoId) {
        return updateCliente(clienteSelecionadoId, payload, accessToken!);
      }

      return createCliente(payload, accessToken!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
      resetClienteForm(clienteDefaultValues);
      setClienteSelecionadoId(null);
      setClienteMensagem("Cliente salvo.");
    },
  });

  const arquivarClienteMutation = useMutation({
    mutationFn: (id: string) => deleteCliente(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
      resetClienteForm(clienteDefaultValues);
      setClienteSelecionadoId(null);
      setClienteMensagem("Cliente arquivado.");
    },
  });

  const salvarServicoMutation = useMutation({
    mutationFn: (input: ServicoFormInput) => {
      const payload = buildServicoPayload(input);

      if (servicoSelecionadoId) {
        return updateServico(servicoSelecionadoId, payload, accessToken!);
      }

      return createServico(payload, accessToken!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["servicos", accessToken] });
      resetServicoForm(servicoDefaultValues);
      setServicoSelecionadoId(null);
      setServicoMensagem("Servico salvo.");
    },
  });

  const arquivarServicoMutation = useMutation({
    mutationFn: (id: string) => deleteServico(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["servicos", accessToken] });
      resetServicoForm(servicoDefaultValues);
      setServicoSelecionadoId(null);
      setServicoMensagem("Servico arquivado.");
    },
  });

  const salvarPropostaMutation = useMutation({
    mutationFn: (input: PropostaFormInput) => {
      const payload = buildPropostaPayload(input);

      if (propostaSelecionadaId) {
        return updateProposta(propostaSelecionadaId, payload, accessToken!);
      }

      return createProposta(payload, accessToken!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
      resetPropostaForm(propostaDefaultValues);
      setPropostaSelecionadaId(null);
      setServicoParaAdicionarId("");
      setPropostaMensagem("Proposta salva.");
    },
  });

  const arquivarPropostaMutation = useMutation({
    mutationFn: (id: string) => deleteProposta(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
      resetPropostaForm(propostaDefaultValues);
      setPropostaSelecionadaId(null);
      setServicoParaAdicionarId("");
      setPropostaMensagem("Proposta arquivada.");
    },
  });

  function handleAuthSuccess(response: AuthUsuarioResponse) {
    window.localStorage.setItem(tokenStorageKey, response.accessToken);
    setAccessToken(response.accessToken);
    setAuthUsuario(response);
    setPerfilMensagem(null);
    setClienteMensagem(null);
    setServicoMensagem(null);
    setPropostaMensagem(null);
    setAppView("dashboard");
  }

  function logoutUsuario() {
    window.localStorage.removeItem(tokenStorageKey);
    setAccessToken(null);
    setAuthUsuario(null);
    setPerfilMensagem(null);
    setClienteMensagem(null);
    setServicoMensagem(null);
    setPropostaMensagem(null);
    setClienteSelecionadoId(null);
    setServicoSelecionadoId(null);
    setPropostaSelecionadaId(null);
    setServicoParaAdicionarId("");
    setAppView("dashboard");
    queryClient.removeQueries({ queryKey: ["usuario-atual"] });
    queryClient.removeQueries({ queryKey: ["perfil-conta"] });
    queryClient.removeQueries({ queryKey: ["clientes"] });
    queryClient.removeQueries({ queryKey: ["servicos"] });
    queryClient.removeQueries({ queryKey: ["propostas"] });
  }

  function novoCliente() {
    setClienteSelecionadoId(null);
    setClienteMensagem(null);
    resetClienteForm(clienteDefaultValues);
  }

  function novoServico() {
    setServicoSelecionadoId(null);
    setServicoMensagem(null);
    resetServicoForm(servicoDefaultValues);
  }

  function novaProposta() {
    setPropostaSelecionadaId(null);
    setPropostaMensagem(null);
    setServicoParaAdicionarId("");
    resetPropostaForm(propostaDefaultValues);
  }

  function adicionarServicoProposta() {
    const servico = servicos.find((item) => item.id === servicoParaAdicionarId);

    if (!servico) {
      return;
    }

    appendPropostaItem({
      servicoId: servico.id,
      nome: servico.nome,
      descricao: servico.descricao ?? "",
      quantidade: 1,
      valorUnitario: servico.preco,
    });
    setServicoParaAdicionarId("");
  }

  function adicionarItemLivreProposta() {
    appendPropostaItem({
      servicoId: "",
      nome: "Item personalizado",
      descricao: "",
      quantidade: 1,
      valorUnitario: 0,
    });
  }

  const usuario = authUsuario?.usuario ?? usuarioAtualQuery.data?.usuario;
  const conta = authUsuario?.conta ?? usuarioAtualQuery.data?.conta;
  const perfilConta = perfilContaQuery.data;
  const corPrimaria = useWatch({
    control: perfilForm.control,
    name: "corPrimaria",
  });
  const corSecundaria = useWatch({
    control: perfilForm.control,
    name: "corSecundaria",
  });
  const nomeComercialPreview = useWatch({
    control: perfilForm.control,
    name: "nomeComercial",
  });
  const instagramPreview = useWatch({
    control: perfilForm.control,
    name: "instagram",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Emprely</p>
            <h1 className="font-heading text-2xl font-semibold leading-8 md:text-3xl">
              Orcamentos
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
            {[
              { label: "Dashboard", view: "dashboard" as const },
              { label: "Clientes", view: "clientes" as const },
              { label: "Servicos", view: "servicos" as const },
              { label: "Propostas", view: "propostas" as const },
              { label: "Conta", view: "conta" as const },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setAppView(item.view)}
                className={`flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium transition ${
                  appView === item.view
                    ? "bg-slate-100 text-foreground"
                    : "text-muted hover:bg-slate-100 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <section className="space-y-5">
            {usuario && conta ? (
              <>
                <section className="rounded-md border border-border bg-surface p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-medium text-accent">Sessao ativa</p>
                      <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                        {usuario.nome}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted">
                      <Building2 size={18} aria-hidden="true" />
                      {conta.nome}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <InfoLinha label="Email" value={usuario.email} />
                    <InfoLinha label="Conta" value={conta.nome} />
                    <InfoLinha label="Papel" value={conta.papel} />
                  </div>
                </section>

                {appView === "clientes" ? (
                  <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Clientes
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {clienteSelecionado ? "Editar cliente" : "Novo cliente"}
                          </h2>
                        </div>
                        {clienteSelecionado ? (
                          <button
                            type="button"
                            onClick={novoCliente}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                          >
                            <Plus size={16} aria-hidden="true" />
                            Novo
                          </button>
                        ) : null}
                      </div>

                      <form
                        className="mt-5 space-y-4"
                        onSubmit={clienteForm.handleSubmit((input) =>
                          salvarClienteMutation.mutate(input),
                        )}
                      >
                        <CampoTexto
                          label="Nome"
                          error={clienteForm.formState.errors.nome?.message}
                          {...clienteForm.register("nome")}
                        />
                        <CampoTexto
                          label="Email"
                          type="email"
                          error={clienteForm.formState.errors.email?.message}
                          {...clienteForm.register("email")}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <CampoTexto
                            label="Telefone"
                            error={clienteForm.formState.errors.telefone?.message}
                            {...clienteForm.register("telefone")}
                          />
                          <CampoTexto
                            label="Documento"
                            error={clienteForm.formState.errors.documento?.message}
                            {...clienteForm.register("documento")}
                          />
                        </div>
                        <CampoTextarea
                          label="Observacoes"
                          rows={4}
                          error={clienteForm.formState.errors.observacoes?.message}
                          {...clienteForm.register("observacoes")}
                        />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            disabled={salvarClienteMutation.isPending}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={18} aria-hidden="true" />
                            {salvarClienteMutation.isPending
                              ? "Salvando..."
                              : "Salvar cliente"}
                          </button>
                          {clienteSelecionado ? (
                            <button
                              type="button"
                              onClick={novoCliente}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                            >
                              <X size={18} aria-hidden="true" />
                              Cancelar
                            </button>
                          ) : null}
                        </div>
                        <MensagemSucesso mensagem={clienteMensagem} />
                        <MensagemErro error={salvarClienteMutation.error} />
                      </form>
                    </div>

                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-accent">
                            Base ativa
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {clientes.length} cliente{clientes.length === 1 ? "" : "s"}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={novoCliente}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Novo cliente
                        </button>
                      </div>

                      {clientesQuery.isLoading ? (
                        <p className="mt-5 text-sm text-muted">
                          Carregando clientes...
                        </p>
                      ) : null}

                      {clientesQuery.isError ? (
                        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          Nao foi possivel carregar clientes.
                        </p>
                      ) : null}

                      {!clientesQuery.isLoading && clientes.length === 0 ? (
                        <div className="mt-5 rounded-md border border-dashed border-border p-5 text-sm text-muted">
                          Nenhum cliente ativo cadastrado.
                        </div>
                      ) : null}

                      <div className="mt-5 space-y-3">
                        {clientes.map((cliente) => (
                          <article
                            key={cliente.id}
                            className="rounded-md border border-border p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <h3 className="font-heading text-lg font-semibold">
                                  {cliente.nome}
                                </h3>
                                <div className="mt-2 space-y-1 text-sm text-muted">
                                  <p>{cliente.email ?? "Email nao informado"}</p>
                                  <p>{cliente.telefone ?? "Telefone nao informado"}</p>
                                  {cliente.documento ? <p>{cliente.documento}</p> : null}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setClienteSelecionadoId(cliente.id);
                                    setClienteMensagem(null);
                                  }}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                                >
                                  <Edit3 size={16} aria-hidden="true" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  disabled={arquivarClienteMutation.isPending}
                                  onClick={() =>
                                    arquivarClienteMutation.mutate(cliente.id)
                                  }
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Archive size={16} aria-hidden="true" />
                                  Arquivar
                                </button>
                              </div>
                            </div>
                            {cliente.observacoes ? (
                              <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
                                {cliente.observacoes}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                      <MensagemErro error={arquivarClienteMutation.error} />
                    </div>
                  </section>
                ) : null}

                {appView === "servicos" ? (
                  <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Servicos
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {servicoSelecionado ? "Editar servico" : "Novo servico"}
                          </h2>
                        </div>
                        {servicoSelecionado ? (
                          <button
                            type="button"
                            onClick={novoServico}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                          >
                            <Plus size={16} aria-hidden="true" />
                            Novo
                          </button>
                        ) : null}
                      </div>

                      <form
                        className="mt-5 space-y-4"
                        onSubmit={servicoForm.handleSubmit((input) =>
                          salvarServicoMutation.mutate(input),
                        )}
                      >
                        <CampoTexto
                          label="Nome"
                          error={servicoForm.formState.errors.nome?.message}
                          {...servicoForm.register("nome")}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <CampoTexto
                            label="Categoria"
                            error={servicoForm.formState.errors.categoria?.message}
                            {...servicoForm.register("categoria")}
                          />
                          <CampoTexto
                            label="Preco"
                            type="number"
                            min="0"
                            step="0.01"
                            error={servicoForm.formState.errors.preco?.message}
                            {...servicoForm.register("preco", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <CampoSelect
                            label="Unidade"
                            error={servicoForm.formState.errors.unidade?.message}
                            {...servicoForm.register("unidade")}
                          >
                            <option value="Unico">Unico</option>
                            <option value="Mensal">Mensal</option>
                            <option value="PorHora">Por hora</option>
                            <option value="PorItem">Por item</option>
                          </CampoSelect>
                          <CampoSelect
                            label="Tipo"
                            error={servicoForm.formState.errors.tipo?.message}
                            {...servicoForm.register("tipo")}
                          >
                            <option value="Servico">Servico</option>
                            <option value="Pacote">Pacote</option>
                          </CampoSelect>
                        </div>
                        <CampoTextarea
                          label="Descricao"
                          rows={4}
                          error={servicoForm.formState.errors.descricao?.message}
                          {...servicoForm.register("descricao")}
                        />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            disabled={salvarServicoMutation.isPending}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={18} aria-hidden="true" />
                            {salvarServicoMutation.isPending
                              ? "Salvando..."
                              : "Salvar servico"}
                          </button>
                          {servicoSelecionado ? (
                            <button
                              type="button"
                              onClick={novoServico}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                            >
                              <X size={18} aria-hidden="true" />
                              Cancelar
                            </button>
                          ) : null}
                        </div>
                        <MensagemSucesso mensagem={servicoMensagem} />
                        <MensagemErro error={salvarServicoMutation.error} />
                      </form>
                    </div>

                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-accent">
                            Catalogo ativo
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {servicos.length} servico{servicos.length === 1 ? "" : "s"}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={novoServico}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Novo servico
                        </button>
                      </div>

                      {servicosQuery.isLoading ? (
                        <p className="mt-5 text-sm text-muted">
                          Carregando servicos...
                        </p>
                      ) : null}

                      {servicosQuery.isError ? (
                        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          Nao foi possivel carregar servicos.
                        </p>
                      ) : null}

                      {!servicosQuery.isLoading && servicos.length === 0 ? (
                        <div className="mt-5 rounded-md border border-dashed border-border p-5 text-sm text-muted">
                          Nenhum servico ativo cadastrado.
                        </div>
                      ) : null}

                      <div className="mt-5 space-y-3">
                        {servicos.map((servico) => (
                          <article
                            key={servico.id}
                            className="rounded-md border border-border p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-heading text-lg font-semibold">
                                    {servico.nome}
                                  </h3>
                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">
                                    {servico.tipo}
                                  </span>
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-muted">
                                  <p>{servico.categoria ?? "Categoria nao informada"}</p>
                                  <p>
                                    {formatMoney(servico.preco)} /{" "}
                                    {formatUnidadeServico(servico.unidade)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setServicoSelecionadoId(servico.id);
                                    setServicoMensagem(null);
                                  }}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                                >
                                  <Edit3 size={16} aria-hidden="true" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  disabled={arquivarServicoMutation.isPending}
                                  onClick={() =>
                                    arquivarServicoMutation.mutate(servico.id)
                                  }
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Archive size={16} aria-hidden="true" />
                                  Arquivar
                                </button>
                              </div>
                            </div>
                            {servico.descricao ? (
                              <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
                                {servico.descricao}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                      <MensagemErro error={arquivarServicoMutation.error} />
                    </div>
                  </section>
                ) : null}

                {appView === "propostas" ? (
                  <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Propostas
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {propostaSelecionada
                              ? "Editar proposta"
                              : "Nova proposta"}
                          </h2>
                        </div>
                        {propostaSelecionada ? (
                          <button
                            type="button"
                            onClick={novaProposta}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                          >
                            <Plus size={16} aria-hidden="true" />
                            Nova
                          </button>
                        ) : null}
                      </div>

                      {clientes.length === 0 ? (
                        <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          Cadastre um cliente antes de criar propostas.
                        </p>
                      ) : null}

                      {servicos.length === 0 ? (
                        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          Cadastre um servico ou use item livre para montar o primeiro rascunho.
                        </p>
                      ) : null}

                      <form
                        className="mt-5 space-y-4"
                        onSubmit={propostaForm.handleSubmit((input) =>
                          salvarPropostaMutation.mutate(input),
                        )}
                      >
                        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                          <CampoSelect
                            label="Cliente"
                            error={propostaForm.formState.errors.clienteId?.message}
                            {...propostaForm.register("clienteId")}
                          >
                            <option value="">Selecione</option>
                            {clientes.map((cliente) => (
                              <option key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                              </option>
                            ))}
                          </CampoSelect>
                          <CampoTexto
                            label="Validade"
                            type="number"
                            min="1"
                            max="365"
                            error={propostaForm.formState.errors.validadeDias?.message}
                            {...propostaForm.register("validadeDias", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <CampoTexto
                          label="Titulo"
                          error={propostaForm.formState.errors.titulo?.message}
                          {...propostaForm.register("titulo")}
                        />
                        <CampoTextarea
                          label="Introducao"
                          rows={3}
                          error={propostaForm.formState.errors.introducao?.message}
                          {...propostaForm.register("introducao")}
                        />
                        <CampoTextarea
                          label="Observacoes"
                          rows={3}
                          error={propostaForm.formState.errors.observacoes?.message}
                          {...propostaForm.register("observacoes")}
                        />

                        <div className="rounded-md border border-border p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <div className="flex-1">
                              <CampoSelect
                                label="Adicionar do catalogo"
                                value={servicoParaAdicionarId}
                                onChange={(event) =>
                                  setServicoParaAdicionarId(event.target.value)
                                }
                              >
                                <option value="">Selecione um servico</option>
                                {servicos.map((servico) => (
                                  <option key={servico.id} value={servico.id}>
                                    {servico.nome} - {formatMoney(servico.preco)}
                                  </option>
                                ))}
                              </CampoSelect>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={adicionarServicoProposta}
                                disabled={!servicoParaAdicionarId}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Plus size={16} aria-hidden="true" />
                                Adicionar
                              </button>
                              <button
                                type="button"
                                onClick={adicionarItemLivreProposta}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                              >
                                <Plus size={16} aria-hidden="true" />
                                Livre
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {propostaItemFields.map((field, index) => {
                              const itemPreview = propostaItensPreview[index];
                              const itemTotal = calcularTotalItens(
                                itemPreview ? [itemPreview] : [],
                              );

                              return (
                                <article
                                  key={field.id}
                                  className="rounded-md border border-border p-3"
                                >
                                  <input
                                    type="hidden"
                                    {...propostaForm.register(
                                      `itens.${index}.servicoId` as const,
                                    )}
                                  />
                                  <div className="grid gap-3 md:grid-cols-[1fr_110px_140px]">
                                    <CampoTexto
                                      label="Item"
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.nome?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.nome` as const,
                                      )}
                                    />
                                    <CampoTexto
                                      label="Qtd"
                                      type="number"
                                      min="0.01"
                                      step="0.01"
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.quantidade?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.quantidade` as const,
                                        { valueAsNumber: true },
                                      )}
                                    />
                                    <CampoTexto
                                      label="Valor"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.valorUnitario?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.valorUnitario` as const,
                                        { valueAsNumber: true },
                                      )}
                                    />
                                  </div>
                                  <div className="mt-3">
                                    <CampoTextarea
                                      label="Descricao"
                                      rows={2}
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.descricao?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.descricao` as const,
                                      )}
                                    />
                                  </div>
                                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-sm font-semibold text-muted">
                                      Total do item: {formatMoney(itemTotal)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removePropostaItem(index)}
                                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:border-red-400"
                                    >
                                      <X size={16} aria-hidden="true" />
                                      Remover
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>

                          {typeof propostaForm.formState.errors.itens?.message ===
                          "string" ? (
                            <span className="mt-3 block text-sm text-red-600">
                              {propostaForm.formState.errors.itens.message}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-3 rounded-md bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted">
                              Total da proposta
                            </p>
                            <strong className="mt-1 block text-2xl font-semibold">
                              {formatMoney(propostaTotalPreview)}
                            </strong>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <button
                              type="submit"
                              disabled={
                                salvarPropostaMutation.isPending ||
                                clientes.length === 0
                              }
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Save size={18} aria-hidden="true" />
                              {salvarPropostaMutation.isPending
                                ? "Salvando..."
                                : "Salvar proposta"}
                            </button>
                            {propostaSelecionada ? (
                              <button
                                type="button"
                                onClick={novaProposta}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                              >
                                <X size={18} aria-hidden="true" />
                                Cancelar
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <MensagemSucesso mensagem={propostaMensagem} />
                        <MensagemErro error={salvarPropostaMutation.error} />
                      </form>
                    </div>

                    <div className="space-y-5">
                      <PreviewPropostaVisual
                        perfilConta={perfilConta}
                        contaNome={conta.nome}
                        cliente={clientePreview}
                        proposta={propostaPreview}
                        total={propostaTotalPreview}
                      />

                      <div className="rounded-md border border-border bg-surface p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent">
                              Historico ativo
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              {propostas.length} proposta
                              {propostas.length === 1 ? "" : "s"}
                            </h2>
                          </div>
                          <button
                            type="button"
                            onClick={novaProposta}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Plus size={16} aria-hidden="true" />
                            Nova proposta
                          </button>
                        </div>

                        {propostasQuery.isLoading ? (
                          <p className="mt-5 text-sm text-muted">
                            Carregando propostas...
                          </p>
                        ) : null}

                        {propostasQuery.isError ? (
                          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            Nao foi possivel carregar propostas.
                          </p>
                        ) : null}

                        {!propostasQuery.isLoading && propostas.length === 0 ? (
                          <div className="mt-5 rounded-md border border-dashed border-border p-5 text-sm text-muted">
                            Nenhuma proposta ativa cadastrada.
                          </div>
                        ) : null}

                        <div className="mt-5 space-y-3">
                          {propostas.map((proposta) => (
                            <article
                              key={proposta.id}
                              className="rounded-md border border-border p-4"
                            >
                              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <h3 className="font-heading text-lg font-semibold">
                                    {proposta.titulo}
                                  </h3>
                                  <div className="mt-2 space-y-1 text-sm text-muted">
                                    <p>{proposta.clienteNome}</p>
                                    <p>
                                      {proposta.itens.length} item
                                      {proposta.itens.length === 1 ? "" : "s"} -{" "}
                                      {formatMoney(proposta.total)}
                                    </p>
                                    <p>Status: {proposta.status}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPropostaSelecionadaId(proposta.id);
                                      setPropostaMensagem(null);
                                    }}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                                  >
                                    <Edit3 size={16} aria-hidden="true" />
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    disabled={arquivarPropostaMutation.isPending}
                                    onClick={() =>
                                      arquivarPropostaMutation.mutate(proposta.id)
                                    }
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Archive size={16} aria-hidden="true" />
                                    Arquivar
                                  </button>
                                </div>
                              </div>
                              {proposta.introducao ? (
                                <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
                                  {proposta.introducao}
                                </p>
                              ) : null}
                            </article>
                          ))}
                        </div>
                        <MensagemErro error={arquivarPropostaMutation.error} />
                      </div>
                    </div>
                  </section>
                ) : null}

                {appView === "conta" ? (
                  <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Configuracoes da conta
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Perfil profissional e marca
                          </h2>
                        </div>
                        <Settings className="text-muted" size={22} aria-hidden="true" />
                      </div>

                      {perfilContaQuery.isLoading ? (
                        <p className="mt-5 text-sm text-muted">Carregando perfil...</p>
                      ) : null}

                      {perfilContaQuery.isError ? (
                        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          Nao foi possivel carregar o perfil.
                        </p>
                      ) : null}

                      <form
                        className="mt-5 grid gap-4 md:grid-cols-2"
                        onSubmit={perfilForm.handleSubmit((input) =>
                          perfilMutation.mutate(input),
                        )}
                      >
                        <CampoTexto
                          label="Nome comercial"
                          error={perfilForm.formState.errors.nomeComercial?.message}
                          {...perfilForm.register("nomeComercial")}
                        />
                        <CampoTexto
                          label="Email de contato"
                          type="email"
                          error={perfilForm.formState.errors.emailContato?.message}
                          {...perfilForm.register("emailContato")}
                        />
                        <CampoTexto
                          label="Telefone"
                          error={perfilForm.formState.errors.telefoneContato?.message}
                          {...perfilForm.register("telefoneContato")}
                        />
                        <CampoTexto
                          label="Site"
                          type="url"
                          error={perfilForm.formState.errors.siteUrl?.message}
                          {...perfilForm.register("siteUrl")}
                        />
                        <CampoTexto
                          label="Instagram"
                          error={perfilForm.formState.errors.instagram?.message}
                          {...perfilForm.register("instagram")}
                        />
                        <CampoTexto
                          label="Documento"
                          error={perfilForm.formState.errors.documento?.message}
                          {...perfilForm.register("documento")}
                        />
                        <CampoTexto
                          label="Cor primaria"
                          type="color"
                          error={perfilForm.formState.errors.corPrimaria?.message}
                          {...perfilForm.register("corPrimaria")}
                        />
                        <CampoTexto
                          label="Cor secundaria"
                          type="color"
                          error={perfilForm.formState.errors.corSecundaria?.message}
                          {...perfilForm.register("corSecundaria")}
                        />
                        <div className="md:col-span-2">
                          <CampoTexto
                            label="Logo URL"
                            type="url"
                            error={perfilForm.formState.errors.logoUrl?.message}
                            {...perfilForm.register("logoUrl")}
                          />
                        </div>
                        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            disabled={perfilMutation.isPending}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={18} aria-hidden="true" />
                            {perfilMutation.isPending
                              ? "Salvando..."
                              : "Salvar perfil"}
                          </button>
                          <MensagemSucesso mensagem={perfilMensagem} />
                          <MensagemErro error={perfilMutation.error} />
                        </div>
                      </form>
                    </div>

                    <aside className="rounded-md border border-border bg-surface p-5">
                      <div className="flex items-center gap-2">
                        <Palette className="text-primary" size={22} aria-hidden="true" />
                        <h2 className="font-heading text-xl font-semibold leading-7">
                          Marca
                        </h2>
                      </div>
                      <div
                        className="mt-5 rounded-md border border-border p-4 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
                        }}
                      >
                        <p className="text-sm font-medium opacity-90">Preview</p>
                        <strong className="mt-3 block text-2xl">
                          {nomeComercialPreview || conta.nome}
                        </strong>
                        <span className="mt-1 block text-sm opacity-90">
                          {instagramPreview || "@emprely"}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-muted">
                        <p>Primaria: {normalizarHexPreview(corPrimaria)}</p>
                        <p>Secundaria: {normalizarHexPreview(corSecundaria)}</p>
                        <p>Atualizado: {formatDataPerfil(perfilConta)}</p>
                      </div>
                    </aside>
                  </section>
                ) : null}

                {appView === "dashboard" ? (
                  <DashboardContent
                    propostasTotal={propostas.length}
                    clientesTotal={clientes.length}
                    servicosTotal={servicos.length}
                    onNovaProposta={() => setAppView("propostas")}
                    onCadastrarCliente={() => setAppView("clientes")}
                    onSalvarServico={() => setAppView("servicos")}
                  />
                ) : null}
              </>
            ) : (
              <AuthContent
                authMode={authMode}
                setAuthMode={setAuthMode}
                registerForm={registerForm}
                loginForm={loginForm}
                registerMutation={registerMutation}
                loginMutation={loginMutation}
                usuarioAtualError={usuarioAtualQuery.isError}
              />
            )}
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
  ({ label, error, type, ...props }, ref) => {
    return (
      <label className="block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <input
          ref={ref}
          type={type}
          className={`mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 ${
            type === "color" ? "p-1" : ""
          }`}
          {...props}
        />
        {error ? (
          <span className="mt-1 block text-sm text-red-600">{error}</span>
        ) : null}
      </label>
    );
  },
);

CampoTexto.displayName = "CampoTexto";

type CampoSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

const CampoSelect = forwardRef<HTMLSelectElement, CampoSelectProps>(
  ({ label, error, children, ...props }, ref) => {
    return (
      <label className="block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <select
          ref={ref}
          className="mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          {...props}
        >
          {children}
        </select>
        {error ? (
          <span className="mt-1 block text-sm text-red-600">{error}</span>
        ) : null}
      </label>
    );
  },
);

CampoSelect.displayName = "CampoSelect";

type CampoTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

const CampoTextarea = forwardRef<HTMLTextAreaElement, CampoTextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <label className="block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <textarea
          ref={ref}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          {...props}
        />
        {error ? (
          <span className="mt-1 block text-sm text-red-600">{error}</span>
        ) : null}
      </label>
    );
  },
);

CampoTextarea.displayName = "CampoTextarea";

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

function MensagemSucesso({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) {
    return null;
  }

  return (
    <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      {mensagem}
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

function PreviewPropostaVisual({
  perfilConta,
  contaNome,
  cliente,
  proposta,
  total,
}: {
  perfilConta: PerfilContaResponse | undefined;
  contaNome: string;
  cliente: ClienteResponse | undefined;
  proposta: PropostaPreviewInput;
  total: number;
}) {
  const corPrimaria = normalizarHexPreview(
    perfilConta?.corPrimaria ?? "#2563EB",
  );
  const corSecundaria = normalizarHexPreview(
    perfilConta?.corSecundaria ?? "#14B8A6",
  );
  const nomeMarca = perfilConta?.nomeComercial?.trim() || contaNome;
  const titulo = proposta.titulo?.trim() || "Proposta comercial";
  const introducao =
    proposta.introducao?.trim() ||
    "Preencha a introducao para apresentar o contexto da proposta.";
  const observacoes = proposta.observacoes?.trim();
  const itens = proposta.itens ?? [];
  const validadeTexto = formatValidadeProposta(proposta.validadeDias);
  const contatoMarca = buildContatoMarca(perfilConta);

  return (
    <section className="rounded-md border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Preview</p>
          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
            Orcamento visual
          </h2>
        </div>
        <FileText className="text-muted" size={22} aria-hidden="true" />
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-border bg-white">
        <div
          className="relative overflow-hidden px-5 py-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
          }}
        >
          <div className="absolute right-4 top-4 rounded-md bg-white/15 px-2 py-1 text-xs font-semibold">
            Emprely Trial
          </div>
          <div className="flex min-h-20 items-start gap-3 pr-28">
            {perfilConta?.logoUrl ? (
              <img
                src={perfilConta.logoUrl}
                alt=""
                className="h-12 w-12 rounded-md bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/15 text-lg font-semibold">
                {nomeMarca.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium opacity-90">{nomeMarca}</p>
              <h3 className="mt-2 font-heading text-2xl font-semibold leading-8">
                {titulo}
              </h3>
              {contatoMarca ? (
                <p className="mt-2 text-sm opacity-90">{contatoMarca}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative px-5 py-5">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="-rotate-12 select-none text-5xl font-semibold uppercase text-slate-100">
              Emprely
            </span>
          </div>
          <div className="relative space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoLinha
                label="Cliente"
                value={cliente?.nome ?? "Cliente nao selecionado"}
              />
              <InfoLinha label="Validade" value={validadeTexto} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted">
                Introducao
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {introducao}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2 text-xs font-semibold uppercase text-muted">
                <span>Itens</span>
                <span>Total</span>
              </div>
              <div className="space-y-3">
                {itens.length > 0 ? (
                  itens.map((item, index) => {
                    const itemTotal = calcularTotalItens([item]);

                    return (
                      <div
                        key={`${item.nome}-${index}`}
                        className="grid gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {item.nome?.trim() || "Item sem nome"}
                            </p>
                            {item.descricao?.trim() ? (
                              <p className="mt-1 text-xs leading-5 text-muted">
                                {item.descricao.trim()}
                              </p>
                            ) : null}
                          </div>
                          <strong className="whitespace-nowrap text-sm">
                            {formatMoney(itemTotal)}
                          </strong>
                        </div>
                        <p className="text-xs text-muted">
                          {formatQuantidade(item.quantidade)} x{" "}
                          {formatMoney(valorSeguro(item.valorUnitario))}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="rounded-md border border-dashed border-border px-3 py-3 text-sm text-muted">
                    Adicione itens para montar o orcamento.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-slate-950 px-4 py-3 text-white">
              <span className="text-sm font-medium">Total</span>
              <strong className="text-xl">{formatMoney(total)}</strong>
            </div>

            {observacoes ? (
              <div>
                <p className="text-xs font-medium uppercase text-muted">
                  Observacoes
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {observacoes}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardContent({
  propostasTotal,
  clientesTotal,
  servicosTotal,
  onNovaProposta,
  onCadastrarCliente,
  onSalvarServico,
}: {
  propostasTotal: number;
  clientesTotal: number;
  servicosTotal: number;
  onNovaProposta: () => void;
  onCadastrarCliente: () => void;
  onSalvarServico: () => void;
}) {
  const metricas = metricasDashboard.map((metrica) =>
    atualizarMetricaDashboard(
      metrica,
      propostasTotal,
      clientesTotal,
      servicosTotal,
    ),
  );

  return (
    <>
      <div className="rounded-md border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent">MVP funcional</p>
            <h2 className="font-heading text-xl font-semibold leading-7">
              Base pronta para cadastrar clientes, servicos e propostas.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Clientes cadastrados agora poderao ser vinculados ao fluxo de
              proposta no proximo incremento.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            <BadgeCheck size={18} aria-hidden="true" />
            Trial com marca d&apos;agua
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metricas.map((metrica) => (
          <article
            key={metrica.label}
            className="rounded-md border border-border bg-surface p-4"
          >
            <p className="text-sm font-medium text-muted">{metrica.label}</p>
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
          const isProposta = acao.title === "Nova proposta";
          const isCliente = acao.title === "Cadastrar cliente";
          const isServico = acao.title === "Salvar servico";

          return (
            <article
              key={acao.title}
              className="flex min-h-44 flex-col justify-between rounded-md border border-border bg-surface p-4"
            >
              <div>
                <Icon className="text-primary" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {acao.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {acao.description}
                </p>
              </div>
              <button
                onClick={
                  isProposta
                    ? onNovaProposta
                    : isCliente
                      ? onCadastrarCliente
                      : isServico
                        ? onSalvarServico
                        : undefined
                }
                className="mt-5 inline-flex h-10 items-center gap-2 self-start rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                Abrir
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}

function atualizarMetricaDashboard(
  metrica: (typeof metricasDashboard)[number],
  propostasTotal: number,
  clientesTotal: number,
  servicosTotal: number,
): (typeof metricasDashboard)[number] {
  if (metrica.label === "Propostas") {
    return {
      ...metrica,
      value: propostasTotal.toString(),
      detail: "Rascunhos ativos",
    };
  }

  if (metrica.label === "Clientes") {
    return {
      ...metrica,
      value: clientesTotal.toString(),
      detail: "Clientes ativos",
    };
  }

  if (metrica.label === "Servicos") {
    return {
      ...metrica,
      value: servicosTotal.toString(),
      detail: "Servicos ativos",
    };
  }

  return metrica;
}

function AuthContent({
  authMode,
  setAuthMode,
  registerForm,
  loginForm,
  registerMutation,
  loginMutation,
  usuarioAtualError,
}: {
  authMode: AuthMode;
  setAuthMode: (authMode: AuthMode) => void;
  registerForm: ReturnType<typeof useForm<RegisterUsuarioInput>>;
  loginForm: ReturnType<typeof useForm<LoginUsuarioInput>>;
  registerMutation: ReturnType<typeof useMutation<AuthUsuarioResponse, Error, RegisterUsuarioInput>>;
  loginMutation: ReturnType<typeof useMutation<AuthUsuarioResponse, Error, LoginUsuarioInput>>;
  usuarioAtualError: boolean;
}) {
  return (
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
              authMode === "login" ? "bg-white text-primary shadow-sm" : "text-muted"
            }`}
          >
            Login
          </button>
        </div>

        {authMode === "cadastro" ? (
          <form
            className="mt-5 space-y-4"
            onSubmit={registerForm.handleSubmit((input) =>
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
            onSubmit={loginForm.handleSubmit((input) =>
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
            <SubmitButton label="Entrar" loading={loginMutation.isPending} />
            <MensagemErro error={loginMutation.error} />
          </form>
        )}
        {usuarioAtualError ? (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Sessao expirada. Entre novamente.
          </p>
        ) : null}
      </div>

      <div className="rounded-md border border-border bg-surface p-5">
        <p className="text-sm font-medium text-primary">API local</p>
        <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
          Autenticacao, conta, clientes e servicos
        </h2>
        <div className="mt-5 space-y-3 text-sm text-muted">
          <p>POST /api/auth/register</p>
          <p>POST /api/auth/login</p>
          <p>GET /api/me</p>
          <p>GET /api/account</p>
          <p>GET /api/account/profile</p>
          <p>PUT /api/account/profile</p>
          <p>GET /api/customers</p>
          <p>POST /api/customers</p>
          <p>GET /api/services</p>
          <p>POST /api/services</p>
          <p>GET /api/proposals</p>
          <p>POST /api/proposals</p>
        </div>
      </div>
    </section>
  );
}

function mapPerfilContaForm(perfilConta: PerfilContaResponse): PerfilContaFormInput {
  return {
    nomeComercial: perfilConta.nomeComercial,
    emailContato: perfilConta.emailContato ?? "",
    telefoneContato: perfilConta.telefoneContato ?? "",
    siteUrl: perfilConta.siteUrl ?? "",
    instagram: perfilConta.instagram ?? "",
    documento: perfilConta.documento ?? "",
    corPrimaria: perfilConta.corPrimaria,
    corSecundaria: perfilConta.corSecundaria,
    logoUrl: perfilConta.logoUrl ?? "",
  };
}

function buildPerfilContaPayload(
  input: PerfilContaFormInput,
): UpdatePerfilContaInput {
  return {
    nomeComercial: input.nomeComercial.trim(),
    emailContato: normalizarOpcional(input.emailContato),
    telefoneContato: normalizarOpcional(input.telefoneContato),
    siteUrl: normalizarOpcional(input.siteUrl),
    instagram: normalizarOpcional(input.instagram),
    documento: normalizarOpcional(input.documento),
    corPrimaria: normalizarHexPreview(input.corPrimaria),
    corSecundaria: normalizarHexPreview(input.corSecundaria),
    logoUrl: normalizarOpcional(input.logoUrl),
  };
}

function mapClienteForm(cliente: ClienteResponse): ClienteFormInput {
  return {
    nome: cliente.nome,
    email: cliente.email ?? "",
    telefone: cliente.telefone ?? "",
    documento: cliente.documento ?? "",
    observacoes: cliente.observacoes ?? "",
  };
}

function buildClientePayload(
  input: ClienteFormInput,
): CreateClienteInput | UpdateClienteInput {
  return {
    nome: input.nome.trim(),
    email: normalizarOpcional(input.email),
    telefone: normalizarOpcional(input.telefone),
    documento: normalizarOpcional(input.documento),
    observacoes: normalizarOpcional(input.observacoes),
  };
}

function mapServicoForm(servico: ServicoResponse): ServicoFormInput {
  return {
    nome: servico.nome,
    descricao: servico.descricao ?? "",
    categoria: servico.categoria ?? "",
    preco: servico.preco,
    unidade: servico.unidade,
    tipo: servico.tipo,
  };
}

function buildServicoPayload(
  input: ServicoFormInput,
): CreateServicoInput | UpdateServicoInput {
  return {
    nome: input.nome.trim(),
    descricao: normalizarOpcional(input.descricao),
    categoria: normalizarOpcional(input.categoria),
    preco: input.preco,
    unidade: input.unidade as UnidadeServico,
    tipo: input.tipo as TipoServico,
  };
}

function mapPropostaForm(proposta: PropostaResponse): PropostaFormInput {
  return {
    clienteId: proposta.clienteId,
    titulo: proposta.titulo,
    introducao: proposta.introducao ?? "",
    observacoes: proposta.observacoes ?? "",
    validadeDias: proposta.validadeDias ?? 7,
    itens: proposta.itens.map((item) => ({
      servicoId: item.servicoId ?? "",
      nome: item.nome,
      descricao: item.descricao ?? "",
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    })),
  };
}

function buildPropostaPayload(
  input: PropostaFormInput,
): CreatePropostaInput | UpdatePropostaInput {
  return {
    clienteId: input.clienteId,
    titulo: input.titulo.trim(),
    introducao: normalizarOpcional(input.introducao),
    observacoes: normalizarOpcional(input.observacoes),
    validadeDias: input.validadeDias,
    itens: input.itens.map((item) => ({
      servicoId: normalizarOpcional(item.servicoId),
      nome: item.nome.trim(),
      descricao: normalizarOpcional(item.descricao),
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    })),
  };
}

function calcularTotalItens(
  itens: Array<{ quantidade?: number; valorUnitario?: number }>,
): number {
  return itens.reduce((total, item) => {
    const quantidade = valorSeguro(item.quantidade);
    const valorUnitario = valorSeguro(item.valorUnitario);

    return total + quantidade * valorUnitario;
  }, 0);
}

function valorSeguro(valor: number | undefined): number {
  return Number.isFinite(valor) ? valor ?? 0 : 0;
}

function formatQuantidade(valor: number | undefined): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(valorSeguro(valor));
}

function formatValidadeProposta(validadeDias: number | undefined): string {
  const dias = valorSeguro(validadeDias);

  if (dias <= 0) {
    return "Nao definida";
  }

  return `${dias} dia${dias === 1 ? "" : "s"}`;
}

function buildContatoMarca(perfilConta: PerfilContaResponse | undefined): string {
  if (!perfilConta) {
    return "";
  }

  return [
    perfilConta.emailContato,
    perfilConta.telefoneContato,
    perfilConta.instagram,
  ]
    .map((valor) => valor?.trim())
    .filter(Boolean)
    .join(" | ");
}

function normalizarOpcional(valor: string): string | null {
  const valorNormalizado = valor.trim();
  return valorNormalizado.length > 0 ? valorNormalizado : null;
}

function formatMoney(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatUnidadeServico(unidade: UnidadeServico): string {
  const labels: Record<UnidadeServico, string> = {
    Unico: "unico",
    Mensal: "mensal",
    PorHora: "hora",
    PorItem: "item",
  };

  return labels[unidade];
}

function normalizarHexPreview(valor: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(valor) ? valor.toUpperCase() : "#000000";
}

function formatDataPerfil(perfilConta: PerfilContaResponse | undefined): string {
  if (!perfilConta?.updatedAt) {
    return "Nao salvo";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(perfilConta.updatedAt));
}

function isUrlValida(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
