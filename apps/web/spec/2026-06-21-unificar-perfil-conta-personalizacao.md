# Spec Web - Perfil da Conta Unificado

## Objetivo

Refatorar a navegacao do webapp para substituir os menus separados `Configuracoes` e `Personalizacao` por uma unica experiencia chamada `Perfil da conta`.

## Escopo

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- Tour inicial e primeiros passos do dashboard

## Fluxo

1. Usuario abre o menu de conta.
2. Usuario clica em `Perfil da conta`.
3. App mostra dados comerciais, contato, marca, tema, cores, formato e template na mesma pagina.
4. Usuario salva o perfil.
5. Dashboard consegue marcar o passo como concluido quando os campos obrigatorios ja existem.

## Criterios funcionais

- Remover `Personalizacao` do menu desktop e mobile.
- Renomear `Configuracoes` para `Perfil da conta`.
- Normalizar navegacoes internas para `personalizacao` abrindo a view `conta`.
- Renderizar as preferencias de proposta dentro da tela `conta`.
- Atualizar textos do dashboard e tour para a nova estrutura.

## Criterios visuais

- Desktop deve apresentar blocos escaneaveis, sem parecer duas paginas coladas.
- Mobile deve empilhar os blocos sem corte horizontal.
- O usuario deve conseguir identificar rapidamente o que falta para concluir o perfil.

## Nao escopo

- Alteracao de backend.
- Alteracao de banco.
- Mudanca nas regras de obrigatoriedade.
- Nova biblioteca de componentes.
