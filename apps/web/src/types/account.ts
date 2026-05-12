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
  logoUrl: string | null;
  updatedAt: string | null;
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
  logoUrl: string | null;
};
