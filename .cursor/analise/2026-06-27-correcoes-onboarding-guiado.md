# Analise - Correcoes do onboarding guiado

## Contexto

A revisao do onboarding guiado identificou cinco lacunas entre a spec de
2026-06-19 e o comportamento atual do app:

- a API retorna `deveAbrirAutomaticamente`, mas o webapp nao abre a modal em
  tela cheia no primeiro login;
- a API retorna `deveLembrarAposPular`, mas o webapp nao usa esse lembrete no
  proximo login;
- a modal atual funciona como guia inicial simples, sem representar etapas de
  wizard de conta e primeira proposta;
- `propostaRascunhoId` aceita `null` no contrato web, mas a entidade nao permite
  limpar o valor salvo;
- o evento `Pulou` pula as duas jornadas, enquanto a UI comunica apenas
  "Lembrar depois".

## Decisao

Corrigir o comportamento sem criar uma arquitetura nova de wizard neste ciclo.
O app deve:

- abrir a modal de onboarding automaticamente quando o backend indicar
  `deveAbrirAutomaticamente`;
- reabrir a modal como lembrete quando o backend indicar
  `deveLembrarAposPular`, limitado a uma vez por sessao para nao incomodar;
- manter o tour React Joyride, mas sem substituir a abertura automatica da
  modal;
- transformar a modal em um wizard resumido com etapas, progresso visual e
  orientacao clara de continuar/retomar;
- explicitar que `Lembrar depois` adia todo o onboarding;
- permitir limpar `propostaRascunhoId` via PATCH.

## Escopo tecnico

- API: ajustar entidade e request para diferenciar campo omitido de campo
  enviado como `null`.
- Web: usar os flags de onboarding retornados pela API, controlar abertura por
  sessao e melhorar a modal.
- Testes: cobrir a limpeza de rascunho na API e manter lint/testes existentes.

## Fora de escopo

- Criar novos endpoints.
- Criar nova tabela/migration.
- Refatorar o assistente de proposta inteiro.
- Criar um wizard isolado com formularios duplicados.

## Riscos

- Abrir modal e tour ao mesmo tempo. Mitigacao: a abertura automatica do tour
  deve respeitar modal aberta.
- Lembrete repetitivo. Mitigacao: usar chave por usuario/conta/status em ref de
  sessao.
- Quebrar contrato existente do PATCH. Mitigacao: manter propriedades atuais e
  adicionar somente um flag opcional para limpar rascunho.
