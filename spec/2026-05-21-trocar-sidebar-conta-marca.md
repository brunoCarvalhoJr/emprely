# Spec - Trocar conta e marca no menu lateral

## Escopo

Atualizar a ordem visual dos blocos no sidebar do app web.

## Requisitos

- O menu da conta/cliente deve aparecer no topo da barra lateral.
- A marca Emprely Orcamentos deve aparecer na parte inferior da barra lateral.
- O dropdown da conta deve continuar acessivel e abrir em direcao adequada ao novo posicionamento.
- O menu recolhido deve continuar funcional.
- A navegacao principal e os botoes de acao rapida nao devem mudar de comportamento.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
