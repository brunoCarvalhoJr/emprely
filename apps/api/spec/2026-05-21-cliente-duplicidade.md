# Spec API - Duplicidade no cadastro de cliente

## Visao geral

Impedir que a mesma conta cadastre clientes ativos duplicados por nome, telefone, e-mail ou CPF/CNPJ.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/customers` | JWT | Cria cliente somente se nao houver duplicidade ativa na conta. |
| PUT | `/api/customers/{id}` | JWT | Atualiza cliente somente se nao gerar duplicidade ativa na conta. |

## Regras de negocio

- `Nome` duplicado deve bloquear o cadastro.
- `Telefone` duplicado deve bloquear apenas quando o telefone foi preenchido.
- `Email` duplicado deve bloquear apenas quando o e-mail foi preenchido.
- `Documento` duplicado deve bloquear apenas quando CPF/CNPJ foi preenchido.
- Clientes arquivados nao entram na validacao de duplicidade.
- Contas diferentes podem ter clientes com os mesmos dados.

## Validacoes

- Retornar `400 Bad Request` com erros por campo quando houver duplicidade.
- Mensagens esperadas:
  - `Ja existe um cliente ativo com este nome.`
  - `Ja existe um cliente ativo com este telefone.`
  - `Ja existe um cliente ativo com este e-mail.`
  - `Ja existe um cliente ativo com este CPF/CNPJ.`

## Persistencia

- Sem migracao de banco nesta etapa.
- A comparacao canonica acontece na aplicacao para respeitar mascaras ja salvas.

## Testes

- Criacao rejeita duplicidade por nome, telefone, e-mail e CPF/CNPJ.
- Criacao permite telefone vazio quando os nomes sao diferentes.
- Edicao rejeita alterar um cliente para dados duplicados de outro cliente ativo.
