# Spec - Refatoracao SaaS com ui-ux-pro-max

## Visao geral

Refatorar a experiencia visual do SaaS Emprely no frontend web para ficar mais
profissional, clean, amigavel e facil de usar, com base nos criterios da skill
`ui-ux-pro-max`.

## Escopo

Incluido:

- Shell autenticado, sidebar, conteudo principal e padroes de card.
- Dashboard.
- Listagens de Clientes, Servicos e Propostas.
- Componentes compartilhados de feedback, paginacao e acoes de listagem.
- Melhorias de acessibilidade em mensagens, campos e botoes.
- Ajustes de responsividade e touch targets.
- Melhorias pontuais em Conta e Personalizacao quando couberem no padrao atual.

Fora do escopo:

- Mudancas de API/backend.
- Regras comerciais de propostas.
- Reescrita completa dos templates de documento.
- Novo design system separado em pacote proprio.

## Requisitos

1. As listagens devem manter contexto no mobile.
2. Botoes e acoes clicaveis devem ter area minima de toque proxima de 44px.
3. Loading, erro, sucesso e empty states devem ser visiveis e acessiveis.
4. Dashboard nao deve exibir zero como dado real enquanto consultas estiverem
   carregando ou com erro.
5. Acoes devem ter texto/label coerente com o comportamento executado.
6. Formularios devem melhorar metadados de acessibilidade sem alterar payloads.
7. O visual deve ficar mais operacional e menos promocional.

## Regras de negocio

- Nenhum dado salvo deve mudar somente por alteracao visual.
- Propostas, clientes e servicos devem manter os mesmos fluxos de criar, editar,
  visualizar, arquivar, exportar e compartilhar.
- Template escolhido e cores continuam usando os campos existentes.
- O usuario nao deve perder alteracoes em rascunho por causa da refatoracao.

## Estrategia de implementacao

1. Criar componentes/estilos compartilhados para:
   - loading skeleton;
   - erro com retry;
   - empty state;
   - mensagens acessiveis;
   - tabela mobile com `data-label`;
   - touch targets de acoes/paginacao.
2. Ajustar Dashboard para receber estados de query e renderizar loading/erro.
3. Adicionar `data-label` nas tabelas principais.
4. Corrigir labels e acoes divergentes.
5. Melhorar campos e feedbacks compartilhados.
6. Aplicar CSS para visual SaaS mais limpo e consistente.
7. Validar com lint/build e, se possivel, screenshot local.

## Criterios de aceite

- `pnpm --dir apps/web lint` deve passar ou ter erros pre-existentes claramente
  separados.
- `pnpm --dir apps/web build` deve passar.
- Em viewport mobile, as listagens nao devem depender de valores sem rotulo.
- Acoes de linha e paginacao devem ficar confortaveis para toque.
- Dashboard deve mostrar loading/erro antes de mostrar metricas vazias.
- Mensagens de erro/sucesso devem usar `role`/`aria-live`.
- A interface deve permanecer funcional nos fluxos principais.
