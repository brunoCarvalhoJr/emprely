# Analise - Campos opcionais de endereco e numero no cliente

## Contexto

O cadastro completo de cliente ja possui nome, e-mail, telefone, CPF/CNPJ e observacoes. O usuario pediu dois campos opcionais novos: `Endereco` e `Numero`.

## Decisao

Adicionar os campos como dados opcionais persistidos no cadastro de cliente, sem criar novas colunas na listagem principal para preservar a responsividade das grids.

## Impacto

- API: entidade `Cliente`, contratos de request/response, controller, EF Core e migracao.
- Web: tipos do cliente, schema do formulario, valores padrao, mapeamento de payload e campos visuais.
- Testes: normalizacao do dominio e fluxo integrado de criacao de cliente.

## Riscos

- Contratos posicionais em C# precisam ser atualizados em todos os pontos de construcao.
- O banco precisa de migracao nullable para nao quebrar clientes existentes.
