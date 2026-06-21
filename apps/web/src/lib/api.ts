import type {
  AdminAlterarPlanoContaInput,
  AdminAlterarPerfilAdminInput,
  AdminContaCriadaResponse,
  AdminCriarContaInput,
  AdminCriarAdminInput,
  AdminCriarUsuarioInput,
  AdminDiasGratisContaInput,
  AdminDiasGratisLoteInput,
  AdminEmailPersonalizadoInput,
  AdminEmailHistoricoResponse,
  AdminLoginInput,
  AdminLoginResponse,
  AdminMotivoInput,
  AdminPainelAdminResponse,
  AdminResendConfirmacaoEmailInput,
  AdminSuspenderContaInput,
  AdminUsuarioDetalheResponse,
  AdminUsuarioResumoResponse,
  AdminUsuariosFiltros,
  AdminUsuariosPainelResponse,
} from "@/types/admin";
import type {
  LogoPerfilUploadResponse,
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import type {
  AuthUsuarioResponse,
  ChangeEmailUsuarioInput,
  ChangeSenhaUsuarioInput,
  EmailUsuarioInput,
  LoginUsuarioInput,
  MeUsuarioResponse,
  RegisterUsuarioInput,
  RegisterUsuarioResponse,
  ResetSenhaUsuarioInput,
} from "@/types/auth";
import type {
  ContatoPublicoResponse,
  CreateContatoPublicoInput,
  CreateSuporteSolicitacaoInput,
  SuporteSolicitacaoResponse,
} from "@/types/support";
import type {
  ClienteResponse,
  CreateClienteInput,
  UpdateClienteInput,
} from "@/types/customer";
import type {
  CreateServicoInput,
  ServicoResponse,
  UpdateServicoInput,
} from "@/types/service";
import type {
  CreatePropostaInput,
  PropostaResponse,
  UpdatePropostaInput,
} from "@/types/proposal";
import type {
  CreateOnboardingEventoInput,
  OnboardingResponse,
  UpdateOnboardingInput,
} from "@/types/onboarding";

export const sessaoInvalidaEventName = "emprely:sessao-invalida";

const apiBaseUrl = getApiBaseUrl();

type ApiOptions = {
  token?: string | null;
};

export class ApiErro extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiErro";
  }
}

function getApiBaseUrl(): string {
  const apiBaseUrlConfigurada = import.meta.env.VITE_API_BASE_URL?.trim();

  if (apiBaseUrlConfigurada) {
    return apiBaseUrlConfigurada.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5262";
  }

  throw new Error(
    "VITE_API_BASE_URL deve ser configurada para ambientes beta, staging ou producao.",
  );
}

