# Analise Web - Modal reutilizavel de confirmacao

## Contexto

O app React/Vite ainda usa `window.confirm` em fluxos operacionais. Isso gera o alerta padrao do navegador, desalinhado com o visual do SaaS.

## Objetivo da tela/fluxo

Substituir o alerta nativo por uma modal reutilizavel do Emprely para confirmacoes, principalmente acoes exibidas como `Excluir` nas listagens.

## Rotas impactadas

- Shell autenticado do app.
- Clientes.
- Servicos / Pacotes.
- Propostas.
- Perfil/personalizacao quando houver descarte de alteracoes.

## Componentes impactados

- `App`
- `ListagemAcoes` indiretamente, pois suas acoes passam a abrir modal propria.
- Novo `ModalConfirmacaoSistema`.

## Formularios e validacao

- Campos: nao ha campos novos.
- Regras: formularios sujos continuam exigindo confirmacao antes de trocar de tela.
- Mensagens: textos de confirmacao passam para a modal do sistema.

## Dados e chamadas de API

- Queries: sem mudanca.
- Mutations: sem mudanca.
- Estados de loading/erro/vazio: sem mudanca.

## Responsividade e acessibilidade

- Modal deve caber em mobile, usar foco inicial e fechar com Escape.
- Confirmacao destrutiva deve ter contraste adequado nos temas claro e escuro.

## Duvidas

- Sem duvidas bloqueantes.
