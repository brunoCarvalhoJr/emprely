# Analise Web - Cadastro de cliente simplificado

## Contexto

O cadastro de cliente esta visualmente longo para um fluxo que deve ser rapido. A maioria dos dados alem de nome e telefone e complementar, mas hoje todos aparecem no mesmo nivel de prioridade.

## Objetivo da tela/fluxo

Priorizar nome e telefone na primeira linha, manter observacoes fora do bloco complementar e recolher os demais campos em um collapse fechado por padrao. Em edicao e visualizacao, o collapse deve abrir automaticamente quando o cliente ja possui dados complementares.

## Rotas impactadas

- Clientes: lista, cadastro, edicao e visualizacao.
- Propostas: selecao e uso de clientes continuam lendo o mesmo contrato.

## Componentes impactados

- Formulario de cliente em `App.tsx`.
- Visualizacao de cliente em `App.tsx`.
- Tipos de cliente em `types/customer.ts`.
- Contrato de cliente na API para persistir cidade.

## Formularios e validacao

- Nome continua obrigatorio.
- Telefone continua opcional, mas com mascara e validacao quando preenchido.
- Campos complementares continuam opcionais.
- Campo `cidade` entra como complementar opcional.

## Dados e chamadas de API

- O contrato de cliente precisa persistir `cidade` para nao ser apenas visual.
- Criacao, edicao e retorno de cliente devem aceitar o novo campo.

## Responsividade e acessibilidade

- Primeira linha deve empilhar em telas pequenas.
- Collapse deve usar `aria-expanded` e manter label claro.
- Botoes de links sociais devem desabilitar quando nao houver link valido.

## Duvidas

- Nenhuma pendente.

## Atualizacao - formulario de cliente na proposta

O fluxo `Dashboard -> Nova proposta -> Novo cliente` ainda usava um formulario rapido
com menos campos e hierarquia diferente da tela de clientes. Isso cria duas
experiencias para a mesma tarefa e tende a gerar divergencia sempre que o cadastro
principal evolui.

## Decisao

O cadastro de cliente usado dentro de propostas deve reaproveitar o mesmo bloco de
campos do cadastro principal: nome, telefone com WhatsApp, collapse de informacoes
complementares, redes sociais com links, email, CPF/CNPJ, endereco, numero, cidade
e observacoes.

O comportamento especifico do fluxo de proposta fica apenas na acao apos salvar:
o cliente criado continua sendo selecionado na proposta automaticamente.

## Atualizacao - acao no wizard de proposta

O mesmo bloco de campos nao deve significar a mesma acao visual em todos os
contextos. Na tela avulsa de clientes, a acao correta e "Salvar cliente". No
wizard de proposta, o cadastro do cliente e apenas a primeira etapa do fluxo, entao
a acao deve ser "Proximo" e o usuario deve perceber que esta avancando para a
montagem da proposta.

Tambem e necessario manter os botoes de navegacao no rodape dos passos para evitar
que cada etapa mude a posicao das acoes e gere sensacao de layout instavel.

## Atualizacao - altura dos passos da proposta

A altura minima inicial dos passos ficou agressiva para viewports de notebook,
especialmente na etapa "Proposta", criando rolagem vertical mesmo com grande area
em branco dentro do card. A altura precisa ser estavel, mas limitada pelo espaco
real disponivel depois do cabecalho, barra de etapas e margens da pagina.
