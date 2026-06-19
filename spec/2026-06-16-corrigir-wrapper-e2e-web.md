# Spec - Corrigir wrapper E2E web

## Contexto

Durante a revisao geral de 2026-06-16, o comando `pnpm.cmd test:e2e:web` executou 5 testes Playwright com status visual `ok`, mas terminou com exit code 1.

O wrapper `scripts/run-web-e2e.mjs` esperava encontrar um resumo no formato `N passed`. A saida observada do Playwright mostrou os testes como:

```txt
ok 1 [chromium]
ok 2 [chromium]
...
ok 5 [chromium]
```

Sem detectar sucesso, o wrapper aguardava ate o timeout e encerrava com erro.

## Objetivo

Fazer o wrapper E2E reconhecer o formato de saida atual do Playwright no Windows e encerrar com sucesso quando todos os testes reportados como `ok` forem executados.

## Requisitos

- R01: Manter compatibilidade com o resumo `N passed`, quando ele aparecer.
- R02: Detectar `Running N tests` para saber o total esperado.
- R03: Detectar linhas `ok N [project]` e considerar sucesso quando `N` atingir o total esperado.
- R04: Nao marcar sucesso antes do ultimo teste anunciado.
- R05: Continuar retornando erro quando houver falha real ou timeout.

## Implementacao

- Atualizar `scripts/run-web-e2e.mjs` para rastrear:
  - total de testes esperado;
  - maior indice `ok` visto na saida.
- Encerrar com sucesso quando o maior `ok` for igual ou maior que o total esperado.

## Criterios de aceite

- `pnpm.cmd test:e2e:web` retorna exit code 0 quando os testes Playwright passam.
- `pnpm.cmd validate:mvp` retorna exit code 0.

## Validacao

Executado em 2026-06-16:

```powershell
pnpm.cmd test:e2e:web
pnpm.cmd validate:mvp
```

Resultado:

- 5 testes Playwright aprovados.
- Gate `validate:mvp` aprovado.
