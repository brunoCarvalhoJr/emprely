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
};

export type AuthUsuarioResponse = {
  accessToken: string;
  expiresAtUtc: string;
  usuario: UsuarioAtualResponse;
  conta: ContaAtualResponse;
};

export type MeUsuarioResponse = {
  usuario: UsuarioAtualResponse;
  conta: ContaAtualResponse;
};

export type RegisterUsuarioInput = {
  nome: string;
  email: string;
  senha: string;
  nomeConta: string;
};

export type LoginUsuarioInput = {
  email: string;
  senha: string;
};
