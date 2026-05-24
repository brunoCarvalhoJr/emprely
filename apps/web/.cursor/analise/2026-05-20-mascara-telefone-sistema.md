# Analise Web - Mascara de telefone do sistema

## Contexto

Campos de telefone aparecem em cadastro, clientes, cliente rapido e configuracoes. A UI ja usa placeholder `(11) 99999-9999`, mas nao aplica mascara real durante a digitacao.

## Objetivo da tela/fluxo

Padronizar a experiencia de preenchimento: somente numeros como entrada e exibicao imediata em `(XX) XXXXX-XXXX`.

## Rotas impactadas

- Fluxo autenticado principal em `App.tsx`.
- Tela de autenticacao/cadastro em `App.tsx`.

## Componentes impactados

- `CampoTexto`.
- Formulario de cadastro.
- Formulario de clientes.
- Formulario de cliente rapido.
- Formulario de perfil/configuracoes.

## Formularios e validacao

- Campos: `telefone`, `telefoneContato`.
- Regras: vazio permitido apenas nos campos opcionais; quando preenchido, deve conter 11 digitos nacionais.
- Mensagens: orientar o usuario para o formato `(XX) XXXXX-XXXX`.

## Dados e chamadas de API

- Queries: sem mudanca.
- Mutations: cadastro, perfil e clientes continuam com os contratos atuais.
- Estados de loading/erro/vazio: sem mudanca.

## Responsividade e acessibilidade

- Usar `type="tel"`, `inputMode="numeric"` e `autoComplete="tel"` nos campos telefonicos.
- Manter mensagens de erro existentes do `CampoTexto`.

## Duvidas

- Nenhuma bloqueante.
