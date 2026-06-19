# Analise - Simplificar upload de logomarca

## Contexto

O bloco de upload da logomarca em configuracoes ficou explicativo demais, com textos repetidos sobre drag and drop, rascunho e status da imagem salva. O objetivo agora e tornar o componente mais visual e intuitivo.

## Objetivo

Simplificar o layout do drag and drop da logomarca, deixando o uso claro por icone, preview e acoes diretas, sem frases explicativas longas.

## Projetos impactados

- API: sem impacto.
- Web: tela de configuracoes em `apps/web/src/App.tsx` e estilos em `apps/web/src/styles.css`.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Fluxo atual

O bloco mostra preview ou placeholder, texto "Arraste e solte ou selecione uma imagem", status "Logomarca salva no perfil", complemento sobre rascunho e acoes abaixo do anexo.

## Fluxo proposto

O bloco deve mostrar um quadrado clicavel com icone quando nao houver imagem, preview quando houver imagem, tipos aceitos abaixo e lixeira no canto superior direito quando existir imagem/anexo removivel.

## Regras de negocio

- A logomarca continua sendo persistida apenas ao salvar o perfil.
- Limpar logomarca continua exigindo confirmacao.
- Remover imagem pendente continua cancelando apenas a selecao local.

## Impactos tecnicos

- Remover textos explicativos do bloco visual.
- Reposicionar a acao de lixeira sobre o anexo.
- Manter acessibilidade via `aria-label` e foco no dropzone.

## Riscos

- A reducao de texto nao pode remover controles essenciais.
- A lixeira sobreposta nao deve bloquear o clique no restante do anexo.

## Duvidas

- Nenhuma bloqueante.
