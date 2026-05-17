# Analise - Robustez sessao auth MVP

## Contexto

O web guarda apenas `accessToken` em `localStorage` e espera o erro de `/api/me` para perceber sessao invalida. Para beta, isso deixa estado antigo na tela e nao diferencia bem sessao expirada de login invalido.

## Objetivo

Melhorar o ciclo de sessao do MVP com armazenamento versionado, expiração local, logout limpo e limpeza automatica quando uma chamada autenticada retornar `401`.

## Projetos impactados

- API: teste de regressao para endpoint autenticado sem token.
- Web: armazenamento de sessao, limpeza de cache/estado e tratamento de `401`.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: documentacao de comportamento.

## Fluxo atual

1. Cadastro/login salva somente `accessToken`.
2. Reload tenta usar token salvo sem saber `expiresAtUtc`.
3. Quando `/api/me` falha, o formulario exibe mensagem, mas parte do estado local pode permanecer.
4. Logout remove token e limpa algumas queries.

## Fluxo proposto

1. Cadastro/login salva sessao completa com `accessToken`, `expiresAtUtc`, usuario e conta.
2. Ao abrir o app, sessao expirada localmente e descartada antes de chamar a API.
3. Qualquer chamada autenticada que receber `401` dispara limpeza de sessao.
4. Logout limpa token, cache, selecoes, mensagens e formularios de dominio.
5. Login/cadastro invalido nao dispara limpeza de sessao, porque nao usa token autenticado.

## Regras de negocio

- Token expirado nao deve manter usuario dentro do sistema.
- Logout deve remover dados de conta/cliente/servico/proposta da memoria do app.
- Sem refresh token no MVP.
- Sem mudanca visual profunda, prints ou layout final nesta rodada.

## Impactos tecnicos

- Criar chave `emprely.authSession` e preservar leitura de token legado `emprely.accessToken`.
- Introduzir erro de API com status HTTP no web.
- Adicionar evento interno para `401` de chamada autenticada.

## Riscos

- Token legado sem `expiresAtUtc` depende do `/api/me` para expirar.
- Tratamento automatico deve reagir apenas a `401`, nao a `403` comercial.

## Duvidas

- Sem duvidas bloqueantes. Assumo que refresh token e "lembrar-me" ficam para etapa posterior ao MVP.
