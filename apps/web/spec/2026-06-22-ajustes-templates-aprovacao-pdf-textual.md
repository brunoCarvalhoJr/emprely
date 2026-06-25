# Spec Web - Templates com aprovacao e PDF com link

## Visao geral

Atualizar os templates de orcamento para usar CTA padronizado de aprovacao, marca d'agua com logo Emprely, PDF visual em uma pagina com botao `Aprovar` clicavel e exportacao de imagem sem CTA.

## Rotas

- `/`: fluxo autenticado de propostas.
- `/aprovar-proposta/:token`: destino publico esperado pelo link de aprovacao.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: sem alteracao.
- Erro: falha de exportacao mostra mensagem existente.
- Sucesso: PDF e imagem sao gerados conforme formato escolhido.

## Componentes

- `PreviewPropostaVisual`
- `TemplateDocumentoProposta`
- `DocumentoFooter`
- `DocumentoLogoMarca`
- `DocumentoContatoInline`
- Funcoes de exportacao `gerarPdfPropostaBlob` e `gerarPngPropostaBlob`
- Area de link do CTA no PDF calculada pela posicao real de `.doc-footer-cta` ou `.doc-cta` no template renderizado.
- Areas de link de contatos no PDF calculadas pela posicao de elementos com `data-pdf-link-url`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Template visual | hidden/select UI | Sim | Valor conhecido em `propostaTemplateVisualValores` |

## Integracao com API

- Usar `publicApprovalUrl` retornado em `PropostaResponse`.
- Sem novo endpoint nesta etapa.

## Criterios de aceite

- Todos os CTAs dos templates exibem somente `Aprovar`.
- Quando houver URL publica, o CTA e um link.
- A exportacao PNG nao exibe o CTA `Aprovar`.
- A exportacao PDF preserva o layout visual de cada template e o botao `Aprovar` clicavel como link.
- A exportacao PDF nao precisa ter texto selecionavel.
- A exportacao PDF fica em uma unica pagina.
- A marca d'agua/selo usa logo Emprely legivel em fundos claros e escuros e exibe `Orcamentos` abaixo.
- A marca d'agua fica na posicao superior, menor e com opacidade reduzida, sem atrapalhar a leitura das informacoes do orcamento.
- A marca d'agua deve permanecer discreta, mas o texto `Emprely Orcamentos` precisa ser legivel no PDF final.
- A marca d'agua usa uma variante PNG da logo com escrita preta.
- Quando `perfilConta.logoUrl` existir, a logo/foto da conta aparece no bloco de marca dos orcamentos.
- A logo/foto da conta em PNG aparece sem fundo branco ou padding artificial criado pelo template.
- Os templates nao exibem frases que limitem o uso a nichos especificos como social media, trafego, UGC, midia kit, design ou consultoria.
- Telefone exibido no documento abre WhatsApp com o numero preenchido quando houver DDI/DDD/numeros suficientes.
- Email exibido no documento usa `mailto:` com destinatario preenchido.
- Instagram exibido no documento abre o perfil correspondente.
- Site exibido no documento abre a URL em nova aba.
- Quando Instagram e site existirem no perfil, os dois contatos aparecem e os dois ficam clicaveis.
- Contatos exibidos no cabecalho da marca tambem ficam clicaveis no HTML e no PDF quando forem Instagram ou site.
- Os links de contato tambem ficam clicaveis no PDF exportado.
- O modelo 6 (`InstagramPremium`) nao apresenta retangulo embaçado ou sombra sobre o texto/conteudo.
- No modelo 6, o painel lateral de metadados nao sobrepoe titulo, introducao ou resumo.
- O modelo 6 (`DarkGrowth`) compacta hero, listas, ciclo, investimento e observacoes para nao cortar a parte inferior.
- O modelo 2 (`OrcamentoSimplificado`) distribui melhor tabela e total, evitando excesso de quebras de linha na coluna de detalhamento.
- O modelo 2 mantem `Total final` e valor monetario dentro do card de total, sem vazar para fora do quadro.
- O modelo 9 (`CorporativoBoard`) compacta hero, cards, roadmap e rodape para nao cortar a parte inferior.
- O modelo 9 (`CorporativoBoard`) mantem margem interna inferior uniforme no rodape azul, sem contatos encostarem na base da caixa.
- O modelo 5 (`InstagramPremium`) compacta header, resumo, cards, entregas, investimento e rodape para nao cortar a parte inferior.
- O modelo 4 (`LunaSocialStudio`) compacta hero, beneficios, escopo, listas, cadencia, investimento e observacoes para nao cortar a parte inferior.
- Os templates nao exibem borda externa global ao redor do papel.
- Cards, tabelas e secoes internas podem manter bordas proprias do layout.

- Templates impressos/exportados nao exibem o nome do estilo visual do template, incluindo `Emprely Orcamentos`, `Executivo editorial`, `Board comercial` e `Institucional clean`.

## Testes

- Lint: `pnpm lint:web`
- Build: `pnpm build:web`
- E2E: `pnpm test:e2e:web` quando o navegador Playwright estiver instalado.
- Manual: gerar PDF e PNG de propostas em todos os templates.
