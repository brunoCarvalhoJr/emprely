export type OnboardingStatus =
  | "NaoIniciado"
  | "EmAndamento"
  | "Pulado"
  | "Concluido";

export type OnboardingJornadaResponse = {
  status: OnboardingStatus;
  etapaAtual: string;
  concluidoPorDados: boolean;
  iniciadaAt: string | null;
  puladaAt: string | null;
  concluidaAt: string | null;
};

export type OnboardingResponse = {
  id: string | null;
  contaId: string;
  usuarioId: string;
  configuracaoConta: OnboardingJornadaResponse;
  primeiraProposta: OnboardingJornadaResponse;
  tour: OnboardingJornadaResponse;
  propostaRascunhoId: string | null;
  deveAbrirAutomaticamente: boolean;
  deveLembrarAposPular: boolean;
  updatedAt: string | null;
};

export type UpdateOnboardingInput = {
  statusConfiguracaoConta?: OnboardingStatus | null;
  etapaConfiguracaoConta?: string | null;
  statusPrimeiraProposta?: OnboardingStatus | null;
  etapaPrimeiraProposta?: string | null;
  propostaRascunhoId?: string | null;
  statusTour?: OnboardingStatus | null;
};

export type CreateOnboardingEventoInput = {
  tipo:
    | "Iniciou"
    | "Pulou"
    | "ConcluiuConta"
    | "ConcluiuPrimeiraProposta"
    | "TourExibido"
    | "TourPulou"
    | "TourConcluiu";
  etapa?: string | null;
  propostaId?: string | null;
};
