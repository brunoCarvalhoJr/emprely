# Spec - Correcoes runner QA FULL

## Visao geral

Corrigir a automacao oficial de regressao QA FULL para reduzir falsos negativos encontrados durante a bateria completa das rotinas Emprely.

## Escopo

Inclui:

- Robustecer selecao de templates no wizard de proposta.
- Robustecer selecao do menu de acoes da proposta filtrada.
- Tratar estado temporario de rate limit com espera/retry no runner.
- Preservar limpeza dos dados `QA FULL`.

Fora do escopo:

- Alterar limites de rate limit da API.
- Alterar regras de negocio do app.
- Enviar WhatsApp real ou e-mail externo fora do fluxo de teste ja existente.

## Fluxo ponta a ponta

1. Rodar `run-qa-full-battery.mjs` com tema e prefixo unico.
2. Criar clientes, servicos e propostas.
3. Selecionar template por texto normalizado.
4. Executar acoes de proposta na linha correspondente ao titulo buscado.
5. Se houver `429`, aguardar e tentar novamente antes de falhar.
6. Limpar propostas, servicos e clientes criados.

## Requisitos

- O runner deve continuar lendo credenciais de `D:\Emprely\Testes\credenciais-teste.md`.
- O runner nao deve imprimir credenciais.
- A limpeza deve verificar ausencia do prefixo em clientes, servicos e propostas.

## Regras de negocio

- Dados destrutivos precisam estar isolados por prefixo QA.
- Rate limit deve ser respeitado, nao removido.

## Impactos por projeto

- API: nenhum.
- Web: nenhum.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.
- Testes externos: `D:\Emprely\Testes\scripts`.

## Criterios de aceite

- A selecao do template "Consultoria e diagnostico" nao deve falhar por acento/encoding.
- A acao de proposta deve ser aplicada sobre a linha da proposta filtrada.
- O runner deve recuperar de rate limit temporario com retry limitado.
- A limpeza deve continuar removendo apenas dados com o prefixo da rodada.

## Estrategia de implementacao

- Criar helpers de normalizacao, retry e clique resiliente no runner.
- Usar seletores `data-testid` quando disponiveis.
- Manter fallbacks por role/texto para compatibilidade.

## Testes

- Rodar o script QA FULL com prefixo novo.
- Rodar cleanup com o mesmo prefixo se a validacao for interrompida.
