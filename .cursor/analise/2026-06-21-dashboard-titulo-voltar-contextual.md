# Analise - Titulo do dashboard e voltar contextual

## Contexto

Na tela inicial autenticada, o app exibe metricas, atalhos e propostas recentes, mas nao tem um titulo claro da pagina. Isso deixa a tela parecendo uma area solta, principalmente no desktop com sidebar recolhida.

O usuario tambem pediu botoes de voltar em todas as paginas, com logica inteligente. O app ja possui historico interno para refresh, modal, menu mobile e botao voltar do navegador. A melhoria deve aproveitar esse mecanismo e evitar um botao generico que sempre volte para o dashboard.

## Problema observado

- Dashboard sem titulo institucional visivel.
- Paginas principais tem estruturas diferentes de cabecalho.
- Fluxos podem ser interrompidos: por exemplo, o usuario esta criando uma proposta e precisa sair para cadastrar cliente ou servico.
- Em desktop, um botao voltar no cabecalho melhora orientacao.
- Em mobile, inserir um botao voltar fixo em todas as paginas pode competir com a topbar e com o botao voltar fisico/gestual. O ideal e mostrar retorno contextual apenas quando houver uma tela interna ou uma origem util.

## Decisao de UX

Titulo recomendado para a home: **Painel comercial**.

Justificativa:
- "Dashboard" e tecnico e generico.
- "Inicio" e pouco informativo.
- "Painel comercial" comunica o papel da tela no Emprely: acompanhar clientes, servicos, propostas, status e proximos fechamentos.

## Logica de voltar

Criar uma acao centralizada de retorno contextual:

1. Se houver contexto pendente de proposta interrompida, voltar para a proposta e etapa salva.
2. Se estiver em modo interno da area atual, voltar para a lista da propria area.
3. Se a ultima area principal anterior for conhecida, voltar para ela.
4. Se nada disso existir, voltar para o dashboard.

Para os fluxos interrompidos, quando o usuario sair da proposta para cadastrar cliente ou servico pela acao do sistema, salvar uma origem contextual. Ao concluir/cancelar ou clicar Voltar, retornar para a proposta quando fizer sentido.

## Aplicacao visual

- Adicionar cabecalho `page-heading` no dashboard com titulo `Painel comercial` e subtitulo curto.
- Criar componente `PageBackButton` reutilizavel.
- Exibir voltar em paginas internas no desktop e em mobile apenas quando houver contexto real de retorno.
- Manter botoes internos ja existentes, como voltar de formulario/lista, mas alinhar com o novo padrao quando possivel.

## Criterios de aceite

- Dashboard exibe titulo `Painel comercial`.
- Paginas principais exibem botao voltar quando existe destino util.
- Ao sair de uma proposta para cadastrar cliente ou servico, o botao Voltar retorna para a proposta em andamento.
- Ao estar em cadastro/edicao/visualizacao, Voltar retorna para a lista da propria area.
- No dashboard, o botao voltar nao aparece sem contexto.
- No mobile, o botao so aparece quando ajuda a recuperar contexto ou sair de uma tela interna.
