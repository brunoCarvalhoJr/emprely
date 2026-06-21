# Analise - Login independente do tema escuro

## Contexto

No mobile, quando o usuario ativava o tema escuro no app e voltava para a tela de login, a pagina publica de autenticacao herdava variaveis globais de tema. O resultado visual era um card claro com textos quase brancos e campos escuros, prejudicando leitura e preenchimento.

## Causa

O tema visual e aplicado no `document.documentElement.dataset.theme`. As regras globais `:root[data-theme="dark"]` alteram variaveis e estilos genericos de `body`, textos, inputs e superficies. A tela de login usa classes especificas (`.auth-*`), mas tambem depende de variaveis globais como `--foreground`, `--muted`, `--field-bg` e `--field-bg-focus`.

Como o login e uma superficie publica e independente da preferencia operacional do usuario logado, ele nao deve reagir ao tema escuro salvo.

## Decisao

Blindar a area publica de autenticacao no CSS, definindo uma paleta clara local em `.app-frame-public` e sobrescrevendo os principais elementos da tela de login: painel, titulo, textos, labels, inputs, tabs, links e acoes.

## Fora de escopo

- Alterar persistencia do tema visual.
- Mudar contratos de API.
- Refatorar historico completo de CSS da autenticacao.
- Alterar o tema escuro do app autenticado.

## Aceite

- Com `data-theme="dark"`, a tela de login permanece em tema claro.
- Titulos, labels, textos auxiliares e links ficam legiveis.
- Campos de e-mail e senha ficam claros, com placeholder visivel.
- O botao de mostrar senha e as tabs continuam com contraste adequado.
- A cor do tema escuro continua funcionando normalmente dentro do app autenticado.
