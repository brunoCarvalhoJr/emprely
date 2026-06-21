# Spec - Preview, refresh e botao voltar

## Objetivo

Melhorar a continuidade de uso do app autenticado e a inspecao visual de templates/propostas.

## Comportamento esperado

1. Preview de template/proposta
   - Ao abrir, o documento deve aparecer inteiro no viewport sempre que possivel.
   - Usuario deve poder alternar entre `Inteiro`, `Zoom` e `100%`.
   - Preview de template da personalizacao deve ter os mesmos controles do preview da proposta.

2. Refresh
   - Ao atualizar a pagina autenticada, o app deve voltar para a ultima tela principal.
   - Se estava em cadastro/edicao/visualizacao de cliente, servico ou proposta, o modo deve ser restaurado.
   - IDs selecionados e etapa do assistente devem ser restaurados quando existirem.

3. Botao voltar do navegador
   - Se houver modal aberta, deve fechar a modal.
   - Se o menu mobile, menu da conta ou modal de onboarding estiver aberto, deve fechar essa camada antes de qualquer navegacao.
   - Se estiver em etapa interna do assistente/proposta, deve voltar uma etapa.
   - Se estiver em formulario/visualizacao, deve voltar para a lista da area.
   - Nao deve sair do app autenticado por acidente.
   - Ao fechar uma camada aberta pelo botao voltar no celular, a pagina deve manter a posicao atual de scroll.

## Criterios de aceite

- Atualizar no perfil da conta e permanecer em `Perfil da conta`.
- Atualizar em nova proposta e permanecer no fluxo de proposta.
- Abrir preview de template e ver documento inteiro por padrao.
- Botao voltar com preview aberto fecha o preview.
- Botao voltar com menu mobile aberto fecha apenas o menu.
- Botao voltar com qualquer modal aberta fecha apenas a modal e nao joga a tela para o topo.
- Botao voltar em formulario interno volta para a lista, sem sair do dominio.
