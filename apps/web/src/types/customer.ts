export type ClienteResponse = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  documento: string | null;
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
  observacoes: string | null;
};

export type UpdateClienteInput = CreateClienteInput;
