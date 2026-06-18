export type CreateContatoPublicoInput = {
  nome: string;
  email: string;
  telefone?: string | null;
  empresa?: string | null;
  interesse: string;
  mensagem: string;
};

export type ContatoPublicoResponse = {
  mensagem: string;
};

export type CreateSuporteSolicitacaoInput = {
  assunto: string;
  mensagem: string;
};

export type SuporteSolicitacaoResponse = {
  id: string;
  assunto: string;
  status: string;
  createdAt: string;
};
