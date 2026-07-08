import {
  AlertTriangle,
  ArrowRight,
  AtSign,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleMinus,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Globe2,
  GripVertical,
  HeartHandshake,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  PackageCheck,
  Palette,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Phone,
  Plus,
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
  type ClipboardEvent as ReactClipboardEvent,
  type CSSProperties,
  type DragEvent,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  type SelectHTMLAttributes,
  type SVGProps,
  type TextareaHTMLAttributes,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { Joyride, type EventData, type Step } from "react-joyride";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type UseFormRegisterReturn,
  type UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import type {
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import {
  createCliente,
  createBillingCheckout,
  createPublicBillingCheckout,
  createContatoPublico,
  changeEmailUsuario,
  cancelBilling,
  confirmChangeEmailUsuario,
  confirmEmailUsuario,
  createServico,
  createSuporteSolicitacao,
  deleteCliente,
  deleteServico,
  forgotSenhaUsuario,
  getClientesConta,
  getBillingPlans,
  getPublicBillingPaymentLink,
  getBillingStatus,
  getOnboarding,
  getPerfilContaAtual,
  getServicosConta,
  getUsuarioAtual,
  loginUsuario,
  registerUsuario,
  requestPublicBillingPaymentLink,
  resendConfirmacaoEmail,
  resetSenhaUsuario,
  resolveApiAssetUrl,
  updateCliente,
  updateOnboarding,
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
  createOnboardingEvento,
} from "@/lib/api";
import type {
  AuthUsuarioResponse,
  ChangeEmailUsuarioInput,
  ContaAtualResponse,
  EmailUsuarioInput,
  LoginUsuarioInput,
  RegisterUsuarioInput,
  RegisterUsuarioResponse,
  ResetSenhaUsuarioInput,
  UsuarioAtualResponse,
} from "@/types/auth";
import type {
  ContatoPublicoResponse,
  CreateContatoPublicoInput,
  CreateSuporteSolicitacaoInput,
} from "@/types/support";
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
import type { OnboardingResponse } from "@/types/onboarding";
import type {
  BillingPagadorInput,
  BillingPlanoResponse,
  BillingStatusResponse,
  CreateBillingCheckoutInput,
  PublicBillingPaymentLinkResponse,
} from "@/types/billing";

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

const contatoEmprely = {
  email: "contato@emprely.com.br",
  whatsappDisplay: "+55 (35) 99738-9755",
  whatsappNumero: "5535997389755",
} as const;

function buildWhatsappEmprelyUrl(mensagem: string): string {
  return `https://wa.me/${contatoEmprely.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

const whatsappEmprelySuporteUrl = buildWhatsappEmprelyUrl(
  "Olá, quero falar com a Emprely sobre suporte, planos ou ativação da minha conta.",
);

type PropostaTemplateVisualAtivo = (typeof propostaTemplateVisualValores)[number];
const formatoArquivoPreferidoValores = ["Pdf", "Imagem", "PdfImagem"] as const;
type FormatoArquivoPreferido = (typeof formatoArquivoPreferidoValores)[number];
const formatoArquivoPreferidoDefault: FormatoArquivoPreferido = "Pdf";
const onboardingTourScrollDelayMs = 140;
const telefoneDigitosFixoNacionais = 10;
const telefoneDigitosCelularNacionais = 11;
const telefoneDigitosMaximosNacionais = telefoneDigitosCelularNacionais;
const telefoneMascaraMaxLength = "(00) 00000-0000".length;
const telefoneMensagemFormato =
  "Informe DDD e número no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.";
const telefoneInputRegisterOptions = {
  setValueAs: (valor: unknown) =>
    typeof valor === "string" ? formatTelefoneCampo(valor) : valor,
};
const cpfDigitos = 11;
const cnpjDigitos = 14;
const cpfCnpjMascaraMaxLength = "00.000.000/0000-00".length;
const cpfCnpjMensagemFormato =
  "Informe CPF no formato 000.000.000-00 ou CNPJ no formato 00.000.000/0000-00.";
const cpfCnpjInputRegisterOptions = {
  setValueAs: (valor: unknown) =>
    typeof valor === "string" ? formatCpfCnpjCampo(valor) : valor,
};
const mensagemPropostaNaoEditavel =
  "Esta proposta não pode mais ser editada. Duplique para criar uma nova versão.";

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
    label: "Orçamento essencial",
    detalhe: "Escopo, valores, prazos e próximos passos em leitura rápida.",
  },
  {
    value: "OrcamentoSimplificado",
    label: "Resumo comercial",
    detalhe: "Apresentação objetiva com itens, valores, condições e aceite.",
  },
  {
    value: "PropostaCompleta",
    label: "Proposta comercial completa",
    detalhe: "Documento modular com escopo, entregas, investimento, termos e aceite.",
  },
  {
    value: "LunaSocialStudio",
    label: "Plano recorrente",
    detalhe: "Proposta para serviços contínuos com rotina, entregas e acompanhamento.",
  },
  {
    value: "DarkGrowth",
    label: "Plano estratégico",
    detalhe: "Escopo com etapas, indicadores, acompanhamento e resultado esperado.",
  },
  {
    value: "InstagramPremium",
    label: "Pacote premium",
    detalhe: "Entrega visual com benefícios, escopo, condições e investimento.",
  },
  {
    value: "Claymorphism",
    label: "Claymorphism",
    detalhe: "Template legado fora da curadoria atual.",
  },
  {
    value: "Emprely",
    label: "Emprely",
    detalhe: "Template legado fora da curadoria atual.",
  },
  {
    value: "ExecutivoEditorial",
    label: "Executivo editorial",
    detalhe: "Proposta consultiva e objetiva para decisões comerciais.",
    coresEstaticas: true,
  },
  {
    value: "CorporativoBoard",
    label: "Board comercial",
    detalhe: "Visão executiva com frentes, roadmap, indicadores e recorrência.",
    coresEstaticas: true,
  },
  {
    value: "InstitucionalClean",
    label: "Institucional clean",
    detalhe: "Documento limpo para escopo, entregáveis, revisões e direitos.",
    coresEstaticas: true,
  },
];

const propostaTemplateVisualOpcoesGaleria: Array<{
  value: PropostaTemplateVisualAtivo;
  label: string;
  detalhe: string;
  coresEstaticas?: boolean;
}> = [
  {
    value: "ComercialMinimalista",
    label: "Orçamento essencial",
    detalhe: "Preço, escopo, prazo e aceite em uma proposta direta.",
  },
  {
    value: "OrcamentoSimplificado",
    label: "Resumo comercial",
    detalhe: "Escopo, itens, valores, condições e aceite em uma leitura rápida.",
  },
  {
    value: "PropostaCompleta",
    label: "Proposta comercial completa",
    detalhe: "Documento comercial com escopo, valor, condições, termos e aceite.",
  },
  {
    value: "LunaSocialStudio",
    label: "Plano recorrente",
    detalhe: "Serviços contínuos, rotina de entrega, revisões e acompanhamento.",
  },
  {
    value: "InstagramPremium",
    label: "Pacote premium",
    detalhe: "Proposta visual para escopo, benefícios, entregas e condições.",
  },
  {
    value: "DarkGrowth",
    label: "Plano estratégico",
    detalhe: "Etapas, indicadores, responsabilidades, acompanhamento e resultados.",
  },
  {
    value: "InstitucionalClean",
    label: "Institucional clean",
    detalhe: "Documento limpo para entregáveis, revisões, arquivos e direitos.",
    coresEstaticas: true,
  },
  {
    value: "ExecutivoEditorial",
    label: "Executivo editorial",
    detalhe: "Leitura executiva com escopo, entregáveis, condições e próximos passos.",
    coresEstaticas: true,
  },
  {
    value: "CorporativoBoard",
    label: "Board comercial",
    detalhe: "Resumo visual com frentes, roadmap, indicadores e cadência.",
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
    .max(telefoneMascaraMaxLength)
    .refine((valor) => isTelefoneWhatsappValido(valor), telefoneMensagemFormato),
  nomeConta: z.string().trim().min(1, "Este campo é obrigatório."),
});

const loginSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
  senha: z.string().min(1, "Este campo é obrigatório."),
});

const emailUsuarioSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
});

const resetSenhaSchema = z.object({
  usuarioId: z.string().min(1),
  token: z.string().min(1),
  novaSenha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  confirmarNovaSenha: z.string().min(1, "Confirme a nova senha."),
}).refine((input) => input.novaSenha === input.confirmarNovaSenha, {
  message: "A confirmação precisa ser igual à nova senha.",
  path: ["confirmarNovaSenha"],
});

const changeEmailSchema = z.object({
  novoEmail: z.string().trim().email("Digite um e-mail válido."),
});

const suporteSchema = z.object({
  assunto: z.string().trim().min(3, "Informe o assunto.").max(120),
  mensagem: z.string().trim().min(10, "Descreva melhor o problema.").max(4000),
});

const contatoPublicoSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(120),
  email: z.string().trim().email("Digite um e-mail válido.").max(200),
  telefone: z
    .string()
    .trim()
    .max(telefoneMascaraMaxLength)
    .refine((valor) => valor.length === 0 || isTelefoneWhatsappValido(valor), telefoneMensagemFormato),
  empresa: z.string().trim().max(120),
  interesse: z.enum(["duvida", "compra", "plano-fundador", "suporte", "outro"]),
  mensagem: z.string().trim().min(10, "Escreva uma mensagem com mais detalhes.").max(2000),
});

const billingPagadorSchema = z.object({
  tipoPessoa: z.enum(["Fisica", "Juridica"]),
  nome: z.string().trim().min(2, "Informe o nome ou razao social.").max(160),
  cpfCnpj: z
    .string()
    .min(1, "Informe o CPF ou CNPJ.")
    .max(cpfCnpjMascaraMaxLength)
    .refine((valor) => isCpfCnpjCampoValido(valor), cpfCnpjMensagemFormato),
}).superRefine((input, context) => {
  const digitos = extrairDigitosCpfCnpj(input.cpfCnpj);
  if (input.tipoPessoa === "Fisica" && digitos.length !== cpfDigitos) {
    context.addIssue({
      code: "custom",
      path: ["cpfCnpj"],
      message: "Informe um CPF valido.",
    });
  }

  if (input.tipoPessoa === "Juridica" && digitos.length !== cnpjDigitos) {
    context.addIssue({
      code: "custom",
      path: ["cpfCnpj"],
      message: "Informe um CNPJ valido.",
    });
  }
});

const perfilContaSchema = z.object({
  nomeComercial: z.string().min(2, "Informe o nome comercial.").max(160),
  emailContato: z
    .string()
    .max(256)
    .refine(
      (valor) => valor.length === 0 || z.email().safeParse(valor).success,
      "Informe um e-mail válido.",
    ),
  telefoneContato: z
    .string()
    .max(telefoneMascaraMaxLength)
    .refine((valor) => isTelefoneWhatsappValido(valor), telefoneMensagemFormato),
  siteUrl: z
    .string()
    .max(300)
    .refine(
      (valor) => valor.length === 0 || isUrlValida(valor),
      "Informe uma URL válida.",
    ),
  instagram: z.string().max(80),
  documento: z
    .string()
    .max(cpfCnpjMascaraMaxLength)
    .refine((valor) => isCpfCnpjCampoValido(valor), cpfCnpjMensagemFormato),
  segmento: z.string().trim().max(80),
  cidadeUf: z.string().trim().max(120),
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
      "Envie a imagem pelo upload ou use uma URL válida.",
    ),
  templateVisualPadrao: z.enum(propostaTemplateVisualValores),
  formatoArquivoPreferido: z.enum(formatoArquivoPreferidoValores),
});

const clienteSchema = z.object({
  nome: z.string().min(2, "Informe o nome do cliente.").max(160),
  email: z
    .string()
    .max(256)
    .refine(
      (valor) => valor.length === 0 || z.email().safeParse(valor).success,
      "Informe um e-mail válido.",
    ),
  telefone: z
    .string()
    .max(telefoneMascaraMaxLength)
    .refine((valor) => isTelefoneWhatsappValido(valor), telefoneMensagemFormato),
  documento: z
    .string()
    .max(cpfCnpjMascaraMaxLength)
    .refine((valor) => isCpfCnpjCampoValido(valor), cpfCnpjMensagemFormato),
  endereco: z.string().max(200),
  numero: z.string().max(30),
  cidade: z.string().max(120),
  instagram: z.string().max(160),
  facebook: z.string().max(160),
  tiktok: z.string().max(160),
  observacoes: z.string().max(1000),
});

const clienteRapidoSchema = clienteSchema;

const servicoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do serviço.").max(160),
  descricao: z.string().max(1000),
  categoria: z.string().max(80),
  preco: z
    .number()
    .min(0, "Informe um preço maior ou igual a zero.")
    .max(9999999999.99, "Informe um preço menor."),
  unidade: z.enum(["Unico", "Mensal", "Semanal", "Diario", "PorHora", "PorItem"]),
  tipo: z.enum(["Servico", "Pacote"]),
});

const propostaItemSchema = z.object({
  servicoId: z.string(),
  nome: z.string().min(2, "Informe o nome do item.").max(160),
  descricao: z.string().max(1000),
  quantidade: z
    .number()
    .int("Informe uma quantidade inteira.")
    .min(1, "Informe uma quantidade maior que zero.")
    .max(9999999999, "Informe uma quantidade menor."),
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
    .min(0, "O desconto não pode ser negativo.")
    .max(999999999, "Informe um desconto menor."),
  condicoesPagamento: z.string().max(1000),
  itensInclusosTexto: z.string().max(4000),
  itensNaoInclusosTexto: z.string().max(4000),
  cronogramaTexto: z.string().max(4000),
  beneficiosTexto: z.string().max(4000),
}).refine(
  (input) => input.descontoValor <= calcularTotalItens(input.itens),
  {
    message: "O desconto não pode ser maior que o subtotal.",
    path: ["descontoValor"],
  },
);

type AuthMode =
  | "cadastro"
  | "login"
  | "confirmacao-pendente"
  | "confirmar-email"
  | "recuperar-senha"
  | "redefinir-senha"
  | "confirmar-alteracao-email";
type AppView =
  | "dashboard"
  | "clientes"
  | "servicos"
  | "propostas"
  | "billing"
  | "conta"
  | "personalizacao"
  | "suporte";
type CrudModo = "lista" | "novo" | "editar" | "visualizar" | "assistente";
type PropostaAssistenteEtapa = "inicio" | "existente" | "novo";
type PropostaWizardEtapaId =
  | "cliente"
  | "proposta"
  | "itens"
  | "template"
  | "detalhamento"
  | "revisao";
type PerfilContaFormInput = z.infer<typeof perfilContaSchema>;
type ClienteFormInput = z.infer<typeof clienteSchema>;
type ClienteRapidoFormInput = ClienteFormInput;
type ServicoFormInput = z.infer<typeof servicoSchema>;
type PropostaFormInput = z.infer<typeof propostaSchema>;
type EmailUsuarioFormInput = z.infer<typeof emailUsuarioSchema>;
type ResetSenhaUsuarioFormInput = z.infer<typeof resetSenhaSchema>;
type ChangeEmailUsuarioFormInput = z.infer<typeof changeEmailSchema>;
type SuporteFormInput = z.infer<typeof suporteSchema>;
type ContatoPublicoFormInput = z.infer<typeof contatoPublicoSchema>;
type BillingPagadorFormInput = z.infer<typeof billingPagadorSchema>;
type PropostaPreviewInput = Partial<Omit<PropostaFormInput, "itens">> & {
  itens?: Array<Partial<PropostaFormInput["itens"][number]>>;
  publicApprovalUrl?: string;
};
type TemaVisual = "light" | "dark";
type FiltroStatusProposta = "Todas" | PropostaStatus;
type DashboardMetrica = {
  label: string;
  value: string;
  icon: typeof BarChart3;
  tone: "purple" | "teal" | "blue" | "red" | "green" | "amber" | "slate";
  onClick: () => void;
};
type PassoPrimeirosPassosDashboard = {
  id: string;
  titulo: string;
  detalhe: string;
  concluido: boolean;
  acaoLabel: string;
  onClick: () => void;
};
type PropostaWizardStepItem = {
  id: PropostaWizardEtapaId;
  label: string;
  concluido: boolean;
  bloqueado?: boolean;
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

type AppNavigationSnapshot = {
  appView: AppView;
  clienteModo: CrudModo;
  clienteSelecionadoId: string | null;
  servicoModo: CrudModo;
  servicoSelecionadoId: string | null;
  propostaModo: CrudModo;
  propostaSelecionadaId: string | null;
  propostaAssistenteEtapa: PropostaAssistenteEtapa;
  propostaWizardEtapaAtiva: PropostaWizardEtapaId;
};

type AppReturnIntent = {
  label: string;
  snapshot: AppNavigationSnapshot;
};

const emprelyFaviconSrc = "/brand/emprely-favicon.svg";
const emprelyLogoMarcaDaguaSrc = "/brand/emprely-logo-watermark-black.png";
const logoArquivoTamanhoMaximoBytes = 2 * 1024 * 1024;
const logoArquivoTamanhoMaximoLabel = "2 MB";
const logoArquivoTiposPermitidos = ["image/png", "image/jpeg", "image/webp"];
const imagemTransparenteExportacaoDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const tamanhosPaginaListagem = [5, 10, 20, 50];
const propostaWizardEtapasOrdem: PropostaWizardEtapaId[] = [
  "cliente",
  "proposta",
  "itens",
  "template",
  "detalhamento",
  "revisao",
];

type NavegacaoPrincipalItem = {
  label: string;
  view: AppView;
  icon: typeof LayoutDashboard;
  tourKey?: string;
  quickAction?: "novoCliente" | "novoServico" | "novaProposta";
  quickLabel?: string;
};

const navegacaoPrincipal: NavegacaoPrincipalItem[] = [
  { label: "Dashboard", view: "dashboard", icon: LayoutDashboard, tourKey: "dashboard" },
  {
    label: "Clientes",
    view: "clientes",
    icon: UsersRound,
    tourKey: "clientes",
    quickAction: "novoCliente",
    quickLabel: "Novo cliente",
  },
  {
    label: "Serviços / Pacotes",
    view: "servicos",
    icon: BriefcaseBusiness,
    tourKey: "servicos",
    quickAction: "novoServico",
    quickLabel: "Novo serviço",
  },
  {
    label: "Propostas",
    view: "propostas",
    icon: ReceiptText,
    tourKey: "propostas",
    quickAction: "novaProposta",
    quickLabel: "Nova proposta",
  },
  { label: "Plano", view: "billing", icon: CreditCard, tourKey: "billing" },
  { label: "Suporte", view: "suporte", icon: HeartHandshake, tourKey: "suporte" },
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
  segmento: "",
  cidadeUf: "",
  corPrimaria: "#6E38FF",
  corSecundaria: "#13C7BD",
  corSistemaPrimaria: "#6E38FF",
  corSistemaSecundaria: "#13C7BD",
  logoUrl: "",
  templateVisualPadrao: propostaTemplateVisualDefault,
  formatoArquivoPreferido: formatoArquivoPreferidoDefault,
};

const clienteDefaultValues: ClienteFormInput = {
  nome: "",
  email: "",
  telefone: "",
  documento: "",
  endereco: "",
  numero: "",
  cidade: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  observacoes: "",
};

const clienteRapidoDefaultValues: ClienteRapidoFormInput = {
  ...clienteDefaultValues,
};

const billingPagadorDefaultValues: BillingPagadorFormInput = {
  tipoPessoa: "Fisica",
  nome: "",
  cpfCnpj: "",
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

function isViewportDesktopInicial() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}

function isViewportMobileAtual() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023.98px)").matches
  );
}

type ConfirmacaoSistemaVariante = "danger" | "warning" | "info" | "success";

type ConfirmacaoSistemaConfig = {
  titulo: string;
  mensagem: string;
  detalhe?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: ConfirmacaoSistemaVariante;
};

type ConfirmacaoSistemaState = ConfirmacaoSistemaConfig & {
  id: number;
};

type ToastSistemaVariante = "success" | "warning" | "info" | "error";

type ToastSistemaOrigem =
  | "sessao"
  | "senha"
  | "perfil"
  | "seguranca"
  | "suporte"
  | "billing"
  | "cliente"
  | "servico"
  | "proposta"
  | "exportacao";

type ToastSistemaItem = {
  id: number;
  mensagem: string;
  variante: ToastSistemaVariante;
  duracaoMs: number;
  criadoEm: number;
};

type PropostaWhatsappModo = "completa" | "arquivo";

const toastSistemaDuracaoMs = 3000;
const appNavigationStorageKey = "emprely.appNavigationState.v1";
const appHistoryStateKey = "emprelyApp";
const appViewValores: AppView[] = [
  "dashboard",
  "clientes",
  "servicos",
  "propostas",
  "billing",
  "conta",
  "personalizacao",
  "suporte",
];
const crudModoValores: CrudModo[] = [
  "lista",
  "novo",
  "editar",
  "visualizar",
  "assistente",
];
const propostaAssistenteEtapaValores: PropostaAssistenteEtapa[] = [
  "inicio",
  "existente",
  "novo",
];

function normalizarAppViewPersistida(view: unknown): AppView | null {
  if (typeof view !== "string" || !appViewValores.includes(view as AppView)) {
    return null;
  }

  return view === "personalizacao" ? "conta" : (view as AppView);
}

function normalizarCrudModoPersistido(modo: unknown): CrudModo | null {
  return typeof modo === "string" && crudModoValores.includes(modo as CrudModo)
    ? (modo as CrudModo)
    : null;
}

function normalizarStringOuNull(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() ? valor : null;
}

function readAppNavigationSnapshot(): Partial<AppNavigationSnapshot> {
  try {
    const bruto = window.sessionStorage.getItem(appNavigationStorageKey);

    if (!bruto) {
      return {};
    }

    const parsed = JSON.parse(bruto) as Partial<AppNavigationSnapshot>;
    const appView = normalizarAppViewPersistida(parsed.appView);
    const clienteModo = normalizarCrudModoPersistido(parsed.clienteModo);
    const servicoModo = normalizarCrudModoPersistido(parsed.servicoModo);
    const propostaModo = normalizarCrudModoPersistido(parsed.propostaModo);
    const propostaAssistenteEtapa =
      typeof parsed.propostaAssistenteEtapa === "string" &&
      propostaAssistenteEtapaValores.includes(parsed.propostaAssistenteEtapa)
        ? parsed.propostaAssistenteEtapa
        : null;
    const propostaWizardEtapaAtiva =
      typeof parsed.propostaWizardEtapaAtiva === "string" &&
      propostaWizardEtapasOrdem.includes(parsed.propostaWizardEtapaAtiva)
        ? parsed.propostaWizardEtapaAtiva
        : null;

    return {
      appView: appView ?? undefined,
      clienteModo: clienteModo ?? undefined,
      clienteSelecionadoId: normalizarStringOuNull(parsed.clienteSelecionadoId),
      servicoModo: servicoModo ?? undefined,
      servicoSelecionadoId: normalizarStringOuNull(parsed.servicoSelecionadoId),
      propostaModo: propostaModo ?? undefined,
      propostaSelecionadaId: normalizarStringOuNull(parsed.propostaSelecionadaId),
      propostaAssistenteEtapa: propostaAssistenteEtapa ?? undefined,
      propostaWizardEtapaAtiva: propostaWizardEtapaAtiva ?? undefined,
    };
  } catch {
    return {};
  }
}

function writeAppNavigationSnapshot(snapshot: AppNavigationSnapshot) {
  window.sessionStorage.setItem(appNavigationStorageKey, JSON.stringify(snapshot));
}

function clearAppNavigationSnapshot() {
  window.sessionStorage.removeItem(appNavigationStorageKey);
}

function buildAppHistoryState(snapshot: AppNavigationSnapshot) {
  return {
    ...(window.history.state && typeof window.history.state === "object"
      ? window.history.state
      : {}),
    [appHistoryStateKey]: true,
    appSnapshot: snapshot,
  };
}

export default function App() {
  const queryClient = useQueryClient();
  const [sessaoInicial] = useState<SessaoInicialUsuario>(readSessaoInicialUsuario);
  const [appNavigationInicial] = useState<Partial<AppNavigationSnapshot>>(
    readAppNavigationSnapshot,
  );
  const [authMode, setAuthMode] = useState<AuthMode>(() => getAuthModeInicial());
  const [authEmailPendente, setAuthEmailPendente] = useState("");
  const authUrlParams = getAuthUrlParams();
  const [appView, setAppView] = useState<AppView>(
    appNavigationInicial.appView ?? "dashboard",
  );
  const [appViewAnterior, setAppViewAnterior] = useState<AppView | null>(null);
  const [retornoContextual, setRetornoContextual] =
    useState<AppReturnIntent | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    sessaoInicial.accessToken,
  );
  const [authUsuario, setAuthUsuario] = useState<AuthUsuarioResponse | null>(
    sessaoInicial.authUsuario,
  );
  const [sessaoMensagem, setSessaoMensagem] = useState<string | null>(
    sessaoInicial.mensagem,
  );
  const [perfilMensagem, setPerfilMensagem] = useState<string | null>(null);
  const [segurancaMensagem, setSegurancaMensagem] = useState<string | null>(null);
  const [suporteMensagem, setSuporteMensagem] = useState<string | null>(null);
  const [clienteMensagem, setClienteMensagem] = useState<string | null>(null);
  const [clienteModo, setClienteModo] = useState<CrudModo>(
    appNavigationInicial.clienteModo ?? "lista",
  );
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(
    appNavigationInicial.clienteSelecionadoId ?? null,
  );
  const [clienteComplementaresAberto, setClienteComplementaresAberto] =
    useState(false);
  const [servicoMensagem, setServicoMensagem] = useState<string | null>(null);
  const [servicoModo, setServicoModo] = useState<CrudModo>(
    appNavigationInicial.servicoModo ?? "lista",
  );
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<string | null>(
    appNavigationInicial.servicoSelecionadoId ?? null,
  );
  const [propostaMensagem, setPropostaMensagem] = useState<string | null>(null);
  const [propostaModo, setPropostaModo] = useState<CrudModo>(
    appNavigationInicial.propostaModo ?? "lista",
  );
  const [propostaSelecionadaId, setPropostaSelecionadaId] = useState<string | null>(
    appNavigationInicial.propostaSelecionadaId ?? null,
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
  const [buscaClienteAssistente, setBuscaClienteAssistente] = useState("");
  const [clientePagina, setClientePagina] = useState(1);
  const [servicoPagina, setServicoPagina] = useState(1);
  const [propostaPagina, setPropostaPagina] = useState(1);
  const [clienteTamanhoPagina, setClienteTamanhoPagina] = useState(10);
  const [servicoTamanhoPagina, setServicoTamanhoPagina] = useState(10);
  const [propostaTamanhoPagina, setPropostaTamanhoPagina] = useState(10);
  const [clienteRapidoAberto, setClienteRapidoAberto] = useState(false);
  const [
    clienteRapidoComplementaresAberto,
    setClienteRapidoComplementaresAberto,
  ] = useState(false);
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
  const propostaVisualizacaoDocumentoRef = useRef<HTMLDivElement | null>(null);
  const propostaVisualizacaoExportDocumentoRef = useRef<HTMLDivElement | null>(null);
  const propostaCompartilhamentoDocumentoRef = useRef<HTMLDivElement | null>(null);
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
    propostaDescontoPagamentoAberto,
    setPropostaDescontoPagamentoAberto,
  ] = useState(isViewportDesktopInicial);
  const [
    propostaEscopoCronogramaAberto,
    setPropostaEscopoCronogramaAberto,
  ] = useState(isViewportDesktopInicial);
  const [propostaCompartilhamentoId, setPropostaCompartilhamentoId] = useState<
    string | null
  >(null);
  const [propostaAssistenteEtapa, setPropostaAssistenteEtapa] =
    useState<PropostaAssistenteEtapa>(
      appNavigationInicial.propostaAssistenteEtapa ?? "inicio",
    );
  const [propostaWizardEtapaAtiva, setPropostaWizardEtapaAtiva] =
    useState<PropostaWizardEtapaId>(
      appNavigationInicial.propostaWizardEtapaAtiva ?? "cliente",
    );
  const [onboardingModalAberto, setOnboardingModalAberto] = useState(false);
  const [onboardingJornadaAtiva, setOnboardingJornadaAtiva] = useState<
    "conta" | "proposta"
  >("conta");
  const [onboardingTourRodando, setOnboardingTourRodando] = useState(false);
  const [onboardingTourStepIndex, setOnboardingTourStepIndex] = useState(0);
  const [onboardingTourKey, setOnboardingTourKey] = useState(0);
  const onboardingModalAutoAberturaRef = useRef<string | null>(null);
  const onboardingModalLembreteRef = useRef<string | null>(null);
  const onboardingModalDispensadaSessaoRef = useRef<string | null>(null);
  const onboardingTourAutoInicioRef = useRef<string | null>(null);
  const onboardingTourEncerradoSessaoRef = useRef<string | null>(null);
  const [
    personalizacaoPreviewTemplateAberto,
    setPersonalizacaoPreviewTemplateAberto,
  ] = useState<PropostaTemplateVisualAtivo | null>(null);
  const contaMenuRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardClienteRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardMensagemRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardItensRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardTemplateRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardDetalhamentoRef = useRef<HTMLDivElement | null>(null);
  const propostaWizardRevisaoRef = useRef<HTMLDivElement | null>(null);
  const [filtroStatusProposta, setFiltroStatusProposta] =
    useState<FiltroStatusProposta>("Todas");
  const [contaMenuAberto, setContaMenuAberto] = useState(false);
  const [mobileMenuAberto, setMobileMenuAberto] = useState(false);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [temaVisual, setTemaVisual] = useState<TemaVisual>(getTemaVisualInicial);
  const [toastsSistema, setToastsSistema] = useState<ToastSistemaItem[]>([]);
  const toastSistemaIdRef = useRef(0);
  const suprimirProximoToastRascunhoRef = useRef(false);
  const [confirmacaoSistema, setConfirmacaoSistema] =
    useState<ConfirmacaoSistemaState | null>(null);
  const confirmacaoSistemaResolverRef = useRef<
    ((confirmado: boolean) => void) | null
  >(null);
  const confirmacaoSistemaIdRef = useRef(0);
  const historicoAppInicializadoRef = useRef(false);

  const fecharPropostaVisualizacaoModal = useCallback(() => {
    setPropostaVisualizacaoModalId(null);
  }, []);

  const fecharPropostaPreviewModal = useCallback(() => {
    setPropostaPreviewModalAberto(false);
  }, []);

  const fecharPersonalizacaoPreviewTemplate = useCallback(() => {
    setPersonalizacaoPreviewTemplateAberto(null);
  }, []);

  const fecharToastSistema = useCallback((id: number) => {
    setToastsSistema((toastsAtuais) =>
      toastsAtuais.filter((toast) => toast.id !== id),
    );
  }, []);

  const exibirToastSistema = useCallback(
    (mensagem: string | null | undefined, variante: ToastSistemaVariante) => {
      const texto = mensagem?.trim();

      if (!texto) {
        return;
      }

      const criadoEm = Date.now();
      toastSistemaIdRef.current += 1;

      setToastsSistema((toastsAtuais) => {
        const jaExiste = toastsAtuais.some(
          (toast) => toast.mensagem === texto,
        );

        if (jaExiste) {
          return toastsAtuais;
        }

        return [
          {
            id: toastSistemaIdRef.current,
            mensagem: texto,
            variante,
            duracaoMs: toastSistemaDuracaoMs,
            criadoEm,
          },
          ...toastsAtuais,
        ].slice(0, 4);
      });
    },
    [],
  );

  const exibirMensagemSistema = useCallback(
    (mensagem: string | null, origem: ToastSistemaOrigem) => {
      if (!mensagem) {
        return;
      }

      exibirToastSistema(mensagem, getToastSistemaVariante(mensagem, origem));
    },
    [exibirToastSistema],
  );

  const abrirConfirmacaoSistema = useCallback(
    (config: ConfirmacaoSistemaConfig) =>
      new Promise<boolean>((resolve) => {
        confirmacaoSistemaResolverRef.current?.(false);
        confirmacaoSistemaResolverRef.current = resolve;
        confirmacaoSistemaIdRef.current += 1;
        setConfirmacaoSistema({
          id: confirmacaoSistemaIdRef.current,
          variante: "warning",
          textoConfirmar: "Sim",
          textoCancelar: "Não",
          ...config,
        });
      }),
    [],
  );

  const responderConfirmacaoSistema = useCallback((confirmado: boolean) => {
    confirmacaoSistemaResolverRef.current?.(confirmado);
    confirmacaoSistemaResolverRef.current = null;
    setConfirmacaoSistema(null);
  }, []);

  useEffect(
    () => () => {
      confirmacaoSistemaResolverRef.current?.(false);
      confirmacaoSistemaResolverRef.current = null;
    },
    [],
  );

  useEffect(() => {
    exibirMensagemSistema(sessaoMensagem, "sessao");
  }, [exibirMensagemSistema, sessaoMensagem]);

  useEffect(() => {
    exibirMensagemSistema(perfilMensagem, "perfil");
  }, [exibirMensagemSistema, perfilMensagem]);

  useEffect(() => {
    exibirMensagemSistema(segurancaMensagem, "seguranca");
  }, [exibirMensagemSistema, segurancaMensagem]);

  useEffect(() => {
    exibirMensagemSistema(suporteMensagem, "suporte");
  }, [exibirMensagemSistema, suporteMensagem]);

  useEffect(() => {
    exibirMensagemSistema(clienteMensagem, "cliente");
  }, [clienteMensagem, exibirMensagemSistema]);

  useEffect(() => {
    exibirMensagemSistema(servicoMensagem, "servico");
  }, [exibirMensagemSistema, servicoMensagem]);

  useEffect(() => {
    exibirMensagemSistema(propostaMensagem, "proposta");
  }, [exibirMensagemSistema, propostaMensagem]);

  useEffect(() => {
    exibirMensagemSistema(propostaExportacaoMensagem, "exportacao");
  }, [exibirMensagemSistema, propostaExportacaoMensagem]);

  useEffect(() => {
    const modalAberto =
      confirmacaoSistema ||
      clienteRapidoAberto ||
      logoSugestaoPerfil ||
      propostaCompartilharModalAberto ||
      propostaTemplateModalAberto ||
      templatePreviewAberto ||
      propostaVisualizacaoModalId ||
      propostaPreviewModalAberto ||
      personalizacaoPreviewTemplateAberto;

    if (!modalAberto) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (confirmacaoSistema) {
        responderConfirmacaoSistema(false);
        return;
      }

      if (logoSugestaoPerfil) {
        setLogoSugestaoPerfil(null);
        return;
      }

      if (clienteRapidoAberto) {
        setClienteRapidoAberto(false);
        setClienteRapidoComplementaresAberto(false);
        return;
      }

      if (propostaCompartilharModalAberto) {
        setPropostaCompartilharModalAberto(false);
        setPropostaCompartilhamentoId(null);
        setPropostaExportacaoMensagem(null);
        return;
      }

      if (templatePreviewAberto) {
        setTemplatePreviewAberto(null);
        return;
      }

      if (propostaTemplateModalAberto) {
        setPropostaTemplateModalAberto(false);
        return;
      }

      if (propostaVisualizacaoModalId) {
        fecharPropostaVisualizacaoModal();
        return;
      }

      if (propostaPreviewModalAberto) {
        fecharPropostaPreviewModal();
        return;
      }

      fecharPersonalizacaoPreviewTemplate();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    clienteRapidoAberto,
    confirmacaoSistema,
    fecharPersonalizacaoPreviewTemplate,
    fecharPropostaPreviewModal,
    fecharPropostaVisualizacaoModal,
    logoSugestaoPerfil,
    personalizacaoPreviewTemplateAberto,
    propostaCompartilharModalAberto,
    propostaPreviewModalAberto,
    propostaTemplateModalAberto,
    propostaVisualizacaoModalId,
    responderConfirmacaoSistema,
    templatePreviewAberto,
  ]);

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

  const onboardingQuery = useQuery({
    queryKey: ["onboarding", accessToken],
    queryFn: () => getOnboarding(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const billingPlansQuery = useQuery({
    queryKey: ["billing-plans", accessToken],
    queryFn: () => getBillingPlans(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const billingStatusQuery = useQuery({
    queryKey: ["billing-status", accessToken],
    queryFn: () => getBillingStatus(accessToken!),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const publicBillingPaymentToken = getPublicBillingPaymentTokenFromPath();
  const publicBillingPaymentLinkQuery = useQuery({
    queryKey: ["public-billing-payment-link", publicBillingPaymentToken],
    queryFn: () => getPublicBillingPaymentLink(publicBillingPaymentToken!),
    enabled: Boolean(publicBillingPaymentToken),
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

  const recuperarSenhaForm = useForm<EmailUsuarioFormInput>({
    resolver: zodResolver(emailUsuarioSchema),
    defaultValues: {
      email: "",
    },
  });

  const publicBillingLinkForm = useForm<EmailUsuarioFormInput>({
    resolver: zodResolver(emailUsuarioSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetSenhaForm = useForm<ResetSenhaUsuarioFormInput>({
    resolver: zodResolver(resetSenhaSchema),
    defaultValues: {
      usuarioId: authUrlParams.usuarioId,
      token: authUrlParams.token,
      novaSenha: "",
      confirmarNovaSenha: "",
    },
  });

  const changeEmailForm = useForm<ChangeEmailUsuarioFormInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      novoEmail: "",
    },
  });

  const suporteForm = useForm<SuporteFormInput>({
    resolver: zodResolver(suporteSchema),
    defaultValues: {
      assunto: "",
      mensagem: "",
    },
  });

  const contatoPublicoForm = useForm<ContatoPublicoFormInput>({
    resolver: zodResolver(contatoPublicoSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      interesse: "duvida",
      mensagem: "",
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
      clearAppNavigationSnapshot();
      setAccessToken(null);
      setAuthUsuario(null);
      setAuthMode("login");
      setSessaoMensagem(mensagem);
      setPerfilMensagem(null);
      setClienteMensagem(null);
      setServicoMensagem(null);
      setPropostaMensagem(null);
      setPropostaExportacaoMensagem(null);
      setClienteModo("lista");
      setClienteComplementaresAberto(false);
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
      setBuscaClienteAssistente("");
      setClientePagina(1);
      setServicoPagina(1);
      setPropostaPagina(1);
      setFiltroStatusProposta("Todas");
      setPropostaAssistenteEtapa("inicio");
      setPropostaWizardEtapaAtiva("cliente");
      setClienteRapidoAberto(false);
      setClienteRapidoComplementaresAberto(false);
      setContaMenuAberto(false);
      limparLogoArquivoPendente();
      resetPerfilForm(perfilContaDefaultValues);
      resetClienteForm(clienteDefaultValues);
      resetClienteRapidoForm(clienteRapidoDefaultValues);
      resetServicoForm(servicoDefaultValues);
      resetPropostaForm(propostaDefaultValues);
      tituloAutomaticoPropostaRef.current = null;
      setAppViewAnterior(null);
      setRetornoContextual(null);
      setAppView("dashboard");
      if (window.location.search.includes("auth=")) {
        window.history.replaceState({}, "", window.location.pathname);
      }
      queryClient.removeQueries({ queryKey: ["usuario-atual"] });
      queryClient.removeQueries({ queryKey: ["perfil-conta"] });
      queryClient.removeQueries({ queryKey: ["billing-plans"] });
      queryClient.removeQueries({ queryKey: ["billing-status"] });
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
    if (!mobileMenuAberto) {
      document.body.classList.remove("is-mobile-menu-open");
      return;
    }

    document.body.classList.add("is-mobile-menu-open");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuAberto(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("is-mobile-menu-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuAberto]);

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

  const usuario = usuarioAtualQuery.data?.usuario ?? authUsuario?.usuario;
  const conta = usuarioAtualQuery.data?.conta ?? authUsuario?.conta;
  const contaStatusComercial: ContaAtualResponse["statusComercial"] = conta
    ? getStatusComercialContaEfetivo(conta, billingStatusQuery.data)
    : "TrialExpirado";
  const perfilConta = perfilContaQuery.data;

  useEffect(() => {
    if (!accessToken || typeof window === "undefined") {
      return;
    }

    const billingRetorno = getBillingRetornoFromPath(window.location.pathname);

    if (!billingRetorno) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAppView("billing");
      exibirToastSistema(
        getMensagemRetornoBilling(billingRetorno),
        billingRetorno === "sucesso" ? "success" : "info",
      );
    }, 0);

    void queryClient.invalidateQueries({ queryKey: ["billing-status", accessToken] });
    void queryClient.invalidateQueries({ queryKey: ["usuario-atual", accessToken] });
    window.history.replaceState({}, "", "/");

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [accessToken, exibirToastSistema, queryClient]);

  useEffect(() => {
    if (!usuario || !conta) {
      return;
    }

    const scrollRestorationAnterior = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = scrollRestorationAnterior;
    };
  }, [conta, usuario]);

  useEffect(() => {
    if (!usuario || !conta) {
      if (!accessToken) {
        clearAppNavigationSnapshot();
      }
      historicoAppInicializadoRef.current = false;
      return;
    }

    const snapshot: AppNavigationSnapshot = {
      appView,
      clienteModo,
      clienteSelecionadoId,
      servicoModo,
      servicoSelecionadoId,
      propostaModo,
      propostaSelecionadaId,
      propostaAssistenteEtapa,
      propostaWizardEtapaAtiva,
    };
    writeAppNavigationSnapshot(snapshot);

    if (!historicoAppInicializadoRef.current) {
      const state = buildAppHistoryState(snapshot);
      window.history.replaceState(state, "", window.location.href);
      window.history.pushState(state, "", window.location.href);
      historicoAppInicializadoRef.current = true;
      return;
    }

    window.history.replaceState(
      buildAppHistoryState(snapshot),
      "",
      window.location.href,
    );
  }, [
    accessToken,
    appView,
    clienteModo,
    clienteSelecionadoId,
    conta,
    propostaAssistenteEtapa,
    propostaModo,
    propostaSelecionadaId,
    propostaWizardEtapaAtiva,
    servicoModo,
    servicoSelecionadoId,
    usuario,
  ]);

  useEffect(() => {
    if (!usuario || !conta) {
      return;
    }

    const manterUsuarioNoApp = () => {
      const snapshot: AppNavigationSnapshot = {
        appView,
        clienteModo,
        clienteSelecionadoId,
        servicoModo,
        servicoSelecionadoId,
        propostaModo,
        propostaSelecionadaId,
        propostaAssistenteEtapa,
        propostaWizardEtapaAtiva,
      };
      window.history.pushState(
        buildAppHistoryState(snapshot),
        "",
        window.location.href,
      );
    };

    const handlePopState = () => {
      const scrollAtualX = window.scrollX;
      const scrollAtualY = window.scrollY;
      let eventoTratado = true;

      const preservarScrollAtual = () => {
        window.scrollTo(scrollAtualX, scrollAtualY);
      };

      if (mobileMenuAberto) {
        setMobileMenuAberto(false);
      } else if (contaMenuAberto) {
        setContaMenuAberto(false);
      } else if (onboardingModalAberto) {
        setOnboardingModalAberto(false);
      } else if (confirmacaoSistema) {
        responderConfirmacaoSistema(false);
      } else if (logoSugestaoPerfil) {
        setLogoSugestaoPerfil(null);
      } else if (clienteRapidoAberto) {
        resetClienteRapidoForm(clienteRapidoDefaultValues);
        setClienteRapidoAberto(false);
        setClienteRapidoComplementaresAberto(false);
      } else if (propostaCompartilharModalAberto) {
        setPropostaCompartilharModalAberto(false);
        setPropostaCompartilhamentoId(null);
        setPropostaExportacaoMensagem(null);
      } else if (templatePreviewAberto) {
        setTemplatePreviewAberto(null);
      } else if (propostaTemplateModalAberto) {
        setPropostaTemplateModalAberto(false);
      } else if (propostaPreviewModalAberto) {
        fecharPropostaPreviewModal();
      } else if (personalizacaoPreviewTemplateAberto) {
        fecharPersonalizacaoPreviewTemplate();
      } else if (propostaVisualizacaoModalId) {
        fecharPropostaVisualizacaoModal();
      } else if (appView === "propostas" && propostaModo !== "lista") {
        if (propostaModo === "assistente" && propostaAssistenteEtapa !== "inicio") {
          resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
          setClienteRapidoComplementaresAberto(false);
          setPropostaAssistenteEtapa("inicio");
        } else if (
          (propostaModo === "novo" || propostaModo === "editar") &&
          propostaWizardEtapaAtiva !== "cliente"
        ) {
          const indiceAtual = propostaWizardEtapasOrdem.indexOf(
            propostaWizardEtapaAtiva,
          );
          const etapaAnterior = propostaWizardEtapasOrdem[indiceAtual - 1];

          if (etapaAnterior) {
            setPropostaWizardEtapaAtiva(etapaAnterior);
          }
        } else {
          setPropostaModo("lista");
          setPropostaSelecionadaId(null);
          setPropostaVisualizacaoModalId(null);
          setPropostaPreviewModalAberto(false);
          setPropostaTemplateModalAberto(false);
          setPropostaCompartilharModalAberto(false);
          setServicoParaAdicionarId("");
          setClienteRapidoAberto(false);
          setClienteRapidoComplementaresAberto(false);
          setBuscaClienteAssistente("");
          setPropostaAssistenteEtapa("inicio");
          setPropostaWizardEtapaAtiva("cliente");
          resetPropostaForm(propostaDefaultValues, { keepDirty: false });
          resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
          tituloAutomaticoPropostaRef.current = null;
        }
      } else if (appView === "clientes" && clienteModo !== "lista") {
        setClienteModo("lista");
        setClienteSelecionadoId(null);
        setClienteComplementaresAberto(false);
        resetClienteForm(clienteDefaultValues, { keepDirty: false });
      } else if (appView === "servicos" && servicoModo !== "lista") {
        setServicoModo("lista");
        setServicoSelecionadoId(null);
        resetServicoForm(servicoDefaultValues, { keepDirty: false });
      } else if (appView !== "dashboard") {
        setAppView("dashboard");
      } else {
        eventoTratado = false;
      }

      if (eventoTratado) {
        window.requestAnimationFrame(() => {
          manterUsuarioNoApp();
          preservarScrollAtual();
          window.requestAnimationFrame(preservarScrollAtual);
        });
        return;
      }

      manterUsuarioNoApp();
      preservarScrollAtual();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    appView,
    clienteModo,
    clienteRapidoAberto,
    clienteSelecionadoId,
    confirmacaoSistema,
    conta,
    contaMenuAberto,
    fecharPersonalizacaoPreviewTemplate,
    fecharPropostaPreviewModal,
    fecharPropostaVisualizacaoModal,
    logoSugestaoPerfil,
    mobileMenuAberto,
    onboardingModalAberto,
    personalizacaoPreviewTemplateAberto,
    propostaAssistenteEtapa,
    propostaCompartilharModalAberto,
    propostaModo,
    propostaPreviewModalAberto,
    propostaSelecionadaId,
    propostaTemplateModalAberto,
    propostaVisualizacaoModalId,
    propostaWizardEtapaAtiva,
    responderConfirmacaoSistema,
    resetClienteForm,
    resetClienteRapidoForm,
    resetPropostaForm,
    resetServicoForm,
    servicoModo,
    servicoSelecionadoId,
    templatePreviewAberto,
    usuario,
  ]);

  const onboarding = onboardingQuery.data;
  const perfilContaMinimoCompleto = isPerfilContaOnboardingCompleto(perfilConta);
  const perfilTemplateVisualPadrao = normalizarTemplateVisual(
    perfilConta?.templateVisualPadrao,
  );
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
  const primeiraPropostaGerada = propostas.some(
    (proposta) => proposta.status !== "Rascunho" && proposta.status !== "Arquivada",
  );
  const clientesFiltrados = clientes.filter((cliente) =>
    matchBuscaTexto(buscaClientes, [
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.documento,
      cliente.endereco,
      cliente.numero,
      cliente.cidade,
      cliente.instagram,
      cliente.facebook,
      cliente.tiktok,
      cliente.observacoes,
    ]),
  );
  const clientesAssistenteFiltrados = clientes.filter((cliente) =>
    matchBuscaTexto(buscaClienteAssistente, [
      cliente.nome,
      cliente.email,
      cliente.telefone,
      cliente.documento,
      cliente.endereco,
      cliente.numero,
      cliente.cidade,
      cliente.instagram,
      cliente.facebook,
      cliente.tiktok,
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
    ? canExportPropostaConta(conta, billingStatusQuery.data)
    : false;
  const propostaSelecionadaRascunho =
    propostaSelecionada?.status === "Rascunho";
  const propostaSelecionadaGerada = propostaSelecionada?.status === "Gerada";
  const propostaSelecionadaEnviada = propostaSelecionada?.status === "Enviada";
  const propostaEditorAtivo =
    propostaModo === "novo" || propostaModo === "editar";
  const mensagemBloqueioPlano = getMensagemBloqueioPlano(conta, billingStatusQuery.data);
  const propostaProntaParaGerar = Boolean(
    propostaEditorAtivo && contaPodeExportarProposta,
  );
  const propostaWizardClienteConcluido = Boolean(
    propostaPreview.clienteId && valorSeguro(propostaPreview.validadeDias) >= 1,
  );
  const propostaWizardDadosConcluido = Boolean(propostaPreview.titulo?.trim());
  const propostaWizardItensConcluido =
    propostaItensPreview.length > 0 &&
    propostaItensPreview.every(
      (item) =>
        Boolean(item?.nome?.trim()) &&
        isQuantidadeItemValida(item?.quantidade) &&
        valorSeguro(item?.valorUnitario) >= 0,
    );
  const propostaWizardTemplateConcluido = Boolean(
    propostaPreview.templateVisual,
  );
  const propostaWizardDetalhamentoConcluido =
    propostaWizardItensConcluido &&
    propostaWizardTemplateConcluido &&
    valorSeguro(propostaPreview.descontoValor) >= 0 &&
    valorSeguro(propostaPreview.descontoValor) <= propostaSubtotalPreview;
  const propostaWizardRevisaoConcluida =
    propostaWizardClienteConcluido &&
    propostaWizardDadosConcluido &&
    propostaWizardItensConcluido &&
    propostaWizardTemplateConcluido &&
    propostaWizardDetalhamentoConcluido &&
    Boolean(propostaSelecionadaRascunho) &&
    !propostaTemAlteracoes;
  const propostaWizardEtapas: PropostaWizardStepItem[] = [
    {
      id: "cliente",
      label: "Cliente",
      concluido: propostaWizardClienteConcluido,
    },
    {
      id: "proposta",
      label: "Proposta",
      concluido: propostaWizardDadosConcluido,
    },
    {
      id: "itens",
      label: "Itens",
      concluido: propostaWizardItensConcluido,
    },
    {
      id: "template",
      label: "Template",
      concluido: propostaWizardTemplateConcluido,
    },
    {
      id: "detalhamento",
      label: "Detalhes",
      concluido: propostaWizardDetalhamentoConcluido,
    },
    {
      id: "revisao",
      label: "Revisão",
      concluido: propostaWizardRevisaoConcluida,
    },
  ];
  const propostaWizardEtapaAtualIndex = Math.max(
    0,
    propostaWizardEtapas.findIndex(
      (etapa) => etapa.id === propostaWizardEtapaAtiva,
    ),
  );
  const propostaWizardEtapaAtualLabel =
    propostaWizardEtapas[propostaWizardEtapaAtualIndex]?.label ?? "Cliente";
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
    ? {
        ...mapPropostaForm(propostaFontePreview),
        publicApprovalUrl: propostaFontePreview.publicApprovalUrl,
      }
    : propostaPreview;
  const propostaSubtotalVisual = propostaFontePreview
    ? getSubtotalProposta(propostaFontePreview)
    : propostaSubtotalPreview;
  const propostaDescontoVisual =
    propostaFontePreview?.descontoValor ?? propostaDescontoPreview;
  const propostaTotalVisual = propostaFontePreview?.total ?? propostaTotalPreview;
  const clientePreview = clientes.find(
    (cliente) => cliente.id === propostaPreviewVisual.clienteId,
  );
  const clienteNomePreviewFallback = propostaFontePreview?.clienteNome;
  const propostaResumoTemplateLabel = getPropostaTemplateLabel(
    normalizarTemplateVisual(propostaPreviewVisual.templateVisual),
  );
  const propostaResumoValidade =
    formatValidadeProposta(propostaPreviewVisual.validadeDias) || "Não informada";
  const propostaResumoItens = (propostaPreviewVisual.itens ?? [])
    .map((item, index) => ({
      id: `${item?.servicoId || item?.nome || "item"}-${index}`,
      nome: item?.nome?.trim() || `Item ${index + 1}`,
      descricao: item?.descricao?.trim() ?? "",
      quantidade: valorSeguro(item?.quantidade),
      valorUnitario: valorSeguro(item?.valorUnitario),
      total: calcularTotalItens([
        {
          quantidade: item?.quantidade,
          valorUnitario: item?.valorUnitario,
        },
      ]),
    }))
    .filter((item) => item.nome.trim().length > 0);
  const propostaResumoInclusos = splitLinhasFormulario(
    propostaPreviewVisual.itensInclusosTexto,
  );
  const propostaResumoNaoInclusos = splitLinhasFormulario(
    propostaPreviewVisual.itensNaoInclusosTexto,
  );
  const propostaResumoCronograma = splitLinhasFormulario(
    propostaPreviewVisual.cronogramaTexto,
  );
  const propostaResumoBeneficios = splitLinhasFormulario(
    propostaPreviewVisual.beneficiosTexto,
  );
  const propostaResumoCondicoesPagamento =
    propostaPreviewVisual.condicoesPagamento?.trim() || "Não informado";
  const propostaResumoIntroducao =
    propostaPreviewVisual.introducao?.trim() || "Não informada";
  const propostaResumoObservacoes =
    propostaPreviewVisual.observacoes?.trim() || "Não informadas";
  const propostaBuilderStatusLabel =
    propostaSelecionada?.status ?? "Novo rascunho";
  const propostaBuilderClienteLabel =
    clientePreview?.nome?.trim() ||
    clienteNomePreviewFallback?.trim() ||
    "Cliente pendente";
  const propostaVisualizacaoModalForm = propostaVisualizacaoModal
    ? {
        ...mapPropostaForm(propostaVisualizacaoModal),
        publicApprovalUrl: propostaVisualizacaoModal.publicApprovalUrl,
      }
    : null;
  const clienteVisualizacaoModal = clientes.find(
    (cliente) => cliente.id === propostaVisualizacaoModal?.clienteId,
  );
  const propostaCompartilhamentoAtiva =
    propostas.find((proposta) => proposta.id === propostaCompartilhamentoId) ??
    null;
  const propostaCompartilhamentoForm = propostaCompartilhamentoAtiva
    ? {
        ...mapPropostaForm(propostaCompartilhamentoAtiva),
        publicApprovalUrl: propostaCompartilhamentoAtiva.publicApprovalUrl,
      }
    : null;
  const clienteCompartilhamentoAtivo = clientes.find(
    (cliente) => cliente.id === propostaCompartilhamentoAtiva?.clienteId,
  );
  const propostaVisualizacaoModalPodeEditar = propostaVisualizacaoModal
    ? isStatusPropostaEditavelDiretamente(propostaVisualizacaoModal.status)
    : false;
  const propostaVisualizacaoModalPodeExportar = propostaVisualizacaoModal
    ? isStatusPropostaComDocumentoFinal(propostaVisualizacaoModal.status) &&
      contaPodeExportarProposta
    : false;
  const propostaCompartilhamentoPodeEnviar =
    propostaCompartilhamentoAtiva !== null &&
    isStatusPropostaComDocumentoFinal(propostaCompartilhamentoAtiva.status) &&
    contaPodeExportarProposta;
  const whatsappPropostaCompletaUrl =
    propostaCompartilhamentoPodeEnviar && propostaCompartilhamentoAtiva
      ? buildWhatsappPropostaUrl(
          propostaCompartilhamentoAtiva,
          clienteCompartilhamentoAtivo,
          perfilConta,
          conta?.nome ?? "Emprely",
          "completa",
        )
      : "";
  const whatsappPropostaArquivoUrl =
    propostaCompartilhamentoPodeEnviar && propostaCompartilhamentoAtiva
      ? buildWhatsappPropostaUrl(
          propostaCompartilhamentoAtiva,
          clienteCompartilhamentoAtivo,
          perfilConta,
          conta?.nome ?? "Emprely",
          "arquivo",
        )
      : "";

  useEffect(() => {
    if (perfilContaQuery.data) {
      resetPerfilForm(mapPerfilContaForm(perfilContaQuery.data, usuario));
    }
  }, [perfilContaQuery.data, resetPerfilForm, usuario]);

  useEffect(() => {
    if (
      !perfilConta ||
      propostaSelecionadaId ||
      (propostaModo !== "novo" && propostaModo !== "assistente") ||
      propostaForm.formState.isDirty
    ) {
      return;
    }

    const templateAtual = normalizarTemplateVisual(
      propostaForm.getValues("templateVisual"),
    );

    if (templateAtual === perfilTemplateVisualPadrao) {
      return;
    }

    propostaForm.setValue("templateVisual", perfilTemplateVisualPadrao, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [
    perfilConta,
    perfilTemplateVisualPadrao,
    propostaForm,
    propostaModo,
    propostaSelecionadaId,
  ]);

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
    onSuccess: (response: RegisterUsuarioResponse) => {
      setAuthEmailPendente(response.email);
      recuperarSenhaForm.setValue("email", response.email);
      setAuthMode("confirmacao-pendente");
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUsuario,
    onSuccess: handleAuthSuccess,
  });

  const confirmEmailMutation = useMutation({
    mutationFn: confirmEmailUsuario,
    onSuccess: () => {
      setAuthMode("login");
      setSessaoMensagem("Email confirmado. Entre com seus dados.");
    },
  });

  const confirmChangeEmailMutation = useMutation({
    mutationFn: confirmChangeEmailUsuario,
    onSuccess: () => {
      setAuthMode("login");
      setSessaoMensagem("Email alterado. Entre novamente com o novo email.");
    },
  });

  const resendConfirmacaoMutation = useMutation({
    mutationFn: resendConfirmacaoEmail,
    onSuccess: () => {
      setSessaoMensagem("Se houver uma conta pendente, um novo email será enviado.");
    },
  });

  const forgotSenhaMutation = useMutation({
    mutationFn: forgotSenhaUsuario,
    onSuccess: () => {
      setSessaoMensagem("Se houver uma conta com este email, enviaremos um link de recuperação.");
    },
  });

  const resetSenhaMutation = useMutation({
    mutationFn: resetSenhaUsuario,
    onSuccess: () => {
      setSessaoMensagem("Senha redefinida. Entre com a nova senha.");
      setAuthMode("login");
      resetSenhaForm.reset({
        usuarioId: authUrlParams.usuarioId,
        token: authUrlParams.token,
        novaSenha: "",
        confirmarNovaSenha: "",
      });
    },
  });

  const changeEmailMutation = useMutation({
    mutationFn: (input: ChangeEmailUsuarioInput) => changeEmailUsuario(input, accessToken!),
    onSuccess: () => {
      setSegurancaMensagem("Enviamos um link para confirmar o novo email.");
      changeEmailForm.reset({ novoEmail: "" });
    },
  });

  const suporteMutation = useMutation({
    mutationFn: (input: CreateSuporteSolicitacaoInput) =>
      createSuporteSolicitacao(input, accessToken!),
    onSuccess: (response) => {
      setSuporteMensagem(`Solicitação enviada: ${response.assunto}.`);
      suporteForm.reset({ assunto: "", mensagem: "" });
    },
  });

  const criarBillingCheckoutMutation = useMutation({
    mutationFn: (input: CreateBillingCheckoutInput) =>
      createBillingCheckout(input, accessToken!),
    onSuccess: (response) => {
      window.location.assign(response.checkoutUrl);
    },
  });

  const solicitarPublicBillingLinkMutation = useMutation({
    mutationFn: (input: EmailUsuarioInput) => requestPublicBillingPaymentLink(input),
    onSuccess: () => {
      publicBillingLinkForm.reset({ email: "" });
    },
  });

  const criarPublicBillingCheckoutMutation = useMutation({
    mutationFn: (input: CreateBillingCheckoutInput) =>
      createPublicBillingCheckout(publicBillingPaymentToken!, input),
    onSuccess: (response) => {
      window.location.assign(response.checkoutUrl);
    },
  });

  const cancelarBillingMutation = useMutation({
    mutationFn: (motivo: string | null) => cancelBilling(motivo, accessToken!),
    onSuccess: () => {
      exibirToastSistema("Cancelamento agendado para o fim do periodo atual.", "success");
      void billingStatusQuery.refetch();
      void usuarioAtualQuery.refetch();
    },
  });

  const contatoPublicoMutation = useMutation({
    mutationFn: (input: CreateContatoPublicoInput) => createContatoPublico(input),
    onSuccess: (response) => {
      setSuporteMensagem(response.mensagem);
      contatoPublicoForm.reset({
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        interesse: "duvida",
        mensagem: "",
      });
    },
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

  const onboardingMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateOnboarding>[0]) =>
      updateOnboarding(input, accessToken!),
    onSuccess: (response) => {
      queryClient.setQueryData(["onboarding", accessToken], response);
    },
  });

  const onboardingEventoMutation = useMutation({
    mutationFn: (input: Parameters<typeof createOnboardingEvento>[0]) =>
      createOnboardingEvento(input, accessToken!),
    onSuccess: (response) => {
      queryClient.setQueryData(["onboarding", accessToken], response);
    },
  });

  useEffect(() => {
    if (!usuario || !conta || !onboarding || onboardingTourRodando || onboardingModalAberto) {
      return;
    }

    const chaveUsuarioOnboarding = `${conta.id}:${usuario.id}`;
    if (onboardingModalDispensadaSessaoRef.current === chaveUsuarioOnboarding) {
      return;
    }

    const chaveBase = `${chaveUsuarioOnboarding}:${onboarding.updatedAt ?? "inicial"}`;
    const jornadaInicial =
      onboarding.configuracaoConta.status !== "Concluido" ? "conta" : "proposta";

    if (onboarding.deveAbrirAutomaticamente) {
      const chave = `auto:${chaveBase}`;
      if (onboardingModalAutoAberturaRef.current === chave) {
        return;
      }

      onboardingModalAutoAberturaRef.current = chave;
      setOnboardingJornadaAtiva(jornadaInicial);
      setMobileMenuAberto(false);
      setContaMenuAberto(false);
      setOnboardingModalAberto(true);
      return;
    }

    if (onboarding.deveLembrarAposPular) {
      const chave = `lembrete:${chaveBase}`;
      if (onboardingModalLembreteRef.current === chave) {
        return;
      }

      onboardingModalLembreteRef.current = chave;
      setOnboardingJornadaAtiva(jornadaInicial);
      setMobileMenuAberto(false);
      setContaMenuAberto(false);
      setOnboardingModalAberto(true);
    }
  }, [conta, onboarding, onboardingModalAberto, onboardingTourRodando, usuario]);

  useEffect(() => {
    if (!usuario || !conta || !onboarding || onboardingTourRodando || onboardingModalAberto) {
      return;
    }

    if (onboarding.deveAbrirAutomaticamente || onboarding.deveLembrarAposPular) {
      return;
    }

    if (onboarding.tour.status === "NaoIniciado" || onboarding.tour.status === "EmAndamento") {
      const chaveUsuarioTour = `${conta.id}:${usuario.id}`;
      const chaveTour = `${conta.id}:${usuario.id}:${onboarding.tour.status}:${onboarding.updatedAt ?? "inicial"}`;

      if (onboardingTourEncerradoSessaoRef.current === chaveUsuarioTour) {
        return;
      }

      if (onboardingTourAutoInicioRef.current === chaveTour) {
        return;
      }

      onboardingTourAutoInicioRef.current = chaveTour;
      const timeoutId = window.setTimeout(() => {
        const abrirMenuMobile = shouldAbrirMenuMobileOnboardingTour(0);
        setOnboardingTourStepIndex(0);
        setAppView(getOnboardingTourView(0));
        setMobileMenuAberto(abrirMenuMobile);
        setContaMenuAberto(false);
        setSidebarRecolhida(false);
        setOnboardingModalAberto(false);
        setOnboardingTourRodando(true);
        if (onboarding.tour.status === "NaoIniciado") {
          onboardingEventoMutation.mutate({ tipo: "TourExibido", etapa: "dashboard" });
        }
      }, 250);

      return () => window.clearTimeout(timeoutId);
    }
  }, [conta, onboarding, onboardingEventoMutation, onboardingModalAberto, onboardingTourRodando, usuario]);

  useEffect(() => {
    if (!onboardingTourRodando) {
      return;
    }

    const target = getOnboardingTourTarget(onboardingTourStepIndex);
    if (!target) {
      return;
    }

    const scrollParaAlvo = () => {
      const elemento = document.querySelector(target);
      if (elemento instanceof HTMLElement) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    };

    scrollParaAlvo();
    const timeoutId = window.setTimeout(scrollParaAlvo, onboardingTourScrollDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [appView, onboardingTourRodando, onboardingTourStepIndex]);

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
      const eraPrimeiroCliente = !eraEdicao && clientes.length === 0;
      await queryClient.invalidateQueries({ queryKey: ["clientes", accessToken] });
      resetClienteForm(clienteDefaultValues);
      setClienteSelecionadoId(null);
      setClienteModo(eraEdicao || eraPrimeiroCliente ? "lista" : "novo");
      setClienteComplementaresAberto(false);
      setClientePagina(1);
      if (eraPrimeiroCliente) {
        prepararNovoServico();
        setServicoMensagem(
          "Cliente salvo. Agora cadastre o primeiro serviço para usar na proposta.",
        );
        setAppView("servicos");
      }
      setClienteMensagem(
        eraPrimeiroCliente
          ? "Cliente salvo. Próximo passo: cadastre o primeiro serviço."
          : eraEdicao
          ? "Cliente atualizado. Você voltou para a listagem."
          : "Cliente salvo. Cadastre o próximo cliente quando quiser.",
      );
      if (eraPrimeiroCliente) {
        setClienteMensagem(null);
      }
    },
  });

  const criarClienteRapidoMutation = useMutation({
    mutationFn: (input: ClienteRapidoFormInput) =>
      createCliente(buildClientePayload(input), accessToken!),
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
      setClienteRapidoComplementaresAberto(false);
      if (propostaModo === "assistente") {
        setPropostaModo("novo");
      }
      setPropostaWizardEtapaAtiva("proposta");
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
      setClienteComplementaresAberto(false);
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
      const eraPrimeiroServico = !eraEdicao && servicos.length === 0;
      await queryClient.invalidateQueries({ queryKey: ["servicos", accessToken] });
      resetServicoForm(servicoDefaultValues);
      setServicoSelecionadoId(null);
      setServicoModo(eraEdicao || eraPrimeiroServico ? "lista" : "novo");
      setServicoPagina(1);
      if (eraPrimeiroServico) {
        prepararAssistenteNovaProposta();
        setPropostaMensagem(
          "Serviço salvo. Agora monte a primeira proposta com cliente e serviço.",
        );
        setAppView("propostas");
      }
      setServicoMensagem(
        eraPrimeiroServico
          ? "Serviço salvo. Próximo passo: crie a primeira proposta."
          : eraEdicao
          ? "Serviço atualizado. Você voltou para a listagem."
          : "Serviço salvo. Cadastre o próximo serviço quando quiser.",
      );
      if (eraPrimeiroServico) {
        setServicoMensagem(null);
      }
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
      resetPropostaForm(mapPropostaForm(response));
      tituloAutomaticoPropostaRef.current = null;
      setPropostaSelecionadaId(response.id);
      setPropostaModo("editar");
      setPropostaVisualizacaoModalId(null);
      setServicoParaAdicionarId("");
      setPropostaPagina(1);
      setPropostaWizardEtapaAtiva("revisao");
      if (suprimirProximoToastRascunhoRef.current) {
        suprimirProximoToastRascunhoRef.current = false;
        setPropostaMensagem(null);
      } else {
        setPropostaMensagem(
          eraEdicao
            ? "Alteracoes salvas."
            : "Rascunho salvo. Revise o preview e gere a proposta quando estiver pronto.",
        );
      }
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
    clearAppNavigationSnapshot();
    setAccessToken(response.accessToken);
    setAuthUsuario(response);
    setSessaoMensagem(null);
    setPerfilMensagem(null);
    setClienteMensagem(null);
    setServicoMensagem(null);
    setPropostaMensagem(null);
    setAppViewAnterior(null);
    setRetornoContextual(null);
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
      return perfilForm.formState.isDirty;
    }

    return false;
  }

  function confirmarDescarteAlteracoes() {
    if (!formularioAtualTemAlteracoes()) {
      return Promise.resolve(true);
    }

    return abrirConfirmacaoSistema({
      titulo: "Descartar alterações?",
      mensagem: "Existem alterações não salvas nesta tela.",
      detalhe: "Se continuar, os campos editados voltam ao último estado salvo.",
      variante: "warning",
    });
  }

  function executarComConfirmacaoDescarte(acao: () => void | Promise<void>) {
    void (async () => {
      if (!(await confirmarDescarteAlteracoes())) {
        return;
      }

      await acao();
    })();
  }

  function getSnapshotNavegacaoAtual(): AppNavigationSnapshot {
    return {
      appView,
      clienteModo,
      clienteSelecionadoId,
      servicoModo,
      servicoSelecionadoId,
      propostaModo,
      propostaSelecionadaId,
      propostaAssistenteEtapa,
      propostaWizardEtapaAtiva,
    };
  }

  function mudarAppView(view: AppView) {
    const viewNormalizada: AppView = view === "personalizacao" ? "conta" : view;

    if (viewNormalizada !== appView) {
      setAppViewAnterior(appView);
    }

    setAppView(viewNormalizada);
  }

  function salvarRetornoContextualProposta(label: string) {
    if (appView !== "propostas" || propostaModo === "lista") {
      return;
    }

    setRetornoContextual({
      label,
      snapshot: getSnapshotNavegacaoAtual(),
    });
  }

  function aplicarSnapshotNavegacao(snapshot: AppNavigationSnapshot) {
    setAppView(snapshot.appView === "personalizacao" ? "conta" : snapshot.appView);
    setClienteModo(snapshot.clienteModo);
    setClienteSelecionadoId(snapshot.clienteSelecionadoId);
    setServicoModo(snapshot.servicoModo);
    setServicoSelecionadoId(snapshot.servicoSelecionadoId);
    setPropostaModo(snapshot.propostaModo);
    setPropostaSelecionadaId(snapshot.propostaSelecionadaId);
    setPropostaAssistenteEtapa(snapshot.propostaAssistenteEtapa);
    setPropostaWizardEtapaAtiva(snapshot.propostaWizardEtapaAtiva);
  }

  function voltarContextual() {
    executarComConfirmacaoDescarte(() => {
      if (retornoContextual) {
        aplicarSnapshotNavegacao(retornoContextual.snapshot);
        setRetornoContextual(null);
        setContaMenuAberto(false);
        setMobileMenuAberto(false);
        return;
      }

      if (appView === "clientes" && clienteModo !== "lista") {
        abrirListaClientesSemConfirmar();
        return;
      }

      if (appView === "servicos" && servicoModo !== "lista") {
        abrirListaServicosSemConfirmar();
        return;
      }

      if (appView === "propostas" && propostaModo !== "lista") {
        abrirListaPropostasSemConfirmar();
        return;
      }

      if (appViewAnterior && appViewAnterior !== appView) {
        setAppView(appViewAnterior === "personalizacao" ? "conta" : appViewAnterior);
        setAppViewAnterior(null);
        return;
      }

      setAppView("dashboard");
      setAppViewAnterior(null);
    });
  }

  const textoBotaoVoltarContextual = retornoContextual?.label
    ? retornoContextual.label
    : appView === "clientes" && clienteModo !== "lista"
      ? "Voltar para clientes"
      : appView === "servicos" && servicoModo !== "lista"
        ? "Voltar para serviços"
        : appView === "propostas" && propostaModo !== "lista"
          ? "Voltar para propostas"
          : "Voltar";

  const deveMostrarVoltarContextual =
    Boolean(retornoContextual) ||
    (appView === "clientes" && clienteModo !== "lista") ||
    (appView === "servicos" && servicoModo !== "lista") ||
    (appView === "propostas" && propostaModo !== "lista") ||
    (appView !== "dashboard" && Boolean(appViewAnterior));

  const classeVoltarContextual =
    retornoContextual ||
    (appView === "clientes" && clienteModo !== "lista") ||
    (appView === "servicos" && servicoModo !== "lista") ||
    (appView === "propostas" && propostaModo !== "lista")
      ? "is-contextual"
      : "is-list-level";

  function navegarParaView(view: AppView) {
    executarComConfirmacaoDescarte(() => {
      const viewNormalizada: AppView = view === "personalizacao" ? "conta" : view;

      setContaMenuAberto(false);
      setMobileMenuAberto(false);
      setPropostaVisualizacaoModalId(null);
      setPropostaPreviewModalAberto(false);
      setPropostaTemplateModalAberto(false);
      setPropostaCompartilharModalAberto(false);
      setPersonalizacaoPreviewTemplateAberto(null);
      mudarAppView(viewNormalizada);
      setRetornoContextual(null);

      if (viewNormalizada === "clientes") {
        abrirListaClientesSemConfirmar();
      }

      if (viewNormalizada === "servicos") {
        abrirListaServicosSemConfirmar();
      }

      if (viewNormalizada === "propostas") {
        abrirListaPropostasSemConfirmar();
      }
    });
  }

  function prepararNovoCliente() {
    setClienteSelecionadoId(null);
    setClienteModo("novo");
    setClienteComplementaresAberto(false);
    setClienteMensagem(null);
    resetClienteForm(clienteDefaultValues, { keepDirty: false });
  }

  function abrirListaClientesSemConfirmar() {
    setClienteModo("lista");
    setClienteSelecionadoId(null);
    setClienteComplementaresAberto(false);
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
      salvarRetornoContextualProposta("Voltar para proposta");
      prepararNovoCliente();
      mudarAppView("clientes");
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
      salvarRetornoContextualProposta("Voltar para proposta");
      prepararNovoServico();
      mudarAppView("servicos");
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
    setClienteRapidoComplementaresAberto(false);
    setPropostaWizardEtapaAtiva(clienteId ? "proposta" : "cliente");
    const cliente = findClienteProposta(clienteId);
    const titulo = buildTituloAutomaticoProposta(cliente, null);

    resetPropostaForm(
      {
        ...propostaDefaultValues,
        clienteId,
        titulo,
        templateVisual: perfilTemplateVisualPadrao,
      },
      { keepDirty: false },
    );
    tituloAutomaticoPropostaRef.current = titulo || null;
  }

  function prepararAssistenteNovaProposta() {
    setPropostaSelecionadaId(null);
    setPropostaVisualizacaoModalId(null);
    setPropostaPreviewModalAberto(false);
    setPropostaTemplateModalAberto(false);
    setPropostaCompartilharModalAberto(false);
    setPropostaModo("assistente");
    setPropostaMensagem(null);
    setServicoParaAdicionarId("");
    setClienteRapidoAberto(false);
    setClienteRapidoComplementaresAberto(false);
    setBuscaClienteAssistente("");
    setPropostaAssistenteEtapa(clientes.length > 0 ? "inicio" : "novo");
    setPropostaWizardEtapaAtiva("cliente");
    resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
    resetPropostaForm(
      {
        ...propostaDefaultValues,
        templateVisual: perfilTemplateVisualPadrao,
      },
      { keepDirty: false },
    );
    tituloAutomaticoPropostaRef.current = null;
  }

  function prepararClienteRapidoProposta() {
    resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
    setClienteRapidoComplementaresAberto(false);
  }

  function abrirClienteRapidoAssistente() {
    prepararClienteRapidoProposta();
    setPropostaAssistenteEtapa("novo");
  }

  function voltarInicioAssistenteProposta() {
    prepararClienteRapidoProposta();
    setPropostaAssistenteEtapa("inicio");
  }

  function abrirClienteRapidoModal() {
    prepararClienteRapidoProposta();
    setClienteRapidoAberto(true);
  }

  function cancelarClienteRapido() {
    resetClienteRapidoForm(clienteRapidoDefaultValues);
    setClienteRapidoAberto(false);
    setClienteRapidoComplementaresAberto(false);
  }

  function novaProposta() {
    executarComConfirmacaoDescarte(() => prepararAssistenteNovaProposta());
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
    setClienteRapidoComplementaresAberto(false);
    setBuscaClienteAssistente("");
    setPropostaAssistenteEtapa("inicio");
    setPropostaWizardEtapaAtiva("cliente");
    resetPropostaForm(propostaDefaultValues, { keepDirty: false });
    resetClienteRapidoForm(clienteRapidoDefaultValues, { keepDirty: false });
    tituloAutomaticoPropostaRef.current = null;
  }

  function abrirNovaProposta(clienteId = "") {
    executarComConfirmacaoDescarte(() => {
      setRetornoContextual(null);
      if (clienteId) {
        prepararNovaProposta(clienteId);
      } else {
        prepararAssistenteNovaProposta();
      }
      mudarAppView("propostas");
    });
  }

  function abrirOnboarding(jornada: "conta" | "proposta") {
    setOnboardingJornadaAtiva(jornada);
    setOnboardingModalAberto(true);
  }

  function pularOnboarding() {
    onboardingEventoMutation.mutate({
      tipo: "Pulou",
      etapa: onboardingJornadaAtiva === "conta" ? "configuracao-conta" : "primeira-proposta",
    });
    setOnboardingModalAberto(false);
  }

  function iniciarConfiguracaoContaOnboarding() {
    onboardingMutation.mutate({
      statusConfiguracaoConta: "EmAndamento",
      etapaConfiguracaoConta: perfilContaMinimoCompleto ? "personalizacao" : "dados-marca",
    });
    setOnboardingModalAberto(false);
    navegarParaView("conta");
  }

  function iniciarPrimeiraPropostaOnboarding() {
    onboardingMutation.mutate({
      statusPrimeiraProposta: "EmAndamento",
      etapaPrimeiraProposta: clientes.length > 0 ? "proposta" : "cliente",
    });
    setOnboardingModalAberto(false);
    abrirNovaProposta();
  }

  function iniciarTourOnboarding() {
    onboardingTourEncerradoSessaoRef.current = null;
    if (conta && usuario) {
      onboardingModalDispensadaSessaoRef.current = `${conta.id}:${usuario.id}`;
    }
    limparArtefatosOnboardingTour();
    const abrirMenuMobile = shouldAbrirMenuMobileOnboardingTour(0);
    setOnboardingModalAberto(false);
    setAppView(getOnboardingTourView(0));
    setMobileMenuAberto(abrirMenuMobile);
    setContaMenuAberto(false);
    setSidebarRecolhida(false);
    setOnboardingTourStepIndex(0);
    setOnboardingTourKey((key) => key + 1);
    setOnboardingTourRodando(true);
    onboardingEventoMutation.mutate({ tipo: "TourExibido", etapa: "dashboard" });
  }

  function navegarParaOnboardingTourStep(stepIndex: number) {
    const totalSteps = buildOnboardingTourSteps().length;
    const proximoIndice = Math.max(0, Math.min(stepIndex, totalSteps - 1));
    const proximaView = getOnboardingTourView(proximoIndice);
    const abrirMenuMobile = shouldAbrirMenuMobileOnboardingTour(proximoIndice);

    setAppView(proximaView);
    setMobileMenuAberto(abrirMenuMobile);
    setContaMenuAberto(false);
    setSidebarRecolhida(false);
    setOnboardingTourStepIndex(proximoIndice);
  }

  function encerrarOnboardingTour(data: EventData, statusFinal: "finished" | "skipped") {
    const chaveUsuarioTour = conta && usuario ? `${conta.id}:${usuario.id}` : null;
    onboardingTourEncerradoSessaoRef.current = chaveUsuarioTour;
    onboardingModalDispensadaSessaoRef.current = chaveUsuarioTour;
    setOnboardingTourRodando(false);
    setOnboardingTourStepIndex(0);
    setOnboardingTourKey((key) => key + 1);
    setMobileMenuAberto(false);
    setContaMenuAberto(false);
    limparArtefatosOnboardingTour();
    window.requestAnimationFrame(limparArtefatosOnboardingTour);
    window.setTimeout(limparArtefatosOnboardingTour, 80);
    window.setTimeout(limparArtefatosOnboardingTour, 300);
    onboardingEventoMutation.mutate({
      tipo: statusFinal === "finished" ? "TourConcluiu" : "TourPulou",
      etapa: typeof data.step?.target === "string" ? data.step.target : "dashboard",
    });
  }

  function handleOnboardingTourCallback(data: EventData) {
    if (data.status === "finished" || data.status === "skipped") {
      encerrarOnboardingTour(data, data.status);
      return;
    }

    if (data.type === "tour:end") {
      encerrarOnboardingTour(
        data,
        data.action === "skip" ? "skipped" : "finished",
      );
      return;
    }

    if (data.type === "step:after" || data.type === "error:target_not_found") {
      const indiceAtual = typeof data.index === "number" ? data.index : onboardingTourStepIndex;
      const totalSteps = buildOnboardingTourSteps().length;

      if (data.action !== "prev" && indiceAtual >= totalSteps - 1) {
        encerrarOnboardingTour(data, "finished");
        return;
      }

      navegarParaOnboardingTourStep(
        data.action === "prev"
          ? indiceAtual - 1
          : indiceAtual + 1,
      );
    }
  }

  function selecionarClienteAssistente(clienteId: string) {
    prepararNovaProposta(clienteId);
  }

  function navegarParaEtapaProposta(etapa: PropostaWizardEtapaId) {
    const refs: Record<
      PropostaWizardEtapaId,
      RefObject<HTMLDivElement | null>
    > = {
      cliente: propostaWizardClienteRef,
      proposta: propostaWizardMensagemRef,
      itens: propostaWizardItensRef,
      template: propostaWizardTemplateRef,
      detalhamento: propostaWizardDetalhamentoRef,
      revisao: propostaWizardRevisaoRef,
    };

    setPropostaWizardEtapaAtiva(etapa);
    window.requestAnimationFrame(() => {
      refs[etapa].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  async function validarEtapaPropostaAtual() {
    const camposPorEtapa: Record<
      PropostaWizardEtapaId,
      Array<keyof PropostaFormInput>
    > = {
      cliente: ["clienteId", "validadeDias"],
      proposta: ["titulo"],
      itens: ["itens"],
      template: ["templateVisual"],
      detalhamento: [],
      revisao: [],
    };
    const campos = camposPorEtapa[propostaWizardEtapaAtiva];

    if (campos.length === 0) {
      return propostaWizardEtapaAtiva === "revisao"
        ? propostaForm.trigger()
        : true;
    }

    const etapaValida = await propostaForm.trigger(campos);

    if (!etapaValida) {
      setPropostaMensagem(
        "Preencha os campos obrigatórios desta etapa antes de continuar.",
      );
    } else {
      setPropostaMensagem(null);
    }

    return etapaValida;
  }

  async function avancarEtapaProposta() {
    const etapaValida = await validarEtapaPropostaAtual();

    if (!etapaValida) {
      return;
    }

    const indiceAtual = propostaWizardEtapasOrdem.indexOf(
      propostaWizardEtapaAtiva,
    );
    const proximaEtapa = propostaWizardEtapasOrdem[indiceAtual + 1];

    if (proximaEtapa) {
      navegarParaEtapaProposta(proximaEtapa);
    }
  }

  function voltarEtapaProposta() {
    const indiceAtual = propostaWizardEtapasOrdem.indexOf(
      propostaWizardEtapaAtiva,
    );
    const etapaAnterior = propostaWizardEtapasOrdem[indiceAtual - 1];

    if (etapaAnterior) {
      navegarParaEtapaProposta(etapaAnterior);
    }
  }

  async function gerarPropostaDoFluxo() {
    const formularioValido = await propostaForm.trigger();

    if (!formularioValido) {
      const etapa = getPrimeiraEtapaPendenteProposta(propostaForm.getValues());
      navegarParaEtapaProposta(etapa);
      setPropostaMensagem(
        "Revise os campos obrigatórios antes de gerar a proposta.",
      );
      return;
    }

    if (!contaPodeExportarProposta) {
      navegarParaEtapaProposta("revisao");
      setPropostaMensagem(mensagemBloqueioPlano);
      return;
    }

    navegarParaEtapaProposta("revisao");

    try {
      const precisaSalvarAntesDeGerar = !propostaSelecionada || propostaTemAlteracoes;

      if (precisaSalvarAntesDeGerar) {
        suprimirProximoToastRascunhoRef.current = true;
      }

      const propostaBase = precisaSalvarAntesDeGerar
        ? await salvarPropostaMutation.mutateAsync(propostaForm.getValues())
        : propostaSelecionada;

      if (!propostaBase) {
        return;
      }

      await gerarPropostaMutation.mutateAsync(propostaBase.id);
    } catch {
      suprimirProximoToastRascunhoRef.current = false;
      // As mutations ja exibem os erros nos componentes de mensagem.
    }
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
      const clienteParaEditar = clientes.find((cliente) => cliente.id === clienteId);
      setClienteSelecionadoId(clienteId);
      setClienteModo("editar");
      setClienteComplementaresAberto(
        hasClienteDadosComplementares(clienteParaEditar),
      );
      setClienteMensagem(null);
    });
  }

  function visualizarCliente(clienteId: string) {
    executarComConfirmacaoDescarte(() => {
      const clienteParaVisualizar = clientes.find(
        (cliente) => cliente.id === clienteId,
      );
      setClienteSelecionadoId(clienteId);
      setClienteModo("visualizar");
      setClienteComplementaresAberto(
        hasClienteDadosComplementares(clienteParaVisualizar),
      );
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
    executarComConfirmacaoDescarte(async () => {
      const propostaParaEditar = propostas.find(
        (proposta) => proposta.id === propostaId,
      );

      if (
        propostaParaEditar &&
        !isStatusPropostaEditavelDiretamente(propostaParaEditar.status)
      ) {
        setPropostaMensagem(mensagemPropostaNaoEditavel);
        return;
      }

      if (
        propostaParaEditar?.status === "Gerada" &&
        !(await abrirConfirmacaoSistema({
          titulo: "Editar proposta gerada?",
          mensagem:
            "Ao salvar uma proposta já gerada, ela voltará para rascunho.",
          detalhe:
            "Depois de ajustar os dados, gere a proposta novamente para liberar impressão e envio.",
          variante: "warning",
        }))
      ) {
        return;
      }

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

  async function selecionarTemplateProposta(templateVisual: string) {
    const templateAnterior = propostaForm.getValues("templateVisual");
    const templateNovo = normalizarTemplateVisual(templateVisual);
    const propostaJaGerada =
      propostaSelecionada &&
      propostaSelecionada.status !== "Rascunho" &&
      propostaSelecionada.status !== "Arquivada";

    if (templateNovo === templateAnterior) {
      return true;
    }

    if (
      propostaJaGerada &&
      !(await abrirConfirmacaoSistema({
        titulo: "Alterar template?",
        mensagem:
          "Alterar o template de uma proposta já gerada volta o status para rascunho ao salvar.",
        detalhe: "O layout novo será usado no preview, PDF, imagem e compartilhamento.",
        variante: "warning",
      }))
    ) {
      propostaForm.setValue("templateVisual", templateAnterior, {
        shouldDirty: false,
        shouldValidate: true,
      });
      return false;
    }

    propostaForm.setValue("templateVisual", templateNovo, {
      shouldDirty: true,
      shouldValidate: true,
    });
    return true;
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

  function imprimirPropostaSalva(proposta: PropostaResponse) {
    if (
      !isStatusPropostaComDocumentoFinal(proposta.status) ||
      !contaPodeExportarProposta
    ) {
      return;
    }

    flushSync(() => {
      setPropostaImpressaoId(proposta.id);
    });
    window.print();
  }

  function abrirModalCompartilharProposta(proposta: PropostaResponse) {
    if (
      !isStatusPropostaComDocumentoFinal(proposta.status) ||
      !contaPodeExportarProposta
    ) {
      return;
    }

    setPropostaCompartilhamentoId(proposta.id);
    setPropostaCompartilharModalAberto(true);
  }

  function fecharModalCompartilharProposta() {
    setPropostaCompartilharModalAberto(false);
    setPropostaCompartilhamentoId(null);
  }

  async function baixarImagemPropostaSalva(
    proposta: PropostaResponse,
    node: HTMLDivElement | null,
  ) {
    if (
      !isStatusPropostaComDocumentoFinal(proposta.status) ||
      !contaPodeExportarProposta
    ) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const nodeExportacao = await aguardarNodeExportacaoProposta(
        () => node ?? propostaCompartilhamentoDocumentoRef.current,
      );
      const blob = await gerarPngPropostaBlob(nodeExportacao, {
        ocultarCtaAprovacao: true,
      });
      baixarBlobArquivo(blob, `${buildNomeArquivoProposta(proposta)}.png`);
      setPropostaExportacaoMensagem("Imagem gerada. Anexe este arquivo no WhatsApp Web.");
    });
  }

  async function baixarPdfPropostaSalva(
    proposta: PropostaResponse,
    node: HTMLDivElement | null,
  ) {
    if (
      !isStatusPropostaComDocumentoFinal(proposta.status) ||
      !contaPodeExportarProposta
    ) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const nodeExportacao = await aguardarNodeExportacaoProposta(
        () =>
          node ??
          propostaCompartilhamentoDocumentoRef.current ??
          propostaVisualizacaoExportDocumentoRef.current ??
          propostaVisualizacaoDocumentoRef.current,
      );
      const blob = await gerarPdfPropostaBlob(nodeExportacao, proposta);
      baixarBlobArquivo(blob, `${buildNomeArquivoProposta(proposta)}.pdf`);
      setPropostaExportacaoMensagem("PDF gerado. Anexe este arquivo no WhatsApp Web.");
    });
  }

  async function enviarMensagemInicialComAnexoProposta(
    proposta: PropostaResponse,
    node: HTMLDivElement | null,
  ) {
    if (
      !isStatusPropostaComDocumentoFinal(proposta.status) ||
      !contaPodeExportarProposta
    ) {
      return;
    }

    await executarExportacaoProposta(async () => {
      const formatoPreferido = normalizarFormatoArquivoPreferido(
        perfilConta?.formatoArquivoPreferido,
      );
      const nodeExportacao = await aguardarNodeExportacaoProposta(
        () =>
          node ??
          propostaCompartilhamentoDocumentoRef.current ??
          propostaVisualizacaoExportDocumentoRef.current ??
          propostaVisualizacaoDocumentoRef.current,
      );
      const anexos = await gerarArquivosAnexoProposta(
        nodeExportacao,
        proposta,
        formatoPreferido,
      );
      const mensagem = buildMensagemWhatsappProposta(
        proposta,
        clienteCompartilhamentoAtivo,
        perfilConta,
        conta?.nome ?? "Emprely",
        "arquivo",
      );
      const arquivosCompartilhamento = anexos.map(
        (anexo) => new File([anexo.blob], anexo.nomeArquivo, { type: anexo.tipo }),
      );
      const podeCompartilharArquivo =
        !isViewportDesktopInicial() &&
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        (!navigator.canShare ||
          navigator.canShare({
            files: arquivosCompartilhamento,
          }));

      if (podeCompartilharArquivo) {
        await navigator.share({
          title: proposta.titulo,
          text: mensagem,
          files: arquivosCompartilhamento,
        });
        setPropostaExportacaoMensagem(
          `${getDescricaoArquivoPreferidoCompartilhamento(formatoPreferido)} e mensagem enviados para compartilhamento.`,
        );
        fecharModalCompartilharProposta();
        return;
      }

      fecharModalCompartilharProposta();
      anexos.forEach((anexo) => baixarBlobArquivo(anexo.blob, anexo.nomeArquivo));
      window.open(whatsappPropostaArquivoUrl, "_blank", "noopener,noreferrer");
      setPropostaExportacaoMensagem(
        `Proposta baixada na sua pasta Downloads como ${getDescricaoArquivoPreferidoAnexo(formatoPreferido)}. O WhatsApp foi aberto; basta anexar ${getInstrucaoAnexoWhatsapp(formatoPreferido)} na conversa.`,
      );
    });
  }

  async function executarExportacaoProposta(
    exportar: () => Promise<void>,
  ): Promise<void> {
    try {
      setPropostaExportacaoMensagem("Gerando arquivo do orçamento...");
      await exportar();
    } catch {
      setPropostaExportacaoMensagem(
        "Não foi possível gerar o arquivo. Tente novamente ou use a opção de imprimir.",
      );
    }
  }

  async function gerarArquivosAnexoProposta(
    nodeExportacao: HTMLDivElement,
    proposta: PropostaResponse,
    formatoPreferido: FormatoArquivoPreferido,
  ): Promise<
    Array<{ blob: Blob; nomeArquivo: string; tipo: "application/pdf" | "image/png" }>
  > {
    const nomeBase = buildNomeArquivoProposta(proposta);

    if (formatoPreferido === "Imagem") {
      const blob = await gerarPngPropostaBlob(nodeExportacao, {
        ocultarCtaAprovacao: true,
      });

      return [
        {
          blob,
          nomeArquivo: `${nomeBase}.png`,
          tipo: "image/png",
        },
      ];
    }

    if (formatoPreferido === "PdfImagem") {
      const [pdfBlob, pngBlob] = await Promise.all([
        gerarPdfPropostaBlob(nodeExportacao, proposta),
        gerarPngPropostaBlob(nodeExportacao, {
          ocultarCtaAprovacao: true,
        }),
      ]);

      return [
        {
          blob: pdfBlob,
          nomeArquivo: `${nomeBase}.pdf`,
          tipo: "application/pdf",
        },
        {
          blob: pngBlob,
          nomeArquivo: `${nomeBase}.png`,
          tipo: "image/png",
        },
      ];
    }

    const blob = await gerarPdfPropostaBlob(nodeExportacao, proposta);

    return [
      {
        blob,
        nomeArquivo: `${nomeBase}.pdf`,
        tipo: "application/pdf",
      },
    ];
  }

  async function aguardarNodeExportacaoProposta(
    getNode: () => HTMLDivElement | null,
  ): Promise<HTMLDivElement> {
    const nodeAtual = getNode();

    if (nodeAtual?.isConnected) {
      return nodeAtual;
    }

    await aguardarProximoFrame();

    const nodeAposFrame = getNode();

    if (nodeAposFrame?.isConnected) {
      return nodeAposFrame;
    }

    throw new Error("Documento da proposta nao encontrado para exportacao.");
  }

  function buildDocumentoDadosPropostaSalva(
    proposta: PropostaResponse,
  ): PropostaDocumentoDados {
    const corPrimaria = normalizarHexPreview(
      perfilConta?.corPrimaria ?? "#6E38FF",
    );
    const corSecundaria = normalizarHexPreview(
      perfilConta?.corSecundaria ?? "#13C7BD",
    );
    const templateVisual = normalizarTemplateVisual(proposta.templateVisual);
    const nomeMarca = perfilConta?.nomeComercial?.trim() || conta?.nome || "Emprely";
    const cliente = clientes.find((item) => item.id === proposta.clienteId);
    const itens = proposta.itens ?? [];

    return {
      templateVisual,
      templateLabel: getPropostaTemplateLabel(templateVisual),
      nomeMarca,
      logoUrl: resolveApiAssetUrl(perfilConta?.logoUrl) || null,
      titulo: proposta.titulo?.trim() || "Proposta comercial",
      introducao: proposta.introducao?.trim() || null,
      observacoes: proposta.observacoes?.trim() || null,
      clienteNome: cliente?.nome ?? proposta.clienteNome ?? "",
      dataTexto: new Intl.DateTimeFormat("pt-BR").format(
        new Date(proposta.updatedAt ?? proposta.createdAt),
      ),
      validadeTexto: formatValidadeProposta(proposta.validadeDias ?? undefined),
      numeroTexto: formatNumeroProposta(proposta.numero),
      tipoTexto: inferirTipoProposta(
        {
          titulo: proposta.titulo,
          introducao: proposta.introducao ?? undefined,
          observacoes: proposta.observacoes ?? undefined,
          templateVisual,
        },
        itens.map((item) => ({
          servicoId: item.servicoId ?? undefined,
          nome: item.nome,
          descricao: item.descricao ?? undefined,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
        })),
      ),
      contatoMarca: buildContatoMarca(perfilConta),
      telefoneMarca: formatTelefoneOpcional(perfilConta?.telefoneContato),
      emailMarca: perfilConta?.emailContato?.trim() ?? "",
      instagramMarca: normalizarInstagramDocumento(perfilConta?.instagram),
      siteMarca: perfilConta?.siteUrl?.trim() ?? "",
      publicApprovalUrl: proposta.publicApprovalUrl?.trim() || null,
      watermark: getWatermarkDocumentoProposta(
        conta?.plano ?? "Trial",
        conta ? getStatusComercialContaEfetivo(conta, billingStatusQuery.data) : "TrialAtivo",
      ),
      itens: itens
        .map((item) => ({
          nome: item.nome?.trim() ?? "",
          descricao: item.descricao?.trim() ?? "",
          quantidade: valorSeguro(item.quantidade),
          valorUnitario: valorSeguro(item.valorUnitario),
          total: valorSeguro(item.total),
        }))
        .filter((item) => item.nome.length > 0),
      beneficios: proposta.beneficios ?? [],
      itensInclusos: proposta.itensInclusos ?? [],
      itensNaoInclusos: proposta.itensNaoInclusos ?? [],
      cronograma: proposta.cronograma ?? [],
      condicoesPagamento: proposta.condicoesPagamento?.trim() || null,
      subtotal: getSubtotalProposta(proposta),
      desconto: valorSeguro(proposta.descontoValor),
      total: valorSeguro(proposta.total),
      corPrimaria,
      corSecundaria,
    };
  }

  async function gerarPngPropostaBlob(
    nodeReferencia: HTMLDivElement | null = propostaDocumentoRef.current,
    options: { ocultarCtaAprovacao?: boolean } = {},
  ): Promise<Blob> {
    const node = nodeReferencia;

    if (!node) {
      throw new Error("Preview da proposta não encontrado.");
    }

    const { toBlob } = await import("html-to-image");
    if (options.ocultarCtaAprovacao) {
      node.classList.add("is-exporting-image");
    }

    let blob: Blob | null = null;

    try {
      blob = await toBlob(node, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        imagePlaceholder: imagemTransparenteExportacaoDataUrl,
        pixelRatio: 2,
      });
    } finally {
      if (options.ocultarCtaAprovacao) {
        node.classList.remove("is-exporting-image");
      }
    }

    if (!blob) {
      throw new Error("Imagem da proposta não gerada.");
    }

    return blob;
  }

  async function gerarPdfPropostaBlob(
    nodeReferencia: HTMLDivElement | null = propostaDocumentoRef.current,
    proposta?: PropostaResponse,
  ): Promise<Blob> {
    if (!proposta) {
      throw new Error("Proposta nao informada para gerar PDF.");
    }

    const documento = buildDocumentoDadosPropostaSalva(proposta);
    const pngBlob = await gerarPngPropostaBlob(nodeReferencia);
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
    const escalaLargura = larguraDisponivel / tamanhoImagem.width;
    const escalaAltura = alturaDisponivel / tamanhoImagem.height;
    const escala = Math.min(escalaLargura, escalaAltura);
    const larguraImagem = tamanhoImagem.width * escala;
    const alturaImagem = tamanhoImagem.height * escala;
    const posicaoX = (larguraPagina - larguraImagem) / 2;

    pdf.addImage(
      pngDataUrl,
      "PNG",
      posicaoX,
      margem,
      larguraImagem,
      alturaImagem,
    );
    adicionarLinksPdfPorDataAttribute(pdf, nodeReferencia, {
      x: posicaoX,
      y: margem,
      width: larguraImagem,
      height: alturaImagem,
    });

    if (documento.publicApprovalUrl) {
      const areaLink = calcularAreaLinkAprovacaoPdf(nodeReferencia, {
        x: posicaoX,
        y: margem,
        width: larguraImagem,
        height: alturaImagem,
      });
      const areaFallback = {
        x: larguraPagina - margem - 150,
        y: alturaPagina - margem - 54,
        width: 126,
        height: 38,
      };
      const area = areaLink ?? areaFallback;

      pdf.link(area.x, area.y, area.width, area.height, {
        url: documento.publicApprovalUrl,
      });
    }

    return pdf.output("blob");
  }

  function marcarPropostaEnviada(proposta: PropostaResponse) {
    if (proposta.status !== "Gerada" || !contaPodeExportarProposta) {
      return;
    }

    enviarPropostaMutation.mutate(proposta.id);
  }

  async function marcarPropostaAceita(proposta: PropostaResponse) {
    if (proposta.status !== "Enviada") {
      return;
    }

    if (
      await abrirConfirmacaoSistema({
        titulo: "Marcar como aceita?",
        mensagem: `Confirmar a proposta "${proposta.titulo}" como aceita?`,
        detalhe: "O status será atualizado e a proposta continuará disponível no histórico.",
        variante: "success",
      })
    ) {
      aceitarPropostaMutation.mutate(proposta.id);
    }
  }

  async function marcarPropostaRecusada(proposta: PropostaResponse) {
    if (proposta.status !== "Enviada") {
      return;
    }

    if (
      await abrirConfirmacaoSistema({
        titulo: "Marcar como recusada?",
        mensagem: `Confirmar a proposta "${proposta.titulo}" como recusada?`,
        detalhe: "O status será atualizado e a proposta continuará disponível no histórico.",
        variante: "warning",
      })
    ) {
      recusarPropostaMutation.mutate(proposta.id);
    }
  }

  async function arquivarClienteComConfirmacao(cliente: ClienteResponse) {
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
      await abrirConfirmacaoSistema({
        titulo: "Excluir cliente?",
        mensagem: `Arquivar o cliente "${cliente.nome}"?`,
        detalhe: `Ele sairá da lista ativa.${complemento}`,
        variante: "danger",
      })
    ) {
      arquivarClienteMutation.mutate(cliente.id);
    }
  }

  async function arquivarServicoComConfirmacao(servico: ServicoResponse) {
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
      await abrirConfirmacaoSistema({
        titulo: "Excluir serviço?",
        mensagem: `Arquivar o serviço "${servico.nome}"?`,
        detalhe: `Ele sairá do catálogo ativo.${complemento}`,
        variante: "danger",
      })
    ) {
      arquivarServicoMutation.mutate(servico.id);
    }
  }

  async function arquivarPropostaComConfirmacao(proposta: PropostaResponse) {
    if (
      await abrirConfirmacaoSistema({
        titulo: "Excluir proposta?",
        mensagem: `Arquivar a proposta "${proposta.titulo}"?`,
        detalhe: "Ela sairá do histórico ativo.",
        variante: "danger",
      })
    ) {
      arquivarPropostaMutation.mutate(proposta.id);
    }
  }

  function duplicarPropostaComConfirmacao(proposta: PropostaResponse) {
    executarComConfirmacaoDescarte(async () => {
      if (
        await abrirConfirmacaoSistema({
          titulo: "Duplicar proposta?",
          mensagem: `Duplicar a proposta "${proposta.titulo}" como novo rascunho?`,
          detalhe: "A proposta original não será alterada.",
          variante: "info",
        })
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
        )}. O limite recomendado é ${logoArquivoTamanhoMaximoLabel}.`,
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

  async function limparLogomarcaPerfil() {
    if (
      !(await abrirConfirmacaoSistema({
        titulo: "Limpar logomarca?",
        mensagem: "Remover a logomarca atual do perfil?",
        detalhe: "A remoção só será aplicada quando você salvar o perfil.",
        variante: "danger",
      }))
    ) {
      return;
    }

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
  const templatePreviewIndice = templatePreviewAberto
    ? propostaTemplateVisualOpcoesGaleria.findIndex(
        (template) => template.value === templatePreviewAberto,
      )
    : -1;
  const templatePreviewAnterior =
    templatePreviewIndice >= 0
      ? propostaTemplateVisualOpcoesGaleria[
          (templatePreviewIndice - 1 + propostaTemplateVisualOpcoesGaleria.length) %
            propostaTemplateVisualOpcoesGaleria.length
        ]?.value
      : null;
  const templatePreviewProximo =
    templatePreviewIndice >= 0
      ? propostaTemplateVisualOpcoesGaleria[
          (templatePreviewIndice + 1) % propostaTemplateVisualOpcoesGaleria.length
        ]?.value
      : null;
  const perfilContaPersonalizacaoPreview: PerfilContaResponse | undefined = conta
    ? {
        id: perfilConta?.id ?? null,
        contaId: perfilConta?.contaId ?? conta.id,
        nomeComercial:
          perfilPersonalizacaoPreview.nomeComercial?.trim() ||
          perfilConta?.nomeComercial ||
          conta.nome,
        segmento:
          perfilPersonalizacaoPreview.segmento?.trim() ||
          perfilConta?.segmento ||
          null,
        cidadeUf:
          perfilPersonalizacaoPreview.cidadeUf?.trim() ||
          perfilConta?.cidadeUf ||
          null,
        emailContato:
          perfilPersonalizacaoPreview.emailContato?.trim() ||
          perfilConta?.emailContato ||
          null,
        telefoneContato:
          formatTelefoneOpcional(perfilPersonalizacaoPreview.telefoneContato) ||
          formatTelefoneOpcional(perfilConta?.telefoneContato) ||
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
        formatoArquivoPreferido: normalizarFormatoArquivoPreferido(
          perfilPersonalizacaoPreview.formatoArquivoPreferido,
        ),
        updatedAt: perfilConta?.updatedAt ?? null,
      }
    : perfilConta;
  const perfilContaChecklist = buildPerfilContaChecklist(perfilPersonalizacaoPreview);
  const perfilContaChecklistConcluidos = perfilContaChecklist.filter(
    (item) => item.completo,
  ).length;
  const perfilContaCompleto =
    perfilContaChecklistConcluidos === perfilContaChecklist.length;
  const personalizacaoPreviewItens: NonNullable<PropostaPreviewInput["itens"]> = [
    {
      nome: "Plano de execução mensal",
      descricao: "Planejamento, entregas e acompanhamento estratégico.",
      quantidade: 1,
      valorUnitario: 1200,
    },
    {
      nome: "Pacote de entregáveis",
      descricao: "Itens profissionais alinhados ao escopo contratado.",
      quantidade: 8,
      valorUnitario: 80,
    },
    {
      nome: "Entrega complementar",
      descricao: "Produção, revisão e finalização do material combinado.",
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
    titulo: "Proposta comercial",
    introducao:
      "Preview real para conferir como o template padrão será impresso e compartilhado.",
    observacoes:
      "A logomarca, as cores e os dados da conta seguem as configurações atuais.",
    validadeDias: 7,
    templateVisual:
      personalizacaoPreviewTemplateAberto ?? templateVisualPersonalizacaoPreview,
    itens: personalizacaoPreviewItens,
    descontoValor: personalizacaoPreviewDesconto,
    condicoesPagamento:
      "50% na aprovação e 50% em até 15 dias após o início dos serviços.",
    itensInclusosTexto:
      "Planejamento inicial\nCronograma de execução\nAcompanhamento do projeto\nRelatório simples",
    itensNaoInclusosTexto:
      "Custos de terceiros\nDeslocamentos presenciais\nItens fora do escopo aprovado",
    cronogramaTexto:
      "Início em até 3 dias úteis\nPlano mensal com recorrência mínima de 3 meses\n2 rodadas de revisão",
    beneficiosTexto:
      "Execução organizada\nComunicação clara\nControle de entregas\nMais previsibilidade",
  };

  const podeLimparLogomarca = Boolean(
    logoPreviewAtualUrl || logoArquivoPendente || logoUrlPerfilForm,
  );
  const propostaStatusMutationPendente =
    enviarPropostaMutation.isPending ||
    aceitarPropostaMutation.isPending ||
    recusarPropostaMutation.isPending;
  const exibindoSuportePublico = isSuportePublicoPath();
  const exibindoBillingPublico = isBillingRegularizarPath() || Boolean(publicBillingPaymentToken);
  const tituloTelaMobile = getAppViewLabel(appView);

  return (
    <div className="app-shell min-h-screen bg-background text-foreground">
      {usuario && conta && onboardingTourRodando ? (
        <Joyride
          key={onboardingTourKey}
          continuous
          onEvent={handleOnboardingTourCallback}
          locale={{
            back: "Voltar",
            close: "Fechar",
            last: "Concluir",
            next: "Próximo",
            nextWithProgress: "Próximo ({current} de {total})",
            open: "Abrir",
            skip: "Pular",
          }}
          options={{
            blockTargetInteraction: true,
            buttons: ["skip", "back", "primary"],
            closeButtonAction: "skip",
            overlayClickAction: false,
            overlayColor: "rgba(2, 6, 23, 0.78)",
            primaryColor: "#2563eb",
            scrollOffset: 88,
            showProgress: true,
            spotlightPadding: 6,
            spotlightRadius: 10,
          }}
          run={onboardingTourRodando}
          scrollToFirstStep
          stepIndex={onboardingTourStepIndex}
          steps={buildOnboardingTourSteps()}
          styles={{
            tooltip: {
              borderRadius: 8,
              boxShadow: "0 24px 70px rgba(2, 6, 23, 0.28)",
              maxWidth: 360,
              width: "min(360px, calc(100vw - 32px))",
            },
            tooltipTitle: {
              color: "#0f172a",
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.25,
            },
            tooltipContent: {
              color: "#475569",
              fontSize: 14,
              lineHeight: 1.55,
              padding: "12px 0",
            },
          }}
        />
      ) : null}
      <div
        className={`app-frame mx-auto min-h-screen w-full ${
          usuario && conta
            ? `app-frame-auth grid ${sidebarRecolhida ? "is-sidebar-collapsed" : ""}`
            : "app-frame-public flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        {!usuario || !conta ? (
          <header className="app-header app-header-public flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <BrandAssinatura
              nomeMarca="Emprely Orçamentos"
              subtitulo="Propostas que impulsionam"
              logoUrl={emprelyFaviconSrc}
              mostrarEmprelySecundario={false}
            />
            <button
              type="button"
              onClick={() => {
                if (exibindoSuportePublico || exibindoBillingPublico) {
                  window.history.pushState(null, "", "/");
                }

                setAuthMode("login");
              }}
              className="brand-primary-action inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <FileText size={18} aria-hidden="true" />
              Entrar
            </button>
          </header>
        ) : null}

        <main
          className={
            usuario && conta
              ? "app-main-area"
              : "grid flex-1 gap-5 py-6"
          }
        >
          {usuario && conta ? (
            <>
              <header className="mobile-app-topbar">
                <button
                  type="button"
                  className="mobile-topbar-icon-button"
                  aria-label="Abrir menu"
                  aria-expanded={mobileMenuAberto}
                  aria-controls="mobile-navigation-drawer"
                  onClick={() => {
                    setContaMenuAberto(false);
                    setMobileMenuAberto(true);
                  }}
                >
                  <Menu size={22} aria-hidden="true" />
                </button>
                <div className="mobile-topbar-account">
                  {logoMarcaTopo ? (
                    <img src={logoMarcaTopo} alt="" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">
                      {nomeMarcaTopo.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <strong>{tituloTelaMobile}</strong>
                    <small>{nomeMarcaTopo}</small>
                  </div>
                </div>
              </header>

              {mobileMenuAberto ? (
                <div
                  className="mobile-navigation-overlay"
                  role="presentation"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                      setMobileMenuAberto(false);
                    }
                  }}
                >
                  <aside
                    id="mobile-navigation-drawer"
                    className="mobile-navigation-drawer"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu principal"
                  >
                    <div className="mobile-drawer-header">
                      <div className="mobile-drawer-account">
                        {logoMarcaTopo ? (
                          <img src={logoMarcaTopo} alt="" aria-hidden="true" />
                        ) : (
                          <span aria-hidden="true">
                            {nomeMarcaTopo.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <strong>{nomeMarcaTopo}</strong>
                          <small>{subtituloMarcaTopo}</small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="mobile-topbar-icon-button"
                        aria-label="Fechar menu"
                        onClick={() => setMobileMenuAberto(false)}
                      >
                        <X size={20} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mobile-drawer-primary-actions">
                      <button
                        type="button"
                        className="mobile-drawer-primary-button"
                        onClick={() => {
                          setMobileMenuAberto(false);
                          novaProposta();
                        }}
                      >
                        <Plus size={18} aria-hidden="true" />
                        Nova proposta
                      </button>
                      <button
                        type="button"
                        className="mobile-drawer-secondary-button"
                        data-testid="mobile-drawer-action-new-client"
                        onClick={() => {
                          setMobileMenuAberto(false);
                          abrirNovoCliente();
                        }}
                      >
                        <UsersRound size={17} aria-hidden="true" />
                        Novo cliente
                      </button>
                      <button
                        type="button"
                        className="mobile-drawer-secondary-button"
                        data-testid="mobile-drawer-action-new-service"
                        onClick={() => {
                          setMobileMenuAberto(false);
                          abrirNovoServico();
                        }}
                      >
                        <PackageCheck size={17} aria-hidden="true" />
                        Novo servico
                      </button>
                    </div>

                    <nav className="mobile-drawer-nav" aria-label="Navegação principal">
                      {navegacaoPrincipal.map((item) => {
                        const Icon = item.icon;
                        const itemAtivo = appView === item.view;

                        return (
                          <button
                            key={item.label}
                            type="button"
                            className={`mobile-drawer-nav-item ${
                              itemAtivo ? "is-active" : ""
                            }`}
                            data-tour={item.tourKey ? `menu-${item.tourKey}` : undefined}
                            data-testid={`mobile-drawer-nav-${item.view}`}
                            aria-current={itemAtivo ? "page" : undefined}
                            onClick={() => navegarParaView(item.view)}
                          >
                            <Icon size={18} aria-hidden="true" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>

                    <div className="mobile-drawer-section">
                      <p>Conta</p>
                      <button
                        type="button"
                        className={`mobile-drawer-nav-item ${
                          appView === "conta" ? "is-active" : ""
                        }`}
                        data-tour="menu-conta"
                        onClick={() => navegarParaView("conta")}
                      >
                        <UserRound size={18} aria-hidden="true" />
                        <span>Perfil da conta</span>
                      </button>
                    </div>

                    <div className="mobile-drawer-theme" aria-label="Tema visual">
                      <button
                        type="button"
                        aria-pressed={temaVisual === "light"}
                        className={temaVisual === "light" ? "is-active" : ""}
                        onClick={() => setTemaVisual("light")}
                      >
                        <Sun size={16} aria-hidden="true" />
                        Claro
                      </button>
                      <button
                        type="button"
                        aria-pressed={temaVisual === "dark"}
                        className={temaVisual === "dark" ? "is-active" : ""}
                        onClick={() => setTemaVisual("dark")}
                      >
                        <Moon size={16} aria-hidden="true" />
                        Escuro
                      </button>
                    </div>

                    <button
                      type="button"
                      className="mobile-drawer-logout"
                      onClick={() => {
                        setMobileMenuAberto(false);
                        logoutUsuario();
                      }}
                    >
                      <LogOut size={18} aria-hidden="true" />
                      Sair
                    </button>
                  </aside>
                </div>
              ) : null}

              <nav
                className={`mobile-bottom-nav ${
                  propostaEditorAtivo || propostaModo === "assistente" ? "is-hidden" : ""
                }`}
                aria-label="Navegação rápida mobile"
              >
                {[
                  { label: "Início", view: "dashboard" as AppView, icon: LayoutDashboard },
                  { label: "Propostas", view: "propostas" as AppView, icon: FileText },
                  { label: "Clientes", view: "clientes" as AppView, icon: UsersRound },
                  { label: "Serviços", view: "servicos" as AppView, icon: PackageCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const ativo = appView === item.view;

                  return (
                    <button
                      key={item.view}
                      type="button"
                      aria-current={ativo ? "page" : undefined}
                      className={ativo ? "is-active" : ""}
                      onClick={(event) => {
                        event.currentTarget.blur();
                        navegarParaView(item.view);
                      }}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Abrir mais opções"
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    setContaMenuAberto(false);
                    setMobileMenuAberto(true);
                  }}
                >
                  <Menu size={18} aria-hidden="true" />
                  <span>Mais</span>
                </button>
              </nav>
            </>
          ) : null}

          {usuario && conta ? (
            <nav
              className={`app-sidebar border-r border-border bg-surface ${
                sidebarRecolhida ? "is-collapsed" : ""
              }`}
            >
              <div
                ref={contaMenuRef}
                className="sidebar-account sidebar-account-top relative rounded-md border border-border bg-white p-2"
              >
                <button
                  type="button"
                  className="sidebar-account-button tooltip-icon-button flex w-full items-center gap-3 rounded-md p-2 text-left"
                  aria-haspopup="menu"
                  aria-expanded={contaMenuAberto}
                  data-tour="menu-conta"
                  data-tooltip={nomeMarcaTopo}
                  title={`${nomeMarcaTopo} - ${subtituloMarcaTopo}`}
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
                  <span className="sidebar-account-copy min-w-0 flex-1">
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
                      contaMenuAberto ? "" : "rotate-180"
                    }`}
                  />
                </button>
                {contaMenuAberto ? (
                  <div className="sidebar-account-menu" role="menu">
                    <div className="sidebar-account-menu-summary" aria-hidden="true">
                      <strong>{nomeMarcaTopo}</strong>
                      <span>{subtituloMarcaTopo}</span>
                    </div>
                    <span className="sidebar-account-menu-divider" aria-hidden="true" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => navegarParaView("conta")}
                      className={`sidebar-account-menu-item ${
                        appView === "conta" ? "is-active" : ""
                      }`}
                    >
                      <UserRound size={16} aria-hidden="true" />
                      Perfil da conta
                    </button>
                    <span className="sidebar-account-menu-divider" aria-hidden="true" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setContaMenuAberto(false);
                        logoutUsuario();
                      }}
                      className="sidebar-account-menu-item sidebar-account-menu-item-danger"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      Sair
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="sidebar-collapse-divider">
                <button
                  type="button"
                  onClick={() => {
                    setContaMenuAberto(false);
                    setSidebarRecolhida((recolhida) => !recolhida);
                  }}
                  aria-label={sidebarRecolhida ? "Expandir menu lateral" : "Recolher menu lateral"}
                  data-tooltip={sidebarRecolhida ? "Expandir menu" : "Recolher menu"}
                  className="sidebar-collapse-toggle tooltip-icon-button"
                >
                  {sidebarRecolhida ? (
                    <ChevronsRight size={17} aria-hidden="true" />
                  ) : (
                    <ChevronsLeft size={17} aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="sidebar-menu mt-5 space-y-1">
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
                        data-tour={item.tourKey ? `menu-${item.tourKey}` : undefined}
                        data-tooltip={item.label}
                        className={`app-nav-item tooltip-icon-button flex h-11 min-w-0 flex-1 items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                          itemAtivo
                            ? "is-active bg-slate-100 text-foreground"
                            : "text-muted hover:bg-slate-100 hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="app-nav-label truncate">{item.label}</span>
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
              <div className="sidebar-product-brand sidebar-product-brand-footer flex items-center gap-3 rounded-md border border-border bg-white p-2">
                <img
                  src={emprelyFaviconSrc}
                  alt=""
                  className="h-9 w-9 rounded-md object-contain"
                  aria-hidden="true"
                />
                <div className="sidebar-brand-copy">
                  <strong className="block font-heading text-sm font-semibold text-foreground">
                    Emprely
                  </strong>
                  <span className="text-xs font-semibold text-primary">
                    Orçamentos
                  </span>
                </div>
              </div>
            </nav>
          ) : null}

          <section
            className={`app-content view-transition ${
              appView === "propostas" && propostaModo !== "lista"
                ? "is-proposal-flow"
                : ""
            }`}
          >
            <div className="app-content-body space-y-5">
              {usuario && conta ? (
              <>
                {appView === "clientes" ? (
                  <section className="space-y-5">
                    <div className="page-heading">
                      <div>
                        {deveMostrarVoltarContextual ? (
                          <button
                            type="button"
                            onClick={voltarContextual}
                            className={`page-heading-action page-heading-back-action ${classeVoltarContextual} mb-3`}
                          >
                            <ArrowRight
                              className="rotate-180"
                              size={18}
                              aria-hidden="true"
                            />
                            {textoBotaoVoltarContextual}
                          </button>
                        ) : null}
                        <h1 className="font-heading text-3xl font-semibold">
                          Clientes
                        </h1>
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
                        ) : clienteModo === "editar" ? (
                          <button
                            type="button"
                            onClick={novoCliente}
                            className="page-heading-action"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Novo cliente
                          </button>
                        ) : null}
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
                            placeholder="Nome, e-mail, telefone ou CPF/CNPJ"
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
                          <div className="data-table-shell mt-5">
                            <table className="data-table data-table-clientes w-full text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Cliente</th>
                                  <th>E-mail</th>
                                  <th>Telefone</th>
                                  <th>CPF/CNPJ</th>
                                  <th>Ações</th>
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
                                    <td data-label="E-mail">{cliente.email ?? "Não informado"}</td>
                                    <td data-label="Telefone">
                                      <div className="flex min-w-0 items-center gap-2">
                                        <span className="min-w-0 truncate">
                                          {formatTelefoneExibicao(cliente.telefone)}
                                        </span>
                                        <ContatoWhatsappClienteButton
                                          href={whatsappContatoClienteUrl}
                                          ariaLabel={`Entrar em contato com ${cliente.nome} pelo WhatsApp`}
                                        />
                                      </div>
                                    </td>
                                    <td data-label="CPF/CNPJ">
                                      {formatCpfCnpjExibicao(cliente.documento)}
                                    </td>
                                    <td data-label="Ações">
                                      <ListagemAcoes
                                        ariaLabel={`Ações do cliente ${cliente.nome}`}
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
                            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] md:items-end">
                              <InfoLinha label="Nome" value={clienteSelecionado.nome} />
                              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                <InfoLinha
                                  label="Telefone"
                                  value={formatTelefoneExibicao(
                                    clienteSelecionado.telefone,
                                  )}
                                />
                                <ContatoWhatsappClienteButton
                                  href={buildWhatsappContatoClienteUrl(
                                    clienteSelecionado,
                                  )}
                                  ariaLabel={`Entrar em contato com ${clienteSelecionado.nome} pelo WhatsApp`}
                                  size="lg"
                                />
                              </div>
                            </div>

                            <div className="client-complementary-panel mt-5 rounded-md border border-border bg-slate-50/70">
                              <button
                                type="button"
                                aria-expanded={clienteComplementaresAberto}
                                onClick={() =>
                                  setClienteComplementaresAberto((aberto) => !aberto)
                                }
                                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground"
                              >
                                Informações complementares
                                {clienteComplementaresAberto ? (
                                  <ChevronUp size={18} aria-hidden="true" />
                                ) : (
                                  <ChevronDown size={18} aria-hidden="true" />
                                )}
                              </button>
                              {clienteComplementaresAberto ? (
                                <div className="grid gap-3 border-t border-border p-4">
                                  <div className="grid gap-3 lg:grid-cols-3">
                                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                      <InfoLinha
                                        label="Instagram"
                                        value={
                                          clienteSelecionado.instagram ??
                                          "Não informado"
                                        }
                                      />
                                      <LinkSocialClienteButton
                                        href={buildClienteSocialUrl(
                                          "instagram",
                                          clienteSelecionado.instagram,
                                        )}
                                        label="Instagram"
                                        rede="instagram"
                                      />
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                      <InfoLinha
                                        label="Facebook"
                                        value={
                                          clienteSelecionado.facebook ??
                                          "Não informado"
                                        }
                                      />
                                      <LinkSocialClienteButton
                                        href={buildClienteSocialUrl(
                                          "facebook",
                                          clienteSelecionado.facebook,
                                        )}
                                        label="Facebook"
                                        rede="facebook"
                                      />
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                      <InfoLinha
                                        label="TikTok"
                                        value={
                                          clienteSelecionado.tiktok ??
                                          "Não informado"
                                        }
                                      />
                                      <LinkSocialClienteButton
                                        href={buildClienteSocialUrl(
                                          "tiktok",
                                          clienteSelecionado.tiktok,
                                        )}
                                        label="TikTok"
                                        rede="tiktok"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <InfoLinha
                                      label="E-mail"
                                      value={clienteSelecionado.email ?? "Não informado"}
                                    />
                                    <InfoLinha
                                      label="CPF/CNPJ"
                                      value={formatCpfCnpjExibicao(
                                        clienteSelecionado.documento,
                                      )}
                                    />
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(8rem,12rem)_minmax(11rem,16rem)]">
                                    <InfoLinha
                                      label="Endereço"
                                      value={
                                        clienteSelecionado.endereco ??
                                        "Não informado"
                                      }
                                    />
                                    <InfoLinha
                                      label="Número"
                                      value={
                                        clienteSelecionado.numero ?? "Não informado"
                                      }
                                    />
                                    <InfoLinha
                                      label="Cidade"
                                      value={
                                        clienteSelecionado.cidade ?? "Não informado"
                                      }
                                    />
                                  </div>
                                  <InfoLinha
                                    label="Status"
                                    value={clienteSelecionado.status}
                                  />
                                </div>
                              ) : null}
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
                        <ClienteFormularioCampos
                          form={clienteForm}
                          complementaresAberto={clienteComplementaresAberto}
                          logoMarcaAssinaturaUrl={logoMarcaTopo}
                          nomeMarcaAssinatura={nomeMarcaTopo}
                          onToggleComplementares={() =>
                            setClienteComplementaresAberto((aberto) => !aberto)
                          }
                        />
                        <div className="form-action-bar">
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
                          <div className="form-action-bar-right">
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
                          </div>
                        </div>
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
                        {deveMostrarVoltarContextual ? (
                          <button
                            type="button"
                            onClick={voltarContextual}
                            className={`page-heading-action page-heading-back-action ${classeVoltarContextual} mb-3`}
                          >
                            <ArrowRight
                              className="rotate-180"
                              size={18}
                              aria-hidden="true"
                            />
                            {textoBotaoVoltarContextual}
                          </button>
                        ) : null}
                        <h1 className="font-heading text-3xl font-semibold">
                          Meus serviços e pacotes
                        </h1>
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
                        ) : servicoModo === "editar" ? (
                          <button
                            type="button"
                            onClick={novoServico}
                            className="page-heading-action"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Novo serviço
                          </button>
                        ) : null}
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
                          <div className="data-table-shell mt-5">
                            <table className="data-table data-table-servicos w-full text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Serviço / Pacote</th>
                                  <th>Categoria</th>
                                  <th>Tipo</th>
                                  <th>Valor</th>
                                  <th>Ações</th>
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
                                        ariaLabel={`Ações do serviço ${servico.nome}`}
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
                        <MensagemErro error={arquivarServicoMutation.error} />
                      </div>
                    ) : null}

                    {servicoModo === "visualizar" ? (
                      <div className="form-surface-card rounded-md border border-border bg-surface p-5">
                        {servicoSelecionado ? (
                          <>
                            <div className="form-entity-hero">
                              <div className="form-entity-icon">
                                <PackageCheck size={24} aria-hidden="true" />
                              </div>
                              <div className="form-entity-copy">
                                <p>Serviço / Pacote</p>
                                <h2>{servicoSelecionado.nome}</h2>
                                <span>
                                  Item reutilizável do catálogo para montar propostas com mais velocidade.
                                </span>
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
                            <div className="form-info-grid mt-5">
                              <InfoLinha
                                icon={<Tags size={18} aria-hidden="true" />}
                                label="Categoria"
                                value={servicoSelecionado.categoria || "Não informado"}
                              />
                              <InfoLinha
                                icon={<BriefcaseBusiness size={18} aria-hidden="true" />}
                                label="Tipo"
                                value={formatTipoServico(servicoSelecionado.tipo)}
                              />
                              <InfoLinha
                                icon={<DollarSign size={18} aria-hidden="true" />}
                                label="Valor"
                                value={formatMoney(servicoSelecionado.preco)}
                              />
                              <InfoLinha
                                icon={<ReceiptText size={18} aria-hidden="true" />}
                                label="Unidade"
                                value={formatUnidadeServico(servicoSelecionado.unidade)}
                              />
                            </div>
                            {servicoSelecionado.descricao ? (
                              <div className="form-description-card mt-5">
                                <FileText size={18} aria-hidden="true" />
                                <p>{servicoSelecionado.descricao}</p>
                              </div>
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
                      <div className="form-surface-card rounded-md border border-border bg-surface p-5">
                      <div className="form-entity-hero is-form">
                        <div className="form-entity-icon">
                          <PackageCheck size={24} aria-hidden="true" />
                        </div>
                        <div className="form-entity-copy">
                          <p>Serviços</p>
                          <h2>{servicoSelecionado ? "Editar serviço" : "Novo serviço"}</h2>
                          <span>
                            Defina nome, valor e unidade para reaproveitar este item nas próximas propostas.
                          </span>
                        </div>
                      </div>

                      <form
                        className="mt-5 space-y-4"
                        onSubmit={servicoForm.handleSubmit((input) =>
                          salvarServicoMutation.mutate(input),
                        )}
                      >
                        <div className="form-primary-field">
                          <div className="form-primary-field-icon">
                            <PackageCheck size={18} aria-hidden="true" />
                          </div>
                          <CampoTexto
                            label="Nome do serviço ou pacote"
                            error={servicoForm.formState.errors.nome?.message}
                            {...servicoForm.register("nome")}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <CampoTexto
                            label="Categoria (opcional)"
                            error={servicoForm.formState.errors.categoria?.message}
                            {...servicoForm.register("categoria")}
                          />
                          <Controller
                            control={servicoForm.control}
                            name="preco"
                            render={({ field }) => (
                              <CampoMoedaReal
                                label="Preço"
                                name={field.name}
                                ref={field.ref}
                                value={field.value}
                                onBlur={field.onBlur}
                                onValueChange={field.onChange}
                                error={servicoForm.formState.errors.preco?.message}
                              />
                            )}
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
                            <option value="Semanal">Semanal</option>
                            <option value="Diario">Diário</option>
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
                          label="Descrição (opcional)"
                          rows={4}
                          error={servicoForm.formState.errors.descricao?.message}
                          {...servicoForm.register("descricao")}
                        />
                        <div className="form-action-bar">
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
                          <div className="form-action-bar-right">
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
                          </div>
                        </div>
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
                        {deveMostrarVoltarContextual ? (
                          <button
                            type="button"
                            onClick={voltarContextual}
                            className={`page-heading-action page-heading-back-action ${classeVoltarContextual} mb-3`}
                          >
                            <ArrowRight
                              className="rotate-180"
                              size={18}
                              aria-hidden="true"
                            />
                            {textoBotaoVoltarContextual}
                          </button>
                        ) : null}
                        <h1 className="font-heading text-3xl font-semibold">
                          {propostaModo === "lista"
                            ? "Propostas"
                            : propostaModo === "assistente"
                              ? "Nova proposta"
                              : propostaSelecionada
                              ? "Editar proposta"
                              : "Nova proposta"}
                        </h1>
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
                        ) : propostaSelecionada ? (
                          <button
                            type="button"
                            onClick={novaProposta}
                            className="page-heading-action"
                          >
                            <Plus size={18} aria-hidden="true" />
                            Nova proposta
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {contaStatusComercial === "TrialExpirado" ? (
                      <TrialUpsellBanner
                        conta={conta}
                        onAtivarPlano={() => navegarParaView("billing")}
                      />
                    ) : null}
                    {propostaModo === "assistente" ? (
                      <div className="proposal-wizard-panel rounded-md border border-border bg-surface p-5">
                        <div className="proposal-assistant-steps" aria-label="Etapas da nova proposta">
                          {propostaWizardEtapas.map((step, index) => (
                            <span
                              key={step.id}
                              className={index === 0 ? "is-active" : ""}
                            >
                              <strong>{index + 1}</strong>
                              {step.label}
                            </span>
                          ))}
                        </div>

                        {propostaAssistenteEtapa === "inicio" ? (
                          <div className="proposal-wizard-choice-grid mt-5">
                            <button
                              type="button"
                              disabled={clientes.length === 0}
                              onClick={() => setPropostaAssistenteEtapa("existente")}
                              className="proposal-wizard-choice"
                            >
                              <span className="proposal-wizard-choice-icon">
                                <UsersRound size={22} aria-hidden="true" />
                              </span>
                              <span>
                                <strong>Cliente já cadastrado</strong>
                                <small>
                                  Busque um contato salvo e comece a proposta com
                                  os dados preenchidos.
                                </small>
                                {clientes.length === 0 ? (
                                  <em>Nenhum cliente salvo ainda.</em>
                                ) : (
                                  <em>
                                    {clientes.length} cliente
                                    {clientes.length === 1
                                      ? " disponível"
                                      : "s disponíveis"}
                                  </em>
                                )}
                              </span>
                              <ArrowRight size={18} aria-hidden="true" />
                            </button>

                            <button
                              type="button"
                              onClick={abrirClienteRapidoAssistente}
                              className="proposal-wizard-choice"
                            >
                              <span className="proposal-wizard-choice-icon">
                                <UserRound size={22} aria-hidden="true" />
                              </span>
                              <span>
                                <strong>Cadastrar novo cliente</strong>
                                <small>
                                  Informe nome, telefone e e-mail opcional sem sair
                                  do fluxo da proposta.
                                </small>
                                <em>Depois de salvar, a montagem abre automaticamente.</em>
                              </span>
                              <ArrowRight size={18} aria-hidden="true" />
                            </button>
                          </div>
                        ) : null}

                        {propostaAssistenteEtapa === "existente" ? (
                          <div className="proposal-wizard-step mt-5">
                            <div className="proposal-wizard-step-header">
                              <div>
                                <p className="text-sm font-medium text-primary">
                                  Cliente cadastrado
                                </p>
                                <h2 className="font-heading text-xl font-semibold">
                                  Selecione quem vai receber a proposta
                                </h2>
                              </div>
                            </div>

                            <CampoTexto
                              label="Buscar cliente"
                              type="search"
                              value={buscaClienteAssistente}
                              placeholder="Nome, telefone, e-mail ou CPF/CNPJ"
                              onChange={(event) =>
                                setBuscaClienteAssistente(event.target.value)
                              }
                            />

                            {clientesAssistenteFiltrados.length > 0 ? (
                              <div className="proposal-wizard-client-list">
                                {clientesAssistenteFiltrados.map((cliente) => (
                                  <button
                                    key={cliente.id}
                                    type="button"
                                    onClick={() =>
                                      selecionarClienteAssistente(cliente.id)
                                    }
                                    className="proposal-wizard-client-card"
                                  >
                                    <span className="proposal-wizard-client-avatar">
                                      {cliente.nome.slice(0, 2).toUpperCase()}
                                    </span>
                                    <span className="min-w-0">
                                      <strong>{cliente.nome}</strong>
                                      <small>
                                        {[formatTelefoneOpcional(cliente.telefone), cliente.email]
                                          .filter(Boolean)
                                          .join(" • ") || "Sem contato complementar"}
                                      </small>
                                    </span>
                                    <ArrowRight size={17} aria-hidden="true" />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="proposal-wizard-empty">
                                <UsersRound size={20} aria-hidden="true" />
                                <div>
                                  <strong>Nenhum cliente encontrado.</strong>
                                  <p>
                                    Cadastre um novo cliente para continuar sem sair
                                    deste fluxo.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={abrirClienteRapidoAssistente}
                                  className="page-heading-action is-primary"
                                >
                                  <Plus size={16} aria-hidden="true" />
                                  Novo cliente
                                </button>
                              </div>
                            )}
                            <div className="proposal-step-actions">
                              <button
                                type="button"
                                onClick={voltarInicioAssistenteProposta}
                                className="page-heading-action"
                              >
                                <ArrowRight
                                  className="rotate-180"
                                  size={16}
                                  aria-hidden="true"
                                />
                                Voltar
                              </button>
                              <span>Selecione um cliente para avançar.</span>
                            </div>
                          </div>
                        ) : null}

                        {propostaAssistenteEtapa === "novo" ? (
                          <div className="proposal-wizard-step mt-5">
                            <div className="proposal-wizard-step-header">
                              <div>
                                <p className="text-sm font-medium text-primary">
                                  Clientes
                                </p>
                                <h2 className="font-heading text-xl font-semibold">
                                  Novo cliente
                                </h2>
                              </div>
                            </div>

                            <form
                              className="proposal-client-wizard-form mt-5"
                              onSubmit={clienteRapidoForm.handleSubmit((input) =>
                                criarClienteRapidoMutation.mutate(input),
                              )}
                            >
                              <ClienteFormularioCampos
                                form={clienteRapidoForm}
                                complementaresAberto={
                                  clienteRapidoComplementaresAberto
                                }
                                logoMarcaAssinaturaUrl={logoMarcaTopo}
                                nomeMarcaAssinatura={nomeMarcaTopo}
                                onToggleComplementares={() =>
                                  setClienteRapidoComplementaresAberto(
                                    (aberto) => !aberto,
                                  )
                                }
                              />
                              <div className="proposal-step-actions">
                                <button
                                  type="button"
                                  onClick={voltarInicioAssistenteProposta}
                                  className="page-heading-action"
                                >
                                  <ArrowRight
                                    className="rotate-180"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                  Voltar
                                </button>
                                <div className="proposal-step-actions-right">
                                  <MensagemErro
                                    error={criarClienteRapidoMutation.error}
                                  />
                                <button
                                  type="submit"
                                  disabled={criarClienteRapidoMutation.isPending}
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {criarClienteRapidoMutation.isPending
                                    ? "Salvando..."
                                      : "Próximo"}
                                    <ArrowRight size={16} aria-hidden="true" />
                                </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {propostaEditorAtivo ? (
                    <div className="proposal-form-panel rounded-md border border-border bg-surface p-5">
                      <div className="proposal-builder-header">
                        <div className="proposal-builder-header-copy">
                          <p className="proposal-builder-eyebrow">
                            {propostaSelecionada
                              ? "Fluxo de edição"
                              : "Fluxo de criação"}
                          </p>
                        </div>
                        <div
                          className="proposal-builder-context"
                          aria-label="Resumo do fluxo da proposta"
                        >
                          <span>
                            Etapa {propostaWizardEtapaAtualIndex + 1} de{" "}
                            {propostaWizardEtapas.length}
                          </span>
                          <span>{propostaWizardEtapaAtualLabel}</span>
                          <span>{propostaBuilderStatusLabel}</span>
                          <span>{propostaBuilderClienteLabel}</span>
                        </div>
                      </div>

                      <PropostaWizardBar
                        etapas={propostaWizardEtapas}
                        etapaAtiva={propostaWizardEtapaAtiva}
                        onEtapaClick={navegarParaEtapaProposta}
                        sticky
                      />

                      <div className="proposal-mobile-secondary-actions no-print">
                        <button
                          type="submit"
                          form="proposta-editor-form"
                          disabled={
                            salvarPropostaMutation.isPending ||
                            clientes.length === 0
                          }
                        >
                          <Save size={16} aria-hidden="true" />
                          {salvarPropostaMutation.isPending
                            ? "Salvando..."
                            : "Salvar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropostaPreviewModalAberto(true)}
                        >
                          <Eye size={16} aria-hidden="true" />
                          Preview
                        </button>
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
                        {propostaWizardEtapaAtiva === "cliente" ? (
                          <div
                            ref={propostaWizardClienteRef}
                            className="proposal-section proposal-step-screen"
                          >
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
                                error={
                                  propostaForm.formState.errors.clienteId?.message
                                }
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
                                error={
                                  propostaForm.formState.errors.validadeDias
                                    ?.message
                                }
                                {...propostaForm.register("validadeDias", {
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                            <div className="proposal-step-actions">
                              <span>Escolha quem receberá a proposta.</span>
                              <button
                                type="button"
                              onClick={avancarEtapaProposta}
                              className="page-heading-action is-primary"
                            >
                              {"Pr\u00f3ximo"}
                              <ArrowRight size={16} aria-hidden="true" />
                            </button>
                            </div>
                          </div>
                        ) : null}

                        {propostaWizardEtapaAtiva === "proposta" ? (
                          <div
                            ref={propostaWizardMensagemRef}
                            className="proposal-section proposal-step-screen"
                          >
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
                          <details className="proposal-optional-section mt-4">
                            <summary>
                              <span>
                                Detalhes opcionais da mensagem
                                <small>
                                  Introducao e observacoes podem ser preenchidas depois.
                                </small>
                              </span>
                              <ChevronDown size={17} aria-hidden="true" />
                            </summary>
                            <div className="proposal-optional-section-body lg:grid-cols-2">
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
                          </details>
                          <div className="proposal-step-actions">
                              <button
                                type="button"
                                onClick={voltarEtapaProposta}
                                className="page-heading-action"
                              >
                                <ArrowRight
                                  className="rotate-180"
                                  size={16}
                                  aria-hidden="true"
                                />
                                Voltar
                              </button>
                              <button
                                type="button"
                                onClick={avancarEtapaProposta}
                                className="page-heading-action is-primary"
                              >
                                Próximo
                                <ArrowRight size={16} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {propostaWizardEtapaAtiva === "itens" ? (
                          <>
                            <div
                              ref={propostaWizardItensRef}
                              className="proposal-section proposal-step-screen"
                            >
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
                                  label="Selecionar do catálogo"
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

                          <div className="proposal-items-list">
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
                                  <div className="proposal-item-card-header">
                                    <span className="proposal-item-index">
                                      Item {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="proposal-item-total">
                                      <small>Total</small>
                                      <strong>{formatMoney(itemTotal)}</strong>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removePropostaItem(index)}
                                      className="proposal-item-remove tooltip-icon-button"
                                      aria-label="Remover item"
                                      data-tooltip="Remover item"
                                      title="Remover item"
                                    >
                                      <Trash2 size={15} aria-hidden="true" />
                                    </button>
                                  </div>
                                  <div className="proposal-item-fields">
                                    <CampoTexto
                                      label={`Item ${index + 1}`}
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.nome?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.nome` as const,
                                      )}
                                    />
                                    <CampoTexto
                                      label={`Quantidade do item ${index + 1}`}
                                      type="number"
                                      min="1"
                                      step="1"
                                      inputMode="numeric"
                                      onKeyDown={bloquearQuantidadeDecimalKeyDown}
                                      onPaste={bloquearQuantidadeDecimalPaste}
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.quantidade?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.quantidade` as const,
                                        { valueAsNumber: true },
                                      )}
                                    />
                                    <Controller
                                      control={propostaForm.control}
                                      name={`itens.${index}.valorUnitario` as const}
                                      render={({ field }) => (
                                        <CampoMoedaReal
                                          label={`Valor do item ${index + 1}`}
                                          name={field.name}
                                          ref={field.ref}
                                          value={field.value}
                                          onBlur={field.onBlur}
                                          onValueChange={field.onChange}
                                          error={
                                            propostaForm.formState.errors.itens?.[index]
                                              ?.valorUnitario?.message
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="proposal-item-description">
                                    <CampoTextarea
                                      label={`Descrição do item ${index + 1}`}
                                      rows={1}
                                      error={
                                        propostaForm.formState.errors.itens?.[index]
                                          ?.descricao?.message
                                      }
                                      {...propostaForm.register(
                                        `itens.${index}.descricao` as const,
                                      )}
                                    />
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

                          <div className="proposal-step-actions">
                            <button
                              type="button"
                              onClick={voltarEtapaProposta}
                              className="page-heading-action"
                            >
                              <ArrowRight
                                className="rotate-180"
                                size={16}
                                aria-hidden="true"
                              />
                              Voltar
                            </button>
                            <button
                              type="button"
                              onClick={avancarEtapaProposta}
                              className="page-heading-action is-primary"
                            >
                              Próximo
                              <ArrowRight size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                          </>
                        ) : null}

                        {propostaWizardEtapaAtiva === "template" ? (
                          <div
                            ref={propostaWizardTemplateRef}
                            className="proposal-section proposal-step-screen"
                          >
                            <div className="proposal-section-header">
                              <span className="proposal-section-icon">
                                <Palette size={18} aria-hidden="true" />
                              </span>
                              <div>
                                <p className="proposal-step-label">Etapa 4</p>
                                <h3>Escolha o template</h3>
                              </div>
                            </div>
                            <p className="proposal-template-step-copy">
                              O template define como a proposta aparece no preview,
                              PDF, imagem e WhatsApp.
                            </p>
                            <div className="proposal-template-step-grid">
                              {propostaTemplateVisualOpcoesGaleria.map((template) => {
                                const templateSelecionado =
                                  normalizarTemplateVisual(
                                    propostaPreview.templateVisual,
                                  ) === template.value;

                                return (
                                  <article
                                    key={template.value}
                                    className={`proposal-template-step-card ${
                                      templateSelecionado ? "is-active" : ""
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        void selecionarTemplateProposta(
                                          template.value,
                                        );
                                      }}
                                      className="proposal-template-step-select"
                                      aria-pressed={templateSelecionado}
                                    >
                                      <TemplateSelectionIcon
                                        templateVisual={template.value}
                                      />
                                      <span>
                                        <strong>{template.label}</strong>
                                        <small>{template.detalhe}</small>
                                      </span>
                                      {templateSelecionado ? (
                                        <CheckCircle2
                                          size={18}
                                          aria-hidden="true"
                                        />
                                      ) : null}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTemplatePreviewAberto(template.value);
                                      }}
                                      className="proposal-template-step-preview"
                                    >
                                      <Eye size={14} aria-hidden="true" />
                                      Preview
                                    </button>
                                  </article>
                                );
                              })}
                            </div>
                            <div className="proposal-step-actions">
                              <button
                                type="button"
                                onClick={voltarEtapaProposta}
                                className="page-heading-action"
                              >
                                <ArrowRight
                                  className="rotate-180"
                                  size={16}
                                  aria-hidden="true"
                                />
                                Voltar
                              </button>
                              <button
                                type="button"
                                onClick={avancarEtapaProposta}
                                className="page-heading-action is-primary"
                              >
                                Próximo
                                <ArrowRight size={16} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {propostaWizardEtapaAtiva === "detalhamento" ? (
                          <>
                        <div
                          ref={propostaWizardDetalhamentoRef}
                          className="proposal-section proposal-step-screen"
                        >
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <ReceiptText size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Etapa 5</p>
                              <h3>Detalhamento comercial</h3>
                            </div>
                          </div>
                          <p className="proposal-template-step-copy">
                            Esta etapa e opcional. Use apenas se quiser enriquecer a proposta.
                          </p>
                          <details
                            className="proposal-optional-section mt-4"
                            open={propostaDescontoPagamentoAberto}
                            onToggle={(event) =>
                              setPropostaDescontoPagamentoAberto(
                                event.currentTarget.open,
                              )
                            }
                          >
                            <summary>
                              <span>
                                Desconto e pagamento
                                <small>Defina condicoes comerciais quando precisar.</small>
                              </span>
                              <ChevronDown size={17} aria-hidden="true" />
                            </summary>
                            <div className="proposal-optional-section-body lg:grid-cols-2">
                            <Controller
                              control={propostaForm.control}
                              name="descontoValor"
                              render={({ field }) => (
                                <CampoMoedaReal
                                  label="Desconto em R$"
                                  name={field.name}
                                  ref={field.ref}
                                  value={field.value}
                                  onBlur={field.onBlur}
                                  onValueChange={field.onChange}
                                  error={
                                    propostaForm.formState.errors.descontoValor
                                      ?.message
                                  }
                                />
                              )}
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
                          </details>
                          <details
                            className="proposal-optional-section mt-4"
                            open={propostaEscopoCronogramaAberto}
                            onToggle={(event) =>
                              setPropostaEscopoCronogramaAberto(
                                event.currentTarget.open,
                              )
                            }
                          >
                            <summary>
                              <span>
                                Escopo, cronograma e beneficios
                                <small>Adicione detalhes para propostas mais completas.</small>
                              </span>
                              <ChevronDown size={17} aria-hidden="true" />
                            </summary>
                            <div className="proposal-optional-section-body lg:grid-cols-2">
                            <Controller
                              control={propostaForm.control}
                              name="itensInclusosTexto"
                              render={({ field }) => (
                                <ListaDetalhamentoProposta
                                  label="O que está incluso"
                                  name={field.name}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  variante="positive"
                                  placeholder="Ex: 3 postagens semanais"
                                  error={
                                    propostaForm.formState.errors.itensInclusosTexto
                                      ?.message
                                  }
                                />
                              )}
                            />
                            <Controller
                              control={propostaForm.control}
                              name="itensNaoInclusosTexto"
                              render={({ field }) => (
                                <ListaDetalhamentoProposta
                                  label="O que não está incluso"
                                  name={field.name}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  variante="negative"
                                  placeholder="Ex: verba de anúncios"
                                  error={
                                    propostaForm.formState.errors
                                      .itensNaoInclusosTexto?.message
                                  }
                                />
                              )}
                            />
                            <CampoTextarea
                              label="Cronograma"
                              rows={4}
                              error={
                                propostaForm.formState.errors.cronogramaTexto
                                  ?.message
                              }
                              {...propostaForm.register("cronogramaTexto")}
                            />
                            <CampoTextarea
                              label="Benefícios"
                              rows={4}
                              error={
                                propostaForm.formState.errors.beneficiosTexto
                                  ?.message
                              }
                              {...propostaForm.register("beneficiosTexto")}
                            />
                            </div>
                          </details>
                          <div className="proposal-step-actions">
                            <button
                              type="button"
                              onClick={voltarEtapaProposta}
                              className="page-heading-action"
                            >
                              <ArrowRight
                                className="rotate-180"
                                size={16}
                                aria-hidden="true"
                              />
                              Voltar
                            </button>
                            <button
                              type="button"
                              onClick={avancarEtapaProposta}
                              className="page-heading-action is-primary"
                            >
                              Próximo
                              <ArrowRight size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                          </>
                        ) : null}

                        {propostaWizardEtapaAtiva === "revisao" ? (
                        <div
                          ref={propostaWizardRevisaoRef}
                          className="proposal-section proposal-review-section proposal-step-screen"
                        >
                          <div className="proposal-section-header">
                            <span className="proposal-section-icon">
                              <Eye size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="proposal-step-label">Etapa 6</p>
                              <h3>Revisão final</h3>
                            </div>
                          </div>
                          <div className="proposal-review-grid">
                            <div className="proposal-review-summary">
                              <div className="proposal-review-overview">
                                <article>
                                  <span>Cliente</span>
                                  <strong>
                                    {clientePreview?.nome || "Selecione um cliente"}
                                  </strong>
                                </article>
                                <article>
                                  <span>Template</span>
                                  <strong>{propostaResumoTemplateLabel}</strong>
                                </article>
                                <article>
                                  <span>Validade</span>
                                  <strong>{propostaResumoValidade}</strong>
                                </article>
                                <article>
                                  <span>Total</span>
                                  <strong>{formatMoney(propostaTotalVisual)}</strong>
                                </article>
                              </div>

                              <div className="proposal-review-content-grid">
                                <section className="proposal-review-card proposal-review-card-wide">
                                  <div className="proposal-review-card-header">
                                    <div>
                                      <span>Proposta</span>
                                      <h4>
                                        {propostaPreviewVisual.titulo?.trim() ||
                                          "Título não informado"}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="proposal-review-text-grid">
                                    <div>
                                      <span>Introdução</span>
                                      <p>{propostaResumoIntroducao}</p>
                                    </div>
                                    <div>
                                      <span>Condições de pagamento</span>
                                      <p>{propostaResumoCondicoesPagamento}</p>
                                    </div>
                                    <div>
                                      <span>Observações</span>
                                      <p>{propostaResumoObservacoes}</p>
                                    </div>
                                  </div>
                                </section>

                                <section className="proposal-review-card">
                                  <div className="proposal-review-card-header">
                                    <div>
                                      <span>Investimento</span>
                                      <h4>Resumo financeiro</h4>
                                    </div>
                                  </div>
                                  <dl className="proposal-review-money-list">
                                    <div>
                                      <dt>Subtotal</dt>
                                      <dd>{formatMoney(propostaSubtotalVisual)}</dd>
                                    </div>
                                    <div>
                                      <dt>Desconto</dt>
                                      <dd>{formatMoney(propostaDescontoVisual)}</dd>
                                    </div>
                                    <div className="is-total">
                                      <dt>Total</dt>
                                      <dd>{formatMoney(propostaTotalVisual)}</dd>
                                    </div>
                                  </dl>
                                </section>
                              </div>

                              <section className="proposal-review-card">
                                <div className="proposal-review-card-header">
                                  <div>
                                    <span>Escopo</span>
                                    <h4>
                                      {propostaResumoItens.length} item
                                      {propostaResumoItens.length === 1 ? "" : "s"}
                                    </h4>
                                  </div>
                                </div>
                                {propostaResumoItens.length ? (
                                  <div className="proposal-review-items-list">
                                    {propostaResumoItens.map((item) => (
                                      <article key={item.id}>
                                        <div>
                                          <strong>{item.nome}</strong>
                                          {item.descricao ? <p>{item.descricao}</p> : null}
                                        </div>
                                        <dl>
                                          <div>
                                            <dt>Qtd</dt>
                                            <dd>{formatQuantidade(item.quantidade)}</dd>
                                          </div>
                                          <div>
                                            <dt>Valor</dt>
                                            <dd>{formatMoney(item.valorUnitario)}</dd>
                                          </div>
                                          <div>
                                            <dt>Total</dt>
                                            <dd>{formatMoney(item.total)}</dd>
                                          </div>
                                        </dl>
                                      </article>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="proposal-review-empty">
                                    Nenhum item adicionado.
                                  </p>
                                )}
                              </section>

                              <div className="proposal-review-detail-grid">
                                {[
                                  {
                                    titulo: "O que está incluso",
                                    itens: propostaResumoInclusos,
                                    vazio: "Nenhum item incluso informado.",
                                    tom: "positive",
                                  },
                                  {
                                    titulo: "O que não está incluso",
                                    itens: propostaResumoNaoInclusos,
                                    vazio: "Nenhum item fora do escopo informado.",
                                    tom: "negative",
                                  },
                                  {
                                    titulo: "Cronograma",
                                    itens: propostaResumoCronograma,
                                    vazio: "Nenhum cronograma informado.",
                                    tom: "neutral",
                                  },
                                  {
                                    titulo: "Benefícios",
                                    itens: propostaResumoBeneficios,
                                    vazio: "Nenhum benefício informado.",
                                    tom: "accent",
                                  },
                                ].map((grupo) => (
                                  <section
                                    key={grupo.titulo}
                                    className={`proposal-review-card proposal-review-list-card proposal-review-list-card-${grupo.tom}`}
                                  >
                                    <div className="proposal-review-card-header">
                                      <div>
                                        <span>{formatQuantidadeItens(grupo.itens.length)}</span>
                                        <h4>{grupo.titulo}</h4>
                                      </div>
                                    </div>
                                    {grupo.itens.length ? (
                                      <ul>
                                        {grupo.itens.map((item, index) => (
                                          <li key={`${grupo.titulo}-${item}-${index}`}>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="proposal-review-empty">
                                        {grupo.vazio}
                                      </p>
                                    )}
                                  </section>
                                ))}
                              </div>

                              {propostaSelecionada && propostaTemAlteracoes ? (
                                <p className="proposal-review-warning">
                                  As alterações serão salvas automaticamente antes
                                  de gerar a proposta final.
                                </p>
                              ) : null}
                              <div className="proposal-review-actions">
                                <button
                                  type="button"
                                  onClick={voltarEtapaProposta}
                                  className="page-heading-action"
                                >
                                  <ArrowRight
                                    className="rotate-180"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                  Voltar
                                </button>
                                <div className="proposal-review-actions-right">
                                  <button
                                    type="button"
                                    onClick={() => setPropostaPreviewModalAberto(true)}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                                  >
                                    <Eye size={17} aria-hidden="true" />
                                    Visualizar Proposta
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={
                                      salvarPropostaMutation.isPending ||
                                      clientes.length === 0
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Save size={17} aria-hidden="true" />
                                    {salvarPropostaMutation.isPending
                                      ? "Salvando..."
                                      : "Salvar rascunho"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={
                                      salvarPropostaMutation.isPending ||
                                      gerarPropostaMutation.isPending ||
                                      !propostaProntaParaGerar
                                    }
                                    onClick={gerarPropostaDoFluxo}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-accent bg-white px-4 text-sm font-semibold text-accent transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:border-border disabled:text-muted disabled:opacity-70"
                                    title={
                                      !contaPodeExportarProposta
                                        ? mensagemBloqueioPlano
                                        : "Salvar e gerar proposta final"
                                    }
                                  >
                                    <CheckCircle2 size={17} aria-hidden="true" />
                                    {salvarPropostaMutation.isPending
                                      ? "Salvando..."
                                      : gerarPropostaMutation.isPending
                                        ? "Gerando..."
                                        : "Gerar proposta"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        ) : null}
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
                            Salve as alterações antes de gerar, imprimir ou
                            enviar a proposta.
                          </p>
                        ) : null}
                      </form>
                      <PropostaWizardMobileDock
                        etapaAtual={propostaWizardEtapaAtualIndex + 1}
                        etapaLabel={propostaWizardEtapaAtualLabel}
                        totalEtapas={propostaWizardEtapas.length}
                        isPrimeiraEtapa={propostaWizardEtapaAtualIndex === 0}
                        isRevisao={propostaWizardEtapaAtiva === "revisao"}
                        podeSalvar={clientes.length > 0}
                        salvando={salvarPropostaMutation.isPending}
                        podeGerar={propostaProntaParaGerar}
                        gerando={gerarPropostaMutation.isPending}
                        onVoltar={voltarEtapaProposta}
                        onProximo={avancarEtapaProposta}
                        onGerar={gerarPropostaDoFluxo}
                      />
                    </div>
                    ) : null}

                    {propostaEditorAtivo ? (
                      <aside
                        className={`proposal-action-rail no-print ${
                          propostaEditorAcoesExpandida ? "is-expanded" : ""
                        }`}
                        aria-label="Ações da proposta"
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
                              ? "Recolher barra de ações"
                              : "Expandir barra de ações"
                          }
                        >
                          {propostaEditorAcoesExpandida ? (
                            <PanelRightClose size={18} aria-hidden="true" />
                          ) : (
                            <PanelRightOpen size={18} aria-hidden="true" />
                          )}
                          <span className="proposal-action-label">
                            {propostaEditorAcoesExpandida ? "Recolher" : "Ações"}
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
                            onClick={abrirClienteRapidoModal}
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
                                salvarPropostaMutation.isPending ||
                                gerarPropostaMutation.isPending ||
                                !propostaProntaParaGerar
                              }
                              onClick={gerarPropostaDoFluxo}
                              className="proposal-rail-action is-accent"
                              title={
                                  !contaPodeExportarProposta
                                    ? mensagemBloqueioPlano
                                    : "Salvar e gerar proposta"
                              }
                              aria-label="Gerar proposta"
                            >
                              <CheckCircle2 size={18} aria-hidden="true" />
                              <span className="proposal-action-label">
                                {salvarPropostaMutation.isPending
                                  ? "Salvando"
                                  : gerarPropostaMutation.isPending
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
                                  propostaSelecionada
                                    ? abrirModalCompartilharProposta(
                                        propostaSelecionada,
                                      )
                                    : undefined
                                }
                                className="proposal-rail-action is-accent"
                                title={
                                  propostaTemAlteracoes
                                    ? "Salve as alterações antes de compartilhar."
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
                            statusComercialConta={contaStatusComercial}
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
                            statusComercialConta={contaStatusComercial}
                            cliente={clientes.find(
                              (cliente) =>
                                cliente.id === propostaParaImpressao.clienteId,
                            )}
                            clienteNomeFallback={propostaParaImpressao.clienteNome}
                            proposta={{
                              ...mapPropostaForm(propostaParaImpressao),
                              publicApprovalUrl: propostaParaImpressao.publicApprovalUrl,
                            }}
                            numeroProposta={propostaParaImpressao.numero}
                            subtotal={getSubtotalProposta(propostaParaImpressao)}
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
                          <div className="data-table-shell mt-5">
                            <table className="data-table data-table-propostas w-full text-left text-sm">
                              <thead>
                                <tr>
                                  <th>Cliente</th>
                                  <th>Tipo</th>
                                  <th>Total</th>
                                  <th>Status</th>
                                  <th>Data</th>
                                  <th>Ações</th>
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
                                  const propostaDocumentoFinal =
                                    isStatusPropostaComDocumentoFinal(
                                      proposta.status,
                                    );
                                  const propostaEditavel =
                                    isStatusPropostaEditavelDiretamente(
                                      proposta.status,
                                    );
                                  const propostaPodeExportar =
                                    propostaDocumentoFinal &&
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
                                        </div>
                                      </td>
                                      <td data-label="Tipo">
                                        {proposta.itens[0]?.nome ?? proposta.titulo}
                                      </td>
                                      <td data-label="Total">
                                        <strong>{formatMoney(proposta.total)}</strong>
                                        <span>
                                          {formatQuantidadeItens(proposta.itens.length)}
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
                                          ariaLabel={`Ações da proposta ${proposta.titulo}`}
                                          dataTestId={`proposal-actions-${proposta.id}`}
                                          acoes={[
                                            {
                                              label: "Visualizar",
                                              icon: <Eye size={16} />,
                                              testId: `proposal-action-view-${proposta.id}`,
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
                                                    testId: `proposal-action-generate-${proposta.id}`,
                                                    onClick: () =>
                                                      gerarPropostaMutation.mutate(
                                                        proposta.id,
                                                      ),
                                                  } satisfies ListagemAcao,
                                                ]
                                              : []),
                                            ...(propostaDocumentoFinal
                                              ? [
                                                  {
                                                    label: "PDF",
                                                    icon: <FileText size={16} />,
                                                    disabled:
                                                      !propostaPodeExportar,
                                                    tooltip: propostaPodeExportar
                                                      ? "Imprimir ou salvar em PDF"
                                                      : mensagemBloqueioPlano,
                                                    testId: `proposal-action-pdf-${proposta.id}`,
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
                                                    onClick: () =>
                                                      abrirModalCompartilharProposta(
                                                        proposta,
                                                      ),
                                                    disabled:
                                                      !propostaPodeExportar,
                                                    tooltip: propostaPodeExportar
                                                      ? "Escolher mensagem"
                                                      : mensagemBloqueioPlano,
                                                    accent: true,
                                                    testId: `proposal-action-whatsapp-${proposta.id}`,
                                                  },
                                                ] satisfies ListagemAcao[]
                                              : []),
                                            ...(propostaGerada
                                              ? [
                                                  {
                                                    label: "Enviar",
                                                    icon: <Send size={16} />,
                                                    disabled: envioBloqueado,
                                                    testId: `proposal-action-send-${proposta.id}`,
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
                                                    testId: `proposal-action-accept-${proposta.id}`,
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
                                                    testId: `proposal-action-reject-${proposta.id}`,
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
                                              disabled: !propostaEditavel,
                                              tooltip: propostaEditavel
                                                ? "Editar proposta"
                                                : "Duplique para alterar esta proposta",
                                              testId: `proposal-action-edit-${proposta.id}`,
                                              onClick: () =>
                                                selecionarProposta(proposta.id),
                                            },
                                            {
                                              label: "Duplicar",
                                              icon: <RefreshCw size={16} />,
                                              disabled:
                                                duplicarPropostaMutation.isPending,
                                              testId: `proposal-action-duplicate-${proposta.id}`,
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
                                              testId: `proposal-action-delete-${proposta.id}`,
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
                  <section className="account-settings-grid account-settings-single grid gap-4">
                    <div className="page-heading">
                      <div>
                        {deveMostrarVoltarContextual ? (
                          <button
                            type="button"
                            onClick={voltarContextual}
                            className={`page-heading-action page-heading-back-action ${classeVoltarContextual} mb-3`}
                          >
                            <ArrowRight
                              className="rotate-180"
                              size={18}
                              aria-hidden="true"
                            />
                            {textoBotaoVoltarContextual}
                          </button>
                        ) : null}
                        <h1 className="font-heading text-3xl font-semibold">
                          Perfil da conta
                        </h1>
                      </div>
                    </div>
                    <div className="rounded-md border border-border bg-surface p-5 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Conta e marca
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Dados para gerar propostas profissionais
                          </h2>
                          <p className="mt-2 max-w-3xl text-sm leading-5 text-muted">
                            Complete identidade, contato, marca, cores, formato e template em uma unica tela.
                          </p>
                        </div>
                        <UserRound className="text-muted" size={22} aria-hidden="true" />
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

                      <div
                        className={`profile-completion-panel mt-5 ${
                          perfilContaCompleto ? "is-complete" : ""
                        }`}
                      >
                        <div className="profile-completion-summary">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Passo Perfil da conta
                            </p>
                            <p className="mt-1 text-sm text-muted">
                              {perfilContaCompleto
                                ? "Seu perfil ja esta pronto para gerar propostas profissionais."
                                : `${perfilContaChecklistConcluidos} de ${perfilContaChecklist.length} itens completos.`}
                            </p>
                          </div>
                          <span
                            className={`profile-completion-badge ${
                              perfilContaCompleto ? "is-complete" : ""
                            }`}
                          >
                            {perfilContaCompleto ? "Perfil completo" : "Pendente"}
                          </span>
                        </div>
                        {!perfilContaCompleto ? (
                          <div className="profile-completion-list">
                            {perfilContaChecklist.map((item) => (
                              <div
                                key={item.id}
                                className={`profile-completion-item ${
                                  item.completo ? "is-complete" : ""
                                }`}
                              >
                                {item.completo ? (
                                  <CheckCircle2 size={16} aria-hidden="true" />
                                ) : (
                                  <CircleMinus size={16} aria-hidden="true" />
                                )}
                                <span>
                                  <strong>{item.label}</strong>
                                  <small>{item.detalhe}</small>
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <form
                        className="account-profile-form mt-5 grid gap-5"
                        onSubmit={perfilForm.handleSubmit((input) =>
                          perfilMutation.mutate(input),
                        )}
                      >
                        <div
                          className="account-settings-section account-logo-section"
                          data-tour="configurar-logo"
                        >
                          <div className="account-settings-section-heading">
                            <h3>Marca</h3>
                            <p>Use a logomarca que aparecerá nos materiais gerados pela Emprely.</p>
                          </div>
                          <div className="account-logo-card">
                            <div className="logo-upload-layout">
                              <div className="logo-upload-shell">
                                {logoArquivoPendente ? (
                                  <button
                                    type="button"
                                    onClick={removerLogoArquivoSelecionado}
                                    className="logo-remove-button tooltip-icon-button"
                                    aria-label="Remover logomarca selecionada"
                                    data-tooltip="Remover logomarca"
                                    title="Remover logomarca"
                                  >
                                    <Trash2 size={15} aria-hidden="true" />
                                  </button>
                                ) : logoRemocaoPendente ? (
                                  <button
                                    type="button"
                                    onClick={cancelarLimpezaLogomarcaPerfil}
                                    className="logo-remove-button tooltip-icon-button"
                                    aria-label="Cancelar remoção da logomarca"
                                    data-tooltip="Cancelar remoção"
                                    title="Cancelar remoção"
                                  >
                                    <X size={15} aria-hidden="true" />
                                  </button>
                                ) : podeLimparLogomarca ? (
                                  <button
                                    type="button"
                                    onClick={limparLogomarcaPerfil}
                                    className="logo-remove-button tooltip-icon-button"
                                    aria-label="Limpar logomarca"
                                    data-tooltip="Limpar logomarca"
                                    title="Limpar logomarca"
                                  >
                                    <Trash2 size={15} aria-hidden="true" />
                                  </button>
                                ) : null}
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
                                  className={`logo-dropzone logo-preview-frame flex aspect-square items-center justify-center rounded-md border border-dashed p-4 transition focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                                    logoDragAtivo
                                      ? "logo-dropzone-active border-primary bg-blue-50"
                                      : "border-border bg-white"
                                  }`}
                                  aria-label="Selecionar ou soltar logomarca"
                                >
                                  {logoPreviewAtualUrl ? (
                                    <img
                                      src={logoPreviewAtualUrl}
                                      alt="Preview da logomarca"
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <UploadCloud
                                      className="logo-upload-icon"
                                      size={38}
                                      aria-hidden="true"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="account-logo-copy">
                              <p className="text-sm font-semibold text-foreground">
                                Logomarca do negócio
                              </p>
                              <p className="mt-1 text-sm text-muted">
                                Clique no preview ou arraste uma imagem para substituir a logo atual.
                              </p>
                              <div className="logo-upload-formats">
                                <span>PNG</span>
                                <span>JPG/JPEG</span>
                                <span>WebP</span>
                                <span>Até {logoArquivoTamanhoMaximoLabel}</span>
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
                            {perfilForm.formState.errors.logoUrl?.message ? (
                              <p className="mt-2 text-sm text-red-600">
                                {perfilForm.formState.errors.logoUrl.message}
                              </p>
                            ) : null}
                        </div>
                        <div
                          className="account-settings-section account-identity-section"
                          data-tour="configurar-dados-conta"
                        >
                          <div className="account-settings-section-heading">
                            <h3>Identificação</h3>
                            <p>Dados principais exibidos nos documentos e propostas.</p>
                          </div>
                          <div className="account-fields-grid grid gap-4">
                            <CampoTexto
                              label="Nome comercial"
                              error={perfilForm.formState.errors.nomeComercial?.message}
                              {...perfilForm.register("nomeComercial")}
                            />
                            <CampoTexto
                              label="Segmento"
                              placeholder="Ex.: social media, fotografia, consultoria"
                              error={perfilForm.formState.errors.segmento?.message}
                              {...perfilForm.register("segmento")}
                            />
                            <CampoTexto
                              label="Cidade/UF"
                              placeholder="Ex.: Belo Horizonte/MG"
                              error={perfilForm.formState.errors.cidadeUf?.message}
                              {...perfilForm.register("cidadeUf")}
                            />
                            <CampoTexto
                              label="Responsável"
                              value={usuario.nome}
                              readOnly
                              helperText="Nome usado no cadastro."
                            />
                            <CampoTexto
                              label="CPF/CNPJ"
                              placeholder="000.000.000-00"
                              error={perfilForm.formState.errors.documento?.message}
                              {...buildCpfCnpjInputProps(
                                perfilForm.register(
                                  "documento",
                                  cpfCnpjInputRegisterOptions,
                                ),
                              )}
                            />
                          </div>
                        </div>

                        <div className="account-settings-section account-contact-section">
                          <div className="account-settings-section-heading">
                            <h3>Contato</h3>
                            <p>Canais usados para comunicação com clientes.</p>
                          </div>
                          <div className="account-fields-grid grid gap-4">
                            <CampoTexto
                              label="E-mail de acesso"
                              type="email"
                              readOnly
                              helperText="Este e-mail não pode ser editado aqui."
                              value={usuario.email}
                            />
                            <CampoTexto
                              label="E-mail de contato"
                              type="email"
                              helperText="Aparece nos documentos e mensagens enviados aos clientes."
                              error={perfilForm.formState.errors.emailContato?.message}
                              {...perfilForm.register("emailContato")}
                            />
                            <CampoTexto
                              label="Telefone"
                              error={perfilForm.formState.errors.telefoneContato?.message}
                              {...buildTelefoneInputProps(
                                perfilForm.register(
                                  "telefoneContato",
                                  telefoneInputRegisterOptions,
                                ),
                              )}
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
                          </div>
                        </div>

                        <div className="account-settings-actions flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
                          <MensagemErro error={perfilMutation.error} />
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
                        </div>
                      </form>
                      <form
                        className="mt-5 grid gap-4 rounded-md border border-border bg-white p-4"
                        onSubmit={changeEmailForm.handleSubmit((input) =>
                          changeEmailMutation.mutate(input),
                        )}
                      >
                        <div>
                          <h3 className="font-heading text-lg font-semibold">Segurança de acesso</h3>
                          <p className="mt-1 text-sm text-muted">
                            Altere o email de acesso confirmando o novo endereço.
                          </p>
                        </div>
                        <CampoTexto
                          label="Novo email de acesso"
                          type="email"
                          error={changeEmailForm.formState.errors.novoEmail?.message}
                          {...changeEmailForm.register("novoEmail")}
                        />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                          <MensagemErro error={changeEmailMutation.error} />
                          <button
                            type="submit"
                            disabled={changeEmailMutation.isPending}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Mail size={18} aria-hidden="true" />
                            {changeEmailMutation.isPending ? "Enviando..." : "Enviar confirmação"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </section>
                ) : null}

                {appView === "conta" ? (
                  <section className="account-settings-grid personalization-page grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)]">
                    <div className="profile-section-heading xl:col-span-2">
                      <div>
                        <p>Preferências de proposta</p>
                        <h2>Template, cores e formatos de envio</h2>
                        <span>
                          Escolha como a Emprely apresenta seus orçamentos antes de criar a primeira proposta.
                        </span>
                      </div>
                    </div>

                    <form
                      className="personalization-layout grid gap-4 xl:col-span-2"
                      onSubmit={perfilForm.handleSubmit((input) =>
                        perfilMutation.mutate(input),
                      )}
                    >
                      <input
                        type="hidden"
                        {...perfilForm.register("corSistemaPrimaria")}
                      />
                      <input
                        type="hidden"
                        {...perfilForm.register("corSistemaSecundaria")}
                      />
                      <input type="hidden" {...perfilForm.register("templateVisualPadrao")} />
                      <input type="hidden" {...perfilForm.register("formatoArquivoPreferido")} />

                      <div className="personalization-main-card rounded-md border border-border bg-surface p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary">
                              Aparência do sistema
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              Tema do sistema
                            </h2>
                          </div>
                          <Palette className="text-muted" size={22} aria-hidden="true" />
                        </div>

                        <div className="personalization-section mt-5">
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              Tema do sistema
                            </span>
                            <p className="mt-1 text-sm text-muted">
                              Escolha a aparência da interface enquanto trabalha no app.
                            </p>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                      </div>

                      <aside
                        className="personalization-template-card rounded-md border border-border bg-surface"
                        data-tour="configurar-template"
                      >
                        <div className="personalization-template-header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-start gap-2">
                            <FileText
                              className="mt-0.5 shrink-0 text-primary"
                              size={22}
                              aria-hidden="true"
                            />
                            <div>
                              <h2 className="font-heading text-xl font-semibold leading-7">
                                Templates dos orçamentos
                              </h2>
                              <p className="mt-1 text-sm leading-5 text-muted">
                                Selecione o cartão que será usado como template padrão em novos orçamentos.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="personalization-template-toolbar flex flex-col gap-3 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Template ativo: {getPropostaTemplateLabel(templateVisualPersonalizacaoPreview)}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              A alteração só será confirmada ao salvar o perfil da conta.
                            </p>
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
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RefreshCw size={15} aria-hidden="true" />
                            Restaurar padrão
                          </button>
                        </div>

                        <div className="template-selection-scroll">
                          {perfilForm.formState.errors.templateVisualPadrao?.message ? (
                            <p className="text-sm text-red-600">
                              {perfilForm.formState.errors.templateVisualPadrao.message}
                            </p>
                          ) : null}

                          <div className="template-selection-grid">
                            {propostaTemplateVisualOpcoesGaleria.map((template) => {
                              const templateAtivo =
                                templateVisualPersonalizacaoPreview === template.value;

                              return (
                                <article
                                  key={template.value}
                                  role="button"
                                  tabIndex={0}
                                  aria-pressed={templateAtivo}
                                  onClick={() => {
                                    perfilForm.setValue(
                                      "templateVisualPadrao",
                                      template.value,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                    setPerfilMensagem(null);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      perfilForm.setValue(
                                        "templateVisualPadrao",
                                        template.value,
                                        {
                                          shouldDirty: true,
                                          shouldValidate: true,
                                        },
                                      );
                                      setPerfilMensagem(null);
                                    }
                                  }}
                                  className={`template-selection-card ${
                                    templateAtivo ? "is-active" : ""
                                  }`}
                                >
                                  <span className="template-selection-copy">
                                    <span className="template-selection-icon" aria-hidden="true">
                                      <TemplateSelectionIcon templateVisual={template.value} />
                                    </span>
                                    <span className="template-selection-text">
                                      <span className="template-selection-title-row">
                                        <strong>{template.label}</strong>
                                        {template.coresEstaticas ? (
                                          <small>Cores estáticas</small>
                                        ) : null}
                                      </span>
                                      <span>{template.detalhe}</span>
                                    </span>
                                  </span>
                                  <span className="template-selection-preview" aria-hidden="true">
                                    <TemplateMiniatura templateVisual={template.value} />
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setPersonalizacaoPreviewTemplateAberto(template.value);
                                    }}
                                    className="template-selection-preview-button"
                                  >
                                    <Eye size={14} aria-hidden="true" />
                                    Preview
                                  </button>
                                </article>
                              );
                            })}
                          </div>
                        </div>

                      </aside>

                      <section
                        className="personalization-main-card personalization-colors-card rounded-md border border-border bg-surface p-5"
                        data-tour="configurar-cores-formato"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary">
                              Cores dos templates
                            </p>
                            <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                              Paleta da proposta
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-5 text-muted">
                              Ajuste as cores usadas nos templates personalizáveis.
                            </p>
                          </div>
                          <div className="static-color-note">
                            <strong>Cores estáticas</strong>
                            <span>
                              Alguns templates mantêm paleta fixa para preservar o design.
                            </span>
                          </div>
                        </div>
                        <div className="profile-color-grid mt-4">
                          <Controller
                            control={perfilForm.control}
                            name="corPrimaria"
                            render={({ field }) => (
                              <CampoCorPerfil
                                label="Cor primária"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setPerfilMensagem(null);
                                }}
                                onBlur={field.onBlur}
                                error={perfilForm.formState.errors.corPrimaria?.message}
                                helperText="Títulos, ícones e áreas de destaque dos orçamentos."
                              />
                            )}
                          />
                          <Controller
                            control={perfilForm.control}
                            name="corSecundaria"
                            render={({ field }) => (
                              <CampoCorPerfil
                                label="Cor secundária"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setPerfilMensagem(null);
                                }}
                                onBlur={field.onBlur}
                                error={perfilForm.formState.errors.corSecundaria?.message}
                                helperText="Acentos, detalhes e botões dos orçamentos."
                              />
                            )}
                          />
                        </div>
                      </section>

                      <section className="personalization-main-card personalization-format-card rounded-md border border-border bg-surface p-5">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Envio da proposta
                          </p>
                          <h2 className="mt-1 font-heading text-xl font-semibold leading-7">
                            Formato preferido
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm leading-5 text-muted">
                            Escolha o arquivo que aparece primeiro ao compartilhar a proposta.
                          </p>
                        </div>
                        <div className="mt-4 grid gap-2 lg:grid-cols-3">
                          <button
                            type="button"
                            aria-pressed={
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "Pdf"
                            }
                            onClick={() => {
                              perfilForm.setValue(
                                "formatoArquivoPreferido",
                                "Pdf",
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );
                              setPerfilMensagem(null);
                            }}
                            className={`personalization-choice ${
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "Pdf"
                                ? "is-active"
                                : ""
                            }`}
                          >
                            <FileText size={18} aria-hidden="true" />
                            <span>
                              <strong>PDF</strong>
                              <small>Arquivo pronto para enviar e arquivar.</small>
                            </span>
                          </button>
                          <button
                            type="button"
                            aria-pressed={
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "Imagem"
                            }
                            onClick={() => {
                              perfilForm.setValue(
                                "formatoArquivoPreferido",
                                "Imagem",
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );
                              setPerfilMensagem(null);
                            }}
                            className={`personalization-choice ${
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "Imagem"
                                ? "is-active"
                                : ""
                            }`}
                          >
                            <ReceiptText size={18} aria-hidden="true" />
                            <span>
                              <strong>Imagem</strong>
                              <small>Visual único para compartilhar rapidamente.</small>
                            </span>
                          </button>
                          <button
                            type="button"
                            aria-pressed={
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "PdfImagem"
                            }
                            onClick={() => {
                              perfilForm.setValue(
                                "formatoArquivoPreferido",
                                "PdfImagem",
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );
                              setPerfilMensagem(null);
                            }}
                            className={`personalization-choice ${
                              perfilPersonalizacaoPreview.formatoArquivoPreferido ===
                              "PdfImagem"
                                ? "is-active"
                                : ""
                            }`}
                          >
                            <Paperclip size={18} aria-hidden="true" />
                            <span>
                              <strong>PDF + imagem</strong>
                              <small>Envia os dois formatos quando fizer sentido.</small>
                            </span>
                          </button>
                        </div>
                      </section>

                      <div className="personalization-actions flex flex-col gap-3 border-t border-border sm:flex-row sm:items-center sm:justify-end">
                        <MensagemErro error={perfilMutation.error} />
                        <button
                          type="submit"
                          disabled={perfilMutation.isPending}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={18} aria-hidden="true" />
                          {perfilMutation.isPending
                            ? "Salvando..."
                            : "Salvar perfil da conta"}
                        </button>
                      </div>
                    </form>
                  </section>
                ) : null}

                {appView === "suporte" ? (
                  <section className="grid gap-4">
                    <div className="page-heading">
                      <div>
                        {deveMostrarVoltarContextual ? (
                          <button
                            type="button"
                            onClick={voltarContextual}
                            className={`page-heading-action page-heading-back-action ${classeVoltarContextual} mb-3`}
                          >
                            <ArrowRight
                              className="rotate-180"
                              size={18}
                              aria-hidden="true"
                            />
                            {textoBotaoVoltarContextual}
                          </button>
                        ) : null}
                        <h1 className="font-heading text-3xl font-semibold">Suporte</h1>
                      </div>
                    </div>
                    <form
                      className="rounded-md border border-border bg-surface p-5 shadow-sm grid gap-4"
                      onSubmit={suporteForm.handleSubmit((input) => suporteMutation.mutate(input))}
                    >
                      <div>
                        <h2 className="font-heading text-xl font-semibold">Fale com o suporte Emprely</h2>
                        <p className="mt-1 text-sm text-muted">
                          Descreva o problema para registrarmos sua solicitação. Se preferir atendimento direto, fale pelo WhatsApp ou e-mail oficial.
                        </p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <a
                          href={whatsappEmprelySuporteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-12 items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                          aria-label={`Falar com a Emprely pelo WhatsApp ${contatoEmprely.whatsappDisplay}`}
                        >
                          <WhatsAppIcon size={18} aria-hidden="true" />
                          <span>
                            WhatsApp
                            <span className="block text-xs font-medium text-muted">
                              {contatoEmprely.whatsappDisplay}
                            </span>
                          </span>
                        </a>
                        <a
                          href={`mailto:${contatoEmprely.email}`}
                          className="inline-flex min-h-12 items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Mail size={18} aria-hidden="true" />
                          <span>
                            E-mail
                            <span className="block text-xs font-medium text-muted">
                              {contatoEmprely.email}
                            </span>
                          </span>
                        </a>
                      </div>
                      <CampoTexto
                        label="Assunto"
                        error={suporteForm.formState.errors.assunto?.message}
                        {...suporteForm.register("assunto")}
                      />
                      <CampoTextarea
                        label="Mensagem"
                        rows={6}
                        error={suporteForm.formState.errors.mensagem?.message}
                        {...suporteForm.register("mensagem")}
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <MensagemErro error={suporteMutation.error} />
                        <button
                          type="submit"
                          disabled={suporteMutation.isPending}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Send size={18} aria-hidden="true" />
                          {suporteMutation.isPending ? "Enviando..." : "Enviar solicitação"}
                        </button>
                      </div>
                    </form>
                  </section>
                ) : null}
                {appView === "billing" ? (
                  <BillingContent
                    conta={conta}
                    status={billingStatusQuery.data}
                    planos={billingPlansQuery.data ?? []}
                    isLoading={billingStatusQuery.isLoading || billingPlansQuery.isLoading}
                    isError={billingStatusQuery.isError || billingPlansQuery.isError}
                    erroCheckout={criarBillingCheckoutMutation.error}
                    erroCancelamento={cancelarBillingMutation.error}
                    checkoutPendente={criarBillingCheckoutMutation.isPending}
                    cancelamentoPendente={cancelarBillingMutation.isPending}
                    onRetry={() => {
                      void billingStatusQuery.refetch();
                      void billingPlansQuery.refetch();
                    }}
                    onCriarCheckout={(input) => criarBillingCheckoutMutation.mutate(input)}
                    onCancelar={() => cancelarBillingMutation.mutate("Solicitado pelo usuario no app.")}
                  />
                ) : null}
                {appView === "dashboard" ? (
                  <DashboardContent
                    conta={conta}
                    propostas={propostas}
                    perfilContaAtualizado={perfilContaMinimoCompleto}
                    clientesTotal={clientes.length}
                    servicosTotal={servicos.length}
                    primeiraPropostaGerada={primeiraPropostaGerada}
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
                    onAbrirClientes={() => {
                      setClientePagina(1);
                      navegarParaView("clientes");
                    }}
                    onAbrirServicos={() => {
                      setServicoPagina(1);
                      navegarParaView("servicos");
                    }}
                    onAbrirPropostasPorStatus={(status) => {
                      setFiltroStatusProposta(status);
                      setPropostaPagina(1);
                      navegarParaView("propostas");
                    }}
                    onNovaProposta={() => abrirNovaProposta()}
                    onCadastrarCliente={abrirNovoCliente}
                    onSalvarServico={abrirNovoServico}
                    onAbrirOnboarding={() => abrirOnboarding("conta")}
                    onAbrirBilling={() => navegarParaView("billing")}
                  />
                ) : null}
              </>
            ) : exibindoBillingPublico ? (
              <PublicBillingContent
                token={publicBillingPaymentToken}
                linkForm={publicBillingLinkForm}
                linkMutation={solicitarPublicBillingLinkMutation}
                linkQuery={publicBillingPaymentLinkQuery}
                checkoutMutation={criarPublicBillingCheckoutMutation}
              />
            ) : exibindoSuportePublico ? (
              <ContatoPublicoContent
                contatoPublicoForm={contatoPublicoForm}
                contatoPublicoMutation={contatoPublicoMutation}
              />
            ) : (
              <AuthContent
                authMode={authMode}
                setAuthMode={setAuthMode}
                registerForm={registerForm}
                loginForm={loginForm}
                recuperarSenhaForm={recuperarSenhaForm}
                resetSenhaForm={resetSenhaForm}
                registerMutation={registerMutation}
                loginMutation={loginMutation}
                confirmEmailMutation={confirmEmailMutation}
                confirmChangeEmailMutation={confirmChangeEmailMutation}
                resendConfirmacaoMutation={resendConfirmacaoMutation}
                forgotSenhaMutation={forgotSenhaMutation}
                resetSenhaMutation={resetSenhaMutation}
                authEmailPendente={authEmailPendente}
                authUrlParams={authUrlParams}
              />
              )}
            </div>
          </section>
        </main>
      </div>
      {propostaVisualizacaoModal && propostaVisualizacaoModalForm && conta ? (
        <div
          className="proposal-view-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          data-testid="proposal-view-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              fecharPropostaVisualizacaoModal();
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            data-testid="proposal-view-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-view-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">
                  Visualização da proposta
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
                  disabled={!propostaVisualizacaoModalPodeEditar}
                  className="tooltip-icon-button proposal-modal-icon-action proposal-modal-icon-action-primary"
                  aria-label={
                    propostaVisualizacaoModalPodeEditar
                      ? "Editar"
                      : "Duplique para editar esta proposta"
                  }
                  data-tooltip={
                    propostaVisualizacaoModalPodeEditar
                      ? "Editar"
                      : "Duplique para editar"
                  }
                  data-testid="proposal-view-modal-edit"
                >
                  <Edit3 size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    duplicarPropostaComConfirmacao(propostaVisualizacaoModal)
                  }
                  disabled={duplicarPropostaMutation.isPending}
                  className="tooltip-icon-button proposal-modal-icon-action"
                  aria-label="Duplicar proposta"
                  data-tooltip="Duplicar"
                  data-testid="proposal-view-modal-duplicate"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void baixarPdfPropostaSalva(
                      propostaVisualizacaoModal,
                      propostaVisualizacaoExportDocumentoRef.current,
                    )
                  }
                  disabled={!propostaVisualizacaoModalPodeExportar}
                  className="tooltip-icon-button proposal-modal-icon-action"
                  aria-label={
                    propostaVisualizacaoModalPodeExportar
                      ? "Baixar proposta em PDF"
                      : "Gere a proposta antes de baixar"
                  }
                  data-tooltip={
                    propostaVisualizacaoModalPodeExportar
                      ? "Baixar PDF"
                      : "Gere a proposta antes de baixar"
                  }
                  data-testid="proposal-view-modal-pdf"
                >
                  <Download size={16} aria-hidden="true" />
                </button>
                {propostaVisualizacaoModalPodeExportar ? (
                  <button
                    type="button"
                    onClick={() =>
                      abrirModalCompartilharProposta(propostaVisualizacaoModal)
                    }
                    className="tooltip-icon-button proposal-modal-icon-action proposal-modal-icon-action-whatsapp"
                    aria-label="Enviar proposta pelo WhatsApp"
                    data-tooltip="WhatsApp"
                    data-testid="proposal-view-modal-whatsapp"
                  >
                    <WhatsAppIcon size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="tooltip-icon-button proposal-modal-icon-action"
                    aria-label="Gere a proposta antes de enviar pelo WhatsApp"
                    data-tooltip="Gere a proposta antes de enviar"
                    data-testid="proposal-view-modal-whatsapp-disabled"
                  >
                    <WhatsAppIcon size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={fecharPropostaVisualizacaoModal}
                  className="tooltip-icon-button proposal-modal-icon-action"
                  aria-label="Fechar visualização da proposta"
                  data-tooltip="Fechar"
                  data-testid="proposal-view-modal-close"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </header>
            <div className="proposal-view-modal-stage">
              <PreviewPropostaVisual
                ref={propostaVisualizacaoDocumentoRef}
                perfilConta={perfilConta}
                contaNome={conta.nome}
                planoConta={conta.plano}
                statusComercialConta={contaStatusComercial}
                cliente={clienteVisualizacaoModal}
                clienteNomeFallback={propostaVisualizacaoModal.clienteNome}
                proposta={propostaVisualizacaoModalForm}
                numeroProposta={propostaVisualizacaoModal.numero}
                subtotal={getSubtotalProposta(propostaVisualizacaoModal)}
                desconto={propostaVisualizacaoModal.descontoValor}
                total={propostaVisualizacaoModal.total}
              />
            </div>
          </section>
        </div>
      ) : null}
      {propostaVisualizacaoModal && propostaVisualizacaoModalForm && conta ? (
        <div className="proposal-export-buffer" aria-hidden="true">
          <PreviewPropostaVisual
            ref={propostaVisualizacaoExportDocumentoRef}
            perfilConta={perfilConta}
            contaNome={conta.nome}
            planoConta={conta.plano}
            statusComercialConta={contaStatusComercial}
            cliente={clienteVisualizacaoModal}
            clienteNomeFallback={propostaVisualizacaoModal.clienteNome}
            proposta={propostaVisualizacaoModalForm}
            numeroProposta={propostaVisualizacaoModal.numero}
            subtotal={getSubtotalProposta(propostaVisualizacaoModal)}
            desconto={propostaVisualizacaoModal.descontoValor}
            total={propostaVisualizacaoModal.total}
          />
        </div>
      ) : null}
      {propostaPreviewModalAberto && propostaEditorAtivo && conta ? (
        <div
          className="proposal-view-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4"
          data-testid="proposal-editor-preview-overlay"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              fecharPropostaPreviewModal();
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            data-testid="proposal-editor-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-editor-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <input
              className="preview-zoom-radio"
              type="radio"
              name="proposal-preview-zoom"
              id="proposal-preview-fit"
              defaultChecked
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="proposal-preview-zoom"
              id="proposal-preview-zoom"
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="proposal-preview-zoom"
              id="proposal-preview-full"
            />
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">
                  Visualização da proposta
                </p>
                <h2
                  id="proposal-editor-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {propostaPreview.titulo || "Proposta em edição"}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {getPropostaTemplateLabel(
                    normalizarTemplateVisual(propostaPreview.templateVisual),
                  )}
                </p>
              </div>
              <div className="preview-modal-actions">
                <div className="preview-zoom-controls" aria-label="Zoom do preview">
                  <label htmlFor="proposal-preview-fit">Inteiro</label>
                  <label htmlFor="proposal-preview-zoom">Zoom</label>
                  <label htmlFor="proposal-preview-full">100%</label>
                </div>
                <button
                  type="button"
                  onClick={fecharPropostaPreviewModal}
                  className="tooltip-icon-button"
                  aria-label="Fechar visualização da proposta"
                  title="Fechar"
                  data-testid="proposal-editor-preview-close"
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
                statusComercialConta={contaStatusComercial}
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
          data-testid="personalization-template-preview-overlay"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              fecharPersonalizacaoPreviewTemplate();
            }
          }}
        >
          <section
            className="proposal-view-modal-dialog w-full rounded-md border border-border bg-surface shadow-2xl"
            data-testid="personalization-template-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="personalization-template-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <input
              className="preview-zoom-radio"
              type="radio"
              name="personalization-template-preview-zoom"
              id="personalization-template-preview-fit"
              defaultChecked
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="personalization-template-preview-zoom"
              id="personalization-template-preview-zoom"
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="personalization-template-preview-zoom"
              id="personalization-template-preview-full"
            />
            <header className="proposal-view-modal-header">
              <div>
                <p className="text-sm font-medium text-primary">
                  Preview do template padrão
                </p>
                <h2
                  id="personalization-template-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {getPropostaTemplateLabel(personalizacaoPreviewTemplateAberto)}
                </h2>
                <div
                  className="preview-zoom-controls personalization-preview-zoom-controls"
                  aria-label="Zoom do preview do template padrao"
                >
                  <label htmlFor="personalization-template-preview-fit">
                    Inteiro
                  </label>
                  <label htmlFor="personalization-template-preview-zoom">
                    Zoom
                  </label>
                  <label htmlFor="personalization-template-preview-full">
                    100%
                  </label>
                </div>
                <p className="mt-1 text-sm leading-5 text-muted">
                  Prévia real usando a logomarca, as cores e os dados atuais da
                  personalização.
                </p>
              </div>
              <button
                type="button"
                onClick={fecharPersonalizacaoPreviewTemplate}
                className="tooltip-icon-button"
                aria-label="Fechar preview do template padrão"
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
                statusComercialConta={contaStatusComercial}
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
            onMouseDown={(event) => event.stopPropagation()}
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
              {propostaTemplateVisualOpcoesGaleria.map((template) => {
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
                              Cores estáticas
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
                            void (async () => {
                              const selecionado = await selecionarTemplateProposta(
                                template.value,
                              );

                              if (selecionado) {
                                setPropostaTemplateModalAberto(false);
                              }
                            })();
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
      {propostaCompartilharModalAberto && propostaCompartilhamentoAtiva ? (
        <div
          className="share-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (isBackdropClick(event)) {
              fecharModalCompartilharProposta();
            }
          }}
        >
          <section
            className="share-modal-dialog w-full rounded-md border border-border bg-surface p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-share-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="share-modal-heading">
                <div>
                  <p className="share-modal-kicker">Envio da proposta</p>
                  <h2
                    id="proposal-share-title"
                    className="font-heading text-xl font-semibold"
                  >
                    Como deseja enviar?
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={fecharModalCompartilharProposta}
                className="tooltip-icon-button"
                aria-label="Fechar compartilhamento"
                title="Fechar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="share-choice-grid mt-5">
              <button
                type="button"
                onClick={() =>
                  void enviarMensagemInicialComAnexoProposta(
                    propostaCompartilhamentoAtiva,
                    propostaCompartilhamentoDocumentoRef.current,
                  )
                }
                className="share-choice-card"
              >
                <span className="share-choice-icon is-attachment">
                  <Send size={21} aria-hidden="true" />
                  <Paperclip
                    className="share-choice-icon-badge"
                    size={14}
                    aria-hidden="true"
                  />
                </span>
                <strong>Mensagem inicial + anexo</strong>
                <span>
                  {getDescricaoCardMensagemAnexo(
                    normalizarFormatoArquivoPreferido(
                      perfilConta?.formatoArquivoPreferido,
                    ),
                  )}
                </span>
              </button>
              <a
                href={whatsappPropostaCompletaUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setPropostaExportacaoMensagem(
                    "WhatsApp aberto com a proposta completa em texto.",
                  );
                  fecharModalCompartilharProposta();
                }}
                className="share-choice-card"
              >
                <span className="share-choice-icon">
                  <FileText size={22} aria-hidden="true" />
                </span>
                <strong>Proposta completa em texto</strong>
                <span>Itens, valores, condições, listas e observações.</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  void baixarPdfPropostaSalva(
                    propostaCompartilhamentoAtiva,
                    propostaCompartilhamentoDocumentoRef.current,
                  )
                }
                className="share-choice-card"
              >
                <span className="share-choice-icon is-download">
                  <Download size={21} aria-hidden="true" />
                </span>
                <strong>Download PDF</strong>
                <span>Baixe o arquivo final para enviar ou arquivar.</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  void baixarImagemPropostaSalva(
                    propostaCompartilhamentoAtiva,
                    propostaCompartilhamentoDocumentoRef.current,
                  )
                }
                className="share-choice-card"
              >
                <span className="share-choice-icon is-image">
                  <ReceiptText size={21} aria-hidden="true" />
                </span>
                <strong>Download imagem</strong>
                <span>Gere uma imagem da proposta para compartilhar.</span>
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {propostaCompartilharModalAberto &&
      propostaCompartilhamentoAtiva &&
      propostaCompartilhamentoForm &&
      conta ? (
        <div className="proposal-export-buffer" aria-hidden="true">
          <PreviewPropostaVisual
            ref={propostaCompartilhamentoDocumentoRef}
            perfilConta={perfilConta}
            contaNome={conta.nome}
            planoConta={conta.plano}
            statusComercialConta={contaStatusComercial}
            cliente={clienteCompartilhamentoAtivo}
            clienteNomeFallback={propostaCompartilhamentoAtiva.clienteNome}
            proposta={propostaCompartilhamentoForm}
            numeroProposta={propostaCompartilhamentoAtiva.numero}
            subtotal={getSubtotalProposta(propostaCompartilhamentoAtiva)}
            desconto={propostaCompartilhamentoAtiva.descontoValor}
            total={propostaCompartilhamentoAtiva.total}
          />
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
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Clientes</p>
                <h2
                  id="quick-client-title"
                  className="font-heading text-xl font-semibold"
                >
                  Novo cliente
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
              className="mt-5 space-y-4"
              onSubmit={clienteRapidoForm.handleSubmit((input) =>
                criarClienteRapidoMutation.mutate(input),
              )}
            >
              <ClienteFormularioCampos
                form={clienteRapidoForm}
                complementaresAberto={clienteRapidoComplementaresAberto}
                logoMarcaAssinaturaUrl={logoMarcaTopo}
                nomeMarcaAssinatura={nomeMarcaTopo}
                onToggleComplementares={() =>
                  setClienteRapidoComplementaresAberto((aberto) => !aberto)
                }
              />
              <div className="form-action-bar">
                <button
                  type="button"
                  onClick={cancelarClienteRapido}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  <X size={16} aria-hidden="true" />
                  Cancelar
                </button>
                <div className="form-action-bar-right">
                  <button
                    type="submit"
                    disabled={criarClienteRapidoMutation.isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {criarClienteRapidoMutation.isPending
                      ? "Salvando..."
                      : "Próximo"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
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
            onMouseDown={(event) => event.stopPropagation()}
          >
            <input
              className="preview-zoom-radio"
              type="radio"
              name="template-preview-zoom"
              id="template-preview-fit"
              defaultChecked
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="template-preview-zoom"
              id="template-preview-zoom"
            />
            <input
              className="preview-zoom-radio"
              type="radio"
              name="template-preview-zoom"
              id="template-preview-full"
            />
            <div className="template-preview-toolbar flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  Visualização do template
                </p>
                <h2
                  id="template-preview-title"
                  className="font-heading text-xl font-semibold"
                >
                  {getPropostaTemplateLabel(templatePreviewAberto)}
                </h2>
                {isTemplateCoresEstaticas(templatePreviewAberto) ? (
                  <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
                    Este template usa cores estáticas profissionais e não aplica
                    a paleta configurada no perfil. A logomarca e os dados da
                    conta continuam sendo usados normalmente.
                  </p>
                  ) : null}
              </div>
              <div className="preview-modal-actions">
                <button
                  type="button"
                  disabled={!templatePreviewAnterior}
                  onClick={() => {
                    if (templatePreviewAnterior) {
                      setTemplatePreviewAberto(templatePreviewAnterior);
                    }
                  }}
                  className="template-preview-nav-button"
                >
                  <ChevronsLeft size={16} aria-hidden="true" />
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={!templatePreviewProximo}
                  onClick={() => {
                    if (templatePreviewProximo) {
                      setTemplatePreviewAberto(templatePreviewProximo);
                    }
                  }}
                  className="template-preview-nav-button"
                >
                  Próximo
                  <ChevronsRight size={16} aria-hidden="true" />
                </button>
                <div className="preview-zoom-controls" aria-label="Zoom do preview">
                  <label htmlFor="template-preview-fit">Inteiro</label>
                  <label htmlFor="template-preview-zoom">Zoom</label>
                  <label htmlFor="template-preview-full">100%</label>
                </div>
                <button
                  type="button"
                  onClick={() => setTemplatePreviewAberto(null)}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const templateVisual = templatePreviewAberto;

                    if (!templateVisual) {
                      return;
                    }

                    void (async () => {
                      const selecionado =
                        await selecionarTemplateProposta(templateVisual);

                      if (selecionado) {
                        setTemplatePreviewAberto(null);
                        setPropostaTemplateModalAberto(false);
                      }
                    })();
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-white"
                >
                  Usar
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
                statusComercialConta={contaStatusComercial}
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
                  configuração de cores para sua proposta.
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
      <OnboardingModal
        aberto={onboardingModalAberto}
        onboarding={onboarding}
        jornadaAtiva={onboardingJornadaAtiva}
        perfilCompleto={perfilContaMinimoCompleto}
        primeiraPropostaGerada={primeiraPropostaGerada}
        isPending={onboardingMutation.isPending || onboardingEventoMutation.isPending}
        onAlterarJornada={setOnboardingJornadaAtiva}
        onFechar={() => setOnboardingModalAberto(false)}
        onPular={pularOnboarding}
        onConfigurarConta={iniciarConfiguracaoContaOnboarding}
        onPrimeiraProposta={iniciarPrimeiraPropostaOnboarding}
        onIniciarTour={iniciarTourOnboarding}
      />
      <ModalConfirmacaoSistema
        confirmacao={confirmacaoSistema}
        onCancelar={() => responderConfirmacaoSistema(false)}
        onConfirmar={() => responderConfirmacaoSistema(true)}
      />
      <ToastSistemaHost
        toasts={toastsSistema}
        onFechar={fecharToastSistema}
      />
    </div>
  );
}

function OnboardingModal({
  aberto,
  onboarding,
  jornadaAtiva,
  perfilCompleto,
  primeiraPropostaGerada,
  isPending,
  onAlterarJornada,
  onFechar,
  onPular,
  onConfigurarConta,
  onPrimeiraProposta,
  onIniciarTour,
}: {
  aberto: boolean;
  onboarding?: OnboardingResponse;
  jornadaAtiva: "conta" | "proposta";
  perfilCompleto: boolean;
  primeiraPropostaGerada: boolean;
  isPending: boolean;
  onAlterarJornada: (jornada: "conta" | "proposta") => void;
  onFechar: () => void;
  onPular: () => void;
  onConfigurarConta: () => void;
  onPrimeiraProposta: () => void;
  onIniciarTour: () => void;
}) {
  if (!aberto || typeof document === "undefined") {
    return null;
  }

  const configuracaoStatus = onboarding?.configuracaoConta.status ?? "NaoIniciado";
  const propostaStatus = onboarding?.primeiraProposta.status ?? "NaoIniciado";
  const configuracaoStatusVisual = perfilCompleto ? "Concluido" : configuracaoStatus;
  const propostaStatusVisual = primeiraPropostaGerada ? "Concluido" : propostaStatus;
  const etapaPrincipal =
    jornadaAtiva === "conta"
      ? {
          titulo: "Configure sua conta",
          detalhe:
            "Complete dados do negócio, logomarca, template, cores e formato preferido para padronizar as propostas.",
          acao: "Configurar conta",
          onClick: onConfigurarConta,
          concluido: perfilCompleto,
        }
      : {
          titulo: "Gere a primeira proposta",
          detalhe:
            "Cadastre cliente, serviço, orçamento e gere o arquivo pronto para envio.",
          acao: "Criar primeira proposta",
          onClick: onPrimeiraProposta,
          concluido: primeiraPropostaGerada,
        };
  const etapasWizard =
    jornadaAtiva === "conta"
      ? [
          {
            titulo: "Dados da marca",
            detalhe: "Nome comercial, segmento, cidade/UF e contato.",
            concluido: perfilCompleto,
          },
          {
            titulo: "Logomarca",
            detalhe: "Adicione a marca ou continue com iniciais no documento.",
            concluido: perfilCompleto,
          },
          {
            titulo: "Template e envio",
            detalhe: "Escolha template, cores e formato preferido.",
            concluido: perfilCompleto,
          },
          {
            titulo: "Revisao",
            detalhe: "Salve o perfil para concluir a configuracao.",
            concluido: perfilCompleto,
          },
        ]
      : [
          {
            titulo: "Cliente",
            detalhe: "Selecione ou cadastre quem vai receber a proposta.",
            concluido: primeiraPropostaGerada,
          },
          {
            titulo: "Servico",
            detalhe: "Escolha o pacote ou servico que sera vendido.",
            concluido: primeiraPropostaGerada,
          },
          {
            titulo: "Orcamento",
            detalhe: "Monte itens, valores e detalhes comerciais.",
            concluido: primeiraPropostaGerada,
          },
          {
            titulo: "Geracao e envio",
            detalhe: "Gere a proposta e deixe o material pronto para WhatsApp.",
            concluido: primeiraPropostaGerada,
          },
        ];
  const etapasConcluidas = etapasWizard.filter((etapa) => etapa.concluido).length;
  const progressoPercentual = Math.round((etapasConcluidas / etapasWizard.length) * 100);
  const statusJornadaAtual =
    jornadaAtiva === "conta" ? configuracaoStatusVisual : propostaStatusVisual;

  return createPortal(
    <div
      className="onboarding-modal-overlay"
      onMouseDown={(event) => {
        if (isBackdropClick(event)) {
          onFechar();
        }
      }}
    >
      <section
        className="onboarding-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
      >
        <header className="onboarding-modal-header">
          <div>
            <p className="onboarding-modal-kicker">Guia inicial</p>
            <h2 id="onboarding-modal-title">Conheça a Emprely antes de começar</h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="tooltip-icon-button"
            aria-label="Fechar guia inicial"
            title="Fechar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="onboarding-modal-tabs" role="tablist" aria-label="Jornadas do guia">
          <button
            type="button"
            role="tab"
            aria-selected={jornadaAtiva === "conta"}
            className={jornadaAtiva === "conta" ? "is-active" : ""}
            onClick={() => onAlterarJornada("conta")}
          >
            <Settings size={16} aria-hidden="true" />
            Conta
            {perfilCompleto ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={jornadaAtiva === "proposta"}
            className={jornadaAtiva === "proposta" ? "is-active" : ""}
            onClick={() => onAlterarJornada("proposta")}
          >
            <FileText size={16} aria-hidden="true" />
            Proposta
            {primeiraPropostaGerada ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
          </button>
        </div>

        <div className="onboarding-modal-body">
          <div className="onboarding-focus-panel">
            <span className="onboarding-focus-icon">
              {etapaPrincipal.concluido ? (
                <CheckCircle2 size={22} aria-hidden="true" />
              ) : (
                <Rocket size={22} aria-hidden="true" />
              )}
            </span>
            <div>
              <h3>{etapaPrincipal.titulo}</h3>
              <p>{etapaPrincipal.detalhe}</p>
              <div className="onboarding-status-row">
                <span>Conta: {getOnboardingStatusLabel(configuracaoStatusVisual)}</span>
                <span>Proposta: {getOnboardingStatusLabel(propostaStatusVisual)}</span>
              </div>
              <div className="onboarding-progress" aria-label={`Progresso ${progressoPercentual}%`}>
                <span style={{ width: `${progressoPercentual}%` }} />
              </div>
            </div>
          </div>

          <div className="onboarding-step-list">
            {etapasWizard.map((passo, index) => {
              const etapaConcluida = passo.concluido;
              const etapaAtiva =
                !etapaConcluida &&
                statusJornadaAtual !== "Pulado" &&
                index === etapasConcluidas;

              return (
                <div
                  key={passo.titulo}
                  className={[
                    "onboarding-step-item",
                    etapaConcluida ? "is-complete" : "",
                    etapaAtiva ? "is-active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span>
                    {etapaConcluida ? <CheckCircle2 size={14} aria-hidden="true" /> : index + 1}
                  </span>
                  <div>
                    <strong>{passo.titulo}</strong>
                    <p>{passo.detalhe}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="onboarding-step-list onboarding-step-list-legacy" aria-hidden="true">
            {(jornadaAtiva === "conta"
              ? [
                  "Preencher nome, segmento, cidade/UF e contato.",
                  "Adicionar ou revisar logomarca.",
                  "Escolher template padrão, cores e formato preferido.",
                ]
              : [
                  "Cadastrar ou selecionar o primeiro cliente.",
                  "Cadastrar um serviço reutilizável.",
                  "Montar, revisar e gerar a proposta para envio.",
                ]
            ).map((passo, index) => (
              <div key={passo} className="onboarding-step-item">
                <span>{index + 1}</span>
                <p>{passo}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="onboarding-modal-footer">
          <p className="onboarding-modal-hint">
            Lembrar depois adia todo o guia inicial; voce pode retomar pelo dashboard.
          </p>
          <button
            type="button"
            onClick={onIniciarTour}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold"
          >
            <Sparkles size={16} aria-hidden="true" />
            Ver tour guiado
          </button>
          <div className="onboarding-modal-actions">
            <button
              type="button"
              onClick={onPular}
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-muted transition hover:text-slate-950 disabled:opacity-60"
            >
              Lembrar depois
            </button>
            <button
              type="button"
              onClick={etapaPrincipal.onClick}
              disabled={isPending || etapaPrincipal.concluido}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {etapaPrincipal.concluido ? "Concluído" : etapaPrincipal.acao}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  );
}

function ModalConfirmacaoSistema({
  confirmacao,
  onCancelar,
  onConfirmar,
}: {
  confirmacao: ConfirmacaoSistemaState | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  const tituloId = useId();
  const descricaoId = useId();
  const botaoCancelarRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!confirmacao || typeof document === "undefined") {
      return;
    }

    botaoCancelarRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancelar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmacao, onCancelar]);

  if (!confirmacao || typeof document === "undefined") {
    return null;
  }

  const variante = confirmacao.variante ?? "warning";
  const Icone =
    variante === "danger"
      ? Trash2
      : variante === "success"
        ? CheckCircle2
        : variante === "info"
          ? Info
          : AlertTriangle;

  return createPortal(
    <div
      className="system-confirm-overlay"
      data-testid="system-confirm-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (isBackdropClick(event)) {
          onCancelar();
        }
      }}
    >
      <section
        className={`system-confirm-dialog is-${variante}`}
        data-testid="system-confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={descricaoId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="system-confirm-close"
          aria-label="Fechar confirmacao"
          onClick={onCancelar}
        >
          <X size={17} aria-hidden="true" />
        </button>
        <div className="system-confirm-header">
          <span className="system-confirm-icon" aria-hidden="true">
            <Icone size={22} />
          </span>
          <div className="min-w-0">
            <p className="system-confirm-eyebrow">Confirmação</p>
            <h2 id={tituloId}>{confirmacao.titulo}</h2>
          </div>
        </div>
        <div id={descricaoId} className="system-confirm-content">
          <p>{confirmacao.mensagem}</p>
          {confirmacao.detalhe ? <span>{confirmacao.detalhe}</span> : null}
        </div>
        <div className="system-confirm-actions">
          <button
            ref={botaoCancelarRef}
            type="button"
            className="system-confirm-button system-confirm-button-secondary"
            data-testid="system-confirm-cancel"
            onClick={onCancelar}
          >
            {confirmacao.textoCancelar ?? "Não"}
          </button>
          <button
            type="button"
            className="system-confirm-button system-confirm-button-primary"
            data-testid="system-confirm-confirm"
            onClick={onConfirmar}
          >
            {confirmacao.textoConfirmar ?? "Sim"}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function ToastSistemaHost({
  toasts,
  onFechar,
}: {
  toasts: ToastSistemaItem[];
  onFechar: (id: number) => void;
}) {
  if (!toasts.length || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="toast-system-region" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ToastSistemaCard
          key={toast.id}
          toast={toast}
          onFechar={() => onFechar(toast.id)}
        />
      ))}
    </div>,
    document.body,
  );
}

function ToastSistemaCard({
  toast,
  onFechar,
}: {
  toast: ToastSistemaItem;
  onFechar: () => void;
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onFechar, toast.duracaoMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onFechar, toast.duracaoMs]);

  const Icone =
    toast.variante === "success"
      ? CheckCircle2
      : toast.variante === "warning"
        ? AlertTriangle
        : toast.variante === "error"
          ? XCircle
          : Info;

  return (
    <section
      className={`toast-system-card is-${toast.variante}`}
      role={toast.variante === "success" || toast.variante === "info" ? "status" : "alert"}
    >
      <span className="toast-system-icon" aria-hidden="true">
        <Icone size={18} />
      </span>
      <div className="toast-system-content">
        <strong>{getToastSistemaTitulo(toast.variante)}</strong>
        <p>{toast.mensagem}</p>
      </div>
      <button
        type="button"
        className="toast-system-close"
        onClick={onFechar}
        aria-label="Fechar notificação"
      >
        <X size={15} aria-hidden="true" />
      </button>
      <span
        className="toast-system-progress"
        style={{ animationDuration: `${toast.duracaoMs}ms` }}
        aria-hidden="true"
      />
    </section>
  );
}

function getToastSistemaTitulo(variante: ToastSistemaVariante): string {
  const titulos: Record<ToastSistemaVariante, string> = {
    success: "Sucesso",
    warning: "Atenção",
    info: "Informação",
    error: "Erro",
  };

  return titulos[variante];
}

function getToastSistemaVariante(
  mensagem: string,
  origem: ToastSistemaOrigem,
): ToastSistemaVariante {
  const texto = mensagem.toLowerCase();

  if (origem === "sessao") {
    return "warning";
  }

  if (texto.includes("não foi possível") || texto.includes("nao foi possivel")) {
    return "error";
  }

  if (
    texto.includes("preencha") ||
    texto.includes("revise os campos") ||
    texto.includes("salve o rascunho antes") ||
    texto.includes("salve as alterações antes") ||
    texto.includes("salve as alteracoes antes") ||
    texto.includes("trial expirado") ||
    texto.includes("limite recomendado") ||
    texto.includes("use uma imagem") ||
    texto.includes("não abriu") ||
    texto.includes("nao abriu")
  ) {
    return "warning";
  }

  if (
    origem === "perfil" ||
    origem === "exportacao" ||
    texto.includes("copiada") ||
    texto.includes("gerando")
  ) {
    return "info";
  }

  return "success";
}

function isCampoOpcional(label: string) {
  return /\bopcional\b/i.test(label);
}

function formatCampoLabel(label: string) {
  return label.replace(/\s*\(?opcional\)?\s*/i, " ").replace(/\s+/g, " ").trim();
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
    const opcional = isCampoOpcional(label);
    const labelDisplay = opcional ? formatCampoLabel(label) : label;

    return (
      <label
        className="campo-texto block"
        data-optional={opcional ? "true" : undefined}
      >
        <span className="text-sm font-medium text-foreground">{labelDisplay}</span>
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

const corHexRegex = /^#[0-9A-Fa-f]{6}$/;

function normalizarCorHexInput(valor: string) {
  const valorLimpo = valor.trim().replace(/[^#0-9A-Fa-f]/g, "").toUpperCase();

  if (!valorLimpo) {
    return "";
  }

  const semPrefixo = valorLimpo.replace(/^#/, "").slice(0, 6);
  return `#${semPrefixo}`;
}

type CampoCorPerfilProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  helperText?: string;
};

function CampoCorPerfil({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
}: CampoCorPerfilProps) {
  const campoId = useId();
  const erroId = `${campoId}-erro`;
  const descricaoId = `${campoId}-descricao`;
  const corValida = corHexRegex.test(value) ? value : "#000000";

  return (
    <label className="profile-color-field">
      <span className="profile-color-label">{label}</span>
      <span className="profile-color-control">
        <span
          className="profile-color-swatch"
          style={{ backgroundColor: corValida }}
          aria-hidden="true"
        />
        <input
          type="color"
          value={corValida}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          onBlur={onBlur}
          aria-label={`Selecionar ${label.toLowerCase()}`}
          className="profile-color-picker"
        />
        <input
          id={campoId}
          type="text"
          value={value}
          maxLength={7}
          inputMode="text"
          spellCheck={false}
          onChange={(event) => onChange(normalizarCorHexInput(event.target.value))}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? descricaoId : ""} ${
            error ? erroId : ""
          }`.trim() || undefined}
          className="profile-color-hex"
        />
      </span>
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
}

type CampoMoedaRealProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "inputMode" | "onChange" | "type" | "value"
> & {
  label: string;
  value: number | null | undefined;
  onValueChange: (value: number) => void;
  error?: string;
  helperText?: string;
};

const CampoMoedaReal = forwardRef<HTMLInputElement, CampoMoedaRealProps>(
  (
    {
      label,
      value,
      onValueChange,
      error,
      helperText,
      id,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const campoId = useId();
    const inputId = id ?? campoId;
    const descricaoId = `${inputId}-descricao`;
    const erroId = `${inputId}-erro`;
    const opcional = isCampoOpcional(label);
    const labelDisplay = opcional ? formatCampoLabel(label) : label;
    const descricaoMoeda =
      helperText ?? "Digite 1500 para R$ 1.500,00 ou 1500,50 para R$ 1.500,50.";
    const [textoEmEdicao, setTextoEmEdicao] = useState(() =>
      formatMoedaRealInput(value),
    );
    const [estaEditando, setEstaEditando] = useState(false);
    const valorFormatado = formatMoedaRealInput(value);

    return (
      <label
        className="campo-texto block"
        data-optional={opcional ? "true" : undefined}
      >
        <span className="text-sm font-medium text-foreground">{labelDisplay}</span>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={estaEditando ? textoEmEdicao : valorFormatado}
          onFocus={(event) => {
            setEstaEditando(true);
            const textoEditavel =
              valorSeguro(value) > 0 ? formatMoedaRealEditavel(value) : "";
            setTextoEmEdicao(textoEditavel);
            window.requestAnimationFrame(() => {
              event.currentTarget.setSelectionRange(0, textoEditavel.length);
            });
            onFocus?.(event);
          }}
          onChange={(event) => {
            const novoTexto = event.target.value;
            setTextoEmEdicao(novoTexto);
            onValueChange(parseMoedaRealInput(novoTexto));
          }}
          onBlur={(event) => {
            setEstaEditando(false);
            setTextoEmEdicao(formatMoedaRealInput(parseMoedaRealInput(event.target.value)));
            onBlur?.(event);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={`${descricaoMoeda ? descricaoId : ""} ${
            error ? erroId : ""
          }`.trim() || undefined}
          className="mt-1 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
        />
        {descricaoMoeda ? (
          <span id={descricaoId} className="campo-helper mt-1 block text-xs text-muted">
            {descricaoMoeda}
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

CampoMoedaReal.displayName = "CampoMoedaReal";

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
    const opcional = isCampoOpcional(label);
    const labelDisplay = opcional ? formatCampoLabel(label) : label;

    return (
      <div
        className="campo-texto block"
        data-optional={opcional ? "true" : undefined}
      >
        <label className="text-sm font-medium text-foreground" htmlFor={inputId}>
          {labelDisplay}
        </label>
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
      </div>
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
    const opcional = isCampoOpcional(label);
    const labelDisplay = opcional ? formatCampoLabel(label) : label;

    return (
      <div
        className="campo-texto block"
        data-optional={opcional ? "true" : undefined}
      >
        <label className="text-sm font-medium text-foreground" htmlFor={inputId}>
          {labelDisplay}
        </label>
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
      </div>
    );
  },
);

CampoTextarea.displayName = "CampoTextarea";

type ClienteFormularioCamposProps = {
  form: UseFormReturn<ClienteFormInput>;
  complementaresAberto: boolean;
  logoMarcaAssinaturaUrl: string | null;
  nomeMarcaAssinatura: string;
  onToggleComplementares: () => void;
};

function ClienteFormularioCampos({
  form,
  complementaresAberto,
  logoMarcaAssinaturaUrl,
  nomeMarcaAssinatura,
  onToggleComplementares,
}: ClienteFormularioCamposProps) {
  const nome = useWatch({
    control: form.control,
    name: "nome",
  });
  const telefone = useWatch({
    control: form.control,
    name: "telefone",
  });
  const instagram = useWatch({
    control: form.control,
    name: "instagram",
  });
  const facebook = useWatch({
    control: form.control,
    name: "facebook",
  });
  const tiktok = useWatch({
    control: form.control,
    name: "tiktok",
  });
  const email = useWatch({
    control: form.control,
    name: "email",
  });
  const whatsappUrl = buildWhatsappContatoClienteUrl({ nome, telefone });
  const instagramUrl = buildClienteSocialUrl("instagram", instagram);
  const facebookUrl = buildClienteSocialUrl("facebook", facebook);
  const tiktokUrl = buildClienteSocialUrl("tiktok", tiktok);
  const emailUrl = buildClienteEmailUrl({
    email,
    logoMarcaUrl: logoMarcaAssinaturaUrl,
    nomeMarca: nomeMarcaAssinatura,
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] md:items-start">
        <CampoTexto
          label="Nome"
          error={form.formState.errors.nome?.message}
          {...form.register("nome")}
        />
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <CampoTexto
            label="Telefone"
            placeholder="(11) 99999-9999"
            error={form.formState.errors.telefone?.message}
            {...buildTelefoneInputProps(
              form.register("telefone", telefoneInputRegisterOptions),
            )}
          />
          <ContatoWhatsappClienteButton
            href={whatsappUrl}
            ariaLabel="Entrar em contato com este cliente pelo WhatsApp"
            size="lg"
          />
        </div>
      </div>

      <div className="client-complementary-panel rounded-md border border-border bg-slate-50/70">
        <button
          type="button"
          aria-expanded={complementaresAberto}
          onClick={onToggleComplementares}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground"
        >
          Informações complementares
          {complementaresAberto ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </button>
        {complementaresAberto ? (
          <div className="grid gap-4 border-t border-border p-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <CampoTexto
                  label="Instagram (opcional)"
                  placeholder="@usuario"
                  error={form.formState.errors.instagram?.message}
                  {...form.register("instagram")}
                />
                <LinkSocialClienteButton
                  href={instagramUrl}
                  label="Instagram"
                  rede="instagram"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <CampoTexto
                  label="Facebook (opcional)"
                  placeholder="facebook.com/pagina"
                  error={form.formState.errors.facebook?.message}
                  {...form.register("facebook")}
                />
                <LinkSocialClienteButton
                  href={facebookUrl}
                  label="Facebook"
                  rede="facebook"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <CampoTexto
                  label="TikTok (opcional)"
                  placeholder="@usuario"
                  error={form.formState.errors.tiktok?.message}
                  {...form.register("tiktok")}
                />
                <LinkSocialClienteButton
                  href={tiktokUrl}
                  label="TikTok"
                  rede="tiktok"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <CampoTexto
                  label="E-mail (opcional)"
                  type="email"
                  error={form.formState.errors.email?.message}
                  {...form.register("email")}
                />
                <EmailClienteButton href={emailUrl} />
              </div>
              <CampoTexto
                label="CPF/CNPJ (opcional)"
                placeholder="000.000.000-00"
                error={form.formState.errors.documento?.message}
                {...buildCpfCnpjInputProps(
                  form.register("documento", cpfCnpjInputRegisterOptions),
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(8rem,12rem)_minmax(11rem,16rem)]">
              <CampoTexto
                label="Endereço (opcional)"
                error={form.formState.errors.endereco?.message}
                {...form.register("endereco")}
              />
              <CampoTexto
                label="Número (opcional)"
                error={form.formState.errors.numero?.message}
                {...form.register("numero")}
              />
              <CampoTexto
                label="Cidade (opcional)"
                error={form.formState.errors.cidade?.message}
                {...form.register("cidade")}
              />
            </div>
          </div>
        ) : null}
      </div>

      <CampoTextarea
        label="Observações (opcional)"
        rows={4}
        error={form.formState.errors.observacoes?.message}
        {...form.register("observacoes")}
      />
    </>
  );
}

type ListaDetalhamentoPropostaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  variante: "positive" | "negative";
};

function ListaDetalhamentoProposta({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  variante,
}: ListaDetalhamentoPropostaProps) {
  const campoId = useId();
  const inputId = `${campoId}-novo`;
  const erroId = `${campoId}-erro`;
  const itens = splitLinhasEditaveisFormulario(value);
  const [novoItem, setNovoItem] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function atualizarItens(proximosItens: string[]) {
    onChange(joinLinhasEditaveisFormulario(proximosItens));
  }

  function adicionarItem() {
    const item = novoItem.trim();

    if (!item) {
      return;
    }

    atualizarItens([...itens, item]);
    setNovoItem("");
  }

  function atualizarItem(index: number, proximoValor: string) {
    const proximosItens = [...itens];
    proximosItens[index] = proximoValor.length > 0 ? proximoValor : " ";
    atualizarItens(proximosItens);
  }

  function finalizarEdicaoItem(index: number) {
    const proximosItens = [...itens];
    const itemNormalizado = proximosItens[index]?.trim() ?? "";

    if (!itemNormalizado) {
      proximosItens.splice(index, 1);
    } else {
      proximosItens[index] = itemNormalizado;
    }

    atualizarItens(proximosItens);
    onBlur();
  }

  function removerItem(index: number) {
    atualizarItens(itens.filter((_, itemIndex) => itemIndex !== index));
  }

  function moverItem(origem: number, destino: number) {
    if (origem === destino || origem < 0 || destino < 0) {
      return;
    }

    const proximosItens = [...itens];
    const [itemMovido] = proximosItens.splice(origem, 1);

    if (typeof itemMovido === "undefined") {
      return;
    }

    proximosItens.splice(destino, 0, itemMovido);
    atualizarItens(proximosItens);
  }

  function handleDragStart(index: number, event: DragEvent<HTMLLIElement>) {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDrop(index: number, event: DragEvent<HTMLLIElement>) {
    event.preventDefault();
    const origemTexto = event.dataTransfer.getData("text/plain");
    const origem = dragIndex ?? Number(origemTexto);

    if (Number.isInteger(origem)) {
      moverItem(origem, index);
    }

    setDragIndex(null);
  }

  return (
    <div
      className={`proposal-detail-list proposal-detail-list-${variante}`}
      aria-describedby={error ? erroId : undefined}
    >
      <div className="proposal-detail-list-header">
        <label htmlFor={inputId}>{label}</label>
        <span>{itens.filter((item) => item.trim()).length}</span>
      </div>
      <div className="proposal-detail-list-add">
        <input
          id={inputId}
          name={`${name}-novo`}
          type="text"
          value={novoItem}
          placeholder={placeholder}
          onChange={(event) => setNovoItem(event.target.value)}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              adicionarItem();
            }
          }}
        />
        <button
          type="button"
          onClick={adicionarItem}
          disabled={!novoItem.trim()}
          className="proposal-detail-list-add-button tooltip-icon-button"
          aria-label={`Adicionar em ${label}`}
          data-tooltip="Adicionar"
          title="Adicionar"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      {itens.length ? (
        <ul className="proposal-detail-list-items">
          {itens.map((item, index) => (
            <li
              key={`${name}-${index}`}
              draggable
              onDragStart={(event) => handleDragStart(index, event)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => handleDrop(index, event)}
              onDragEnd={() => setDragIndex(null)}
              className={dragIndex === index ? "is-dragging" : ""}
            >
              <span
                className="proposal-detail-list-drag"
                aria-hidden="true"
                title="Arrastar"
              >
                <GripVertical size={16} />
              </span>
              <input
                name={`${name}-${index}`}
                type="text"
                value={item}
                aria-label={`${label} ${index + 1}`}
                onChange={(event) => atualizarItem(index, event.target.value)}
                onBlur={() => finalizarEdicaoItem(index)}
              />
              <div className="proposal-detail-list-actions">
                <button
                  type="button"
                  onClick={() => moverItem(index, index - 1)}
                  disabled={index === 0}
                  className="proposal-detail-list-action tooltip-icon-button"
                  aria-label="Mover para cima"
                  data-tooltip="Mover para cima"
                  title="Mover para cima"
                >
                  <ChevronUp size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => moverItem(index, index + 1)}
                  disabled={index === itens.length - 1}
                  className="proposal-detail-list-action tooltip-icon-button"
                  aria-label="Mover para baixo"
                  data-tooltip="Mover para baixo"
                  title="Mover para baixo"
                >
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => removerItem(index)}
                  className="proposal-detail-list-action proposal-detail-list-remove tooltip-icon-button"
                  aria-label="Remover item"
                  data-tooltip="Remover"
                  title="Remover"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="proposal-detail-list-empty">Nenhum item adicionado.</div>
      )}
      {error ? (
        <span id={erroId} className="campo-error mt-1 block text-sm text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}

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

function PropostaWizardBar({
  etapas,
  etapaAtiva,
  onEtapaClick,
  sticky = false,
}: {
  etapas: PropostaWizardStepItem[];
  etapaAtiva: PropostaWizardEtapaId;
  onEtapaClick?: (etapa: PropostaWizardEtapaId) => void;
  sticky?: boolean;
}) {
  const etapaAtivaIndex = Math.max(
    etapas.findIndex((step) => step.id === etapaAtiva),
    0,
  );
  const etapaAtual = etapas[etapaAtivaIndex] ?? etapas[0];
  const progressoPercentual = Math.round(
    ((etapaAtivaIndex + 1) / Math.max(etapas.length, 1)) * 100,
  );

  function renderEtapa(step: PropostaWizardStepItem, index: number) {
    const ativo = step.id === etapaAtiva;
    const statusLabel = step.concluido
      ? "Concluido"
      : ativo
        ? "Atual"
        : step.bloqueado
          ? "Bloqueado"
          : "Pendente";
    const conteudo = (
      <>
        <strong className="proposal-wizard-step-marker">
          {step.concluido ? (
            <CheckCircle2 size={16} aria-hidden="true" />
          ) : (
            index + 1
          )}
        </strong>
        <span className="proposal-wizard-step-copy">
          <span className="proposal-wizard-step-order">Etapa {index + 1}</span>
          <span className="proposal-wizard-step-label">{step.label}</span>
        </span>
        <span className="proposal-wizard-step-status">{statusLabel}</span>
      </>
    );

    if (!onEtapaClick) {
      return (
        <span
          key={step.id}
          className={`${ativo ? "is-active" : ""} ${
            step.concluido ? "is-complete" : ""
          }`}
        >
          {conteudo}
        </span>
      );
    }

    return (
      <button
        key={step.id}
        type="button"
        disabled={step.bloqueado}
        onClick={() => onEtapaClick(step.id)}
        className={`${ativo ? "is-active" : ""} ${
          step.concluido ? "is-complete" : ""
        }`}
      >
        {conteudo}
      </button>
    );
  }

  return (
    <div className={`proposal-wizard-nav ${sticky ? "is-sticky" : ""}`}>
      <details className="proposal-wizard-mobile-steps">
        <summary>
          <span className="proposal-wizard-mobile-copy">
            <small>
              Etapa {etapaAtivaIndex + 1} de {etapas.length}
            </small>
            <strong>{etapaAtual?.label ?? "Proposta"}</strong>
          </span>
          <span className="proposal-wizard-mobile-meta">
            Ver etapas
          </span>
          <span className="proposal-wizard-mobile-chevron" aria-hidden="true">
            <ChevronDown size={17} />
          </span>
        </summary>
        <div className="proposal-wizard-mobile-progress" aria-hidden="true">
          <span style={{ width: `${progressoPercentual}%` }} />
        </div>
        <div className="proposal-wizard-mobile-list" aria-label="Etapas da nova proposta">
          {etapas.map(renderEtapa)}
        </div>
      </details>

      <div
        className="proposal-wizard-steps"
        aria-label="Etapas da nova proposta"
      >
        {etapas.map(renderEtapa)}
      </div>
    </div>
  );
}

function PropostaWizardMobileDock({
  etapaAtual,
  etapaLabel,
  totalEtapas,
  isPrimeiraEtapa,
  isRevisao,
  podeSalvar,
  salvando,
  podeGerar,
  gerando,
  onVoltar,
  onProximo,
  onGerar,
}: {
  etapaAtual: number;
  etapaLabel: string;
  totalEtapas: number;
  isPrimeiraEtapa: boolean;
  isRevisao: boolean;
  podeSalvar: boolean;
  salvando: boolean;
  podeGerar: boolean;
  gerando: boolean;
  onVoltar: () => void;
  onProximo: () => void;
  onGerar: () => void;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="proposal-mobile-step-dock no-print" aria-label="Navegação da etapa">
      <div className="proposal-mobile-step-dock-copy">
        <span>
          Etapa {etapaAtual} de {totalEtapas}
        </span>
        <strong>{etapaLabel}</strong>
      </div>
      <div className="proposal-mobile-step-dock-actions">
        {!isPrimeiraEtapa ? (
          <button
            type="button"
            onClick={onVoltar}
            className="proposal-mobile-step-dock-button"
          >
            <ArrowRight className="rotate-180" size={16} aria-hidden="true" />
            Anterior
          </button>
        ) : null}
        <button
          type="submit"
          form="proposta-editor-form"
          disabled={!podeSalvar || salvando}
          aria-label={isRevisao ? "Salvar rascunho" : "Salvar"}
          className={`proposal-mobile-step-dock-button ${isRevisao ? "" : "is-save"}`}
        >
          <Save size={16} aria-hidden="true" />
          {salvando ? "Salvando..." : isRevisao ? "Rascunho" : "Salvar"}
        </button>
        {isRevisao ? (
          <button
            type="button"
            onClick={onGerar}
            disabled={!podeGerar || gerando}
            className="proposal-mobile-step-dock-button is-primary"
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            {gerando ? "Gerando..." : "Gerar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onProximo}
            className="proposal-mobile-step-dock-button is-primary"
          >
            {"Pr\u00f3ximo"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>,
    document.body,
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

function InfoLinha({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="info-line-card">
      {icon ? <span className="info-line-icon">{icon}</span> : null}
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
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
    : "Cliente sem telefone válido para WhatsApp";
  const sizeClass = size === "lg" ? "h-11 w-11" : "h-11 w-11";
  const className = `tooltip-icon-button inline-flex shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-border disabled:bg-slate-50 disabled:text-muted disabled:opacity-60 ${sizeClass}`;

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-label="Cliente sem telefone válido para WhatsApp"
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

function LinkSocialClienteButton({
  href,
  label,
  rede,
}: {
  href: string;
  label: string;
  rede: RedeSocialCliente;
}) {
  const tooltip = href ? `Abrir ${label}` : `${label} não informado`;
  const className = `tooltip-icon-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border bg-white transition disabled:cursor-not-allowed disabled:border-border disabled:bg-slate-50 disabled:text-muted disabled:opacity-60 ${getSocialClienteButtonClass(rede)}`;

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-label={tooltip}
        title={tooltip}
        data-tooltip={tooltip}
        className={className}
      >
        <SocialClienteIcon rede={rede} size={17} />
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={tooltip}
      title={tooltip}
      data-tooltip={tooltip}
      className={className}
    >
      <SocialClienteIcon rede={rede} size={17} />
    </a>
  );
}

function EmailClienteButton({ href }: { href: string }) {
  const tooltip = href
    ? "Enviar e-mail para este cliente"
    : "Cliente sem e-mail válido";
  const className =
    "tooltip-icon-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 transition hover:border-sky-400 hover:bg-sky-100 disabled:cursor-not-allowed disabled:border-border disabled:bg-slate-50 disabled:text-muted disabled:opacity-60";

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-label={tooltip}
        title={tooltip}
        data-tooltip={tooltip}
        className={className}
      >
        <Mail size={17} aria-hidden="true" />
      </button>
    );
  }

  return (
    <a
      href={href}
      aria-label={tooltip}
      title={tooltip}
      data-tooltip={tooltip}
      className={className}
    >
      <Mail size={17} aria-hidden="true" />
    </a>
  );
}

function SocialClienteIcon({
  rede,
  size,
}: {
  rede: RedeSocialCliente;
  size: number;
}) {
  if (rede === "instagram") {
    return <InstagramGlyph size={size} />;
  }

  if (rede === "facebook") {
    return <FacebookGlyph size={size} />;
  }

  return <TikTokGlyph size={size} />;
}

function getSocialClienteButtonClass(rede: RedeSocialCliente): string {
  if (rede === "instagram") {
    return "border-fuchsia-200 text-fuchsia-700 hover:border-fuchsia-400 hover:bg-fuchsia-50";
  }

  if (rede === "facebook") {
    return "border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50";
  }

  return "border-slate-300 text-slate-900 hover:border-slate-500 hover:bg-slate-100";
}

function FacebookGlyph({
  size = 18,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
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
        d="M14.2 8.25h2.25V4.72c-.39-.05-1.73-.17-3.3-.17-3.26 0-5.49 1.99-5.49 5.64v3.18H4.1v3.95h3.56v6.13h4.25v-6.13h3.33l.53-3.95h-3.86V10.6c0-1.14.32-2.35 2.29-2.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokGlyph({
  size = 18,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
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
        d="M14.1 3.5h3.05c.18 1.33.82 2.48 1.78 3.37.84.78 1.91 1.3 3.07 1.47v3.1a7.82 7.82 0 0 1-3.05-.65 7.42 7.42 0 0 1-1.78-1.08v6.27c0 3.18-2.58 5.77-5.77 5.77a5.77 5.77 0 0 1-.88-11.47v3.23a2.56 2.56 0 1 0 3.58 2.35V3.5Z"
        fill="currentColor"
      />
    </svg>
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
  testId?: string;
};

type ListagemAcaoGrupo = {
  id: "principal" | "fluxo" | "gerenciar" | "perigo";
  label: string;
  acoes: ListagemAcao[];
};

function ListagemAcoes({
  acoes,
  ariaLabel,
  dataTestId,
}: {
  acoes: ListagemAcao[];
  ariaLabel: string;
  dataTestId?: string;
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
    const larguraDropdown = 288;
    const margemTela = 12;
    const espacoEntreBotao = 8;
    const maxHeight = Math.min(520, window.innerHeight - margemTela * 2);
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
      <div
        className="table-actions table-actions-icons"
        aria-label={ariaLabel}
        data-testid={dataTestId}
      >
        {acoesAtivas.map((acao) => (
          <ListagemAcaoIcone key={acao.label} acao={acao} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="table-actions table-actions-menu"
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      <div ref={rootRef} className="list-actions-dropdown-root">
        <button
          ref={buttonRef}
          type="button"
          className="table-action-icon tooltip-icon-button"
          aria-label="Abrir menu de ações"
          aria-haspopup="menu"
          aria-expanded={menuAberto}
          data-testid={dataTestId ? `${dataTestId}-menu` : undefined}
          data-tooltip="Mais ações"
          title="Mais ações"
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
                data-testid={dataTestId ? `${dataTestId}-dropdown` : undefined}
                style={{
                  top: dropdownPosicao.top,
                  left: dropdownPosicao.left,
                  maxHeight: dropdownPosicao.maxHeight,
                }}
              >
                {getListagemAcoesGrupos(acoesAtivas).map((grupo) => (
                  <div
                    key={grupo.id}
                    className={`list-actions-dropdown-group is-${grupo.id}`}
                    role="group"
                    aria-label={grupo.label}
                  >
                    <span className="list-actions-dropdown-group-title">
                      {grupo.label}
                    </span>
                    {grupo.acoes.map((acao) => (
                      <ListagemAcaoDropdown
                        key={acao.label}
                        acao={acao}
                        onClose={() => setMenuAberto(false)}
                      />
                    ))}
                  </div>
                ))}
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

function getListagemAcoesGrupos(acoes: ListagemAcao[]): ListagemAcaoGrupo[] {
  const grupos: ListagemAcaoGrupo[] = [
    { id: "principal", label: "Principais", acoes: [] },
    { id: "fluxo", label: "Fluxo comercial", acoes: [] },
    { id: "gerenciar", label: "Gerenciar", acoes: [] },
    { id: "perigo", label: "Perigo", acoes: [] },
  ];

  acoes.forEach((acao) => {
    const label = acao.label.toLowerCase();

    if (acao.destructive || label === "excluir") {
      grupos.find((grupo) => grupo.id === "perigo")?.acoes.push(acao);
      return;
    }

    if (["visualizar", "pdf", "whatsapp"].includes(label)) {
      grupos.find((grupo) => grupo.id === "principal")?.acoes.push(acao);
      return;
    }

    if (["gerar", "enviar", "aceita", "recusada"].includes(label)) {
      grupos.find((grupo) => grupo.id === "fluxo")?.acoes.push(acao);
      return;
    }

    grupos.find((grupo) => grupo.id === "gerenciar")?.acoes.push(acao);
  });

  return grupos.filter((grupo) => grupo.acoes.length > 0);
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
        data-testid={acao.testId}
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
      data-testid={acao.testId}
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
        data-testid={acao.testId}
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
      data-testid={acao.testId}
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
          Próxima
        </button>
      </div>
    </div>
  );
}

type PreviewPropostaVisualProps = {
  perfilConta: PerfilContaResponse | undefined;
  contaNome: string;
  planoConta: ContaAtualResponse["plano"];
  statusComercialConta: ContaAtualResponse["statusComercial"];
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
  publicApprovalUrl: string | null;
  watermark: "nenhuma" | "trial-ativo" | "trial-expirado";
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
      statusComercialConta,
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
    : "Ainda não salva";
  const contatoMarca = buildContatoMarca(perfilConta);
  const watermark = getWatermarkDocumentoProposta(planoConta, statusComercialConta);
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
    telefoneMarca: formatTelefoneOpcional(perfilConta?.telefoneContato),
    emailMarca: perfilConta?.emailContato?.trim() ?? "",
    instagramMarca: normalizarInstagramDocumento(perfilConta?.instagram),
    siteMarca: perfilConta?.siteUrl?.trim() ?? "",
    publicApprovalUrl: proposta.publicApprovalUrl?.trim() || null,
    watermark,
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
    {documento.watermark !== "nenhuma" ? (
      <div className={`doc-trial-watermark is-${documento.watermark}`}>
        <img src={emprelyLogoMarcaDaguaSrc} alt="" aria-hidden="true" />
        <span>Orçamentos</span>
      </div>
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

function TemplateSelectionIcon({
  templateVisual,
}: {
  templateVisual: PropostaTemplateVisualAtivo;
}) {
  const variant = getTemplateCssClass(templateVisual);

  return (
    <svg
      className={`template-selection-svg ${variant}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <rect x="6" y="8" width="52" height="48" rx="12" className="template-svg-paper" />
      <path d="M18 22h18" className="template-svg-line template-svg-line-strong" />
      <path d="M18 30h28" className="template-svg-line" />
      <path d="M18 38h20" className="template-svg-line" />
      {templateVisual === "OrcamentoSimplificado" ? (
        <>
          <circle cx="45" cy="23" r="7" className="template-svg-accent" />
          <path d="M38 43c2.5-8 11.5-8 14 0" className="template-svg-stroke-accent" />
          <path d="M18 44h16" className="template-svg-line" />
        </>
      ) : templateVisual === "PropostaCompleta" ? (
        <>
          <rect x="39" y="17" width="10" height="10" rx="2" className="template-svg-accent" />
          <rect x="39" y="31" width="10" height="10" rx="2" className="template-svg-accent-muted" />
        </>
      ) : templateVisual === "LunaSocialStudio" ? (
        <>
          <circle cx="46" cy="23" r="7" className="template-svg-accent" />
          <path d="M41 40c2.5-6 7.5-6 10 0" className="template-svg-stroke-accent" />
        </>
      ) : templateVisual === "InstagramPremium" ? (
        <>
          <rect x="39" y="17" width="11" height="22" rx="4" className="template-svg-accent" />
          <path d="M42 25l6 4-6 4z" fill="#fff" />
          <path d="M38 44h14" className="template-svg-stroke-accent" />
        </>
      ) : templateVisual === "DarkGrowth" ? (
        <path d="M38 42l6-10 5 5 6-14" className="template-svg-stroke-accent" />
      ) : templateVisual === "Claymorphism" ? (
        <>
          <circle cx="45" cy="24" r="8" className="template-svg-accent-muted" />
          <circle cx="38" cy="36" r="6" className="template-svg-accent" />
        </>
      ) : templateVisual === "Emprely" ? (
        <path d="M39 20h12v12H39zM39 36h12v8H39z" className="template-svg-accent" />
      ) : templateVisual === "ExecutivoEditorial" ? (
        <path d="M42 18v28M48 18v28" className="template-svg-stroke-accent" />
      ) : templateVisual === "CorporativoBoard" ? (
        <>
          <rect x="38" y="19" width="14" height="8" rx="2" className="template-svg-accent" />
          <rect x="38" y="31" width="14" height="8" rx="2" className="template-svg-accent-muted" />
        </>
      ) : templateVisual === "InstitucionalClean" ? (
        <path d="M40 20h10M40 28h10M40 36h10" className="template-svg-stroke-accent" />
      ) : (
        <rect x="40" y="20" width="10" height="20" rx="3" className="template-svg-accent" />
      )}
    </svg>
  );
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
          <span className="doc-kicker">Orçamento essencial</span>
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
      <DocumentoFooter d={d} cta="Aprovar" minimal />
    </div>
  );
}

function TemplateOrcamentoSimplificado({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);
  const textoResumo = d.introducao || d.observacoes;

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
          <small>Resumo comercial</small>
          <DocumentoTitulo titulo={d.titulo} className="doc-simple-title-main" />
          <p>Itens, condições comerciais e próximos passos em uma apresentação objetiva.</p>
        </div>
      </section>

      <DocumentoMetaCards d={d} />

      {textoResumo ? (
        <section className="doc-simple-intro">
          <div className="doc-round-icon">
            <UsersRound size={46} />
          </div>
          <p>{textoResumo}</p>
        </section>
      ) : null}

      <section className="doc-simple-grid doc-simple-grid-main">
        <div>
          <DocumentoSectionTitle icon={<Tags size={20} />} title="Itens e pacotes" />
          <DocumentoTabelaServicos d={d} compact detailed icons />
        </div>
        <div className="doc-simple-summary">
          <DocumentoTotalCard d={d} variant="receipt" />
        </div>
      </section>

      {d.beneficios.length || inclusos.length ? (
        <section className="doc-simple-grid">
          <DocumentoBeneficios d={d} />
          <DocumentoLista titulo="Condições de entrega" itens={inclusos} positive />
        </section>
      ) : null}

      <section className="doc-simple-actions">
        <DocumentoCondicoes d={d} icon />
        <DocumentoAprovacaoCta d={d} className="doc-cta doc-cta-simple" iconSize={30} strong />
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
  const inclusosTitle = inclusos.length ? `${sectionIndex++}. O que está incluso` : "";
  const naoInclusosTitle = d.itensNaoInclusos.length
    ? `${sectionIndex++}. O que não está incluso`
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
          <span>Proposta comercial completa</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-complete-title-main" />
          <small>Escopo, entregas, prazos, condições e próximos passos para aprovar com clareza.</small>
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
            title="Objetivos e benefícios"
          />
          <DocumentoBeneficios d={d} mode="wide" />
        </>
      ) : null}

      <section className="doc-complete-three">
        <div>
          <DocumentoSectionTitle
            icon={<PackageCheck size={22} />}
            index={escopoIndex}
            title="Escopo e entregáveis"
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
              title="Cronograma e condições"
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
            title="Observações finais"
          />
          <p className="doc-paragraph doc-observacao">
            {d.observacoes || d.condicoesPagamento}
          </p>
        </>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar" />
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
  const texto = luna
    ? {
        kicker: "Plano recorrente",
        titulo: "Plano de entregas recorrentes",
        escopo: "Escopo, entregas e rotina",
        beneficios: "Benefícios esperados",
        listas: "Combinados e responsabilidades",
        cronograma: "Cadência de execução",
        cta: "Aprovar",
        tipo: "social" as const,
      }
    : {
        kicker: "Plano estratégico",
        titulo: "Plano de execução e resultado",
        escopo: "Etapas, entregas e otimização",
        beneficios: "Indicadores e ganhos esperados",
        listas: "Responsabilidades e limites",
        cronograma: "Ciclo de execução",
        cta: "Aprovar",
        tipo: "trafego" as const,
      };

  return (
    <div className={`doc-page doc-social-page ${luna ? "doc-social-page-luna" : ""}`}>
      <header className="doc-social-hero">
        <div>
          <DocumentoMarca d={d} dark={luna} large />
          <h1>{texto.kicker}</h1>
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
              title={texto.beneficios}
            />
            <DocumentoBeneficios d={d} />
          </>
        ) : null}

        <DocumentoSectionTitle
          icon={<FolderOpen size={20} />}
          title={texto.escopo}
        />
        <DocumentoTabelaServicos d={d} compact detailed icons />

        {getInclusosDocumento(d).length || d.itensNaoInclusos.length ? (
          <section className="doc-social-lists">
            <DocumentoLista titulo={texto.listas} itens={getInclusosDocumento(d)} positive />
            <DocumentoLista titulo="O que não está incluso" itens={d.itensNaoInclusos} />
          </section>
        ) : null}

        {d.cronograma.length ? (
          <>
            <DocumentoSectionTitle
              icon={<Clock3 size={20} />}
              title={texto.cronograma}
            />
            <DocumentoTimeline d={d} horizontal />
          </>
        ) : null}

        <section className="doc-social-bottom">
          <DocumentoInvestimentoBloco d={d} />
          <div className="doc-observation-card">
            {d.observacoes || d.condicoesPagamento ? (
              <>
              <DocumentoSectionTitle icon={<Sparkles size={20} />} title="Observações finais" />
              <p>{d.observacoes || d.condicoesPagamento}</p>
              </>
            ) : null}
              <DocumentoAprovacaoCta d={d} className="doc-cta" iconSize={24} strong />
              <DocumentoContatoInline d={d} />
          </div>
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
          <span className="doc-kicker">Pacote premium</span>
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
            <h2>Objetivo da proposta</h2>
            <p>{textoResumo}</p>
          </div>
        </section>
      ) : null}

      <DocumentoBeneficios d={d} mode="wide" />

      <section className="doc-instagram-grid">
        <div>
          <DocumentoSectionTitle title="Entregáveis" />
          <DocumentoTabelaServicos d={d} compact detailed icons />
        </div>
        <div className="doc-stack">
          <DocumentoLista titulo="Condições e entregas" itens={getInclusosDocumento(d)} positive />
          <DocumentoLista titulo="Fora do pacote" itens={d.itensNaoInclusos} />
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

      <DocumentoFooter d={d} cta="Aprovar" premium />
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
          <DocumentoLista titulo="O que está incluso" itens={getInclusosDocumento(d)} positive />
          <DocumentoLista titulo="O que não está incluso" itens={d.itensNaoInclusos} />
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

      <DocumentoFooter d={d} cta="Aprovar" />
    </div>
  );
}

function TemplateEmprely({ d }: TemplateDocumentoBaseProps) {
  return (
    <div className="doc-page doc-emprely-page">
      <header className="doc-emprely-header">
        <DocumentoMarca d={d} />
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
          <DocumentoTimeline d={d} horizontal />
        </>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar" premium />
    </div>
  );
}

function TemplateExecutivoEditorial({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);

  return (
    <div className="doc-page doc-executive-page">
      <header className="doc-executive-header">
        <DocumentoMarca d={d} />
      </header>

      <section className="doc-executive-cover">
        <div className="doc-executive-rule" />
        <div>
          <span className="doc-kicker">Escopo, plano e acompanhamento</span>
          <DocumentoTitulo titulo={d.titulo} className="doc-executive-title-main" />
          {d.introducao ? <p>{d.introducao}</p> : null}
        </div>
      </section>

      <DocumentoMetaStrip d={d} labelsUpper />

      <section className="doc-executive-layout">
        <main>
          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<BadgeCheck size={20} />} title="Objetivos e ganhos esperados" />
              <DocumentoBeneficios d={d} mode="wide" />
            </>
          ) : null}

          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Escopo e entregáveis" />
          <DocumentoTabelaServicos d={d} compact totalColumn />
        </main>

        <aside className="doc-executive-aside">
          <DocumentoTotalCard d={d} variant="light" />
          <DocumentoCondicoes d={d} compact />
        </aside>
      </section>

      {inclusos.length || d.itensNaoInclusos.length ? (
        <section className="doc-executive-lists">
          <DocumentoLista titulo="Incluído na proposta" itens={inclusos} positive />
          <DocumentoLista titulo="Fora do escopo" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar" minimal />
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
          <DocumentoSectionTitle icon={<ShieldCheck size={20} />} title="Frentes contratadas" />
          <DocumentoTabelaServicos d={d} compact detailed />

          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<Target size={20} />} title="Metas e indicadores" />
              <DocumentoBeneficios d={d} />
            </>
          ) : null}
        </main>

        {inclusos.length || d.itensNaoInclusos.length ? (
          <aside>
            <DocumentoLista titulo="Entregas inclusas" itens={inclusos} positive />
            <DocumentoLista titulo="Fora do escopo" itens={d.itensNaoInclusos} />
          </aside>
        ) : null}
      </section>

      {d.cronograma.length ? (
        <section className="doc-board-timeline">
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Roadmap e cadência comercial" />
          <DocumentoTimeline d={d} horizontal />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar" premium />
    </div>
  );
}

function TemplateInstitucionalClean({ d }: TemplateDocumentoBaseProps) {
  const inclusos = getInclusosDocumento(d);

  return (
    <div className="doc-page doc-institutional-page">
      <header className="doc-institutional-header">
        <DocumentoMarca d={d} />
      </header>

      <section className="doc-institutional-title">
        <span className="doc-kicker">Escopo, aplicações e entregas finais</span>
        <DocumentoTitulo titulo={d.titulo} className="doc-institutional-title-main" />
        {d.introducao ? <p>{d.introducao}</p> : null}
      </section>

      <DocumentoMetaStrip d={d} labelsUpper />

      <section className="doc-institutional-grid">
        <main>
          {d.beneficios.length ? (
            <>
              <DocumentoSectionTitle icon={<Target size={20} />} title="Objetivos e benefícios" />
              <DocumentoBeneficios d={d} mode="wide" />
            </>
          ) : null}

          <DocumentoSectionTitle icon={<PackageCheck size={20} />} title="Entregáveis, revisões e investimento" />
          <DocumentoTabelaServicos d={d} compact totalColumn />
        </main>

        <aside>
          <DocumentoTotalCard d={d} variant="light" />
          <DocumentoCondicoes d={d} compact />
        </aside>
      </section>

      {inclusos.length || d.itensNaoInclusos.length ? (
        <section className="doc-institutional-lists">
          <DocumentoLista titulo="Arquivos e aplicações inclusas" itens={inclusos} positive />
          <DocumentoLista titulo="Fora do escopo criativo" itens={d.itensNaoInclusos} />
        </section>
      ) : null}

      {d.cronograma.length ? (
        <section className="doc-institutional-timeline">
          <DocumentoSectionTitle icon={<Clock3 size={20} />} title="Etapas e aprovações" />
          <DocumentoTimeline d={d} horizontal />
        </section>
      ) : null}

      {d.observacoes ? (
        <div className="doc-info-strip">
          <Info size={22} />
          <p>{d.observacoes}</p>
        </div>
      ) : null}

      <DocumentoFooter d={d} cta="Aprovar" minimal />
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
      <DocumentoLogoMarca
        key={d.logoUrl ?? d.nomeMarca}
        logoUrl={d.logoUrl}
        nomeMarca={d.nomeMarca}
      />
      <div>
        <strong>{d.nomeMarca}</strong>
        <DocumentoMarcaContato d={d} />
      </div>
    </div>
  );
}

function DocumentoMarcaContato({ d }: TemplateDocumentoBaseProps) {
  const contato = getContatoPrincipalMarca(d);

  if (!contato) {
    return null;
  }

  const conteudo = <small>{contato.valor}</small>;

  return contato.href ? (
    <a
      className="doc-brand-contact-link"
      data-pdf-link-url={contato.href}
      href={contato.href}
      target={contato.href.startsWith("mailto:") ? undefined : "_blank"}
      rel={contato.href.startsWith("mailto:") ? undefined : "noreferrer"}
      aria-label={contato.label}
    >
      {conteudo}
    </a>
  ) : (
    conteudo
  );
}

function DocumentoLogoMarca({
  logoUrl,
  nomeMarca,
}: {
  logoUrl: string | null;
  nomeMarca: string;
}) {
  const [modoImagem, setModoImagem] = useState<"cors" | "sem-cors" | "fallback">(
    logoUrl ? "cors" : "fallback",
  );
  const imagemVisivel = Boolean(logoUrl) && modoImagem !== "fallback";

  return (
    <span className="doc-brand-logo-frame">
      <span className="doc-brand-fallback">{getIniciaisMarca(nomeMarca)}</span>
      {imagemVisivel ? (
        <img
          key={`${logoUrl}-${modoImagem}`}
          src={logoUrl ?? ""}
          alt={`Logo ${nomeMarca}`}
          crossOrigin={modoImagem === "cors" ? "anonymous" : undefined}
          onError={() => {
            setModoImagem((modoAtual) =>
              modoAtual === "cors" ? "sem-cors" : "fallback",
            );
          }}
        />
      ) : null}
    </span>
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
  const itens = getMetadadosDocumento(d).filter((item) => item.label !== "Número");

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

  const classe = [
    "doc-benefit-grid",
    mode === "wide" ? "doc-benefit-grid-wide" : "",
    beneficios.length === 1 ? "doc-benefit-grid-single" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classe}>
      {beneficios.map((beneficio, index) => {
        const beneficioDocumento = parseBeneficioDocumento(beneficio);

        return (
          <article key={`${beneficio}-${index}`} className="doc-benefit-card">
            <span>{icons[index % icons.length]}</span>
            <strong>{beneficioDocumento.titulo}</strong>
            {beneficioDocumento.descricao ? <p>{beneficioDocumento.descricao}</p> : null}
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
            <th>Serviço</th>
            {mostrarDetalhamento ? <th>Detalhamento / entrega</th> : null}
            <th>{compact ? "Qtd." : "Quantidade"}</th>
            <th>{totalColumn ? "Valor unitário" : "Valor"}</th>
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
        {positive ? <CheckCircle2 size={24} /> : <CircleMinus size={24} />}
        {titulo}
      </h3>
      <ul>
        {itens.map((item, index) => (
          <li key={`${item}-${index}`}>
            {positive ? <CheckCircle2 size={15} /> : <CircleMinus size={15} />}
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
}: TemplateDocumentoBaseProps & {
  horizontal?: boolean;
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
    <section className={`doc-timeline ${horizontal ? "doc-timeline-horizontal" : ""}`}>
      {itens.map((item, index) => {
        const [titulo, ...descricao] = item.split(":");
        const texto = descricao.join(":").trim() || titulo.trim();

        return (
          <article key={`${item}-${index}`}>
            <span>{icons[index % icons.length]}</span>
            <p>{texto}</p>
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
        <h3>Condições de pagamento</h3>
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
      {cta ? <DocumentoAprovacaoCta d={d} className="doc-footer-cta" /> : null}
    </footer>
  );
}

function DocumentoAprovacaoCta({
  d,
  className,
  iconSize = 22,
  strong = false,
}: TemplateDocumentoBaseProps & {
  className: string;
  iconSize?: number;
  strong?: boolean;
}) {
  const conteudo = (
    <>
      <CheckCircle2 size={iconSize} />
      {strong ? <strong>Aprovar</strong> : <span>Aprovar</span>}
    </>
  );

  if (d.publicApprovalUrl) {
    return (
      <a
        className={className}
        href={d.publicApprovalUrl}
        target="_blank"
        rel="noreferrer"
      >
        {conteudo}
      </a>
    );
  }

  return <span className={className}>{conteudo}</span>;
}

function DocumentoContatoInline({ d }: TemplateDocumentoBaseProps) {
  const contatos = getContatosDocumento(d);

  if (!contatos.length && !d.contatoMarca) {
    return null;
  }

  return (
    <div className="doc-contact-inline">
      {contatos.length ? (
        contatos.map((contato) => {
          const conteudo = (
            <>
            {contato.icon}
            <span>{contato.valor}</span>
            </>
          );

          return contato.href ? (
            <a
              className="doc-contact-item"
              data-pdf-link-url={contato.href}
              href={contato.href}
              key={contato.key}
              target={contato.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={contato.href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={contato.label}
            >
              {conteudo}
            </a>
          ) : (
            <span className="doc-contact-item" key={contato.key}>
              {conteudo}
            </span>
          );
        })
      ) : (
        <span className="doc-contact-item">
          <Mail size={14} />
          <span>{d.contatoMarca}</span>
        </span>
      )}
    </div>
  );
}

type DocumentoContatoLink = {
  key: string;
  valor: string;
  icon: ReactNode;
  href?: string;
  label: string;
};

function getContatosDocumento(d: PropostaDocumentoDados): DocumentoContatoLink[] {
  const contatos: DocumentoContatoLink[] = [];

  if (d.telefoneMarca) {
    const whatsappUrl = buildWhatsappContatoUrl(d.telefoneMarca);

    contatos.push({
      key: "telefone",
      valor: d.telefoneMarca,
      icon: whatsappUrl ? <WhatsAppIcon size={14} /> : <Phone size={14} />,
      href: whatsappUrl,
      label: whatsappUrl
        ? `Enviar mensagem pelo WhatsApp para ${d.telefoneMarca}`
        : `Telefone ${d.telefoneMarca}`,
    });
  }

  if (d.emailMarca) {
    const emailUrl = buildEmailContatoUrl(d.emailMarca);

    contatos.push({
      key: "email",
      valor: d.emailMarca,
      icon: <Mail size={14} />,
      href: emailUrl,
      label: `Enviar email para ${d.emailMarca}`,
    });
  }

  if (d.instagramMarca) {
    const instagramUrl = buildInstagramContatoUrl(d.instagramMarca);

    contatos.push({
      key: "instagram",
      valor: d.instagramMarca,
      icon: <AtSign size={14} />,
      href: instagramUrl,
      label: `Abrir Instagram ${d.instagramMarca}`,
    });
  }

  if (d.siteMarca) {
    const siteUrl = buildSiteContatoUrl(d.siteMarca);

    contatos.push({
      key: "site",
      valor: d.siteMarca,
      icon: <Globe2 size={14} />,
      href: siteUrl,
      label: `Abrir site ${d.siteMarca}`,
    });
  }

  return contatos;
}

function getContatoPrincipalMarca(d: PropostaDocumentoDados): DocumentoContatoLink | null {
  const contatos = getContatosDocumento(d);

  return (
    contatos.find((contato) => contato.key === "instagram") ??
    contatos.find((contato) => contato.key === "site") ??
    contatos.find((contato) => contato.key === "email") ??
    contatos.find((contato) => contato.key === "telefone") ??
    null
  );
}

function buildWhatsappContatoUrl(telefone: string): string | undefined {
  const digitos = telefone.replace(/\D/g, "");

  if (digitos.length < 10) {
    return undefined;
  }

  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`;

  return `https://wa.me/${numero}`;
}

function buildEmailContatoUrl(email: string): string | undefined {
  const valor = email.trim();

  if (!valor || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return undefined;
  }

  return `mailto:${valor}`;
}

function buildInstagramContatoUrl(instagram: string): string | undefined {
  const usuario = instagram.trim().replace(/^@+/, "");

  if (!usuario) {
    return undefined;
  }

  return `https://www.instagram.com/${encodeURIComponent(usuario)}`;
}

function buildSiteContatoUrl(site: string): string | undefined {
  const valor = site.trim();

  if (!valor) {
    return undefined;
  }

  return /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
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

function parseBeneficioDocumento(beneficio: string): {
  titulo: string;
  descricao: string | null;
} {
  const [titulo, ...descricao] = beneficio.split(":");
  const tituloNormalizado = titulo.trim() || beneficio.trim();
  const descricaoNormalizada = descricao.join(":").trim();

  return {
    titulo: tituloNormalizado,
    descricao: descricaoNormalizada || null,
  };
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
  primeiraPropostaGerada,
  isLoading,
  isError,
  onRetry,
  onEditarPerfil,
  onAbrirPropostas,
  onAbrirClientes,
  onAbrirServicos,
  onAbrirPropostasPorStatus,
  onNovaProposta,
  onCadastrarCliente,
  onSalvarServico,
  onAbrirOnboarding,
  onAbrirBilling,
}: {
  conta: ContaAtualResponse;
  propostas: PropostaResponse[];
  perfilContaAtualizado: boolean;
  clientesTotal: number;
  servicosTotal: number;
  primeiraPropostaGerada: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEditarPerfil: () => void;
  onAbrirPropostas: () => void;
  onAbrirClientes: () => void;
  onAbrirServicos: () => void;
  onAbrirPropostasPorStatus: (status: PropostaStatus) => void;
  onNovaProposta: () => void;
  onCadastrarCliente: () => void;
  onSalvarServico: () => void;
  onAbrirOnboarding: () => void;
  onAbrirBilling: () => void;
}) {
  const metricas = buildMetricasDashboard({
    propostas,
    clientesTotal,
    servicosTotal,
    onAbrirClientes,
    onAbrirServicos,
    onAbrirPropostasPorStatus,
  });
  const primeirosPassos = buildPrimeirosPassosDashboard({
    perfilContaAtualizado,
    clientesTotal,
    servicosTotal,
    primeiraPropostaGerada,
    onEditarPerfil,
    onCadastrarCliente,
    onSalvarServico,
    onNovaProposta,
  });
  const deveMostrarPrimeirosPassos = primeirosPassos.some(
    (passo) => !passo.concluido,
  );
  const [propostasRecentesPagina, setPropostasRecentesPagina] = useState(1);
  const [propostasRecentesTamanhoPagina, setPropostasRecentesTamanhoPagina] =
    useState(5);
  const propostasRecentesPaginadas = paginarLista(
    propostas,
    propostasRecentesPagina,
    propostasRecentesTamanhoPagina,
  );
  const dashboardHeroTexto = primeiraPropostaGerada
    ? "Acompanhe suas propostas e próximos fechamentos"
    : "Crie sua primeira proposta profissional em minutos";

  return (
    <>
      <div className="dashboard-page-heading">
        <div>
          <p>Visão geral</p>
          <h1>Painel comercial</h1>
          <span>
            Acompanhe clientes, serviços, propostas e próximos fechamentos em um só lugar.
          </span>
        </div>
      </div>

      <div className="dashboard-hero rounded-md border border-border bg-surface p-5" data-tour="dashboard-hero">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex max-w-full items-center gap-2 rounded-md bg-violet-50 px-3 py-1.5 font-heading text-lg font-semibold leading-snug text-slate-950 sm:text-xl">
              {primeiraPropostaGerada ? (
                <BarChart3 size={16} aria-hidden="true" />
              ) : (
                <Sparkles size={16} aria-hidden="true" />
              )}
              {dashboardHeroTexto}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={onNovaProposta}
              data-tour="nova-proposta"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm"
            >
              <Plus size={18} aria-hidden="true" />
              Nova proposta
            </button>
            <button
              type="button"
              onClick={onSalvarServico}
              data-tour="servicos"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-sm font-semibold"
            >
              <PackageCheck size={18} aria-hidden="true" />
              Cadastrar serviço
            </button>
            <button
              type="button"
              onClick={onCadastrarCliente}
              data-tour="clientes"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-sm font-semibold"
            >
              <UsersRound size={18} aria-hidden="true" />
              Cadastrar cliente
            </button>
          </div>
        </div>
      </div>

      {conta.plano === "Trial" ? (
        <TrialUpsellBanner conta={conta} onAtivarPlano={onAbrirBilling} />
      ) : null}

      {!primeiraPropostaGerada ? (
        <button
          type="button"
          onClick={onAbrirOnboarding}
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary"
        >
          <Rocket size={16} aria-hidden="true" />
          Abrir guia inicial
        </button>
      ) : null}

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

      <div
        className="dashboard-metrics-grid grid"
        data-tour="dashboard-metricas"
      >
        {metricas.map((metrica) => {
          const Icon = metrica.icon;

          return (
            <button
              key={metrica.label}
              type="button"
              onClick={metrica.onClick}
              className="metric-card metric-card-action rounded-md border border-border bg-surface"
            >
              <div className="metric-card-content">
                <p className="text-sm font-medium text-muted">{metrica.label}</p>
                <strong className="mt-2 block text-3xl font-semibold">
                  {metrica.value}
                </strong>
              </div>
              <span className={`metric-icon metric-icon-${metrica.tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="metric-card-action-indicator" aria-hidden="true">
                <ArrowRight size={13} />
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-md border border-border bg-surface p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Propostas recentes
            </h2>
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
        {propostasRecentesPaginadas.itens.length > 0 ? (
        <div className="data-table-shell mt-5">
          <table className="data-table data-table-propostas data-table-recentes w-full text-left text-sm">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostasRecentesPaginadas.itens.length > 0 ? (
                propostasRecentesPaginadas.itens.map((proposta) => (
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
                        ariaLabel={`Ações da proposta ${proposta.titulo}`}
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
          <PaginacaoLista
            label="propostas"
            paginacao={propostasRecentesPaginadas}
            tamanhoPagina={propostasRecentesTamanhoPagina}
            onChangePagina={setPropostasRecentesPagina}
            onChangeTamanhoPagina={(tamanho) => {
              setPropostasRecentesTamanhoPagina(tamanho);
              setPropostasRecentesPagina(1);
            }}
          />
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

function PublicBillingContent({
  token,
  linkForm,
  linkMutation,
  linkQuery,
  checkoutMutation,
}: {
  token: string | null;
  linkForm: UseFormReturn<EmailUsuarioFormInput>;
  linkMutation: {
    mutate: (input: EmailUsuarioInput) => void;
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
  linkQuery: {
    data: PublicBillingPaymentLinkResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => unknown;
  };
  checkoutMutation: {
    mutate: (input: CreateBillingCheckoutInput) => void;
    isPending: boolean;
    error: Error | null;
  };
}) {
  if (!token) {
    return (
      <section className="mx-auto grid w-full max-w-2xl gap-5">
        <div className="page-heading">
          <div>
            <p className="text-sm font-medium text-accent">Regularizar plano</p>
            <h1 className="font-heading text-3xl font-semibold">Receba um link seguro de pagamento</h1>
            <span>
              Informe o e-mail de acesso da conta. Se houver uma conta vinculada, enviaremos um link para regularizar o Plano Fundador.
            </span>
          </div>
        </div>

        <form
          className="grid gap-4 rounded-md border border-border bg-surface p-5"
          onSubmit={linkForm.handleSubmit((input) => linkMutation.mutate(input))}
        >
          <CampoTexto
            label="E-mail da conta"
            type="email"
            autoComplete="email"
            error={linkForm.formState.errors.email?.message}
            {...linkForm.register("email")}
          />
          {linkMutation.isSuccess ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              Se este e-mail estiver vinculado a uma conta Emprely, o link de pagamento foi enviado. Verifique a caixa de entrada e o spam.
            </div>
          ) : null}
          <MensagemErro error={linkMutation.error} />
          <button
            type="submit"
            disabled={linkMutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Mail size={17} aria-hidden="true" />
            {linkMutation.isPending ? "Enviando..." : "Enviar link seguro"}
          </button>
        </form>
      </section>
    );
  }

  if (linkQuery.isLoading) {
    return <ListaCarregando label="Carregando link de pagamento" />;
  }

  if (linkQuery.isError || !linkQuery.data) {
    return (
      <section className="mx-auto grid w-full max-w-2xl gap-5">
        <EstadoErroConsulta
          titulo="Link de pagamento invalido ou expirado."
          detalhe="Solicite um novo link para regularizar o Plano Fundador com seguranca."
          onRetry={() => {
            window.history.pushState(null, "", "/billing/regularizar");
            window.location.reload();
          }}
        />
        <MensagemErro error={linkQuery.error} />
      </section>
    );
  }

  return (
    <PublicBillingPaymentPanel
      contexto={linkQuery.data}
      checkoutPendente={checkoutMutation.isPending}
      erroCheckout={checkoutMutation.error}
      onCriarCheckout={(input) => checkoutMutation.mutate(input)}
    />
  );
}

function PublicBillingPaymentPanel({
  contexto,
  checkoutPendente,
  erroCheckout,
  onCriarCheckout,
}: {
  contexto: PublicBillingPaymentLinkResponse;
  checkoutPendente: boolean;
  erroCheckout: Error | null;
  onCriarCheckout: (input: CreateBillingCheckoutInput) => void;
}) {
  const [cicloSelecionado, setCicloSelecionado] = useState("Mensal");
  const [metodoPagamentoSelecionado, setMetodoPagamentoSelecionado] = useState("Pix");
  const form = useForm<BillingPagadorFormInput>({
    resolver: zodResolver(billingPagadorSchema),
    defaultValues: billingPagadorDefaultValues,
  });
  const tipoPessoaPagador = useWatch({
    control: form.control,
    name: "tipoPessoa",
  });
  const planoSelecionado =
    contexto.planos.find((plano) => plano.codigo === "fundador" && plano.ciclo === cicloSelecionado) ??
    contexto.planos[0];
  const pagamentoAtual = contexto.status.pagamentoAtual;
  const pagamentoAberto = pagamentoAtual
    ? ["AguardandoPagamento", "EmAnalise", "Vencido"].includes(pagamentoAtual.status)
    : false;
  const planoAtivoMesmoCiclo = Boolean(
    contexto.status.entitlements.canRemoveWatermark &&
      planoSelecionado &&
      contexto.status.ciclo === planoSelecionado.ciclo &&
      contexto.status.periodoAtualFim,
  );
  const metodoSelecionado = planoSelecionado?.metodosPagamento.find(
    (metodo) => metodo.codigo === metodoPagamentoSelecionado,
  ) ?? planoSelecionado?.metodosPagamento[0];

  const handleSubmit = form.handleSubmit((pagadorInput) => {
    if (!planoSelecionado || !metodoSelecionado || pagamentoAberto || planoAtivoMesmoCiclo) {
      return;
    }

    onCriarCheckout({
      planoCodigo: planoSelecionado.codigo,
      metodoPagamento: metodoSelecionado.codigo,
      ciclo: planoSelecionado.ciclo,
      pagador: buildBillingPagadorPayload(pagadorInput),
    });
  });

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <div className="rounded-md border border-border bg-surface p-5">
        <p className="text-sm font-medium text-accent">Pagamento seguro</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold">Regularizar Plano Fundador</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Conta: <strong className="text-slate-950">{contexto.contaNome}</strong>
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BillingInfo label="Plano atual" value={contexto.status.plano} />
          <BillingInfo
            label="Validade"
            value={contexto.status.periodoAtualFim ? formatDataCurta(contexto.status.periodoAtualFim) : "-"}
          />
          <BillingInfo
            label="Pagamento"
            value={formatBillingStatusLabel(pagamentoAtual?.status ?? "-")}
          />
          <BillingInfo label="Link expira em" value={formatDataCurta(contexto.expiresAt)} />
        </dl>

        {pagamentoAberto && pagamentoAtual?.invoiceUrl ? (
          <div className="mt-5 rounded-md border border-border bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">Pagamento em andamento</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ja existe uma cobranca aberta para esta conta. Use o comprovante abaixo para concluir ou conferir o pagamento.
            </p>
            <a
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white"
              href={pagamentoAtual.invoiceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir Comprovante
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        ) : null}

        {planoAtivoMesmoCiclo ? (
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            Este plano ja esta ativo para o ciclo selecionado ate {formatDataCurta(contexto.status.periodoAtualFim)}.
          </div>
        ) : null}
      </div>

      <form className="rounded-md border border-border bg-surface p-5" onSubmit={handleSubmit}>
        <h2 className="font-heading text-xl font-semibold">Realizar pagamento</h2>
        <div className="mt-4 inline-flex rounded-md border border-border bg-white p-1">
          {contexto.planos.map((plano) => (
            <button
              key={plano.ciclo}
              type="button"
              onClick={() => setCicloSelecionado(plano.ciclo)}
              className={`h-9 rounded px-3 text-sm font-semibold transition ${
                plano.ciclo === planoSelecionado?.ciclo
                  ? "bg-primary text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {formatBillingStatusLabel(plano.ciclo)}
            </button>
          ))}
        </div>
        {planoSelecionado ? (
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {formatMoney(planoSelecionado.preco)}
            <span className="ml-1 text-base font-medium text-muted">/{planoSelecionado.periodicidade}</span>
          </p>
        ) : null}

        <div className="mt-5 grid gap-3">
          {planoSelecionado?.metodosPagamento.map((metodo) => {
            const Icon = metodo.codigo === "Pix" ? DollarSign : CreditCard;
            const selecionado = metodo.codigo === metodoSelecionado?.codigo;
            return (
              <button
                key={metodo.codigo}
                type="button"
                disabled={pagamentoAberto || planoAtivoMesmoCiclo || checkoutPendente}
                onClick={() => setMetodoPagamentoSelecionado(metodo.codigo)}
                className={`flex min-h-16 items-center justify-between gap-3 rounded-md border bg-white p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  selecionado ? "border-primary ring-2 ring-blue-100" : "border-border hover:border-primary"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-blue-50 text-primary">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <strong className="text-sm text-slate-950">{metodo.nome}</strong>
                </span>
                {selecionado ? <CheckCircle2 size={18} className="text-primary" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        {!pagamentoAberto && !planoAtivoMesmoCiclo ? (
          <div className="mt-5 grid gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "Fisica", label: "Pessoa fisica" },
                { value: "Juridica", label: "Pessoa juridica" },
              ].map((opcao) => (
                <button
                  key={opcao.value}
                  type="button"
                  onClick={() =>
                    form.setValue("tipoPessoa", opcao.value as BillingPagadorFormInput["tipoPessoa"], {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={`h-9 rounded-md border px-3 text-sm font-semibold transition ${
                    tipoPessoaPagador === opcao.value
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opcao.label}
                </button>
              ))}
            </div>
            <CampoTexto
              label={tipoPessoaPagador === "Juridica" ? "Razao social" : "Nome completo"}
              autoComplete="name"
              error={form.formState.errors.nome?.message}
              {...form.register("nome")}
            />
            <CampoTexto
              label={tipoPessoaPagador === "Juridica" ? "CNPJ" : "CPF"}
              error={form.formState.errors.cpfCnpj?.message}
              {...buildCpfCnpjInputProps(form.register("cpfCnpj", cpfCnpjInputRegisterOptions))}
            />
          </div>
        ) : null}

        <MensagemErro error={erroCheckout} />
        {!pagamentoAberto && !planoAtivoMesmoCiclo ? (
          <button
            type="submit"
            disabled={checkoutPendente}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutPendente ? "Abrindo pagamento..." : "Realizar Pagamento"}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : null}
      </form>
    </section>
  );
}

function BillingContent({
  conta,
  status,
  planos,
  isLoading,
  isError,
  erroCheckout,
  erroCancelamento,
  checkoutPendente,
  cancelamentoPendente,
  onRetry,
  onCriarCheckout,
  onCancelar,
}: {
  conta: ContaAtualResponse;
  status: BillingStatusResponse | undefined;
  planos: BillingPlanoResponse[];
  isLoading: boolean;
  isError: boolean;
  erroCheckout: Error | null;
  erroCancelamento: Error | null;
  checkoutPendente: boolean;
  cancelamentoPendente: boolean;
  onRetry: () => void;
  onCriarCheckout: (input: CreateBillingCheckoutInput) => void;
  onCancelar: () => void;
}) {
  const ciclosDisponiveis = planos.filter((plano) => plano.codigo === "fundador");
  const [cicloSelecionado, setCicloSelecionado] = useState("Mensal");
  const [metodoPagamentoSelecionado, setMetodoPagamentoSelecionado] = useState("Pix");
  const billingPagadorForm = useForm<BillingPagadorFormInput>({
    resolver: zodResolver(billingPagadorSchema),
    defaultValues: {
      ...billingPagadorDefaultValues,
      nome: conta.nome,
    },
  });
  const tipoPessoaPagador = useWatch({
    control: billingPagadorForm.control,
    name: "tipoPessoa",
  });
  const planoFundador =
    ciclosDisponiveis.find((plano) => plano.ciclo === cicloSelecionado) ??
    ciclosDisponiveis[0] ??
    planos[0];
  const assinaturaAtiva = status
    ? status.entitlements.canRemoveWatermark
    : conta.plano === "Fundador";
  const podeCancelar = assinaturaAtiva && Boolean(status?.statusAssinatura) && !status?.cancelAtPeriodEnd;
  const actionPendente = checkoutPendente || cancelamentoPendente;
  const pagamentoAtual = status?.pagamentoAtual ?? null;
  const pagamentoAberto = pagamentoAtual
    ? ["AguardandoPagamento", "EmAnalise", "Vencido"].includes(pagamentoAtual.status)
    : false;
  const historicoPagamentos = status?.historicoPagamentos ?? [];
  const metodoSelecionado = planoFundador?.metodosPagamento.find(
    (metodo) => metodo.codigo === metodoPagamentoSelecionado,
  ) ?? planoFundador?.metodosPagamento.find((metodo) => metodo.ativo !== false);
  const metodoSelecionadoAtivo = Boolean(metodoSelecionado && metodoSelecionado.ativo !== false);
  const cicloSelecionadoJaAtivo = Boolean(
    assinaturaAtiva &&
      planoFundador &&
      (!status?.ciclo || status.ciclo === planoFundador.ciclo) &&
      status?.periodoAtualFim,
  );
  const bloqueiaNovoPagamento = pagamentoAberto || cicloSelecionadoJaAtivo;
  const validadePlanoAtual = status?.periodoAtualFim ?? status?.trialEndsAt ?? null;
  const mensagemBloqueioPagamento = pagamentoAberto
    ? "Ja existe uma cobranca em andamento para este plano. Se voce acabou de pagar, aguarde a confirmacao automatica do Asaas."
    : cicloSelecionadoJaAtivo
      ? `Seu ${status?.plano ?? conta.plano} ${formatBillingStatusLabel(status?.ciclo ?? planoFundador.ciclo).toLowerCase()} esta ativo ate ${formatDataCurta(validadePlanoAtual)}.`
      : null;
  const mensagemStatusPlano = pagamentoAberto
    ? "Pagamento em confirmacao. Reabra o comprovante se precisar conferir a cobranca; o plano libera automaticamente quando o Asaas confirmar."
    : status?.mensagem;

  const handleSubmitCheckout = billingPagadorForm.handleSubmit((pagadorInput) => {
    if (!planoFundador || !metodoSelecionado || !metodoSelecionadoAtivo || bloqueiaNovoPagamento) {
      return;
    }

    onCriarCheckout({
      planoCodigo: planoFundador.codigo,
      metodoPagamento: metodoSelecionado.codigo,
      ciclo: planoFundador.ciclo,
      pagador: buildBillingPagadorPayload(pagadorInput),
    });
  });

  return (
    <div className="space-y-5">
      <div className="page-heading">
        <div>
          <p className="text-sm font-medium text-accent">Plano e pagamento</p>
          <h1 className="font-heading text-3xl font-semibold">Plano Fundador</h1>
          <span>
            Ative ou acompanhe a cobranca recorrente hospedada no ambiente seguro do Asaas.
          </span>
        </div>
      </div>

      {isLoading ? <ListaCarregando label="Carregando plano" /> : null}

      {isError ? (
        <EstadoErroConsulta
          titulo="Nao foi possivel carregar os dados do plano."
          detalhe="Atualize antes de iniciar uma cobranca ou alterar a assinatura."
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && !isError && planoFundador ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <section className="rounded-md border border-border bg-surface p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-primary">
                  <ShieldCheck size={16} aria-hidden="true" />
                  {assinaturaAtiva ? "Plano ativo" : "Teste gratis"}
                </div>
                <h2 className="mt-4 font-heading text-2xl font-semibold">
                  {planoFundador.nome}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  {planoFundador.descricao}
                </p>
                {ciclosDisponiveis.length > 1 ? (
                  <div className="mt-4 inline-flex rounded-md border border-border bg-white p-1">
                    {ciclosDisponiveis.map((plano) => (
                      <button
                        key={plano.ciclo}
                        type="button"
                        onClick={() => setCicloSelecionado(plano.ciclo)}
                        className={`h-9 rounded px-3 text-sm font-semibold transition ${
                          plano.ciclo === planoFundador.ciclo
                            ? "bg-primary text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {plano.ciclo === "Anual" ? "Anual" : "Mensal"}
                      </button>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 text-4xl font-semibold text-slate-950">
                  {formatMoney(planoFundador.preco)}
                  <span className="ml-1 text-base font-medium text-muted">/{planoFundador.periodicidade}</span>
                </p>
                {planoFundador.ciclo === "Anual" ? (
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    Equivale a {formatMoney(planoFundador.preco / 12)} por mes.
                  </p>
                ) : null}
              </div>
              <div className="w-full rounded-md border border-border bg-white p-4 lg:max-w-sm">
                <p className="text-sm font-semibold text-slate-950">Status atual</p>
                <dl className="mt-3 grid gap-3 text-sm">
                  <BillingInfo label="Plano atual" value={status?.plano ?? conta.plano} />
                  <BillingInfo
                    label="Validade"
                    value={validadePlanoAtual ? formatDataCurta(validadePlanoAtual) : "-"}
                  />
                  <BillingInfo
                    label="Assinatura"
                    value={formatBillingStatusLabel(status?.statusAssinatura ?? "Sem assinatura")}
                  />
                  <BillingInfo label="Ciclo" value={formatBillingStatusLabel(status?.ciclo ?? "-")} />
                  <BillingInfo
                    label="Proxima cobranca"
                    value={status?.proximaCobranca ? formatDataCurta(status.proximaCobranca) : "-"}
                  />
                  <BillingInfo
                    label="Pagamento"
                    value={formatBillingStatusLabel(pagamentoAtual?.status ?? "-")}
                  />
                </dl>
              </div>
            </div>

            {mensagemStatusPlano ? (
              <div className="mt-5 rounded-md border border-border bg-white p-4 text-sm leading-6 text-slate-700">
                {mensagemStatusPlano}
              </div>
            ) : null}

            {pagamentoAtual ? (
              <div className="mt-5 rounded-md border border-border bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Cobranca atual</p>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <BillingInfo label="Status" value={formatBillingStatusLabel(pagamentoAtual.status)} />
                      <BillingInfo label="Metodo" value={formatBillingStatusLabel(pagamentoAtual.metodoPagamento)} />
                      <BillingInfo label="Valor" value={formatMoney(pagamentoAtual.valor)} />
                      <BillingInfo label="Vencimento" value={pagamentoAtual.dueDate ? formatDataCurta(pagamentoAtual.dueDate) : "-"} />
                      <BillingInfo label="Pago em" value={pagamentoAtual.paidAt ? formatDataCurta(pagamentoAtual.paidAt) : "-"} />
                      <BillingInfo label="Reembolsado" value={formatMoney(pagamentoAtual.valorReembolsado)} />
                    </dl>
                  </div>
                  {pagamentoAberto && pagamentoAtual.invoiceUrl ? (
                    <a
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white"
                      href={pagamentoAtual.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir Comprovante
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <BillingBeneficio icon={FileText} texto="Gerar e exportar propostas comerciais" ativo={Boolean(status?.entitlements.canExportProposta)} />
              <BillingBeneficio icon={ShieldCheck} texto="Remover marca d'agua do Trial" ativo={Boolean(status?.entitlements.canRemoveWatermark)} />
              <BillingBeneficio icon={Send} texto="Compartilhar propostas pelo WhatsApp" ativo={Boolean(status?.entitlements.canSharePropostaWhatsapp)} />
              <BillingBeneficio icon={ReceiptText} texto="Historico de cobrancas vinculado a conta" ativo={assinaturaAtiva} />
            </div>

            <div className="mt-6 rounded-md border border-border bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">Historico de cobrancas</p>
                <span className="text-xs font-medium text-muted">12 meses</span>
              </div>
              {historicoPagamentos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Criada</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Ciclo</th>
                        <th className="px-4 py-3 font-semibold">Valor</th>
                        <th className="px-4 py-3 font-semibold">Reembolso</th>
                        <th className="px-4 py-3 font-semibold">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {historicoPagamentos.map((pagamento) => (
                        <tr key={pagamento.id}>
                          <td className="px-4 py-3 text-slate-700">{formatDataCurta(pagamento.createdAt)}</td>
                          <td className="px-4 py-3 font-medium text-slate-950">{formatBillingStatusLabel(pagamento.status)}</td>
                          <td className="px-4 py-3 text-slate-700">{formatBillingStatusLabel(pagamento.ciclo)}</td>
                          <td className="px-4 py-3 text-slate-700">{formatMoney(pagamento.valor)}</td>
                          <td className="px-4 py-3 text-slate-700">{formatMoney(pagamento.valorReembolsado)}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {pagamento.invoiceUrl ? (
                              <a className="font-semibold text-primary" href={pagamento.invoiceUrl} target="_blank" rel="noreferrer">
                                Abrir Comprovante
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-4 py-5 text-sm text-muted">Nenhuma cobranca registrada nos ultimos 12 meses.</p>
              )}
            </div>
          </section>

          <section className="rounded-md border border-border bg-surface p-5">
            <h2 className="font-heading text-xl font-semibold">Pagamento</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Informe os dados do pagador, escolha o metodo e conclua no checkout hospedado do Asaas. O plano libera automaticamente quando o webhook confirmar o pagamento.
            </p>

            {mensagemBloqueioPagamento ? (
              <div className="mt-5 rounded-md border border-border bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">
                  {pagamentoAberto ? "Pagamento em andamento" : "Plano ja ativo"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{mensagemBloqueioPagamento}</p>
                {pagamentoAtual?.invoiceUrl ? (
                  <a
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white"
                    href={pagamentoAtual.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir Comprovante
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}

            {!mensagemBloqueioPagamento ? (
            <form className="mt-5 space-y-5" onSubmit={handleSubmitCheckout}>
              <div className="rounded-md border border-border bg-white p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "Fisica", label: "Pessoa fisica" },
                    { value: "Juridica", label: "Pessoa juridica" },
                  ].map((opcao) => (
                    <button
                      key={opcao.value}
                      type="button"
                      onClick={() =>
                        billingPagadorForm.setValue(
                          "tipoPessoa",
                          opcao.value as BillingPagadorFormInput["tipoPessoa"],
                          { shouldDirty: true, shouldValidate: true },
                        )
                      }
                      className={`h-9 rounded-md border px-3 text-sm font-semibold transition ${
                        tipoPessoaPagador === opcao.value
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {opcao.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <CampoTexto
                    label={tipoPessoaPagador === "Juridica" ? "Razao social" : "Nome completo"}
                    autoComplete="name"
                    error={billingPagadorForm.formState.errors.nome?.message}
                    {...billingPagadorForm.register("nome")}
                  />
                  <CampoTexto
                    label={tipoPessoaPagador === "Juridica" ? "CNPJ" : "CPF"}
                    error={billingPagadorForm.formState.errors.cpfCnpj?.message}
                    {...buildCpfCnpjInputProps(
                      billingPagadorForm.register("cpfCnpj", cpfCnpjInputRegisterOptions),
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-3">
              {planoFundador.metodosPagamento.map((metodo) => {
                const Icon = metodo.codigo === "Pix" ? DollarSign : CreditCard;
                const metodoAtivo = metodo.ativo !== false;
                const selecionado = metodo.codigo === metodoSelecionado?.codigo;

                return (
                  <button
                    key={metodo.codigo}
                    type="button"
                    disabled={actionPendente || !metodoAtivo}
                    onClick={() => setMetodoPagamentoSelecionado(metodo.codigo)}
                    className={`flex min-h-20 items-center justify-between gap-4 rounded-md border bg-white p-4 text-left transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                      selecionado ? "border-primary ring-2 ring-blue-100" : "border-border"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span>
                        <strong className="block text-sm text-slate-950">{metodo.nome}</strong>
                        <span className="mt-1 block text-sm leading-5 text-muted">
                          {metodo.descricao}
                        </span>
                        {!metodoAtivo ? (
                          <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                            Em breve
                          </span>
                        ) : null}
                        {metodo.codigo === "CartaoCredito" && metodoAtivo ? (
                          <span className="mt-2 block text-xs font-medium text-slate-600">
                            Os dados do cartao serao preenchidos somente no Asaas.
                          </span>
                        ) : null}
                      </span>
                    </span>
                    {selecionado ? (
                      <CheckCircle2 className="shrink-0 text-primary" size={18} aria-hidden="true" />
                    ) : (
                      <ArrowRight className="shrink-0 text-muted" size={18} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
              </div>

              <button
                type="submit"
                disabled={actionPendente || !metodoSelecionadoAtivo || bloqueiaNovoPagamento}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutPendente ? "Abrindo pagamento..." : "Realizar Pagamento"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>
            ) : null}

            <MensagemErro error={erroCheckout} />

            {podeCancelar || status?.cancelAtPeriodEnd ? (
              <div className="mt-5 border-t border-border pt-5">
                {podeCancelar ? (
                  <button
                    type="button"
                    disabled={actionPendente}
                    onClick={onCancelar}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CircleMinus size={17} aria-hidden="true" />
                    Cancelar renovacao
                  </button>
                ) : null}
                {status?.cancelAtPeriodEnd ? (
                  <p className="mt-3 text-sm leading-6 text-muted">
                    A renovacao foi cancelada. Para voltar depois do periodo atual, inicie um novo checkout.
                  </p>
                ) : null}
                <MensagemErro error={erroCancelamento} />
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

function BillingBeneficio({
  icon: Icon,
  texto,
  ativo,
}: {
  icon: typeof FileText;
  texto: string;
  ativo: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-white p-4">
      <span
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md ${
          ativo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-muted"
        }`}
      >
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="text-sm font-medium leading-6 text-slate-800">{texto}</span>
    </div>
  );
}

function formatBillingStatusLabel(valor: string | null | undefined): string {
  if (!valor || valor === "-") {
    return "-";
  }

  const labels: Record<string, string> = {
    AguardandoPagamento: "Aguardando Pagamento",
    EmAnalise: "Em Analise",
    Recebido: "Recebido",
    Confirmado: "Confirmado",
    Vencido: "Vencido",
    Falhou: "Falhou",
    Reembolsado: "Reembolsado",
    ReembolsoParcial: "Reembolso Parcial",
    Cancelado: "Cancelado",
    Ativa: "Ativa",
    Suspensa: "Suspensa",
    CancelamentoAgendado: "Cancelamento Agendado",
    Inadimplente: "Inadimplente",
    SemAssinatura: "Sem Assinatura",
    "Sem assinatura": "Sem Assinatura",
    Pix: "Pix",
    CartaoCredito: "Cartao de Credito",
    Mensal: "Mensal",
    Anual: "Anual",
    Fundador: "Fundador",
    Trial: "Trial",
  };

  return labels[valor] ?? valor.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function BillingInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 break-words font-semibold text-slate-950">{value}</dd>
    </div>
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

function TrialUpsellBanner({
  conta,
  onAtivarPlano,
}: {
  conta: ContaAtualResponse;
  onAtivarPlano?: () => void;
}) {
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
              Você tem {formatTrialConta(conta).toLowerCase()}. Ative o plano
              para remover a marca d&apos;água e liberar a experiência comercial
              completa.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAtivarPlano}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          <CreditCard size={17} aria-hidden="true" />
          Ativar plano
        </button>
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
  const progressoPercentual = Math.round(
    (passosConcluidos / Math.max(passos.length, 1)) * 100,
  );
  const passoAtualIndex = passos.findIndex((passo) => !passo.concluido);
  const todosConcluidos = passoAtualIndex === -1;
  const indiceAtual = todosConcluidos ? passos.length - 1 : passoAtualIndex;
  const passoAtual =
    passos[indiceAtual] ?? passos[passos.length - 1];

  return (
    <section
      className="rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5"
      data-tour="primeiros-passos"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent">Primeiros passos</p>
          <h2 className="mt-1 font-heading text-xl font-semibold leading-7 text-slate-950">
            Fluxo guiado para sua primeira proposta
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {passosConcluidos} de {passos.length} etapas concluídas. Continue
            pelo próximo passo para montar uma proposta com marca, cliente,
            serviço e valor percebido antes do preço.
          </p>
        </div>
        <button
          type="button"
          onClick={passoAtual.onClick}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          {todosConcluidos
            ? "Criar nova proposta"
            : `Continuar: ${passoAtual.acaoLabel.toLowerCase()}`}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressoPercentual}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {passos.map((passo, index) => {
          const estaAtual = index === indiceAtual && !passo.concluido;
          const estaBloqueado = !passo.concluido && index > indiceAtual;
          const statusLabel = passo.concluido
            ? "Concluído"
            : estaAtual
            ? "Agora"
            : "Depois";

          return (
            <article
              key={passo.id}
              className={`rounded-md border p-4 transition ${
                passo.concluido
                  ? "border-emerald-200 bg-emerald-50"
                  : estaAtual
                  ? "border-primary bg-violet-50 shadow-sm"
                  : "border-border bg-white"
              } ${estaBloqueado ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted">
                    Etapa {index + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-base font-semibold leading-6 text-slate-950">
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
                  <span
                    className={`inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md border px-2 text-xs font-semibold ${
                      estaAtual
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-5 text-muted">{passo.detalhe}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`text-xs font-semibold uppercase ${
                    passo.concluido
                      ? "text-emerald-700"
                      : estaAtual
                      ? "text-primary"
                      : "text-muted"
                  }`}
                >
                  {statusLabel}
                </span>
                <button
                  type="button"
                  onClick={passo.onClick}
                  disabled={estaBloqueado}
                  className={`inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold transition ${
                    passo.concluido
                      ? "border border-emerald-200 text-emerald-800 hover:border-emerald-300"
                      : estaAtual
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "border border-border text-muted"
                  } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                >
                  {passo.concluido ? "Revisar" : passo.acaoLabel}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function buildPrimeirosPassosDashboard({
  perfilContaAtualizado,
  clientesTotal,
  servicosTotal,
  primeiraPropostaGerada,
  onEditarPerfil,
  onCadastrarCliente,
  onSalvarServico,
  onNovaProposta,
}: {
  perfilContaAtualizado: boolean;
  clientesTotal: number;
  servicosTotal: number;
  primeiraPropostaGerada: boolean;
  onEditarPerfil: () => void;
  onCadastrarCliente: () => void;
  onSalvarServico: () => void;
  onNovaProposta: () => void;
}): PassoPrimeirosPassosDashboard[] {
  return [
    {
      id: "perfil",
      titulo: "Perfil da conta",
      detalhe: "Defina contato, marca, cores, formato e template para a proposta sair pronta.",
      concluido: perfilContaAtualizado,
      acaoLabel: "Completar perfil",
      onClick: onEditarPerfil,
    },
    {
      id: "cliente",
      titulo: "Primeiro cliente",
      detalhe: "Cadastre quem pediu preço para enviar a proposta sem retrabalho.",
      concluido: clientesTotal > 0,
      acaoLabel: "Cadastrar cliente",
      onClick: onCadastrarCliente,
    },
    {
      id: "servico",
      titulo: "Primeiro serviço",
      detalhe: "Monte um item reutilizável com escopo, entregas e valor.",
      concluido: servicosTotal > 0,
      acaoLabel: "Cadastrar serviço",
      onClick: onSalvarServico,
    },
    {
      id: "proposta",
      titulo: "Primeira proposta",
      detalhe: "Gere a proposta para WhatsApp, PDF ou imagem e mostre valor antes do preço.",
      concluido: primeiraPropostaGerada,
      acaoLabel: "Criar proposta",
      onClick: onNovaProposta,
    },
  ];
}

function buildOnboardingTourSteps(): Step[] {
  return [
    {
      target: buildOnboardingMenuTourTarget("dashboard"),
      title: "Dashboard: visão geral",
      content:
        "Aqui você acompanha o progresso da conta, os atalhos principais e os números comerciais. É o ponto de partida para saber o que precisa de atenção.",
      skipBeacon: true,
    },
    {
      target: buildOnboardingMenuTourTarget("clientes"),
      title: "Clientes: cadastro organizado",
      content:
        "Use Clientes para manter contatos, telefones e e-mails prontos. Isso evita retrabalho quando você montar novas propostas.",
    },
    {
      target: buildOnboardingMenuTourTarget("servicos"),
      title: "Serviços e pacotes",
      content:
        "Cadastre serviços reutilizáveis com escopo, entregas e valores. A vantagem é criar orçamentos mais rápidos e consistentes.",
    },
    {
      target: buildOnboardingMenuTourTarget("propostas"),
      title: "Propostas: funil comercial",
      content:
        "Em Propostas você visualiza rascunhos, geradas, enviadas, aceitas e recusadas. Assim fica fácil acompanhar o cliente até o aceite.",
    },
    {
      target: buildOnboardingMenuTourTarget("suporte"),
      title: "Suporte",
      content:
        "Quando precisar de ajuda ou registrar alguma dúvida, o suporte fica separado do fluxo comercial para não misturar operação com atendimento.",
    },
    {
      target: buildOnboardingMenuTourTarget("conta"),
      title: "Perfil da conta",
      content:
        "No menu da conta ficam os dados comerciais, marca, templates, cores e formatos. Essa área define como sua empresa aparece nos documentos enviados ao cliente.",
    },
    {
      target: '[data-tour="configurar-dados-conta"]',
      title: "Primeiro passo: configurar a conta",
      content:
        "Preencha nome comercial, segmento, telefone e e-mail. Esses dados dão credibilidade e já entram automaticamente nos orçamentos.",
    },
    {
      target: '[data-tour="configurar-logo"]',
      title: "Marca no documento",
      content:
        "Adicione sua logomarca para que PDF e imagem saiam com identidade profissional, sem precisar montar layout manualmente.",
    },
    {
      target: '[data-tour="configurar-template"]',
      title: "Templates prontos",
      content:
        "Escolha um template de proposta. A Emprely ajuda a apresentar escopo, benefícios, valores e próximos passos de forma mais vendável.",
      placement: "left",
    },
    {
      target: '[data-tour="configurar-cores-formato"]',
      title: "Cores e formato de envio",
      content:
        "Defina cores da marca e formatos de saída. Você pode gerar materiais prontos para PDF, imagem e compartilhamento pelo WhatsApp.",
      placement: "right",
    },
    {
      target: '[data-tour="nova-proposta"]',
      title: "Criar o primeiro orçamento",
      content:
        "Depois da conta e dos templates, clique em Nova proposta para selecionar cliente, itens, template, revisar tudo e gerar o orçamento final.",
    },
  ];
}

function buildOnboardingMenuTourTarget(tourKey: string) {
  return [
    `#mobile-navigation-drawer [data-tour="menu-${tourKey}"]`,
    `[data-tour="menu-${tourKey}"]`,
  ].join(", ");
}

function getOnboardingTourTarget(stepIndex: number) {
  const target = buildOnboardingTourSteps()[stepIndex]?.target;

  return typeof target === "string" ? target : null;
}

function shouldAbrirMenuMobileOnboardingTour(stepIndex: number) {
  return stepIndex >= 0 && stepIndex <= 5 && isViewportMobileAtual();
}

function limparArtefatosOnboardingTour() {
  document.body.style.overflow = "";
  document.body.style.pointerEvents = "";
  document.documentElement.style.overflow = "";
}

function getOnboardingTourView(stepIndex: number): AppView {
  if (stepIndex >= 0 && stepIndex <= 5) {
    return "dashboard";
  }

  if (stepIndex >= 6 && stepIndex <= 7) {
    return "conta";
  }

  if (stepIndex >= 8 && stepIndex <= 9) {
    return "conta";
  }

  return "dashboard";
}

function getOnboardingStatusLabel(status: OnboardingResponse["configuracaoConta"]["status"]) {
  const labels: Record<OnboardingResponse["configuracaoConta"]["status"], string> = {
    NaoIniciado: "não iniciado",
    EmAndamento: "em andamento",
    Pulado: "adiado",
    Concluido: "concluído",
  };

  return labels[status];
}

function buildMetricasDashboard({
  propostas,
  clientesTotal,
  servicosTotal,
  onAbrirClientes,
  onAbrirServicos,
  onAbrirPropostasPorStatus,
}: {
  propostas: PropostaResponse[];
  clientesTotal: number;
  servicosTotal: number;
  onAbrirClientes: () => void;
  onAbrirServicos: () => void;
  onAbrirPropostasPorStatus: (status: PropostaStatus) => void;
}): DashboardMetrica[] {
  const rascunhosTotal = contarPropostasPorStatus(propostas, "Rascunho");
  const geradasTotal = contarPropostasPorStatus(propostas, "Gerada");
  const enviadasTotal = contarPropostasPorStatus(propostas, "Enviada");
  const aceitasTotal = contarPropostasPorStatus(propostas, "Aceita");
  const recusadasTotal = contarPropostasPorStatus(propostas, "Recusada");

  return [
    {
      label: "Clientes",
      value: clientesTotal.toString(),
      icon: UsersRound,
      tone: "slate",
      onClick: onAbrirClientes,
    },
    {
      label: "Serviços",
      value: servicosTotal.toString(),
      icon: PackageCheck,
      tone: "teal",
      onClick: onAbrirServicos,
    },
    {
      label: "Rascunhos",
      value: rascunhosTotal.toString(),
      icon: ReceiptText,
      tone: "amber",
      onClick: () => onAbrirPropostasPorStatus("Rascunho"),
    },
    {
      label: "Geradas",
      value: geradasTotal.toString(),
      icon: Sparkles,
      tone: "purple",
      onClick: () => onAbrirPropostasPorStatus("Gerada"),
    },
    {
      label: "Enviadas",
      value: enviadasTotal.toString(),
      icon: FileText,
      tone: "blue",
      onClick: () => onAbrirPropostasPorStatus("Enviada"),
    },
    {
      label: "Aceitas",
      value: aceitasTotal.toString(),
      icon: BadgeCheck,
      tone: "green",
      onClick: () => onAbrirPropostasPorStatus("Aceita"),
    },
    {
      label: "Recusadas",
      value: recusadasTotal.toString(),
      icon: CircleMinus,
      tone: "red",
      onClick: () => onAbrirPropostasPorStatus("Recusada"),
    },
  ];
}

function ContatoPublicoContent({
  contatoPublicoForm,
  contatoPublicoMutation,
}: {
  contatoPublicoForm: UseFormReturn<ContatoPublicoFormInput>;
  contatoPublicoMutation: ReturnType<
    typeof useMutation<ContatoPublicoResponse, Error, CreateContatoPublicoInput>
  >;
}) {
  const errors = contatoPublicoForm.formState.errors;

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-5 py-2">
      <div className="grid gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-primary">
          <HeartHandshake size={16} aria-hidden="true" />
          Suporte Emprely
        </span>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Fale com a Emprely
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Use este canal para dúvidas, compra, Plano Fundador ou suporte antes de entrar no sistema. Se quiser falar agora, chame no WhatsApp oficial ou envie um e-mail.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappEmprelySuporteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            aria-label={`Falar com a Emprely pelo WhatsApp ${contatoEmprely.whatsappDisplay}`}
          >
            <WhatsAppIcon size={17} aria-hidden="true" />
            WhatsApp {contatoEmprely.whatsappDisplay}
          </a>
          <a
            href={`mailto:${contatoEmprely.email}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <Mail size={17} aria-hidden="true" />
            {contatoEmprely.email}
          </a>
        </div>
      </div>

      <form
        className="grid gap-4 rounded-md border border-border bg-surface p-5 shadow-sm"
        onSubmit={contatoPublicoForm.handleSubmit((input) =>
          contatoPublicoMutation.mutate(input),
        )}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto
            label="Nome"
            autoComplete="name"
            error={errors.nome?.message}
            {...contatoPublicoForm.register("nome")}
          />
          <CampoTexto
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...contatoPublicoForm.register("email")}
          />
          <CampoTexto
            label="Telefone"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            error={errors.telefone?.message}
            {...buildTelefoneInputProps(
              contatoPublicoForm.register("telefone", telefoneInputRegisterOptions),
            )}
          />
          <CampoTexto
            label="Empresa"
            autoComplete="organization"
            error={errors.empresa?.message}
            {...contatoPublicoForm.register("empresa")}
          />
          <CampoSelect
            label="Interesse"
            error={errors.interesse?.message}
            {...contatoPublicoForm.register("interesse")}
          >
            <option value="duvida">Tirar duvida</option>
            <option value="compra">Compra</option>
            <option value="plano-fundador">Plano Fundador</option>
            <option value="suporte">Suporte</option>
            <option value="outro">Outro</option>
          </CampoSelect>
        </div>

        <CampoTextarea
          label="Mensagem"
          rows={7}
          error={errors.mensagem?.message}
          {...contatoPublicoForm.register("mensagem")}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <MensagemErro error={contatoPublicoMutation.error} />
          <button
            type="submit"
            disabled={contatoPublicoMutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} aria-hidden="true" />
            {contatoPublicoMutation.isPending ? "Enviando..." : "Enviar mensagem"}
          </button>
        </div>
      </form>
    </section>
  );
}

function AuthContent({
  authMode,
  setAuthMode,
  registerForm,
  loginForm,
  recuperarSenhaForm,
  resetSenhaForm,
  registerMutation,
  loginMutation,
  confirmEmailMutation,
  confirmChangeEmailMutation,
  resendConfirmacaoMutation,
  forgotSenhaMutation,
  resetSenhaMutation,
  authEmailPendente,
  authUrlParams,
}: {
  authMode: AuthMode;
  setAuthMode: (authMode: AuthMode) => void;
  registerForm: ReturnType<typeof useForm<RegisterUsuarioInput>>;
  loginForm: ReturnType<typeof useForm<LoginUsuarioInput>>;
  recuperarSenhaForm: ReturnType<typeof useForm<EmailUsuarioFormInput>>;
  resetSenhaForm: ReturnType<typeof useForm<ResetSenhaUsuarioFormInput>>;
  registerMutation: ReturnType<typeof useMutation<RegisterUsuarioResponse, Error, RegisterUsuarioInput>>;
  loginMutation: ReturnType<typeof useMutation<AuthUsuarioResponse, Error, LoginUsuarioInput>>;
  confirmEmailMutation: ReturnType<typeof useMutation<void, Error, { usuarioId: string; token: string }>>;
  confirmChangeEmailMutation: ReturnType<typeof useMutation<void, Error, { usuarioId: string; token: string }>>;
  resendConfirmacaoMutation: ReturnType<typeof useMutation<void, Error, EmailUsuarioInput>>;
  forgotSenhaMutation: ReturnType<typeof useMutation<void, Error, EmailUsuarioInput>>;
  resetSenhaMutation: ReturnType<typeof useMutation<void, Error, ResetSenhaUsuarioInput>>;
  authEmailPendente: string;
  authUrlParams: { usuarioId: string; token: string };
}) {
  const isCadastro = authMode === "cadastro";
  const isLogin = authMode === "login";
  const [senhaCadastroVisivel, setSenhaCadastroVisivel] = useState(false);
  const [senhaLoginVisivel, setSenhaLoginVisivel] = useState(false);
  const [senhaResetVisivel, setSenhaResetVisivel] = useState(false);

  const renderConfirmacaoPendente = () => (
    <div className="auth-form-fields auth-form-fields-login">
      <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
        <strong className="block">Confirme seu email</strong>
        <span>
          Enviamos um link para {authEmailPendente || "seu email"}. Confirme antes de entrar.
        </span>
      </div>
      <button
        type="button"
        onClick={() =>
          resendConfirmacaoMutation.mutate({
            email: authEmailPendente || registerForm.getValues("email"),
          })
        }
        disabled={resendConfirmacaoMutation.isPending}
        className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold"
      >
        Reenviar confirmação
      </button>
      <MensagemErro error={resendConfirmacaoMutation.error} />
    </div>
  );

  const renderConfirmarEmail = () => (
    <div className="auth-form-fields auth-form-fields-login">
      <p className="text-sm text-muted">Confirme o link para ativar seu acesso ao Emprely.</p>
      <button
        type="button"
        disabled={confirmEmailMutation.isPending}
        onClick={() => confirmEmailMutation.mutate(authUrlParams)}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold !text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {confirmEmailMutation.isPending ? "Processando..." : "Confirmar email"}
      </button>
      <MensagemErro error={confirmEmailMutation.error} mensagem="Link de confirmação inválido ou expirado." />
      <button type="button" onClick={() => setAuthMode("login")} className="text-sm font-semibold text-primary">
        Voltar para login
      </button>
    </div>
  );

  const renderConfirmarAlteracaoEmail = () => (
    <div className="auth-form-fields auth-form-fields-login">
      <p className="text-sm text-muted">Confirme o novo email de acesso.</p>
      <button
        type="button"
        disabled={confirmChangeEmailMutation.isPending}
        onClick={() => confirmChangeEmailMutation.mutate(authUrlParams)}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {confirmChangeEmailMutation.isPending ? "Processando..." : "Confirmar novo email"}
      </button>
      <MensagemErro error={confirmChangeEmailMutation.error} mensagem="Link de alteração inválido ou expirado." />
    </div>
  );

  const renderRecuperarSenha = () => (
    <form
      className="auth-form-fields auth-form-fields-login"
      onSubmit={recuperarSenhaForm.handleSubmit((input) => forgotSenhaMutation.mutate(input))}
    >
      <CampoTexto
        label="E-mail"
        type="email"
        autoComplete="email"
        error={recuperarSenhaForm.formState.errors.email?.message}
        {...recuperarSenhaForm.register("email")}
      />
      <SubmitButton label="Enviar link de recuperação" loading={forgotSenhaMutation.isPending} />
      <MensagemErro error={forgotSenhaMutation.error} />
      <button type="button" onClick={() => setAuthMode("login")} className="text-sm font-semibold text-primary">
        Voltar para login
      </button>
    </form>
  );

  const renderRedefinirSenha = () => (
    <form
      className="auth-form-fields auth-form-fields-login"
      onSubmit={resetSenhaForm.handleSubmit((input) => resetSenhaMutation.mutate(input))}
    >
      <input type="hidden" {...resetSenhaForm.register("usuarioId")} />
      <input type="hidden" {...resetSenhaForm.register("token")} />
      <CampoSenhaAuth
        label="Nova senha"
        autoComplete="new-password"
        senhaVisivel={senhaResetVisivel}
        onToggleSenhaVisivel={() => setSenhaResetVisivel((visivel) => !visivel)}
        error={resetSenhaForm.formState.errors.novaSenha?.message}
        {...resetSenhaForm.register("novaSenha")}
      />
      <CampoSenhaAuth
        label="Confirmar nova senha"
        autoComplete="new-password"
        senhaVisivel={senhaResetVisivel}
        onToggleSenhaVisivel={() => setSenhaResetVisivel((visivel) => !visivel)}
        error={resetSenhaForm.formState.errors.confirmarNovaSenha?.message}
        {...resetSenhaForm.register("confirmarNovaSenha")}
      />
      <SubmitButton label="Redefinir senha" loading={resetSenhaMutation.isPending} />
      <MensagemErro error={resetSenhaMutation.error} mensagem="Link de redefinição inválido ou expirado." />
    </form>
  );

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
            <h2>Orçamentos profissionais em 2 minutos.</h2>
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
              {isCadastro ? "Teste o Emprely antes de escolher seu plano" : authMode === "recuperar-senha" ? "Recupere sua senha" : authMode === "redefinir-senha" ? "Crie uma nova senha" : "Bem-vindo de volta"}
            </h1>
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
              aria-selected={isLogin}
              onClick={() => setAuthMode("login")}
              className={isLogin ? "is-active" : ""}
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

          {authMode === "confirmacao-pendente" ? renderConfirmacaoPendente() : null}
          {authMode === "confirmar-email" ? renderConfirmarEmail() : null}
          {authMode === "confirmar-alteracao-email" ? renderConfirmarAlteracaoEmail() : null}
          {authMode === "recuperar-senha" ? renderRecuperarSenha() : null}
          {authMode === "redefinir-senha" ? renderRedefinirSenha() : null}

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
                placeholder="(11) 99999-9999"
                error={registerForm.formState.errors.telefone?.message}
                {...buildTelefoneInputProps(
                  registerForm.register("telefone", telefoneInputRegisterOptions),
                )}
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
          ) : isLogin ? (
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
                <button type="button" onClick={() => setAuthMode("recuperar-senha")}>
                  Esqueci minha senha
                </button>
              </div>
              <SubmitButton
                label="Entrar na conta"
                loading={loginMutation.isPending}
              />
              <MensagemErro
                error={loginMutation.error}
              />
              {loginMutation.error?.message.includes("Confirme") ? (
                <button
                  type="button"
                  onClick={() =>
                    resendConfirmacaoMutation.mutate({ email: loginForm.getValues("email") })
                  }
                  className="text-sm font-semibold text-primary"
                >
                  Reenviar email de confirmação
                </button>
              ) : null}
            </form>
          ) : null}

          <p className="auth-switch-copy">
            {isCadastro ? "Já usa o Emprely?" : "Novo no Emprely?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(isCadastro ? "login" : "cadastro")}
            >
              {isCadastro ? "Entrar" : "Teste por 7 dias"}
            </button>
          </p>

        </div>
      </div>
    </section>
  );
}

function getTemaVisualInicial(): TemaVisual {
  const temaSalvo = window.localStorage.getItem(temaVisualStorageKey);

  return temaSalvo === "dark" ? "dark" : "light";
}

function isSuportePublicoPath(): boolean {
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  return pathname === "/suporte";
}

function isBillingRegularizarPath(): boolean {
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  return pathname === "/billing/regularizar";
}

function getPublicBillingPaymentTokenFromPath(): string | null {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const prefixo = "/billing/pagar/";

  if (!pathname.toLowerCase().startsWith(prefixo)) {
    return null;
  }

  const token = pathname.slice(prefixo.length).trim();
  return token ? decodeURIComponent(token) : null;
}

function getAuthModeInicial(): AuthMode {
  const auth = new URLSearchParams(window.location.search).get("auth");

  if (auth === "confirm-email") {
    return "confirmar-email";
  }

  if (auth === "reset-password") {
    return "redefinir-senha";
  }

  if (auth === "confirm-change-email") {
    return "confirmar-alteracao-email";
  }

  if (auth === "cadastro") {
    return "cadastro";
  }

  return "login";
}

function getAuthUrlParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    usuarioId: params.get("userId") ?? "",
    token: params.get("token") ?? "",
  };
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
    telefoneContato: formatTelefoneCampo(perfilConta.telefoneContato),
    siteUrl: perfilConta.siteUrl ?? "",
    instagram: perfilConta.instagram ?? "",
    documento: formatCpfCnpjCampo(perfilConta.documento),
    segmento: perfilConta.segmento ?? "",
    cidadeUf: perfilConta.cidadeUf ?? "",
    corPrimaria: perfilConta.corPrimaria,
    corSecundaria: perfilConta.corSecundaria,
    corSistemaPrimaria:
      perfilConta.corSistemaPrimaria ?? perfilContaDefaultValues.corSistemaPrimaria,
    corSistemaSecundaria:
      perfilConta.corSistemaSecundaria ??
      perfilContaDefaultValues.corSistemaSecundaria,
    logoUrl: perfilConta.logoUrl ?? "",
    templateVisualPadrao: normalizarTemplateVisual(perfilConta.templateVisualPadrao),
    formatoArquivoPreferido: normalizarFormatoArquivoPreferido(
      perfilConta.formatoArquivoPreferido,
    ),
  };
}

function isPerfilContaOnboardingCompleto(
  perfilConta?: PerfilContaResponse,
): boolean {
  return Boolean(
    perfilConta?.nomeComercial?.trim() &&
      perfilConta.telefoneContato?.trim() &&
      perfilConta.emailContato?.trim() &&
      perfilConta.segmento?.trim() &&
      perfilConta.templateVisualPadrao?.trim() &&
      perfilConta.corPrimaria?.trim() &&
      perfilConta.corSecundaria?.trim() &&
      perfilConta.formatoArquivoPreferido?.trim(),
  );
}

type PerfilContaChecklistItem = {
  id: string;
  label: string;
  detalhe: string;
  completo: boolean;
};

function buildPerfilContaChecklist(
  perfilConta: Partial<PerfilContaFormInput>,
): PerfilContaChecklistItem[] {
  const valorPreenchido = (valor: unknown) =>
    typeof valor === "string" ? valor.trim().length > 0 : Boolean(valor);

  return [
    {
      id: "nome",
      label: "Nome comercial",
      detalhe: "Aparece no cabecalho e assinatura das propostas.",
      completo: valorPreenchido(perfilConta.nomeComercial),
    },
    {
      id: "segmento",
      label: "Segmento",
      detalhe: "Ajuda a contextualizar os templates e a proposta.",
      completo: valorPreenchido(perfilConta.segmento),
    },
    {
      id: "email",
      label: "E-mail de contato",
      detalhe: "Usado como canal comercial para o cliente.",
      completo: valorPreenchido(perfilConta.emailContato),
    },
    {
      id: "telefone",
      label: "Telefone/WhatsApp",
      detalhe: "Facilita aceite, duvidas e retorno do cliente.",
      completo: valorPreenchido(formatTelefoneCampo(perfilConta.telefoneContato ?? "")),
    },
    {
      id: "template",
      label: "Template padrao",
      detalhe: "Define o visual inicial de cada novo orcamento.",
      completo: valorPreenchido(perfilConta.templateVisualPadrao),
    },
    {
      id: "cores",
      label: "Cores dos templates",
      detalhe: "Mantem os materiais alinhados com a marca.",
      completo:
        valorPreenchido(perfilConta.corPrimaria) &&
        valorPreenchido(perfilConta.corSecundaria),
    },
    {
      id: "formato",
      label: "Formato preferido",
      detalhe: "Prepara PDF, imagem ou ambos para envio.",
      completo: valorPreenchido(perfilConta.formatoArquivoPreferido),
    },
  ];
}

function buildPerfilContaPayload(
  input: PerfilContaFormInput,
): UpdatePerfilContaInput {
  return {
    nomeComercial: input.nomeComercial.trim(),
    emailContato: normalizarOpcional(input.emailContato),
    telefoneContato: normalizarOpcional(formatTelefoneCampo(input.telefoneContato)),
    siteUrl: normalizarOpcional(input.siteUrl),
    instagram: normalizarOpcional(input.instagram),
    documento: normalizarOpcional(formatCpfCnpjCampo(input.documento)),
    segmento: normalizarOpcional(input.segmento),
    cidadeUf: normalizarOpcional(input.cidadeUf),
    corPrimaria: normalizarHexPreview(input.corPrimaria),
    corSecundaria: normalizarHexPreview(input.corSecundaria),
    corSistemaPrimaria: normalizarHexPreview(input.corSistemaPrimaria),
    corSistemaSecundaria: normalizarHexPreview(input.corSistemaSecundaria),
    logoUrl: normalizarOpcional(input.logoUrl),
    templateVisualPadrao: normalizarTemplateVisual(input.templateVisualPadrao),
    formatoArquivoPreferido: normalizarFormatoArquivoPreferido(
      input.formatoArquivoPreferido,
    ),
  };
}

function mapClienteForm(cliente: ClienteResponse): ClienteFormInput {
  return {
    nome: cliente.nome,
    email: cliente.email ?? "",
    telefone: formatTelefoneCampo(cliente.telefone),
    documento: formatCpfCnpjCampo(cliente.documento),
    endereco: cliente.endereco ?? "",
    numero: cliente.numero ?? "",
    cidade: cliente.cidade ?? "",
    instagram: cliente.instagram ?? "",
    facebook: cliente.facebook ?? "",
    tiktok: cliente.tiktok ?? "",
    observacoes: cliente.observacoes ?? "",
  };
}

function buildClientePayload(
  input: ClienteFormInput,
): CreateClienteInput | UpdateClienteInput {
  return {
    nome: input.nome.trim(),
    email: normalizarOpcional(input.email),
    telefone: normalizarOpcional(formatTelefoneCampo(input.telefone)),
    documento: normalizarOpcional(formatCpfCnpjCampo(input.documento)),
    endereco: normalizarOpcional(input.endereco),
    numero: normalizarOpcional(input.numero),
    cidade: normalizarOpcional(input.cidade),
    instagram: normalizarOpcional(input.instagram),
    facebook: normalizarOpcional(input.facebook),
    tiktok: normalizarOpcional(input.tiktok),
    observacoes: normalizarOpcional(input.observacoes),
  };
}

function buildBillingPagadorPayload(input: BillingPagadorFormInput): BillingPagadorInput {
  return {
    tipoPessoa: input.tipoPessoa,
    nome: input.nome.trim(),
    cpfCnpj: formatCpfCnpjCampo(input.cpfCnpj),
  };
}

function hasClienteDadosComplementares(
  cliente:
    | Pick<
        ClienteResponse,
        | "email"
        | "documento"
        | "endereco"
        | "numero"
        | "cidade"
        | "instagram"
        | "facebook"
        | "tiktok"
      >
    | null
    | undefined,
): boolean {
  if (!cliente) {
    return false;
  }

  return [
    cliente.email,
    cliente.documento,
    cliente.endereco,
    cliente.numero,
    cliente.cidade,
    cliente.instagram,
    cliente.facebook,
    cliente.tiktok,
  ].some((valor) => Boolean(valor?.trim()));
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

function getPrimeiraEtapaPendenteProposta(
  input: PropostaFormInput | PropostaPreviewInput,
): PropostaWizardEtapaId {
  if (!input.clienteId || valorSeguro(input.validadeDias) < 1) {
    return "cliente";
  }

  if (!input.titulo?.trim()) {
    return "proposta";
  }

  const itens = input.itens ?? [];
  const itensValidos =
    itens.length > 0 &&
    itens.every(
      (item) =>
        Boolean(item?.nome?.trim()) &&
        isQuantidadeItemValida(item?.quantidade) &&
        valorSeguro(item?.valorUnitario) >= 0,
    );

  if (!itensValidos) {
    return "itens";
  }

  if (!input.templateVisual) {
    return "template";
  }

  const subtotal = calcularTotalItens(
    itens.map((item) => ({
      quantidade: item?.quantidade,
      valorUnitario: item?.valorUnitario,
    })),
  );
  const desconto = valorSeguro(input.descontoValor);

  return desconto >= 0 && desconto <= subtotal ? "revisao" : "detalhamento";
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

function getSubtotalProposta(proposta: PropostaResponse): number {
  return calcularTotalItens(
    proposta.itens.map((item) => ({
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    })),
  );
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

function valorSeguro(valor: number | null | undefined): number {
  return Number.isFinite(valor) ? valor ?? 0 : 0;
}

function isQuantidadeItemValida(valor: number | null | undefined): boolean {
  return Number.isInteger(valor) && valorSeguro(valor) > 0;
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

function normalizarFormatoArquivoPreferido(
  valor: string | null | undefined,
): FormatoArquivoPreferido {
  const formato = formatoArquivoPreferidoValores.find((opcao) => opcao === valor);
  return formato ?? formatoArquivoPreferidoDefault;
}

function getDescricaoCardMensagemAnexo(
  formato: FormatoArquivoPreferido,
): string {
  if (formato === "Imagem") {
    return "Texto inicial com imagem da proposta para anexar no WhatsApp.";
  }

  if (formato === "PdfImagem") {
    return "Texto inicial com PDF e imagem da proposta para anexar no WhatsApp.";
  }

  return "Texto inicial com PDF da proposta para anexar no WhatsApp.";
}

function getDescricaoArquivoPreferidoAnexo(
  formato: FormatoArquivoPreferido,
): string {
  if (formato === "Imagem") {
    return "imagem";
  }

  if (formato === "PdfImagem") {
    return "PDF e imagem";
  }

  return "PDF";
}

function getDescricaoArquivoPreferidoCompartilhamento(
  formato: FormatoArquivoPreferido,
): string {
  if (formato === "Imagem") {
    return "Imagem";
  }

  if (formato === "PdfImagem") {
    return "PDF, imagem";
  }

  return "PDF";
}

function getInstrucaoAnexoWhatsapp(formato: FormatoArquivoPreferido): string {
  if (formato === "Imagem") {
    return "a imagem";
  }

  if (formato === "PdfImagem") {
    return "os arquivos";
  }

  return "o PDF";
}

function getPropostaTemplateLabel(templateVisual: PropostaTemplateVisual): string {
  const templateVisualNormalizado = normalizarTemplateVisual(templateVisual);

  return (
    propostaTemplateVisualOpcoesGaleria.find((template) => template.value === templateVisualNormalizado)
      ?.label ??
    propostaTemplateVisualOpcoes.find((template) => template.value === templateVisualNormalizado)
      ?.label ?? "Comercial minimalista"
  );
}

function isTemplateCoresEstaticas(templateVisual: PropostaTemplateVisual): boolean {
  const templateVisualNormalizado = normalizarTemplateVisual(templateVisual);

  return Boolean(
    propostaTemplateVisualOpcoesGaleria.find(
      (template) => template.value === templateVisualNormalizado,
    )?.coresEstaticas ??
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

function inferirTipoProposta(..._args: unknown[]): string {
  void _args;
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

function splitLinhasEditaveisFormulario(valor: string | null | undefined): string[] {
  if (!valor) {
    return [];
  }

  return valor.split(/\r?\n/);
}

function joinLinhasEditaveisFormulario(valores: string[]): string {
  return valores.join("\n");
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
    maximumFractionDigits: 0,
  }).format(valorSeguro(valor));
}

function formatQuantidadeItens(total: number): string {
  return `${total} ${total === 1 ? "item" : "itens"}`;
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

function aguardarProximoFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
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
    ? `Olá, ${nomeCliente}! Tudo bem?`
    : "Olá! Tudo bem?";

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

type RedeSocialCliente = "instagram" | "facebook" | "tiktok";

function buildClienteSocialUrl(
  rede: RedeSocialCliente,
  valor: string | null | undefined,
): string {
  const texto = valor?.trim();

  if (!texto) {
    return "";
  }

  if (/^https?:\/\//i.test(texto)) {
    return texto;
  }

  if (/^www\./i.test(texto)) {
    return `https://${texto}`;
  }

  const usuario = texto.replace(/^@/, "").replace(/^\/+/, "");

  if (!usuario) {
    return "";
  }

  if (rede === "instagram") {
    if (/instagram\.com/i.test(usuario)) {
      return `https://${usuario}`;
    }

    return `https://www.instagram.com/${usuario}`;
  }

  if (rede === "facebook") {
    if (/(facebook|fb)\.com/i.test(usuario)) {
      return `https://${usuario}`;
    }

    return `https://www.facebook.com/${usuario}`;
  }

  if (/tiktok\.com/i.test(usuario)) {
    return `https://${usuario}`;
  }

  return `https://www.tiktok.com/@${usuario}`;
}

function buildClienteEmailUrl({
  email,
  logoMarcaUrl,
  nomeMarca,
}: {
  email: string | null | undefined;
  logoMarcaUrl: string | null | undefined;
  nomeMarca: string;
}): string {
  const destinatario = email?.trim();

  if (!destinatario || !isEmailContatoClienteValido(destinatario)) {
    return "";
  }

  const assinatura = [
    "Atenciosamente,",
    nomeMarca.trim() || "Emprely",
    logoMarcaUrl?.trim() && !logoMarcaUrl.trim().startsWith("data:")
      ? `Logo: ${logoMarcaUrl.trim()}`
      : "",
  ].filter(Boolean);
  const corpo = ["Olá,", "", "", ...assinatura].join("\n");
  const parametros = new URLSearchParams({
    subject: `Contato - ${nomeMarca.trim() || "Emprely"}`,
    body: corpo,
  });

  return `mailto:${encodeURIComponent(destinatario)}?${parametros.toString()}`;
}

function isEmailContatoClienteValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildWhatsappPropostaUrl(
  proposta: PropostaResponse,
  cliente: ClienteResponse | undefined,
  perfilConta: PerfilContaResponse | undefined,
  contaNome: string,
  modo: PropostaWhatsappModo,
): string {
  const telefone = normalizarTelefoneWhatsapp(cliente?.telefone);
  const mensagem = buildMensagemWhatsappProposta(
    proposta,
    cliente,
    perfilConta,
    contaNome,
    modo,
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
  modo: PropostaWhatsappModo,
): string {
  if (modo === "completa") {
    return buildMensagemWhatsappPropostaCompleta(
      proposta,
      cliente,
      perfilConta,
      contaNome,
    );
  }

  return buildMensagemWhatsappPropostaArquivo(
    proposta,
    cliente,
    perfilConta,
    contaNome,
  );
}

function buildMensagemWhatsappPropostaArquivo(
  proposta: PropostaResponse,
  cliente: ClienteResponse | undefined,
  perfilConta: PerfilContaResponse | undefined,
  contaNome: string,
): string {
  const nomeCliente = cliente?.nome ?? proposta.clienteNome;
  const nomeMarca = perfilConta?.nomeComercial?.trim() || contaNome;
  const numeroProposta = formatNumeroProposta(proposta.numero);
  const linhas = [
    `Olá, ${nomeCliente}.`,
    "",
    `Segue a proposta ${numeroProposta} - "${proposta.titulo}" para sua avaliação.`,
    "Vou enviar o PDF ou a imagem da proposta em sequência por aqui.",
    "Fico à disposição para qualquer ajuste.",
  ];

  linhas.push("", `Enviado por ${nomeMarca}.`);

  return linhas.join("\n");
}

function buildMensagemWhatsappPropostaCompleta(
  proposta: PropostaResponse,
  cliente: ClienteResponse | undefined,
  perfilConta: PerfilContaResponse | undefined,
  contaNome: string,
): string {
  const nomeCliente = cliente?.nome ?? proposta.clienteNome;
  const nomeMarca = perfilConta?.nomeComercial?.trim() || contaNome;
  const numeroProposta = formatNumeroProposta(proposta.numero);
  const linhas = [
    `Olá, ${nomeCliente}.`,
    "",
    `Segue a proposta completa ${numeroProposta} - "${proposta.titulo}".`,
    `Enviado por ${nomeMarca}.`,
  ];

  adicionarSecaoTextoWhatsapp(linhas, "Mensagem inicial", proposta.introducao);

  linhas.push(
    "",
    "Dados da proposta",
    `Cliente: ${nomeCliente}`,
    `Data: ${formatDataCurta(proposta.createdAt)}`,
    `Validade: ${
      proposta.validadeDias
        ? `${proposta.validadeDias} dia${proposta.validadeDias === 1 ? "" : "s"}`
        : "Não informada"
    }`,
  );

  linhas.push("", "Itens");
  proposta.itens
    .slice()
    .sort((itemA, itemB) => itemA.ordem - itemB.ordem)
    .forEach((item, index) => {
      if (index > 0) {
        linhas.push("");
      }

      linhas.push(
        `${index + 1}. ${item.nome}`,
        `Quantidade: ${formatQuantidade(item.quantidade)}`,
        `Valor unitário: ${formatMoney(item.valorUnitario)}`,
        `Total do item: ${formatMoney(item.total)}`,
      );

      if (item.descricao?.trim()) {
        linhas.push(`Descrição: ${item.descricao.trim()}`);
      }
    });

  adicionarListaWhatsapp(linhas, "O que está incluso", proposta.itensInclusos);
  adicionarListaWhatsapp(
    linhas,
    "O que não está incluso",
    proposta.itensNaoInclusos,
  );
  adicionarListaWhatsapp(linhas, "Cronograma", proposta.cronograma);
  adicionarListaWhatsapp(linhas, "Benefícios", proposta.beneficios);
  adicionarSecaoTextoWhatsapp(linhas, "Observações finais", proposta.observacoes);
  adicionarSecaoTextoWhatsapp(
    linhas,
    "Condições de pagamento",
    proposta.condicoesPagamento,
  );

  linhas.push(
    "",
    "Resumo financeiro",
    `Subtotal: ${formatMoney(getSubtotalProposta(proposta))}`,
  );

  if (proposta.descontoValor > 0) {
    linhas.push(`Desconto: ${formatMoney(proposta.descontoValor)}`);
  }

  linhas.push(`Total final: ${formatMoney(proposta.total)}`);

  return linhas.join("\n");
}

function adicionarSecaoTextoWhatsapp(
  linhas: string[],
  titulo: string,
  texto: string | null | undefined,
) {
  const textoNormalizado = texto?.trim();

  if (!textoNormalizado) {
    return;
  }

  linhas.push("", titulo, textoNormalizado);
}

function adicionarListaWhatsapp(
  linhas: string[],
  titulo: string,
  itens: string[] | null | undefined,
) {
  const itensValidos = itens
    ?.map((item) => item.trim())
    .filter(Boolean);

  if (!itensValidos?.length) {
    return;
  }

  linhas.push("", titulo, ...itensValidos.map((item) => `- ${item}`));
}

function normalizarTelefoneWhatsapp(
  telefone: string | null | undefined,
): string {
  if (!isTelefoneWhatsappValido(telefone)) {
    return "";
  }

  const digitos = extrairDigitosTelefoneNacional(telefone);

  if (digitos.length === 0) {
    return "";
  }

  if (isQuantidadeDigitosTelefoneValida(digitos.length)) {
    return `55${digitos}`;
  }

  return "";
}

function isTelefoneWhatsappValido(telefone: string | null | undefined): boolean {
  if (!telefone?.trim()) {
    return true;
  }

  return isQuantidadeDigitosTelefoneValida(
    extrairDigitosTelefoneNacional(telefone).length,
  );
}

function formatTelefoneCampo(telefone: string | null | undefined): string {
  const digitos = extrairDigitosTelefoneNacional(telefone);

  if (digitos.length === 0) {
    return "";
  }

  if (digitos.length <= 2) {
    return `(${digitos}`;
  }

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);

  if (numero.length <= 4) {
    return `(${ddd}) ${numero}`;
  }

  if (numero.length <= 8) {
    return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
  }

  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
}

function formatTelefoneOpcional(telefone: string | null | undefined): string {
  return formatTelefoneCampo(telefone) || telefone?.trim() || "";
}

function formatTelefoneExibicao(telefone: string | null | undefined): string {
  return formatTelefoneOpcional(telefone) || "Não informado";
}

function extrairDigitosTelefoneNacional(
  telefone: string | null | undefined,
): string {
  const digitos = telefone?.replace(/\D/g, "") ?? "";

  if (
    digitos.length > telefoneDigitosMaximosNacionais &&
    digitos.startsWith("55")
  ) {
    return digitos.slice(2, 2 + telefoneDigitosMaximosNacionais);
  }

  return digitos.slice(0, telefoneDigitosMaximosNacionais);
}

function isQuantidadeDigitosTelefoneValida(quantidade: number): boolean {
  return (
    quantidade === telefoneDigitosFixoNacionais ||
    quantidade === telefoneDigitosCelularNacionais
  );
}

function formatCpfCnpjCampo(valor: string | null | undefined): string {
  const digitos = extrairDigitosCpfCnpj(valor);

  if (digitos.length <= cpfDigitos) {
    return formatCpfCampo(digitos);
  }

  return formatCnpjCampo(digitos);
}

function formatCpfCampo(digitos: string): string {
  if (digitos.length <= 3) {
    return digitos;
  }

  if (digitos.length <= 6) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  }

  if (digitos.length <= 9) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  }

  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(
    6,
    9,
  )}-${digitos.slice(9)}`;
}

function formatCnpjCampo(digitos: string): string {
  if (digitos.length <= 2) {
    return digitos;
  }

  if (digitos.length <= 5) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
  }

  if (digitos.length <= 8) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`;
  }

  if (digitos.length <= 12) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(
      5,
      8,
    )}/${digitos.slice(8)}`;
  }

  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(
    5,
    8,
  )}/${digitos.slice(8, 12)}-${digitos.slice(12)}`;
}

function formatCpfCnpjExibicao(valor: string | null | undefined): string {
  return formatCpfCnpjCampo(valor) || "Não informado";
}

function extrairDigitosCpfCnpj(valor: string | null | undefined): string {
  return (valor?.replace(/\D/g, "") ?? "").slice(0, cnpjDigitos);
}

function isCpfCnpjCampoValido(valor: string | null | undefined): boolean {
  const valorNormalizado = valor?.trim() ?? "";

  if (!valorNormalizado) {
    return true;
  }

  const quantidade = extrairDigitosCpfCnpj(valorNormalizado).length;
  return quantidade === cpfDigitos || quantidade === cnpjDigitos;
}

function buildCpfCnpjInputProps(
  registerProps: UseFormRegisterReturn,
): Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "onBlur" | "onChange" | "ref"
> &
  UseFormRegisterReturn {
  return {
    ...registerProps,
    type: "text",
    inputMode: "numeric",
    maxLength: cpfCnpjMascaraMaxLength,
    onChange: (event) => {
      const target = event.target as HTMLInputElement;
      target.value = formatCpfCnpjCampo(target.value);
      return registerProps.onChange(event);
    },
  };
}

function buildTelefoneInputProps(
  registerProps: UseFormRegisterReturn,
): Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "onBlur" | "onChange" | "ref"
> &
  UseFormRegisterReturn {
  return {
    ...registerProps,
    type: "tel",
    inputMode: "numeric",
    autoComplete: "tel",
    maxLength: telefoneMascaraMaxLength,
    onChange: (event) => {
      const target = event.target as HTMLInputElement;
      target.value = formatTelefoneCampo(target.value);
      return registerProps.onChange(event);
    },
  };
}

function bloquearQuantidadeDecimalKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
  if ([".", ",", "-", "+", "e", "E"].includes(event.key)) {
    event.preventDefault();
  }
}

function bloquearQuantidadeDecimalPaste(event: ReactClipboardEvent<HTMLInputElement>) {
  const texto = event.clipboardData.getData("text");

  if (!/^\d+$/.test(texto.trim())) {
    event.preventDefault();
  }
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

function formatMoedaRealInput(valor: number | null | undefined): string {
  return formatMoney(valorSeguro(valor)).replace(/\u00a0/g, " ");
}

function formatMoedaRealEditavel(valor: number | null | undefined): string {
  const valorNumerico = valorSeguro(valor);

  if (valorNumerico === 0) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(valorNumerico);
}

function parseMoedaRealInput(valor: string): number {
  const texto = valor
    .replace(/\s/g, "")
    .replace(/^R\$/i, "")
    .trim();

  if (!texto) {
    return 0;
  }

  const temSeparadorDecimal = /[,.]/.test(texto);

  if (!temSeparadorDecimal) {
    const apenasDigitos = texto.replace(/\D/g, "");
    return apenasDigitos ? Number(apenasDigitos) : 0;
  }

  const separadores = texto.match(/[,.]/g) ?? [];
  const ultimoSeparador = Math.max(texto.lastIndexOf(","), texto.lastIndexOf("."));
  const casasAposSeparador = texto.slice(ultimoSeparador + 1).replace(/\D/g, "").length;
  const pareceMilhar =
    (!texto.includes(",") && separadores.length > 1) ||
    (texto.includes(".") && !texto.includes(",") && casasAposSeparador === 3);

  if (pareceMilhar) {
    const semMilhar = texto.replace(/[.,]/g, "").replace(/\D/g, "");
    return semMilhar ? Number(semMilhar) : 0;
  }

  const inteiro = texto.slice(0, ultimoSeparador).replace(/\D/g, "");
  const decimal = texto.slice(ultimoSeparador + 1).replace(/\D/g, "").padEnd(2, "0").slice(0, 2);
  const normalizado = `${inteiro || "0"}.${decimal}`;

  return Number(normalizado);
}

function hasDescontoDocumento(d: PropostaDocumentoDados): boolean {
  return Math.abs(d.desconto) >= 0.01;
}

type PdfLinkAnnotation = {
  link: (x: number, y: number, w: number, h: number, options: { url: string }) => void;
};

function adicionarLinksPdfPorDataAttribute(
  pdf: PdfLinkAnnotation,
  node: HTMLDivElement | null,
  pdfBox: { x: number; y: number; width: number; height: number },
): void {
  if (!node) {
    return;
  }

  const links = Array.from(
    node.querySelectorAll<HTMLElement>("[data-pdf-link-url]"),
  );

  links.forEach((elemento) => {
    const url = elemento.dataset.pdfLinkUrl?.trim();
    const area = calcularAreaElementoPdf(node, elemento, pdfBox);

    if (!url || !area) {
      return;
    }

    pdf.link(area.x, area.y, area.width, area.height, { url });
  });
}

function calcularAreaLinkAprovacaoPdf(
  node: HTMLDivElement | null,
  pdfBox: { x: number; y: number; width: number; height: number },
): { x: number; y: number; width: number; height: number } | null {
  if (!node) {
    return null;
  }

  const nodeRect = node.getBoundingClientRect();

  if (nodeRect.width <= 0 || nodeRect.height <= 0) {
    return null;
  }

  const ctas = Array.from(
    node.querySelectorAll<HTMLElement>(".doc-footer-cta, .doc-cta"),
  ).filter((elemento) => {
    const rect = elemento.getBoundingClientRect();
    const estilo = window.getComputedStyle(elemento);

    return (
      rect.width > 1 &&
      rect.height > 1 &&
      estilo.display !== "none" &&
      estilo.visibility !== "hidden"
    );
  });
  const cta = ctas.at(-1);

  if (!cta) {
    return null;
  }

  return calcularAreaElementoPdf(node, cta, pdfBox);
}

function calcularAreaElementoPdf(
  node: HTMLDivElement,
  elemento: HTMLElement,
  pdfBox: { x: number; y: number; width: number; height: number },
): { x: number; y: number; width: number; height: number } | null {
  const nodeRect = node.getBoundingClientRect();
  const elementoRect = elemento.getBoundingClientRect();

  if (
    nodeRect.width <= 0 ||
    nodeRect.height <= 0 ||
    elementoRect.width <= 1 ||
    elementoRect.height <= 1
  ) {
    return null;
  }

  const escalaX = pdfBox.width / nodeRect.width;
  const escalaY = pdfBox.height / nodeRect.height;

  return {
    x: pdfBox.x + (elementoRect.left - nodeRect.left) * escalaX,
    y: pdfBox.y + (elementoRect.top - nodeRect.top) * escalaY,
    width: elementoRect.width * escalaX,
    height: elementoRect.height * escalaY,
  };
}

function formatUnidadeServico(unidade: UnidadeServico): string {
  const labels: Record<UnidadeServico, string> = {
    Unico: "único",
    Mensal: "mensal",
    Semanal: "semanal",
    Diario: "diário",
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

function isStatusPropostaComDocumentoFinal(status: PropostaStatus): boolean {
  return (
    status === "Gerada" ||
    status === "Enviada" ||
    status === "Aceita" ||
    status === "Recusada"
  );
}

function isStatusPropostaEditavelDiretamente(status: PropostaStatus): boolean {
  return status === "Rascunho" || status === "Gerada";
}

function normalizarHexPreview(valor: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(valor) ? valor.toUpperCase() : "#000000";
}

function canExportPropostaConta(
  conta: ContaAtualResponse,
  billingStatus?: BillingStatusResponse,
): boolean {
  if (billingStatus) {
    return billingStatus.entitlements.canExportProposta;
  }

  const statusComercial = getStatusComercialContaEfetivo(conta);

  return (
    statusComercial === "TrialAtivo" ||
    statusComercial === "FundadorAtivo"
  );
}

function getStatusComercialContaEfetivo(
  conta: ContaAtualResponse,
  billingStatus?: BillingStatusResponse,
): ContaAtualResponse["statusComercial"] {
  if (billingStatus) {
    if (billingStatus.entitlements.canRemoveWatermark) {
      return "FundadorAtivo";
    }

    return billingStatus.entitlements.canGenerateProposta
      ? "TrialAtivo"
      : "TrialExpirado";
  }

  if (conta.plano === "Fundador") {
    return "FundadorAtivo";
  }

  if (
    conta.statusComercial === "TrialAtivo" ||
    conta.statusComercial === "TrialExpirado" ||
    conta.statusComercial === "FundadorAtivo"
  ) {
    return conta.statusComercial;
  }

  const trialEndsAt = new Date(conta.trialEndsAt).getTime();

  if (Number.isFinite(trialEndsAt) && trialEndsAt <= Date.now()) {
    return "TrialExpirado";
  }

  return conta.statusComercial;
}

function getWatermarkDocumentoProposta(
  _planoConta: ContaAtualResponse["plano"],
  statusComercialConta: ContaAtualResponse["statusComercial"],
): "nenhuma" | "trial-ativo" | "trial-expirado" {
  if (statusComercialConta === "FundadorAtivo") {
    return "nenhuma";
  }

  return statusComercialConta === "TrialExpirado"
    ? "trial-expirado"
    : "trial-ativo";
}

function getMensagemBloqueioPlano(
  conta: ContaAtualResponse | undefined,
  billingStatus?: BillingStatusResponse,
): string {
  if (!conta || canExportPropostaConta(conta, billingStatus)) {
    return "";
  }

  return "Trial expirado. Ative o Plano Fundador em Plano para gerar, imprimir ou compartilhar propostas.";
}

function getAppViewLabel(view: AppView): string {
  const labels: Record<AppView, string> = {
    dashboard: "Painel comercial",
    clientes: "Clientes",
    servicos: "Serviços",
    propostas: "Propostas",
    billing: "Plano",
    conta: "Perfil da conta",
    personalizacao: "Perfil da conta",
    suporte: "Suporte",
  };

  return labels[view];
}

type BillingRetorno = "sucesso" | "cancelado" | "expirado";

function getBillingRetornoFromPath(pathname: string): BillingRetorno | null {
  if (pathname.endsWith("/billing/sucesso")) {
    return "sucesso";
  }

  if (pathname.endsWith("/billing/cancelado")) {
    return "cancelado";
  }

  if (pathname.endsWith("/billing/expirado")) {
    return "expirado";
  }

  return null;
}

function getMensagemRetornoBilling(retorno: BillingRetorno): string {
  if (retorno === "sucesso") {
    return "Pagamento recebido. Estamos atualizando o status do plano.";
  }

  if (retorno === "expirado") {
    return "Checkout expirado. Inicie uma nova cobranca quando quiser ativar o plano.";
  }

  return "Checkout cancelado. Nenhuma cobranca foi concluida.";
}

function formatTrialConta(conta: ContaAtualResponse): string {
  const statusComercialEfetivo = getStatusComercialContaEfetivo(conta);

  if (statusComercialEfetivo === "FundadorAtivo") {
    return "Plano ativo";
  }

  if (statusComercialEfetivo === "TrialExpirado") {
    return `Expirado em ${formatDataConta(conta.trialEndsAt)}`;
  }

  const trialEndsAt = new Date(conta.trialEndsAt).getTime();

  if (Number.isFinite(trialEndsAt) && trialEndsAt <= Date.now()) {
    return "Ativo por dias gratis";
  }

  const diasRestantes = Math.max(0, conta.trialDiasRestantes ?? 0);

  return `${diasRestantes} dia${diasRestantes === 1 ? "" : "s"} restante${
    diasRestantes === 1 ? "" : "s"
  } até ${formatDataConta(conta.trialEndsAt)}`;
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
