# Spec API - Propostas Rascunho CRUD

## Visao geral

Adicionar a primeira versao de propostas/orcamentos: uma proposta pertence a conta autenticada, tem um cliente, dados de texto simples e uma lista de itens com quantidade e valor unitario.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/proposals` | Bearer JWT | Lista propostas nao arquivadas da conta atual. |
| GET | `/api/proposals/{id}` | Bearer JWT | Retorna uma proposta da conta atual. |
| POST | `/api/proposals` | Bearer JWT | Cria proposta em rascunho. |
| PUT | `/api/proposals/{id}` | Bearer JWT | Atualiza dados e itens da proposta. |
| DELETE | `/api/proposals/{id}` | Bearer JWT | Arquiva proposta. |

## Request

```json
{
  "clienteId": "guid",
  "titulo": "Proposta Social Media",
  "introducao": "Plano mensal para Instagram.",
  "observacoes": "Validade de 7 dias.",
  "validadeDias": 7,
  "itens": [
    {
      "servicoId": "guid",
      "nome": "Gestao mensal de Instagram",
      "descricao": "Planejamento e publicacao.",
      "quantidade": 1,
      "valorUnitario": 1200.00
    }
  ]
}
```

## Response

```json
{
  "id": "guid",
  "clienteId": "guid",
  "clienteNome": "Maria Cliente",
  "titulo": "Proposta Social Media",
  "introducao": "Plano mensal para Instagram.",
  "observacoes": "Validade de 7 dias.",
  "validadeDias": 7,
  "status": "Rascunho",
  "total": 1200.00,
  "itens": [
    {
      "id": "guid",
      "servicoId": "guid",
      "nome": "Gestao mensal de Instagram",
      "descricao": "Planejamento e publicacao.",
      "quantidade": 1,
      "valorUnitario": 1200.00,
      "total": 1200.00,
      "ordem": 1
    }
  ],
  "createdAt": "2026-05-12T00:00:00Z",
  "updatedAt": null
}
```

## Regras de negocio

- `ContaId` vem do token.
- `ClienteId` deve existir, estar ativo e pertencer a conta atual.
- `ServicoId`, quando informado, deve existir, estar ativo e pertencer a conta atual.
- Proposta nasce com status `Rascunho`.
- Atualizacao substitui os itens da proposta.
- Proposta deve ter pelo menos um item.
- `DELETE` muda status para `Arquivada`.
- Listagem retorna apenas propostas nao arquivadas.

## Validacoes

- `titulo`: obrigatorio, maximo 160.
- `introducao`: opcional, maximo 1000.
- `observacoes`: opcional, maximo 1000.
- `validadeDias`: opcional, entre 1 e 365.
- `itens`: obrigatorio, minimo 1, maximo 50.
- item `nome`: obrigatorio, maximo 160.
- item `descricao`: opcional, maximo 1000.
- item `quantidade`: maior que zero.
- item `valorUnitario`: maior ou igual a zero.

## Persistencia

- Criar tabela `propostas`.
- Criar tabela `proposta_itens`.
- FKs: proposta -> conta, proposta -> cliente, item -> proposta, item -> servico opcional.
- Indices: `conta_id`, `cliente_id`, `proposta_id`, `servico_id`.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update`
- Smoke: register/login, criar cliente, criar servico, criar proposta, listar, buscar, atualizar, arquivar.
