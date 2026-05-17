# Analise - Login Exclusivo Motion Emprely

## Contexto

O usuario rejeitou a tela baseada no print anterior e pediu uma nova tela do zero, exclusiva, baseada no layout da logomarca Emprely, com animacao e transicoes. O app web atual usa React/Vite, Tailwind/CSS global e ja possui os assets `emprely-logo.svg` e `emprely-favicon.svg`.

## Objetivo

Criar uma tela publica de login/cadastro com identidade propria:

- fundo premium escuro/claro com profundidade;
- composicao inspirada nas tres faixas fluidas do simbolo Emprely;
- motion discreto e performatico;
- formulario claro e objetivo;
- responsividade desktop/mobile;
- sem mudar contratos de API ou fluxo de autenticacao.

## Direcao Visual

- Usar a logomarca como sistema: tres ribbons/faias com roxo, azul e teal.
- Formulario em painel de vidro branco, com hierarquia clara.
- Area visual com preview de proposta/orcamento para conectar a tela ao produto.
- Elementos animados devem reforcar velocidade, fluidez e profissionalismo.

## Motion

- Entrada escalonada do painel visual e do formulario.
- Fitas da marca com movimento leve em `transform`, sem animar layout.
- Microinteracao em foco dos campos e troca cadastro/login.
- Respeitar `prefers-reduced-motion`.
- Evitar dependencias novas; CSS nativo e React existente bastam para este escopo.

## Riscos

- Animacao excessiva pode prejudicar login rapido.
- Fundo escuro precisa manter contraste.
- Mobile precisa evitar altura excessiva e cortes.

## Perguntas

- Nao ha pergunta bloqueante. A identidade visual e o comportamento esperado foram definidos pelo usuario.
