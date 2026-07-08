export type BillingMetodoPagamentoResponse = {
  codigo: "Pix" | "CartaoCredito" | string;
  nome: string;
  descricao: string;
  ativo?: boolean;
};

export type BillingPlanoResponse = {
  codigo: string;
  nome: string;
  descricao: string;
  ciclo: "Mensal" | "Anual" | string;
  periodicidade: string;
  preco: number;
  precoMensal: number;
  moeda: string;
  ativo: boolean;
  metodosPagamento: BillingMetodoPagamentoResponse[];
};

export type BillingEntitlementsResponse = {
  canGenerateProposta: boolean;
  canExportProposta: boolean;
  canSharePropostaWhatsapp: boolean;
  canRemoveWatermark: boolean;
};

export type BillingStatusResponse = {
  plano: string;
  statusComercial: string;
  statusAssinatura: string | null;
  metodoPagamento: string | null;
  ciclo: string | null;
  valor: number | null;
  moeda: string;
  trialEndsAt: string;
  trialDiasRestantes: number;
  periodoAtualFim: string | null;
  proximaCobranca: string | null;
  cancelAtPeriodEnd: boolean;
  entitlements: BillingEntitlementsResponse;
  pagamentoAtual: BillingPagamentoAtualResponse | null;
  historicoPagamentos: BillingPagamentoHistoricoResponse[];
  ctaRecomendado: string;
  mensagem: string;
};

export type BillingPagamentoAtualResponse = {
  id: string;
  status: string;
  metodoPagamento: string;
  ciclo: string;
  valor: number;
  valorReembolsado: number;
  invoiceUrl: string | null;
  dueDate: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type BillingPagamentoHistoricoResponse = BillingPagamentoAtualResponse & {
  refundedAt: string | null;
};

export type CreateBillingCheckoutInput = {
  planoCodigo: string;
  metodoPagamento: string;
  ciclo: string;
  pagador: BillingPagadorInput;
};

export type BillingPagadorInput = {
  tipoPessoa: "Fisica" | "Juridica";
  nome: string;
  cpfCnpj: string;
  email?: string | null;
  telefone?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
};

export type BillingCheckoutResponse = {
  checkoutId: string;
  providerCheckoutId: string;
  checkoutUrl: string;
  expiresAt: string | null;
  status: string;
  planoCodigo: string;
  ciclo: string;
  valor: number;
  metodoPagamento: string;
};

export type PublicBillingPaymentLinkResponse = {
  contaNome: string;
  expiresAt: string;
  status: BillingStatusResponse;
  planos: BillingPlanoResponse[];
};
