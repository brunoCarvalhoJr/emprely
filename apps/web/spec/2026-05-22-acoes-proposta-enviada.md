# Spec Web - Acoes em proposta enviada

## Visao geral

Propostas ja enviadas devem continuar operaveis como documentos finais, mas nao podem ser editadas diretamente.

## Regras

- Status `Gerada`, `Enviada`, `Aceita` e `Recusada` podem exportar, baixar e compartilhar a proposta.
- Status `Rascunho` nao pode exportar enquanto nao gerar a proposta final.
- Status `Enviada`, `Aceita` e `Recusada` nao podem abrir o editor diretamente.
- Quando o usuario precisar alterar uma proposta ja enviada, deve usar `Duplicar`.
- A acao `Enviar` continua disponivel apenas para status `Gerada`.

## Criterios de aceite

- Na modal de uma proposta enviada, download e WhatsApp ficam ativos quando o plano permite exportar.
- Na listagem, proposta enviada mostra PDF/WhatsApp, decisao comercial e duplicar.
- A acao de editar fica bloqueada para proposta enviada.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
