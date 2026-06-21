# Analise: onboarding inicial com tour spotlight no mobile

## Contexto

O modal de guia inicial estava cortando em telas mobile, especialmente com a barra do navegador ocupando parte do viewport. Alem disso, a experiencia desejada e um passo a passo automatico no primeiro acesso, com fundo escuro e foco apenas na parte explicada da interface.

## Pesquisa e referencia

O padrao de UX e conhecido como product tour, coach marks ou tooltip overlay. Para mobile, a boa pratica e manter o tour curto, contextual e progressivo, guiando o usuario ate o primeiro valor sem bloquear demais a tela.

O React Joyride v3 ja usado no projeto oferece overlay com recorte SVG, `overlayColor`, `spotlightPadding` e `spotlightRadius`, que atendem ao comportamento desejado de escurecer a tela e destacar o alvo.

## Decisao

- O primeiro login autenticado deve iniciar automaticamente o tour spotlight quando `onboarding.tour.status` for `NaoIniciado`.
- Usuarios antigos que ja logaram, mas ainda estao com tour `NaoIniciado` ou `EmAndamento`, tambem recebem o tour.
- O tour e marcado como exibido no backend ao iniciar, e como concluido ou pulado quando o usuario finaliza.
- O tour deve navegar automaticamente entre Dashboard, Configuracoes e Personalizacao para explicar a configuracao da conta antes da criacao do primeiro orcamento.
- Depois da configuracao da conta, o tour volta ao Dashboard e explica cliente, servico e nova proposta como caminho para o primeiro orcamento completo.
- O modal de guia inicial deixa de ser a abertura automatica principal e fica como fallback/manual no botao "Abrir guia inicial".
- O modal ganha altura maxima e rolagem interna no mobile para nao cortar.

## Criterios de aceite

- No mobile, o guia inicial nao pode cortar conteudo ou botoes.
- O primeiro acesso deve abrir um tour com overlay escuro e foco no elemento atual.
- O tour deve aparecer pelo menos uma vez para usuarios que ainda nao concluiram ou pularam as instrucoes iniciais.
- O tour deve ensinar primeiro dados da conta, logomarca, template, cores e formato de envio.
- O tour deve ensinar depois cliente, servico e geracao do primeiro orcamento.
- O usuario pode pular ou concluir o tour.
- O tour deve usar textos curtos e botoes em portugues.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
