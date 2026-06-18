export type UsuarioAtualResponse = {
  id: string;
  nome: string;
  email: string;
};

export type ContaAtualResponse = {
  id: string;
  nome: string;
  slug: string;
  papel: string;
  plano: "Trial" | "Fundador" | string;
  statusComercial: "TrialAtivo" | "TrialExpirado" | "FundadorAtivo" | string;
  trialEndsAt: string;
  trialDiasRestantes: number;
  planoFundadorAtivadoAt: string | null;
  planoFundadorPrecoMensal: number;
};

export type AuthUsuarioResponse = {
  accessToken: string;
  expiresAtUtc: string;
  usuario: UsuarioAtualResponse;
  conta: ContaAtualResponse;
};

export type RegisterUsuarioResponse = {
  usuarioId: string;
  email: string;
  emailConfirmationRequired: boolean;
  message: string;
};

export type MeUsuarioResponse = {
  usuario: UsuarioAtualResponse;
  conta: ContaAtualResponse;
};

export type RegisterUsuarioInput = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  nomeConta: string;
};

export type LoginUsuarioInput = {
  email: string;
  senha: string;
};

export type ChangeSenhaUsuarioInput = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

export type EmailUsuarioInput = {
  email: string;
};

export type ResetSenhaUsuarioInput = {
  usuarioId: string;
  token: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

export type ChangeEmailUsuarioInput = {
  novoEmail: string;
};
