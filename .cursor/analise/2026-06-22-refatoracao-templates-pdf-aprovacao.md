# Analise - Refatoracao de templates, PDF selecionavel e aprovacao publica

## Contexto

Os templates de proposta do Emprely precisam deixar de parecer modelos presos a nichos especificos e passar a funcionar para qualquer servico vendido pelo usuario. A vistoria mostrou tambem que o PDF atual nao permite selecao de texto porque o fluxo gera um PNG do documento e insere essa imagem em um PDF via `jsPDF.addImage`.

## Problemas identificados

- Frases fixas como "Orcamento rapido WhatsApp", "Proposta comercial completa", "Consultoria e diagnostico" e "Design e identidade visual" amarram templates a cenarios especificos.
- O botao de aceite varia por template e nao aprova a proposta diretamente em um fluxo publico.
- A aprovacao atual da API exige usuario autenticado e so aceita propostas com status `Enviada`.
- O PDF exportado e uma imagem, entao o cliente nao consegue selecionar texto e os links nao funcionam como links reais.
- Alguns layouts ficam apertados com textos longos, especialmente cards de beneficios, tabelas com descricao e blocos de totais.
- A marca d'agua de trial usa texto simples, mas deve usar a identidade visual da Emprely.

## Direcao proposta

- Criar um link publico seguro de aprovacao por proposta, com token opaco e persistencia no banco.
- Padronizar todos os CTAs para `Aprovar`.
- Remover copy fixa de nicho dos templates e usar textos derivados da proposta.
- Manter preview HTML e exportacao de imagem, mas trocar a exportacao de PDF para um PDF textual.
- Usar componentes dedicados de PDF com o mesmo modelo de dados do preview, garantindo texto selecionavel e link de aprovacao clicavel.
- Usar a logo oficial da Emprely como marca d'agua quando a regra comercial exigir watermark.

## Escopo tecnico

- Dominio/API: `Proposta`, contratos, `ProposalsController`, EF Core e migracao.
- Web: `apps/web/src/App.tsx`, `apps/web/src/styles.css`, tipos de proposta e dependencias de PDF.
- Documentacao: spec do webapp e registro posterior em Notion/Obsidian.

## Fora de escopo

- Criar microservico de renderizacao de PDF.
- Mudar a regra de planos/trial alem da representacao visual da marca d'agua.
- Redesenhar o wizard inteiro de proposta.
- Alterar precificacao, clientes ou servicos fora do necessario para renderizar os templates.

## Riscos

- Divergencia visual entre preview HTML e PDF textual se os componentes ficarem duplicados demais.
- Dependencia de PDF aumentar o bundle do webapp.
- Aprovacao publica precisa ser tokenizada para evitar alteracao indevida de propostas.

## Decisoes

- O PDF deve ser textual e selecionavel. O PNG continua existindo apenas para compartilhamento como imagem.
- O link publico aprova propostas `Gerada` ou `Enviada`; se ja estiver `Aceita`, o resultado e idempotente.
- Propostas `Recusada` ou `Arquivada` nao podem ser aprovadas por link publico.
- O token publico nao deve ser armazenado em texto puro; armazenar hash e expor apenas a URL pronta ao usuario autenticado.
