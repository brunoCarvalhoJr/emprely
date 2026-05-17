# Analise Web - CRUD com grid de listagem

## Contexto

Mudanca afeta somente o app React/Vite em `apps/web`. O objetivo e melhorar usabilidade operacional, deixando listagem como ponto de entrada para clientes, servicos/pacotes e propostas.

## Ajustes previstos

- Adicionar modos de tela por entidade.
- Atualizar handlers de navegacao para resetar cada modulo para listagem.
- Converter listagens de cards para tabelas responsivas usando o visual `data-table`.
- Reaproveitar formularios atuais para criar/editar.
- Criar views de detalhe para visualizacao.

## Riscos

- E2E atual assume que o formulario aparece logo apos clicar no menu. Os testes devem ser atualizados para clicar em `Novo`.
- Como `App.tsx` e grande, as mudancas devem ser feitas mantendo handlers e mutations existentes.

