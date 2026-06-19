# Análise - Assistente de nova proposta

## Contexto

O botão de nova proposta abria diretamente o editor completo. O fluxo funcionava, mas colocava cliente, título, validade, itens, valores, detalhes comerciais, template e ações em uma única tela inicial.

## Objetivo

Transformar a entrada de nova proposta em um fluxo guiado curto, começando pela escolha do cliente:

- usar cliente já cadastrado;
- cadastrar novo cliente sem sair do fluxo;
- abrir o editor da proposta já com o cliente selecionado.

## Fluxo

1. Usuário clica em nova proposta.
2. Sistema abre o assistente de proposta na área de propostas.
3. Usuário escolhe entre cliente cadastrado ou novo cliente.
4. Cliente cadastrado: sistema mostra busca/lista e, ao selecionar, abre o editor com o cliente preenchido.
5. Novo cliente: sistema salva via API existente de clientes e abre o editor com o cliente criado selecionado.
6. Editor atual continua responsável por mensagem, validade, serviços, desconto, condições, preview, template e compartilhamento.

## Regras

- Não criar endpoint novo para o MVP.
- Não enviar o usuário para a tela de clientes após cadastro rápido.
- Preservar o editor atual como tela de montagem da proposta.
- Manter descarte de alterações ao sair do fluxo.
- Se não houver clientes, direcionar o assistente para cadastro de novo cliente.

## Impactos

- Frontend: novo estado de modo para propostas e nova UI de assistente.
- Backend: sem impacto esperado.
- Dados: sem alteração de modelo ou migração.

## Riscos

- Duplicar lógica de criação rápida de cliente se o assistente não reaproveitar a mutation existente.
- Aumentar passos demais e deixar o fluxo lento para usuário avançado.
- Quebrar o fluxo de nova proposta iniciada a partir de um cliente específico.

## Decisão

Implementar o assistente apenas no frontend, reaproveitando `createCliente`, `prepararNovaProposta` e o formulário de proposta atual.
