# Spec - Login Exclusivo Motion Emprely

## Escopo

Refatorar a tela publica de login/cadastro para uma experiencia exclusiva Emprely.

## Requisitos Funcionais

- Cadastro continua usando `registerMutation`.
- Login continua usando `loginMutation`.
- Alternancia `Cadastro/Login` continua disponivel.
- Mensagens de erro e sessao expirada continuam visiveis.
- Campos permanecem acessiveis por label para testes e acessibilidade.

## Requisitos Visuais

- Desktop: layout em duas colunas, com cena visual da marca à esquerda e formulario à direita.
- Mobile: layout empilhado, com cena visual compacta antes do formulario.
- Usar simbolo/logo Emprely e cores roxo, azul e teal.
- Incluir elemento visual inspirado nas tres faixas fluidas da logomarca.
- Evitar parecer template generico de login.

## Requisitos De Motion

- Entrada suave da pagina e dos grupos principais.
- Fitas fluidas com animacao leve e contínua.
- Hover/focus com transicoes discretas.
- `prefers-reduced-motion` deve reduzir animacoes a estado estatico.
- Usar apenas CSS/transitions nativas.

## Fora De Escopo

- Adicionar GSAP, Framer Motion ou outra biblioteca.
- Alterar endpoints ou contratos.
- Alterar telas autenticadas.
- Criar rota fisica separada.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`
- Screenshot/headless desktop e mobile conferindo layout, ausencia de overflow e footer estatico.
