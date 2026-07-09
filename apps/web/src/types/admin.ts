export type AdminEmailHistoricoResponse = {
  id: string;
  contaId: string | null;
  usuarioId: string | null;
  tipo: string;
  destinatario: string;
  status: string;
  providerMessageId: string | null;
  erro: string | null;
  createdAt: string;
};

export type AdminResendConfirmacaoEmailInput = {
  email: string;
};

export type AdminAtualResponse = {
  id: string;
  nome: string;
  email: string;
  perfil: "SuperAdmin" | "Suporte" | string;
  isOwner: boolean;
};

export type AdminLoginResponse = {
  accessToken: string;
  expiresAtUtc: string;
  admin: AdminAtualResponse;
};

export type AdminLoginInput = {
  email: string;
  senha: string;
};

export type AdminAlterarSenhaPropriaInput = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

export type AdminPainelAdminResponse = {
  id: string;
  nome: string;
  email: string;
  perfil: "SuperAdmin" | "Suporte" | string;
  status: "Ativo" | "Bloqueado" | string;
  ultimoLoginAt: string | null;
  createdAt: string;
};

export type AdminCriarAdminInput = {
  nome: string;
  email: string;
  senha: string;
  perfil: "SuperAdmin" | "Suporte";
  motivo: string;
};

export type AdminAlterarPerfilAdminInput = {
  perfil: "SuperAdmin" | "Suporte";
  motivo: string;
};

export type AdminUsuariosMetricasResponse = {
  totalUsuarios: number;
  trialsAtivos: number;
  fundadores: number;
  contasSuspensas: number;
  usuariosBloqueados: number;
  usuariosSemConta: number;
};

export type AdminUsuarioResumoResponse = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  emailConfirmado: boolean;
  bloqueado: boolean;
  contaId: string | null;
  contaNome: string | null;
  papelConta: string | null;
  plano: string | null;
  statusComercial: string | null;
  statusConta: string | null;
  trialEndsAt: string | null;
  diasGratisAtivo: boolean;
  ultimoEmailEnviadoAt: string | null;
  createdAt: string;
};

export type AdminAuditoriaResponse = {
  id: string;
  adminUsuarioId: string;
  adminEmail: string;
  adminPerfil: string;
  acao: string;
  alvoTipo: string;
  alvoId: string | null;
  motivo: string | null;
  detalhes: string | null;
  ip: string | null;
  userAgent: string | null;
  resultado: string;
  createdAt: string;
};

export type AdminUsuarioDetalheResponse = {
  usuario: AdminUsuarioResumoResponse;
  emails: AdminEmailHistoricoResponse[];
  auditoria: AdminAuditoriaResponse[];
};

export type AdminUsuariosPainelResponse = {
  metricas: AdminUsuariosMetricasResponse;
  usuarios: AdminUsuarioResumoResponse[];
  total: number;
};

export type AdminUsuariosFiltros = {
  busca?: string;
  plano?: string;
  statusComercial?: string;
  statusConta?: string;
  papelConta?: string;
  emailConfirmado?: string;
  bloqueado?: string;
  semConta?: string;
  trialAtivo?: string;
  trialExpirado?: string;
  diasGratisAtivo?: string;
  criadoDe?: string;
  criadoAte?: string;
  ultimoEmailDe?: string;
  ultimoEmailAte?: string;
  page?: number;
  pageSize?: number;
};

export type AdminCriarUsuarioInput = {
  nome: string;
  email: string;
  telefone: string | null;
  senhaTemporaria: string;
  emailConfirmadoPeloAdmin: boolean;
  enviarLinkConfirmacao: boolean;
  criarConta: boolean;
  nomeConta: string | null;
  planoInicial: string | null;
  motivo: string;
};

export type AdminCriarContaInput = {
  nomeConta: string;
  usuarioOwnerId: string;
  planoInicial: "Trial" | "Fundador";
  motivo: string;
};

export type AdminContaCriadaResponse = {
  contaId: string;
  usuarioOwnerId: string;
  nomeConta: string;
  plano: string;
  statusComercial: string;
};

export type AdminMotivoInput = {
  motivo: string;
};

export type AdminAlterarPlanoContaInput = {
  plano: "Trial" | "Fundador";
  motivo: string;
  enviarEmail: boolean;
};

export type AdminDiasGratisContaInput = {
  inicioAt: string;
  fimAt: string;
  motivo: string;
};

export type AdminDiasGratisLoteInput = {
  contaIds: string[];
  inicioAt: string;
  fimAt: string;
  motivo: string;
};

export type AdminSuspenderContaInput = {
  motivo: string;
  enviarEmail: boolean;
};

export type AdminEmailAnexoInput = {
  nomeArquivo: string;
  contentType: string;
  conteudoBase64: string;
};

export type AdminEmailPersonalizadoInput = {
  usuarioIds: string[];
  assunto: string;
  html: string;
  anexos: AdminEmailAnexoInput[];
  motivo: string;
};
