import type {
  PerfilContaResponse,
  UpdatePerfilContaInput,
} from "@/types/account";
import type {
  AuthUsuarioResponse,
  LoginUsuarioInput,
  MeUsuarioResponse,
  RegisterUsuarioInput,
} from "@/types/auth";
import type {
  ClienteResponse,
  CreateClienteInput,
  UpdateClienteInput,
} from "@/types/customer";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5262";

type ApiOptions = {
  token?: string | null;
};

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

async function apiFetch<TResponse>(
  path: string,
  init: RequestInit,
  options: ApiOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getMensagemErroApi(response));
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
