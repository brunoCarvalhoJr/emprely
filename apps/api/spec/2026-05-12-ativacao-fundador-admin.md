# Spec API - Ativacao Fundador Admin

## Visao geral

Proteger a ativacao manual do Plano Fundador como operacao administrativa.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/account/activate-founder` | Bearer | Bloqueado para autoativacao |
| POST | `/api/admin/accounts/{contaId}/activate-founder` | Header admin | Ativa Plano Fundador de uma conta |

## Contratos

### Request

```json
{}
```

Header:

```txt
X-Emprely-Admin-Key: <chave>
```

### Response

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "nome": "Emprely",
  "slug": "emprely-abc12345",
  "plano": "Fundador",
  "statusComercial": "FundadorAtivo",
  "trialEndsAt": "2026-05-19T00:00:00+00:00",
  "planoFundadorAtivadoAt": "2026-05-12T00:00:00+00:00",
  "planoFundadorPrecoMensal": 19.9
}
```

## Regras de negocio

- Usuario comum nao ativa Plano Fundador.
- Operador interno ativa Fundador por conta.
- Ativacao e idempotente.

## Validacoes

- Chave ausente: 401.
- Chave invalida: 403.
- Chave configurada com menos de 32 caracteres: 503.
- Conta inexistente: 404.

## Dados e persistencia

- Buscar conta por `contaId`.
- Executar `ActivatePlanoFundador()`.
- Salvar alteracoes.

## Erros esperados

- 401 sem header admin.
- 403 com header invalido.
- 404 para conta inexistente.
- 503 quando `AdminOperacoes:OperationsKey` nao esta configurada corretamente.

## Testes

- Unitarios: dominio ja cobre idempotencia.
- Integracao: rota antiga bloqueada, admin sem chave, admin com chave valida.
