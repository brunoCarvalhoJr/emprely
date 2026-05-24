# Analise Web - Download da proposta pela modal

## Contexto

Depois que a proposta e gerada, o sistema abre uma modal de visualizacao com a proposta final e botoes de editar, baixar PDF, WhatsApp e fechar.

## Problema

O botao de download da modal pode nao gerar arquivo porque a exportacao depende do no visual dentro da modal. Esse no fica dentro de uma area rolavel e pode nao estar pronto ou pode falhar durante a captura por canvas, especialmente quando ha logomarca carregada da API.

## Objetivo

Garantir que o download da proposta gerada funcione dentro da modal.

## Decisoes

- Usar um buffer oculto proprio para a exportacao da proposta aberta na modal.
- Aguardar o no de exportacao estar montado antes de gerar o PDF.
- Manter a modal apenas como visualizacao, sem depender dela para a captura final.
- Adicionar fallback para imagem indisponivel durante a captura para evitar falha total do arquivo.

## Area impactada

- `apps/web/src/App.tsx`
