# Analise Web - Refino de layout e legibilidade

## Area afetada

`apps/web/src/App.tsx` e `apps/web/src/styles.css`.

## Diagnostico de UI

- A tela de proposta usa grid ampla `1fr / 0.9fr`, deixando o preview grande demais.
- O formulario principal nao tem etapas visuais claras; isso torna a criacao menos rapida.
- O card de cliente rapido e o card de catalogo usam o mesmo peso visual dos campos obrigatorios.
- O preview inicial exibe muita moldura quando ainda nao ha cliente ou itens.

## Plano tecnico

- Ajustar grid de proposta para formulario dominante e preview lateral controlado.
- Adicionar classes semanticas para builder, painel, secao e barra de total.
- Reorganizar a copia de apoio e labels para leitura direta.
- Ajustar preview para largura/espacamento menores e cabecalho mais limpo.
- Validar com comandos reais do web.
