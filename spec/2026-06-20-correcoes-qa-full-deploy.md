# Spec - correcoes da bateria QA full e deploy

## Objetivo

Corrigir os pontos que impediram a bateria completa de testes de propostas de seguir ate o fim e publicar o frontend corrigido.

## Comportamento esperado

- O usuario consegue fechar modais de proposta pelo botao, backdrop e tecla `Escape`.
- As acoes criticas de proposta tem seletores estaveis para automacao:
  - visualizar
  - gerar
  - PDF
  - WhatsApp
  - enviar
  - aceitar
  - recusar
  - editar
  - duplicar
  - excluir
- O modal de confirmacao do sistema expoe seletores estaveis para confirmar/cancelar.
- A suite E2E local cobre visualizar/fechar modal e duplicar proposta.

## Criterios de aceite

- `pnpm lint:web` passa.
- `pnpm build:web` passa.
- `pnpm test:e2e:web` passa.
- O build web beta e o deploy S3/CloudFront usam os scripts existentes do projeto.

## Risco

Baixo para negocio: as mudancas sao de controle de UI, acessibilidade/testabilidade e cobertura. O maior risco e quebrar tipos ou seletores, mitigado por lint, build e E2E.
