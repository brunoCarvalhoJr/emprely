export type PropostaItemInput = {
  servicoId: string | null;
  nome: string;
  descricao: string | null;
  quantidade: number;
  valorUnitario: number;
};

export type CreatePropostaInput = {
  clienteId: string;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  validadeDias: number | null;
  itens: PropostaItemInput[];
};

export type UpdatePropostaInput = CreatePropostaInput;

export type PropostaItemResponse = {
  id: string;
  servicoId: string | null;
  nome: string;
  descricao: string | null;
  quantidade: number;
  valorUnitario: number;
  total: number;
  ordem: number;
};

export type PropostaResponse = {
  id: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  validadeDias: number | null;
  status: string;
  total: number;
  itens: PropostaItemResponse[];
  createdAt: string;
  updatedAt: string | null;
};
