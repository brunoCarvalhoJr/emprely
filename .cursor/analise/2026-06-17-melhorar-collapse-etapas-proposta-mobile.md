# Analise - Melhorar collapse de etapas da proposta no mobile

## Contexto

O resumo `Ver etapas` do fluxo de proposta abre uma lista com todas as etapas. No mobile, a lista aberta ficou visualmente quebrada: icones e textos ficaram desalinhados, alguns numeros colaram nos labels e o painel ocupou altura demais.

## Problema

- Os itens abertos nao tinham layout proprio de lista mobile.
- Os botoes herdavam pouco estilo estrutural, deixando texto e numero sem grid definido.
- O painel aberto ficava grande, com muito espaco vazio entre etapas.
- Faltava hierarquia de estado: concluido, atual e proximo.

## Decisao

- Transformar o painel aberto em lista vertical compacta.
- Cada item deve ter numero/check na esquerda, nome no centro e estado na direita.
- Reduzir altura, remover vazios e melhorar legibilidade.
- Manter a lista clicavel para navegar entre etapas permitidas.

