# Spec - Login independente do tema escuro

## Objetivo

Garantir que a tela publica de login/cadastro do Emprely nao seja afetada pelo tema escuro escolhido dentro do app autenticado.

## Comportamento esperado

1. Ao acessar a tela de login com `data-theme="dark"` salvo, a pagina deve renderizar com paleta clara.
2. O card principal deve manter fundo branco/translucido claro.
3. Inputs de e-mail e senha devem ter fundo claro, texto escuro e placeholder legivel.
4. Titulo, labels, texto de troca de modo, links e mensagens auxiliares devem ter contraste adequado.
5. O restante do app autenticado deve continuar respeitando o tema escuro.

## Implementacao

- Adicionar uma camada CSS localizada em `.app-frame-public` e `.auth-isolated-page`.
- Reatribuir variaveis visuais locais para a autenticacao publica.
- Sobrescrever estilos de inputs, labels, textos e tabs dentro do login.
- Nao alterar estrutura React nem armazenamento do tema.

## Validacao

- `pnpm --filter web lint`
- `pnpm --filter web build`
- Verificacao visual mobile/desktop da tela de login com tema escuro ativo.
