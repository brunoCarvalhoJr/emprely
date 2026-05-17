# Spec API - Ciclo comercial da proposta

## Visao geral

Implementar endpoints e regras de dominio para o acompanhamento comercial de propostas.

## Endpoints

- `POST /api/proposals/{id}/send`
- `POST /api/proposals/{id}/accept`
- `POST /api/proposals/{id}/reject`

## Regras

- `send`: permitido apenas para proposta `Gerada`.
- `accept`: permitido apenas para proposta `Enviada`.
- `reject`: permitido apenas para proposta `Enviada`.
- Proposta arquivada ou inexistente retorna `404`.
- Transicao invalida retorna `ValidationProblem`.
- A resposta dos endpoints retorna `PropostaResponse`.

## Dominio

- Adicionar metodos:
  - `EnviarProposta`
  - `AceitarProposta`
  - `RecusarProposta`
- `AtualizarProposta` deve voltar qualquer status comercial nao arquivado para `Rascunho`.

## Criterios de aceite

- Testes unitarios cobrem envio, aceite, recusa e transicoes invalidas.
- `dotnet build apps/api/Emprely.sln` passa.
- `dotnet test apps/api/Emprely.sln --no-build` passa.
