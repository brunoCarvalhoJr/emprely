# Analise Web - Perfil Conta Marca

## Contexto

O web ja permite cadastro/login e exibe a sessao ativa. A API passara a expor o perfil profissional da conta para alimentar propostas futuras.

## Objetivo da tela/fluxo

Permitir que usuario logado consulte e edite dados comerciais e marca da conta em uma area de configuracoes simples.

## Rotas impactadas

- App de pagina unica em `/`.

## Componentes impactados

- `App.tsx`
- `lib/api.ts`
- `types/auth.ts`

## Formularios e validacao

- Campos:
  - Nome comercial
  - Email de contato
  - Telefone
  - Site
  - Instagram
  - Documento
  - Cor primaria
  - Cor secundaria
  - Logo URL
- Regras:
  - Nome comercial obrigatorio.
  - Cores obrigatorias em formato hex.
  - Demais campos opcionais.
- Mensagens:
  - Mostrar erro de API.
  - Mostrar confirmacao apos salvar.

## Dados e chamadas de API

- Queries:
  - `GET /api/account/profile`
- Mutations:
  - `PUT /api/account/profile`
- Estados de loading/erro/vazio:
  - Loading inicial do perfil.
  - Estado de erro quando API falhar.
  - Formulario com valores padrao quando perfil ainda nao existir.

## Responsividade e acessibilidade

- Formulario responsivo em grid.
- Labels visiveis em todos os campos.
- Inputs de cor usam `type=color` combinado com texto hex.

## Duvidas

- Upload real de logo sera feito agora? Decisao atual: nao, apenas URL.
- Perfil precisa de rota separada? Decisao atual: nao, manter na mesma tela para acelerar MVP.
