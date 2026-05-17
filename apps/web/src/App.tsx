import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronUp,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  HeartHandshake,
  Info,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  PackageCheck,
  Palette,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Printer,
  ReceiptText,
  RefreshCw,
  Rocket,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Tags,
  Target,
  Trash2,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type InputHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type SVGProps,
  type TextareaHTMLAttributes,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type {
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import {
  changeSenhaUsuario,
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
  resolveApiAssetUrl,
  updateCliente,
  updatePerfilConta,
  createProposta,
  deleteProposta,
  duplicateProposta,
  generateProposta,
  acceptProposta,
  getPropostasConta,
  rejectProposta,
  sendProposta,
  sessaoInvalidaEventName,
  uploadLogoPerfilConta,
  updateProposta,
  updateServico,
} from "@/lib/api";
import type {
  AuthUsuarioResponse,
  ChangeSenhaUsuarioInput,
  ContaAtualResponse,
  LoginUsuarioInput,
  RegisterUsuarioInput,
  UsuarioAtualResponse,
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
  PropostaStatus,
  PropostaTemplateVisual,
  UpdatePropostaInput,
} from "@/types/proposal";

const propostaTemplateVisualValores = [
  "ComercialMinimalista",
  "OrcamentoSimplificado",
  "PropostaCompleta",
  "LunaSocialStudio",
  "DarkGrowth",
  "InstagramPremium",
  "Claymorphism",
  "Emprely",
  "ExecutivoEditorial",
  "CorporativoBoard",
  "InstitucionalClean",
] as const satisfies readonly PropostaTemplateVisual[];

type PropostaTemplateVisualAtivo = (typeof propostaTemplateVisualValores)[number];

const propostaTemplateVisualDefault: PropostaTemplateVisualAtivo =
  "ComercialMinimalista";

const propostaTemplateVisualOpcoes: Array<{
  value: PropostaTemplateVisualAtivo;
  label: string;
  detalhe: string;
  coresEstaticas?: boolean;
}> = [
  {
    value: "ComercialMinimalista",
    label: "Comercial minimalista",
    detalhe: "Layout limpo com tabela e investimento em destaque.",
  },
  {
    value: "OrcamentoSimplificado",
    label: "Orçamento simplificado",
    detalhe: "Resumo objetivo para aprovação rápida.",
  },
  {
    value: "PropostaCompleta",
    label: "Proposta completa",
    detalhe: "Seções comerciais completas para proposta detalhada.",
  },
  {
    value: "LunaSocialStudio",
    label: "Luna social studio",
    detalhe: "Hero escuro com acentos vibrantes para social media.",
  },
  {
    value: "DarkGrowth",
    label: "Dark growth",
    detalhe: "Cabeçalho escuro com visual mais comercial.",
  },
  {
    value: "InstagramPremium",
    label: "Instagram premium",
    detalhe: "Template denso para social media e conteúdo.",
  },
  {
    value: "Claymorphism",
    label: "Claymorphism",
    detalhe: "Visual moderno com cards clay, volume suave e cores sólidas.",
  },
  {
    value: "Emprely",
    label: "Emprely",
    detalhe: "Layout alinhado à identidade visual do sistema Emprely.",
  },
  {
    value: "ExecutivoEditorial",
    label: "Executivo editorial",
    detalhe: "Documento sobrio, editorial e imponente para propostas premium.",
    coresEstaticas: true,
  },
  {
    value: "CorporativoBoard",
    label: "Corporativo board",
    detalhe: "Composicao executiva com bloco escuro, metricas e leitura direta.",
    coresEstaticas: true,
  },
  {
    value: "InstitucionalClean",
    label: "Institucional clean",
    detalhe: "Layout discreto, tecnico e muito limpo para contextos gerais.",
    coresEstaticas: true,
  },
];

const registerSchema = z.object({
  nome: z.string().trim().min(1, "Este campo é obrigatório."),
  email: z.string().trim().email("Digite um e-mail válido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  telefone: z
    .string()
    .trim()
    .min(1, "Este campo é obrigatório.")
    .max(40)
    .refine(
      (valor) => isTelefoneWhatsappValido(valor),
      "Informe DDD e número, com ou sem prefixo 55.",
    ),
  nomeConta: z.string().trim().min(1, "Este campo é obrigatório."),
});

const loginSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
  senha: z.string().min(1, "Este campo é obrigatório."),
});

const senhaUsuarioSchema = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual."),
    novaSenha: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres."),
    confirmarNovaSenha: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((input) => input.novaSenha === input.confirmarNovaSenha, {
    message: "A confirmacao deve ser igual a nova senha.",
    path: ["confirmarNovaSenha"],
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
  corSistemaPrimaria: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB."),
  corSistemaSecundaria: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB."),
  logoUrl: z
    .string()
    .max(500)
    .refine(
      (valor) => isLogoUrlPerfilValida(valor),
      "Envie a imagem pelo upload ou use uma URL valida.",
    ),
  templateVisualPadrao: z.enum(propostaTemplateVisualValores),
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
  telefone: z
    .string()
    .max(40)
    .refine(
      (valor) => isTelefoneWhatsappValido(valor),
      "Informe DDD e número, com ou sem prefixo 55.",
    ),
  documento: z.string().max(40),
  observacoes: z.string().max(1000),
});

const clienteRapidoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do cliente.").max(160),
  email: z
    .string()
    .max(256)
    .refine(
      (valor) => valor.length === 0 || z.email().safeParse(valor).success,
      "Informe um email valido.",
    ),
  telefone: z
    .string()
    .max(40)
    .refine(
      (valor) => isTelefoneWhatsappValido(valor),
      "Informe DDD e numero, com ou sem prefixo 55.",
    ),
});

const servicoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do serviço.").max(160),
  descricao: z.string().max(1000),
  categoria: z.string().max(80),
  preco: z
    .number()
    .min(0, "Informe um preço maior ou igual a zero.")
    .max(9999999999.99, "Informe um preço menor."),
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
  titulo: z.string().min(2, "Informe o título da proposta.").max(160),
  introducao: z.string().max(1000),
  observacoes: z.string().max(1000),
  validadeDias: z
    .number()
    .min(1, "Validade mínima de 1 dia.")
    .max(365, "Validade máxima de 365 dias."),
  itens: z
    .array(propostaItemSchema)
    .min(1, "Adicione pelo menos um item.")
    .max(50, "Limite de 50 itens."),
  templateVisual: z.enum(propostaTemplateVisualValores),
  descontoValor: z
    .number()
    .min(0, "O desconto nao pode ser negativo.")
    .max(999999999, "Informe um desconto menor."),
  condicoesPagamento: z.string().max(1000),
  itensInclusosTexto: z.string().max(4000),
  itensNaoInclusosTexto: z.string().max(4000),
  cronogramaTexto: z.string().max(4000),
  beneficiosTexto: z.string().max(4000),
}).refine(
  (input) => input.descontoValor <= calcularTotalItens(input.itens),
  {
    message: "O desconto nao pode ser maior que o subtotal.",
    path: ["descontoValor"],
  },
);

type AuthMode = "cadastro" | "login";
type AppView =
  | "dashboard"
  | "clientes"
  | "servicos"
  | "propostas"
  | "conta"
  | "personalizacao";
type CrudModo = "lista" | "novo" | "editar" | "visualizar";
type SenhaUsuarioFormInput = z.infer<typeof senhaUsuarioSchema>;
type PerfilContaFormInput = z.infer<typeof perfilContaSchema>;
type ClienteFormInput = z.infer<typeof clienteSchema>;
type ClienteRapidoFormInput = z.infer<typeof clienteRapidoSchema>;
type ServicoFormInput = z.infer<typeof servicoSchema>;
type PropostaFormInput = z.infer<typeof propostaSchema>;
type PropostaPreviewInput = Partial<Omit<PropostaFormInput, "itens">> & {
  itens?: Array<Partial<PropostaFormInput["itens"][number]>>;
};
type TemaVisual = "light" | "dark";
type FiltroStatusProposta = "Todas" | PropostaStatus;
type DashboardMetrica = {
  label: string;
  value: string;
  detail: string;
  icon: typeof BarChart3;
  tone: "purple" | "teal" | "blue" | "red";
};
type PassoPrimeirosPassosDashboard = {
  id: string;
  titulo: string;
  detalhe: string;
  concluido: boolean;
  acaoLabel: string;
  onClick: () => void;
};
type PaginacaoListaResultado<T> = {
  itens: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  inicio: number;
  fim: number;
};
type LogoSugestaoPerfil = {
  nomeArquivo: string;
  previewUrl: string;
  corPrimaria: string;
  corSecundaria: string;
};
type SessaoInicialUsuario = {
  accessToken: string | null;
  authUsuario: AuthUsuarioResponse | null;
  mensagem: string | null;
};

const emprelyLogoSrc = "/brand/emprely-logo.svg";
const emprelyLogoDarkSrc = "/brand/emprely-logo-dark.png";
const emprelyFaviconSrc = "/brand/emprely-favicon.svg";
const logoArquivoTamanhoMaximoBytes = 2 * 1024 * 1024;
const logoArquivoTamanhoMaximoLabel = "2 MB";
const logoArquivoTiposPermitidos = ["image/png", "image/jpeg", "image/webp"];

const tamanhosPaginaListagem = [5, 10, 20, 50];

type NavegacaoPrincipalItem = {
  label: string;
  view: AppView;
  icon: typeof LayoutDashboard;
  quickAction?: "novoCliente" | "novoServico" | "novaProposta";
  quickLabel?: string;
};

const navegacaoPrincipal: NavegacaoPrincipalItem[] = [
  { label: "Dashboard", view: "dashboard", icon: LayoutDashboard },
  {
    label: "Clientes",
    view: "clientes",
    icon: UsersRound,
    quickAction: "novoCliente",
    quickLabel: "Novo cliente",
  },
  {
    label: "Serviços / Pacotes",
    view: "servicos",
    icon: BriefcaseBusiness,
    quickAction: "novoServico",
    quickLabel: "Novo serviço",
  },
  {
    label: "Propostas",
    view: "propostas",
    icon: ReceiptText,
    quickAction: "novaProposta",
    quickLabel: "Nova proposta",
  },
];

const filtrosStatusProposta: Array<{
  label: string;
  value: FiltroStatusProposta;
}> = [
  { label: "Todas", value: "Todas" },
  { label: "Rascunhos", value: "Rascunho" },
  { label: "Geradas", value: "Gerada" },
  { label: "Enviadas", value: "Enviada" },
  { label: "Aceitas", value: "Aceita" },
  { label: "Recusadas", value: "Recusada" },
];

const authSessionStorageKey = "emprely.authSession";
const tokenStorageKey = "emprely.accessToken";
const temaVisualStorageKey = "emprely.temaVisual";
const perfilContaDefaultValues: PerfilContaFormInput = {
  nomeComercial: "Emprely",
  emailContato: "",
  telefoneContato: "",
  siteUrl: "",
  instagram: "",
  documento: "",
  corPrimaria: "#6E38FF",
  corSecundaria: "#13C7BD",
  corSistemaPrimaria: "#6E38FF",
  corSistemaSecundaria: "#13C7BD",
  logoUrl: "",
  templateVisualPadrao: propostaTemplateVisualDefault,
};

const senhaUsuarioDefaultValues: SenhaUsuarioFormInput = {
  senhaAtual: "",
  novaSenha: "",
  confirmarNovaSenha: "",
};

const clienteDefaultValues: ClienteFormInput = {
  nome: "",
  email: "",
  telefone: "",
  documento: "",
  observacoes: "",
};

const clienteRapidoDefaultValues: ClienteRapidoFormInput = {
  nome: "",
  email: "",
  telefone: "",
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
  templateVisual: propostaTemplateVisualDefault,
  descontoValor: 0,
  condicoesPagamento: "",
  itensInclusosTexto: "",
  itensNaoInclusosTexto: "",
  cronogramaTexto: "",
  beneficiosTexto: "",
};

