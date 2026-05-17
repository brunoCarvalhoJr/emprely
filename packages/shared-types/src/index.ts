export type PlanoAssinatura = "trial" | "founder" | "pro";

export type StatusProposta =
  | "draft"
  | "previewed"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "canceled";

export type TemplateVisualProposta =
  | "PadraoEnxuto"
  | "ComercialMinimalista"
  | "OrcamentoSimplificado"
  | "PropostaCompleta"
  | "DarkGrowth"
  | "InstagramPremium";

export type ExportFormatoProposta = "pdf" | "png";

export type CompartilhamentoPropostaMobile = {
  mensagem: string;
  formato: ExportFormatoProposta;
  templateVisual: TemplateVisualProposta;
};
