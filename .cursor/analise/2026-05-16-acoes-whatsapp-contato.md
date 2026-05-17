# Analise: acoes de contato por WhatsApp para clientes e propostas

## Contexto

O sistema ja possui cadastro de clientes com telefone, listagens com acoes por icone/dropdown e fluxo de propostas com envio por WhatsApp para orcamentos gerados. A nova necessidade e facilitar o contato direto com o cliente, sem depender do fluxo de envio de proposta.

## Objetivo

Adicionar atalhos visuais de WhatsApp:

- no formulario de cliente, ao lado do campo telefone;
- na listagem de clientes;
- na listagem de propostas, usando o telefone do cliente associado.

## Fluxo

1. Usuario informa ou consulta o telefone do cliente.
2. Interface valida se o telefone pode ser normalizado para WhatsApp.
3. Quando valido, o botao abre `wa.me` em nova aba com uma mensagem simples de contato.
4. Quando invalido ou ausente, o botao fica desabilitado com tooltip explicativo.

## Regras

- Nao criar novo dado no backend.
- Nao alterar o comportamento de envio de proposta pelo WhatsApp.
- O contato direto deve usar apenas telefone valido do cliente.
- A listagem deve manter o padrao de icones e tooltips definido para o sistema.
- A acao nao deve ser bloqueada por regras de plano, pois e contato direto com o cliente e nao exportacao de proposta.

## Impactos

- `apps/web`: ajuste visual no formulario e nas listagens.
- `apps/api`: sem impacto.
- Banco de dados: sem impacto.

## Dependencias

- Telefone do cliente ja carregado em `ClienteResponse`.
- Normalizacao existente de telefone para WhatsApp.
- Componente visual existente `WhatsAppIcon`.

## Riscos

- Cliente sem telefone valido nao deve gerar link quebrado.
- Proposta cujo cliente nao esteja carregado localmente nao deve abrir WhatsApp sem destino.
- A nova acao nao deve competir visualmente com a acao existente de enviar proposta pelo WhatsApp.

## Duvidas

Nao ha duvidas bloqueantes. O comportamento solicitado e direto e pode ser atendido no frontend com os dados atuais.
