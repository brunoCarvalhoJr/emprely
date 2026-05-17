import type {
  LogoPerfilUploadResponse,
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import type {
  AuthUsuarioResponse,
  ChangeSenhaUsuarioInput,
  LoginUsuarioInput,
  MeUsuarioResponse,
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
  UpdateServicoInput,
} from "@/types/service";
import type {
  CreatePropostaInput,
  PropostaResponse,
  UpdatePropostaInput,
} from "@/types/proposal";

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
): Promise<AuthUsuarioResponse> {
  return apiFetch<AuthUsuarioResponse>("/api/auth/register", {
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
    if (response.status === 401 && options.token) {
      window.dispatchEvent(new CustomEvent(sessaoInvalidaEventName));
    }

    throw new ApiErro(response.status, await getMensagemErroApi(response));
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

async function getMensagemErroApi(response: Response): Promise<string> {
  const fallback = `Erro ${response.status}`;

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
