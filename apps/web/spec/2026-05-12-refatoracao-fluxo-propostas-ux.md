# Spec Web - Refatoracao do fluxo de propostas e usabilidade

## Visao geral

Melhorar o fluxo operacional do MVP para que propostas salvas tenham acoes claras e funcionais sem depender do formulario aberto no momento.

## Rotas

- App autenticado, tela `Propostas`.
- Atalhos de `Dashboard`.
- Cards de `Clientes`.

## Estados da interface

- Carregando: manter estados atuais de carregamento das listas.
- Vazio: manter mensagens existentes e adicionar CTAs quando fizer sentido.
- Erro: manter mensagens atuais das mutations.
- Sucesso: mensagens apos salvar, gerar e arquivar continuam visiveis.

## Componentes

- `App`: orquestracao de estado, snapshot de impressao e guard de descarte.
- `PreviewPropostaVisual`: deve aceitar nome fallback do cliente quando a lista ativa nao tiver o cliente.
- Cards de propostas: devem exibir acoes diretas por status.
- Cards de clientes: devem permitir iniciar proposta para o cliente.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Proposta | existente | sim | manter schema atual |
| Cliente | existente | sim | manter schema atual |
| Servico | existente | sim | manter schema atual |

## Integracao com API

- `generateProposta(id, token)` para proposta rascunho ou salva.
- `deleteCliente`, `deleteServico`, `deleteProposta` seguem iguais, mas com confirmacao de UX antes da mutation.

## Criterios de aceite

- Proposta gerada salva no historico exibe `Imprimir/PDF` e `Abrir WhatsApp`.
- Proposta rascunho salva no historico exibe `Gerar`.
- Impressao usa o conteudo da proposta salva clicada, nao outro formulario aberto.
- WhatsApp usa a proposta clicada e o cliente quando houver telefone ativo.
- Dashboard abre `Nova proposta`, `Cadastrar cliente` e `Salvar servico` limpando selecoes anteriores.
- Cliente possui atalho para criar proposta ja preenchendo o cliente.
- Arquivar cliente, servico e proposta pede confirmacao.
- Item selecionado fica visualmente destacado.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- Cenario manual: proposta gerada salva -> imprimir/PDF direto do historico.
- Cenario manual: proposta gerada salva -> abrir WhatsApp direto do historico.
- Cenario manual: cliente -> criar proposta.
