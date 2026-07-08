# Spec API - Trial e Plano Fundador

## Visao geral

Implementar o estado comercial basico da conta para o MVP: conta nova em trial de 7 dias e endpoint autenticado para ativacao manual do Plano Fundador.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/me` | Bearer JWT | Retorna usuario atual e conta com estado comercial. |
| GET | `/api/account` | Bearer JWT | Retorna conta atual com estado comercial. |
| REMOVIDO | `/api/account/activate-founder` | - | Substituido por billing Asaas; usuario comum nao ativa plano manualmente. |

## Contratos

### Request

```json
{}
```

### Response

```json
{
  "id": "guid",
  "nome": "Emprely",
  "slug": "emprely-abc12345",
  "papel": "Owner",
  "plano": "Trial",
  "statusComercial": "TrialAtivo",
  "trialEndsAt": "2026-05-19T00:00:00Z",
  "trialDiasRestantes": 7,
  "planoFundadorAtivadoAt": null,
  "planoFundadorPrecoMensal": 19.9
}
```

## Regras de negocio

- `Conta.CreateConta` deve inicializar `Plano = Trial`.
- `TrialEndsAt` deve ser `CreatedAt + 7 dias`.
- `ActivatePlanoFundador` deve mudar `Plano` para `Fundador` e preencher `PlanoFundadorAtivadoAt`.
- `ActivatePlanoFundador` deve ser idempotente quando a conta ja esta em `Fundador`.
- `GetStatusComercialConta` deve retornar `FundadorAtivo`, `TrialAtivo` ou `TrialExpirado`.

## Validacoes

- Endpoint de ativacao deve retornar `404` se a conta autenticada nao existir.
- O endpoint nao aceita `ContaId` vindo do frontend.

## Dados e persistencia

- Migration deve adicionar em `contas`:
  - `Plano` com conversao string e max length 24.
  - `TrialEndsAt` obrigatorio.
  - `PlanoFundadorAtivadoAt` opcional.

## Erros esperados

- `401` quando nao autenticado.
- `404` quando a conta do contexto nao existir.

## Testes

- Unitarios:
  - Criacao de conta nasce em trial com fim futuro.
  - Trial expirado calcula status e dias restantes corretamente.
  - Ativacao do Fundador altera plano, status e data.
- Integracao:
  - Build e teste da solution.
