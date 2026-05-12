# Analise Web - Preview Visual Proposta

## Contexto

O fluxo atual ja permite criar rascunhos de propostas com cliente, itens, totais e textos. Falta transformar esses dados em uma visualizacao parecida com um orcamento profissional, usando a marca configurada na conta.

## Objetivo da tela/fluxo

Adicionar um preview visual dentro da area de Propostas para que o usuario veja o orçamento antes de exportar PDF/imagem em uma proxima etapa.

## Rotas impactadas

- App autenticado em `Propostas`.
- Sem nova rota web neste incremento.

## Componentes impactados

- `App.tsx`
- Area de formulario de propostas.
- Coluna lateral de propostas.
- Preview visual novo, alimentado pelo formulario atual.

## Formularios e validacao

- O preview deve refletir os campos do formulario:
  - cliente;
  - titulo;
  - introducao;
  - observacoes;
  - validade;
  - itens;
  - total.
- Validacao continua sendo a do formulario de proposta existente.

## Dados e chamadas de API

- Sem novas chamadas.
- Reusar:
  - `getPerfilContaAtual`;
  - `getClientesConta`;
  - `getServicosConta`;
  - `getPropostasConta`.

## Responsividade e acessibilidade

- Preview deve caber na coluna lateral no desktop.
- Em telas menores, preview aparece no fluxo vertical.
- Usar contraste legivel com as cores da marca.
- Nao depender de imagem externa para funcionar.

## Duvidas

- Deve exportar PDF agora?
  - Decisao: nao. Preview primeiro, exportacao no proximo incremento.
- Marca d'agua aparece quando?
  - Decisao: sempre nesta etapa, porque plano/trial ainda nao esta implementado.
- Preview mostra proposta salva ou formulario atual?
  - Decisao: formulario atual, para o usuario ver antes de salvar e ao editar.
