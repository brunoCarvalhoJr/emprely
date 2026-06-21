# Analise - Formato de arquivo preferido no perfil da conta

## Contexto

O perfil da conta armazena dados de personalizacao usados em documentos e propostas. A nova necessidade e salvar a preferencia de formato de arquivo para envio com anexo.

## Objetivo

Persistir no perfil da conta o formato preferido para arquivos de proposta: PDF ou imagem.

## Regras

- Valor padrao: `Pdf`.
- Valores validos: `Pdf` e `Imagem`.
- O contrato de leitura e atualizacao do perfil deve expor o novo campo.
- Contas existentes recebem `Pdf` via default de migracao.

## Impactos

- Contratos `PerfilContaResponse` e `UpdatePerfilContaRequest`.
- Dominio `PerfilConta`.
- Mapeamento EF Core e migracao.

## Riscos

- Valores invalidos vindos do frontend devem ser rejeitados pela API.
