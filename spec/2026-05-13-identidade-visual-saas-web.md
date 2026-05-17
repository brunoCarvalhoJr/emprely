# Spec - Identidade visual no SaaS web

## Visao geral

Refatorar a camada visual do SaaS web Emprely para refletir a identidade da marca: logo, favicon, paleta navy/roxo/azul/teal, layout operacional, estados mais claros e transicoes discretas.

## Escopo

Inclui:

- Aplicar logo e favicon no app web.
- Atualizar tokens visuais globais.
- Melhorar header, navegacao, auth, dashboard, listas, formularios e preview de proposta.
- Manter boa responsividade e acessibilidade.
- Validar com lint, build e E2E disponivel.

Fora do escopo:

- Mudancas de backend.
- Mudancas de regra de negocio.
- Redesign da landing page separada.
- Prints finais e refinamento editorial de imagens.

## Fluxo ponta a ponta

1. Usuario acessa o SaaS e ve a marca Emprely no favicon, header e autenticacao.
2. Usuario entra ou cria conta mantendo os mesmos fluxos atuais.
3. Usuario navega por Dashboard, Clientes, Servicos, Propostas e Conta com sidebar mais clara.
4. Usuario cria ou edita dados usando formularios com foco, feedback e botoes alinhados a marca.
5. Usuario visualiza propostas em preview com apresentacao mais profissional.
6. Usuario continua podendo imprimir/PDF e abrir WhatsApp quando a proposta estiver gerada.

## Requisitos

- Usar assets oficiais da pasta de identidade visual.
- Preservar labels e nomes de botoes existentes.
- Manter a aplicacao em React/Vite.
- Evitar dependencias novas para efeitos visuais.
- Respeitar `prefers-reduced-motion`.
- Manter performance com CSS/transicoes leves.

## Regras de negocio

- Propostas so podem ser impressas/compartilhadas conforme as regras atuais de status e plano.
- Trial e Fundador continuam funcionando como hoje.
- Perfil da conta continua controlando cores do preview quando preenchido.

## Impactos por projeto

- API: nenhum.
- Web: refatoracao visual em `index.html`, `src/App.tsx`, `src/styles.css` e assets publicos.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- Logo da Emprely aparece no header/auth e favicon do app.
- Dashboard e navegacao ficam mais proximos da identidade visual fornecida.
- Formularios, cards e botoes usam paleta e microinteracoes da marca.
- Preview de proposta fica visualmente alinhado a Emprely.
- Fluxos existentes continuam testaveis por labels acessiveis.
- Lint, build e E2E web passam.

## Estrategia de implementacao

- Copiar assets oficiais para `apps/web/public/brand`.
- Criar tokens CSS de marca e classes de shell reutilizaveis.
- Fazer alteracoes JSX pontuais em `App.tsx`, evitando reescrever regras de estado.
- Validar automaticamente e inspecionar screenshots se possivel.

## Testes

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`
- Validacao visual local em desktop e mobile quando o dev server estiver disponivel.
