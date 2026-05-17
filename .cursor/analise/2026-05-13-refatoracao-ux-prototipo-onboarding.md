# Analise - Refatoracao UX do SaaS pelo prototipo

## Contexto

O usuario validou os fluxos principais, mas pediu uma revisao de usabilidade e alinhamento visual com o prototipo `https://emprely.lovable.app`. A principal meta do SaaS e criar orcamentos de forma simples, pratica e rapida.

## Objetivo

Refatorar a experiencia do SaaS para reduzir friccao na criacao de orcamentos, melhorar listagens grandes, esconder primeiros passos quando concluidos, exibir upsell correto no Trial e permitir personalizacao da marca do negocio.

## Projetos impactados

- API: permitir logo anexada no perfil da conta como data URL reduzida.
- Web: refatoracao de layout, dashboard, listagens, onboarding, perfil/marca e rodape.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactado.
- Infra: possivel migration EF.

## Fluxo atual

- O dashboard mostra "MVP funcional" mesmo para usuarios em Trial.
- Primeiros passos continuam aparecendo mesmo quando todos estao concluidos.
- Clientes, servicos e propostas usam listas simples sem paginacao flexivel.
- O perfil aceita apenas `Logo URL`, sem upload assistido.
- A barra superior prioriza Emprely, nao a marca configurada pelo usuario.
- Nao existe rodape com suporte/contato.

## Fluxo proposto

1. Dashboard usa estrutura inspirada no prototipo: sidebar clara, conteudo amplo, cards/tabelas densas e CTA de nova proposta.
2. Primeiros passos aparecem somente enquanto houver pendencia.
3. Trial mostra apenas tarja de plano/marca d'agua/upgrade; Fundador nao ve essa tarja.
4. Clientes, servicos e propostas recebem busca, filtros, seletor de tamanho de pagina e paginacao.
5. Botao `+ Novo Cliente`, `+ Novo servico` e `+ Nova proposta` fica acima da listagem.
6. Ao criar cliente/servico, formulario limpa e permanece pronto para novo cadastro; ao editar, volta para listagem.
7. Conta permite anexar logo, extrair cores basicas no frontend e sugerir aplicacao em modal.
8. Header passa a exibir a marca do usuario quando configurada e Emprely fica como marca secundaria.
9. Adicionar rodape com direitos reservados e suporte.

## Regras de negocio

- Nao alterar a regra de status de propostas.
- Trial continua podendo ou nao exportar conforme regra atual; a tarja deve incentivar upgrade quando plano for Trial.
- A marca da proposta deve usar `PerfilConta` quando existir.
- Sem upload para storage externo no MVP; logo anexada sera reduzida no frontend antes de salvar.

## Impactos tecnicos

- `PerfilConta.LogoUrl` precisa aceitar data URL maior que 500 caracteres.
- Web precisa de paginacao local e modal de sugestao de marca.
- E2E existente deve continuar passando pelos labels atuais.

## Riscos

- Data URLs grandes podem pesar payload se nao forem reduzidas no frontend.
- Mudancas extensas no `App.tsx` podem quebrar seletores dos testes.
- Paginacao pode esconder item recem-criado se a pagina nao for resetada.

## Duvidas

- Nenhuma duvida bloqueante. Para o MVP, usar WhatsApp de suporte como link configuravel futuramente; nesta etapa usar texto e link generico sem secret.
