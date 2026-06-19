export type PerfilContaResponse = {
  id: string | null;
  contaId: string;
  nomeComercial: string;
  emailContato: string | null;
  telefoneContato: string | null;
  siteUrl: string | null;
  instagram: string | null;
  documento: string | null;
  corPrimaria: string;
  corSecundaria: string;
  corSistemaPrimaria: string;
  corSistemaSecundaria: string;
  logoUrl: string | null;
  templateVisualPadrao: string;
  formatoArquivoPreferido: string;
  updatedAt: string | null;
};

export type LogoPerfilUploadResponse = {
  logoUrl: string;
  tamanhoOriginalBytes: number;
  largura: number;
  altura: number;
};

export type UpdatePerfilContaInput = {
  nomeComercial: string;
  emailContato: string | null;
  telefoneContato: string | null;
  siteUrl: string | null;
  instagram: string | null;
  documento: string | null;
  corPrimaria: string;
  corSecundaria: string;
  corSistemaPrimaria: string;
  corSistemaSecundaria: string;
  logoUrl: string | null;
  templateVisualPadrao: string;
  formatoArquivoPreferido: string;
};
