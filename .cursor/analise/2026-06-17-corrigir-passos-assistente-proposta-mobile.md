# Analise - Corrigir passos do assistente de proposta no mobile

## Contexto

O ajuste anterior melhorou o stepper do editor de proposta, mas o assistente inicial de nova proposta ainda usava a barra horizontal antiga. No mobile, os labels dos passos quebravam e ficavam parcialmente cortados.

## Problema

- O componente do assistente inicial tinha quatro etapas em uma linha, reutilizando uma classe feita para outro contexto.
- Os labels `Cliente`, `Proposta`, `Itens` e `Revisao` nao tinham area estavel no mobile.
- O primeiro passo ficava legivel, mas os demais quebravam/ficavam escondidos pela largura insuficiente.

## Decisao

Criar classe visual propria para os passos do assistente: `proposal-assistant-steps`.

No mobile:
- cada passo vira uma celula com numero acima e label abaixo;
- os quatro passos ocupam a largura igualmente;
- os textos ficam centralizados, compactos e sem estourar.

