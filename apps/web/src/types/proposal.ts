export type PropostaItemInput = {
  servicoId: string | null;
  nome: string;
  descricao: string | null;
  quantidade: number;
  valorUnitario: number;
};

export type PropostaTemplateVisual =
  | "PadraoEnxuto"
  | "ComercialMinimalista"
  | "OrcamentoSimplificado"
  | "PropostaCompleta"
  | "LunaSocialStudio"
  | "DarkGrowth"
  | "InstagramPremium"
  | "Claymorphism"
  | "Emprely"
  | "ExecutivoEditorial"
  | "CorporativoBoard"
  | "InstitucionalClean";

export type CreatePropostaInput = {
  clienteId: string;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  validadeDias: number | null;
  itens: PropostaItemInput[];
  templateVisual: PropostaTemplateVisual;
  descontoValor: number;
  condicoesPagamento: string | null;
  itensInclusos: string[] | null;
  itensNaoInclusos: string[] | null;
  cronograma: string[] | null;
  beneficios: string[] | null;
};

export type UpdatePropostaInput = CreatePropostaInput;

export type PropostaStatus =
  | "Rascunho"
  | "Gerada"
  | "Enviada"
  | "Aceita"
  | "Recusada"
  | "Arquivada";

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
  numero: number;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  introducao: string | null;
  observacoes: string | null;
  validadeDias: number | null;
  status: PropostaStatus;
  templateVisual: PropostaTemplateVisual;
  subtotal: number;
  descontoValor: number;
  condicoesPagamento: string | null;
  itensInclusos: string[];
  itensNaoInclusos: string[];
  cronograma: string[];
  beneficios: string[];
  total: number;
  itens: PropostaItemResponse[];
  createdAt: string;
  updatedAt: string | null;
};
