# Analise - Navegacao entre etapas da proposta no mobile

## Contexto

No fluxo de nova proposta, algumas etapas possuem muitos campos opcionais, principalmente `Detalhamento comercial` e `Revisao final`. No mobile, o usuario pode querer apenas avancar sem preencher todos os campos opcionais, mas a acao `Proximo` fica no final do conteudo.

## Problema

- A acao primaria da etapa depende de rolar ate o fim da pagina.
- Em etapas longas, o usuario perde contexto e precisa procurar o botao.
- O painel superior mostra o progresso, mas nao oferece navegacao direta para seguir o fluxo.
- A barra de acoes atual e sticky dentro da propria secao, mas so aparece quando o usuario chega perto dela.

## Decisao

- Adicionar uma barra fixa inferior exclusiva do mobile para navegacao do wizard.
- A barra deve exibir a etapa atual e a acao principal contextual.
- Em etapas intermediarias: `Voltar` e `Proximo`.
- Na primeira etapa: apenas `Proximo` como acao principal.
- Na revisao: `Salvar rascunho` e, quando aplicavel, `Gerar proposta`.
- Manter os botoes existentes no final das secoes para desktop e fallback.
- Ajustar o padding inferior do fluxo mobile para a barra nao cobrir campos.

## Riscos

- A barra fixa pode competir visualmente com `Salvar` e `Preview`.
- Em telas pequenas, muitos botoes podem ficar apertados.
- A revisao precisa respeitar estados de loading e bloqueios existentes.

## Mitigacao

- Usar apenas duas acoes principais na barra inferior.
- Manter `Salvar` e `Preview` como acoes secundarias no topo mobile.
- Usar labels curtos e icones existentes.
- Validar em viewport mobile de 390px sem overflow horizontal.