export async function registerUsuario(
  input: RegisterUsuarioInput,
): Promise<RegisterUsuarioResponse> {
  return apiFetch<RegisterUsuarioResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmEmailUsuario(input: {
  usuarioId: string;
  token: string;
}): Promise<void> {
  return apiFetch<void>("/api/auth/confirm-email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resendConfirmacaoEmail(
  input: EmailUsuarioInput,
): Promise<void> {
  return apiFetch<void>("/api/auth/resend-confirmation", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function forgotSenhaUsuario(input: EmailUsuarioInput): Promise<void> {
  return apiFetch<void>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resetSenhaUsuario(
  input: ResetSenhaUsuarioInput,
): Promise<void> {
  return apiFetch<void>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmChangeEmailUsuario(input: {
  usuarioId: string;
  token: string;
}): Promise<void> {
  return apiFetch<void>("/api/auth/confirm-change-email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUsuario(
  input: LoginUsuarioInput,
): Promise<AuthUsuarioResponse> {
  return apiFetch<AuthUsuarioResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getUsuarioAtual(token: string): Promise<MeUsuarioResponse> {
  return apiFetch<MeUsuarioResponse>(
    "/api/me",
    {
      method: "GET",
    },
    { token },
  );
}

export async function changeSenhaUsuario(
  input: ChangeSenhaUsuarioInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    "/api/me/password",
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function changeEmailUsuario(
  input: ChangeEmailUsuarioInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    "/api/me/email",
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function createSuporteSolicitacao(
  input: CreateSuporteSolicitacaoInput,
  token: string,
): Promise<SuporteSolicitacaoResponse> {
  return apiFetch<SuporteSolicitacaoResponse>(
    "/api/support",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function createContatoPublico(
  input: CreateContatoPublicoInput,
): Promise<ContatoPublicoResponse> {
  return apiFetch<ContatoPublicoResponse>("/api/support/public", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getAdminEmailsHistorico(
  adminKey: string,
): Promise<AdminEmailHistoricoResponse[]> {
  return apiFetch<AdminEmailHistoricoResponse[]>("/api/admin/emails", {
    method: "GET",
    headers: {
      "X-Emprely-Admin-Key": adminKey,
    },
  });
}

export async function adminResendConfirmacaoEmail(
  input: AdminResendConfirmacaoEmailInput,
  adminKey: string,
): Promise<void> {
  return apiFetch<void>("/api/admin/emails/resend-confirmation", {
    method: "POST",
    headers: {
      "X-Emprely-Admin-Key": adminKey,
    },
    body: JSON.stringify(input),
  });
}

export async function getAdminEmailsHistoricoPainel(
  token: string,
): Promise<AdminEmailHistoricoResponse[]> {
  return apiFetch<AdminEmailHistoricoResponse[]>(
    "/api/admin/emails",
    {
      method: "GET",
    },
    { token },
  );
}

export async function adminResendConfirmacaoEmailPainel(
  input: AdminResendConfirmacaoEmailInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    "/api/admin/emails/resend-confirmation",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminLogin(
  input: AdminLoginInput,
): Promise<AdminLoginResponse> {
  return apiFetch<AdminLoginResponse>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getAdminAdmins(token: string): Promise<AdminPainelAdminResponse[]> {
  return apiFetch<AdminPainelAdminResponse[]>(
    "/api/admin/admins",
    {
      method: "GET",
    },
    { token },
  );
}

export async function adminCriarAdmin(
  input: AdminCriarAdminInput,
  token: string,
): Promise<AdminPainelAdminResponse> {
  return apiFetch<AdminPainelAdminResponse>(
    "/api/admin/admins",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminAlterarPerfilAdmin(
  adminId: string,
  input: AdminAlterarPerfilAdminInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/admins/${adminId}/perfil`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminBloquearAdmin(
  adminId: string,
  input: AdminMotivoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/admins/${adminId}/bloquear`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminDesbloquearAdmin(
  adminId: string,
  input: AdminMotivoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/admins/${adminId}/desbloquear`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function getAdminUsuarios(
  filtros: AdminUsuariosFiltros,
  token: string,
): Promise<AdminUsuariosPainelResponse> {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  return apiFetch<AdminUsuariosPainelResponse>(
    `/api/admin/usuarios?${params.toString()}`,
    {
      method: "GET",
    },
    { token },
  );
}

export async function getAdminUsuarioDetalhe(
  usuarioId: string,
  token: string,
): Promise<AdminUsuarioDetalheResponse> {
  return apiFetch<AdminUsuarioDetalheResponse>(
    `/api/admin/usuarios/${usuarioId}`,
    {
      method: "GET",
    },
    { token },
  );
}

export async function adminCriarUsuario(
  input: AdminCriarUsuarioInput,
  token: string,
): Promise<AdminUsuarioResumoResponse> {
  return apiFetch<AdminUsuarioResumoResponse>(
    "/api/admin/usuarios",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminCriarConta(
  input: AdminCriarContaInput,
  token: string,
): Promise<AdminContaCriadaResponse> {
  return apiFetch<AdminContaCriadaResponse>(
    "/api/admin/contas",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminBloquearUsuario(
  usuarioId: string,
  input: AdminMotivoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/usuarios/${usuarioId}/bloquear`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminDesbloquearUsuario(
  usuarioId: string,
  input: AdminMotivoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/usuarios/${usuarioId}/desbloquear`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminAlterarPlanoConta(
  contaId: string,
  input: AdminAlterarPlanoContaInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/contas/${contaId}/plano`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminCriarDiasGratisConta(
  contaId: string,
  input: AdminDiasGratisContaInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/contas/${contaId}/dias-gratis`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminCriarDiasGratisLote(
  input: AdminDiasGratisLoteInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    "/api/admin/contas/dias-gratis/lote",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminSuspenderConta(
  contaId: string,
  input: AdminSuspenderContaInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/contas/${contaId}/suspender`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminReativarConta(
  contaId: string,
  input: AdminMotivoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    `/api/admin/contas/${contaId}/reativar`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminEnviarEmailPersonalizado(
  input: AdminEmailPersonalizadoInput,
  token: string,
): Promise<void> {
  return apiFetch<void>(
    "/api/admin/usuarios/emails/personalizado",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function adminDownloadUsuariosCsv(
  token: string,
  filtros: AdminUsuariosFiltros = {},
): Promise<Blob> {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const response = await fetch(`${apiBaseUrl}/api/admin/usuarios/export.csv${query ? `?${query}` : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiErro(response.status, await getMensagemErroApi(response));
  }

  return response.blob();
}

export async function getPerfilContaAtual(
  token: string,
): Promise<PerfilContaResponse> {
  return apiFetch<PerfilContaResponse>(
    "/api/account/profile",
    {
      method: "GET",
    },
    { token },
  );
}

export async function getOnboarding(token: string): Promise<OnboardingResponse> {
  return apiFetch<OnboardingResponse>(
    "/api/onboarding",
    {
      method: "GET",
    },
    { token },
  );
}

export async function updateOnboarding(
  input: UpdateOnboardingInput,
  token: string,
): Promise<OnboardingResponse> {
  return apiFetch<OnboardingResponse>(
    "/api/onboarding",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function createOnboardingEvento(
  input: CreateOnboardingEventoInput,
  token: string,
): Promise<OnboardingResponse> {
  return apiFetch<OnboardingResponse>(
    "/api/onboarding/events",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function updatePerfilConta(
  input: UpdatePerfilContaInput,
  token: string,
): Promise<PerfilContaResponse> {
  return apiFetch<PerfilContaResponse>(
    "/api/account/profile",
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function uploadLogoPerfilConta(
  arquivo: File,
  token: string,
): Promise<LogoPerfilUploadResponse> {
  const formData = new FormData();
  formData.append("file", arquivo);

  return apiFetch<LogoPerfilUploadResponse>(
    "/api/account/profile/logo",
    {
      method: "POST",
      body: formData,
    },
    { token },
  );
}

export function resolveApiAssetUrl(assetUrl: string | null | undefined): string {
  const valor = assetUrl?.trim() ?? "";

  if (!valor) {
    return "";
  }

  if (/^https?:\/\//i.test(valor) || valor.startsWith("data:")) {
    return valor;
  }

  if (valor.startsWith("/")) {
    return `${apiBaseUrl}${valor}`;
  }

  return valor;
}

export async function getClientesConta(
  token: string,
): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(
    "/api/customers",
    {
      method: "GET",
    },
    { token },
  );
}

export async function createCliente(
  input: CreateClienteInput,
  token: string,
): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(
    "/api/customers",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function updateCliente(
  id: string,
  input: UpdateClienteInput,
  token: string,
): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(
    `/api/customers/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function deleteCliente(id: string, token: string): Promise<void> {
  return apiFetch<void>(
    `/api/customers/${id}`,
    {
      method: "DELETE",
    },
    { token },
  );
}

export async function getServicosConta(
  token: string,
): Promise<ServicoResponse[]> {
  return apiFetch<ServicoResponse[]>(
    "/api/services",
    {
      method: "GET",
    },
    { token },
  );
}

export async function createServico(
  input: CreateServicoInput,
  token: string,
): Promise<ServicoResponse> {
  return apiFetch<ServicoResponse>(
    "/api/services",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function updateServico(
  id: string,
  input: UpdateServicoInput,
  token: string,
): Promise<ServicoResponse> {
  return apiFetch<ServicoResponse>(
    `/api/services/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function deleteServico(id: string, token: string): Promise<void> {
  return apiFetch<void>(
    `/api/services/${id}`,
    {
      method: "DELETE",
    },
    { token },
  );
}

export async function getPropostasConta(
  token: string,
): Promise<PropostaResponse[]> {
  return apiFetch<PropostaResponse[]>(
    "/api/proposals",
    {
      method: "GET",
    },
    { token },
  );
}

export async function createProposta(
  input: CreatePropostaInput,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    "/api/proposals",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function updateProposta(
  id: string,
  input: UpdatePropostaInput,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    { token },
  );
}

export async function duplicateProposta(
  id: string,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}/duplicate`,
    {
      method: "POST",
    },
    { token },
  );
}

export async function generateProposta(
  id: string,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}/generate`,
    {
      method: "POST",
    },
    { token },
  );
}

export async function sendProposta(
  id: string,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}/send`,
    {
      method: "POST",
    },
    { token },
  );
}

export async function acceptProposta(
  id: string,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}/accept`,
    {
      method: "POST",
    },
    { token },
  );
}

export async function rejectProposta(
  id: string,
  token: string,
): Promise<PropostaResponse> {
  return apiFetch<PropostaResponse>(
    `/api/proposals/${id}/reject`,
    {
      method: "POST",
    },
    { token },
  );
}

export async function deleteProposta(id: string, token: string): Promise<void> {
  return apiFetch<void>(
    `/api/proposals/${id}`,
    {
      method: "DELETE",
    },
    { token },
  );
}

async function apiFetch<TResponse>(
  path: string,
  init: RequestInit,
  options: ApiOptions = {},
): Promise<TResponse> {
  const isFormDataBody = init.body instanceof FormData;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const mensagemErro = await getMensagemErroApi(response);

    if (
      options.token &&
      (response.status === 401 ||
        (response.status === 403 && isErroAcessoConta(mensagemErro)))
    ) {
      window.dispatchEvent(new CustomEvent(sessaoInvalidaEventName));
    }

    throw new ApiErro(response.status, mensagemErro);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

async function getMensagemErroApi(response: Response): Promise<string> {
  const fallback = getFallbackMensagemErroApi(response.status);

  try {
    const payload = (await response.json()) as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    };

    if (payload.errors) {
      return Object.values(payload.errors).flat().join(" ");
    }

    return payload.message ?? payload.title ?? fallback;
  } catch {
    return fallback;
  }
}

function getFallbackMensagemErroApi(status: number): string {
  if (status === 429) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.";
  }

  if (status === 400) {
    return "Revise os campos informados.";
  }

  if (status === 401) {
    return "Sessao expirada ou acesso nao autorizado.";
  }

  if (status === 403) {
    return "Voce nao tem permissao para executar esta acao.";
  }

  return `Erro ${status}`;
}

function isErroAcessoConta(mensagem: string): boolean {
  return mensagem === "Conta Bloqueada" || mensagem === "Conta Suspensa";
}
