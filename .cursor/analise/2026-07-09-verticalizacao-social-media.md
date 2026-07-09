# Analise - Verticalizacao social media

## Contexto

A exploracao de melhoria executada em `D:\Emprely\Testes\resultados\20260709231720-exploracao-melhorias-social` mostrou que o fluxo principal funciona, mas a experiencia ainda parece um orcamentador comercial generico. O publico prioritario do Emprely trabalha com social media, conteudo, trafego pago, creators, UGC e agencias pequenas.

## Objetivo

Deixar o app mais aderente ao vocabulario, aos pacotes, aos templates e ao fluxo de trabalho desse publico, sem introduzir migration ou novo backend nesta primeira entrega.

## Projetos impactados

- API: sem mudanca funcional prevista.
- Web: copy, presets, labels, templates e UX de formulario.
- Mobile: reflexo das mesmas mudancas de copy/presets/listas.
- Landing: nao impactado.
- Packages: nao impactado.
- Infra: nao impactado.

## Fluxo atual

Dashboard, servicos, clientes e propostas usam termos genericos como painel comercial, servicos, itens, proposta comercial, plano recorrente e pacote premium. O formulario de servico exige que o usuario escreva manualmente pacotes comuns do nicho. O cliente tem redes sociais e observacoes, mas nao orienta briefing de social media. A matriz de templates de teste descreve ofertas antigas mais especificas que a galeria atual.

## Fluxo proposto

1. Dashboard com linguagem de propostas, conteudo, follow-up e entregas.
2. Servicos com presets de pacotes reais de social media, trafego pago, UGC, branding e consultoria.
3. Cliente com orientacao de briefing, canais sociais e objetivo da marca.
4. Wizard de proposta com termos de entregaveis, canais, revisoes, verba e cronograma.
5. Templates renomeados para casos de uso do nicho mantendo os mesmos valores tecnicos.
6. Documentacao de teste atualizada para a matriz de templates social.

## Regras de negocio

- Nao remover templates tecnicos existentes nem quebrar propostas antigas.
- Nao criar campos persistidos novos sem spec posterior de backend.
- Presets devem ser opcionais e editaveis.
- Textos devem continuar funcionando para agencias e freelancers de servicos digitais.

## Impactos tecnicos

- Mudancas concentradas em `apps/web/src/App.tsx`.
- Atualizacao de rotina em `D:\Emprely\Testes\rotinasTeste\82-matriz-templates-status-campos-proposta.md`.
- Possivel necessidade futura de schema para briefing estruturado.

## Riscos

- Excesso de nicho pode reduzir flexibilidade; por isso os presets ficam editaveis.
- Renomear labels de templates pode exigir atualizar testes e roteiros.

## Duvidas

- Nenhuma bloqueante para a fase sem migration.
