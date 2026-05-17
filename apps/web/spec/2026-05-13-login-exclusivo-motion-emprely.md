# Spec Web - Login Exclusivo Motion Emprely

## User Story

Como usuario, quero uma tela de acesso com identidade exclusiva da Emprely, para sentir que estou entrando em um produto profissional e proprio, nao em um template generico.

## Comportamento

- A tela publica exibe uma composicao de marca e um formulario.
- O usuario pode alternar entre cadastro e login.
- O botao principal muda entre `Criar conta` e `Entrar`.
- Erros de validacao/backend aparecem no formulario.

## Layout

- Desktop:
  - cena visual da marca à esquerda;
  - formulario em painel à direita;
  - elementos de produto como mini-preview de proposta/orcamento.
- Mobile:
  - cena visual compacta;
  - formulario abaixo;
  - sem rolagem lateral.

## Motion

- Ribbons da marca flutuam de forma lenta.
- Cards entram com fade/translate.
- Campos e botoes têm microinteracao de foco/hover.
- Reduced motion desativa loops e deixa apenas estados estaticos.

## Aceite

- Tela nao replica o print anterior.
- A composicao remete à logomarca Emprely.
- `lint`, `build` e E2E passam.
- Desktop/mobile validados por screenshot.
