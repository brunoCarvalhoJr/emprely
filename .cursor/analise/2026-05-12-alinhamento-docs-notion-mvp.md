# Analise - Alinhamento docs, Notion e MVP

## Contexto

Foi feita uma revisao cruzando Notion, documentacao local e estado real do codigo do Emprely Orçamentos.

O codigo atual esta validado com build/test e ja cobre:

- autenticacao e conta;
- perfil/marca;
- clientes;
- servicos/pacotes;
- propostas em rascunho;
- preview visual da proposta.

## Problemas encontrados

- O Notion ainda cita Next.js como frontend SaaS em partes da arquitetura, mas a decisao real do projeto foi React com Vite.
- A etapa "Desenvolvimento do nucleo funcional" no Notion ainda esta como "Nao iniciado", apesar de ja haver implementacao real.
- O README da API lista apenas interfaces iniciais e nao cita endpoints ja criados.
- O dashboard web tem uma copy antiga dizendo que clientes seriam vinculados a propostas no proximo incremento.
- Ha um arquivo local de Copilot com regra Azure, conflitante com a decisao AWS do projeto.
- A pasta `.vs/` apareceu como artefato local nao rastreado e deve ser ignorada.
- O README do web referencia `.env.example`, mas exemplos de ambiente em subpastas estavam sendo ignorados pelo `.gitignore`.

## Perguntas

Nao ha duvidas bloqueantes. Os ajustes sao de alinhamento documental e limpeza local, sem mudanca de regra de negocio.

## Decisao

Atualizar os artefatos locais e o Notion para refletir o estado real:

- React/Vite no SaaS web;
- AWS como cloud planejada;
- nucleo funcional em andamento;
- endpoints atuais da API documentados;
- copy coerente com o fluxo ja implementado;
- remover instrucao Azure conflitante;
- ignorar `.vs/`.
- permitir versionar arquivos `.env.example` em subpastas.

## Riscos

- Atualizacoes do Notion devem preservar referencias de landing em Next.js, pois a landing existente continua fora do monorepo.
- A limpeza local nao deve apagar codigo de produto nem alterar migrations.