export default function App() {
  const queryClient = useQueryClient();
  const [sessaoInicial] = useState<SessaoInicialUsuario>(readSessaoInicialUsuario);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [appView, setAppView] = useState<AppView>("dashboard");
  const [accessToken, setAccessToken] = useState<string | null>(
    sessaoInicial.accessToken,
  );
  const [authUsuario, setAuthUsuario] = useState<AuthUsuarioResponse | null>(
    sessaoInicial.authUsuario,
  );
  const [sessaoMensagem, setSessaoMensagem] = useState<string | null>(
    sessaoInicial.mensagem,
  );
  const [senhaMensagem, setSenhaMensagem] = useState<string | null>(null);
  const [perfilMensagem, setPerfilMensagem] = useState<string | null>(null);
  const [clienteMensagem, setClienteMensagem] = useState<string | null>(null);
  const [clienteModo, setClienteModo] = useState<CrudModo>("lista");
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(
    null,
  );
  const [servicoMensagem, setServicoMensagem] = useState<string | null>(null);
  const [servicoModo, setServicoModo] = useState<CrudModo>("lista");
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<string | null>(
    null,
  );
  const [propostaMensagem, setPropostaMensagem] = useState<string | null>(null);
  const [propostaModo, setPropostaModo] = useState<CrudModo>("lista");
  const [propostaSelecionadaId, setPropostaSelecionadaId] = useState<string | null>(
    null,
  );
  const [propostaVisualizacaoModalId, setPropostaVisualizacaoModalId] = useState<
    string | null
  >(null);
  const [servicoParaAdicionarId, setServicoParaAdicionarId] = useState("");
  const [propostaImpressaoId, setPropostaImpressaoId] = useState<string | null>(
    null,
  );
  const [buscaClientes, setBuscaClientes] = useState("");
  const [buscaServicos, setBuscaServicos] = useState("");
  const [buscaPropostas, setBuscaPropostas] = useState("");
  const [clientePagina, setClientePagina] = useState(1);
  const [servicoPagina, setServicoPagina] = useState(1);
  const [propostaPagina, setPropostaPagina] = useState(1);
  const [clienteTamanhoPagina, setClienteTamanhoPagina] = useState(10);
  const [servicoTamanhoPagina, setServicoTamanhoPagina] = useState(10);
  const [propostaTamanhoPagina, setPropostaTamanhoPagina] = useState(10);
  const [clienteRapidoAberto, setClienteRapidoAberto] = useState(false);
  const logoArquivoInputRef = useRef<HTMLInputElement | null>(null);
  const [logoSugestaoPerfil, setLogoSugestaoPerfil] =
    useState<LogoSugestaoPerfil | null>(null);
  const [logoArquivoPendente, setLogoArquivoPendente] = useState<File | null>(
    null,
  );
  const [logoPreviewPerfilUrl, setLogoPreviewPerfilUrl] = useState<string | null>(
    null,
  );
  const [logoRemocaoPendente, setLogoRemocaoPendente] = useState(false);
  const [logoDragAtivo, setLogoDragAtivo] = useState(false);
  const [propostaExportacaoMensagem, setPropostaExportacaoMensagem] =
    useState<string | null>(null);
  const propostaDocumentoRef = useRef<HTMLDivElement | null>(null);
  const tituloAutomaticoPropostaRef = useRef<string | null>(null);
  const [templatePreviewAberto, setTemplatePreviewAberto] =
    useState<PropostaTemplateVisualAtivo | null>(null);
  const [propostaEditorAcoesExpandida, setPropostaEditorAcoesExpandida] =
    useState(false);
  const [propostaPreviewModalAberto, setPropostaPreviewModalAberto] =
    useState(false);
  const [propostaTemplateModalAberto, setPropostaTemplateModalAberto] =
    useState(false);
  const [propostaCompartilharModalAberto, setPropostaCompartilharModalAberto] =
    useState(false);
  const [
    personalizacaoPreviewTemplateAberto,
    setPersonalizacaoPreviewTemplateAberto,
  ] = useState<PropostaTemplateVisualAtivo | null>(null);
  const contaMenuRef = useRef<HTMLDivElement | null>(null);
  const [filtroStatusProposta, setFiltroStatusProposta] =
    useState<FiltroStatusProposta>("Todas");
  const [contaMenuAberto, setContaMenuAberto] = useState(false);
  const [temaVisual, setTemaVisual] = useState<TemaVisual>(getTemaVisualInicial);

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
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      nomeConta: "",
    },
  });

  const loginForm = useForm<LoginUsuarioInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const senhaUsuarioForm = useForm<SenhaUsuarioFormInput>({
    resolver: zodResolver(senhaUsuarioSchema),
    defaultValues: senhaUsuarioDefaultValues,
  });

  const perfilForm = useForm<PerfilContaFormInput>({
    resolver: zodResolver(perfilContaSchema),
    defaultValues: perfilContaDefaultValues,
  });

  const clienteForm = useForm<ClienteFormInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: clienteDefaultValues,
  });

  const clienteRapidoForm = useForm<ClienteRapidoFormInput>({
    resolver: zodResolver(clienteRapidoSchema),
    defaultValues: clienteRapidoDefaultValues,
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
  const { reset: resetSenhaUsuarioForm } = senhaUsuarioForm;
  const { reset: resetClienteForm } = clienteForm;
  const { reset: resetClienteRapidoForm } = clienteRapidoForm;
  const { reset: resetServicoForm } = servicoForm;
  const { reset: resetPropostaForm } = propostaForm;

  const limparLogoArquivoPendente = useCallback(() => {
    if (logoArquivoInputRef.current) {
      logoArquivoInputRef.current.value = "";
    }

    setLogoArquivoPendente(null);
    setLogoPreviewPerfilUrl(null);
    setLogoSugestaoPerfil(null);
    setLogoRemocaoPendente(false);
    setLogoDragAtivo(false);
  }, []);

  const limparSessaoUsuario = useCallback(
    (mensagem: string | null = null) => {
      clearSessaoUsuarioStorage();
      setAccessToken(null);
      setAuthUsuario(null);
      setSessaoMensagem(mensagem);
      setSenhaMensagem(null);
      setPerfilMensagem(null);
      setClienteMensagem(null);
      setServicoMensagem(null);
      setPropostaMensagem(null);
      setPropostaExportacaoMensagem(null);
      setClienteModo("lista");
      setServicoModo("lista");
      setPropostaModo("lista");
      setClienteSelecionadoId(null);
      setServicoSelecionadoId(null);
      setPropostaSelecionadaId(null);
      setPropostaImpressaoId(null);
      setServicoParaAdicionarId("");
      setBuscaClientes("");
      setBuscaServicos("");
      setBuscaPropostas("");
      setClientePagina(1);
      setServicoPagina(1);
      setPropostaPagina(1);
      setFiltroStatusProposta("Todas");
      setClienteRapidoAberto(false);
      setContaMenuAberto(false);
      limparLogoArquivoPendente();
      resetSenhaUsuarioForm(senhaUsuarioDefaultValues);
      resetPerfilForm(perfilContaDefaultValues);
      resetClienteForm(clienteDefaultValues);
      resetClienteRapidoForm(clienteRapidoDefaultValues);
      resetServicoForm(servicoDefaultValues);
      resetPropostaForm(propostaDefaultValues);
      tituloAutomaticoPropostaRef.current = null;
      setAppView("dashboard");
      queryClient.removeQueries({ queryKey: ["usuario-atual"] });
      queryClient.removeQueries({ queryKey: ["perfil-conta"] });
      queryClient.removeQueries({ queryKey: ["clientes"] });
      queryClient.removeQueries({ queryKey: ["servicos"] });
      queryClient.removeQueries({ queryKey: ["propostas"] });
    },
    [
      queryClient,
      resetClienteForm,
      resetClienteRapidoForm,
      limparLogoArquivoPendente,
      resetPerfilForm,
      resetPropostaForm,
      resetSenhaUsuarioForm,
      resetServicoForm,
    ],
  );

  const encerrarSessaoExpirada = useCallback(() => {
    limparSessaoUsuario("Sessao expirada. Entre novamente.");
  }, [limparSessaoUsuario]);

  const logoutUsuario = useCallback(() => {
    limparSessaoUsuario();
  }, [limparSessaoUsuario]);

  useEffect(() => {
    window.addEventListener(sessaoInvalidaEventName, encerrarSessaoExpirada);

    return () => {
      window.removeEventListener(sessaoInvalidaEventName, encerrarSessaoExpirada);
    };
  }, [encerrarSessaoExpirada]);

  useEffect(() => {
    document.documentElement.dataset.theme = temaVisual;
    window.localStorage.setItem(temaVisualStorageKey, temaVisual);
  }, [temaVisual]);

  useEffect(() => {
    return () => {
      if (logoPreviewPerfilUrl) {
        URL.revokeObjectURL(logoPreviewPerfilUrl);
      }
    };
  }, [logoPreviewPerfilUrl]);

  useEffect(() => {
    if (!contaMenuAberto) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        contaMenuRef.current &&
        !contaMenuRef.current.contains(target)
      ) {
        setContaMenuAberto(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setContaMenuAberto(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contaMenuAberto]);

  useEffect(() => {
    if (!authUsuario?.expiresAtUtc) {
      return;
    }

    const expiresAt = new Date(authUsuario.expiresAtUtc).getTime();
    const millisecondsAteExpirar = expiresAt - Date.now();
    const delayExpiracao = !Number.isFinite(expiresAt)
      ? 0
      : Math.max(0, Math.min(millisecondsAteExpirar, 2_147_483_647));

    const timeoutId = window.setTimeout(
      encerrarSessaoExpirada,
      delayExpiracao,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authUsuario?.expiresAtUtc, encerrarSessaoExpirada]);

  const usuario = authUsuario?.usuario ?? usuarioAtualQuery.data?.usuario;
  const conta = authUsuario?.conta ?? usuarioAtualQuery.data?.conta;
  const perfilConta = perfilContaQuery.data;
  const nomeMarcaTopo =
    perfilConta?.nomeComercial?.trim() || conta?.nome || "Emprely";
  const subtituloMarcaTopo =
    perfilConta?.instagram?.trim() ||
    perfilConta?.emailContato?.trim() ||
    "Emprely Orçamentos";
  const logoMarcaTopo = resolveApiAssetUrl(perfilConta?.logoUrl) || null;
  const clientes = clientesQuery.data ?? [];
  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === clienteSelecionadoId,
  );
  const servicos = servicosQuery.data ?? [];
  const servicoSelecionado = servicos.find(
    (servico) => servico.id === servicoSelecionadoId,
  );
  const propostas = propostasQuery.data ?? [];
  const clientesFiltrados = clientes.filter((cliente) =>
    matchBuscaTexto(buscaClientes, [
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.documento,
      cliente.observacoes,
    ]),
  );
  const servicosFiltrados = servicos.filter((servico) =>
    matchBuscaTexto(buscaServicos, [
      servico.nome,
      servico.categoria,
      servico.descricao,
      servico.tipo,
      servico.unidade,
    ]),
  );
  const propostasFiltradas =
    (filtroStatusProposta === "Todas"
      ? propostas
      : propostas.filter((proposta) => proposta.status === filtroStatusProposta)
    ).filter((proposta) =>
      matchBuscaTexto(buscaPropostas, [
        proposta.titulo,
        proposta.numero,
        proposta.clienteNome,
        proposta.status,
        proposta.introducao,
        proposta.observacoes,
        ...proposta.itens.flatMap((item) => [
          item.nome,
          item.descricao,
          item.total.toString(),
        ]),
      ]),
    );
  const clientesPaginados = paginarLista(
    clientesFiltrados,
    clientePagina,
    clienteTamanhoPagina,
  );
  const servicosPaginados = paginarLista(
    servicosFiltrados,
    servicoPagina,
    servicoTamanhoPagina,
  );
  const propostasPaginadas = paginarLista(
    propostasFiltradas,
    propostaPagina,
    propostaTamanhoPagina,
  );

  const propostaSelecionada = propostas.find(
    (proposta) => proposta.id === propostaSelecionadaId,
  );
  const propostaVisualizacaoModal = propostas.find(
    (proposta) => proposta.id === propostaVisualizacaoModalId,
  );
  const propostaParaImpressao = propostas.find(
    (proposta) => proposta.id === propostaImpressaoId,
  );
  const clienteFormularioNome = useWatch({
    control: clienteForm.control,
    name: "nome",
  });
  const clienteFormularioTelefone = useWatch({
    control: clienteForm.control,
    name: "telefone",
  });
  const clienteFormularioWhatsappUrl = buildWhatsappContatoClienteUrl({
    nome: clienteFormularioNome,
    telefone: clienteFormularioTelefone,
  });
  const propostaPreview = useWatch({
    control: propostaForm.control,
  });
  const propostaItensPreview = propostaPreview.itens ?? [];
  const propostaSubtotalPreview = calcularTotalItens(propostaItensPreview);
  const propostaDescontoPreview = Math.min(
    valorSeguro(propostaPreview.descontoValor),
    propostaSubtotalPreview,
  );
  const propostaTotalPreview = calcularTotalProposta(
    propostaSubtotalPreview,
    propostaDescontoPreview,
  );
  const propostaTemAlteracoes = propostaForm.formState.isDirty;
  const contaPodeExportarProposta = conta
    ? canExportPropostaConta(conta)
    : false;
  const propostaSelecionadaRascunho =
    propostaSelecionada?.status === "Rascunho";
  const propostaSelecionadaGerada = propostaSelecionada?.status === "Gerada";
  const propostaSelecionadaEnviada = propostaSelecionada?.status === "Enviada";
  const propostaEditorAtivo =
    propostaModo === "novo" || propostaModo === "editar";
  const mensagemBloqueioPlano = getMensagemBloqueioPlano(conta);
  const propostaProntaParaGerar = Boolean(
    propostaSelecionadaRascunho &&
      !propostaTemAlteracoes &&
      contaPodeExportarProposta,
  );
  const propostaProntaParaEnvio =
    Boolean(
      propostaSelecionadaGerada &&
        !propostaTemAlteracoes &&
        contaPodeExportarProposta,
    );
  const propostaProntaParaDecisao =
    Boolean(propostaSelecionadaEnviada && !propostaTemAlteracoes);
  const propostaFontePreview =
    propostaParaImpressao ??
    (propostaSelecionadaGerada && !propostaTemAlteracoes
      ? propostaSelecionada
      : null);
  const propostaPreviewVisual = propostaFontePreview
    ? mapPropostaForm(propostaFontePreview)
    : propostaPreview;
  const propostaSubtotalVisual =
    propostaFontePreview?.subtotal ?? propostaSubtotalPreview;
  const propostaDescontoVisual =
    propostaFontePreview?.descontoValor ?? propostaDescontoPreview;
  const propostaTotalVisual = propostaFontePreview?.total ?? propostaTotalPreview;
  const clientePreview = clientes.find(
    (cliente) => cliente.id === propostaPreviewVisual.clienteId,
  );
  const clienteNomePreviewFallback = propostaFontePreview?.clienteNome;
  const clientePropostaSelecionada = clientes.find(
    (cliente) => cliente.id === propostaSelecionada?.clienteId,
  );
  const propostaVisualizacaoModalForm = propostaVisualizacaoModal
    ? mapPropostaForm(propostaVisualizacaoModal)
    : null;
  const clienteVisualizacaoModal = clientes.find(
    (cliente) => cliente.id === propostaVisualizacaoModal?.clienteId,
  );
  const whatsappPropostaUrl =
    propostaProntaParaEnvio && propostaSelecionada
      ? buildWhatsappPropostaUrl(
          propostaSelecionada,
          clientePropostaSelecionada,
          perfilConta,
          conta?.nome ?? "Emprely",
        )
      : "";

  useEffect(() => {
    if (perfilContaQuery.data) {
      resetPerfilForm(mapPerfilContaForm(perfilContaQuery.data, usuario));
    }
  }, [perfilContaQuery.data, resetPerfilForm, usuario]);

  useEffect(() => {
    if (clienteSelecionado) {
      resetClienteForm(mapClienteForm(clienteSelecionado), {
        keepDirty: false,
      });
    }
  }, [clienteSelecionado, resetClienteForm]);

  useEffect(() => {
    if (servicoSelecionado) {
      resetServicoForm(mapServicoForm(servicoSelecionado), {
        keepDirty: false,
      });
    }
  }, [servicoSelecionado, resetServicoForm]);

  useEffect(() => {
    if (propostaSelecionada) {
      resetPropostaForm(mapPropostaForm(propostaSelecionada), {
        keepDirty: false,
      });
      tituloAutomaticoPropostaRef.current = null;
    }
  }, [propostaSelecionada, resetPropostaForm]);

  useEffect(() => {
    function limparPropostaImpressao() {
      setPropostaImpressaoId(null);
    }

    window.addEventListener("afterprint", limparPropostaImpressao);

    return () => {
      window.removeEventListener("afterprint", limparPropostaImpressao);
    };
  }, []);

  const registerMutation = useMutation({
    mutationFn: registerUsuario,
    onSuccess: handleAuthSuccess,
  });

  const loginMutation = useMutation({
    mutationFn: loginUsuario,
    onSuccess: handleAuthSuccess,
  });

  const perfilMutation = useMutation({
    mutationFn: async (input: PerfilContaFormInput) => {
      let inputComLogo = input;

      if (logoArquivoPendente) {
        const upload = await uploadLogoPerfilConta(
          logoArquivoPendente,
          accessToken!,
        );
        inputComLogo = {
          ...input,
          logoUrl: upload.logoUrl,
        };
      } else if (logoRemocaoPendente) {
        inputComLogo = {
          ...input,
          logoUrl: "",
        };
      }

      return updatePerfilConta(buildPerfilContaPayload(inputComLogo), accessToken!);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(["perfil-conta", accessToken], response);
      resetPerfilForm(mapPerfilContaForm(response));
      limparLogoArquivoPendente();
      setPerfilMensagem("Perfil salvo.");
    },
  });

  const senhaUsuarioMutation = useMutation({
    mutationFn: (input: SenhaUsuarioFormInput) =>
      changeSenhaUsuario(buildSenhaUsuarioPayload(input), accessToken!),
    onSuccess: () => {
      resetSenhaUsuarioForm(senhaUsuarioDefaultValues);
      setSenhaMensagem("Senha atualizada.");
    },
  });

  const salvarClienteMutation = useMutation({
    mutationFn: (input: ClienteFormInput) => {
      const payload = buildClientePayload(input);

      if (clienteSelecionadoId && clienteSelecionado) {
        return updateCliente(clienteSelecionadoId, payload, accessToken!);
      }

      return createCliente(payload, accessToken!);
    },
    onSuccess: async () => {
      const eraEdicao = Boolean(clienteSelecionadoId && clienteSelecionado);
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
      resetClienteForm(clienteDefaultValues);
      setClienteSelecionadoId(null);
      setClienteModo(eraEdicao ? "lista" : "novo");
      setClientePagina(1);
      setClienteMensagem(
        eraEdicao
          ? "Cliente atualizado. Você voltou para a listagem."
          : "Cliente salvo. Cadastre o próximo cliente quando quiser.",
      );
    },
  });

  const criarClienteRapidoMutation = useMutation({
    mutationFn: (input: ClienteRapidoFormInput) =>
      createCliente(buildClienteRapidoPayload(input), accessToken!),
    onSuccess: async (response) => {
      queryClient.setQueryData<ClienteResponse[]>(
        ["clientes", accessToken],
        (clientesAtuais = []) => {
          const clienteExiste = clientesAtuais.some(
            (cliente) => cliente.id === response.id,
          );

          return clienteExiste ? clientesAtuais : [response, ...clientesAtuais];
        },
      );
      propostaForm.setValue("clienteId", response.id, {
        shouldDirty: true,
        shouldValidate: true,
      });
      preencherTituloAutomaticoProposta(response, getPrimeiroNomeItemProposta());
      resetClienteRapidoForm(clienteRapidoDefaultValues);
      setClienteRapidoAberto(false);
      setPropostaMensagem("Cliente criado e selecionado na proposta.");
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
    },
  });

  const arquivarClienteMutation = useMutation({
    mutationFn: (id: string) => deleteCliente(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
      resetClienteForm(clienteDefaultValues);
      setClienteSelecionadoId(null);
      setClienteModo("lista");
      setClienteMensagem("Cliente arquivado.");
    },
  });

  const salvarServicoMutation = useMutation({
    mutationFn: (input: ServicoFormInput) => {
      const payload = buildServicoPayload(input);

      if (servicoSelecionadoId && servicoSelecionado) {
        return updateServico(servicoSelecionadoId, payload, accessToken!);
      }

      return createServico(payload, accessToken!);
    },
    onSuccess: async () => {
      const eraEdicao = Boolean(servicoSelecionadoId && servicoSelecionado);
      await queryClient.invalidateQueries({ queryKey: ["servicos", accessToken] });
      resetServicoForm(servicoDefaultValues);
      setServicoSelecionadoId(null);
      setServicoModo(eraEdicao ? "lista" : "novo");
      setServicoPagina(1);
      setServicoMensagem(
        eraEdicao
          ? "Serviço atualizado. Você voltou para a listagem."
          : "Serviço salvo. Cadastre o próximo serviço quando quiser.",
      );
    },
  });

  const arquivarServicoMutation = useMutation({
    mutationFn: (id: string) => deleteServico(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["servicos", accessToken] });
      resetServicoForm(servicoDefaultValues);
      setServicoSelecionadoId(null);
      setServicoModo("lista");
      setServicoMensagem("Serviço arquivado.");
    },
  });

  const salvarPropostaMutation = useMutation({
    mutationFn: (input: PropostaFormInput) => {
      const payload = buildPropostaPayload(input);

      if (propostaSelecionadaId && propostaSelecionada) {
        return updateProposta(propostaSelecionadaId, payload, accessToken!);
      }

      return createProposta(payload, accessToken!);
    },
    onSuccess: async (response) => {
      const eraEdicao = Boolean(propostaSelecionadaId && propostaSelecionada);
      queryClient.setQueryData<PropostaResponse[]>(
        ["propostas", accessToken],
        (propostasAtuais = []) => {
          const propostaExiste = propostasAtuais.some(
            (proposta) => proposta.id === response.id,
          );

          if (!propostaExiste) {
            return [response, ...propostasAtuais];
          }

          return propostasAtuais.map((proposta) =>
            proposta.id === response.id ? response : proposta,
          );
        },
      );
      resetPropostaForm(eraEdicao ? propostaDefaultValues : mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(eraEdicao ? null : response.id);
      setPropostaModo("lista");
      setPropostaVisualizacaoModalId(eraEdicao ? null : response.id);
      setServicoParaAdicionarId("");
      setPropostaPagina(1);
      setPropostaMensagem("Proposta salva.");
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const duplicarPropostaMutation = useMutation({
    mutationFn: (id: string) => duplicateProposta(id, accessToken!),
    onSuccess: async (response) => {
      atualizarPropostaCache(response);
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(response.id);
      setPropostaVisualizacaoModalId(null);
      setPropostaModo("editar");
      setFiltroStatusProposta("Todas");
      setServicoParaAdicionarId("");
      setPropostaMensagem("Proposta duplicada como rascunho.");
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const gerarPropostaMutation = useMutation({
    mutationFn: (id: string) => generateProposta(id, accessToken!),
    onSuccess: async (response) => {
      atualizarPropostaCache(response);
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(null);
      setPropostaModo("lista");
      setPropostaVisualizacaoModalId(response.id);
      setPropostaMensagem(
        "Proposta gerada. Agora você pode imprimir ou enviar pelo WhatsApp.",
      );
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const enviarPropostaMutation = useMutation({
    mutationFn: (id: string) => sendProposta(id, accessToken!),
    onSuccess: async (response) => {
      atualizarPropostaCache(response);
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(null);
      setPropostaModo("lista");
      setPropostaVisualizacaoModalId(response.id);
      setPropostaMensagem("Proposta marcada como enviada.");
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const aceitarPropostaMutation = useMutation({
    mutationFn: (id: string) => acceptProposta(id, accessToken!),
    onSuccess: async (response) => {
      atualizarPropostaCache(response);
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(null);
      setPropostaModo("lista");
      setPropostaVisualizacaoModalId(response.id);
      setPropostaMensagem("Proposta marcada como aceita.");
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const recusarPropostaMutation = useMutation({
    mutationFn: (id: string) => rejectProposta(id, accessToken!),
    onSuccess: async (response) => {
      atualizarPropostaCache(response);
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(null);
      setPropostaModo("lista");
      setPropostaVisualizacaoModalId(response.id);
      setPropostaMensagem("Proposta marcada como recusada.");
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
    },
  });

  const arquivarPropostaMutation = useMutation({
    mutationFn: (id: string) => deleteProposta(id, accessToken!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["propostas", accessToken] });
      resetPropostaForm(propostaDefaultValues);
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(null);
      setPropostaVisualizacaoModalId(null);
      setPropostaModo("lista");
      setServicoParaAdicionarId("");
      setPropostaMensagem("Proposta arquivada.");
    },
  });

  function handleAuthSuccess(response: AuthUsuarioResponse) {
    saveSessaoUsuarioStorage(response);
    setAccessToken(response.accessToken);
    setAuthUsuario(response);
    setSessaoMensagem(null);
    setSenhaMensagem(null);
    setPerfilMensagem(null);
    setClienteMensagem(null);
    setServicoMensagem(null);
    setPropostaMensagem(null);
    setAppView("dashboard");
  }

  function atualizarPropostaCache(response: PropostaResponse) {
    queryClient.setQueryData<PropostaResponse[]>(
      ["propostas", accessToken],
      (propostasAtuais = []) => {
        const propostaExiste = propostasAtuais.some(
          (proposta) => proposta.id === response.id,
        );

        if (!propostaExiste) {
          return [response, ...propostasAtuais];
        }

        return propostasAtuais.map((proposta) =>
          proposta.id === response.id ? response : proposta,
        );
      },
    );
  }

  function formularioAtualTemAlteracoes() {
    if (appView === "clientes" && clienteModo !== "lista") {
      return clienteForm.formState.isDirty;
    }

    if (appView === "servicos" && servicoModo !== "lista") {
      return servicoForm.formState.isDirty;
    }

    if (appView === "propostas" && propostaModo !== "lista") {
      return propostaForm.formState.isDirty || clienteRapidoForm.formState.isDirty;
    }

    if (appView === "conta" || appView === "personalizacao") {
      return perfilForm.formState.isDirty || senhaUsuarioForm.formState.isDirty;
    }

    return false;
  }

  function confirmarDescarteAlteracoes() {
    if (!formularioAtualTemAlteracoes()) {
      return true;
    }

    return window.confirm(
      "Existem alterações não salvas. Deseja descartar essas alterações?",
    );
  }

  function executarComConfirmacaoDescarte(acao: () => void) {
    if (!confirmarDescarteAlteracoes()) {
      return;
    }

    acao();
  }

  function navegarParaView(view: AppView) {
    executarComConfirmacaoDescarte(() => {
      setContaMenuAberto(false);
      setPropostaVisualizacaoModalId(null);
      setPropostaPreviewModalAberto(false);
      setPropostaTemplateModalAberto(false);
      setPropostaCompartilharModalAberto(false);
      setPersonalizacaoPreviewTemplateAberto(null);
      setAppView(view);

      if (view === "clientes") {
        abrirListaClientesSemConfirmar();
      }

      if (view === "servicos") {
        abrirListaServicosSemConfirmar();
      }

      if (view === "propostas") {
        abrirListaPropostasSemConfirmar();
      }
    });
  }

  function prepararNovoCliente() {
    setClienteSelecionadoId(null);
    setClienteModo("novo");
    setClienteMensagem(null);
    resetClienteForm(clienteDefaultValues, { keepDirty: false });
  }

  function abrirListaClientesSemConfirmar() {
    setClienteModo("lista");
    setClienteSelecionadoId(null);
    resetClienteForm(clienteDefaultValues, { keepDirty: false });
  }

  function voltarListaClientes() {
    executarComConfirmacaoDescarte(abrirListaClientesSemConfirmar);
  }

  function novoCliente() {
    executarComConfirmacaoDescarte(prepararNovoCliente);
  }

  function abrirNovoCliente() {
    executarComConfirmacaoDescarte(() => {
      prepararNovoCliente();
      setAppView("clientes");
    });
  }

  function prepararNovoServico() {
    setServicoSelecionadoId(null);
    setServicoModo("novo");
    setServicoMensagem(null);
    resetServicoForm(servicoDefaultValues, { keepDirty: false });
  }

  function abrirListaServicosSemConfirmar() {
    setServicoModo("lista");
    setServicoSelecionadoId(null);
    resetServicoForm(servicoDefaultValues, { keepDirty: false });
  }

  function voltarListaServicos() {
    executarComConfirmacaoDescarte(abrirListaServicosSemConfirmar);
  }

  function novoServico() {
    executarComConfirmacaoDescarte(prepararNovoServico);
  }

  function abrirNovoServico() {
    executarComConfirmacaoDescarte(() => {
      prepararNovoServico();
      setAppView("servicos");
    });
  }

  function prepararNovaProposta(clienteId = "") {
    setPropostaSelecionadaId(null);
    setPropostaVisualizacaoModalId(null);
    setPropostaPreviewModalAberto(false);
    setPropostaTemplateModalAberto(false);
    setPropostaCompartilharModalAberto(false);
    setPropostaModo("novo");
    setPropostaMensagem(null);
    setServicoParaAdicionarId("");
    setClienteRapidoAberto(false);
    const cliente = findClienteProposta(clienteId);
    const titulo = buildTituloAutomaticoProposta(cliente, null);
    const templateVisualPadrao = normalizarTemplateVisual(
      perfilConta?.templateVisualPadrao,
    );

    resetPropostaForm(
      {
        ...propostaDefaultValues,
        clienteId,
        titulo,
        templateVisual: templateVisualPadrao,
      },
      { keepDirty: false },
    );
    tituloAutomaticoPropostaRef.current = titulo || null;
  }

  function cancelarClienteRapido() {
    resetClienteRapidoForm(clienteRapidoDefaultValues);
    setClienteRapidoAberto(false);
  }

  function novaProposta() {
    executarComConfirmacaoDescarte(() => prepararNovaProposta());
  }

  function abrirListaPropostasSemConfirmar() {
    setPropostaModo("lista");
    setPropostaSelecionadaId(null);
    setPropostaVisualizacaoModalId(null);
    setPropostaPreviewModalAberto(false);
    setPropostaTemplateModalAberto(false);
    setPropostaCompartilharModalAberto(false);
    setServicoParaAdicionarId("");
    setClienteRapidoAberto(false);
    resetPropostaForm(propostaDefaultValues, { keepDirty: false });
    resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
    tituloAutomaticoPropostaRef.current = null;
  }

  function voltarListaPropostas() {
    executarComConfirmacaoDescarte(abrirListaPropostasSemConfirmar);
  }

  function abrirNovaProposta(clienteId = "") {
    executarComConfirmacaoDescarte(() => {
      prepararNovaProposta(clienteId);
      setAppView("propostas");
    });
  }

  function executarAcaoRapidaMenu(
    action: NonNullable<NavegacaoPrincipalItem["quickAction"]>,
  ) {
    if (action === "novoCliente") {
      abrirNovoCliente();
      return;
    }

    if (action === "novoServico") {
      abrirNovoServico();
      return;
    }

    abrirNovaProposta();
  }

  function selecionarCliente(clienteId: string) {
    executarComConfirmacaoDescarte(() => {
      setClienteSelecionadoId(clienteId);
      setClienteModo("editar");
      setClienteMensagem(null);
    });
  }

  function visualizarCliente(clienteId: string) {
    executarComConfirmacaoDescarte(() => {
      setClienteSelecionadoId(clienteId);
      setClienteModo("visualizar");
      setClienteMensagem(null);
      resetClienteForm(clienteDefaultValues, { keepDirty: false });
    });
  }

  function selecionarServico(servicoId: string) {
    executarComConfirmacaoDescarte(() => {
      setServicoSelecionadoId(servicoId);
      setServicoModo("editar");
      setServicoMensagem(null);
    });
  }

  function visualizarServico(servicoId: string) {
    executarComConfirmacaoDescarte(() => {
      setServicoSelecionadoId(servicoId);
      setServicoModo("visualizar");
      setServicoMensagem(null);
      resetServicoForm(servicoDefaultValues, { keepDirty: false });
    });
  }

  function selecionarProposta(propostaId: string) {
    executarComConfirmacaoDescarte(() => {
      setPropostaVisualizacaoModalId(null);
      setPropostaPreviewModalAberto(false);
      setPropostaTemplateModalAberto(false);
      setPropostaCompartilharModalAberto(false);
      setPropostaSelecionadaId(propostaId);
      setPropostaModo("editar");
      setPropostaMensagem(null);
    });
  }

  function visualizarProposta(propostaId: string) {
    executarComConfirmacaoDescarte(() => {
      abrirListaPropostasSemConfirmar();
      setAppView("propostas");
      setPropostaVisualizacaoModalId(propostaId);
      setPropostaMensagem(null);
    });
  }

  function adicionarServicoProposta() {
    const servico = servicos.find((item) => item.id === servicoParaAdicionarId);

    if (!servico) {
      return;
    }

    const itensAtuais = propostaForm.getValues("itens") ?? [];

    appendPropostaItem({
      servicoId: servico.id,
      nome: servico.nome,
      descricao: servico.descricao ?? "",
      quantidade: 1,
      valorUnitario: servico.preco,
    });

    if (itensAtuais.length === 0) {
      preencherTituloAutomaticoProposta(
        findClienteProposta(propostaForm.getValues("clienteId")),
        servico.nome,
      );
    }

    setServicoParaAdicionarId("");
  }

  function handleClientePropostaChange(event: ChangeEvent<HTMLSelectElement>) {
    preencherTituloAutomaticoProposta(
      findClienteProposta(event.target.value),
      getPrimeiroNomeItemProposta(),
    );
  }

  function selecionarTemplateProposta(templateVisual: string) {
    const templateAnterior = propostaForm.getValues("templateVisual");
    const templateNovo = normalizarTemplateVisual(templateVisual);
    const propostaJaGerada =
      propostaSelecionada &&
      propostaSelecionada.status !== "Rascunho" &&
      propostaSelecionada.status !== "Arquivada";

    if (templateNovo === templateAnterior) {
      return;
    }

    if (
      propostaJaGerada &&
      !window.confirm(
        "Alterar o template de uma proposta ja gerada volta o status para rascunho ao salvar. Continuar?",
      )
    ) {
      propostaForm.setValue("templateVisual", templateAnterior, {
        shouldDirty: false,
        shouldValidate: true,
      });
      return;
    }

    propostaForm.setValue("templateVisual", templateNovo, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function preencherTituloAutomaticoProposta(
    cliente: ClienteResponse | undefined,
    nomeServico: string | null | undefined,
  ) {
    const titulo = buildTituloAutomaticoProposta(cliente, nomeServico);

    if (!titulo) {
      return;
    }

    aplicarTituloAutomaticoProposta(titulo);
  }

  function aplicarTituloAutomaticoProposta(titulo: string) {
    const tituloAtual = propostaForm.getValues("titulo").trim();
    const podeAtualizar =
      tituloAtual.length === 0 ||
      tituloAtual === tituloAutomaticoPropostaRef.current;

    if (!podeAtualizar) {
      return;
    }

    propostaForm.setValue("titulo", titulo, {
      shouldDirty: true,
      shouldValidate: true,
    });
    tituloAutomaticoPropostaRef.current = titulo;
  }

  function findClienteProposta(clienteId: string) {
    return clientes.find((cliente) => cliente.id === clienteId);
  }

  function getPrimeiroNomeItemProposta() {
    const primeiroItem = propostaForm.getValues("itens")?.[0];
    return primeiroItem?.nome ?? null;
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

  function imprimirPropostaGerada() {
    if (!propostaProntaParaEnvio || !propostaSelecionada) {
      return;
    }

    imprimirPropostaSalva(propostaSelecionada);
  }

  function imprimirPropostaSalva(proposta: PropostaResponse) {
    if (proposta.status !== "Gerada" || !contaPodeExportarProposta) {
      return;
    }

    flushSync(() => {
      setPropostaImpressaoId(proposta.id);
    });
    window.print();
  }

  async function baixarPdfPropostaGerada() {
    if (!propostaProntaParaEnvio || !propostaSelecionada) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const blob = await gerarPdfPropostaBlob();
      baixarBlobArquivo(blob, `${buildNomeArquivoProposta(propostaSelecionada)}.pdf`);
      setPropostaExportacaoMensagem("PDF gerado. Anexe este arquivo no WhatsApp Web.");
    });
  }

  async function baixarImagemPropostaGerada() {
    if (!propostaProntaParaEnvio || !propostaSelecionada) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const blob = await gerarPngPropostaBlob();
      baixarBlobArquivo(blob, `${buildNomeArquivoProposta(propostaSelecionada)}.png`);
      setPropostaExportacaoMensagem("Imagem gerada. Anexe este arquivo no WhatsApp Web.");
    });
  }

  async function compartilharPropostaMobile() {
    if (!propostaProntaParaEnvio || !propostaSelecionada) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const blob = await gerarPdfPropostaBlob();
      const file = new File(
        [blob],
        `${buildNomeArquivoProposta(propostaSelecionada)}.pdf`,
        { type: "application/pdf" },
      );
      const mensagem = buildMensagemWhatsappProposta(
        propostaSelecionada,
        clientePropostaSelecionada,
        perfilConta,
        conta?.nome ?? "Emprely",
      );

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: propostaSelecionada.titulo,
          text: mensagem,
          files: [file],
        });
        setPropostaExportacaoMensagem("Compartilhamento aberto no celular.");
        return;
      }

      setPropostaExportacaoMensagem(
        "Este navegador nao abriu o compartilhamento nativo. Baixe o PDF e anexe no WhatsApp.",
      );
    });
  }

  async function copiarMensagemWhatsappProposta() {
    if (!propostaProntaParaEnvio || !propostaSelecionada) {
      return;
    }

    const mensagem = buildMensagemWhatsappProposta(
      propostaSelecionada,
      clientePropostaSelecionada,
      perfilConta,
      conta?.nome ?? "Emprely",
    );

    try {
      await navigator.clipboard.writeText(mensagem);
      setPropostaExportacaoMensagem(
        "Mensagem copiada. No WhatsApp Web, envie esta mensagem e anexe o PDF ou a imagem gerada.",
      );
    } catch {
      setPropostaExportacaoMensagem(
        "Nao foi possivel copiar automaticamente. Abra o WhatsApp e envie a mensagem gerada pelo botao WhatsApp.",
      );
    }
  }

  async function executarExportacaoProposta(
    exportar: () => Promise<void>,
  ): Promise<void> {
    try {
      setPropostaExportacaoMensagem("Gerando arquivo do orçamento...");
      await exportar();
    } catch {
      setPropostaExportacaoMensagem(
        "Nao foi possivel gerar o arquivo. Tente novamente ou use a opcao de imprimir.",
      );
    }
  }

  async function gerarPngPropostaBlob(): Promise<Blob> {
    const node = propostaDocumentoRef.current;

    if (!node) {
      throw new Error("Preview da proposta nao encontrado.");
    }

    const { toBlob } = await import("html-to-image");
    const blob = await toBlob(node, {
      backgroundColor: "#ffffff",
      cacheBust: true,
      pixelRatio: 2,
    });

    if (!blob) {
      throw new Error("Imagem da proposta nao gerada.");
    }

    return blob;
  }

  async function gerarPdfPropostaBlob(): Promise<Blob> {
    const pngBlob = await gerarPngPropostaBlob();
    const pngDataUrl = await blobToDataUrl(pngBlob);
    const tamanhoImagem = await carregarTamanhoImagem(pngDataUrl);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();
    const margem = 24;
    const larguraDisponivel = larguraPagina - margem * 2;
    const alturaDisponivel = alturaPagina - margem * 2;
    const escala = larguraDisponivel / tamanhoImagem.width;
    const larguraImagem = larguraDisponivel;
    const alturaImagem = tamanhoImagem.height * escala;
    let deslocamentoImagem = 0;

    do {
      if (deslocamentoImagem > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        pngDataUrl,
        "PNG",
        margem,
        margem - deslocamentoImagem,
        larguraImagem,
        alturaImagem,
      );

      deslocamentoImagem += alturaDisponivel;
    } while (deslocamentoImagem < alturaImagem);

    return pdf.output("blob");
  }

  function buildWhatsappUrlPropostaSalva(proposta: PropostaResponse) {
    if (!contaPodeExportarProposta) {
      return "";
    }

    const cliente = clientes.find((item) => item.id === proposta.clienteId);

    return buildWhatsappPropostaUrl(
      proposta,
      cliente,
      perfilConta,
      conta?.nome ?? "Emprely",
    );
  }

  function marcarPropostaEnviada(proposta: PropostaResponse) {
    if (proposta.status !== "Gerada" || !contaPodeExportarProposta) {
      return;
    }

    enviarPropostaMutation.mutate(proposta.id);
  }

  function marcarPropostaAceita(proposta: PropostaResponse) {
    if (proposta.status !== "Enviada") {
      return;
    }

    if (window.confirm(`Marcar a proposta "${proposta.titulo}" como aceita?`)) {
      aceitarPropostaMutation.mutate(proposta.id);
    }
  }

  function marcarPropostaRecusada(proposta: PropostaResponse) {
    if (proposta.status !== "Enviada") {
      return;
    }

    if (window.confirm(`Marcar a proposta "${proposta.titulo}" como recusada?`)) {
      recusarPropostaMutation.mutate(proposta.id);
    }
  }

  function arquivarClienteComConfirmacao(cliente: ClienteResponse) {
    const propostasCliente = propostas.filter(
      (proposta) => proposta.clienteId === cliente.id,
    ).length;
    const complemento =
      propostasCliente > 0
        ? ` Este cliente possui ${propostasCliente} proposta${
            propostasCliente === 1 ? "" : "s"
          } ativa${propostasCliente === 1 ? "" : "s"}.`
        : "";

    if (
      window.confirm(
        `Arquivar o cliente "${cliente.nome}"? Ele sairá da lista ativa.${complemento}`,
      )
    ) {
      arquivarClienteMutation.mutate(cliente.id);
    }
  }

  function arquivarServicoComConfirmacao(servico: ServicoResponse) {
    const propostasServico = propostas.filter((proposta) =>
      proposta.itens.some((item) => item.servicoId === servico.id),
    ).length;
    const complemento =
      propostasServico > 0
        ? ` Este serviço aparece em ${propostasServico} proposta${
            propostasServico === 1 ? "" : "s"
          } ativa${propostasServico === 1 ? "" : "s"}.`
        : "";

    if (
      window.confirm(
        `Arquivar o serviço "${servico.nome}"? Ele sairá do catálogo ativo.${complemento}`,
      )
    ) {
      arquivarServicoMutation.mutate(servico.id);
    }
  }

  function arquivarPropostaComConfirmacao(proposta: PropostaResponse) {
    if (
      window.confirm(
        `Arquivar a proposta "${proposta.titulo}"? Ela sairá do histórico ativo.`,
      )
    ) {
      arquivarPropostaMutation.mutate(proposta.id);
    }
  }

  function duplicarPropostaComConfirmacao(proposta: PropostaResponse) {
    executarComConfirmacaoDescarte(() => {
      if (
        window.confirm(
          `Duplicar a proposta "${proposta.titulo}" como novo rascunho?`,
        )
      ) {
        duplicarPropostaMutation.mutate(proposta.id);
      }
    });
  }

  async function handleLogoArquivoChange(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) {
      return;
    }

    await prepararLogoArquivoPendente(arquivo);
  }

  async function prepararLogoArquivoPendente(arquivo: File) {
    if (!logoArquivoTiposPermitidos.includes(arquivo.type)) {
      setPerfilMensagem("Use uma imagem PNG, JPG ou WebP para a logomarca.");
      return;
    }

    if (arquivo.size > logoArquivoTamanhoMaximoBytes) {
      setPerfilMensagem(
        `A logomarca tem ${formatarTamanhoArquivo(
          arquivo.size,
        )}. O limite recomendado e ${logoArquivoTamanhoMaximoLabel}.`,
      );
      return;
    }

    const previewUrl = URL.createObjectURL(arquivo);

    try {
      setPerfilMensagem(null);
      const sugestao = await buildLogoSugestaoPerfil(arquivo, previewUrl);
      setLogoArquivoPendente(arquivo);
      setLogoPreviewPerfilUrl(previewUrl);
      setLogoSugestaoPerfil(sugestao);
      setLogoRemocaoPendente(false);
      setPerfilMensagem("Imagem pronta para salvar no perfil.");
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setPerfilMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível analisar a logomarca.",
      );
    }
  }

  function handleLogoDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setLogoDragAtivo(true);
  }

  function handleLogoDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setLogoDragAtivo(true);
  }

  function handleLogoDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const proximoAlvo = event.relatedTarget;

    if (
      proximoAlvo instanceof Node &&
      event.currentTarget.contains(proximoAlvo)
    ) {
      return;
    }

    setLogoDragAtivo(false);
  }

  async function handleLogoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setLogoDragAtivo(false);

    const arquivo = event.dataTransfer.files?.[0];

    if (!arquivo) {
      return;
    }

    await prepararLogoArquivoPendente(arquivo);
  }

  function aplicarLogoSugestaoPerfil() {
    if (!logoSugestaoPerfil) {
      return;
    }

    perfilForm.setValue("corPrimaria", logoSugestaoPerfil.corPrimaria, {
      shouldDirty: true,
      shouldValidate: true,
    });
    perfilForm.setValue("corSecundaria", logoSugestaoPerfil.corSecundaria, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setLogoSugestaoPerfil(null);
    setPerfilMensagem("Cores aplicadas. Revise e salve o perfil.");
  }

  function limparLogomarcaPerfil() {
    limparLogoArquivoPendente();
    perfilForm.setValue("logoUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setLogoRemocaoPendente(true);
    setPerfilMensagem("Logomarca removida. Salve o perfil para confirmar.");
  }

  function removerLogoArquivoSelecionado() {
    limparLogoArquivoPendente();
    perfilForm.setValue("logoUrl", perfilConta?.logoUrl ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPerfilMensagem(null);
  }

  function cancelarLimpezaLogomarcaPerfil() {
    perfilForm.setValue("logoUrl", perfilConta?.logoUrl ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setLogoRemocaoPendente(false);
    setPerfilMensagem(null);
  }

  const corPrimaria = useWatch({
    control: perfilForm.control,
    name: "corPrimaria",
  });
  const corSecundaria = useWatch({
    control: perfilForm.control,
    name: "corSecundaria",
  });
  const templateVisualPadraoPreview = useWatch({
    control: perfilForm.control,
    name: "templateVisualPadrao",
  });
  const logoUrlPerfilForm = useWatch({
    control: perfilForm.control,
    name: "logoUrl",
  });
  const perfilPersonalizacaoPreview = useWatch({
    control: perfilForm.control,
  });
  const logoPreviewAtualUrl =
    logoRemocaoPendente
      ? null
      : logoPreviewPerfilUrl ?? resolveApiAssetUrl(logoUrlPerfilForm) ?? null;
  const templateVisualPersonalizacaoPreview = normalizarTemplateVisual(
    templateVisualPadraoPreview,
  );
  const perfilContaPersonalizacaoPreview: PerfilContaResponse | undefined = conta
    ? {
        id: perfilConta?.id ?? null,
        contaId: perfilConta?.contaId ?? conta.id,
        nomeComercial:
          perfilPersonalizacaoPreview.nomeComercial?.trim() ||
          perfilConta?.nomeComercial ||
          conta.nome,
        emailContato:
          perfilPersonalizacaoPreview.emailContato?.trim() ||
          perfilConta?.emailContato ||
          null,
        telefoneContato:
          perfilPersonalizacaoPreview.telefoneContato?.trim() ||
          perfilConta?.telefoneContato ||
          null,
        siteUrl:
          perfilPersonalizacaoPreview.siteUrl?.trim() ||
          perfilConta?.siteUrl ||
          null,
        instagram:
          perfilPersonalizacaoPreview.instagram?.trim() ||
          perfilConta?.instagram ||
          null,
        documento:
          perfilPersonalizacaoPreview.documento?.trim() ||
          perfilConta?.documento ||
          null,
        corPrimaria: normalizarHexPreview(
          perfilPersonalizacaoPreview.corPrimaria ||
            perfilContaDefaultValues.corPrimaria,
        ),
        corSecundaria: normalizarHexPreview(
          perfilPersonalizacaoPreview.corSecundaria ||
            perfilContaDefaultValues.corSecundaria,
        ),
        corSistemaPrimaria: normalizarHexPreview(
          perfilPersonalizacaoPreview.corSistemaPrimaria ||
            perfilContaDefaultValues.corSistemaPrimaria,
        ),
        corSistemaSecundaria: normalizarHexPreview(
          perfilPersonalizacaoPreview.corSistemaSecundaria ||
            perfilContaDefaultValues.corSistemaSecundaria,
        ),
        logoUrl: logoPreviewAtualUrl,
        templateVisualPadrao: templateVisualPersonalizacaoPreview,
        updatedAt: perfilConta?.updatedAt ?? null,
      }
    : perfilConta;
  const personalizacaoPreviewItens: NonNullable<PropostaPreviewInput["itens"]> = [
    {
      nome: "Gestao mensal de Instagram",
      descricao: "Planejamento, conteudo e acompanhamento estrategico.",
      quantidade: 1,
      valorUnitario: 1200,
    },
    {
      nome: "Criacao de posts para feed",
      descricao: "Artes profissionais alinhadas a identidade da marca.",
      quantidade: 8,
      valorUnitario: 80,
    },
    {
      nome: "Producao de reels",
      descricao: "Roteiro, edicao e finalizacao para publicacao.",
      quantidade: 4,
      valorUnitario: 140,
    },
  ];
  const personalizacaoPreviewSubtotal = calcularTotalItens(
    personalizacaoPreviewItens,
  );
  const personalizacaoPreviewDesconto = 150;
  const personalizacaoPreviewTotal = calcularTotalProposta(
    personalizacaoPreviewSubtotal,
    personalizacaoPreviewDesconto,
  );
  const propostaPersonalizacaoPreview: PropostaPreviewInput = {
    titulo: "Proposta comercial de Social Media",
    introducao:
      "Preview real para conferir como o template padrao sera impresso e compartilhado.",
    observacoes:
      "A logomarca, as cores e os dados da conta seguem as configuracoes atuais.",
    validadeDias: 7,
    templateVisual:
      personalizacaoPreviewTemplateAberto ?? templateVisualPersonalizacaoPreview,
    itens: personalizacaoPreviewItens,
    descontoValor: personalizacaoPreviewDesconto,
    condicoesPagamento:
      "50% na aprovacao e 50% em ate 15 dias apos o inicio dos servicos.",
    itensInclusosTexto:
      "Planejamento mensal\nCalendario editorial\nLegendas otimizadas\nRelatorio simples",
    itensNaoInclusosTexto:
      "Midia paga\nCobertura presencial\nProducao fotografica profissional",
    cronogramaTexto:
      "Inicio em ate 3 dias uteis\nPlano mensal com recorrencia minima de 3 meses\n2 rodadas de revisao",
    beneficiosTexto:
      "Presenca consistente\nConexao com a marca\nOrganizacao do conteudo\nMais performance",
  };

  const logoArquivoPendenteDescricao = logoArquivoPendente
    ? `${logoArquivoPendente.name} - ${formatarTamanhoArquivo(
        logoArquivoPendente.size,
      )}`
    : null;
  const logoStatusDescricao = logoRemocaoPendente
    ? "Logomarca marcada para remocao."
    : logoArquivoPendenteDescricao ??
      (logoUrlPerfilForm ? "Logomarca salva no perfil." : "Nenhuma logomarca salva.");
  const logoStatusComplemento = logoRemocaoPendente
    ? "Pendente: a referencia sera apagada ao clicar em Salvar perfil."
    : logoArquivoPendente
      ? "Pendente: sera enviada ao clicar em Salvar perfil."
      : logoUrlPerfilForm
        ? "A logo salva continua ativa ate uma nova imagem ser salva."
        : "Selecione uma imagem para usar logomarca no perfil.";
  const podeLimparLogomarca = Boolean(
    logoPreviewAtualUrl || logoArquivoPendente || logoUrlPerfilForm,
  );
  const propostaStatusMutationPendente =
    enviarPropostaMutation.isPending ||
    aceitarPropostaMutation.isPending ||
    recusarPropostaMutation.isPending;

  return (
    <div className="app-shell min-h-screen bg-background text-foreground">
      <div
        className={`app-frame mx-auto min-h-screen w-full ${
          usuario && conta
            ? "app-frame-auth grid"
            : "app-frame-public flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        <header
          className={`app-header flex flex-col gap-4 border-b border-border md:flex-row md:items-center md:justify-between ${
            usuario && conta ? "app-header-auth" : "app-header-public pb-5"
          }`}
        >
          {usuario && conta ? (
            <div className="topbar-actions flex w-full justify-end">
              <button
                onClick={logoutUsuario}
                className="brand-secondary-action inline-flex h-10 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <BrandAssinatura
                nomeMarca="Emprely Orçamentos"
                subtitulo="Propostas que impulsionam"
                logoUrl={emprelyFaviconSrc}
                mostrarEmprelySecundario={false}
              />
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="brand-primary-action inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <FileText size={18} aria-hidden="true" />
                Entrar
              </button>
            </>
          )}
        </header>

        <main
          className={
            usuario && conta
              ? "app-main-area"
              : "grid flex-1 gap-5 py-6"
          }
        >
          {usuario && conta ? (
            <nav className="app-sidebar border-r border-border bg-surface">
              <div className="sidebar-product-brand flex items-center gap-3">
                <img
                  src={emprelyFaviconSrc}
                  alt=""
                  className="h-9 w-9 rounded-md object-contain"
                  aria-hidden="true"
                />
                <div>
                  <strong className="block font-heading text-sm font-semibold text-foreground">
                    Emprely
                  </strong>
                  <span className="text-xs font-semibold text-primary">
                    Orçamentos
                  </span>
                </div>
              </div>
              <div className="sidebar-menu mt-7 space-y-1">
                {navegacaoPrincipal.map((item) => {
                  const Icon = item.icon;
                  const itemAtivo = appView === item.view;

                  return (
                    <div
                      key={item.label}
                      className={`app-nav-row flex items-center gap-1 rounded-md ${
                        itemAtivo ? "is-active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => navegarParaView(item.view)}
                        aria-label={
                          item.view === "servicos"
                            ? "Serviços"
                            : item.view === "conta"
                              ? "Conta"
                              : item.label
                        }
                        aria-current={itemAtivo ? "page" : undefined}
                        className={`app-nav-item flex h-11 min-w-0 flex-1 items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                          itemAtivo
                            ? "is-active bg-slate-100 text-foreground"
                            : "text-muted hover:bg-slate-100 hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </button>
                      {item.quickAction && item.quickLabel ? (
                        <button
                          type="button"
                          onClick={() => executarAcaoRapidaMenu(item.quickAction!)}
                          aria-label={item.quickLabel}
                          title={item.quickLabel}
                          data-tooltip={item.quickLabel}
                          className="app-nav-action tooltip-icon-button"
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div
                ref={contaMenuRef}
                className="sidebar-account relative mt-auto rounded-md border border-border bg-white p-2"
              >
                <button
                  type="button"
                  className="sidebar-account-button flex w-full items-center gap-3 rounded-md p-2 text-left"
                  aria-haspopup="menu"
                  aria-expanded={contaMenuAberto}
                  onClick={() => setContaMenuAberto((aberto) => !aberto)}
                >
                  {logoMarcaTopo ? (
                    <img
                      src={logoMarcaTopo}
                      alt=""
                      className="h-10 w-10 rounded-md object-contain"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                      {nomeMarcaTopo.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-semibold">
                      {nomeMarcaTopo}
                    </strong>
                    <span className="block truncate text-xs text-muted">
                      {subtituloMarcaTopo}
                    </span>
                  </span>
                  <ChevronUp
                    size={16}
                    aria-hidden="true"
                    className={`shrink-0 text-muted transition ${
                      contaMenuAberto ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {contaMenuAberto ? (
                  <div className="sidebar-account-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => navegarParaView("conta")}
                      className={`sidebar-account-menu-item ${
                        appView === "conta" ? "is-active" : ""
                      }`}
                    >
                      <Settings size={16} aria-hidden="true" />
                      Configurações
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => navegarParaView("personalizacao")}
                      className={`sidebar-account-menu-item ${
                        appView === "personalizacao" ? "is-active" : ""
                      }`}
                    >
                      <Palette size={16} aria-hidden="true" />
                      Personalização
                    </button>
                  </div>
                ) : null}
              </div>
            </nav>
          ) : null}

          <section className="app-content view-transition">
            <div className="app-content-body space-y-5">
              {usuario && conta ? (
              <>
                {appView === "clientes" ? (
                  <section className="space-y-5">
                    <div className="page-heading">
                      <div>
                        <h1 className="font-heading text-3xl font-semibold">
                          Clientes
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                          Cadastre contatos uma vez e monte propostas sem retrabalho.
                        </p>
                      </div>
                      <div className="page-heading-actions">
                        {clienteModo === "lista" ? (
                          <button
                            type="button"
                            onClick={novoCliente}
                            className="page-heading-action is-primary"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Novo cliente
                          </button>
                        ) : (
                          <>
                            {clienteModo === "editar" ? (
                              <button
                                type="button"
                                onClick={novoCliente}
                                className="page-heading-action"
                              >
                                <Plus size={18} aria-hidden="true" />
                                Novo cliente
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={voltarListaClientes}
                              className="page-heading-action"
                            >
                              <ArrowRight
                                className="rotate-180"
                                size={18}
                                aria-hidden="true"
                              />
                              Voltar para lista
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {clienteModo === "lista" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent">
                              Base ativa
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              {clientesFiltrados.length} de {clientes.length} cliente
                              {clientes.length === 1 ? "" : "s"}
                            </h2>
                          </div>
                        </div>

                        <div className="mt-5">
                          <CampoTexto
                            label="Buscar clientes"
                            type="search"
                            value={buscaClientes}
                            placeholder="Nome, email, telefone ou documento"
                            onChange={(event) => {
                              setBuscaClientes(event.target.value);
                              setClientePagina(1);
                            }}
                          />
                        </div>

                        {clientesQuery.isLoading ? (
                          <ListaCarregando label="Carregando clientes" />
                        ) : null}

                        {clientesQuery.isError ? (
                          <EstadoErroConsulta
                            titulo="Não foi possível carregar clientes."
                            detalhe="Verifique a conexão e tente atualizar a lista."
                            onRetry={() => {
                              void clientesQuery.refetch();
                            }}
                          />
                        ) : null}

                        {!clientesQuery.isLoading && clientes.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhum cliente ativo cadastrado."
                            detalhe="Cadastre um contato para montar propostas com menos retrabalho."
                            action={{
                              label: "Cadastrar primeiro cliente",
                              icon: <Plus size={16} aria-hidden="true" />,
                              onClick: novoCliente,
                            }}
                          />
                        ) : null}

                        {!clientesQuery.isLoading &&
                        clientes.length > 0 &&
                        clientesFiltrados.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhum cliente encontrado."
                            detalhe="Revise o termo buscado ou limpe a busca para ver toda a base."
                          />
                        ) : null}

                        {clientesPaginados.itens.length > 0 ? (
                          <div className="mt-5 overflow-x-auto">
                            <table className="data-table w-full min-w-[760px] text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Cliente</th>
                                  <th>Email</th>
                                  <th>Telefone</th>
                                  <th>Documento</th>
                                  <th>Acoes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientesPaginados.itens.map((cliente) => {
                                  const whatsappContatoClienteUrl =
                                    buildWhatsappContatoClienteUrl(cliente);

                                  return (
                                    <tr key={cliente.id}>
                                    <td data-label="Cliente">
                                      <strong>{cliente.nome}</strong>
                                      <span>
                                        {cliente.observacoes || "Sem observações"}
                                      </span>
                                    </td>
                                    <td data-label="Email">{cliente.email ?? "Não informado"}</td>
                                    <td data-label="Telefone">
                                      <div className="flex min-w-0 items-center gap-2">
                                        <span className="min-w-0 truncate">
                                          {cliente.telefone ?? "Não informado"}
                                        </span>
                                        <ContatoWhatsappClienteButton
                                          href={whatsappContatoClienteUrl}
                                          ariaLabel={`Entrar em contato com ${cliente.nome} pelo WhatsApp`}
                                        />
                                      </div>
                                    </td>
                                    <td data-label="Documento">{cliente.documento || "Não informado"}</td>
                                    <td data-label="Ações">
                                      <ListagemAcoes
                                        ariaLabel={`Acoes do cliente ${cliente.nome}`}
                                        acoes={[
                                          {
                                            label: "Visualizar",
                                            icon: <Eye size={16} />,
                                            onClick: () =>
                                              visualizarCliente(cliente.id),
                                          },
                                          {
                                            label: "Editar",
                                            icon: <Edit3 size={16} />,
                                            onClick: () =>
                                              selecionarCliente(cliente.id),
                                          },
                                          {
                                            label: "Excluir",
                                            icon: <Trash2 size={16} />,
                                            destructive: true,
                                            disabled:
                                              arquivarClienteMutation.isPending,
                                            onClick: () =>
                                              arquivarClienteComConfirmacao(
                                                cliente,
                                              ),
                                          },
                                        ]}
                                      />
                                    </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                        <PaginacaoLista
                          label="clientes"
                          paginacao={clientesPaginados}
                          tamanhoPagina={clienteTamanhoPagina}
                          onChangePagina={setClientePagina}
                          onChangeTamanhoPagina={(tamanho) => {
                            setClienteTamanhoPagina(tamanho);
                            setClientePagina(1);
                          }}
                        />
                        <MensagemSucesso mensagem={clienteMensagem} />
                        <MensagemErro error={arquivarClienteMutation.error} />
                      </div>
                    ) : null}

                    {clienteModo === "visualizar" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                        {clienteSelecionado ? (
                          <>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-medium text-accent">
                                  Cliente
                                </p>
                                <h2 className="mt-1 font-heading text-2xl font-semibold leading-8">
                                  {clienteSelecionado.nome}
                                </h2>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => selecionarCliente(clienteSelecionado.id)}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                                >
                                  <Edit3 size={16} aria-hidden="true" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => abrirNovaProposta(clienteSelecionado.id)}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-accent px-3 text-sm font-semibold text-accent transition hover:border-teal-600 hover:text-teal-700"
                                >
                                  <FileText size={16} aria-hidden="true" />
                                  Criar proposta
                                </button>
                              </div>
                            </div>
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                              <InfoLinha
                                label="Email"
                                value={clienteSelecionado.email ?? "Não informado"}
                              />
                              <InfoLinha
                                label="Telefone"
                                value={clienteSelecionado.telefone ?? "Não informado"}
                              />
                              <InfoLinha
                                label="Documento"
                                value={clienteSelecionado.documento || "Não informado"}
                              />
                              <InfoLinha
                                label="Status"
                                value={clienteSelecionado.status}
                              />
                            </div>
                            {clienteSelecionado.observacoes ? (
                              <p className="mt-5 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
                                {clienteSelecionado.observacoes}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <div className="text-sm text-muted">
                            Cliente não encontrado.
                          </div>
                        )}
                      </div>
                    ) : null}

                    {clienteModo === "novo" || clienteModo === "editar" ? (
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
                          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                            <CampoTexto
                              label="Telefone"
                              placeholder="(11) 99999-9999"
                              error={clienteForm.formState.errors.telefone?.message}
                              {...clienteForm.register("telefone")}
                            />
                            <ContatoWhatsappClienteButton
                              href={clienteFormularioWhatsappUrl}
                              ariaLabel="Entrar em contato com este cliente pelo WhatsApp"
                              size="lg"
                            />
                          </div>
                          <CampoTexto
                            label="Documento"
                            error={clienteForm.formState.errors.documento?.message}
                            {...clienteForm.register("documento")}
                          />
                        </div>
                        <CampoTextarea
                          label="Observações"
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
                          {clienteModo === "editar" ? (
                            <button
                              type="button"
                              onClick={voltarListaClientes}
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
                    ) : null}
                  </section>
                ) : null}

                {appView === "servicos" ? (
                  <section className="space-y-5">
                    <div className="page-heading">
                      <div>
                        <h1 className="font-heading text-3xl font-semibold">
                          Meus serviços e pacotes
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                          Cadastre uma vez e reutilize em todos os orçamentos.
                        </p>
                      </div>
                      <div className="page-heading-actions">
                        {servicoModo === "lista" ? (
                          <button
                            type="button"
                            onClick={novoServico}
                            className="page-heading-action is-primary"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Novo serviço
                          </button>
                        ) : (
                          <>
                            {servicoModo === "editar" ? (
                              <button
                                type="button"
                                onClick={novoServico}
                                className="page-heading-action"
                              >
                                <Plus size={18} aria-hidden="true" />
                                Novo serviço
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={voltarListaServicos}
                              className="page-heading-action"
                            >
                              <ArrowRight
                                className="rotate-180"
                                size={18}
                                aria-hidden="true"
                              />
                              Voltar para lista
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {servicoModo === "lista" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent">
                              Catálogo ativo
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              {servicosFiltrados.length} de {servicos.length} serviço
                              {servicos.length === 1 ? "" : "s"}
                            </h2>
                          </div>
                        </div>

                        <div className="mt-5">
                          <CampoTexto
                            label="Buscar serviços"
                            type="search"
                            value={buscaServicos}
                            placeholder="Nome, categoria, descrição ou tipo"
                            onChange={(event) => {
                              setBuscaServicos(event.target.value);
                              setServicoPagina(1);
                            }}
                          />
                        </div>

                        {servicosQuery.isLoading ? (
                          <ListaCarregando label="Carregando serviços" />
                        ) : null}

                        {servicosQuery.isError ? (
                          <EstadoErroConsulta
                            titulo="Não foi possível carregar serviços."
                            detalhe="Tente novamente antes de editar o catálogo."
                            onRetry={() => {
                              void servicosQuery.refetch();
                            }}
                          />
                        ) : null}

                        {!servicosQuery.isLoading && servicos.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhum serviço ativo cadastrado."
                            detalhe="Crie itens reutilizáveis para montar propostas com mais velocidade."
                            action={{
                              label: "Cadastrar primeiro serviço",
                              icon: <Plus size={16} aria-hidden="true" />,
                              onClick: novoServico,
                            }}
                          />
                        ) : null}

                        {!servicosQuery.isLoading &&
                        servicos.length > 0 &&
                        servicosFiltrados.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhum serviço encontrado."
                            detalhe="Revise o termo buscado ou limpe a busca para ver todo o catálogo."
                          />
                        ) : null}

                        {servicosPaginados.itens.length > 0 ? (
                          <div className="mt-5 overflow-x-auto">
                            <table className="data-table w-full min-w-[760px] text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Serviço / Pacote</th>
                                  <th>Categoria</th>
                                  <th>Tipo</th>
                                  <th>Valor</th>
                                  <th>Acoes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {servicosPaginados.itens.map((servico) => (
                                  <tr key={servico.id}>
                                    <td data-label="Serviço / Pacote">
                                      <strong>{servico.nome}</strong>
                                      <span>
                                        {servico.descricao || "Sem descrição"}
                                      </span>
                                    </td>
                                    <td data-label="Categoria">{servico.categoria || "Não informado"}</td>
                                    <td data-label="Tipo">{formatTipoServico(servico.tipo)}</td>
                                    <td data-label="Valor">
                                      <strong>{formatMoney(servico.preco)}</strong>
                                      <span>
                                        {formatUnidadeServico(servico.unidade)}
                                      </span>
                                    </td>
                                    <td data-label="Ações">
                                      <ListagemAcoes
                                        ariaLabel={`Acoes do servico ${servico.nome}`}
                                        acoes={[
                                          {
                                            label: "Visualizar",
                                            icon: <Eye size={16} />,
                                            onClick: () =>
                                              visualizarServico(servico.id),
                                          },
                                          {
                                            label: "Editar",
                                            icon: <Edit3 size={16} />,
                                            onClick: () =>
                                              selecionarServico(servico.id),
                                          },
                                          {
                                            label: "Excluir",
                                            icon: <Trash2 size={16} />,
                                            destructive: true,
                                            disabled:
                                              arquivarServicoMutation.isPending,
                                            onClick: () =>
                                              arquivarServicoComConfirmacao(
                                                servico,
                                              ),
                                          },
                                        ]}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                        <PaginacaoLista
                          label="serviços"
                          paginacao={servicosPaginados}
                          tamanhoPagina={servicoTamanhoPagina}
                          onChangePagina={setServicoPagina}
                          onChangeTamanhoPagina={(tamanho) => {
                            setServicoTamanhoPagina(tamanho);
                            setServicoPagina(1);
                          }}
                        />
                        <MensagemSucesso mensagem={servicoMensagem} />
                        <MensagemErro error={arquivarServicoMutation.error} />
                      </div>
                    ) : null}

                    {servicoModo === "visualizar" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                        {servicoSelecionado ? (
                          <>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-medium text-accent">
                                  Serviço / Pacote
                                </p>
                                <h2 className="mt-1 font-heading text-2xl font-semibold leading-8">
                                  {servicoSelecionado.nome}
                                </h2>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => selecionarServico(servicoSelecionado.id)}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                                >
                                  <Edit3 size={16} aria-hidden="true" />
                                  Editar
                                </button>
                              </div>
                            </div>
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                              <InfoLinha
                                label="Categoria"
                                value={servicoSelecionado.categoria || "Não informado"}
                              />
                              <InfoLinha
                                label="Tipo"
                                value={formatTipoServico(servicoSelecionado.tipo)}
                              />
                              <InfoLinha
                                label="Valor"
                                value={formatMoney(servicoSelecionado.preco)}
                              />
                              <InfoLinha
                                label="Unidade"
                                value={formatUnidadeServico(servicoSelecionado.unidade)}
                              />
                            </div>
                            {servicoSelecionado.descricao ? (
                              <p className="mt-5 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
                                {servicoSelecionado.descricao}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <div className="text-sm text-muted">
                            Serviço não encontrado.
                          </div>
                        )}
                      </div>
                    ) : null}

                    {servicoModo === "novo" || servicoModo === "editar" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Serviços
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {servicoSelecionado ? "Editar serviço" : "Novo serviço"}
                          </h2>
                        </div>
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
                            label="Preço"
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
                            <option value="Unico">Único</option>
                            <option value="Mensal">Mensal</option>
                            <option value="PorHora">Por hora</option>
                            <option value="PorItem">Por item</option>
                          </CampoSelect>
                          <CampoSelect
                            label="Tipo"
                            error={servicoForm.formState.errors.tipo?.message}
                            {...servicoForm.register("tipo")}
                          >
                            <option value="Servico">Serviço</option>
                            <option value="Pacote">Pacote</option>
                          </CampoSelect>
                        </div>
                        <CampoTextarea
                          label="Descrição"
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
                              : "Salvar serviço"}
                          </button>
                          {servicoModo === "editar" ? (
                            <button
                              type="button"
                              onClick={voltarListaServicos}
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
                    ) : null}
                  </section>
                ) : null}

                {appView === "propostas" ? (
                  <section
                    className={
                      propostaEditorAtivo
                        ? "proposal-builder-layout"
                        : "space-y-5"
                    }
                  >
                    <div className="page-heading xl:col-span-2">
                      <div>
                        <h1 className="font-heading text-3xl font-semibold">
                          {propostaModo === "lista"
                            ? "Propostas"
                            : propostaSelecionada
                              ? "Editar proposta"
                              : "Nova proposta"}
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                          {propostaModo === "lista"
                            ? "Histórico, duplicação e envio rápido pelo WhatsApp."
                            : "Monte um orçamento claro, revise o resumo e salve quando estiver pronto."}
                        </p>
                      </div>
                      <div className="page-heading-actions">
                        {propostaModo === "lista" ? (
                          <button
                            type="button"
                            onClick={novaProposta}
                            className="page-heading-action is-primary"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Nova proposta
                          </button>
                        ) : (
                          <>
                            {propostaSelecionada ? (
                              <button
                                type="button"
                                onClick={novaProposta}
                                className="page-heading-action"
                              >
                                <Plus size={18} aria-hidden="true" />
                                Nova proposta
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={voltarListaPropostas}
                              className="page-heading-action"
                            >
                              <ArrowRight
                                className="rotate-180"
                                size={18}
                                aria-hidden="true"
                              />
                              Voltar para lista
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {propostaMensagem ? (
                      <div className="proposal-grid-full">
                        <MensagemSucesso mensagem={propostaMensagem} />
                      </div>
                    ) : null}
                    {propostaEditorAtivo ? (
                    <div className="proposal-form-panel rounded-md border border-border bg-surface p-5">
                      <div className="proposal-builder-header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-primary">
                            Builder comercial
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            {propostaSelecionada
                              ? "Editar proposta"
                            : "Nova proposta"}
                          </h2>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                            Edite cliente, mensagem, escopo, valores e condicoes comerciais da proposta.
                          </p>
                        </div>
                      </div>

                      {clientes.length === 0 ? (
                        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          <p>Cadastre um cliente antes de criar propostas.</p>
                        </div>
                      ) : null}

                      {servicos.length === 0 ? (
                        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          <p>
                            Cadastre um serviço ou use item livre para montar o
                            primeiro rascunho.
                          </p>
                          <button
                            type="button"
                            onClick={abrirNovoServico}
                            className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 transition hover:border-amber-500"
                          >
                            <PackageCheck size={16} aria-hidden="true" />
                            Cadastrar serviço
                          </button>
                        </div>
                      ) : null}

                      <form
                        id="proposta-editor-form"
                        className="proposal-form-flow"
                        onSubmit={propostaForm.handleSubmit((input) =>
                          salvarPropostaMutation.mutate(input),
                        )}
                      >
                        <input
                          type="hidden"
                          {...propostaForm.register("templateVisual")}
                        />
                        <div className="proposal-section">
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <UsersRound size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Etapa 1</p>
                              <h3>Cliente e validade</h3>
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-[1fr_150px]">
                            <CampoSelect
                              label="Cliente"
                              error={propostaForm.formState.errors.clienteId?.message}
                              {...propostaForm.register("clienteId", {
                                onChange: handleClientePropostaChange,
                              })}
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
                        </div>

                        <div className="proposal-section">
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <FileText size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Etapa 2</p>
                              <h3>Mensagem da proposta</h3>
                            </div>
                          </div>
                          <CampoTexto
                            label="Título"
                            error={propostaForm.formState.errors.titulo?.message}
                            {...propostaForm.register("titulo")}
                          />
                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <CampoTextarea
                              label="Introdução"
                              rows={4}
                              error={propostaForm.formState.errors.introducao?.message}
                              {...propostaForm.register("introducao")}
                            />
                            <CampoTextarea
                              label="Observações"
                              rows={4}
                              error={propostaForm.formState.errors.observacoes?.message}
                              {...propostaForm.register("observacoes")}
                            />
                          </div>
                        </div>

                        <div className="proposal-section">
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <PackageCheck size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Etapa 3</p>
                              <h3>Itens e serviços</h3>
                            </div>
                          </div>
                          <div className="proposal-catalog-row">
                            <div className="flex-1">
                                <CampoSelect
                                  label="Adicionar do catálogo"
                                value={servicoParaAdicionarId}
                                onChange={(event) =>
                                  setServicoParaAdicionarId(event.target.value)
                                }
                              >
                                <option value="">Selecione um serviço</option>
                                {servicos.map((servico) => (
                                  <option key={servico.id} value={servico.id}>
                                    {servico.nome} - {formatMoney(servico.preco)}
                                  </option>
                                ))}
                                </CampoSelect>
                                <p className="mt-2 text-xs leading-5 text-muted">
                                  Ao adicionar, nome, descrição e preço são
                                  copiados para esta proposta.
                                </p>
                              </div>
                            <div className="proposal-catalog-actions">
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
                            {propostaItemFields.length === 0 ? (
                              <div className="proposal-empty-items">
                                <PackageCheck size={18} aria-hidden="true" />
                                <span>
                                  Adicione um serviço salvo ou crie um item livre para
                                  montar o escopo.
                                </span>
                              </div>
                            ) : null}
                            {propostaItemFields.map((field, index) => {
                              const itemPreview = propostaItensPreview[index];
                              const itemTotal = calcularTotalItens(
                                itemPreview ? [itemPreview] : [],
                              );

                              return (
                                <article
                                  key={field.id}
                                  className="proposal-item-card"
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
                                      label="Descrição"
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

                        <div className="proposal-section">
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <ReceiptText size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Opcionais</p>
                              <h3>Detalhamento comercial</h3>
                            </div>
                          </div>
                          <div className="grid gap-4 lg:grid-cols-2">
                            <CampoTexto
                              label="Desconto em R$"
                              type="number"
                              min="0"
                              step="0.01"
                              error={
                                propostaForm.formState.errors.descontoValor
                                  ?.message
                              }
                              {...propostaForm.register("descontoValor", {
                                valueAsNumber: true,
                              })}
                            />
                            <CampoTextarea
                              label="Condições de pagamento"
                              rows={3}
                              error={
                                propostaForm.formState.errors
                                  .condicoesPagamento?.message
                              }
                              {...propostaForm.register("condicoesPagamento")}
                            />
                          </div>
                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <CampoTextarea
                              label="O que está incluso"
                              rows={4}
                              helperText="Uma linha por item. Se ficar vazio, a seção some do template."
                              error={
                                propostaForm.formState.errors.itensInclusosTexto
                                  ?.message
                              }
                              {...propostaForm.register("itensInclusosTexto")}
                            />
                            <CampoTextarea
                              label="O que não está incluso"
                              rows={4}
                              helperText="Uma linha por item. Se ficar vazio, a seção some do template."
                              error={
                                propostaForm.formState.errors
                                  .itensNaoInclusosTexto?.message
                              }
                              {...propostaForm.register("itensNaoInclusosTexto")}
                            />
                            <CampoTextarea
                              label="Cronograma"
                              rows={4}
                              helperText="Uma linha por marco, prazo ou condição."
                              error={
                                propostaForm.formState.errors.cronogramaTexto
                                  ?.message
                              }
                              {...propostaForm.register("cronogramaTexto")}
                            />
                            <CampoTextarea
                              label="Benefícios"
                              rows={4}
                              helperText="Uma linha por benefício esperado."
                              error={
                                propostaForm.formState.errors.beneficiosTexto
                                  ?.message
                              }
                              {...propostaForm.register("beneficiosTexto")}
                            />
                          </div>
                        </div>

                        <div className="proposal-total-bar">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-muted">
                              Fechamento
                            </p>
                            <strong className="mt-1 block text-3xl font-semibold">
                              {formatMoney(propostaTotalPreview)}
                            </strong>
                            <span className="mt-1 block text-sm text-muted">
                              Subtotal {formatMoney(propostaSubtotalPreview)}
                              {propostaDescontoPreview > 0
                                ? ` - desconto ${formatMoney(
                                    propostaDescontoPreview,
                                  )}`
                                : ""}
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              {propostaItemFields.length} item
                              {propostaItemFields.length === 1 ? "" : "s"} no escopo
                            </span>
                          </div>
                          <div className="proposal-total-status">
                            <span>
                              Template:{" "}
                              {getPropostaTemplateLabel(
                                normalizarTemplateVisual(
                                  propostaPreview.templateVisual,
                                ),
                              )}
                            </span>
                            {propostaSelecionada ? (
                              <span>Status: {propostaSelecionada.status}</span>
                            ) : null}
                          </div>
                        </div>
                        <MensagemSucesso mensagem={propostaMensagem} />
                        <MensagemErro error={salvarPropostaMutation.error} />
                        <MensagemErro error={duplicarPropostaMutation.error} />
                        <MensagemErro error={gerarPropostaMutation.error} />
                        <MensagemErro error={enviarPropostaMutation.error} />
                        <MensagemErro error={aceitarPropostaMutation.error} />
                        <MensagemErro error={recusarPropostaMutation.error} />
                        {!contaPodeExportarProposta ? (
                          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                            <p className="leading-5">{mensagemBloqueioPlano}</p>
                          </div>
                        ) : null}
                        {propostaSelecionada && propostaTemAlteracoes ? (
                          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                            Salve as alteracoes antes de gerar, imprimir ou
                            enviar a proposta.
                          </p>
                        ) : null}
                      </form>
                    </div>
                    ) : null}

                    {propostaEditorAtivo ? (
                      <aside
                        className={`proposal-action-rail no-print ${
                          propostaEditorAcoesExpandida ? "is-expanded" : ""
                        }`}
                        aria-label="Acoes da proposta"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPropostaEditorAcoesExpandida((expandida) => !expandida)
                          }
                          className="proposal-rail-action proposal-rail-toggle"
                          title={
                            propostaEditorAcoesExpandida
                              ? "Recolher barra"
                              : "Expandir barra"
                          }
                          aria-label={
                            propostaEditorAcoesExpandida
                              ? "Recolher barra de acoes"
                              : "Expandir barra de acoes"
                          }
                        >
                          {propostaEditorAcoesExpandida ? (
                            <PanelRightClose size={18} aria-hidden="true" />
                          ) : (
                            <PanelRightOpen size={18} aria-hidden="true" />
                          )}
                          <span className="proposal-action-label">
                            {propostaEditorAcoesExpandida ? "Recolher" : "Acoes"}
                          </span>
                        </button>
                        <div className="proposal-rail-group">
                          <button
                            type="submit"
                            form="proposta-editor-form"
                            disabled={
                              salvarPropostaMutation.isPending ||
                              clientes.length === 0
                            }
                            className="proposal-rail-action is-primary"
                            title="Salvar proposta"
                            aria-label="Salvar proposta"
                          >
                            <Save size={18} aria-hidden="true" />
                            <span className="proposal-action-label">
                              {salvarPropostaMutation.isPending
                                ? "Salvando"
                                : "Salvar"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPropostaPreviewModalAberto(true)}
                            className="proposal-rail-action"
                            title="Preview"
                            aria-label="Abrir preview da proposta"
                          >
                            <Eye size={18} aria-hidden="true" />
                            <span className="proposal-action-label">Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPropostaTemplateModalAberto(true)}
                            className="proposal-rail-action"
                            title="Template"
                            aria-label="Escolher template"
                          >
                            <LayoutDashboard size={18} aria-hidden="true" />
                            <span className="proposal-action-label">Template</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setClienteRapidoAberto(true)}
                            className="proposal-rail-action"
                            title="Novo Cliente"
                            aria-label="Novo Cliente"
                          >
                            <UsersRound size={18} aria-hidden="true" />
                            <span className="proposal-action-label">
                              Novo Cliente
                            </span>
                          </button>
                          {propostaSelecionadaRascunho ? (
                            <button
                              type="button"
                              disabled={
                                gerarPropostaMutation.isPending ||
                                !propostaProntaParaGerar
                              }
                              onClick={() =>
                                propostaSelecionada
                                  ? gerarPropostaMutation.mutate(
                                      propostaSelecionada.id,
                                    )
                                  : undefined
                              }
                              className="proposal-rail-action is-accent"
                              title={
                                propostaTemAlteracoes
                                  ? "Salve as alteracoes antes de gerar."
                                  : !contaPodeExportarProposta
                                    ? mensagemBloqueioPlano
                                    : "Gerar proposta"
                              }
                              aria-label="Gerar proposta"
                            >
                              <CheckCircle2 size={18} aria-hidden="true" />
                              <span className="proposal-action-label">
                                {gerarPropostaMutation.isPending
                                  ? "Gerando"
                                  : "Gerar"}
                              </span>
                            </button>
                          ) : null}
                          {propostaSelecionadaGerada ? (
                            <>
                              <button
                                type="button"
                                disabled={!propostaProntaParaEnvio}
                                onClick={() =>
                                  setPropostaCompartilharModalAberto(true)
                                }
                                className="proposal-rail-action is-accent"
                                title={
                                  propostaTemAlteracoes
                                    ? "Salve as alteracoes antes de compartilhar."
                                    : !contaPodeExportarProposta
                                      ? mensagemBloqueioPlano
                                      : "Compartilhar"
                                }
                                aria-label="Compartilhar proposta"
                              >
                                <Send size={18} aria-hidden="true" />
                                <span className="proposal-action-label">
                                  Compartilhar
                                </span>
                              </button>
                              <button
                                type="button"
                                disabled={
                                  !propostaProntaParaEnvio ||
                                  propostaStatusMutationPendente
                                }
                                onClick={() =>
                                  propostaSelecionada
                                    ? marcarPropostaEnviada(propostaSelecionada)
                                    : undefined
                                }
                                className="proposal-rail-action"
                                title="Marcar enviada"
                                aria-label="Marcar proposta enviada"
                              >
                                <Send size={18} aria-hidden="true" />
                                <span className="proposal-action-label">
                                  {enviarPropostaMutation.isPending
                                    ? "Marcando"
                                    : "Marcar enviada"}
                                </span>
                              </button>
                            </>
                          ) : null}
                          {propostaSelecionadaEnviada ? (
                            <>
                              <button
                                type="button"
                                disabled={
                                  !propostaProntaParaDecisao ||
                                  propostaStatusMutationPendente
                                }
                                onClick={() =>
                                  propostaSelecionada
                                    ? marcarPropostaAceita(propostaSelecionada)
                                    : undefined
                                }
                                className="proposal-rail-action is-accent"
                                title="Marcar aceita"
                                aria-label="Marcar proposta aceita"
                              >
                                <CheckCircle2 size={18} aria-hidden="true" />
                                <span className="proposal-action-label">
                                  {aceitarPropostaMutation.isPending
                                    ? "Marcando"
                                    : "Marcar aceita"}
                                </span>
                              </button>
                              <button
                                type="button"
                                disabled={
                                  !propostaProntaParaDecisao ||
                                  propostaStatusMutationPendente
                                }
                                onClick={() =>
                                  propostaSelecionada
                                    ? marcarPropostaRecusada(propostaSelecionada)
                                    : undefined
                                }
                                className="proposal-rail-action is-danger"
                                title="Marcar recusada"
                                aria-label="Marcar proposta recusada"
                              >
                                <XCircle size={18} aria-hidden="true" />
                                <span className="proposal-action-label">
                                  {recusarPropostaMutation.isPending
                                    ? "Marcando"
                                    : "Marcar recusada"}
                                </span>
                              </button>
                            </>
                          ) : null}
                        </div>
                      </aside>
                    ) : null}

                    <div className="space-y-5">
                      {propostaEditorAtivo ? (
                        <div className="proposal-export-buffer" aria-hidden="true">
                          <PreviewPropostaVisual
                            ref={propostaDocumentoRef}
                            perfilConta={perfilConta}
                            contaNome={conta.nome}
                            planoConta={conta.plano}
                            cliente={clientePreview}
                            clienteNomeFallback={clienteNomePreviewFallback}
                            proposta={propostaPreviewVisual}
                            numeroProposta={propostaFontePreview?.numero ?? null}
                            subtotal={propostaSubtotalVisual}
                            desconto={propostaDescontoVisual}
                            total={propostaTotalVisual}
                          />
                        </div>
                      ) : null}

                      {propostaParaImpressao && propostaModo === "lista" ? (
                        <div className="print-buffer" aria-hidden="true">
                          <PreviewPropostaVisual
                            perfilConta={perfilConta}
                            contaNome={conta.nome}
                            planoConta={conta.plano}
                            cliente={clientes.find(
                              (cliente) =>
                                cliente.id === propostaParaImpressao.clienteId,
                            )}
                            clienteNomeFallback={propostaParaImpressao.clienteNome}
                            proposta={mapPropostaForm(propostaParaImpressao)}
                            numeroProposta={propostaParaImpressao.numero}
                            subtotal={propostaParaImpressao.subtotal}
                            desconto={propostaParaImpressao.descontoValor}
                            total={propostaParaImpressao.total}
                          />
                        </div>
                      ) : null}

                      {propostaModo === "lista" ? (
                      <div className="rounded-md border border-border bg-surface p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent">
                              Histórico ativo
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              {propostasFiltradas.length} de {propostas.length} proposta
                              {propostas.length === 1 ? "" : "s"}
                            </h2>
                          </div>
                        </div>

                        <div className="mt-5">
                          <CampoTexto
                            label="Buscar propostas"
                            type="search"
                            value={buscaPropostas}
                            placeholder="Título, cliente, status ou item"
                            onChange={(event) => {
                              setBuscaPropostas(event.target.value);
                              setPropostaPagina(1);
                            }}
                          />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {filtrosStatusProposta.map((filtro) => (
                            <button
                              key={filtro.value}
                              type="button"
                              onClick={() => {
                                setFiltroStatusProposta(filtro.value);
                                setPropostaPagina(1);
                              }}
                              className={`inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-semibold transition ${
                                filtroStatusProposta === filtro.value
                                  ? "border-primary bg-blue-50 text-primary"
                                  : "border-border text-muted hover:border-primary hover:text-primary"
                              }`}
                            >
                              {filtro.label}
                            </button>
                          ))}
                        </div>

                        {propostasQuery.isLoading ? (
                          <ListaCarregando label="Carregando propostas" />
                        ) : null}

                        {propostasQuery.isError ? (
                          <EstadoErroConsulta
                            titulo="Não foi possível carregar propostas."
                            detalhe="Tente atualizar antes de gerar, enviar ou duplicar."
                            onRetry={() => {
                              void propostasQuery.refetch();
                            }}
                          />
                        ) : null}

                        {!propostasQuery.isLoading && propostas.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhuma proposta ativa cadastrada."
                            detalhe="Crie a primeira proposta para iniciar o fluxo comercial."
                            action={{
                              label: "Criar proposta",
                              icon: <Plus size={16} aria-hidden="true" />,
                              onClick: () => abrirNovaProposta(),
                            }}
                          />
                        ) : null}

                        {!propostasQuery.isLoading &&
                        propostas.length > 0 &&
                        propostasFiltradas.length === 0 ? (
                          <EstadoVazio
                            titulo="Nenhuma proposta encontrada."
                            detalhe="Revise a busca ou altere o filtro de status."
                          />
                        ) : null}

                        {propostasPaginadas.itens.length > 0 ? (
                          <div className="mt-5 overflow-x-auto">
                            <table className="data-table w-full min-w-[900px] text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Cliente</th>
                                  <th>Tipo</th>
                                  <th>Total</th>
                                  <th>Status</th>
                                  <th>Data</th>
                                  <th>Acoes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {propostasPaginadas.itens.map((proposta) => {
                                  const propostaRascunho =
                                    proposta.status === "Rascunho";
                                  const propostaGerada =
                                    proposta.status === "Gerada";
                                  const propostaEnviada =
                                    proposta.status === "Enviada";
                                  const whatsappUrl =
                                    buildWhatsappUrlPropostaSalva(proposta);
                                  const clientePropostaContato = clientes.find(
                                    (cliente) => cliente.id === proposta.clienteId,
                                  );
                                  const whatsappContatoClienteUrl =
                                    buildWhatsappContatoClienteUrl(
                                      clientePropostaContato,
                                    );
                                  const propostaPodeExportar =
                                    contaPodeExportarProposta;
                                  const gerarBloqueado =
                                    !contaPodeExportarProposta ||
                                    gerarPropostaMutation.isPending;
                                  const envioBloqueado =
                                    !contaPodeExportarProposta ||
                                    propostaStatusMutationPendente;
                                  const decisaoBloqueada =
                                    propostaStatusMutationPendente;

                                  return (
                                    <tr key={proposta.id}>
                                      <td data-label="Cliente">
                                        <div className="flex min-w-0 items-start gap-2">
                                          <div className="min-w-0">
                                            <strong>{proposta.clienteNome}</strong>
                                            <span>
                                              {formatNumeroProposta(
                                                proposta.numero,
                                              )}{" "}
                                              - {proposta.titulo}
                                            </span>
                                          </div>
                                          <ContatoWhatsappClienteButton
                                            href={whatsappContatoClienteUrl}
                                            ariaLabel={`Entrar em contato com ${proposta.clienteNome} pelo WhatsApp`}
                                          />
                                        </div>
                                      </td>
                                      <td data-label="Tipo">
                                        {proposta.itens[0]?.nome ?? proposta.titulo}
                                      </td>
                                      <td data-label="Total">
                                        <strong>{formatMoney(proposta.total)}</strong>
                                        <span>
                                          {proposta.itens.length} item
                                          {proposta.itens.length === 1 ? "" : "s"}
                                        </span>
                                      </td>
                                      <td data-label="Status">
                                        <span
                                          className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusPropostaClass(
                                            proposta.status,
                                          )}`}
                                        >
                                          {proposta.status}
                                        </span>
                                      </td>
                                      <td data-label="Data">{formatDataCurta(proposta.createdAt)}</td>
                                      <td data-label="Ações">
                                        <ListagemAcoes
                                          ariaLabel={`Acoes da proposta ${proposta.titulo}`}
                                          acoes={[
                                            {
                                              label: "Visualizar",
                                              icon: <Eye size={16} />,
                                              onClick: () =>
                                                visualizarProposta(proposta.id),
                                            },
                                            ...(propostaRascunho
                                              ? [
                                                  {
                                                    label: "Gerar",
                                                    icon: <FileText size={16} />,
                                                    disabled: gerarBloqueado,
                                                    tooltip: gerarBloqueado
                                                      ? mensagemBloqueioPlano
                                                      : "Gerar proposta",
                                                    accent: true,
                                                    onClick: () =>
                                                      gerarPropostaMutation.mutate(
                                                        proposta.id,
                                                      ),
                                                  } satisfies ListagemAcao,
                                                ]
                                              : []),
                                            ...(propostaGerada
                                              ? [
                                                  {
                                                    label: "PDF",
                                                    icon: <FileText size={16} />,
                                                    disabled:
                                                      !propostaPodeExportar,
                                                    tooltip: propostaPodeExportar
                                                      ? "Imprimir ou salvar em PDF"
                                                      : mensagemBloqueioPlano,
                                                    onClick: () =>
                                                      imprimirPropostaSalva(
                                                        proposta,
                                                      ),
                                                  },
                                                  {
                                                    label: "WhatsApp",
                                                    icon: (
                                                      <WhatsAppIcon size={16} />
                                                    ),
                                                    href: whatsappUrl,
                                                    target: "_blank",
                                                    rel: "noreferrer",
                                                    disabled:
                                                      !propostaPodeExportar,
                                                    tooltip: propostaPodeExportar
                                                      ? "Abrir WhatsApp"
                                                      : mensagemBloqueioPlano,
                                                    accent: true,
                                                  },
                                                  {
                                                    label: "Enviar",
                                                    icon: <Send size={16} />,
                                                    disabled: envioBloqueado,
                                                    onClick: () =>
                                                      marcarPropostaEnviada(
                                                        proposta,
                                                      ),
                                                  },
                                                ] satisfies ListagemAcao[]
                                              : []),
                                            ...(propostaEnviada
                                              ? [
                                                  {
                                                    label: "Aceita",
                                                    icon: (
                                                      <CheckCircle2 size={16} />
                                                    ),
                                                    disabled: decisaoBloqueada,
                                                    accent: true,
                                                    onClick: () =>
                                                      marcarPropostaAceita(
                                                        proposta,
                                                      ),
                                                  },
                                                  {
                                                    label: "Recusada",
                                                    icon: <XCircle size={16} />,
                                                    destructive: true,
                                                    disabled: decisaoBloqueada,
                                                    onClick: () =>
                                                      marcarPropostaRecusada(
                                                        proposta,
                                                      ),
                                                  },
                                                ] satisfies ListagemAcao[]
                                              : []),
                                            {
                                              label: "Editar",
                                              icon: <Edit3 size={16} />,
                                              onClick: () =>
                                                selecionarProposta(proposta.id),
                                            },
                                            {
                                              label: "Duplicar",
                                              icon: <RefreshCw size={16} />,
                                              disabled:
                                                duplicarPropostaMutation.isPending,
                                              onClick: () =>
                                                duplicarPropostaComConfirmacao(
                                                  proposta,
                                                ),
                                            },
                                            {
                                              label: "Excluir",
                                              icon: <Trash2 size={16} />,
                                              destructive: true,
                                              disabled:
                                                arquivarPropostaMutation.isPending,
                                              onClick: () =>
                                                arquivarPropostaComConfirmacao(
                                                  proposta,
                                                ),
                                            },
                                          ]}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                        <PaginacaoLista
                          label="propostas"
                          paginacao={propostasPaginadas}
                          tamanhoPagina={propostaTamanhoPagina}
                          onChangePagina={setPropostaPagina}
                          onChangeTamanhoPagina={(tamanho) => {
                            setPropostaTamanhoPagina(tamanho);
                            setPropostaPagina(1);
                          }}
                        />
                        <MensagemErro error={arquivarPropostaMutation.error} />
                        <MensagemErro error={duplicarPropostaMutation.error} />
                        <MensagemErro error={enviarPropostaMutation.error} />
                        <MensagemErro error={aceitarPropostaMutation.error} />
                        <MensagemErro error={recusarPropostaMutation.error} />
                      </div>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                {appView === "conta" ? (
                  <section className="account-settings-grid grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)]">
                    <div className="page-heading xl:col-span-2">
                      <div>
                        <h1 className="font-heading text-3xl font-semibold">
                          Configurações
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                          Ajuste dados do negócio, contato, logomarca e segurança.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-md border border-border bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Configurações da conta
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Dados do negócio
                          </h2>
                        </div>
                        <Settings className="text-muted" size={22} aria-hidden="true" />
                      </div>

                      {perfilContaQuery.isLoading ? (
                        <ListaCarregando label="Carregando perfil" />
                      ) : null}

                      {perfilContaQuery.isError ? (
                        <EstadoErroConsulta
                          titulo="Não foi possível carregar o perfil."
                          detalhe="Tente novamente antes de salvar dados da conta."
                          onRetry={() => {
                            void perfilContaQuery.refetch();
                          }}
                        />
                      ) : null}

                      <form
                        className="mt-5 grid gap-4 md:grid-cols-2"
                        onSubmit={perfilForm.handleSubmit((input) =>
                          perfilMutation.mutate(input),
                        )}
                      >
                        <input type="hidden" {...perfilForm.register("corPrimaria")} />
                        <input type="hidden" {...perfilForm.register("corSecundaria")} />
                        <input
                          type="hidden"
                          {...perfilForm.register("corSistemaPrimaria")}
                        />
                        <input
                          type="hidden"
                          {...perfilForm.register("corSistemaSecundaria")}
                        />
                        <input
                          type="hidden"
                          {...perfilForm.register("templateVisualPadrao")}
                        />
                        <CampoTexto
                          label="Nome comercial"
                          error={perfilForm.formState.errors.nomeComercial?.message}
                          {...perfilForm.register("nomeComercial")}
                        />
                        <CampoTexto
                          label="Responsável"
                          value={usuario.nome}
                          readOnly
                          helperText="Nome usado no cadastro."
                        />
                        <CampoTexto
                          label="E-mail de acesso"
                          type="email"
                          readOnly
                          helperText="Este e-mail não pode ser editado aqui."
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
                        <div className="md:col-span-2">
                          <div className="rounded-md border border-border bg-slate-50 p-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Logomarca do negocio
                              </p>
                              <p className="mt-1 text-sm text-muted">
                                A imagem fica em rascunho aqui e so entra no
                                cadastro depois de salvar o perfil.
                              </p>
                            </div>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => logoArquivoInputRef.current?.click()}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  logoArquivoInputRef.current?.click();
                                }
                              }}
                              onDragEnter={handleLogoDragEnter}
                              onDragOver={handleLogoDragOver}
                              onDragLeave={handleLogoDragLeave}
                              onDrop={handleLogoDrop}
                              className={`logo-dropzone mt-4 grid min-h-48 cursor-pointer gap-4 rounded-md border border-dashed p-4 transition focus:outline-none focus:ring-2 focus:ring-blue-100 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center ${
                                logoDragAtivo
                                  ? "logo-dropzone-active border-primary bg-blue-50"
                                  : "border-border bg-white"
                              }`}
                              aria-label="Selecionar ou soltar logomarca"
                            >
                              <div className="logo-preview-frame flex aspect-square min-h-40 items-center justify-center rounded-md border border-border bg-slate-50 p-3">
                                {logoPreviewAtualUrl ? (
                                  <img
                                    src={logoPreviewAtualUrl}
                                    alt="Preview da logomarca"
                                    className="max-h-full max-w-full object-contain"
                                  />
                                ) : (
                                  <div className="text-center text-muted">
                                    <UploadCloud
                                      className="mx-auto text-primary"
                                      size={34}
                                      aria-hidden="true"
                                    />
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                      Arraste a logo
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-primary">
                                  <UploadCloud size={18} aria-hidden="true" />
                                  <p className="text-sm font-semibold">
                                    Arraste e solte ou selecione uma imagem
                                  </p>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                  {logoStatusDescricao}
                                </p>
                                <p className="mt-1 text-xs text-muted">
                                  {logoStatusComplemento}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted">
                                    PNG
                                  </span>
                                  <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted">
                                    JPG/JPEG
                                  </span>
                                  <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted">
                                    WebP
                                  </span>
                                  <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted">
                                    Ate {logoArquivoTamanhoMaximoLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <input
                              ref={logoArquivoInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={handleLogoArquivoChange}
                            />
                            <input type="hidden" {...perfilForm.register("logoUrl")} />
                            <div className="mt-3 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                              <p>
                                Tipos aceitos: PNG, JPG/JPEG ou WebP. Tamanho
                                maximo: {logoArquivoTamanhoMaximoLabel}. A
                                imagem sera otimizada em WebP no servidor ao
                                salvar.
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {logoArquivoPendente ? (
                                  <button
                                    type="button"
                                    onClick={removerLogoArquivoSelecionado}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-foreground"
                                  >
                                    <X size={15} aria-hidden="true" />
                                    Remover selecao
                                  </button>
                                ) : null}
                                {logoRemocaoPendente ? (
                                  <button
                                    type="button"
                                    onClick={cancelarLimpezaLogomarcaPerfil}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-foreground"
                                  >
                                    Cancelar limpeza
                                  </button>
                                ) : podeLimparLogomarca ? (
                                  <button
                                    type="button"
                                    onClick={limparLogomarcaPerfil}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
                                  >
                                    <Trash2 size={15} aria-hidden="true" />
                                    Limpar logomarca
                                  </button>
                                ) : null}
                              </div>
                            </div>
                            {perfilForm.formState.errors.logoUrl?.message ? (
                              <p className="mt-2 text-sm text-red-600">
                                {perfilForm.formState.errors.logoUrl.message}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            disabled={perfilMutation.isPending}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={18} aria-hidden="true" />
                            {perfilMutation.isPending
                              ? logoArquivoPendente
                                ? "Enviando e salvando..."
                                : "Salvando..."
                              : "Salvar perfil"}
                          </button>
                          <MensagemSucesso mensagem={perfilMensagem} />
                          <MensagemErro error={perfilMutation.error} />
                        </div>
                      </form>
                    </div>

                    <div className="account-side-column space-y-3">
                      <aside className="account-access-card rounded-md border border-border bg-surface p-4">
                        <div className="flex items-center gap-2">
                          <BadgeCheck
                            className="text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                          <h2 className="font-heading text-xl font-semibold leading-7">
                            Plano e segurança
                          </h2>
                        </div>

                        <div className="account-info-grid mt-4 grid gap-2">
                          <InfoLinha label="Plano" value={formatPlanoConta(conta)} />
                          <InfoLinha
                            label="Status"
                            value={formatStatusComercialConta(conta)}
                          />
                          <InfoLinha label="Trial" value={formatTrialConta(conta)} />
                        </div>

                        {conta.plano === "Fundador" ? (
                          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            Plano Fundador ativo desde{" "}
                            {formatDataConta(conta.planoFundadorAtivadoAt)}.
                          </p>
                        ) : (
                          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            <p className="font-semibold">
                              Plano Fundador por{" "}
                              {formatMoney(conta.planoFundadorPrecoMensal ?? 19.9)}
                              /mes.
                            </p>
                            <p className="mt-1 leading-5">
                              Ativacao manual feita por operacao administrativa
                              no MVP, sem cobranca automatica.
                            </p>
                          </div>
                        )}

                        <form
                          className="mt-4 grid gap-3"
                          onSubmit={senhaUsuarioForm.handleSubmit((input) =>
                            senhaUsuarioMutation.mutate(input),
                          )}
                        >
                          <div className="account-password-grid grid gap-3">
                            <CampoTexto
                              label="Senha atual"
                              type="password"
                              error={
                                senhaUsuarioForm.formState.errors.senhaAtual?.message
                              }
                              {...senhaUsuarioForm.register("senhaAtual")}
                            />
                            <CampoTexto
                              label="Nova senha"
                              type="password"
                              error={
                                senhaUsuarioForm.formState.errors.novaSenha?.message
                              }
                              {...senhaUsuarioForm.register("novaSenha")}
                            />
                            <CampoTexto
                              label="Confirmar nova senha"
                              type="password"
                              error={
                                senhaUsuarioForm.formState.errors.confirmarNovaSenha
                                  ?.message
                              }
                              {...senhaUsuarioForm.register("confirmarNovaSenha")}
                            />
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <button
                              type="submit"
                              disabled={senhaUsuarioMutation.isPending}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Save size={16} aria-hidden="true" />
                              {senhaUsuarioMutation.isPending
                                ? "Atualizando..."
                                : "Atualizar senha"}
                            </button>
                            <MensagemSucesso mensagem={senhaMensagem} />
                            <MensagemErro error={senhaUsuarioMutation.error} />
                          </div>
                        </form>
                      </aside>

                    </div>
                  </section>
                ) : null}

                {appView === "personalizacao" ? (
                  <section className="account-settings-grid grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)]">
                    <div className="page-heading xl:col-span-2">
                      <div>
                        <h1 className="font-heading text-3xl font-semibold">
                          Personalização
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                          Ajuste tema e padrão visual dos orçamentos.
                        </p>
                      </div>
                    </div>

                    <form
                      className="rounded-md border border-border bg-surface p-5"
                      onSubmit={perfilForm.handleSubmit((input) =>
                        perfilMutation.mutate(input),
                      )}
                    >
                      <input type="hidden" {...perfilForm.register("nomeComercial")} />
                      <input type="hidden" {...perfilForm.register("emailContato")} />
                      <input
                        type="hidden"
                        {...perfilForm.register("telefoneContato")}
                      />
                      <input type="hidden" {...perfilForm.register("siteUrl")} />
                      <input type="hidden" {...perfilForm.register("instagram")} />
                      <input type="hidden" {...perfilForm.register("documento")} />
                      <input type="hidden" {...perfilForm.register("logoUrl")} />
                      <input
                        type="hidden"
                        {...perfilForm.register("corSistemaPrimaria")}
                      />
                      <input
                        type="hidden"
                        {...perfilForm.register("corSistemaSecundaria")}
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Aparência do sistema
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Tema
                          </h2>
                        </div>
                        <Palette className="text-muted" size={22} aria-hidden="true" />
                      </div>

                      <div className="mt-5">
                        <span className="text-sm font-medium text-foreground">
                          Tema do sistema
                        </span>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            aria-pressed={temaVisual === "light"}
                            onClick={() => setTemaVisual("light")}
                            className={`personalization-choice ${
                              temaVisual === "light" ? "is-active" : ""
                            }`}
                          >
                            <Sun size={18} aria-hidden="true" />
                            <span>
                              <strong>Claro</strong>
                              <small>Interface clara e neutra.</small>
                            </span>
                          </button>
                          <button
                            type="button"
                            aria-pressed={temaVisual === "dark"}
                            onClick={() => setTemaVisual("dark")}
                            className={`personalization-choice ${
                              temaVisual === "dark" ? "is-active" : ""
                            }`}
                          >
                            <Moon size={18} aria-hidden="true" />
                            <span>
                              <strong>Escuro</strong>
                              <small>Interface escura para uso prolongado.</small>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-border pt-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary">
                            Orçamentos
                          </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Template padrão e cores dos templates
                            </h2>
                          </div>
                          <button
                            type="button"
                            disabled={
                              templateVisualPersonalizacaoPreview ===
                              propostaTemplateVisualDefault
                            }
                            onClick={() => {
                              perfilForm.setValue(
                                "templateVisualPadrao",
                                propostaTemplateVisualDefault,
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );
                              setPerfilMensagem(null);
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RefreshCw size={16} aria-hidden="true" />
                            Restaurar template padrão
                          </button>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <CampoSelect
                            label="Template padrão para impressão"
                            error={
                              perfilForm.formState.errors.templateVisualPadrao
                                ?.message
                            }
                            helperText="Novos orçamentos começam com este layout."
                            {...perfilForm.register("templateVisualPadrao")}
                          >
                            {propostaTemplateVisualOpcoes.map((template) => (
                              <option key={template.value} value={template.value}>
                                {template.label}
                              </option>
                            ))}
                          </CampoSelect>
                          <div className="rounded-md border border-border bg-slate-50 p-3 text-sm text-muted">
                            <strong className="block text-foreground">
                              Cores estáticas
                            </strong>
                            <span className="mt-1 block leading-5">
                              Templates com selo de cores estáticas mantêm uma paleta
                              profissional fixa; os demais usam as cores abaixo.
                            </span>
                          </div>
                          <CampoTexto
                            label="Cor primária dos templates"
                            type="color"
                            error={perfilForm.formState.errors.corPrimaria?.message}
                            helperText="Usada em títulos, ícones e áreas de destaque dos orçamentos."
                            {...perfilForm.register("corPrimaria")}
                          />
                          <CampoTexto
                            label="Cor secundária dos templates"
                            type="color"
                            error={perfilForm.formState.errors.corSecundaria?.message}
                            helperText="Usada em acentos, detalhes e botões dos orçamentos."
                            {...perfilForm.register("corSecundaria")}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="submit"
                          disabled={perfilMutation.isPending}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={18} aria-hidden="true" />
                          {perfilMutation.isPending
                            ? "Salvando..."
                            : "Salvar personalização"}
                        </button>
                        <MensagemSucesso mensagem={perfilMensagem} />
                        <MensagemErro error={perfilMutation.error} />
                      </div>
                    </form>

                    <div className="account-side-column space-y-3">
                      <aside className="account-brand-preview-card rounded-md border border-border bg-surface p-4">
                        <div className="flex items-center gap-2">
                          <Palette
                            className="text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                          <h2 className="font-heading text-xl font-semibold leading-7">
                            Tema da interface
                          </h2>
                        </div>
                        <div className="mt-3 rounded-md border border-border bg-surface-soft p-3">
                          <p className="text-sm font-medium text-foreground">
                            {temaVisual === "dark" ? "Escuro" : "Claro"}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted">
                            A interface usa apenas o tema selecionado. As cores dos
                            documentos continuam restritas aos templates de orçamento.
                          </p>
                        </div>
                      </aside>

                      <aside className="account-brand-preview-card rounded-md border border-border bg-surface p-4">
                        <div className="flex items-center gap-2">
                          <FileText
                            className="text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                          <h2 className="font-heading text-xl font-semibold leading-7">
                            Preview dos orçamentos
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPersonalizacaoPreviewTemplateAberto(
                              templateVisualPersonalizacaoPreview,
                            )
                          }
                          className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Eye size={16} aria-hidden="true" />
                          Ver preview real
                        </button>
                        <div className="mt-3">
                          <TemplateMiniatura
                            templateVisual={templateVisualPersonalizacaoPreview}
                          />
                        </div>
                        <div className="mt-3 grid gap-1 text-sm text-muted">
                          <p>
                            Template:{" "}
                            {getPropostaTemplateLabel(
                              templateVisualPersonalizacaoPreview,
                            )}
                          </p>
                          <p>Primária: {normalizarHexPreview(corPrimaria)}</p>
                          <p>Secundária: {normalizarHexPreview(corSecundaria)}</p>
                          <p>Atualizado: {formatDataPerfil(perfilConta)}</p>
                        </div>
                      </aside>
                    </div>
                  </section>
                ) : null}

                {appView === "dashboard" ? (
                  <DashboardContent
                    conta={conta}
                    propostas={propostas}
                    perfilContaAtualizado={Boolean(perfilConta?.updatedAt)}
                    clientesTotal={clientes.length}
                    servicosTotal={servicos.length}
                    isLoading={
                      clientesQuery.isLoading ||
                      servicosQuery.isLoading ||
                      propostasQuery.isLoading
                    }
                    isError={
                      clientesQuery.isError ||
                      servicosQuery.isError ||
                      propostasQuery.isError
                    }
                    onRetry={() => {
                      void clientesQuery.refetch();
                      void servicosQuery.refetch();
                      void propostasQuery.refetch();
                    }}
                    onEditarPerfil={() => navegarParaView("conta")}
                    onAbrirPropostas={() => navegarParaView("propostas")}
                    onNovaProposta={() => abrirNovaProposta()}
                    onCadastrarCliente={abrirNovoCliente}
                    onSalvarServico={abrirNovoServico}
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
                sessaoMensagem={sessaoMensagem}
              />
              )}
            </div>
            <FooterAplicacao temaVisual={temaVisual} />
          </section>
        </main>
      </div>
      {propostaVisualizacaoModal && propostaVisualizacaoModalForm && conta ? (
        <div
          className="proposal-view-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setPropostaVisualizacaoModalId(null);
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-view-modal-title"
          >
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">
                  Visualizacao da proposta
                </p>
                <h2
                  id="proposal-view-modal-title"
                  className="font-heading text-xl font-semibold"
                >
                  {propostaVisualizacaoModal.titulo}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {formatNumeroProposta(propostaVisualizacaoModal.numero)} -{" "}
                  {propostaVisualizacaoModal.clienteNome} - Status:{" "}
                  {propostaVisualizacaoModal.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selecionarProposta(propostaVisualizacaoModal.id)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Edit3 size={16} aria-hidden="true" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setPropostaVisualizacaoModalId(null)}
                  className="tooltip-icon-button"
                  aria-label="Fechar visualizacao da proposta"
                  title="Fechar"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </header>
            <div className="proposal-view-modal-stage">
              <PreviewPropostaVisual
                perfilConta={perfilConta}
                contaNome={conta.nome}
                planoConta={conta.plano}
                cliente={clienteVisualizacaoModal}
                clienteNomeFallback={propostaVisualizacaoModal.clienteNome}
                proposta={propostaVisualizacaoModalForm}
                numeroProposta={propostaVisualizacaoModal.numero}
                subtotal={propostaVisualizacaoModal.subtotal}
                desconto={propostaVisualizacaoModal.descontoValor}
                total={propostaVisualizacaoModal.total}
              />
            </div>
          </section>
        </div>
      ) : null}
      {propostaPreviewModalAberto && propostaEditorAtivo && conta ? (
        <div
          className="proposal-view-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setPropostaPreviewModalAberto(false);
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-editor-preview-title"
          >
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">Preview</p>
                <h2
                  id="proposal-editor-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {propostaPreview.titulo || "Proposta em edicao"}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {getPropostaTemplateLabel(
                    normalizarTemplateVisual(propostaPreview.templateVisual),
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPropostaPreviewModalAberto(false)}
                className="tooltip-icon-button"
                aria-label="Fechar preview da proposta"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="proposal-view-modal-stage">
              <PreviewPropostaVisual
                perfilConta={perfilConta}
                contaNome={conta.nome}
                planoConta={conta.plano}
                cliente={clientePreview}
                clienteNomeFallback={clienteNomePreviewFallback}
                proposta={propostaPreviewVisual}
                numeroProposta={propostaFontePreview?.numero ?? null}
                subtotal={propostaSubtotalVisual}
                desconto={propostaDescontoVisual}
                total={propostaTotalVisual}
              />
            </div>
          </section>
        </div>
      ) : null}
      {personalizacaoPreviewTemplateAberto && conta ? (
        <div
          className="proposal-view-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setPersonalizacaoPreviewTemplateAberto(null);
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="personalization-template-preview-title"
          >
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">
                  Preview do template padrao
                </p>
                <h2
                  id="personalization-template-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {getPropostaTemplateLabel(personalizacaoPreviewTemplateAberto)}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  Previa real usando a logomarca, as cores e os dados atuais da
                  personalizacao.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPersonalizacaoPreviewTemplateAberto(null)}
                className="tooltip-icon-button"
                aria-label="Fechar preview do template padrao"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="proposal-view-modal-stage">
              <PreviewPropostaVisual
                perfilConta={perfilContaPersonalizacaoPreview}
                contaNome={conta.nome}
                planoConta={conta.plano}
                cliente={undefined}
                clienteNomeFallback="Cliente exemplo"
                proposta={{
                  ...propostaPersonalizacaoPreview,
                  templateVisual: personalizacaoPreviewTemplateAberto,
                }}
                numeroProposta={null}
                subtotal={personalizacaoPreviewSubtotal}
                desconto={personalizacaoPreviewDesconto}
                total={personalizacaoPreviewTotal}
              />
            </div>
          </section>
        </div>
      ) : null}
      {propostaTemplateModalAberto && propostaEditorAtivo ? (
        <div
          className="template-preview-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setTemplatePreviewAberto(null);
              setPropostaTemplateModalAberto(false);
            }
          }}
        >
          <section
            className="template-selector-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-template-selector-title"
          >
            <div className="template-preview-toolbar flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Template</p>
                <h2
                  id="proposal-template-selector-title"
                  className="font-heading text-xl font-semibold"
                >
                  Escolher layout da proposta
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                  O template escolhido define o layout do preview, PDF, imagem e
                  compartilhamento.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPropostaTemplateModalAberto(false)}
                className="tooltip-icon-button"
                aria-label="Fechar selecao de template"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="template-selector-grid">
              {propostaTemplateVisualOpcoes.map((template) => {
                const templateSelecionado =
                  normalizarTemplateVisual(propostaPreview.templateVisual) ===
                  template.value;

                return (
                  <article
                    key={template.value}
                    className={`proposal-template-card rounded-md border p-3 text-left transition ${
                      templateSelecionado ? "is-active" : ""
                    }`}
                  >
                    <TemplateMiniatura templateVisual={template.value} />
                    <div className="proposal-template-card-body">
                      <div className="proposal-template-card-title-row">
                        <div>
                          <p className="proposal-template-card-title">
                            {template.label}
                          </p>
                          {template.coresEstaticas ? (
                            <span className="proposal-template-card-badge">
                              Cores estaticas
                            </span>
                          ) : null}
                        </div>
                        {templateSelecionado ? (
                          <span className="proposal-template-card-current">
                            Atual
                          </span>
                        ) : null}
                      </div>
                      <p className="proposal-template-card-detail">
                        {template.detalhe}
                      </p>
                      <div className="proposal-template-card-actions">
                        <button
                          type="button"
                          onClick={() => {
                            selecionarTemplateProposta(template.value);
                            setPropostaTemplateModalAberto(false);
                          }}
                          className="proposal-template-card-primary"
                        >
                          Escolher
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplatePreviewAberto(template.value)}
                          className="proposal-template-card-secondary"
                        >
                          <Eye size={13} aria-hidden="true" />
                          Preview
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
      {propostaCompartilharModalAberto && propostaSelecionadaGerada ? (
        <div
          className="share-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setPropostaCompartilharModalAberto(false);
            }
          }}
        >
          <section
            className="share-modal-dialog w-full rounded-md border border-border bg-surface p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-share-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Compartilhar</p>
                <h2
                  id="proposal-share-title"
                  className="font-heading text-xl font-semibold"
                >
                  Escolha como enviar a proposta
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPropostaCompartilharModalAberto(false)}
                className="tooltip-icon-button"
                aria-label="Fechar compartilhamento"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="share-action-grid mt-5">
              <button
                type="button"
                onClick={() => {
                  setPropostaCompartilharModalAberto(false);
                  void baixarPdfPropostaGerada();
                }}
                className="share-action-card"
              >
                <FileText size={22} aria-hidden="true" />
                <strong>PDF</strong>
                <span>Baixar arquivo para anexar.</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPropostaCompartilharModalAberto(false);
                  void baixarImagemPropostaGerada();
                }}
                className="share-action-card"
              >
                <ReceiptText size={22} aria-hidden="true" />
                <strong>Imagem</strong>
                <span>Gerar PNG da proposta.</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPropostaCompartilharModalAberto(false);
                  imprimirPropostaGerada();
                }}
                className="share-action-card"
              >
                <Printer size={22} aria-hidden="true" />
                <strong>Imprimir</strong>
                <span>Abrir impressao do navegador.</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPropostaCompartilharModalAberto(false);
                  void copiarMensagemWhatsappProposta();
                }}
                className="share-action-card"
              >
                <Mail size={22} aria-hidden="true" />
                <strong>Copiar texto</strong>
                <span>Copiar mensagem de acompanhamento.</span>
              </button>
              <a
                href={propostaProntaParaEnvio ? whatsappPropostaUrl : undefined}
                target="_blank"
                rel="noreferrer"
                onClick={() => setPropostaCompartilharModalAberto(false)}
                className="share-action-card"
              >
                <WhatsAppIcon size={22} />
                <strong>WhatsApp</strong>
                <span>Abrir conversa com texto pronto.</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setPropostaCompartilharModalAberto(false);
                  void compartilharPropostaMobile();
                }}
                className="share-action-card"
              >
                <Send size={22} aria-hidden="true" />
                <strong>Compartilhar</strong>
                <span>Usar compartilhamento nativo quando disponivel.</span>
              </button>
            </div>
            {propostaExportacaoMensagem ? (
              <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                {propostaExportacaoMensagem}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
      {clienteRapidoAberto && propostaEditorAtivo ? (
        <div
          className="share-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              cancelarClienteRapido();
            }
          }}
        >
          <section
            className="quick-client-dialog w-full rounded-md border border-border bg-surface p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-client-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Cliente</p>
                <h2
                  id="quick-client-title"
                  className="font-heading text-xl font-semibold"
                >
                  Novo Cliente
                </h2>
              </div>
              <button
                type="button"
                onClick={cancelarClienteRapido}
                className="tooltip-icon-button"
                aria-label="Fechar novo cliente"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <form
              className="mt-5 space-y-3"
              onSubmit={clienteRapidoForm.handleSubmit((input) =>
                criarClienteRapidoMutation.mutate(input),
              )}
            >
              <CampoTexto
                label="Nome"
                error={clienteRapidoForm.formState.errors.nome?.message}
                {...clienteRapidoForm.register("nome")}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <CampoTexto
                  label="Email"
                  type="email"
                  error={clienteRapidoForm.formState.errors.email?.message}
                  {...clienteRapidoForm.register("email")}
                />
                <CampoTexto
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  error={clienteRapidoForm.formState.errors.telefone?.message}
                  {...clienteRapidoForm.register("telefone")}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelarClienteRapido}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  <X size={16} aria-hidden="true" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={criarClienteRapidoMutation.isPending}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} aria-hidden="true" />
                  {criarClienteRapidoMutation.isPending
                    ? "Salvando..."
                    : "Criar e selecionar"}
                </button>
              </div>
              <MensagemErro error={criarClienteRapidoMutation.error} />
            </form>
          </section>
        </div>
      ) : null}
      {templatePreviewAberto && conta ? (
        <div
          className="template-preview-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setTemplatePreviewAberto(null);
            }
          }}
        >
          <section
            className="template-preview-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-preview-title"
          >
            <div className="template-preview-toolbar flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  Visualizacao do template
                </p>
                <h2
                  id="template-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {getPropostaTemplateLabel(templatePreviewAberto)}
                </h2>
                {isTemplateCoresEstaticas(templatePreviewAberto) ? (
                  <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
                    Este template usa cores estaticas profissionais e nao aplica
                    a paleta configurada no perfil. A logomarca e os dados da
                    conta continuam sendo usados normalmente.
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTemplatePreviewAberto(null)}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Voltar aos templates
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selecionarTemplateProposta(templatePreviewAberto);
                    setTemplatePreviewAberto(null);
                    setPropostaTemplateModalAberto(false);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
                >
                  Usar este template
                </button>
                <button
                  type="button"
                  onClick={() => setTemplatePreviewAberto(null)}
                  className="tooltip-icon-button"
                  aria-label="Fechar preview do template"
                  title="Fechar"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="template-preview-stage">
              <PreviewPropostaVisual
                perfilConta={perfilConta}
                contaNome={conta.nome}
                planoConta={conta.plano}
                cliente={clientePreview}
                clienteNomeFallback={clienteNomePreviewFallback}
                proposta={{
                  ...propostaPreviewVisual,
                  templateVisual: templatePreviewAberto,
                }}
                numeroProposta={propostaFontePreview?.numero ?? null}
                subtotal={propostaSubtotalVisual}
                desconto={propostaDescontoVisual}
                total={propostaTotalVisual}
              />
            </div>
          </section>
        </div>
      ) : null}
      {logoSugestaoPerfil ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              setLogoSugestaoPerfil(null);
            }
          }}
        >
          <section className="w-full max-w-lg rounded-md border border-border bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <img
                src={logoSugestaoPerfil.previewUrl}
                alt=""
                className="h-14 w-14 rounded-md border border-border object-contain p-1"
              />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Sugestao de identidade
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold">
                  Aplicar cores da logo?
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Analisei {logoSugestaoPerfil.nomeArquivo} e preparei uma
                  configuracao de cores para sua proposta.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoLinha label="Cor primaria" value={logoSugestaoPerfil.corPrimaria} />
              <InfoLinha
                label="Cor secundaria"
                value={logoSugestaoPerfil.corSecundaria}
              />
            </div>
            <div
              className="mt-4 rounded-md px-4 py-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${logoSugestaoPerfil.corPrimaria}, ${logoSugestaoPerfil.corSecundaria})`,
              }}
            >
              <p className="text-sm font-semibold">Preview da proposta</p>
              <p className="mt-1 text-sm opacity-90">
                Essas cores serao usadas no cabecalho visual.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setLogoSugestaoPerfil(null)}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={aplicarLogoSugestaoPerfil}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-white"
              >
                Aplicar cores
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

type CampoTextoProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ label, error, helperText, type, id, ...props }, ref) => {
    const campoId = useId();
    const inputId = id ?? campoId;
    const descricaoId = `${inputId}-descricao`;
    const erroId = `${inputId}-erro`;

    return (
      <label className="campo-texto block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? descricaoId : ""} ${
            error ? erroId : ""
          }`.trim() || undefined}
          className={`mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 ${
            type === "color" ? "p-1" : ""
          }`}
          {...props}
        />
        {helperText ? (
          <span id={descricaoId} className="campo-helper mt-1 block text-xs text-muted">
            {helperText}
          </span>
        ) : null}
        {error ? (
          <span id={erroId} className="campo-error mt-1 block text-sm text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

CampoTexto.displayName = "CampoTexto";

type CampoSenhaAuthProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  senhaVisivel: boolean;
  onToggleSenhaVisivel: () => void;
};

const CampoSenhaAuth = forwardRef<HTMLInputElement, CampoSenhaAuthProps>(
  (
    {
      label,
      error,
      helperText,
      senhaVisivel,
      onToggleSenhaVisivel,
      id,
      ...props
    },
    ref,
  ) => {
    const senhaId = useId();
    const inputId = id ?? senhaId;
    const descricaoId = `${inputId}-descricao`;
    const erroId = `${inputId}-erro`;

    return (
      <div className="auth-field-group auth-password-group">
        <label className="auth-field-label" htmlFor={inputId}>
          {label}
        </label>
        <div className="auth-password-field">
          <input
            ref={ref}
            id={inputId}
            type={senhaVisivel ? "text" : "password"}
            aria-invalid={Boolean(error)}
            aria-describedby={`${helperText ? descricaoId : ""} ${
              error ? erroId : ""
            }`.trim() || undefined}
            {...props}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={onToggleSenhaVisivel}
            aria-label={senhaVisivel ? "Ocultar caracteres" : "Mostrar caracteres"}
            aria-pressed={senhaVisivel}
            title={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {senhaVisivel ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
            <span>{senhaVisivel ? "Ocultar" : "Mostrar"}</span>
          </button>
        </div>
        {helperText ? (
          <span id={descricaoId} className="campo-helper mt-1 block text-xs text-muted">
            {helperText}
          </span>
        ) : null}
        {error ? (
          <span id={erroId} className="campo-error mt-1 block text-sm text-red-600">
            {error}
          </span>
        ) : null}
      </div>
    );
  },
);

CampoSenhaAuth.displayName = "CampoSenhaAuth";

type CampoSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

const CampoSelect = forwardRef<HTMLSelectElement, CampoSelectProps>(
  ({ label, error, helperText, children, id, ...props }, ref) => {
    const campoId = useId();
    const inputId = id ?? campoId;
    const descricaoId = `${inputId}-descricao`;
    const erroId = `${inputId}-erro`;

    return (
      <label className="campo-texto block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <select
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? descricaoId : ""} ${
            error ? erroId : ""
          }`.trim() || undefined}
          className="mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          {...props}
        >
          {children}
        </select>
        {helperText ? (
          <span id={descricaoId} className="campo-helper mt-1 block text-xs text-muted">
            {helperText}
          </span>
        ) : null}
        {error ? (
          <span id={erroId} className="campo-error mt-1 block text-sm text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

CampoSelect.displayName = "CampoSelect";

type CampoTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

const CampoTextarea = forwardRef<HTMLTextAreaElement, CampoTextareaProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const campoId = useId();
    const inputId = id ?? campoId;
    const descricaoId = `${inputId}-descricao`;
    const erroId = `${inputId}-erro`;

    return (
      <label className="campo-texto block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? descricaoId : ""} ${
            error ? erroId : ""
          }`.trim() || undefined}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          {...props}
        />
        {helperText ? (
          <span id={descricaoId} className="campo-helper mt-1 block text-xs text-muted">
            {helperText}
          </span>
        ) : null}
        {error ? (
          <span id={erroId} className="campo-error mt-1 block text-sm text-red-600">
            {error}
          </span>
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
      aria-busy={loading}
      className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Processando..." : label}
    </button>
  );
}

function MensagemErro({
  error,
  mensagem,
}: {
  error: Error | null;
  mensagem?: string;
}) {
  if (!error) {
    return null;
  }

  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {mensagem ?? error.message}
    </p>
  );
}

function MensagemSucesso({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) {
    return null;
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
    >
      {mensagem}
    </p>
  );
}

function ListaCarregando({ label }: { label: string }) {
  return (
    <div className="operational-state mt-5" role="status" aria-live="polite">
      <span className="skeleton-dot" aria-hidden="true" />
      <div>
        <strong>{label}</strong>
        <span>Buscando os dados mais recentes.</span>
      </div>
    </div>
  );
}

function EstadoErroConsulta({
  titulo,
  detalhe,
  onRetry,
}: {
  titulo: string;
  detalhe?: string;
  onRetry: () => void;
}) {
  return (
    <div className="state-card state-card-error mt-5" role="alert">
      <XCircle size={20} aria-hidden="true" />
      <div className="min-w-0">
        <strong>{titulo}</strong>
        {detalhe ? <span>{detalhe}</span> : null}
      </div>
      <button type="button" onClick={onRetry}>
        <RefreshCw size={16} aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}

function EstadoVazio({
  titulo,
  detalhe,
  action,
}: {
  titulo: string;
  detalhe?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
}) {
  return (
    <div className="state-card state-card-empty mt-5">
      <Info size={20} aria-hidden="true" />
      <div className="min-w-0">
        <strong>{titulo}</strong>
        {detalhe ? <span>{detalhe}</span> : null}
      </div>
      {action ? (
        <button type="button" onClick={action.onClick}>
          {action.icon}
          {action.label}
        </button>
      ) : null}
    </div>
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

function BrandAssinatura({
  nomeMarca,
  subtitulo,
  logoUrl,
  mostrarEmprelySecundario,
  compacta = false,
}: {
  nomeMarca: string;
  subtitulo: string;
  logoUrl: string | null;
  mostrarEmprelySecundario: boolean;
  compacta?: boolean;
}) {
  return (
    <div
      className={`brand-assinatura flex items-center gap-3 ${
        compacta ? "brand-assinatura-compacta" : ""
      }`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className={`brand-mark rounded-md object-contain ${
            compacta ? "h-9 w-9" : "h-11 w-11"
          }`}
          aria-hidden="true"
        />
      ) : (
        <div
          className={`brand-mark flex items-center justify-center rounded-md text-sm font-bold text-white ${
            compacta ? "h-9 w-9" : "h-11 w-11"
          }`}
        >
          {nomeMarca.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="truncate font-heading text-lg font-semibold text-foreground">
            {nomeMarca}
          </strong>
          {mostrarEmprelySecundario ? (
            <span className="brand-secondary-badge inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-semibold text-muted">
              <img
                src={emprelyFaviconSrc}
                alt=""
                className="h-4 w-4 object-contain"
                aria-hidden="true"
              />
              Emprely Orçamentos
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate text-xs font-semibold uppercase text-muted">
          {subtitulo}
        </p>
        <h1 className="sr-only">{nomeMarca}</h1>
      </div>
    </div>
  );
}

function FooterAplicacao({ temaVisual }: { temaVisual: TemaVisual }) {
  const logoSrc = temaVisual === "dark" ? emprelyLogoDarkSrc : emprelyLogoSrc;

  return (
    <footer className="app-footer mt-6 grid gap-3 border-t border-border py-4 text-sm text-muted md:grid-cols-[1fr_auto_1fr] md:items-center">
      <div className="footer-brand flex items-center gap-2">
        <img
          src={logoSrc}
          alt="Emprely"
          className="h-8 w-auto object-contain"
        />
      </div>
      <p className="footer-rights text-center">
        © 2026 Emprely Orçamentos. Todos os direitos reservados.
      </p>
      <div className="footer-actions flex items-center justify-center gap-2 md:justify-end">
        <a
          href="https://wa.me/5531999990000"
          target="_blank"
          rel="noreferrer"
          aria-label="Suporte no WhatsApp"
          title="Suporte no WhatsApp"
          data-tooltip="Suporte no WhatsApp"
          className="tooltip-icon-button footer-icon-button"
        >
          <WhatsAppIcon size={18} aria-hidden="true" />
        </a>
        <a
          href="mailto:suporte@emprely.com.br"
          aria-label="Enviar email para suporte"
          title="Enviar email para suporte"
          data-tooltip="Enviar email para suporte"
          className="tooltip-icon-button footer-icon-button"
        >
          <Mail size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

function WhatsAppIcon({
  size = 18,
  ...props
}: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12.04 3.25a8.65 8.65 0 0 0-7.4 13.12l-.92 3.38 3.48-.9a8.65 8.65 0 1 0 4.84-15.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.45c-.2-.45-.42-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.98 2.64 1.12 2.82c.14.18 1.9 3.04 4.68 4.14 2.31.91 2.78.73 3.28.69.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.53-.32l-1.56-.77c-.23-.12-.4-.18-.57.11-.16.28-.65.82-.79.98-.14.16-.29.18-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.52.12-.12.25-.29.38-.43.13-.14.17-.25.26-.42.08-.17.04-.32-.02-.45l-.71-1.74Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ContatoWhatsappClienteButton({
  href,
  ariaLabel,
  size = "sm",
}: {
  href: string;
  ariaLabel: string;
  size?: "sm" | "lg";
}) {
  const tooltip = href
    ? "Entrar em contato pelo WhatsApp"
    : "Cliente sem telefone valido para WhatsApp";
  const sizeClass = size === "lg" ? "h-11 w-11" : "h-11 w-11";
  const className = `tooltip-icon-button inline-flex shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-border disabled:bg-slate-50 disabled:text-muted disabled:opacity-60 ${sizeClass}`;

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-label="Cliente sem telefone valido para WhatsApp"
        title={tooltip}
        data-tooltip={tooltip}
        className={className}
      >
        <WhatsAppIcon size={size === "lg" ? 20 : 16} />
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      title={tooltip}
      data-tooltip={tooltip}
      className={className}
    >
      <WhatsAppIcon size={size === "lg" ? 20 : 16} />
    </a>
  );
}

function isBackdropClick(event: ReactMouseEvent<HTMLElement>) {
  return event.target === event.currentTarget;
}

type ListagemAcao = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  destructive?: boolean;
  accent?: boolean;
  tooltip?: string;
};

function ListagemAcoes({
  acoes,
  ariaLabel,
}: {
  acoes: ListagemAcao[];
  ariaLabel: string;
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownPosicao, setDropdownPosicao] = useState({
    top: 0,
    left: 0,
    maxHeight: 360,
  });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const acoesAtivas = acoes.filter(Boolean);

  const atualizarPosicaoDropdown = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const larguraDropdown = 208;
    const margemTela = 12;
    const espacoEntreBotao = 8;
    const maxHeight = Math.min(360, window.innerHeight - margemTela * 2);
    const alturaDropdown = Math.min(
      dropdownRef.current?.offsetHeight ?? maxHeight,
      maxHeight,
    );
    const limiteEsquerda = window.innerWidth - larguraDropdown - margemTela;
    const left = Math.max(
      margemTela,
      Math.min(rect.right - larguraDropdown, limiteEsquerda),
    );
    let top = rect.bottom + espacoEntreBotao;

    if (top + alturaDropdown > window.innerHeight - margemTela) {
      top = Math.max(margemTela, rect.top - alturaDropdown - espacoEntreBotao);
    }

    setDropdownPosicao({ top, left, maxHeight });
  }, []);

  useEffect(() => {
    if (
      !menuAberto ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    atualizarPosicaoDropdown();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        rootRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setMenuAberto(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuAberto(false);
      }
    };

    window.addEventListener("resize", atualizarPosicaoDropdown);
    window.addEventListener("scroll", atualizarPosicaoDropdown, true);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", atualizarPosicaoDropdown);
      window.removeEventListener("scroll", atualizarPosicaoDropdown, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [atualizarPosicaoDropdown, menuAberto]);

  if (!acoesAtivas.length) {
    return null;
  }

  if (acoesAtivas.length <= 3) {
    return (
      <div className="table-actions table-actions-icons" aria-label={ariaLabel}>
        {acoesAtivas.map((acao) => (
          <ListagemAcaoIcone key={acao.label} acao={acao} />
        ))}
      </div>
    );
  }

  return (
    <div className="table-actions table-actions-menu" aria-label={ariaLabel}>
      <div ref={rootRef} className="list-actions-dropdown-root">
        <button
          ref={buttonRef}
          type="button"
          className="table-action-icon tooltip-icon-button"
          aria-label="Abrir menu de acoes"
          aria-haspopup="menu"
          aria-expanded={menuAberto}
          data-tooltip="Mais acoes"
          title="Mais acoes"
          onClick={() => {
            if (!menuAberto) {
              atualizarPosicaoDropdown();
            }

            setMenuAberto((aberto) => !aberto);
          }}
        >
          <Menu size={17} aria-hidden="true" />
        </button>
        {menuAberto && typeof document !== "undefined"
          ? createPortal(
              <div
                ref={dropdownRef}
                className="list-actions-dropdown"
                role="menu"
                style={{
                  top: dropdownPosicao.top,
                  left: dropdownPosicao.left,
                  maxHeight: dropdownPosicao.maxHeight,
                }}
              >
                {acoesAtivas.map((acao) => (
                  <ListagemAcaoDropdown
                    key={acao.label}
                    acao={acao}
                    onClose={() => setMenuAberto(false)}
                  />
                ))}
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

function ListagemAcaoIcone({ acao }: { acao: ListagemAcao }) {
  const className = getListagemAcaoClassName(acao, "table-action-icon tooltip-icon-button");
  const tooltip = acao.tooltip ?? acao.label;

  if (acao.href && !acao.disabled) {
    return (
      <a
        href={acao.href}
        target={acao.target}
        rel={acao.rel}
        aria-label={acao.label}
        title={tooltip}
        data-tooltip={tooltip}
        className={className}
      >
        {acao.icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={acao.disabled}
      onClick={acao.onClick}
      aria-label={acao.label}
      title={tooltip}
      data-tooltip={tooltip}
      className={className}
    >
      {acao.icon}
    </button>
  );
}

function ListagemAcaoDropdown({
  acao,
  onClose,
}: {
  acao: ListagemAcao;
  onClose: () => void;
}) {
  const className = getListagemAcaoClassName(acao, "list-actions-dropdown-item");

  if (acao.href && !acao.disabled) {
    return (
      <a
        href={acao.href}
        target={acao.target}
        rel={acao.rel}
        role="menuitem"
        className={className}
        onClick={onClose}
      >
        {acao.icon}
        <span>{acao.label}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={acao.disabled}
      className={className}
      onClick={() => {
        if (acao.disabled) {
          return;
        }

        onClose();
        acao.onClick?.();
      }}
    >
      {acao.icon}
      <span>{acao.label}</span>
    </button>
  );
}

function getListagemAcaoClassName(acao: ListagemAcao, base: string): string {
  return `${base} ${acao.accent ? "is-accent" : ""} ${
    acao.destructive ? "is-danger" : ""
  }`;
}

function PaginacaoLista<T>({
  label,
  paginacao,
  tamanhoPagina,
  onChangePagina,
  onChangeTamanhoPagina,
}: {
  label: string;
  paginacao: PaginacaoListaResultado<T>;
  tamanhoPagina: number;
  onChangePagina: (pagina: number) => void;
  onChangeTamanhoPagina: (tamanho: number) => void;
}) {
  if (paginacao.totalItens === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
      <span>
        Mostrando {paginacao.inicio}-{paginacao.fim} de {paginacao.totalItens}{" "}
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span>Tamanho</span>
          <select
            value={tamanhoPagina}
            onChange={(event) =>
              onChangeTamanhoPagina(Number(event.target.value))
            }
            className="h-11 rounded-md border border-border bg-white px-3 text-sm outline-none"
          >
            {tamanhosPaginaListagem.map((tamanho) => (
              <option key={tamanho} value={tamanho}>
                {tamanho}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={paginacao.paginaAtual <= 1}
          onClick={() => onChangePagina(paginacao.paginaAtual - 1)}
          className="inline-flex h-11 items-center rounded-md border border-border px-4 font-semibold text-foreground disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="font-semibold text-foreground">
          {paginacao.paginaAtual}/{paginacao.totalPaginas}
        </span>
        <button
          type="button"
          disabled={paginacao.paginaAtual >= paginacao.totalPaginas}
          onClick={() => onChangePagina(paginacao.paginaAtual + 1)}
          className="inline-flex h-11 items-center rounded-md border border-border px-4 font-semibold text-foreground disabled:opacity-50"
        >
          Proxima
        </button>
      </div>
    </div>
  );
}

type PreviewPropostaVisualProps = {
  perfilConta: PerfilContaResponse | undefined;
  contaNome: string;
  planoConta: ContaAtualResponse["plano"];
  cliente: ClienteResponse | undefined;
  clienteNomeFallback?: string;
  proposta: PropostaPreviewInput;
  numeroProposta?: number | null;
  subtotal: number;
  desconto: number;
  total: number;
};

type PropostaDocumentoItem = {
  nome: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
};

type PropostaDocumentoDados = {
  templateVisual: PropostaTemplateVisual;
  templateLabel: string;
  nomeMarca: string;
  logoUrl: string | null;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  clienteNome: string;
  dataTexto: string;
  validadeTexto: string;
  numeroTexto: string;
  tipoTexto: string;
  contatoMarca: string;
  telefoneMarca: string;
  emailMarca: string;
  instagramMarca: string;
  siteMarca: string;
  isPlanoFundador: boolean;
  itens: PropostaDocumentoItem[];
  beneficios: string[];
  itensInclusos: string[];
  itensNaoInclusos: string[];
  cronograma: string[];
  condicoesPagamento: string | null;
  subtotal: number;
  desconto: number;
  total: number;
  corPrimaria: string;
  corSecundaria: string;
};

const PreviewPropostaVisual = forwardRef<HTMLDivElement, PreviewPropostaVisualProps>(
  (
    {
      perfilConta,
      contaNome,
      planoConta,
      cliente,
      clienteNomeFallback,
      proposta,
      numeroProposta,
      subtotal,
      desconto,
      total,
    },
    ref,
  ) => {
  const corPrimaria = normalizarHexPreview(
    perfilConta?.corPrimaria ?? "#6E38FF",
  );
  const corSecundaria = normalizarHexPreview(
    perfilConta?.corSecundaria ?? "#13C7BD",
  );
  const templateVisual = normalizarTemplateVisual(proposta.templateVisual);
  const nomeMarca = perfilConta?.nomeComercial?.trim() || contaNome;
  const titulo = proposta.titulo?.trim() || "Proposta comercial";
  const introducao = proposta.introducao?.trim();
  const observacoes = proposta.observacoes?.trim();
  const itens = proposta.itens ?? [];
  const validadeTexto = formatValidadeProposta(proposta.validadeDias);
  const numeroTexto = numeroProposta
    ? formatNumeroProposta(numeroProposta)
    : "Ainda nao salva";
  const contatoMarca = buildContatoMarca(perfilConta);
  const isPlanoFundador = planoConta === "Fundador";
  const clienteNome = cliente?.nome ?? clienteNomeFallback ?? "";
  const logoUrl = resolveApiAssetUrl(perfilConta?.logoUrl) || null;
  const beneficios = splitLinhasFormulario(proposta.beneficiosTexto);
  const itensInclusos = splitLinhasFormulario(proposta.itensInclusosTexto);
  const itensNaoInclusos = splitLinhasFormulario(proposta.itensNaoInclusosTexto);
  const cronograma = splitLinhasFormulario(proposta.cronogramaTexto);
  const condicoesPagamento = proposta.condicoesPagamento?.trim();
  const templateLabel = getPropostaTemplateLabel(templateVisual);
  const dataTexto = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const cssVars = {
    "--proposal-primary": corPrimaria,
    "--proposal-secondary": corSecundaria,
  } as CSSProperties;
  const documento: PropostaDocumentoDados = {
    templateVisual,
    templateLabel,
    nomeMarca,
    logoUrl,
    titulo,
    introducao: introducao || null,
    observacoes: observacoes || null,
    clienteNome,
    dataTexto,
    validadeTexto,
    numeroTexto,
    tipoTexto: inferirTipoProposta(proposta, itens),
    contatoMarca,
    telefoneMarca: perfilConta?.telefoneContato?.trim() ?? "",
    emailMarca: perfilConta?.emailContato?.trim() ?? "",
    instagramMarca: normalizarInstagramDocumento(perfilConta?.instagram),
    siteMarca: perfilConta?.siteUrl?.trim() ?? "",
    isPlanoFundador,
    itens: itens
      .map((item) => ({
        nome: item.nome?.trim() ?? "",
        descricao: item.descricao?.trim() ?? "",
        quantidade: valorSeguro(item.quantidade),
        valorUnitario: valorSeguro(item.valorUnitario),
        total: calcularTotalItens([item]),
      }))
      .filter((item) => item.nome.length > 0),
    beneficios,
    itensInclusos,
    itensNaoInclusos,
    cronograma,
    condicoesPagamento: condicoesPagamento || null,
    subtotal,
    desconto,
    total,
    corPrimaria,
    corSecundaria,
  };

  return (
    <section className="proposal-preview-shell proposal-preview-compact rounded-md border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Preview</p>
          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
            Orçamento visual
          </h2>
        </div>
        <FileText className="text-muted" size={22} aria-hidden="true" />
      </div>

      <TemplateDocumentoProposta ref={ref} documento={documento} style={cssVars} />
    </section>
  );
  },
);

PreviewPropostaVisual.displayName = "PreviewPropostaVisual";

type TemplateDocumentoPropostaProps = {
  documento: PropostaDocumentoDados;
  style: CSSProperties;
};

type TemplateDocumentoBaseProps = {
  d: PropostaDocumentoDados;
};

const TemplateDocumentoProposta = forwardRef<
  HTMLDivElement,
  TemplateDocumentoPropostaProps
>(({ documento, style }, ref) => (
  <article
    ref={ref}
    className={`proposal-paper proposal-template-document template-document print-proposta ${getTemplateCssClass(
      documento.templateVisual,
    )}`}
    style={style}
    aria-label={`Preview do template ${documento.templateLabel}`}
  >
    {!documento.isPlanoFundador ? (
      <div className="doc-trial-watermark">Emprely Trial</div>
    ) : null}
    {renderTemplateDocumento(documento)}
  </article>
));

TemplateDocumentoProposta.displayName = "TemplateDocumentoProposta";

function renderTemplateDocumento(documento: PropostaDocumentoDados) {
  switch (documento.templateVisual) {
    case "ComercialMinimalista":
      return <TemplateComercialMinimalista d={documento} />;
    case "OrcamentoSimplificado":
      return <TemplateOrcamentoSimplificado d={documento} />;
    case "PropostaCompleta":
      return <TemplatePropostaCompleta d={documento} />;
    case "LunaSocialStudio":
      return <TemplateLunaSocialStudio d={documento} />;
    case "DarkGrowth":
      return <TemplateDarkGrowth d={documento} />;
    case "InstagramPremium":
      return <TemplateInstagramPremium d={documento} />;
    case "Claymorphism":
      return <TemplateClaymorphism d={documento} />;
    case "Emprely":
      return <TemplateEmprely d={documento} />;
    case "ExecutivoEditorial":
      return <TemplateExecutivoEditorial d={documento} />;
    case "CorporativoBoard":
      return <TemplateCorporativoBoard d={documento} />;
    case "InstitucionalClean":
      return <TemplateInstitucionalClean d={documento} />;
    default:
      return <TemplateComercialMinimalista d={documento} />;
  }
}

function TemplateMiniatura({
  templateVisual,
}: {
  templateVisual: PropostaTemplateVisualAtivo;
}) {
  return (
    <div
      className={`template-miniatura ${getTemplateCssClass(templateVisual)}`}
      aria-hidden="true"
    >
      <div className="template-miniatura-hero">
        <div className="template-miniatura-brand">
          <span />
          <strong />
        </div>
        <div className="template-miniatura-heading">
          <i />
          <b />
          <em />
        </div>
        <div className="template-miniatura-panel">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="template-miniatura-content">
        <div className="template-miniatura-benefits">
          <span />
          <span />
          <span />
        </div>
        <div className="template-miniatura-main">
          <span />
          <span />
        </div>
        <div className="template-miniatura-footer" />
      </div>
    </div>
  );
}

function TemplateComercialMinimalista({ d }: TemplateDocumentoBaseProps) {
  return (
    <div className="doc-page doc-minimal-page">
      <header className="doc-minimal-header">
        <DocumentoMarca d={d} />
        <div className="doc-minimal-title">
          <span className="doc-kicker">Orcamento Comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-minimal-title-main" />
          <span className="doc-title-rule" />
        </div>
      </header>

      <DocumentoMetaStrip d={d} labelsUpper />
      {d.introducao ? <p className="doc-lead doc-minimal-lead">{d.introducao}</p> : null}

      <DocumentoTabelaServicos d={d} totalColumn />

      <section className="doc-minimal-summary">
        <DocumentoTotalCard d={d} variant="light" />
      </section>

      <DocumentoCondicoes d={d} compact />
      <DocumentoFooter d={d} cta="Aprovar orcamento" minimal />
    </div>
  );
}

function TemplateOrcamentoSimplificado({ d }: TemplateDocumentoBaseProps) {
  return (
    <div className="doc-page doc-simple-page">
      <span className="doc-simple-corner" />
      <span className="doc-simple-dots" />
      <header className="doc-simple-brand">
        <DocumentoMarca d={d} large />
      </header>

      <section className="doc-simple-title">
        <span />
        <div>
          <small>Orcamento Simplificado</small>
          <DocumentoTitulo titulo={d.titulo} className="doc-simple-title-main" />
          <p>Proposta objetiva com os principais itens para aprovacao rapida.</p>
        </div>
      </section>

      <DocumentoMetaCards d={d} />

      {d.introducao ? (
        <section className="doc-simple-intro">
          <div className="doc-round-icon">
            <Target size={46} />
          </div>
          <p>{d.introducao}</p>
        </section>
      ) : null}

      <section className="doc-simple-grid">
        <DocumentoTabelaServicos d={d} compact icons />
        <DocumentoTotalCard d={d} variant="receipt" />
      </section>

      <section className="doc-simple-actions">
        <DocumentoCondicoes d={d} icon />
        <div className="doc-cta doc-cta-simple">
          <CheckCircle2 size={30} />
          <strong>Aprovar orcamento</strong>
        </div>
      </section>

      <DocumentoFooter d={d} contactOnly />
    </div>
  );
}

function TemplatePropostaCompleta({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);
  let sectionIndex = 1;
  const resumoIndex = d.introducao ? `${sectionIndex++}.` : "";
  const beneficiosIndex = d.beneficios.length ? `${sectionIndex++}.` : "";
  const escopoIndex = `${sectionIndex++}.`;
  const inclusosTitle = inclusos.length ? `${sectionIndex++}. O que esta incluso` : "";
  const naoInclusosTitle = d.itensNaoInclusos.length
    ? `${sectionIndex++}. O que nao esta incluso`
    : "";
  const cronogramaIndex = d.cronograma.length ? `${sectionIndex++}.` : "";
  const investimentoIndex = `${sectionIndex++}.`;
  const observacoesIndex =
    d.observacoes || d.condicoesPagamento ? `${sectionIndex++}.` : "";

  return (
    <div className="doc-page doc-complete-page">
      <header className="doc-complete-header">
        <DocumentoMarca d={d} />
        <div className="doc-complete-heading">
          <span>Proposta comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-complete-title-main" />
          <small>Estrategia, conteudo e consistencia para transformar seguidores em clientes.</small>
        </div>
      </header>

      <DocumentoMetaStrip d={d} iconMode />
      {d.introducao ? (
        <>
          <DocumentoSectionTitle icon={<FileText size={22} />} index={resumoIndex} title="Resumo executivo" />
          <p className="doc-paragraph">{d.introducao}</p>
        </>
      ) : null}

      {d.beneficios.length ? (
        <>
          <DocumentoSectionTitle
            icon={<Target size={22} />}
            index={beneficiosIndex}
            title="Objetivos e beneficios"
          />
          <DocumentoBeneficios d={d} mode="wide" />
        </>
      ) : null}

      <section className="doc-complete-three">
        <div>
          <DocumentoSectionTitle
            icon={<PackageCheck size={22} />}
            index={escopoIndex}
            title="Escopo e entregaveis"
          />
          <DocumentoTabelaServicos d={d} compact />
        </div>
        <DocumentoLista titulo={inclusosTitle} itens={inclusos} positive />
        <DocumentoLista titulo={naoInclusosTitle} itens={d.itensNaoInclusos} />
      </section>

      {d.cronograma.length ? (
        <>
          <DocumentoSectionTitle
            icon={<Clock3 size={22} />}
            index={cronogramaIndex}
            title="Cronograma e condicoes"
          />
          <DocumentoTimeline d={d} horizontal />
        </>
      ) : null}

      <DocumentoSectionTitle icon={<DollarSign size={22} />} index={investimentoIndex} title="Investimento" />
      <DocumentoInvestimentoLinha d={d} />

      {d.observacoes || d.condicoesPagamento ? (
        <>
          <DocumentoSectionTitle
            icon={<Info size={22} />}
            index={observacoesIndex}
            title="Observacoes finais"
          />
          <p className="doc-paragraph doc-observacao">
            {d.observacoes || d.condicoesPagamento}
          </p>
        </>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" />
    </div>
  );
}

function TemplateLunaSocialStudio({ d }: TemplateDocumentoBaseProps) {
  return <TemplateSocialDetalhado d={d} luna />;
}

function TemplateDarkGrowth({ d }: TemplateDocumentoBaseProps) {
  return <TemplateSocialDetalhado d={d} />;
}

function TemplateSocialDetalhado({
  d,
  luna = false,
}: TemplateDocumentoBaseProps & { luna?: boolean }) {
  return (
    <div className={`doc-page doc-social-page ${luna ? "doc-social-page-luna" : ""}`}>
      <header className="doc-social-hero">
        <div>
          <DocumentoMarca d={d} dark={luna} large />
          <h1>Proposta Comercial</h1>
          <span className="doc-title-underline" />
          <DocumentoTitulo titulo={d.titulo} as="h2" className="doc-social-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
        <DocumentoMetaPanel d={d} dark />
      </header>

      <main className="doc-social-content">
        {d.beneficios.length ? (
          <>
            <DocumentoSectionTitle
              icon={<Sparkles size={20} />}
              title="Por que esta proposta faz sentido"
            />
            <DocumentoBeneficios d={d} />
          </>
        ) : null}

        <DocumentoSectionTitle
          icon={<FolderOpen size={20} />}
          title="Escopo da proposta"
        />
        <DocumentoTabelaServicos d={d} compact detailed icons />

        {getInclusosDocumento(d).length || d.itensNaoInclusos.length ? (
          <section className="doc-social-lists">
            <DocumentoLista titulo="O que esta incluso" itens={getInclusosDocumento(d)} positive />
            <DocumentoLista titulo="O que nao esta incluso" itens={d.itensNaoInclusos} />
          </section>
        ) : null}

        {d.cronograma.length ? (
          <>
            <DocumentoSectionTitle
              icon={<Clock3 size={20} />}
              title="Cronograma e condicoes"
            />
            <DocumentoTimeline d={d} horizontal numbered />
          </>
        ) : null}

        <section className="doc-social-bottom">
          <DocumentoInvestimentoBloco d={d} />
          {d.observacoes || d.condicoesPagamento ? (
            <div className="doc-observation-card">
              <DocumentoSectionTitle icon={<Sparkles size={20} />} title="Observacoes finais" />
              <p>{d.observacoes || d.condicoesPagamento}</p>
              <div className="doc-cta">
                <CheckCircle2 size={24} />
                <strong>Aprovar proposta</strong>
              </div>
              <DocumentoContatoInline d={d} />
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function TemplateInstagramPremium({ d }: TemplateDocumentoBaseProps) {
  const textoResumo = d.observacoes || d.introducao;
  const textoInfo = d.condicoesPagamento || d.observacoes;

  return (
    <div className="doc-page doc-instagram-page">
      <header className="doc-instagram-header">
        <div>
          <DocumentoMarca d={d} large />
          <span className="doc-kicker">Proposta comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-instagram-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
        <DocumentoMetaPanel d={d} dark />
      </header>

      {textoResumo ? (
        <section className="doc-instagram-resumo">
          <div className="doc-round-icon doc-round-icon-purple">
            <InstagramGlyph size={28} />
          </div>
          <div>
            <h2>Resumo executivo</h2>
            <p>{textoResumo}</p>
          </div>
        </section>
      ) : null}

      <DocumentoBeneficios d={d} mode="wide" />

      <section className="doc-instagram-grid">
        <div>
          <DocumentoSectionTitle title="Escopo / servicos contratados" />
          <DocumentoTabelaServicos d={d} compact detailed icons />
        </div>
        <div className="doc-stack">
          <DocumentoLista titulo="O que esta incluso" itens={getInclusosDocumento(d)} positive />
          <DocumentoLista titulo="O que nao esta incluso" itens={d.itensNaoInclusos} />
        </div>
      </section>

      <section className="doc-instagram-bottom">
        <DocumentoTimeline d={d} />
        <DocumentoInvestimentoBloco d={d} />
      </section>

      {textoInfo ? (
        <div className="doc-info-strip">
          <Info size={24} />
          <p>{textoInfo}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" premium />
    </div>
  );
}

function TemplateClaymorphism({ d }: TemplateDocumentoBaseProps) {
  return (
    <div className="doc-page doc-clay-page">
      <header className="doc-clay-hero">
        <div>
          <DocumentoMarca d={d} large />
          <span className="doc-kicker">Proposta comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-clay-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
        <DocumentoMetaPanel d={d} />
      </header>

      {d.beneficios.length ? (
        <section className="doc-clay-section">
          <DocumentoSectionTitle icon={<Sparkles size={20} />} title="Objetivos" />
          <DocumentoBeneficios d={d} />
        </section>
      ) : null}

      <section className="doc-clay-main">
        <div className="doc-clay-card">
          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Escopo" />
          <DocumentoTabelaServicos d={d} compact icons />
        </div>
        <div className="doc-clay-stack">
          <DocumentoTotalCard d={d} variant="light" />
          <DocumentoCondicoes d={d} compact icon />
        </div>
      </section>

      {getInclusosDocumento(d).length || d.itensNaoInclusos.length ? (
        <section className="doc-clay-lists">
          <DocumentoLista titulo="O que esta incluso" itens={getInclusosDocumento(d)} positive />
          <DocumentoLista titulo="O que nao esta incluso" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.cronograma.length ? (
        <section className="doc-clay-section">
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Cronograma" />
          <DocumentoTimeline d={d} horizontal />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip doc-clay-note">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" />
    </div>
  );
}

function TemplateEmprely({ d }: TemplateDocumentoBaseProps) {
  return (
    <div className="doc-page doc-emprely-page">
      <header className="doc-emprely-header">
        <DocumentoMarca d={d} />
        <div className="doc-emprely-pill">Emprely Orçamentos</div>
      </header>

      <section className="doc-emprely-hero">
        <div>
          <span className="doc-kicker">Proposta comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-emprely-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
        <DocumentoMetaPanel d={d} dark />
      </section>

      <section className="doc-emprely-grid">
        <main>
          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<Target size={20} />} title="Pontos de valor" />
              <DocumentoBeneficios d={d} mode="wide" />
            </>
          ) : null}

          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Escopo contratado" />
          <DocumentoTabelaServicos d={d} compact icons />
        </main>

        <aside className="doc-emprely-sidebar">
          <DocumentoInvestimentoBloco d={d} />
          <DocumentoCondicoes d={d} compact />
        </aside>
      </section>

      {getInclusosDocumento(d).length || d.itensNaoInclusos.length ? (
        <section className="doc-emprely-lists">
          <DocumentoLista titulo="Incluso" itens={getInclusosDocumento(d)} positive />
          <DocumentoLista titulo="Fora do escopo" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.cronograma.length ? (
        <>
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Próximos passos" />
          <DocumentoTimeline d={d} horizontal numbered />
        </>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" premium />
    </div>
  );
}

function TemplateExecutivoEditorial({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);

  return (
    <div className="doc-page doc-executive-page">
      <header className="doc-executive-header">
        <DocumentoMarca d={d} />
        <div className="doc-executive-seal">
          <BriefcaseBusiness size={18} />
          <span>Proposta executiva</span>
        </div>
      </header>

      <section className="doc-executive-cover">
        <div className="doc-executive-rule" />
        <div>
          <span className="doc-kicker">Documento comercial</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-executive-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
      </section>

      <DocumentoMetaStrip d={d} labelsUpper />

      <section className="doc-executive-layout">
        <main>
          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<BadgeCheck size={20} />} title="Valor da proposta" />
              <DocumentoBeneficios d={d} mode="wide" />
            </>
          ) : null}

          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Escopo comercial" />
          <DocumentoTabelaServicos d={d} compact totalColumn />
        </main>

        <aside className="doc-executive-aside">
          <DocumentoTotalCard d={d} variant="light" />
          <DocumentoCondicoes d={d} compact />
        </aside>
      </section>

      {inclusos.length || d.itensNaoInclusos.length ? (
        <section className="doc-executive-lists">
          <DocumentoLista titulo="Incluido" itens={inclusos} positive />
          <DocumentoLista titulo="Fora do escopo" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" minimal />
    </div>
  );
}

function TemplateCorporativoBoard({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);

  return (
    <div className="doc-page doc-board-page">
      <header className="doc-board-hero">
        <div>
          <DocumentoMarca d={d} dark large />
          <span className="doc-board-label">Commercial board</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-board-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
        <DocumentoMetaPanel d={d} dark />
      </header>

      <section className="doc-board-summary">
        <DocumentoTotalCard d={d} variant="light" />
        <DocumentoCondicoes d={d} compact icon />
      </section>

      <section className="doc-board-content">
        <main>
          <DocumentoSectionTitle icon={<ShieldCheck size={20} />} title="Escopo contratado" />
          <DocumentoTabelaServicos d={d} compact detailed />

          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<Target size={20} />} title="Direcionadores" />
              <DocumentoBeneficios d={d} />
            </>
          ) : null}
        </main>

        {inclusos.length || d.itensNaoInclusos.length ? (
          <aside>
            <DocumentoLista titulo="Incluido" itens={inclusos} positive />
            <DocumentoLista titulo="Nao incluido" itens={d.itensNaoInclusos} />
          </aside>
        ) : null}
      </section>

      {d.cronograma.length ? (
        <section className="doc-board-timeline">
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Etapas" />
          <DocumentoTimeline d={d} horizontal numbered />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" premium />
    </div>
  );
}

function TemplateInstitucionalClean({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);

  return (
    <div className="doc-page doc-institutional-page">
      <header className="doc-institutional-header">
        <DocumentoMarca d={d} />
        <span>Proposta institucional</span>
      </header>

      <section className="doc-institutional-title">
        <span className="doc-kicker">Orcamento comercial</span>
        <DocumentoTitulo titulo={d.titulo} className="doc-institutional-title-main" />
        {d.introducao ? <p>{d.introducao}</p> : null}
      </section>

      <DocumentoMetaStrip d={d} labelsUpper />

      <section className="doc-institutional-grid">
        <main>
          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<Target size={20} />} title="Objetivos" />
              <DocumentoBeneficios d={d} mode="wide" />
            </>
          ) : null}

          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Servicos e investimento" />
          <DocumentoTabelaServicos d={d} compact totalColumn />
        </main>

        <aside>
          <DocumentoTotalCard d={d} variant="light" />
          <DocumentoCondicoes d={d} compact />
        </aside>
      </section>

      {inclusos.length || d.itensNaoInclusos.length ? (
        <section className="doc-institutional-lists">
          <DocumentoLista titulo="Incluido" itens={inclusos} positive />
          <DocumentoLista titulo="Nao incluido" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.cronograma.length ? (
        <section className="doc-institutional-timeline">
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Cronograma" />
          <DocumentoTimeline d={d} horizontal />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar proposta" minimal />
    </div>
  );
}

function DocumentoMarca({
  d,
  large = false,
  dark = false,
}: TemplateDocumentoBaseProps & {
  large?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`doc-brand ${large ? "doc-brand-large" : ""} ${dark ? "doc-brand-dark" : ""}`}>
      {d.logoUrl ? (
        <img src={d.logoUrl} alt={`Logo ${d.nomeMarca}`} />
      ) : (
        <span className="doc-brand-fallback">{getIniciaisMarca(d.nomeMarca)}</span>
      )}
      <div>
        <strong>{d.nomeMarca}</strong>
        {d.instagramMarca || d.siteMarca ? (
          <small>{d.instagramMarca || d.siteMarca}</small>
        ) : null}
      </div>
    </div>
  );
}

function DocumentoTitulo({
  titulo,
  as = "h1",
  className = "",
}: {
  titulo: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const classe = `doc-title-main doc-title-${getTituloDocumentoTamanho(titulo)} ${className}`;

  if (as === "h2") {
    return <h2 className={classe}>{titulo}</h2>;
  }

  return <h1 className={classe}>{titulo}</h1>;
}

function DocumentoMetaStrip({
  d,
  labelsUpper = false,
  iconMode = false,
}: TemplateDocumentoBaseProps & {
  labelsUpper?: boolean;
  iconMode?: boolean;
}) {
  const itens = getMetadadosDocumento(d);

  if (!itens.length) {
    return null;
  }

  return (
    <section className={`doc-meta-strip ${labelsUpper ? "doc-meta-strip-upper" : ""}`}>
      {itens.map((item) => (
        <DocumentoMetaItem key={item.label} item={item} iconMode={iconMode} />
      ))}
    </section>
  );
}

function DocumentoMetaCards({ d }: TemplateDocumentoBaseProps) {
  const itens = getMetadadosDocumento(d);

  if (!itens.length) {
    return null;
  }

  return (
    <section className="doc-meta-cards">
      {itens.map((item) => (
        <DocumentoMetaItem key={item.label} item={item} iconMode />
      ))}
    </section>
  );
}

function DocumentoMetaPanel({
  d,
  dark = false,
}: TemplateDocumentoBaseProps & { dark?: boolean }) {
  const itens = getMetadadosDocumento(d).filter((item) => item.label !== "Numero");

  if (!itens.length) {
    return null;
  }

  return (
    <aside className={`doc-meta-panel ${dark ? "doc-meta-panel-dark" : ""}`}>
      {itens.map((item) => (
        <DocumentoMetaItem key={item.label} item={item} iconMode />
      ))}
    </aside>
  );
}

function DocumentoMetaItem({
  item,
  iconMode = false,
}: {
  item: ReturnType<typeof getMetadadosDocumento>[number];
  iconMode?: boolean;
}) {
  return (
    <div className="doc-meta-item">
      {iconMode ? <span className="doc-meta-icon">{item.icon}</span> : null}
      <div>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
      </div>
    </div>
  );
}

function DocumentoSectionTitle({
  icon,
  index,
  title,
}: {
  icon?: ReactNode;
  index?: string;
  title: string;
}) {
  return (
    <h3 className="doc-section-title">
      {icon ? <span>{icon}</span> : null}
      {index ? <small>{index}</small> : null}
      {title}
    </h3>
  );
}

function InstagramGlyph({
  size = 28,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DocumentoBeneficios({
  d,
  mode,
}: TemplateDocumentoBaseProps & { mode?: "wide" }) {
  const beneficios = getBeneficiosDocumento(d);

  if (!beneficios.length) {
    return null;
  }

  const icons = [
    <Target size={28} key="target" />,
    <HeartHandshake size={28} key="heart" />,
    <CalendarDays size={28} key="calendar" />,
    <BarChart3 size={28} key="chart" />,
  ];

  return (
    <section className={`doc-benefit-grid ${mode === "wide" ? "doc-benefit-grid-wide" : ""}`}>
      {beneficios.map((beneficio, index) => {
        const beneficioDocumento = parseBeneficioDocumento(beneficio, index);

        return (
          <article key={`${beneficio}-${index}`} className="doc-benefit-card">
            <span>{icons[index % icons.length]}</span>
            <strong>{beneficioDocumento.titulo}</strong>
            <p>{beneficioDocumento.descricao}</p>
          </article>
        );
      })}
    </section>
  );
}

function DocumentoTabelaServicos({
  d,
  compact = false,
  detailed = false,
  totalColumn = false,
  icons = false,
}: TemplateDocumentoBaseProps & {
  compact?: boolean;
  detailed?: boolean;
  totalColumn?: boolean;
  icons?: boolean;
}) {
  const itens = d.itens;

  if (!itens.length) {
    return null;
  }

  const mostrarDetalhamento = detailed && itens.some((item) => item.descricao.trim());
  const itemIcons = [
    <PackageCheck size={17} key="package" />,
    <FileText size={17} key="file" />,
    <Rocket size={17} key="rocket" />,
    <CalendarDays size={17} key="calendar" />,
    <BarChart3 size={17} key="bar" />,
    <RefreshCw size={17} key="refresh" />,
  ];

  return (
    <div
      className={`doc-table-card ${compact ? "doc-table-card-compact" : ""} ${
        mostrarDetalhamento ? "doc-table-card-detailed" : ""
      }`}
    >
      <table>
        <thead>
          <tr>
            <th>Servico</th>
            {mostrarDetalhamento ? <th>Detalhamento / entrega</th> : null}
            <th>{compact ? "Qtd." : "Quantidade"}</th>
            <th>{totalColumn ? "Valor unitario" : "Valor"}</th>
            {totalColumn ? <th>Total</th> : null}
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={`${item.nome}-${index}`}>
              <td>
                <span className="doc-service-name">
                  {icons ? (
                    <small className="doc-service-icon">
                      {itemIcons[index % itemIcons.length]}
                    </small>
                  ) : null}
                  <strong>{item.nome}</strong>
                </span>
              </td>
              {mostrarDetalhamento ? <td>{item.descricao}</td> : null}
              <td>{formatQuantidade(item.quantidade)}</td>
              <td>{formatMoney(item.valorUnitario)}</td>
              {totalColumn ? <td>{formatMoney(item.total)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentoLista({
  titulo,
  itens,
  positive = false,
}: {
  titulo: string;
  itens: string[];
  positive?: boolean;
}) {
  if (!itens.length) {
    return null;
  }

  return (
    <section className={`doc-list-card ${positive ? "doc-list-card-positive" : ""}`}>
      <h3>
        {positive ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
        {titulo}
      </h3>
      <ul>
        {itens.map((item, index) => (
          <li key={`${item}-${index}`}>
            {positive ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocumentoTimeline({
  d,
  horizontal = false,
  numbered = false,
}: TemplateDocumentoBaseProps & {
  horizontal?: boolean;
  numbered?: boolean;
}) {
  const itens = getCronogramaDocumento(d);

  if (!itens.length) {
    return null;
  }

  const icons = [
    <Rocket size={28} key="rocket" />,
    <CalendarDays size={28} key="calendar" />,
    <CreditCard size={28} key="card" />,
    <Tags size={28} key="tags" />,
    <RefreshCw size={28} key="refresh" />,
  ];

  return (
    <section
      className={`doc-timeline ${horizontal ? "doc-timeline-horizontal" : ""} ${
        numbered ? "doc-timeline-numbered" : ""
      }`}
    >
      {itens.map((item, index) => {
        const [titulo, ...descricao] = item.split(":");

        return (
          <article key={`${item}-${index}`}>
            {numbered ? <small>{String(index + 1).padStart(2, "0")}</small> : null}
            <span>{icons[index % icons.length]}</span>
            <strong>{titulo.trim()}</strong>
            <p>{descricao.join(":").trim() || item}</p>
          </article>
        );
      })}
    </section>
  );
}

function DocumentoInvestimentoLinha({ d }: TemplateDocumentoBaseProps) {
  const temDesconto = hasDescontoDocumento(d);

  return (
    <section className={`doc-investment-line ${temDesconto ? "" : "doc-investment-line-sem-desconto"}`}>
      <div>
        <span>Subtotal</span>
        <strong>{formatMoney(d.subtotal)}</strong>
      </div>
      {temDesconto ? (
        <>
          <small>-</small>
          <div>
            <span>Desconto</span>
            <strong>{formatMoney(d.desconto)}</strong>
          </div>
          <small>=</small>
        </>
      ) : null}
      <div>
        <span>Total final</span>
        <strong>{formatMoney(d.total)}</strong>
      </div>
    </section>
  );
}

function DocumentoInvestimentoBloco({ d }: TemplateDocumentoBaseProps) {
  const temDesconto = hasDescontoDocumento(d);

  return (
    <section className="doc-investment-card">
      <h3>
        <DollarSign size={22} />
        Investimento
      </h3>
      <div>
        <span>Subtotal mensal</span>
        <strong>{formatMoney(d.subtotal)}</strong>
      </div>
      {temDesconto ? (
        <div className="doc-discount-row">
          <span>Desconto</span>
          <strong>- {formatMoney(d.desconto)}</strong>
        </div>
      ) : null}
      <div className="doc-total-row">
        <span>Total mensal</span>
        <strong>{formatMoney(d.total)}</strong>
      </div>
    </section>
  );
}

function DocumentoTotalCard({
  d,
  variant,
}: TemplateDocumentoBaseProps & { variant?: "light" | "receipt" }) {
  const temDesconto = hasDescontoDocumento(d);

  return (
    <section className={`doc-total-card ${variant ? `doc-total-card-${variant}` : ""}`}>
      {variant === "receipt" ? (
        <div className="doc-total-receipt-icon">
          <ReceiptText size={38} />
        </div>
      ) : null}
      <div>
        <span>Subtotal</span>
        <strong>{formatMoney(d.subtotal)}</strong>
      </div>
      {temDesconto ? (
        <div>
          <span>Desconto</span>
          <strong>{formatMoney(d.desconto)}</strong>
        </div>
      ) : null}
      <div className="doc-total-final-row">
        <span>Total final</span>
        <strong>{formatMoney(d.total)}</strong>
      </div>
    </section>
  );
}

function DocumentoCondicoes({
  d,
  compact = false,
  icon = false,
}: TemplateDocumentoBaseProps & {
  compact?: boolean;
  icon?: boolean;
}) {
  if (!d.condicoesPagamento) {
    return null;
  }

  return (
    <section className={`doc-payment-card ${compact ? "doc-payment-card-compact" : ""}`}>
      {icon ? (
        <span>
          <CreditCard size={34} />
        </span>
      ) : null}
      <div>
        <h3>Condicoes de pagamento</h3>
        <p>{d.condicoesPagamento}</p>
      </div>
    </section>
  );
}

function DocumentoFooter({
  d,
  cta,
  minimal = false,
  premium = false,
  contactOnly = false,
}: TemplateDocumentoBaseProps & {
  cta?: string;
  minimal?: boolean;
  premium?: boolean;
  contactOnly?: boolean;
}) {
  return (
    <footer
      className={`doc-footer ${minimal ? "doc-footer-minimal" : ""} ${
        premium ? "doc-footer-premium" : ""
      } ${contactOnly ? "doc-footer-contact-only" : ""}`}
    >
      {!contactOnly ? <strong>{d.nomeMarca}</strong> : null}
      <DocumentoContatoInline d={d} />
      {cta ? (
        <div className="doc-footer-cta">
          <CheckCircle2 size={22} />
          <span>{cta}</span>
        </div>
      ) : null}
    </footer>
  );
}

function DocumentoContatoInline({ d }: TemplateDocumentoBaseProps) {
  const contatos = [d.telefoneMarca, d.emailMarca, d.instagramMarca || d.siteMarca].filter(
    Boolean,
  );

  if (!contatos.length && !d.contatoMarca) {
    return null;
  }

  return (
    <div className="doc-contact-inline">
      {contatos.length ? (
        contatos.map((contato) => <span key={contato}>{contato}</span>)
      ) : (
        <span>{d.contatoMarca}</span>
      )}
    </div>
  );
}

function getMetadadosDocumento(d: PropostaDocumentoDados) {
  return [
    { label: "Cliente", value: d.clienteNome, icon: <UserRound size={25} /> },
    { label: "Data", value: d.dataTexto, icon: <CalendarDays size={25} /> },
    { label: "Validade", value: d.validadeTexto, icon: <Clock3 size={25} /> },
    { label: "Tipo", value: d.tipoTexto, icon: <Tags size={25} /> },
  ].filter((item) => item.value.trim().length > 0);
}

function getBeneficiosDocumento(d: PropostaDocumentoDados): string[] {
  if (d.beneficios.length > 0) {
    return d.beneficios.slice(0, 4);
  }

  return [];
}

function parseBeneficioDocumento(
  beneficio: string,
  index: number,
): { titulo: string; descricao: string } {
  const [titulo, ...descricao] = beneficio.split(":");
  const tituloNormalizado = titulo.trim() || beneficio.trim();
  const descricaoNormalizada = descricao.join(":").trim();

  return {
    titulo: tituloNormalizado,
    descricao: descricaoNormalizada || getBeneficioDescricaoFallback(index),
  };
}

function getBeneficioDescricaoFallback(index: number): string {
  const descricoes = [
    "Frequencia e padronizacao para manter o perfil ativo e memoravel.",
    "Conteudo alinhado a identidade e ao publico.",
    "Calendario e planejamento para dar previsibilidade.",
    "Decisoes melhores com acompanhamento simples e direcionamento.",
  ];

  return descricoes[index % descricoes.length] ?? descricoes[0];
}

function getInclusosDocumento(d: PropostaDocumentoDados): string[] {
  if (d.itensInclusos.length > 0) {
    return d.itensInclusos;
  }

  return [];
}

function getCronogramaDocumento(d: PropostaDocumentoDados): string[] {
  if (d.cronograma.length > 0) {
    return d.cronograma;
  }

  return [];
}

function getIniciaisMarca(nomeMarca: string): string {
  return nomeMarca
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

function getTituloDocumentoTamanho(titulo: string): "curto" | "medio" | "longo" | "muito-longo" {
  const tamanho = titulo.trim().length;

  if (tamanho > 92) {
    return "muito-longo";
  }

  if (tamanho > 64) {
    return "longo";
  }

  if (tamanho > 38) {
    return "medio";
  }

  return "curto";
}

function DashboardContent({
  conta,
  propostas,
  perfilContaAtualizado,
  clientesTotal,
  servicosTotal,
  isLoading,
  isError,
  onRetry,
  onEditarPerfil,
  onAbrirPropostas,
  onNovaProposta,
  onCadastrarCliente,
  onSalvarServico,
}: {
  conta: ContaAtualResponse;
  propostas: PropostaResponse[];
  perfilContaAtualizado: boolean;
  clientesTotal: number;
  servicosTotal: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEditarPerfil: () => void;
  onAbrirPropostas: () => void;
  onNovaProposta: () => void;
  onCadastrarCliente: () => void;
  onSalvarServico: () => void;
}) {
  const metricas = buildMetricasDashboard(propostas, servicosTotal);
  const primeirosPassos = buildPrimeirosPassosDashboard({
    perfilContaAtualizado,
    clientesTotal,
    servicosTotal,
    propostasTotal: propostas.length,
    onEditarPerfil,
    onCadastrarCliente,
    onSalvarServico,
    onNovaProposta,
  });
  const deveMostrarPrimeirosPassos = primeirosPassos.some(
    (passo) => !passo.concluido,
  );
  const propostasRecentes = propostas.slice(0, 5);

  return (
    <>
      <div className="dashboard-hero rounded-md border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-md bg-violet-50 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles size={16} aria-hidden="true" />
              Emprely Orçamentos
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold leading-10">
              Crie orçamentos profissionais em minutos
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Cadastre seus serviços uma vez, selecione o cliente e envie a
              proposta pelo WhatsApp com aparência profissional.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onNovaProposta}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm"
            >
              <Plus size={18} aria-hidden="true" />
              Criar nova proposta
            </button>
            <button
              type="button"
              onClick={onSalvarServico}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-sm font-semibold"
            >
              <PackageCheck size={18} aria-hidden="true" />
              Cadastrar serviço
            </button>
          </div>
        </div>
      </div>

      {conta.plano === "Trial" ? <TrialUpsellBanner conta={conta} /> : null}

      {isLoading ? <DashboardCarregando /> : null}

      {isError ? (
        <EstadoErroConsulta
          titulo="Não foi possível carregar o painel."
          detalhe="Atualize os dados antes de tomar decisões pelo dashboard."
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
      {deveMostrarPrimeirosPassos ? (
        <PrimeirosPassosDashboard passos={primeirosPassos} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricas.map((metrica) => {
          const Icon = metrica.icon;

          return (
            <article
              key={metrica.label}
              className="metric-card rounded-md border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted">{metrica.label}</p>
                <span className={`metric-icon metric-icon-${metrica.tone}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
              <strong className="mt-2 block text-3xl font-semibold">
                {metrica.value}
              </strong>
              <span className="mt-1 block text-sm text-muted">
                {metrica.detail}
              </span>
            </article>
          );
        })}
      </div>

      <section className="rounded-md border border-border bg-surface p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Propostas recentes
            </h2>
            <p className="mt-1 text-sm text-muted">
              Acompanhe o status e volte rápido para o histórico.
            </p>
          </div>
          <button
            type="button"
            onClick={onAbrirPropostas}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold"
          >
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        {propostasRecentes.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <table className="data-table w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {propostasRecentes.length > 0 ? (
                propostasRecentes.map((proposta) => (
                  <tr key={proposta.id}>
                    <td data-label="Cliente">
                      <strong>{proposta.clienteNome}</strong>
                      <span>{formatNumeroProposta(proposta.numero)}</span>
                    </td>
                    <td data-label="Tipo">
                      {proposta.itens[0]?.nome ?? proposta.titulo}
                    </td>
                    <td data-label="Total">{formatMoney(proposta.total)}</td>
                    <td data-label="Status">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusPropostaClass(
                          proposta.status,
                        )}`}
                      >
                        {proposta.status}
                      </span>
                    </td>
                    <td data-label="Data">{formatDataCurta(proposta.createdAt)}</td>
                    <td data-label="Ações">
                      <ListagemAcoes
                        ariaLabel={`Acoes da proposta ${proposta.titulo}`}
                        acoes={[
                          {
                            label: "Ir para propostas",
                            icon: <FolderOpen size={16} />,
                            onClick: onAbrirPropostas,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Nenhuma proposta criada ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        ) : (
          <EstadoVazio
            titulo="Nenhuma proposta criada ainda."
            detalhe="Crie a primeira proposta para acompanhar status, valor e envio."
            action={{
              label: "Criar proposta",
              icon: <Plus size={16} aria-hidden="true" />,
              onClick: onNovaProposta,
            }}
          />
        )}
      </section>
        </>
      ) : null}
    </>
  );
}

function DashboardCarregando() {
  return (
    <>
      <ListaCarregando label="Carregando painel" />
      <div className="dashboard-skeleton-grid grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Clientes", "Serviços", "Propostas", "Resultado"].map((label) => (
          <div key={label} className="dashboard-skeleton-card" aria-hidden="true">
            <span />
            <strong>{label}</strong>
            <em />
          </div>
        ))}
      </div>
    </>
  );
}

function TrialUpsellBanner({ conta }: { conta: ContaAtualResponse }) {
  return (
    <section className="trial-upsell rounded-md border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 shrink-0 text-amber-700"
            size={22}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Plano Trial com marca d&apos;água
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Você tem {formatTrialConta(conta).toLowerCase()}. Contrate o Plano
              Fundador para remover a marca d&apos;água e liberar a experiência
              comercial completa.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/5531999990000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          Contratar plano
        </a>
      </div>
    </section>
  );
}

function PrimeirosPassosDashboard({
  passos,
}: {
  passos: PassoPrimeirosPassosDashboard[];
}) {
  const passosConcluidos = passos.filter((passo) => passo.concluido).length;
  const passoAtual =
    passos.find((passo) => !passo.concluido) ?? passos[passos.length - 1];

  return (
    <section className="rounded-md border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Primeiros passos</p>
          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
            {passosConcluidos} de {passos.length} etapas concluídas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Complete o mínimo operacional para cadastrar, montar e acompanhar
            uma proposta no MVP.
          </p>
        </div>
        <button
          type="button"
          onClick={passoAtual.onClick}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {passoAtual.concluido ? "Criar nova proposta" : passoAtual.acaoLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {passos.map((passo, index) => (
          <article
            key={passo.id}
            className={`rounded-md border p-4 ${
              passo.concluido
                ? "border-emerald-200 bg-emerald-50"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-muted">
                  Etapa {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-base font-semibold">
                  {passo.titulo}
                </h3>
              </div>
              {passo.concluido ? (
                <CheckCircle2
                  className="shrink-0 text-emerald-600"
                  size={20}
                  aria-hidden="true"
                />
              ) : (
                <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md border border-border px-2 text-xs font-semibold text-muted">
                  {index + 1}
                </span>
              )}
            </div>
            <p className="mt-3 min-h-10 text-sm leading-5 text-muted">
              {passo.detalhe}
            </p>
            <button
              type="button"
              onClick={passo.onClick}
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
            >
              {passo.concluido ? "Revisar" : passo.acaoLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildPrimeirosPassosDashboard({
  perfilContaAtualizado,
  clientesTotal,
  servicosTotal,
  propostasTotal,
  onEditarPerfil,
  onCadastrarCliente,
  onSalvarServico,
  onNovaProposta,
}: {
  perfilContaAtualizado: boolean;
  clientesTotal: number;
  servicosTotal: number;
  propostasTotal: number;
  onEditarPerfil: () => void;
  onCadastrarCliente: () => void;
  onSalvarServico: () => void;
  onNovaProposta: () => void;
}): PassoPrimeirosPassosDashboard[] {
  return [
    {
      id: "perfil",
      titulo: "Perfil da conta",
      detalhe: "Defina marca, contato e cores usados na proposta.",
      concluido: perfilContaAtualizado,
      acaoLabel: "Editar perfil",
      onClick: onEditarPerfil,
    },
    {
      id: "cliente",
      titulo: "Primeiro cliente",
      detalhe: "Cadastre o contato que vai receber a proposta.",
      concluido: clientesTotal > 0,
      acaoLabel: "Cadastrar cliente",
      onClick: onCadastrarCliente,
    },
    {
      id: "servico",
      titulo: "Primeiro serviço",
      detalhe: "Monte um item reutilizável para compor orçamentos.",
      concluido: servicosTotal > 0,
      acaoLabel: "Cadastrar serviço",
      onClick: onSalvarServico,
    },
    {
      id: "proposta",
      titulo: "Primeira proposta",
      detalhe: "Crie o primeiro rascunho e siga o fluxo comercial.",
      concluido: propostasTotal > 0,
      acaoLabel: "Criar proposta",
      onClick: onNovaProposta,
    },
  ];
}

function buildMetricasDashboard(
  propostas: PropostaResponse[],
  servicosTotal: number,
): DashboardMetrica[] {
  const enviadasTotal = contarPropostasPorStatus(propostas, "Enviada");
  const aceitasTotal = contarPropostasPorStatus(propostas, "Aceita");
  const rascunhosTotal = contarPropostasPorStatus(propostas, "Rascunho");

  return [
    {
      label: "Propostas aprovadas",
      value: aceitasTotal.toString(),
      detail: "Fechamentos confirmados",
      icon: Sparkles,
      tone: "purple",
    },
    {
      label: "Serviços salvos",
      value: servicosTotal.toString(),
      detail: "Pacotes reutilizáveis",
      icon: PackageCheck,
      tone: "teal",
    },
    {
      label: "Propostas enviadas",
      value: enviadasTotal.toString(),
      detail: "Aguardando resposta",
      icon: FileText,
      tone: "blue",
    },
    {
      label: "Em rascunho",
      value: rascunhosTotal.toString(),
      detail: "Prontas para finalizar",
      icon: ReceiptText,
      tone: "red",
    },
  ];
}

function AuthContent({
  authMode,
  setAuthMode,
  registerForm,
  loginForm,
  registerMutation,
  loginMutation,
  sessaoMensagem,
}: {
  authMode: AuthMode;
  setAuthMode: (authMode: AuthMode) => void;
  registerForm: ReturnType<typeof useForm<RegisterUsuarioInput>>;
  loginForm: ReturnType<typeof useForm<LoginUsuarioInput>>;
  registerMutation: ReturnType<typeof useMutation<AuthUsuarioResponse, Error, RegisterUsuarioInput>>;
  loginMutation: ReturnType<typeof useMutation<AuthUsuarioResponse, Error, LoginUsuarioInput>>;
  sessaoMensagem: string | null;
}) {
  const isCadastro = authMode === "cadastro";
  const [senhaCadastroVisivel, setSenhaCadastroVisivel] = useState(false);
  const [senhaLoginVisivel, setSenhaLoginVisivel] = useState(false);

  return (
    <section className={`auth-isolated-page auth-motion-surface auth-mode-${authMode}`}>
      <div className="auth-floating-card auth-motion-card">
        <aside className="auth-brand-panel auth-brand-motion" aria-label="Emprely Orçamentos">
          <div className="auth-brand-grid" aria-hidden="true" />

          <div className="auth-brand-top">
            <span className="auth-brand-chip">
              <ShieldCheck size={15} aria-hidden="true" />
              7 dias para testar
            </span>
          </div>

          <div className="auth-brand-mark-group">
            <div className="auth-brand-favicon-card" aria-hidden="true">
              <span className="auth-brand-favicon-glow" />
              <img src={emprelyFaviconSrc} alt="" />
            </div>
            <p className="auth-brand-name-under">Emprely Orçamentos</p>
          </div>

          <div className="auth-brand-copy">
            <h2>Orçamentos em 2 minutos</h2>
            <p>
              Troque mensagens soltas no WhatsApp por propostas profissionais,
              claras e com mais credibilidade.
            </p>
          </div>

          <div className="auth-orcamento-preview" aria-label="Prévia de orçamento">
            <div className="auth-preview-header">
              <span>
                <FileText size={15} aria-hidden="true" />
                Orçamento
              </span>
              <strong>Aguardando aprovação</strong>
            </div>
            <p className="auth-preview-line">Cliente: Ana Martins</p>
            <p className="auth-preview-line">Proposta: Reforma residencial</p>
            <p className="auth-preview-total">Total: R$ 4.750,00</p>
          </div>

          <div className="auth-proof-strip" aria-label="Benefícios do Emprely">
            <span>
              <CheckCircle2 size={14} aria-hidden="true" />
              Clientes organizados
            </span>
            <span>
              <CheckCircle2 size={14} aria-hidden="true" />
              Propostas bonitas
            </span>
          </div>
        </aside>

        <div className="auth-form-panel" data-auth-mode={authMode}>
          <div className="auth-form-header">
            <span className="auth-proof-chip">
              <ShieldCheck size={15} aria-hidden="true" />
              {isCadastro ? "Teste grátis por 7 dias" : "Conexão segura"}
            </span>
            <h1 id="auth-title">
              {isCadastro
                ? "Teste o Emprely antes de escolher seu plano"
                : "Bem-vindo de volta"}
            </h1>
            <p className="auth-form-subtitle">
              {isCadastro
                ? "Crie orçamentos profissionais, organize clientes e veja como o Emprely funciona no seu dia a dia."
                : "Acesse seus orçamentos, clientes e propostas."}
            </p>
          </div>

          <div
            className="auth-mode-tabs"
            data-active={authMode}
            role="tablist"
            aria-label="Modo de acesso"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isCadastro}
              onClick={() => setAuthMode("login")}
              className={!isCadastro ? "is-active" : ""}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isCadastro}
              onClick={() => setAuthMode("cadastro")}
              className={isCadastro ? "is-active" : ""}
            >
              Testar 7 dias
            </button>
          </div>

          {isCadastro ? (
            <form
              key="cadastro"
              className="auth-form-fields auth-form-fields-cadastro"
              onSubmit={registerForm.handleSubmit((input) =>
                registerMutation.mutate(input),
              )}
            >
              <CampoTexto
                label="Nome completo"
                autoComplete="name"
                placeholder="Ana Martins"
                error={registerForm.formState.errors.nome?.message}
                {...registerForm.register("nome")}
              />
              <CampoTexto
                label="E-mail profissional"
                type="email"
                autoComplete="email"
                placeholder="ana@empresa.com.br"
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register("email")}
              />
              <CampoTexto
                label="Telefone"
                type="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                error={registerForm.formState.errors.telefone?.message}
                {...registerForm.register("telefone")}
              />
              <CampoSenhaAuth
                label="Senha"
                autoComplete="new-password"
                helperText="Mínimo de 8 caracteres."
                senhaVisivel={senhaCadastroVisivel}
                onToggleSenhaVisivel={() =>
                  setSenhaCadastroVisivel((visivel) => !visivel)
                }
                error={registerForm.formState.errors.senha?.message}
                {...registerForm.register("senha")}
              />
              <CampoTexto
                label="Nome da empresa"
                autoComplete="organization"
                placeholder="Martins Reformas"
                helperText="Você poderá alterar depois."
                error={registerForm.formState.errors.nomeConta?.message}
                {...registerForm.register("nomeConta")}
              />
              <SubmitButton
                label="Iniciar teste de 7 dias"
                loading={registerMutation.isPending}
              />
              <p className="auth-trial-note">
                Teste por 7 dias. Depois, escolha um plano para continuar.
              </p>
              <p className="auth-legal-copy">
                Ao iniciar o teste, você concorda com os{" "}
                <a href="#termos-de-uso">Termos de uso</a> e a{" "}
                <a href="#politica-de-privacidade">Política de privacidade</a>.
              </p>
              <MensagemErro error={registerMutation.error} />
            </form>
          ) : (
            <form
              key="login"
              className="auth-form-fields auth-form-fields-login"
              onSubmit={loginForm.handleSubmit((input) =>
                loginMutation.mutate(input),
              )}
            >
              <CampoTexto
                label="E-mail"
                type="email"
                autoComplete="email"
                placeholder="seuemail@empresa.com.br"
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register("email")}
              />
              <CampoSenhaAuth
                label="Senha"
                autoComplete="current-password"
                senhaVisivel={senhaLoginVisivel}
                onToggleSenhaVisivel={() =>
                  setSenhaLoginVisivel((visivel) => !visivel)
                }
                error={loginForm.formState.errors.senha?.message}
                {...loginForm.register("senha")}
              />
              <div className="auth-login-actions">
                <a href="mailto:suporte@emprely.com.br?subject=Recuperar%20acesso%20ao%20Emprely">
                  Esqueci minha senha
                </a>
              </div>
              <SubmitButton
                label="Entrar na conta"
                loading={loginMutation.isPending}
              />
              <MensagemErro
                error={loginMutation.error}
                mensagem="Não encontramos uma conta com esses dados."
              />
            </form>
          )}

          <p className="auth-switch-copy">
            {isCadastro ? "Já usa o Emprely?" : "Novo no Emprely?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(isCadastro ? "login" : "cadastro")}
            >
              {isCadastro ? "Entrar" : "Teste por 7 dias"}
            </button>
          </p>

          {sessaoMensagem ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {sessaoMensagem}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function getTemaVisualInicial(): TemaVisual {
  const temaSalvo = window.localStorage.getItem(temaVisualStorageKey);

  return temaSalvo === "dark" ? "dark" : "light";
}

function readSessaoInicialUsuario(): SessaoInicialUsuario {
  const sessaoSalva = readSessaoUsuarioStorage();

  if (sessaoSalva) {
    if (isSessaoUsuarioExpirada(sessaoSalva.expiresAtUtc)) {
      clearSessaoUsuarioStorage();

      return {
        accessToken: null,
        authUsuario: null,
        mensagem: "Sessao expirada. Entre novamente.",
      };
    }

    return {
      accessToken: sessaoSalva.accessToken,
      authUsuario: sessaoSalva,
      mensagem: null,
    };
  }

  const tokenLegado = window.localStorage.getItem(tokenStorageKey);

  if (tokenLegado) {
    return {
      accessToken: tokenLegado,
      authUsuario: null,
      mensagem: null,
    };
  }

  return {
    accessToken: null,
    authUsuario: null,
    mensagem: null,
  };
}

function readSessaoUsuarioStorage(): AuthUsuarioResponse | null {
  const sessaoJson = window.localStorage.getItem(authSessionStorageKey);

  if (!sessaoJson) {
    return null;
  }

  try {
    const sessao = JSON.parse(sessaoJson) as unknown;

    if (isAuthUsuarioResponse(sessao)) {
      return sessao;
    }
  } catch {
    clearSessaoUsuarioStorage();
  }

  return null;
}

function saveSessaoUsuarioStorage(authUsuario: AuthUsuarioResponse) {
  window.localStorage.setItem(
    authSessionStorageKey,
    JSON.stringify(authUsuario),
  );
  window.localStorage.removeItem(tokenStorageKey);
}

function clearSessaoUsuarioStorage() {
  window.localStorage.removeItem(authSessionStorageKey);
  window.localStorage.removeItem(tokenStorageKey);
}

function isSessaoUsuarioExpirada(expiresAtUtc: string): boolean {
  const expiresAt = new Date(expiresAtUtc).getTime();

  return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
}

function isAuthUsuarioResponse(value: unknown): value is AuthUsuarioResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const sessao = value as Partial<AuthUsuarioResponse>;

  return (
    typeof sessao.accessToken === "string" &&
    sessao.accessToken.length > 0 &&
    typeof sessao.expiresAtUtc === "string" &&
    Boolean(sessao.usuario) &&
    typeof sessao.usuario?.id === "string" &&
    typeof sessao.usuario?.nome === "string" &&
    typeof sessao.usuario?.email === "string" &&
    Boolean(sessao.conta) &&
    typeof sessao.conta?.id === "string" &&
    typeof sessao.conta?.nome === "string"
  );
}

function mapPerfilContaForm(
  perfilConta: PerfilContaResponse,
  usuario?: UsuarioAtualResponse,
): PerfilContaFormInput {
  return {
    nomeComercial: perfilConta.nomeComercial,
    emailContato: perfilConta.emailContato ?? usuario?.email ?? "",
    telefoneContato: perfilConta.telefoneContato ?? "",
    siteUrl: perfilConta.siteUrl ?? "",
    instagram: perfilConta.instagram ?? "",
    documento: perfilConta.documento ?? "",
    corPrimaria: perfilConta.corPrimaria,
    corSecundaria: perfilConta.corSecundaria,
    corSistemaPrimaria:
      perfilConta.corSistemaPrimaria ?? perfilContaDefaultValues.corSistemaPrimaria,
    corSistemaSecundaria:
      perfilConta.corSistemaSecundaria ??
      perfilContaDefaultValues.corSistemaSecundaria,
    logoUrl: perfilConta.logoUrl ?? "",
    templateVisualPadrao: normalizarTemplateVisual(perfilConta.templateVisualPadrao),
  };
}

function buildSenhaUsuarioPayload(
  input: SenhaUsuarioFormInput,
): ChangeSenhaUsuarioInput {
  return {
    senhaAtual: input.senhaAtual,
    novaSenha: input.novaSenha,
    confirmarNovaSenha: input.confirmarNovaSenha,
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
    corSistemaPrimaria: normalizarHexPreview(input.corSistemaPrimaria),
    corSistemaSecundaria: normalizarHexPreview(input.corSistemaSecundaria),
    logoUrl: normalizarOpcional(input.logoUrl),
    templateVisualPadrao: normalizarTemplateVisual(input.templateVisualPadrao),
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

function buildClienteRapidoPayload(input: ClienteRapidoFormInput): CreateClienteInput {
  return {
    nome: input.nome.trim(),
    email: normalizarOpcional(input.email),
    telefone: normalizarOpcional(input.telefone),
    documento: null,
    observacoes: null,
  };
}

function buildTituloAutomaticoProposta(
  cliente: ClienteResponse | undefined,
  nomeServico: string | null | undefined,
): string {
  const nomeCliente = cliente?.nome.trim();
  const servico = nomeServico?.trim();
  let titulo = "";

  if (nomeCliente && servico) {
    titulo = `Proposta de ${servico} para ${nomeCliente}`;
  } else if (nomeCliente) {
    titulo = `Proposta para ${nomeCliente}`;
  } else if (servico) {
    titulo = `Proposta de ${servico}`;
  }

  return titulo.slice(0, 160);
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
    templateVisual: normalizarTemplateVisual(proposta.templateVisual),
    descontoValor: proposta.descontoValor,
    condicoesPagamento: proposta.condicoesPagamento ?? "",
    itensInclusosTexto: joinLinhasFormulario(proposta.itensInclusos),
    itensNaoInclusosTexto: joinLinhasFormulario(proposta.itensNaoInclusos),
    cronogramaTexto: joinLinhasFormulario(proposta.cronograma),
    beneficiosTexto: joinLinhasFormulario(proposta.beneficios),
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
    templateVisual: normalizarTemplateVisual(input.templateVisual),
    descontoValor: valorSeguro(input.descontoValor),
    condicoesPagamento: normalizarOpcional(input.condicoesPagamento),
    itensInclusos: normalizarListaOpcional(input.itensInclusosTexto),
    itensNaoInclusos: normalizarListaOpcional(input.itensNaoInclusosTexto),
    cronograma: normalizarListaOpcional(input.cronogramaTexto),
    beneficios: normalizarListaOpcional(input.beneficiosTexto),
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

function calcularTotalProposta(subtotal: number, desconto: number): number {
  return Math.max(0, valorSeguro(subtotal) - valorSeguro(desconto));
}

function contarPropostasPorStatus(
  propostas: PropostaResponse[],
  status: PropostaStatus,
): number {
  return propostas.filter((proposta) => proposta.status === status).length;
}

function valorSeguro(valor: number | undefined): number {
  return Number.isFinite(valor) ? valor ?? 0 : 0;
}

function normalizarTemplateVisual(
  valor: string | null | undefined,
): PropostaTemplateVisualAtivo {
  if (valor === "PadraoEnxuto") {
    return "ComercialMinimalista";
  }

  const template = propostaTemplateVisualValores.find((opcao) => opcao === valor);
  return template ?? propostaTemplateVisualDefault;
}

function getPropostaTemplateLabel(templateVisual: PropostaTemplateVisual): string {
  const templateVisualNormalizado = normalizarTemplateVisual(templateVisual);

  return (
    propostaTemplateVisualOpcoes.find((template) => template.value === templateVisualNormalizado)
      ?.label ?? "Comercial minimalista"
  );
}

function isTemplateCoresEstaticas(templateVisual: PropostaTemplateVisual): boolean {
  const templateVisualNormalizado = normalizarTemplateVisual(templateVisual);

  return Boolean(
    propostaTemplateVisualOpcoes.find(
      (template) => template.value === templateVisualNormalizado,
    )?.coresEstaticas,
  );
}

function getTemplateCssClass(templateVisual: PropostaTemplateVisual): string {
  const classes: Record<(typeof propostaTemplateVisualValores)[number], string> = {
    ComercialMinimalista: "proposal-template--comercial-minimalista",
    OrcamentoSimplificado: "proposal-template--orcamento-simplificado",
    PropostaCompleta: "proposal-template--proposta-completa",
    LunaSocialStudio: "proposal-template--luna-social-studio",
    DarkGrowth: "proposal-template--dark-growth",
    InstagramPremium: "proposal-template--instagram-premium",
    Claymorphism: "proposal-template--claymorphism",
    Emprely: "proposal-template--emprely",
    ExecutivoEditorial: "proposal-template--executivo-editorial",
    CorporativoBoard: "proposal-template--corporativo-board",
    InstitucionalClean: "proposal-template--institucional-clean",
  };

  return classes[normalizarTemplateVisual(templateVisual)];
}

function inferirTipoProposta(
  proposta: PropostaPreviewInput,
  itens: PropostaPreviewInput["itens"],
): string {
  const texto = [
    proposta.titulo,
    proposta.introducao,
    ...(itens ?? []).flatMap((item) => [item.nome, item.descricao]),
  ]
    .join(" ")
    .toLowerCase();

  if (/(instagram|social|reels|stories|post|conteudo|conteúdo|feed)/i.test(texto)) {
    return "Social Media";
  }

  return "";
}

function normalizarInstagramDocumento(valor: string | null | undefined): string {
  const instagram = valor?.trim();

  if (!instagram) {
    return "";
  }

  return instagram.startsWith("@") ? instagram : `@${instagram}`;
}

function splitLinhasFormulario(valor: string | null | undefined): string[] {
  return (valor ?? "")
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean);
}

function joinLinhasFormulario(valores: string[] | null | undefined): string {
  return valores?.join("\n") ?? "";
}

function normalizarListaOpcional(valor: string | null | undefined): string[] | null {
  const linhas = splitLinhasFormulario(valor);
  return linhas.length > 0 ? linhas : null;
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
    return "";
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

function buildNomeArquivoProposta(proposta: PropostaResponse): string {
  return `orcamento-${proposta.numero.toString().padStart(4, "0")}-${slugifyArquivo(
    proposta.clienteNome || proposta.titulo,
  )}`;
}

function baixarBlobArquivo(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function carregarTamanhoImagem(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = reject;
    image.src = src;
  });
}

function slugifyArquivo(valor: string): string {
  const slug = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "proposta";
}

function buildWhatsappContatoClienteUrl(
  cliente:
    | {
        nome?: string | null;
        telefone?: string | null;
      }
    | null
    | undefined,
): string {
  const telefone = normalizarTelefoneWhatsapp(cliente?.telefone);

  if (!telefone) {
    return "";
  }

  const nomeCliente = cliente?.nome?.trim();
  const mensagem = nomeCliente
    ? `Ola, ${nomeCliente}! Tudo bem?`
    : "Ola! Tudo bem?";

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

function buildWhatsappPropostaUrl(
  proposta: PropostaResponse,
  cliente: ClienteResponse | undefined,
  perfilConta: PerfilContaResponse | undefined,
  contaNome: string,
): string {
  const telefone = normalizarTelefoneWhatsapp(cliente?.telefone);
  const mensagem = buildMensagemWhatsappProposta(
    proposta,
    cliente,
    perfilConta,
    contaNome,
  );
  const textQuery = `text=${encodeURIComponent(mensagem)}`;

  return telefone
    ? `https://wa.me/${telefone}?${textQuery}`
    : `https://wa.me/?${textQuery}`;
}

function buildMensagemWhatsappProposta(
  proposta: PropostaResponse,
  cliente: ClienteResponse | undefined,
  perfilConta: PerfilContaResponse | undefined,
  contaNome: string,
): string {
  const nomeCliente = cliente?.nome ?? proposta.clienteNome;
  const nomeMarca = perfilConta?.nomeComercial?.trim() || contaNome;
  const numeroProposta = formatNumeroProposta(proposta.numero);
  const linhas = [
    `Ola, ${nomeCliente}.`,
    "",
    `Estou enviando abaixo o orçamento detalhado ${numeroProposta} - "${proposta.titulo}" no valor de ${formatMoney(
      proposta.total,
    )}.`,
    "Anexei o PDF ou a imagem do orçamento nesta conversa.",
  ];

  linhas.push("", `Enviado por ${nomeMarca}.`);

  return linhas.join("\n");
}

function normalizarTelefoneWhatsapp(
  telefone: string | null | undefined,
): string {
  if (!isTelefoneWhatsappValido(telefone)) {
    return "";
  }

  const digitos = telefone?.replace(/\D/g, "") ?? "";

  if (digitos.length === 0) {
    return "";
  }

  if (digitos.startsWith("55")) {
    return digitos;
  }

  if (digitos.length >= 10 && digitos.length <= 11) {
    return `55${digitos}`;
  }

  return "";
}

function isTelefoneWhatsappValido(telefone: string | null | undefined): boolean {
  const telefoneNormalizado = telefone?.trim() ?? "";

  if (telefoneNormalizado.length === 0) {
    return true;
  }

  if (
    telefoneNormalizado.startsWith("+") &&
    !telefoneNormalizado.startsWith("+55")
  ) {
    return false;
  }

  const digitos = telefoneNormalizado.replace(/\D/g, "");

  if (digitos.startsWith("55")) {
    return digitos.length === 12 || digitos.length === 13;
  }

  return digitos.length === 10 || digitos.length === 11;
}

function normalizarOpcional(valor: string): string | null {
  const valorNormalizado = valor.trim();
  return valorNormalizado.length > 0 ? valorNormalizado : null;
}

function formatNumeroProposta(numero: number): string {
  return `#${numero.toString().padStart(4, "0")}`;
}

function matchBuscaTexto(
  busca: string,
  valores: Array<string | number | null | undefined>,
): boolean {
  const buscaNormalizada = normalizarBuscaTexto(busca);

  if (!buscaNormalizada) {
    return true;
  }

  return valores.some((valor) =>
    normalizarBuscaTexto(valor).includes(buscaNormalizada),
  );
}

function paginarLista<T>(
  itens: T[],
  pagina: number,
  tamanhoPagina: number,
): PaginacaoListaResultado<T> {
  const tamanhoSeguro = tamanhosPaginaListagem.includes(tamanhoPagina)
    ? tamanhoPagina
    : tamanhosPaginaListagem[1];
  const totalItens = itens.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / tamanhoSeguro));
  const paginaAtual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicioIndice = (paginaAtual - 1) * tamanhoSeguro;
  const itensPagina = itens.slice(inicioIndice, inicioIndice + tamanhoSeguro);

  return {
    itens: itensPagina,
    paginaAtual,
    totalPaginas,
    totalItens,
    inicio: totalItens === 0 ? 0 : inicioIndice + 1,
    fim: Math.min(totalItens, inicioIndice + itensPagina.length),
  };
}

function normalizarBuscaTexto(valor: string | number | null | undefined): string {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatMoney(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function hasDescontoDocumento(d: PropostaDocumentoDados): boolean {
  return Math.abs(d.desconto) >= 0.01;
}

function formatUnidadeServico(unidade: UnidadeServico): string {
  const labels: Record<UnidadeServico, string> = {
    Unico: "único",
    Mensal: "mensal",
    PorHora: "hora",
    PorItem: "item",
  };

  return labels[unidade];
}

function formatTipoServico(tipo: TipoServico): string {
  return tipo === "Servico" ? "Serviço" : "Pacote";
}

function getStatusPropostaClass(status: PropostaStatus): string {
  const classes: Record<PropostaStatus, string> = {
    Rascunho: "bg-slate-100 text-muted",
    Gerada: "bg-emerald-50 text-emerald-700",
    Enviada: "bg-blue-50 text-blue-700",
    Aceita: "bg-teal-50 text-teal-700",
    Recusada: "bg-red-50 text-red-700",
    Arquivada: "bg-slate-200 text-slate-600",
  };

  return classes[status];
}

function normalizarHexPreview(valor: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(valor) ? valor.toUpperCase() : "#000000";
}

function formatDataPerfil(perfilConta: PerfilContaResponse | undefined): string {
  if (!perfilConta?.updatedAt) {
    return "Não salvo";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(perfilConta.updatedAt));
}

function canExportPropostaConta(conta: ContaAtualResponse): boolean {
  return conta.plano === "Fundador" || conta.statusComercial !== "TrialExpirado";
}

function getMensagemBloqueioPlano(
  conta: ContaAtualResponse | undefined,
): string {
  if (!conta || canExportPropostaConta(conta)) {
    return "";
  }

  return "Trial expirado. Solicite a ativacao do Plano Fundador para gerar, imprimir ou compartilhar propostas.";
}

function formatPlanoConta(conta: ContaAtualResponse): string {
  return conta.plano === "Fundador" ? "Fundador" : "Trial";
}

function formatStatusComercialConta(conta: ContaAtualResponse): string {
  const labels: Record<string, string> = {
    TrialAtivo: "Trial ativo",
    TrialExpirado: "Trial expirado",
    FundadorAtivo: "Fundador ativo",
  };

  return labels[conta.statusComercial] ?? "Trial ativo";
}

function formatTrialConta(conta: ContaAtualResponse): string {
  if (conta.plano === "Fundador") {
    return "Plano ativo";
  }

  if (conta.statusComercial === "TrialExpirado") {
    return `Expirado em ${formatDataConta(conta.trialEndsAt)}`;
  }

  const diasRestantes = Math.max(0, conta.trialDiasRestantes ?? 0);

  return `${diasRestantes} dia${diasRestantes === 1 ? "" : "s"} restante${
    diasRestantes === 1 ? "" : "s"
  } ate ${formatDataConta(conta.trialEndsAt)}`;
}

function formatDataConta(data: string | null | undefined): string {
  if (!data) {
    return "Não informado";
  }

  const dataConta = new Date(data);

  if (Number.isNaN(dataConta.getTime())) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dataConta);
}

function formatDataCurta(data: string | null | undefined): string {
  if (!data) {
    return "Não informado";
  }

  const dataConta = new Date(data);

  if (Number.isNaN(dataConta.getTime())) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(dataConta);
}

function isUrlValida(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLogoUrlPerfilValida(valor: string): boolean {
  const logoUrl = valor.trim();

  if (logoUrl.length === 0) {
    return true;
  }

  if (logoUrl.startsWith("data:")) {
    return false;
  }

  return logoUrl.startsWith("/uploads/account-logos/") || isUrlValida(logoUrl);
}

function formatarTamanhoArquivo(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

async function buildLogoSugestaoPerfil(
  arquivo: File,
  previewUrl: string,
): Promise<LogoSugestaoPerfil> {
  if (!arquivo.type.startsWith("image/")) {
    throw new Error("Anexe um arquivo de imagem para usar como logomarca.");
  }

  const dataUrlOriginal = await readArquivoComoDataUrl(arquivo);
  const imagem = await carregarImagemDataUrl(dataUrlOriginal);
  const canvas = document.createElement("canvas");
  const contexto = canvas.getContext("2d");

  if (!contexto) {
    throw new Error("Não foi possível processar a imagem no navegador.");
  }

  const larguraOriginal = imagem.naturalWidth || imagem.width;
  const alturaOriginal = imagem.naturalHeight || imagem.height;
  const escala = Math.min(1, 512 / Math.max(larguraOriginal, alturaOriginal));
  canvas.width = Math.max(1, Math.round(larguraOriginal * escala));
  canvas.height = Math.max(1, Math.round(alturaOriginal * escala));
  contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);

  const cores = extrairCoresPrincipaisImagem(contexto, canvas.width, canvas.height);

  return {
    nomeArquivo: arquivo.name,
    previewUrl,
    corPrimaria: cores[0] ?? "#6E38FF",
    corSecundaria: cores[1] ?? "#13C7BD",
  };
}

function readArquivoComoDataUrl(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(arquivo);
  });
}

function carregarImagemDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () =>
      reject(new Error("Não foi possível carregar a logomarca."));
    imagem.src = dataUrl;
  });
}

function extrairCoresPrincipaisImagem(
  contexto: CanvasRenderingContext2D,
  largura: number,
  altura: number,
): string[] {
  const amostras = contexto.getImageData(0, 0, largura, altura).data;
  const mapaCores = new Map<string, number>();
  const salto = Math.max(4, Math.floor((largura * altura) / 4500) * 4);

  for (let index = 0; index < amostras.length; index += salto) {
    const red = amostras[index] ?? 0;
    const green = amostras[index + 1] ?? 0;
    const blue = amostras[index + 2] ?? 0;
    const alpha = amostras[index + 3] ?? 0;
    const luminosidade = (red + green + blue) / 3;

    if (alpha < 180 || luminosidade < 24 || luminosidade > 238) {
      continue;
    }

    const chave = [
      Math.round(red / 24) * 24,
      Math.round(green / 24) * 24,
      Math.round(blue / 24) * 24,
    ].join(",");
    mapaCores.set(chave, (mapaCores.get(chave) ?? 0) + 1);
  }

  const coresOrdenadas = [...mapaCores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([chave]) => {
      const [red, green, blue] = chave.split(",").map(Number);
      return rgbToHex(red ?? 0, green ?? 0, blue ?? 0);
    });

  const corPrimaria = coresOrdenadas[0] ?? "#6E38FF";
  const corSecundaria =
    coresOrdenadas.find((cor) => distanciaCoresHex(cor, corPrimaria) > 70) ??
    "#13C7BD";

  return [corPrimaria, corSecundaria];
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((valor) =>
      Math.max(0, Math.min(255, valor)).toString(16).padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function distanciaCoresHex(corA: string, corB: string): number {
  const [aRed, aGreen, aBlue] = hexParaRgb(corA);
  const [bRed, bGreen, bBlue] = hexParaRgb(corB);

  return Math.sqrt(
    (aRed - bRed) ** 2 + (aGreen - bGreen) ** 2 + (aBlue - bBlue) ** 2,
  );
}

function hexParaRgb(cor: string): [number, number, number] {
  return [
    Number.parseInt(cor.slice(1, 3), 16),
    Number.parseInt(cor.slice(3, 5), 16),
    Number.parseInt(cor.slice(5, 7), 16),
  ];
}
