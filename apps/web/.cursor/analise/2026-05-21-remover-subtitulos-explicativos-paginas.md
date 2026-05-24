# Analise - Remover subtitulos explicativos das paginas

## Componente afetado

`src/App.tsx`, com limpeza pontual em `src/styles.css`.

## Contexto tecnico

Os subtitulos alvo estao em blocos `page-heading`, no hero do dashboard e no bloco `auth-form-header`.

## Decisao

Remover apenas os textos de nivel de pagina, mantendo textos que carregam funcao operacional, como estados vazios, erros, helper texts e detalhes de formulacao de proposta.
