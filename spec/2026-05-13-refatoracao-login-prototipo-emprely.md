# Spec - Refatoracao Login Prototipo Emprely

## Escopo

Refatorar a tela publica de login/cadastro do app web para reproduzir a estrutura visual do print anexado:

- Desktop: card horizontal centralizado, painel de marca à esquerda e formulario à direita.
- Mobile: card vertical com painel de marca no topo e formulario abaixo.
- Cores: degradê com roxo, azul e teal da identidade Emprely.
- Manter formularios, validacoes e mutations existentes.

## Fora de Escopo

- Alterar autenticacao da API.
- Alterar rotas autenticadas.
- Criar nova rota física de login.
- Trocar componentes de formulario globais.

## Criterios de Aceite

- A pagina publica nao exibe header superior.
- O card de autenticacao fica centralizado no primeiro viewport.
- No desktop, o painel de marca e formulario ficam lado a lado.
- No mobile, painel e formulario empilham sem sobreposicao.
- O formulario de cadastro continua enviando `registerMutation`.
- O formulario de login continua enviando `loginMutation`.
- O footer continua no fluxo normal da pagina, sem `position: fixed`.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` passam.
