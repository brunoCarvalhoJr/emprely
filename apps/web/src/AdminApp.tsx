import {
  Ban,
  CheckCircle2,
  Download,
  Edit3,
  KeyRound,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Unlock,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  adminAlterarSenhaPropria,
  adminAlterarPerfilAdmin,
  adminAlterarPlanoConta,
  adminBloquearAdmin,
  adminBloquearUsuario,
  adminCriarConta,
  adminCriarAdmin,
  adminCriarDiasGratisConta,
  adminCriarDiasGratisLote,
  adminCriarUsuario,
  adminDesbloquearAdmin,
  adminDesbloquearUsuario,
  adminDownloadUsuariosCsv,
  adminEnviarEmailPersonalizado,
  adminResendConfirmacaoEmailPainel,
  adminLogin,
  adminReativarConta,
  adminResetarTourUsuario,
  adminSuspenderConta,
  getAdminEmailsHistoricoPainel,
  getAdminAdmins,
  getAdminUsuarioDetalhe,
  getAdminUsuarios,
} from "@/lib/api";
import type {
  AdminAtualResponse,
  AdminEmailAnexoInput,
  AdminEmailHistoricoResponse,
  AdminPainelAdminResponse,
  AdminResendConfirmacaoEmailInput,
  AdminUsuarioDetalheResponse,
  AdminLoginResponse,
  AdminUsuarioResumoResponse,
  AdminUsuariosFiltros,
} from "@/types/admin";

const adminTokenStorageKey = "emprely-admin-token";
const adminAtualStorageKey = "emprely-admin-atual";

type ActionMode =
  | "criarUsuario"
  | "criarConta"
  | "plano"
  | "diasGratis"
  | "diasGratisLote"
  | "suspender"
  | "reativar"
  | "bloquear"
  | "desbloquear"
  | "resetTour"
  | "email";

type ActionState = {
  mode: ActionMode;
  usuario?: AdminUsuarioResumoResponse;
};

type LoginForm = {
  email: string;
  senha: string;
};

type AlterarSenhaAdminForm = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

type CriarUsuarioForm = {
  nome: string;
  email: string;
  telefone: string;
  senhaTemporaria: string;
  emailConfirmadoPeloAdmin: boolean;
  enviarLinkConfirmacao: boolean;
  criarConta: boolean;
  nomeConta: string;
  planoInicial: "Trial" | "Fundador";
  motivo: string;
};

type PlanoForm = {
  plano: "Trial" | "Fundador";
  motivo: string;
  enviarEmail: boolean;
};

type DiasGratisForm = {
  inicioAt: string;
  fimAt: string;
  motivo: string;
};

type CriarContaForm = {
  nomeConta: string;
  planoInicial: "Trial" | "Fundador";
  motivo: string;
};

type MotivoForm = {
  motivo: string;
  enviarEmail: boolean;
};

type EmailForm = {
  assunto: string;
  html: string;
  motivo: string;
  anexos: AdminEmailAnexoInput[];
};

type AdminResendConfirmacaoForm = {
  email: string;
};

type CriarAdminForm = {
  nome: string;
  email: string;
  senha: string;
  perfil: "SuperAdmin" | "Suporte";
  motivo: string;
};

type FieldErrors = Record<string, string>;

const initialLoginForm: LoginForm = {
  email: "",
  senha: "",
};

const initialAlterarSenhaAdminForm: AlterarSenhaAdminForm = {
  senhaAtual: "",
  novaSenha: "",
  confirmarNovaSenha: "",
};

const initialCriarUsuarioForm: CriarUsuarioForm = {
  nome: "",
  email: "",
  telefone: "",
  senhaTemporaria: "",
  emailConfirmadoPeloAdmin: true,
  enviarLinkConfirmacao: false,
  criarConta: false,
  nomeConta: "",
  planoInicial: "Trial",
  motivo: "",
};

const initialPlanoForm: PlanoForm = {
  plano: "Trial",
  motivo: "",
  enviarEmail: false,
};

const initialDiasGratisForm: DiasGratisForm = {
  inicioAt: "",
  fimAt: "",
  motivo: "",
};

const initialCriarContaForm: CriarContaForm = {
  nomeConta: "",
  planoInicial: "Trial",
  motivo: "",
};

const initialMotivoForm: MotivoForm = {
  motivo: "",
  enviarEmail: true,
};

const initialEmailForm: EmailForm = {
  assunto: "",
  html: "<p>Olá,</p><p></p>",
  motivo: "",
  anexos: [],
};

const initialAdminResendConfirmacaoForm: AdminResendConfirmacaoForm = {
  email: "",
};

const initialCriarAdminForm: CriarAdminForm = {
  nome: "",
  email: "",
  senha: "",
  perfil: "Suporte",
  motivo: "",
};

function isSuperAdmin(admin: AdminAtualResponse | null) {
  return admin?.perfil === "SuperAdmin";
}

