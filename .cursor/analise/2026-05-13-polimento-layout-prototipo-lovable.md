# Analise - Polimento layout SaaS pelo prototipo Lovable

## Contexto

O usuario pediu para refatorar o layout do SaaS seguindo o prototipo `https://emprely.lovable.app/` e os prints anexados anteriormente. O produto e operacional: o objetivo principal e criar orcamentos/propostas de forma simples, pratica e rapida.

## Observacoes do prototipo

- Sidebar fixa clara, com marca no topo, menu vertical simples e identidade do negocio no rodape da sidebar.
- Topbar compacta no conteudo com contexto do workspace, sem card grande de sessao ocupando a primeira dobra.
- Dashboard com hero curto, CTA direto para nova proposta e acesso aos servicos.
- Metricas em quatro cards grandes e escaneaveis.
- Historico de propostas em tabela limpa, com acoes simples.
- Telas internas mantem o mesmo fundo suave lilas/azul/teal e cards brancos com borda discreta.

## Problemas no estado atual

- O app ainda tem um header global e um card de sessao que deixam a primeira dobra mais pesada que o prototipo.
- O dashboard mostra cinco metricas e cards de acoes extras, deixando a tela menos parecida com o prototipo.
- As telas de cadastro/listagem precisam de cabecalho mais claro e uma estrutura visual mais consistente.
- O visual pode ficar mais proximo da identidade Emprely sem copiar a marca PropostaZap do prototipo.

## Decisoes

- Manter Emprely Orcamentos como marca do SaaS.
- Refatorar apenas frontend nesta rodada.
- Preservar fluxos ja implementados: login, cadastro, clientes, servicos, propostas, impressao/PDF, WhatsApp, trial e primeiros passos.
- Manter `aria-label` dos itens de menu importantes para nao quebrar testes existentes.

## Perguntas

Sem duvidas bloqueantes. A referencia visual e suficiente para uma primeira passada de layout.

