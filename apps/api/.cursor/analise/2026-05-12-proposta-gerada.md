# Analise API - Proposta gerada

## Contexto

O MVP ja permite criar, editar, listar e arquivar propostas em rascunho. O proximo passo do fluxo e marcar uma proposta como pronta para envio/exportacao.

## Situacao atual

- `Proposta` nasce com status `Rascunho`.
- `DELETE /api/proposals/{id}` arquiva a proposta.
- `StatusProposta` e persistido como string no EF Core.
- Nao existe endpoint para transicionar a proposta para um estado final de geracao.

## Decisoes

- Criar status `Gerada`.
- Criar endpoint `POST /api/proposals/{id}/generate`.
- Implementar metodo de dominio `GerarProposta`.
- Manter a rota publica em ingles.
- Se uma proposta `Gerada` for editada, ela volta para `Rascunho`, porque o material gerado precisa refletir a ultima versao salva.
- Nao criar migration, pois o enum e salvo como string e nao altera schema.

## Perguntas

Nao ha duvidas bloqueantes para o MVP. A exportacao robusta com arquivo persistido/S3 fica fora desta entrega.

## Riscos

- Futuramente os estados `Enviada`, `Aceita` e `Recusada` vao precisar de regras especificas.
- O frontend deve deixar claro que imprimir/WhatsApp usam a proposta salva/gerada, nao um rascunho local nao salvo.
