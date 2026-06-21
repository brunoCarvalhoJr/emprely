# Spec - Remover subtitulos explicativos das paginas

## Escopo

Simplificar os cabecalhos de pagina do app web.

## Requisitos

- A view de clientes deve mostrar apenas o titulo do cabecalho.
- A view de servicos deve mostrar apenas o titulo do cabecalho.
- A view de propostas deve mostrar apenas o titulo dinamico do cabecalho.
- A view de configuracoes deve mostrar apenas o titulo do cabecalho.
- A view de personalizacao deve mostrar apenas o titulo do cabecalho.
- O dashboard deve remover o paragrafo explicativo abaixo da chamada principal.
- Login/cadastro deve remover o subtitulo abaixo do titulo do formulario.
- Mensagens de vazio, erro, validacao e ajuda de campo devem permanecer.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