export default function AdminApp() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(adminTokenStorageKey) ?? "");
  const [adminAtual, setAdminAtual] = useState<AdminAtualResponse | null>(() => {
    const raw = localStorage.getItem(adminAtualStorageKey);
    return raw ? (JSON.parse(raw) as AdminAtualResponse) : null;
  });
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [loginFieldErrors, setLoginFieldErrors] = useState<FieldErrors>({});
  const [loginErro, setLoginErro] = useState<string | null>(null);
  const [alterarSenhaForm, setAlterarSenhaForm] = useState<AlterarSenhaAdminForm>(
    initialAlterarSenhaAdminForm,
  );
  const [alterarSenhaErrors, setAlterarSenhaErrors] = useState<FieldErrors>({});
  const [alterarSenhaMensagem, setAlterarSenhaMensagem] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<AdminUsuariosFiltros>({
    page: 1,
    pageSize: 25,
  });
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState | null>(null);
  const [adminResendConfirmacaoForm, setAdminResendConfirmacaoForm] =
    useState<AdminResendConfirmacaoForm>(initialAdminResendConfirmacaoForm);

  const painelQuery = useQuery({
    queryKey: ["admin-usuarios", filtros, token],
    queryFn: () => getAdminUsuarios(filtros, token),
    enabled: Boolean(token),
  });

  const detalheQuery = useQuery({
    queryKey: ["admin-usuario-detalhe", selectedUsuarioId, token],
    queryFn: () => getAdminUsuarioDetalhe(selectedUsuarioId!, token),
    enabled: Boolean(token) && Boolean(selectedUsuarioId),
  });

  const adminsQuery = useQuery({
    queryKey: ["admin-admins", token],
    queryFn: () => getAdminAdmins(token),
    enabled: Boolean(token) && isSuperAdmin(adminAtual),
  });

  const adminEmailsQuery = useQuery({
    queryKey: ["admin-emails-painel", token],
    queryFn: () => getAdminEmailsHistoricoPainel(token),
    enabled: Boolean(token) && isSuperAdmin(adminAtual),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: () => adminLogin({ email: loginForm.email, senha: loginForm.senha }),
    onSuccess: (response: AdminLoginResponse) => {
      setToken(response.accessToken);
      setAdminAtual(response.admin);
      localStorage.setItem(adminTokenStorageKey, response.accessToken);
      localStorage.setItem(adminAtualStorageKey, JSON.stringify(response.admin));
      setLoginErro(null);
    },
    onError: (error: Error) => setLoginErro(error.message),
  });

  const logout = () => {
    setToken("");
    setAdminAtual(null);
    localStorage.removeItem(adminTokenStorageKey);
    localStorage.removeItem(adminAtualStorageKey);
  };

  const adminResendConfirmacaoMutation = useMutation({
    mutationFn: (input: AdminResendConfirmacaoEmailInput) =>
      adminResendConfirmacaoEmailPainel(input, token),
    onSuccess: async () => {
      setAdminResendConfirmacaoForm(initialAdminResendConfirmacaoForm);
      await queryClient.invalidateQueries({ queryKey: ["admin-emails-painel"] });
    },
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: () => adminAlterarSenhaPropria(alterarSenhaForm, token),
    onSuccess: () => {
      setAlterarSenhaForm(initialAlterarSenhaAdminForm);
      setAlterarSenhaErrors({});
      setAlterarSenhaMensagem("Senha administrativa alterada.");
    },
    onError: (error: Error) => setAlterarSenhaMensagem(error.message),
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-usuarios"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-usuario-detalhe"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-emails-painel"] });
  };

  if (!token || !adminAtual) {
    return (
      <AdminShell>
        <section className="mx-auto mt-16 w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-white">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Painel administrativo</p>
              <h1 className="text-xl font-semibold text-slate-950">Emprely Admin</h1>
            </div>
          </div>
          <form
            className="space-y-4"
            autoComplete="on"
            onSubmit={(event) => {
              event.preventDefault();
              const fieldErrors = validateLoginForm(loginForm);
              setLoginFieldErrors(fieldErrors);
              if (hasFieldErrors(fieldErrors)) {
                setLoginErro("Revise os campos destacados.");
                return;
              }

              setLoginErro(null);
              loginMutation.mutate();
            }}
          >
            <LabeledInput
              label="E-mail admin"
              type="email"
              value={loginForm.email}
              onChange={(value) => {
                setLoginForm((form) => ({ ...form, email: value }));
                setLoginFieldErrors((errors) => clearFieldError(errors, "email"));
              }}
              error={loginFieldErrors.email}
              autoComplete="username"
              name="admin-login-email"
            />
            <LabeledInput
              label="Senha"
              type="password"
              value={loginForm.senha}
              onChange={(value) => {
                setLoginForm((form) => ({ ...form, senha: value }));
                setLoginFieldErrors((errors) => clearFieldError(errors, "senha"));
              }}
              error={loginFieldErrors.senha}
              autoComplete="current-password"
              name="admin-login-password"
            />
            {loginErro ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{loginErro}</p> : null}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              <KeyRound size={16} aria-hidden="true" />
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </AdminShell>
    );
  }

  const usuarios = painelQuery.data?.usuarios ?? [];
  const selectedUsuario = detalheQuery.data?.usuario ?? usuarios.find((usuario) => usuario.id === selectedUsuarioId);

  return (
    <AdminShell>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Emprely Admin</p>
            <h1 className="text-2xl font-semibold text-slate-950">Usuários, planos e acesso</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
              {adminAtual.email} · {adminAtual.perfil}
            </span>
            <button className="admin-button-secondary" type="button" onClick={() => void refresh()}>
              <RefreshCw size={16} aria-hidden="true" />
              Atualizar
            </button>
            <button className="admin-button-secondary" type="button" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-5 py-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          <MetricasGrid metricas={painelQuery.data?.metricas} />
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4">
              <FiltrosUsuarios filtros={filtros} onChange={setFiltros} />
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  className="admin-button-primary"
                  onClick={() => setAction({ mode: "criarUsuario" })}
                >
                  <Plus size={16} aria-hidden="true" />
                  Criar usuário
                </button>
                <button
                  type="button"
                  className="admin-button-secondary"
                  onClick={() => setAction({ mode: "diasGratisLote" })}
                >
                  <UsersRound size={16} aria-hidden="true" />
                  Dias em lote
                </button>
                <button
                  type="button"
                  className="admin-button-secondary"
                  onClick={() => setAction({ mode: "email" })}
                >
                  <Mail size={16} aria-hidden="true" />
                  Email em lote
                </button>
                <button
                  type="button"
                  className="admin-button-secondary"
                  onClick={() => void baixarCsv(token, filtros)}
                >
                  <Download size={16} aria-hidden="true" />
                  CSV
                </button>
              </div>
            </div>
          </div>
          <UsuariosTabela
            usuarios={usuarios}
            selectedUsuarioId={selectedUsuarioId}
            isLoading={painelQuery.isLoading}
            error={painelQuery.error}
            onSelect={setSelectedUsuarioId}
          />
          <AdminSegurancaPanel
            adminAtual={adminAtual}
            form={alterarSenhaForm}
            errors={alterarSenhaErrors}
            mensagem={alterarSenhaMensagem}
            isPending={alterarSenhaMutation.isPending}
            onChange={(patch) => {
              setAlterarSenhaForm((form) => ({ ...form, ...patch }));
              setAlterarSenhaMensagem(null);
              setAlterarSenhaErrors((errors) =>
                Object.keys(patch).reduce(
                  (acc, key) => clearFieldError(acc, key),
                  errors,
                ),
              );
            }}
            onSubmit={() => {
              const fieldErrors = validateAlterarSenhaAdminForm(alterarSenhaForm);
              setAlterarSenhaErrors(fieldErrors);
              if (hasFieldErrors(fieldErrors)) {
                setAlterarSenhaMensagem("Revise os campos destacados.");
                return;
              }

              setAlterarSenhaMensagem(null);
              alterarSenhaMutation.mutate();
            }}
          />
          {isSuperAdmin(adminAtual) ? (
            <>
              <AdminsPanel
                admins={adminsQuery.data ?? []}
                token={token}
                adminAtual={adminAtual}
                isLoading={adminsQuery.isLoading}
                error={adminsQuery.error}
                onDone={() => {
                  void queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
                }}
              />
              <AdminEmailsPanel
                form={adminResendConfirmacaoForm}
                emails={adminEmailsQuery.data ?? []}
                isLoading={adminEmailsQuery.isLoading}
                isFetching={adminEmailsQuery.isFetching}
                error={adminEmailsQuery.error}
                resendError={adminResendConfirmacaoMutation.error}
                isResending={adminResendConfirmacaoMutation.isPending}
                onChangeForm={setAdminResendConfirmacaoForm}
                onRefresh={() => void adminEmailsQuery.refetch()}
                onSubmit={() =>
                  adminResendConfirmacaoMutation.mutate({
                    email: adminResendConfirmacaoForm.email.trim(),
                  })
                }
              />
            </>
          ) : null}
        </section>

        <UsuarioDetalhePanel
          usuario={selectedUsuario}
          detalhe={detalheQuery.data}
          adminAtual={adminAtual}
          onAction={(mode, usuario) => setAction({ mode, usuario })}
        />
      </main>
      {action ? (
        <ActionModal
          action={action}
          token={token}
          usuarios={usuarios}
          adminAtual={adminAtual}
          onClose={() => setAction(null)}
          onDone={() => {
            setAction(null);
            void refresh();
          }}
        />
      ) : null}
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-950">{children}</div>;
}

function AdminSegurancaPanel({
  adminAtual,
  form,
  errors,
  mensagem,
  isPending,
  onChange,
  onSubmit,
}: {
  adminAtual: AdminAtualResponse;
  form: AlterarSenhaAdminForm;
  errors: FieldErrors;
  mensagem: string | null;
  isPending: boolean;
  onChange: (patch: Partial<AlterarSenhaAdminForm>) => void;
  onSubmit: () => void;
}) {
  const isErro = Boolean(mensagem) && mensagem !== "Senha administrativa alterada.";

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-slate-500">Seguranca da conta</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Alterar minha senha</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use este formulario para substituir a senha do admin logado. A senha nao fica salva no navegador.
          </p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <InfoLine label="Admin" value={adminAtual.email} />
            <InfoLine label="Perfil" value={adminAtual.perfil} />
          </div>
        </div>
        <form
          className="grid w-full gap-3 lg:max-w-lg"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <LabeledInput
              label="Senha atual"
              type="password"
              value={form.senhaAtual}
              onChange={(senhaAtual) => onChange({ senhaAtual })}
              error={errors.senhaAtual}
              autoComplete="current-password"
              name="admin-senha-atual"
            />
            <LabeledInput
              label="Nova senha"
              type="password"
              value={form.novaSenha}
              onChange={(novaSenha) => onChange({ novaSenha })}
              error={errors.novaSenha}
              autoComplete="new-password"
              name="admin-nova-senha"
            />
            <LabeledInput
              label="Confirmar senha"
              type="password"
              value={form.confirmarNovaSenha}
              onChange={(confirmarNovaSenha) => onChange({ confirmarNovaSenha })}
              error={errors.confirmarNovaSenha}
              autoComplete="new-password"
              name="admin-confirmar-nova-senha"
            />
          </div>
          {mensagem ? (
            <p className={`rounded-md p-3 text-sm ${isErro ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensagem}
            </p>
          ) : null}
          <button className="admin-button-primary w-full sm:w-fit" type="submit" disabled={isPending}>
            <Lock size={16} aria-hidden="true" />
            {isPending ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </section>
  );
}

function MetricasGrid({ metricas }: { metricas?: { [key: string]: number } }) {
  const itens = [
    ["Usuários", metricas?.totalUsuarios ?? 0],
    ["Trials ativos", metricas?.trialsAtivos ?? 0],
    ["Fundadores", metricas?.fundadores ?? 0],
    ["Suspensas", metricas?.contasSuspensas ?? 0],
    ["Bloqueados", metricas?.usuariosBloqueados ?? 0],
    ["Sem conta", metricas?.usuariosSemConta ?? 0],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {itens.map(([label, value]) => (
        <div key={label} className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function FiltrosUsuarios({
  filtros,
  onChange,
}: {
  filtros: AdminUsuariosFiltros;
  onChange: (filtros: AdminUsuariosFiltros) => void;
}) {
  const [mostrarAvancados, setMostrarAvancados] = useState(false);
  const update = (patch: AdminUsuariosFiltros) => onChange({ ...filtros, ...patch, page: 1 });

  return (
    <div className="min-w-0 flex-1 space-y-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(260px,2fr)_repeat(4,minmax(135px,1fr))]">
        <label className="admin-field lg:col-span-2">
          <span>Busca</span>
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} aria-hidden="true" />
            <input
              className="admin-input pl-9"
              value={filtros.busca ?? ""}
              onChange={(event) => update({ busca: event.target.value })}
              placeholder="Nome, email, telefone ou conta"
            />
          </div>
        </label>
        <SelectField label="Plano" value={filtros.plano ?? ""} onChange={(plano) => update({ plano })} options={["", "Trial", "Fundador"]} />
        <SelectField label="Comercial" value={filtros.statusComercial ?? ""} onChange={(statusComercial) => update({ statusComercial })} options={["", "TrialAtivo", "TrialExpirado", "FundadorAtivo"]} />
        <SelectField label="Conta" value={filtros.statusConta ?? ""} onChange={(statusConta) => update({ statusConta })} options={["", "Ativa", "Suspensa", "Cancelada"]} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => setMostrarAvancados((valor) => !valor)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {mostrarAvancados ? "Ocultar filtros" : "Filtros avançados"}
        </button>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>Use busca para nome, email, telefone ou conta.</span>
        </div>
      </div>

      {mostrarAvancados ? (
        <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <SelectField label="Papel" value={filtros.papelConta ?? ""} onChange={(papelConta) => update({ papelConta })} options={["", "Owner", "Member"]} />
          <SelectField label="Email" value={filtros.emailConfirmado ?? ""} onChange={(emailConfirmado) => update({ emailConfirmado })} options={["", "true", "false"]} />
          <SelectField label="Acesso" value={filtros.bloqueado ?? ""} onChange={(bloqueado) => update({ bloqueado })} options={["", "true", "false"]} />
          <SelectField label="Sem conta" value={filtros.semConta ?? ""} onChange={(semConta) => update({ semConta })} options={["", "true", "false"]} />
          <SelectField label="Trial ativo" value={filtros.trialAtivo ?? ""} onChange={(trialAtivo) => update({ trialAtivo })} options={["", "true", "false"]} />
          <SelectField label="Trial expirado" value={filtros.trialExpirado ?? ""} onChange={(trialExpirado) => update({ trialExpirado })} options={["", "true", "false"]} />
          <SelectField label="Dias grátis" value={filtros.diasGratisAtivo ?? ""} onChange={(diasGratisAtivo) => update({ diasGratisAtivo })} options={["", "true", "false"]} />
          <LabeledInput label="Criado de" type="date" value={filtros.criadoDe ?? ""} onChange={(criadoDe) => update({ criadoDe })} />
          <LabeledInput label="Criado até" type="date" value={filtros.criadoAte ?? ""} onChange={(criadoAte) => update({ criadoAte })} />
          <LabeledInput label="Email de" type="date" value={filtros.ultimoEmailDe ?? ""} onChange={(ultimoEmailDe) => update({ ultimoEmailDe })} />
          <LabeledInput label="Email até" type="date" value={filtros.ultimoEmailAte ?? ""} onChange={(ultimoEmailAte) => update({ ultimoEmailAte })} />
        </div>
      ) : null}
    </div>
  );
}

function UsuariosTabela({
  usuarios,
  selectedUsuarioId,
  isLoading,
  error,
  onSelect,
}: {
  usuarios: AdminUsuarioResumoResponse[];
  selectedUsuarioId: string | null;
  isLoading: boolean;
  error: Error | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Usuário</th>
            <th className="px-4 py-3">Conta</th>
            <th className="px-4 py-3">Plano</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Acesso</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                Carregando...
              </td>
            </tr>
          ) : null}
          {!isLoading && error ? (
            <tr>
              <td className="px-4 py-8 text-center text-red-700" colSpan={5}>
                Não foi possível carregar os usuários. {error.message}
              </td>
            </tr>
          ) : null}
          {!isLoading && !error && usuarios.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                Nenhum usuário encontrado. Revise os filtros ou atualize o painel.
              </td>
            </tr>
          ) : null}
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              onClick={() => onSelect(usuario.id)}
              className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 ${selectedUsuarioId === usuario.id ? "bg-blue-50" : ""}`}
            >
              <td className="px-4 py-3">
                <strong className="block text-slate-950">{usuario.nome}</strong>
                <span className="text-slate-500">{usuario.email}</span>
              </td>
              <td className="px-4 py-3">{usuario.contaNome ?? "Sem conta"}</td>
              <td className="px-4 py-3">{usuario.plano ?? "-"}</td>
              <td className="px-4 py-3">{usuario.statusComercial ?? "-"}</td>
              <td className="px-4 py-3">
                <StatusBadge usuario={usuario} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminsPanel({
  admins,
  token,
  adminAtual,
  isLoading,
  error,
  onDone,
}: {
  admins: AdminPainelAdminResponse[];
  token: string;
  adminAtual: AdminAtualResponse;
  isLoading: boolean;
  error: Error | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState<CriarAdminForm>(initialCriarAdminForm);
  const [motivos, setMotivos] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);

  const criarMutation = useMutation({
    mutationFn: () => adminCriarAdmin(form, token),
    onSuccess: () => {
      setForm(initialCriarAdminForm);
      setErro(null);
      onDone();
    },
    onError: (error: Error) => setErro(error.message),
  });

  const acaoMutation = useMutation({
    mutationFn: async ({
      admin,
      acao,
      perfil,
    }: {
      admin: AdminPainelAdminResponse;
      acao: "bloquear" | "desbloquear" | "perfil";
      perfil?: "SuperAdmin" | "Suporte";
    }) => {
      const motivo = motivos[admin.id]?.trim() ?? "";
      if (!motivo) {
        throw new Error("Informe o motivo da ação administrativa.");
      }

      if (acao === "perfil" && perfil) {
        await adminAlterarPerfilAdmin(admin.id, { perfil, motivo }, token);
        return;
      }

      if (acao === "bloquear") {
        await adminBloquearAdmin(admin.id, { motivo }, token);
        return;
      }

      await adminDesbloquearAdmin(admin.id, { motivo }, token);
    },
    onSuccess: () => {
      setMotivos({});
      setErro(null);
      onDone();
    },
    onError: (error: Error) => setErro(error.message),
  });

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-500">Administradores</p>
        <h2 className="text-lg font-semibold text-slate-950">Acesso interno</h2>
      </div>

      <form
        className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          criarMutation.mutate();
        }}
      >
        <LabeledInput label="Nome" value={form.nome} onChange={(nome) => setForm({ ...form, nome })} autoComplete="off" name="novo-admin-nome" />
        <LabeledInput label="E-mail" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} autoComplete="off" name="novo-admin-email" />
        <LabeledInput label="Senha" type="password" value={form.senha} onChange={(senha) => setForm({ ...form, senha })} autoComplete="new-password" name="novo-admin-senha" />
        <SelectField
          label="Perfil"
          value={form.perfil}
          onChange={(perfil) => setForm({ ...form, perfil: perfil as "SuperAdmin" | "Suporte" })}
          options={["Suporte", "SuperAdmin"]}
        />
        <div className="flex items-end">
          <button className="admin-button-primary h-11 w-full" type="submit" disabled={criarMutation.isPending}>
            <Plus size={16} aria-hidden="true" />
            Criar admin
          </button>
        </div>
        <TextAreaField
          className="md:col-span-2 xl:col-span-4"
          label="Motivo"
          value={form.motivo}
          onChange={(motivo) => setForm({ ...form, motivo })}
          rows={2}
        />
      </form>

      {erro ? <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p> : null}

      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Último login</th>
              <th className="px-4 py-3">Motivo e ações</th>
            </tr>
          </thead>
          <tbody>
          {isLoading ? (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                Carregando...
              </td>
            </tr>
          ) : null}
            {!isLoading && error ? (
              <tr>
                <td className="px-4 py-8 text-center text-red-700" colSpan={5}>
                  Não foi possível carregar os administradores. {error.message}
                </td>
              </tr>
            ) : null}
            {!isLoading && !error && admins.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                  Nenhum administrador encontrado.
                </td>
              </tr>
            ) : null}
            {admins.map((admin) => {
              const isSelf = admin.id === adminAtual.id;
              const novoPerfil = admin.perfil === "SuperAdmin" ? "Suporte" : "SuperAdmin";
              return (
                <tr key={admin.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <strong className="block text-slate-950">{admin.nome}</strong>
                    <span className="text-slate-500">{admin.email}</span>
                  </td>
                  <td className="px-4 py-3">{admin.perfil}</td>
                  <td className="px-4 py-3">{admin.status}</td>
                  <td className="px-4 py-3">{admin.ultimoLoginAt ? formatDate(admin.ultimoLoginAt) : "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <input
                        className="admin-input"
                        value={motivos[admin.id] ?? ""}
                        onChange={(event) => setMotivos({ ...motivos, [admin.id]: event.target.value })}
                        placeholder="Motivo obrigatório"
                        aria-label={`Motivo obrigatório para ${admin.email}`}
                        autoComplete="off"
                        disabled={isSelf}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="admin-button-secondary"
                          type="button"
                          disabled={isSelf || acaoMutation.isPending}
                          onClick={() => acaoMutation.mutate({ admin, acao: "perfil", perfil: novoPerfil })}
                        >
                          <Edit3 size={16} aria-hidden="true" />
                          {novoPerfil}
                        </button>
                        <button
                          className="admin-button-secondary"
                          type="button"
                          disabled={isSelf || acaoMutation.isPending}
                          onClick={() =>
                            acaoMutation.mutate({
                              admin,
                              acao: admin.status === "Bloqueado" ? "desbloquear" : "bloquear",
                            })
                          }
                        >
                          {admin.status === "Bloqueado" ? <Unlock size={16} aria-hidden="true" /> : <Ban size={16} aria-hidden="true" />}
                          {admin.status === "Bloqueado" ? "Desbloquear" : "Bloquear"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminEmailsPanel({
  form,
  emails,
  isLoading,
  isFetching,
  error,
  resendError,
  isResending,
  onChangeForm,
  onRefresh,
  onSubmit,
}: {
  form: AdminResendConfirmacaoForm;
  emails: AdminEmailHistoricoResponse[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  resendError: Error | null;
  isResending: boolean;
  onChangeForm: (form: AdminResendConfirmacaoForm) => void;
  onRefresh: () => void;
  onSubmit: () => void;
}) {
  const emailValido = isValidEmail(form.email);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Emails administrativos</p>
          <h2 className="text-lg font-semibold text-slate-950">Confirmações e histórico</h2>
        </div>
        <button
          className="admin-button-secondary w-full md:w-auto"
          type="button"
          disabled={isFetching}
          onClick={onRefresh}
        >
          <RefreshCw size={16} aria-hidden="true" />
          {isFetching ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]">
        <form
          className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <LabeledInput
            label="Email do usuário"
            type="email"
            value={form.email}
            error={form.email.trim() && !emailValido ? "Digite um e-mail válido." : undefined}
            autoComplete="off"
            name="admin-resend-email"
            onChange={(email) => onChangeForm({ email })}
          />
          {resendError ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {resendError.message}
            </p>
          ) : null}
          <button
            className="admin-button-primary h-11 w-full"
            type="submit"
            disabled={!emailValido || isResending}
          >
            <Mail size={16} aria-hidden="true" />
            {isResending ? "Reenviando..." : "Reenviar confirmação"}
          </button>
        </form>

        <div className="min-w-0 rounded-md border border-slate-200">
          {error ? (
            <p className="m-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error.message}
            </p>
          ) : null}
          {isLoading ? (
            <p className="p-4 text-sm text-slate-500">Carregando histórico de emails...</p>
          ) : null}
          {!isLoading && emails.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Nenhum email encontrado.</p>
          ) : null}
          {emails.length > 0 ? (
            <>
              <div className="grid gap-2 p-3 md:hidden">
                {emails.slice(0, 20).map((email) => (
                  <article
                    key={email.id}
                    className="rounded-md border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <strong className="block truncate text-sm text-slate-950">
                          {email.tipo}
                        </strong>
                        <span className="block truncate text-xs text-slate-500">
                          {email.destinatario}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {email.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(email.createdAt)}</p>
                    {email.erro ? (
                      <p className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700">
                        {email.erro}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Destinatario</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email) => (
                      <tr key={email.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-950">{email.tipo}</td>
                        <td className="px-4 py-3 text-slate-600">{email.destinatario}</td>
                        <td className="px-4 py-3 text-slate-600">{email.status}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(email.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function UsuarioDetalhePanel({
  usuario,
  detalhe,
  adminAtual,
  onAction,
}: {
  usuario?: AdminUsuarioResumoResponse;
  detalhe?: AdminUsuarioDetalheResponse;
  adminAtual: AdminAtualResponse;
  onAction: (mode: ActionMode, usuario: AdminUsuarioResumoResponse) => void;
}) {
  const isSuperAdmin = adminAtual.perfil === "SuperAdmin";

  if (!usuario) {
    return (
      <aside className="rounded-md border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Selecione um usuário para administrar plano, acesso e emails.</p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-md border border-slate-200 bg-white p-5">
      <div>
        <p className="text-sm font-semibold text-slate-500">Detalhe do usuário</p>
        <h2 className="mt-1 text-xl font-semibold">{usuario.nome}</h2>
        <p className="text-sm text-slate-500">{usuario.email}</p>
      </div>
      <div className="grid gap-2 text-sm">
        <InfoLine label="Conta" value={usuario.contaNome ?? "Sem conta"} />
        <InfoLine label="Papel" value={usuario.papelConta ?? "-"} />
        <InfoLine label="Plano" value={usuario.plano ?? "-"} />
        <InfoLine label="Status comercial" value={usuario.statusComercial ?? "-"} />
        <InfoLine label="Status conta" value={usuario.statusConta ?? "-"} />
        <InfoLine label="Trial fim" value={usuario.trialEndsAt ? formatDate(usuario.trialEndsAt) : "-"} />
        <InfoLine label="Dias grátis" value={usuario.diasGratisAtivo ? "Ativo" : "Não"} />
        <InfoLine label="Último email" value={usuario.ultimoEmailEnviadoAt ? formatDate(usuario.ultimoEmailEnviadoAt) : "-"} />
        <InfoLine label="Email confirmado" value={usuario.emailConfirmado ? "Sim" : "Não"} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {isSuperAdmin && !usuario.contaId ? (
          <button className="admin-button-secondary" type="button" onClick={() => onAction("criarConta", usuario)}>
            <Plus size={16} aria-hidden="true" />
            Criar conta
          </button>
        ) : null}
        {isSuperAdmin && usuario.contaId ? (
          <button className="admin-button-secondary" type="button" onClick={() => onAction("plano", usuario)}>
            <ShieldCheck size={16} aria-hidden="true" />
            Plano
          </button>
        ) : null}
        {usuario.contaId ? (
          <button className="admin-button-secondary" type="button" onClick={() => onAction("diasGratis", usuario)}>
            <CheckCircle2 size={16} aria-hidden="true" />
            Dias grátis
          </button>
        ) : null}
        {isSuperAdmin && usuario.contaId ? (
          <button className="admin-button-secondary" type="button" onClick={() => onAction(usuario.statusConta === "Suspensa" ? "reativar" : "suspender", usuario)}>
            {usuario.statusConta === "Suspensa" ? <Unlock size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
            {usuario.statusConta === "Suspensa" ? "Reativar" : "Suspender"}
          </button>
        ) : null}
        <button className="admin-button-secondary" type="button" onClick={() => onAction(usuario.bloqueado ? "desbloquear" : "bloquear", usuario)}>
          {usuario.bloqueado ? <Unlock size={16} aria-hidden="true" /> : <Ban size={16} aria-hidden="true" />}
          {usuario.bloqueado ? "Desbloquear" : "Bloquear"}
        </button>
        {isSuperAdmin ? (
          <button className="admin-button-secondary" type="button" onClick={() => onAction("resetTour", usuario)}>
            <RefreshCw size={16} aria-hidden="true" />
            Resetar tour
          </button>
        ) : null}
        <button className="admin-button-secondary sm:col-span-2" type="button" onClick={() => onAction("email", usuario)}>
          <Mail size={16} aria-hidden="true" />
          Email personalizado
        </button>
      </div>
      <HistoryList title="Emails" rows={(detalhe?.emails ?? []).map((email) => `${email.tipo} · ${email.status} · ${email.destinatario} · ${formatDate(email.createdAt)}${email.erro ? ` · erro: ${email.erro}` : ""}`)} />
      <HistoryList title="Auditoria" rows={(detalhe?.auditoria ?? []).map((audit) => `${audit.acao} · ${audit.adminEmail} · ${audit.resultado} · ${formatDate(audit.createdAt)}`)} />
    </aside>
  );
}

function ActionModal({
  action,
  token,
  usuarios,
  adminAtual,
  onClose,
  onDone,
}: {
  action: ActionState;
  token: string;
  usuarios: AdminUsuarioResumoResponse[];
  adminAtual: AdminAtualResponse;
  onClose: () => void;
  onDone: () => void;
}) {
  const [criarUsuarioForm, setCriarUsuarioForm] = useState<CriarUsuarioForm>(initialCriarUsuarioForm);
  const [criarContaForm, setCriarContaForm] = useState<CriarContaForm>(initialCriarContaForm);
  const [planoForm, setPlanoForm] = useState<PlanoForm>(initialPlanoForm);
  const [diasGratisForm, setDiasGratisForm] = useState<DiasGratisForm>(initialDiasGratisForm);
  const [motivoForm, setMotivoForm] = useState<MotivoForm>(initialMotivoForm);
  const [emailForm, setEmailForm] = useState<EmailForm>(initialEmailForm);
  const [selecionados, setSelecionados] = useState<string[]>(() => (action.usuario ? [action.usuario.id] : []));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [erro, setErro] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const usuario = action.usuario;
      if (action.mode === "criarUsuario") {
        await adminCriarUsuario(
          {
            ...criarUsuarioForm,
            telefone: criarUsuarioForm.telefone || null,
            nomeConta: criarUsuarioForm.nomeConta || null,
          },
          token,
        );
        return;
      }

      if (action.mode === "criarConta") {
        if (!usuario) {
          throw new Error("Selecione um usuário.");
        }

        await adminCriarConta(
          {
            nomeConta: criarContaForm.nomeConta,
            usuarioOwnerId: usuario.id,
            planoInicial: criarContaForm.planoInicial,
            motivo: criarContaForm.motivo,
          },
          token,
        );
        return;
      }

      if (action.mode === "diasGratisLote") {
        if (selecionados.length === 0) {
          throw new Error("Revise e selecione ao menos um usuário com conta.");
        }

        const contaIds = selecionados
          .map((id) => usuarios.find((usuarioAtual) => usuarioAtual.id === id)?.contaId)
          .filter((contaId): contaId is string => Boolean(contaId));

        if (contaIds.length === 0) {
          throw new Error("Selecione ao menos um usuário com conta.");
        }

        await adminCriarDiasGratisLote(
          {
            contaIds,
            inicioAt: new Date(diasGratisForm.inicioAt).toISOString(),
            fimAt: new Date(diasGratisForm.fimAt).toISOString(),
            motivo: diasGratisForm.motivo,
          },
          token,
        );
        return;
      }

      if (action.mode === "email") {
        if (selecionados.length === 0) {
          throw new Error("Revise e selecione ao menos um destinatario.");
        }

        await adminEnviarEmailPersonalizado(
          {
            usuarioIds: selecionados,
            assunto: emailForm.assunto,
            html: emailForm.html,
            anexos: emailForm.anexos,
            motivo: emailForm.motivo,
          },
          token,
        );
        return;
      }

      if (!usuario) {
        throw new Error("Selecione um usuário.");
      }

      if (action.mode === "plano" && usuario.contaId) {
        await adminAlterarPlanoConta(usuario.contaId, planoForm, token);
      } else if (action.mode === "diasGratis" && usuario.contaId) {
        await adminCriarDiasGratisConta(
          usuario.contaId,
          {
            inicioAt: new Date(diasGratisForm.inicioAt).toISOString(),
            fimAt: new Date(diasGratisForm.fimAt).toISOString(),
            motivo: diasGratisForm.motivo,
          },
          token,
        );
      } else if (action.mode === "suspender" && usuario.contaId) {
        await adminSuspenderConta(usuario.contaId, motivoForm, token);
      } else if (action.mode === "reativar" && usuario.contaId) {
        await adminReativarConta(usuario.contaId, { motivo: motivoForm.motivo }, token);
      } else if (action.mode === "bloquear") {
        await adminBloquearUsuario(usuario.id, { motivo: motivoForm.motivo }, token);
      } else if (action.mode === "desbloquear") {
        await adminDesbloquearUsuario(usuario.id, { motivo: motivoForm.motivo }, token);
      } else if (action.mode === "resetTour") {
        await adminResetarTourUsuario(usuario.id, { motivo: motivoForm.motivo }, token);
      }
    },
    onSuccess: onDone,
    onError: (error: Error) => setErro(error.message),
  });

  const title = getActionTitle(action.mode);
  const podeExecutarPlano = adminAtual.perfil === "SuperAdmin";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4">
      <section className="mt-8 w-full max-w-3xl rounded-md border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Ação administrativa</p>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Fechar">
            <XCircle size={20} aria-hidden="true" />
          </button>
        </div>
        <form
          className="space-y-4"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (action.mode === "plano" && !podeExecutarPlano) {
              setErro("Apenas Super Admin altera plano.");
              return;
            }

            const nextFieldErrors = validateActionForm(
              action,
              criarUsuarioForm,
              criarContaForm,
              planoForm,
              diasGratisForm,
              motivoForm,
              emailForm,
              selecionados,
              usuarios,
            );
            setFieldErrors(nextFieldErrors);
            if (hasFieldErrors(nextFieldErrors)) {
              setErro("Revise os campos destacados.");
              return;
            }

            setErro(null);
            mutation.mutate();
          }}
        >
          {action.mode === "criarUsuario" ? <CriarUsuarioFields form={criarUsuarioForm} setForm={setCriarUsuarioForm} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} /> : null}
          {action.mode === "criarConta" && action.usuario ? <CriarContaFields usuario={action.usuario} form={criarContaForm} setForm={setCriarContaForm} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} /> : null}
          {action.mode === "plano" ? <PlanoFields form={planoForm} setForm={setPlanoForm} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} /> : null}
          {action.mode === "diasGratis" || action.mode === "diasGratisLote" ? <DiasGratisFields form={diasGratisForm} setForm={setDiasGratisForm} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} /> : null}
          {action.mode === "suspender" || action.mode === "reativar" || action.mode === "bloquear" || action.mode === "desbloquear" || action.mode === "resetTour" ? (
            <MotivoFields form={motivoForm} setForm={setMotivoForm} showEmail={action.mode === "suspender"} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} />
          ) : null}
          {action.mode === "email" ? <EmailFields form={emailForm} setForm={setEmailForm} errors={fieldErrors} clearError={(field) => setFieldErrors((errors) => clearFieldError(errors, field))} /> : null}
          {action.mode === "diasGratisLote" || action.mode === "email" ? (
            <RevisaoUsuarios usuarios={usuarios} selecionados={selecionados} setSelecionados={(ids) => {
              setSelecionados(ids);
              setFieldErrors((errors) => clearFieldError(errors, "selecionados"));
            }} error={fieldErrors.selecionados} />
          ) : null}
          {erro ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p> : null}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button type="button" className="admin-button-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="admin-button-primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Executando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CriarUsuarioFields({
  form,
  setForm,
  errors,
  clearError,
}: {
  form: CriarUsuarioForm;
  setForm: (form: CriarUsuarioForm) => void;
  errors: FieldErrors;
  clearError: (field: string) => void;
}) {
  const updateForm = (nextForm: CriarUsuarioForm, field: string) => {
    setForm(nextForm);
    clearError(field);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <LabeledInput label="Nome" value={form.nome} onChange={(nome) => updateForm({ ...form, nome }, "nome")} error={errors.nome} autoComplete="off" name="novo-usuario-nome" />
      <LabeledInput label="E-mail" type="email" value={form.email} onChange={(email) => updateForm({ ...form, email }, "email")} error={errors.email} autoComplete="off" name="novo-usuario-email" />
      <LabeledInput label="Telefone" value={form.telefone} onChange={(telefone) => setForm({ ...form, telefone })} autoComplete="off" name="novo-usuario-telefone" />
      <LabeledInput label="Senha temporária" type="password" value={form.senhaTemporaria} onChange={(senhaTemporaria) => updateForm({ ...form, senhaTemporaria }, "senhaTemporaria")} error={errors.senhaTemporaria} autoComplete="new-password" name="novo-usuario-senha-temporaria" />
      <ToggleField label="Email confirmado pelo admin" checked={form.emailConfirmadoPeloAdmin} onChange={(emailConfirmadoPeloAdmin) => setForm({ ...form, emailConfirmadoPeloAdmin })} />
      <ToggleField label="Enviar link de confirmação" checked={form.enviarLinkConfirmacao} onChange={(enviarLinkConfirmacao) => setForm({ ...form, enviarLinkConfirmacao })} />
      <ToggleField label="Criar conta junto" checked={form.criarConta} onChange={(criarConta) => setForm({ ...form, criarConta })} />
      {form.criarConta ? (
        <>
          <LabeledInput label="Nome da conta" value={form.nomeConta} onChange={(nomeConta) => updateForm({ ...form, nomeConta }, "nomeConta")} error={errors.nomeConta} />
          <SelectField label="Plano inicial" value={form.planoInicial} onChange={(planoInicial) => setForm({ ...form, planoInicial: planoInicial as "Trial" | "Fundador" })} options={["Trial", "Fundador"]} />
        </>
      ) : null}
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => updateForm({ ...form, motivo }, "motivo")} className="md:col-span-2" error={errors.motivo} />
    </div>
  );
}

function CriarContaFields({
  usuario,
  form,
  setForm,
  errors,
  clearError,
}: {
  usuario: AdminUsuarioResumoResponse;
  form: CriarContaForm;
  setForm: (form: CriarContaForm) => void;
  errors: FieldErrors;
  clearError: (field: string) => void;
}) {
  const updateForm = (nextForm: CriarContaForm, field: string) => {
    setForm(nextForm);
    clearError(field);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-md border border-slate-200 p-3 text-sm md:col-span-2">
        <p className="font-semibold text-slate-700">Owner da conta</p>
        <p className="text-slate-500">{usuario.nome} · {usuario.email}</p>
      </div>
      <LabeledInput label="Nome da conta" value={form.nomeConta} onChange={(nomeConta) => updateForm({ ...form, nomeConta }, "nomeConta")} error={errors.nomeConta} />
      <SelectField label="Plano inicial" value={form.planoInicial} onChange={(planoInicial) => setForm({ ...form, planoInicial: planoInicial as "Trial" | "Fundador" })} options={["Trial", "Fundador"]} />
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => updateForm({ ...form, motivo }, "motivo")} className="md:col-span-2" error={errors.motivo} />
    </div>
  );
}

function PlanoFields({ form, setForm, errors, clearError }: { form: PlanoForm; setForm: (form: PlanoForm) => void; errors: FieldErrors; clearError: (field: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <SelectField label="Plano" value={form.plano} onChange={(plano) => setForm({ ...form, plano: plano as "Trial" | "Fundador" })} options={["Trial", "Fundador"]} />
      <ToggleField label="Enviar email" checked={form.enviarEmail} onChange={(enviarEmail) => setForm({ ...form, enviarEmail })} />
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => {
        setForm({ ...form, motivo });
        clearError("motivo");
      }} className="md:col-span-2" error={errors.motivo} />
    </div>
  );
}

function DiasGratisFields({ form, setForm, errors, clearError }: { form: DiasGratisForm; setForm: (form: DiasGratisForm) => void; errors: FieldErrors; clearError: (field: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <LabeledInput label="Início" type="datetime-local" value={form.inicioAt} onChange={(inicioAt) => {
        setForm({ ...form, inicioAt });
        clearError("inicioAt");
      }} error={errors.inicioAt} />
      <LabeledInput label="Fim" type="datetime-local" value={form.fimAt} onChange={(fimAt) => {
        setForm({ ...form, fimAt });
        clearError("fimAt");
      }} error={errors.fimAt} />
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => {
        setForm({ ...form, motivo });
        clearError("motivo");
      }} className="md:col-span-2" error={errors.motivo} />
    </div>
  );
}

function MotivoFields({ form, setForm, showEmail, errors, clearError }: { form: MotivoForm; setForm: (form: MotivoForm) => void; showEmail: boolean; errors: FieldErrors; clearError: (field: string) => void }) {
  return (
    <div className="grid gap-3">
      {showEmail ? <ToggleField label="Enviar email automático" checked={form.enviarEmail} onChange={(enviarEmail) => setForm({ ...form, enviarEmail })} /> : null}
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => {
        setForm({ ...form, motivo });
        clearError("motivo");
      }} error={errors.motivo} />
    </div>
  );
}

function EmailFields({ form, setForm, errors, clearError }: { form: EmailForm; setForm: (form: EmailForm) => void; errors: FieldErrors; clearError: (field: string) => void }) {
  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const anexos = await Promise.all(files.map(readFileAsAnexo));
    setForm({ ...form, anexos });
  };

  return (
    <div className="grid gap-3">
      <LabeledInput label="Assunto" value={form.assunto} onChange={(assunto) => {
        setForm({ ...form, assunto });
        clearError("assunto");
      }} error={errors.assunto} />
      <TextAreaField label="HTML" value={form.html} onChange={(html) => {
        setForm({ ...form, html });
        clearError("html");
      }} rows={8} error={errors.html} />
      <div className="rounded-md border border-slate-200 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">Preview</p>
        <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: form.html }} />
      </div>
      <label className="admin-field">
        <span>Anexos simples</span>
        <input className="admin-input" type="file" multiple onChange={(event) => void onFiles(event)} />
      </label>
      <TextAreaField label="Motivo" value={form.motivo} onChange={(motivo) => {
        setForm({ ...form, motivo });
        clearError("motivo");
      }} error={errors.motivo} />
    </div>
  );
}

function RevisaoUsuarios({
  usuarios,
  selecionados,
  setSelecionados,
  error,
}: {
  usuarios: AdminUsuarioResumoResponse[];
  selecionados: string[];
  setSelecionados: (ids: string[]) => void;
  error?: string;
}) {
  const selectedSet = useMemo(() => new Set(selecionados), [selecionados]);

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="mb-3 text-sm font-semibold text-slate-700">Revisão final dos alvos</p>
      {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="max-h-56 space-y-2 overflow-y-auto">
        {usuarios.map((usuario) => (
          <label key={usuario.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-2 text-sm">
            <span>
              <strong>{usuario.nome}</strong> · {usuario.email}
            </span>
            <input
              type="checkbox"
              checked={selectedSet.has(usuario.id)}
              onChange={(event) => {
                setSelecionados(
                  event.target.checked
                    ? [...selecionados, usuario.id]
                    : selecionados.filter((id) => id !== usuario.id),
                );
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ usuario }: { usuario: AdminUsuarioResumoResponse }) {
  if (usuario.bloqueado) {
    return <span className="admin-badge-danger">Bloqueado</span>;
  }

  if (usuario.statusConta === "Suspensa") {
    return <span className="admin-badge-warning">Conta suspensa</span>;
  }

  return <span className="admin-badge-success">Ativo</span>;
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  name?: string;
}) {
  const inputId = useId();

  return (
    <div className="admin-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        className={`admin-input ${error ? "border-red-300 bg-red-50/40" : ""}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  className = "",
  rows = 3,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <label className={`admin-field ${className}`}>
      <span>{label}</span>
      <textarea
        className={`admin-input min-h-24 ${error ? "border-red-300 bg-red-50/40" : ""}`}
        rows={rows}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select className="admin-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option || "todos"} value={option}>
            {option || "Todos"}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <strong className="text-right text-slate-900">{value}</strong>
    </div>
  );
}

function HistoryList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className="space-y-2">
        {rows.length === 0 ? <p className="text-sm text-slate-500">Sem registros.</p> : null}
        {rows.slice(0, 6).map((row) => (
          <p key={row} className="rounded-md bg-slate-50 p-2 text-xs text-slate-600">
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

async function baixarCsv(token: string, filtros: AdminUsuariosFiltros) {
  const blob = await adminDownloadUsuariosCsv(token, filtros);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "emprely-admin-usuarios.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function getActionTitle(mode: ActionMode) {
  const titles: Record<ActionMode, string> = {
    criarUsuario: "Criar usuário",
    criarConta: "Criar conta",
    plano: "Alterar plano",
    diasGratis: "Adicionar dias grátis",
    diasGratisLote: "Adicionar dias grátis em lote",
    suspender: "Suspender conta",
    reativar: "Reativar conta",
    bloquear: "Bloquear usuário",
    desbloquear: "Desbloquear usuário",
    resetTour: "Resetar tour inicial",
    email: "Enviar email personalizado",
  };

  return titles[mode];
}

function validateLoginForm(form: LoginForm): FieldErrors {
  const errors: FieldErrors = {};
  addRequiredError(errors, "email", form.email, "Informe o e-mail admin.");
  if (form.email.trim() && !isValidEmail(form.email)) {
    errors.email = "Digite um e-mail válido.";
  }

  addRequiredError(errors, "senha", form.senha, "Informe a senha.");

  return errors;
}

function validateAlterarSenhaAdminForm(form: AlterarSenhaAdminForm): FieldErrors {
  const errors: FieldErrors = {};
  addRequiredError(errors, "senhaAtual", form.senhaAtual, "Informe a senha atual.");
  addRequiredError(errors, "novaSenha", form.novaSenha, "Informe a nova senha.");

  if (form.novaSenha && form.novaSenha.length < 8) {
    errors.novaSenha = "A nova senha precisa ter pelo menos 8 caracteres.";
  }

  addRequiredError(errors, "confirmarNovaSenha", form.confirmarNovaSenha, "Confirme a nova senha.");
  if (form.confirmarNovaSenha && form.novaSenha !== form.confirmarNovaSenha) {
    errors.confirmarNovaSenha = "A confirmacao precisa ser igual a nova senha.";
  }

  return errors;
}

function validateActionForm(
  action: ActionState,
  criarUsuarioForm: CriarUsuarioForm,
  criarContaForm: CriarContaForm,
  planoForm: PlanoForm,
  diasGratisForm: DiasGratisForm,
  motivoForm: MotivoForm,
  emailForm: EmailForm,
  selecionados: string[],
  usuarios: AdminUsuarioResumoResponse[],
): FieldErrors {
  const errors: FieldErrors = {};

  if (action.mode === "criarUsuario") {
    addRequiredError(errors, "nome", criarUsuarioForm.nome, "Informe o nome do usuário.");
    addRequiredError(errors, "email", criarUsuarioForm.email, "Informe o e-mail do usuário.");
    if (criarUsuarioForm.email.trim() && !isValidEmail(criarUsuarioForm.email)) {
      errors.email = "Digite um e-mail válido.";
    }

    addRequiredError(errors, "senhaTemporaria", criarUsuarioForm.senhaTemporaria, "Informe a senha temporaria.");
    if (criarUsuarioForm.senhaTemporaria && criarUsuarioForm.senhaTemporaria.length < 8) {
      errors.senhaTemporaria = "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (criarUsuarioForm.criarConta) {
      addRequiredError(errors, "nomeConta", criarUsuarioForm.nomeConta, "Informe o nome da conta.");
    }

    addMotivoError(errors, criarUsuarioForm.motivo);
    return errors;
  }

  if (action.mode === "criarConta") {
    addRequiredError(errors, "nomeConta", criarContaForm.nomeConta, "Informe o nome da conta.");
    addMotivoError(errors, criarContaForm.motivo);
    return errors;
  }

  if (action.mode === "plano") {
    addMotivoError(errors, planoForm.motivo);
    return errors;
  }

  if (action.mode === "diasGratis" || action.mode === "diasGratisLote") {
    addDateRangeErrors(errors, diasGratisForm);
    addMotivoError(errors, diasGratisForm.motivo);

    if (action.mode === "diasGratisLote" && getContaIdsSelecionadas(selecionados, usuarios).length === 0) {
      errors.selecionados = "Selecione ao menos um usuário com conta.";
    }

    return errors;
  }

  if (action.mode === "email") {
    if (selecionados.length === 0) {
      errors.selecionados = "Selecione ao menos um destinatario.";
    }

    addRequiredError(errors, "assunto", emailForm.assunto, "Informe o assunto do e-mail.");
    addRequiredError(errors, "html", stripHtml(emailForm.html), "Informe o conteudo do e-mail.");
    addMotivoError(errors, emailForm.motivo);
    return errors;
  }

  addMotivoError(errors, motivoForm.motivo);
  return errors;
}

function addRequiredError(errors: FieldErrors, field: string, value: string, message: string) {
  if (!value.trim()) {
    errors[field] = message;
  }
}

function addMotivoError(errors: FieldErrors, motivo: string) {
  const motivoNormalizado = motivo.trim();
  if (!motivoNormalizado) {
    errors.motivo = "Informe o motivo da ação administrativa.";
    return;
  }

  if (motivoNormalizado.length < 5) {
    errors.motivo = "Informe um motivo com pelo menos 5 caracteres.";
  }
}

function addDateRangeErrors(errors: FieldErrors, form: DiasGratisForm) {
  addRequiredError(errors, "inicioAt", form.inicioAt, "Informe a data de inicio.");
  addRequiredError(errors, "fimAt", form.fimAt, "Informe a data de fim.");

  if (errors.inicioAt || errors.fimAt) {
    return;
  }

  const inicio = new Date(form.inicioAt).getTime();
  const fim = new Date(form.fimAt).getTime();

  if (!Number.isFinite(inicio)) {
    errors.inicioAt = "Informe uma data de inicio valida.";
  }

  if (!Number.isFinite(fim)) {
    errors.fimAt = "Informe uma data de fim valida.";
  }

  if (Number.isFinite(inicio) && Number.isFinite(fim) && fim <= inicio) {
    errors.fimAt = "A data de fim deve ser posterior ao inicio.";
  }
}

function getContaIdsSelecionadas(
  selecionados: string[],
  usuarios: AdminUsuarioResumoResponse[],
): string[] {
  return selecionados
    .map((id) => usuarios.find((usuarioAtual) => usuarioAtual.id === id)?.contaId)
    .filter((contaId): contaId is string => Boolean(contaId));
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function clearFieldError(errors: FieldErrors, field: string): FieldErrors {
  if (!errors[field]) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

async function readFileAsAnexo(file: File): Promise<AdminEmailAnexoInput> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  return {
    nomeArquivo: file.name,
    contentType: file.type || "application/octet-stream",
    conteudoBase64: dataUrl.split(",", 2)[1] ?? "",
  };
}
