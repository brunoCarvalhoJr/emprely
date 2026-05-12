# Analise - Sprint 1 Auth e Conta

## Contexto

Após a criação do monorepo, o próximo passo é tirar o web do estado puramente visual e criar a fundação real da API: PostgreSQL, autenticação e conta.

## Objetivo

Permitir que um usuário cadastre uma conta, faça login, receba JWT e consulte seus dados atuais e a conta vinculada.

## Projetos impactados

- API: EF Core, Identity, JWT, entidades de conta, controllers.
- Web: tela simples de cadastro/login integrada aos endpoints.
- Infra: uso do PostgreSQL já definido no `docker-compose.yml`.

## Fluxo proposto

1. Usuário cadastra nome, email, senha e nome da conta.
2. API cria `UsuarioAplicacao`, `Conta` e `MembroConta` owner.
3. API retorna JWT e dados de usuário/conta.
4. Usuário faz login com email/senha.
5. API retorna novo JWT.
6. Web guarda token em memória local do componente e chama `/api/me`.

## Regras de negócio

- Cadastro cria uma conta owner automaticamente.
- Email de login é único.
- A API resolve a conta atual pelo usuário autenticado.
- Endpoints protegidos usam JWT.
- Senhas ficam sob ASP.NET Identity.

## Impactos técnicos

- API precisa de `EmprelyDbContext` com Identity e entidades de domínio.
- `Emprely.Contracts` passa a conter requests/responses públicos.
- Web precisa de URL de API configurável por `VITE_API_BASE_URL`.

## Riscos

- A máquina pode não ter Docker disponível para rodar PostgreSQL local.
- Sem migrations aplicadas, endpoints que usam banco dependem do banco já preparado.
- JWT local usa uma chave de desenvolvimento em `appsettings.Development.json`.

## Dúvidas resolvidas

- Usar .NET 9 instalado.
- Manter rotas públicas em inglês e nomes internos PortuguesIngles.
