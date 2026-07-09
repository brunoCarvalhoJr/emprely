# Analise - Correcoes runner QA FULL

## Contexto

Durante a execucao das rotinas em `D:\Emprely\Testes\rotinasTeste`, o app completou os fluxos principais, mas o runner oficial `D:\Emprely\Testes\scripts\run-qa-full-battery.mjs` falhou por fragilidade de automacao em selecao de template e acoes de proposta. As rotinas admin tambem encontraram `429 Too Many Requests` quando chamadas em sequencia muito rapida.

## Objetivo

Deixar o runner de QA FULL mais resiliente para repetir a regressao sem falso negativo por texto acentuado, primeira linha incorreta, modal residual ou rate limit temporario.

## Projetos impactados

- API: sem mudanca funcional prevista.
- Web: sem mudanca funcional prevista.
- Mobile: nao impactado.
- Landing: nao impactado.
- Packages: nao impactado.
- Infra: nao impactado.
- Testes externos: ajustar scripts em `D:\Emprely\Testes\scripts`.

## Fluxo atual

O script navega pelo app em producao usando Playwright, cria dados `QA FULL`, gera propostas por templates, muda status, duplica, envia suporte e limpa os dados. Algumas etapas dependem de match textual sensivel a acentos/encoding e de clicar no primeiro menu encontrado apos busca.

## Fluxo proposto

1. Normalizar textos antes de escolher template.
2. Selecionar o menu de acoes da proposta a partir da linha que contem o titulo buscado.
3. Esperar a UI sair de estados transitivos antes de clicar.
4. Fazer retry com pequena pausa quando a pagina indicar rate limit temporario.
5. Manter limpeza final com a mesma tolerancia.

## Regras de negocio

- Usar apenas dados com prefixo QA unico.
- Nao expor credenciais ou tokens em resultado.
- Nao alterar limite de seguranca da API para acomodar teste agressivo.

## Impactos tecnicos

- Alteracao em scripts externos de QA.
- Nenhuma alteracao de schema, contrato API ou UI produtiva.

## Riscos

- O runner continua dependendo da UI publicada em `https://app.emprely.com.br`.
- Rate limit real pode exigir espera maior em rodadas consecutivas.

## Duvidas

- Nenhuma bloqueante para corrigir a automacao.
