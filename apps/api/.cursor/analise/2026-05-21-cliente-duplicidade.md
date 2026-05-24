# Analise API - Duplicidade no cadastro de cliente

## Contexto

Clientes sao criados por `/api/customers` em telas diferentes do sistema: cadastro avulso e fluxo de nova proposta. A regra precisa ficar na API para impedir duplicidade independentemente da origem.

## Objetivo

Bloquear criacao de cliente quando ja existir cliente ativo da mesma conta com os mesmos identificadores comerciais.

## Campos considerados

- `Nome`: obrigatorio, comparado sempre.
- `Telefone`: opcional, comparado apenas quando preenchido.
- `Email`: opcional, comparado apenas quando preenchido.
- `Documento`: opcional, comparado apenas quando preenchido.

## Normalizacao

- `Nome`: trim, espacos internos colapsados e comparacao sem diferenciar maiusculas/minusculas.
- `Telefone`: manter persistencia atual, mas comparar somente digitos e remover prefixo `55` quando houver.
- `Email`: trim e comparacao sem diferenciar maiusculas/minusculas.
- `Documento`: comparar somente digitos para aceitar CPF/CNPJ com ou sem mascara.

## Escopo tecnico

- Aplicar a regra em `POST /api/customers`.
- Reusar a mesma regra em `PUT /api/customers/{id}` ignorando o proprio cliente editado, para nao permitir duplicidade por edicao.
- Retornar erro de validacao por campo para a UI exibir a causa.

## Multi-tenancy

A busca de duplicidade fica limitada a `ContaId` da conta autenticada e somente clientes `Ativo`.

## Riscos

- Telefones existentes podem estar salvos com mascara diferente; por isso a comparacao precisa ser canonica por digitos.
- Nome com pequenas variacoes de acento ainda pode ser considerado diferente. A regra inicial nao faz normalizacao sem acento para evitar falsos positivos.

## Duvidas

- Nenhuma bloqueante. `Etc` foi tratado como e-mail e CPF/CNPJ por serem identificadores diretos de cliente.
