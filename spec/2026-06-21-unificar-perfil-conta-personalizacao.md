# Spec - Unificar Perfil da Conta, Configuracoes e Personalizacao

## Objetivo

Unificar a experiencia de configuracao inicial da conta em uma unica area chamada `Perfil da conta`, removendo a duplicidade de menus entre `Configuracoes` e `Personalizacao`.

## Comportamento esperado

### Menu

- O menu de conta no desktop deve exibir apenas:
  - `Perfil da conta`;
  - `Sair`.
- O drawer mobile deve exibir apenas `Perfil da conta` na secao de conta.
- A entrada publica `Personalizacao` deve deixar de existir.
- Se algum fluxo interno tentar navegar para `personalizacao`, o app deve abrir `conta`.

### Pagina Perfil da conta

A pagina deve reunir:

- dados do negocio;
- contato comercial;
- marca/logomarca;
- tema visual do sistema;
- cores dos templates;
- formato preferido de envio;
- template padrao de proposta;
- seguranca de acesso.

A pagina deve informar quais dados sao necessarios para concluir o passo do onboarding:

- nome comercial;
- segmento;
- e-mail de contato;
- telefone/WhatsApp;
- template padrao;
- cores dos templates;
- formato preferido.

### Dashboard e onboarding

- O card `Perfil da conta` deve explicar que o passo envolve marca, contato, cores, formato e template.
- O CTA deve usar linguagem de conclusao, como `Completar perfil`.
- O tour inicial deve:
  - explicar menus primeiro;
  - orientar a configuracao da conta em uma area unica;
  - explicar templates, cores e formato dentro da mesma view.

## Regras de implementacao

- Nao alterar API, banco ou contratos.
- Preservar o formulario atual de perfil e o preview de templates.
- Preservar ids/testids existentes quando possivel.
- Preferir refatoracao incremental em `apps/web/src/App.tsx` e `apps/web/src/styles.css`.
- Manter compatibilidade tecnica com o valor legado `personalizacao`, normalizando a navegacao para `conta`.

## Testes

Executar:

- `pnpm --filter web lint`
- `pnpm web:build:beta`

Validar visualmente:

- desktop: menu de conta, pagina `Perfil da conta`, tour e blocos de preferencias;
- mobile: drawer, empilhamento dos cards e ausencia de overflow horizontal.

## Criterios de aceite

- O usuario entende o que falta para concluir o passo `Perfil da conta`.
- Todos os campos necessarios para conclusao do perfil estao acessiveis na mesma pagina.
- Nao ha menu independente `Personalizacao`.
- O tour inicial aponta para os alvos corretos apos a unificacao.
- Build e lint do webapp passam.
