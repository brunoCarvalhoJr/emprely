# Spec Web - Download da proposta pela modal

## Visao geral

Corrigir o download de PDF quando o usuario esta na modal de visualizacao de uma proposta gerada.

## Comportamento

- O botao de download da modal deve gerar um PDF da proposta visualizada.
- A exportacao deve usar um documento oculto e estavel, nao a area rolavel da modal.
- Se o no ainda nao estiver montado no primeiro instante do clique, o sistema deve aguardar o proximo frame antes de falhar.
- Uma imagem externa indisponivel nao deve impedir a geracao do PDF inteiro.

## Criterios de aceite

- Clicar em baixar PDF na modal dispara o download.
- O nome do arquivo continua usando numero e cliente/titulo da proposta.
- O fluxo existente de download fora da modal continua funcionando.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
