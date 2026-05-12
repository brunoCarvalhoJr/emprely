# Spec Web - Preview Visual Proposta

## Visao geral

Adicionar preview visual na tela de Propostas usando os dados do formulario atual, perfil de marca da conta e totais calculados.

## Rotas

- Sem nova rota.
- Area afetada: view `Propostas` do app autenticado.

## Estados da interface

- Carregando: manter os estados ja existentes das queries.
- Vazio: preview mostra placeholders profissionais quando cliente/titulo/itens ainda nao existem.
- Erro: manter mensagens ja existentes das queries/mutations.
- Sucesso: ao salvar, formulario limpa e preview volta ao estado vazio.

## Componentes

- `PreviewPropostaVisual`
- Bloco de cabecalho com marca da conta.
- Bloco de cliente e validade.
- Bloco de introducao.
- Tabela/lista de itens.
- Total final.
- Observacoes.
- Marca d'agua trial.

## Formularios

Nao altera regras de validacao do formulario.

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| clienteId | select | sim | Ja existente |
| titulo | text | sim | Ja existente |
| itens | array | sim | Ja existente |

## Integracao com API

- Nenhuma nova integracao.
- Preview usa dados ja carregados no cliente.

## Criterios de aceite

- Usuario ve preview visual na tela de Propostas.
- Preview usa nome comercial, cores e logo URL quando existentes.
- Preview mostra cliente, titulo, validade, introducao, itens, total e observacoes.
- Preview mostra marca d'agua Emprely Trial.
- Preview atualiza conforme o formulario muda.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- Cenarios manuais:
  - abrir Propostas sem dados;
  - preencher cliente/titulo/itens;
  - selecionar uma proposta existente para editar;
  - verificar preview responsivo.
