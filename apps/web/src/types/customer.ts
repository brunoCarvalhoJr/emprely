export type ClienteResponse = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  documento: string | null;
  endereco: string | null;
  numero: string | null;
  cidade: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  observacoes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateClienteInput = {
  nome: string;
  email: string | null;
  telefone: string | null;
  documento: string | null;
  endereco: string | null;
  numero: string | null;
  cidade: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  observacoes: string | null;
};

export type UpdateClienteInput = CreateClienteInput;
