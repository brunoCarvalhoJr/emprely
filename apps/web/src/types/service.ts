export type UnidadeServico =
  | "Unico"
  | "Mensal"
  | "Semanal"
  | "Diario"
  | "PorHora"
  | "PorItem";

export type TipoServico = "Servico" | "Pacote";

export type ServicoResponse = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  preco: number;
  unidade: UnidadeServico;
  tipo: TipoServico;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateServicoInput = {
  nome: string;
  descricao: string | null;
  categoria: string | null;
  preco: number;
  unidade: UnidadeServico;
  tipo: TipoServico;
};

export type UpdateServicoInput = CreateServicoInput;
