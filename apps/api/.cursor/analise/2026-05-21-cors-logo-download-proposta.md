# Analise API - CORS da logomarca na exportacao da proposta

## Contexto

A proposta pode renderizar a logomarca configurada no perfil da conta. Essa imagem e servida pela API em `wwwroot`.

## Problema

O middleware de arquivos estaticos estava sendo executado antes do CORS. A imagem aparece normalmente no navegador, mas bibliotecas de exportacao para canvas/PDF podem precisar de CORS para transformar essa imagem em arquivo.

## Objetivo

Permitir que imagens estaticas da API sejam usadas pela exportacao da proposta no frontend.

## Decisao

Aplicar CORS antes de `UseStaticFiles`, preservando a politica ja configurada de origens permitidas.

## Area impactada

- `apps/api/src/Emprely.Api/Program.cs`
