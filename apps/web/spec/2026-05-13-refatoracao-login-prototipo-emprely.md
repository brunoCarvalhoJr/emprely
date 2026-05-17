# Spec Web - Refatoracao Login Prototipo Emprely

## User Story

Como usuario do Emprely, quero uma tela de login/cadastro visualmente alinhada à identidade da marca, para perceber o produto como profissional desde o primeiro acesso.

## Requisitos

- O layout desktop deve ser horizontal, com area de marca à esquerda e formulario à direita.
- O layout mobile deve ser vertical, com area de marca no topo.
- A paleta deve usar as cores Emprely: roxo, azul, teal e neutros claros.
- A transicao cadastro/login deve continuar por controle segmentado.
- Erros e mensagem de sessao devem continuar aparecendo no painel do formulario.
- O card deve ter sombra, bordas suaves e boa leitura.

## Aceite Tecnico

- `AuthContent` continua recebendo as mesmas props.
- Os campos seguem acessiveis pelos labels atuais.
- Nenhum endpoint ou contrato de API muda.
- O footer permanece estatico no fluxo do documento.
- Validar com `pnpm --dir apps/web lint` e `pnpm --dir apps/web build`.
