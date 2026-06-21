# Spec - Simplificar upload de logomarca

## Visao geral

Refatorar o layout do upload de logomarca para uma experiencia visual simples: icone quando vazio, preview quando preenchido, tipos aceitos abaixo e lixeira no topo direito.

## Escopo

Inclui:

- Ajuste visual do bloco de upload da logomarca.
- Remocao de frases explicativas solicitadas.
- Reposicionamento da lixeira para o topo direito do anexo.
- Manutencao do comportamento de upload, remocao e salvamento.

Fora do escopo:

- Alterar processamento de imagem.
- Alterar API.
- Alterar persistencia da logomarca.

## Fluxo ponta a ponta

1. Usuario abre configuracoes.
2. Se nao houver logomarca, o quadrado mostra icone de upload.
3. Se houver imagem, o quadrado mostra preview.
4. Tipos aceitos aparecem abaixo do quadrado.
5. Se houver imagem/anexo, a lixeira aparece no canto superior direito.
6. Salvar perfil continua persistindo a mudanca.

## Requisitos

- Remover "Logomarca salva no perfil".
- Remover "Arraste e solte ou selecione uma imagem".
- Remover texto sobre rascunho/salvar perfil.
- Manter chips de tipos aceitos abaixo do quadrado.
- Usar icone quando nao houver imagem.

## Regras de negocio

- Remocao de logomarca salva continua com confirmacao.
- Remocao de selecao pendente deve ser imediata.

## Impactos por projeto

- API: nenhum.
- Web: `App.tsx` e `styles.css`.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- O bloco nao exibe as frases removidas.
- A lixeira aparece acima do anexo, no canto direito, quando aplicavel.
- O estado vazio mostra icone de upload/drag and drop.
- Os tipos aceitos aparecem abaixo do quadrado.
- Lint e build do web passam.

## Estrategia de implementacao

- Reestruturar o JSX do bloco de logomarca.
- Adicionar classes CSS focadas no novo layout.
- Validar textos removidos por busca.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- Busca textual das frases removidas.
