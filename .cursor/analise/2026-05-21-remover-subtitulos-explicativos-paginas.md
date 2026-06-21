# Analise - Remover subtitulos explicativos das paginas

## Ideia

Simplificar as telas removendo textos explicativos logo abaixo dos titulos principais.

## Contexto

As views principais usam `page-heading` com titulo e subtitulo. O dashboard tambem mostra uma chamada principal seguida de um paragrafo explicativo, e a tela de login/cadastro tem um subtitulo abaixo do titulo do formulario.

## Decisao

- Remover subtitulos de cabecalho das paginas internas.
- Remover o paragrafo explicativo do hero do dashboard.
- Remover o subtitulo do formulario de login/cadastro.
- Preservar mensagens de erro, estados vazios e ajuda de campos, pois sao feedback operacional e nao subtitulos de pagina.

## Duvidas

Nao ha duvidas bloqueantes. O pedido prioriza uma interface mais simples e menos explicativa.
