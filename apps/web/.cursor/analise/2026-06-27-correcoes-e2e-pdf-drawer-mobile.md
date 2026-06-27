# Analise - Correcoes E2E PDF e drawer mobile

## Contexto

O item 3 da ordem pratica pede corrigir os 2 E2E restantes: PDF e drawer mobile de Perfil da conta.

## Problemas observados

1. O E2E do fluxo principal validava o conteudo textual bruto do PDF buscando `Proposta MVP E2E` e `Aprovar`.
2. A spec existente de templates define que a exportacao PDF preserva o layout visual e o CTA clicavel, mas nao precisa ter texto selecionavel.
3. Como o PDF e gerado a partir de uma imagem PNG inserida no jsPDF, o texto do template nao aparece como texto bruto selecionavel no arquivo.
4. O E2E do drawer mobile buscava o botao `Abrir mais opcoes`, mas a UI expoe o rotulo acessivel correto `Abrir mais opções`.

## Perguntas e decisoes

- O PDF deve passar a ter texto selecionavel?
  - Nao nesta correcao. A spec vigente aceita PDF visual sem texto selecionavel.
- O que o E2E deve provar no PDF?
  - Que o arquivo baixado e um PDF valido, nao vazio, com imagem embutida e link de aprovacao clicavel.
- O drawer mobile deve alterar o texto exibido?
  - Nao. O teste deve seguir o rotulo acessivel real e acentuado da interface.

## Escopo

- Ajustar somente os E2E afetados.
- Nao alterar contrato de API.
- Nao alterar geracao visual do PDF.
- Nao alterar fluxo ou layout do Perfil da conta.

## Validacao planejada

- `pnpm --dir apps/web exec playwright test --grep "fluxo principal|drawer mobile" --reporter=line`
- `pnpm lint:web`
- `pnpm build:web`
