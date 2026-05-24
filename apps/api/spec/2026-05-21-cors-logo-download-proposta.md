# Spec API - CORS da logomarca na exportacao da proposta

## Visao geral

Ajustar a ordem dos middlewares para que arquivos estaticos da API, como logomarcas de perfil, recebam a politica de CORS configurada.

## Comportamento

- A politica `CorsAplicacaoOptions.PolicyName` deve ser aplicada antes de `UseStaticFiles`.
- Os endpoints autenticados continuam protegidos por autenticacao/autorizacao.
- A configuracao de origens permitidas continua sendo a fonte de verdade.

## Criterios de aceite

- Logomarcas servidas pela API podem ser consumidas pelo frontend em exportacoes de PDF/imagem.
- `dotnet build` passa.
