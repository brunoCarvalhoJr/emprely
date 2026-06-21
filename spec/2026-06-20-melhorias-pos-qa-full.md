# Spec - Melhorias pos rodada QA FULL

## Visao geral

Formalizar os proximos roteiros de teste do Emprely a partir da rodada completa
executada com prefixo `QA FULL`. A entrega deve melhorar a documentacao
operacional e orientar a futura automacao da regressao completa.

## Requisitos

- R01: Deve existir um roteiro de regressao completa QA FULL com criacao,
  variacoes, status, duplicacao, suporte e limpeza.
- R02: Deve existir um roteiro de modo QA seguro para acoes destrutivas.
- R03: Deve existir uma matriz dos templates, status e campos exercitados.
- R04: Deve existir uma diretriz de `data-testid`/seletores estaveis para UI.
- R05: Deve existir uma diretriz mobile real/emulada.
- R06: Deve existir uma diretriz de APIs auxiliares de QA para seed, cleanup e
  simulacao.
- R07: O README das rotinas deve apontar para os novos roteiros.
- R08: Os roteiros devem deixar claro que a regressao completa nao substitui os
  testes leves de PR.

## Criterios de aceite

- Novos arquivos `80` a `85` existem em `D:\Emprely\Testes\rotinasTeste`.
- `README.md` referencia os novos roteiros.
- Os roteiros indicam frequencia recomendada, pre-condicoes e criterio de
  aceite.
- A documentacao preserva a regra de nao usar dados reais em testes destrutivos.

## Testes de validacao

- Leitura dos arquivos gerados.
- Verificacao de links no README.
- `git diff --check` no repositorio para validar whitespace das specs SDD.
