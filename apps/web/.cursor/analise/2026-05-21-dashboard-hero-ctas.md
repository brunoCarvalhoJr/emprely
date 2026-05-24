# Analise - Hero e CTAs do dashboard

## Componente afetado

`DashboardContent` em `src/App.tsx`.

## Contexto tecnico

O componente ja recebe `onCadastrarCliente`, `onNovaProposta` e `onSalvarServico`. Portanto, a nova acao de cliente nao exige novo estado nem mudanca de contrato entre telas.

## Decisao

Alterar apenas a marcacao do hero:

- converter o selo em chamada principal com fonte maior;
- remover o `h1` duplicado;
- incluir o botao de cliente ao lado das acoes existentes.
