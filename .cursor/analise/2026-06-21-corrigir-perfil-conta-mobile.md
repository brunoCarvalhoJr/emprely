# Analise - Correcao do formulario de perfil da conta no mobile

## Problema

No fluxo mobile, o usuario nao consegue preencher os dados do formulario de
perfil da conta com previsibilidade. A tela foi unificada recentemente para
juntar dados da conta, marca, cores, template e formato em uma unica pagina.

## Causa provavel

O mesmo `react-hook-form` passou a ser usado em dois formularios renderizados na
mesma view. Para permitir que cada formulario salvasse o perfil completo, foram
adicionados inputs `hidden` com nomes iguais aos campos editaveis do outro
formulario.

Na pratica, campos como `nomeComercial`, `telefoneContato`, `emailContato`,
`corPrimaria`, `corSecundaria` e `templateVisualPadrao` podem ficar registrados
mais de uma vez. Em mobile, com teclado virtual, foco e re-renderizacao, isso
pode fazer o input visivel perder controle do valor ou parecer bloqueado.

Tambem ha um problema de produto: o campo `E-mail de acesso` usa
`emailContato`, mas esta `readOnly`. Como o checklist exige e-mail de contato,
o usuario nao consegue corrigir ou completar esse dado pela propria tela.

## Decisao

- Manter a pagina unificada `Perfil da conta`.
- Remover registros duplicados por inputs `hidden`.
- Deixar `E-mail de acesso` como informacao somente leitura baseada no usuario.
- Criar `E-mail de contato` editavel e persistido no perfil.
- Preservar apenas inputs ocultos necessarios para campos controlados por botoes
  ou estado interno, sem duplicar nomes de campos visiveis.

## Aceite

- No mobile, o usuario consegue digitar em nome comercial, segmento, cidade,
  e-mail de contato, telefone, site e Instagram.
- O e-mail de acesso continua visivel e somente leitura.
- O e-mail de contato pode ser editado e salvo.
- A selecao de template, cores e formato continua funcionando.
- Nao ha regressao no formulario desktop.
