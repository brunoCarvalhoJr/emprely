# Spec - Assistente de nova proposta

## Visão geral

Adicionar uma etapa intermediária guiada ao criar uma nova proposta. O usuário deve escolher primeiro se usará um cliente existente ou se cadastrará um novo cliente.

## Escopo

- Alterar o fluxo do botão "Nova proposta" sem cliente pré-selecionado.
- Criar tela de assistente dentro da área de propostas.
- Permitir busca e seleção de cliente cadastrado.
- Permitir cadastro rápido de novo cliente.
- Abrir o editor atual com cliente preenchido.

## Fora do escopo

- Alterações no backend.
- Novo modelo de proposta.
- Persistência parcial do assistente.
- Revisão final obrigatória separada.

## Fluxo ponta a ponta

1. Frontend recebe clique em nova proposta.
2. Frontend muda o modo de propostas para assistente.
3. Para cliente existente, frontend usa dados já carregados de `getClientesConta`.
4. Ao selecionar cliente, frontend chama a preparação local da proposta e abre o editor.
5. Para cliente novo, frontend chama `createCliente`.
6. Após sucesso, frontend atualiza cache de clientes, preenche `clienteId` e título automático, e abre o editor.
7. O editor atual salva proposta via `createProposta` ou `updateProposta`.

## Requisitos

- O assistente deve mostrar duas opções principais.
- A opção de cliente existente deve ficar indisponível quando não houver clientes.
- A busca deve considerar nome, e-mail, telefone, documento e observações.
- O cadastro rápido deve pedir nome, telefone e e-mail.
- Após cadastro rápido, o usuário deve continuar no editor da proposta.
- A criação a partir de um cliente específico deve continuar abrindo direto o editor.

## Regras de negócio

- Proposta ainda exige cliente e pelo menos um item para salvar.
- Cliente novo é salvo no backend antes da proposta.
- O template padrão continua vindo das configurações de personalização.
- O título automático deve continuar usando cliente e primeiro serviço quando aplicável.

## Impactos por projeto

- `apps/web`: estados, fluxo de tela e estilos.
- `apps/api`: sem alteração.
- `spec` e `.cursor/analise`: documentação do fluxo.

## Critérios de aceitação

- Clicar em nova proposta abre o assistente, não o editor direto.
- Selecionar cliente cadastrado abre o editor com o cliente selecionado.
- Criar cliente no assistente abre o editor com o novo cliente selecionado.
- O fluxo antigo a partir de um cliente específico continua funcionando.
- Lint e build do web passam.

## Estratégia de implementação

- Adicionar modo `assistente` ao estado de propostas.
- Adicionar estado da etapa do assistente.
- Reaproveitar mutation de cliente rápido.
- Reaproveitar `prepararNovaProposta(clienteId)`.
- Criar estilos específicos para cards, lista e responsividade do assistente.
