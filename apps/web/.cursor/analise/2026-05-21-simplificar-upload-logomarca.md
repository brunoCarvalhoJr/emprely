# Analise Web - Simplificar upload de logomarca

## Contexto

O componente de logomarca na pagina de configuracoes precisa ficar menos verbal e mais intuitivo, com acao visual direta.

## Objetivo da tela/fluxo

Permitir anexar, trocar ou remover logomarca com um bloco limpo: preview/icone, tipos aceitos e lixeira.

## Rotas impactadas

- Configuracoes da conta no app web.

## Componentes impactados

- Bloco de logomarca em `App.tsx`.
- Estilos `.logo-dropzone` e `.logo-preview-frame`.

## Formularios e validacao

- Campo oculto `logoUrl` permanece.
- Upload continua validando PNG, JPG/JPEG, WebP e tamanho maximo.

## Dados e chamadas de API

- Queries: sem mudanca.
- Mutations: `updatePerfilConta` e `uploadLogoPerfilConta` sem mudanca.
- Estados de loading/erro/vazio: sem mudanca funcional.

## Responsividade e acessibilidade

- Manter foco de teclado no dropzone.
- Manter `aria-label` no anexo e na lixeira.
- Layout deve funcionar em desktop e mobile sem texto explicativo longo.

## Duvidas

- Nenhuma bloqueante.
