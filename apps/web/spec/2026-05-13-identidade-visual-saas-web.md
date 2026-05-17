# Spec Web - Identidade visual no SaaS web

## Visao geral

Refatorar o SaaS web para refletir a identidade visual oficial da Emprely, com foco em clareza operacional, hierarquia visual, confianca e rapidez de uso.

## Rotas

- `/`: todas as views internas da SPA.

## Estados da interface

- Carregando: manter mensagens atuais com visual mais leve.
- Vazio: manter blocos vazios com borda tracejada e acoes claras.
- Erro: manter alertas vermelhos acessiveis.
- Sucesso: manter alertas positivos com linguagem atual.

## Componentes

- Shell principal com logo, header e navegacao lateral.
- Auth com area de marca e formulario.
- Dashboard com status, primeiros passos, prontidao e metricas.
- Listas de clientes, servicos e propostas com cards acionaveis.
- Formulario de proposta com area de itens e total destacado.
- Preview de proposta com marca Emprely e cores do perfil quando disponiveis.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Auth, cliente, servico, proposta e conta | Existente | Conforme schema atual | Zod atual |

## Integracao com API

- Nenhuma alteracao de contrato.
- Nenhuma nova chamada.
- Nenhum endpoint removido.

## Criterios de aceite

- O app usa logo e favicon oficiais.
- A paleta visual segue a identidade Emprely.
- Navegacao fica mais clara e escaneavel.
- Botoes de acao ficam mais evidentes, sem esconder acoes secundarias.
- Preview de proposta fica mais profissional e imprime sem perder estrutura.
- Testes web continuam passando.

## Testes

- Lint: `pnpm lint:web`
- Build: `pnpm build:web`
- E2E: `pnpm --dir apps/web test:e2e`
- Cenarios manuais: auth, dashboard, cadastro cliente, cadastro servico, criacao de proposta, gerar, imprimir/PDF e WhatsApp.
