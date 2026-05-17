# Spec Web - Refatoracao UX pelo prototipo

## Visao geral

Refatorar o web app para uma experiencia operacional parecida com o prototipo, priorizando rapidez na criacao de orcamentos.

## Rotas

- `/`

## Estados da interface

- Carregando: mensagens existentes.
- Vazio: blocos vazios com CTA para criar.
- Erro: alertas existentes.
- Sucesso: mensagens existentes.

## Componentes

- Sidebar clara com marca.
- Header com marca do usuario e Emprely secundaria.
- Dashboard com CTA, metricas e propostas recentes.
- Checklist de primeiros passos condicional.
- Trial upsell banner.
- Tabelas/listas paginadas.
- Modal de sugestao de logo.
- Rodape.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Logo | file/image | Nao | `image/*`, processado no frontend |
| Logo URL | text/url/data | Nao | URL valida ou `data:image/` |
| Demais campos | Existente | Conforme schema | Zod atual |

## Integracao com API

- `GET /api/account/profile`
- `PUT /api/account/profile`
- Demais endpoints existentes sem mudanca.

## Criterios de aceite

- Checklist some quando todos os itens estao concluidos.
- Trial banner aparece apenas no Trial.
- Listas suportam pagina e tamanho.
- Cadastro novo mantem usuario no cadastro.
- Edicao concluida limpa selecao.
- Upload de logo gera modal de sugestao e aplica logo/cores.
- Header mostra marca do usuario.
- Testes web passam.

## Testes

- Lint: `pnpm lint:web`
- Build: `pnpm build:web`
- E2E: `pnpm --dir apps/web test:e2e`
