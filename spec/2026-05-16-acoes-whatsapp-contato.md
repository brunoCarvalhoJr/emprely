# Spec: acoes de contato por WhatsApp para clientes e propostas

## Visao geral

A feature adiciona atalhos de contato por WhatsApp em pontos onde o usuario trabalha com clientes: cadastro/edicao de cliente, listagem de clientes e listagem de propostas. O objetivo e reduzir atrito para chamar o cliente rapidamente, sem confundir com o fluxo de exportar/enviar orcamento.

## Escopo

Incluso:

- Botao de WhatsApp ao lado do campo telefone no formulario de cliente.
- Botao de WhatsApp visivel na listagem de clientes.
- Botao de WhatsApp visivel na listagem de propostas para contato com o cliente da proposta.
- Link aberto em nova aba via `wa.me`.
- Estado desabilitado quando o telefone estiver ausente ou invalido.

Fora do escopo:

- Persistir novo tipo de historico de contato.
- Enviar mensagem automaticamente pela API do WhatsApp.
- Alterar envio/exportacao de propostas.
- Alterar backend ou banco de dados.

## Fluxo ponta a ponta

1. Frontend carrega clientes e propostas pelos endpoints existentes.
2. Frontend localiza o telefone do cliente no proprio `ClienteResponse`.
3. Frontend normaliza o telefone para o formato aceito pelo WhatsApp.
4. Frontend monta URL `wa.me` com mensagem curta.
5. Usuario clica no icone de WhatsApp.
6. Navegador abre o WhatsApp Web/app em nova aba.

## Requisitos

- O botao deve ter icone de WhatsApp.
- O botao deve ter tooltip clara.
- O botao deve abrir em nova aba quando habilitado.
- O botao deve ficar desabilitado se nao houver telefone valido.
- Na listagem de propostas, o contato deve usar o cliente vinculado a proposta.

## Regras de negocio

- Telefone vazio, incompleto ou com formato invalido nao gera link.
- Telefone sem prefixo 55 pode ser normalizado quando tiver DDD e numero validos.
- Contato direto nao depende do status da proposta.
- Contato direto nao depende do plano da conta.
- Envio de proposta pelo WhatsApp continua separado e com suas regras atuais.

## Impactos por projeto

### apps/web

- Ajuste em `App.tsx` para renderizar os novos atalhos.
- Reuso das funcoes de normalizacao ja existentes.

### apps/api

- Sem alteracao.

### docs/spec

- Inclusao desta spec e analise SDD.

## Criterios de aceitacao

- Ao editar/criar cliente com telefone valido, o botao ao lado do telefone abre o WhatsApp.
- Cliente sem telefone valido mostra botao desabilitado.
- Na listagem de clientes, cada linha com telefone valido exibe atalho de WhatsApp.
- Na listagem de propostas, cada proposta cujo cliente tenha telefone valido exibe atalho de contato.
- O fluxo de WhatsApp para envio de proposta gerada continua funcionando como antes.
- Build do web app passa sem erro.

## Estrategia de implementacao

- Criar helper de URL para contato direto do cliente.
- Criar componente pequeno e reutilizavel de botao de contato por WhatsApp.
- Usar o componente no formulario de cliente, na coluna de telefone da listagem de clientes e no bloco de cliente da listagem de propostas.
- Validar com lint/build do app web.
