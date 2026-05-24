# Spec API - Quantidade inteira nos itens da proposta

## Visao geral

Criacao e edicao de proposta devem aceitar apenas quantidade inteira positiva nos itens.

## Endpoints

| Metodo | Rota | Regra |
| --- | --- | --- |
| POST | `/api/proposals` | Cada item deve ter `quantidade` inteira maior que zero. |
| PUT | `/api/proposals/{id}` | Cada item deve ter `quantidade` inteira maior que zero. |

## Validacoes

- `quantidade < 1`: rejeitar.
- `quantidade` decimal: rejeitar com mensagem `Quantidade deve ser um numero inteiro.`

## Testes

- Dominio rejeita `1.5`.
- API rejeita proposta com quantidade decimal.
