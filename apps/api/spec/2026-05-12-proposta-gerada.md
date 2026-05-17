# Spec API - Proposta gerada

## Visao geral

Adicionar acao de gerar proposta, mudando uma proposta ativa da conta autenticada para o status `Gerada`.

## Endpoint

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/proposals/{id}/generate` | Bearer JWT | Marca a proposta como gerada. |

## Regras de negocio

- A proposta deve pertencer a conta autenticada.
- Proposta arquivada retorna `404`.
- Proposta gerada permanece idempotente: gerar novamente retorna a mesma proposta em `Gerada`.
- Proposta deve ter titulo e pelo menos um item.
- Editar uma proposta `Gerada` muda o status de volta para `Rascunho`.
- Nao cria arquivo PDF nem imagem nesta entrega.

## Response

Retorna o mesmo contrato `PropostaResponse`, com `status: "Gerada"`.

## Validacao

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`

## Fora do escopo

- Exportacao persistida.
- Worker/fila.
- S3.
- Link publico.
- Aceite de proposta.
