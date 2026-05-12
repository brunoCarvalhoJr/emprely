import type {
  AuthUsuarioResponse,
  LoginUsuarioInput,
  MeUsuarioResponse,
  RegisterUsuarioInput,
} from "@/types/auth";

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
