# Spec API - Bloqueio por trial expirado

## Visao geral

Aplicar a regra comercial do trial vencido nos endpoints comerciais da proposta. A conta pode continuar consultando historico e salvando dados, mas nao pode transformar rascunho em proposta gerada nem marcar proposta como enviada enquanto o trial estiver expirado.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/proposals/{id}/generate` | Bearer JWT | Gera proposta quando a conta tem acesso comercial ativo. |
| POST | `/api/proposals/{id}/send` | Bearer JWT | Marca proposta como enviada quando a conta tem acesso comercial ativo. |
| GET | `/api/proposals` | Bearer JWT | Continua liberado para historico. |
| GET | `/api/proposals/{id}` | Bearer JWT | Continua liberado para historico. |

## Contratos

### Request

```json
{}
```

### Response

```json
{
  "message": "Trial expirado. Ative o Plano Fundador para gerar, imprimir ou compartilhar propostas."
}
```

## Regras de negocio

- `Conta.CanGenerateProposta(agora)` deve retornar `true` para `Fundador`.
- `Conta.CanGenerateProposta(agora)` deve retornar `true` para `TrialAtivo`.
- `Conta.CanGenerateProposta(agora)` deve retornar `false` para `TrialExpirado`.
- `POST /api/proposals/{id}/generate` deve retornar `403` antes de alterar status quando a conta nao puder gerar.
- `POST /api/proposals/{id}/send` deve retornar `403` antes de alterar status quando a conta nao puder usar o fluxo comercial.
- Leitura de propostas, criacao de rascunho, edicao e historico nao entram neste bloqueio.

## Validacoes

- Proposta continua sendo buscada pela conta autenticada.
- Conta tambem deve ser buscada pela conta autenticada.

## Dados e persistencia

- Sem alteracao de schema.

## Erros esperados

- `401` quando nao autenticado.
- `404` quando proposta ou conta nao existir.
- `403` quando trial estiver expirado.
- `400` quando a transicao de status da proposta for invalida.

## Testes

- Unitarios:
  - Conta trial ativo pode gerar proposta.
  - Conta trial expirado nao pode gerar proposta.
  - Conta fundador pode gerar proposta.
- Integracao:
  - Build e testes da solution.
