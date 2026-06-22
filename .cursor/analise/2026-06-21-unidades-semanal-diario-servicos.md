# Análise - Unidades semanal e diária em serviços

## Contexto

No cadastro de serviços e pacotes, o campo `Unidade` oferece apenas `Único`,
`Mensal`, `Por hora` e `Por item`. Para serviços recorrentes de social media,
consultoria, suporte ou rotinas operacionais, faltam unidades naturais como
`Semanal` e `Diário`.

## Decisão

Adicionar `Semanal` e `Diario` como valores reais do domínio, e não apenas como
rótulos do front. Como a API valida a unidade por enum e persiste o valor como
string, a alteração deve incluir:

- enum `UnidadeServico` no domínio;
- tipo `UnidadeServico` no web;
- schema de validação do formulário;
- opções do select;
- formatador usado em cards, detalhes e propostas.

## Critérios de aceite

- O cadastro de serviço exibe as opções `Semanal` e `Diário`.
- O usuário consegue salvar serviço/pacote com unidade semanal.
- O usuário consegue salvar serviço/pacote com unidade diária.
- Listagens e detalhes exibem as unidades com texto legível em pt-BR.
- A alteração não exige migração de banco, pois a coluna já persiste o enum como
  string com tamanho suficiente.
