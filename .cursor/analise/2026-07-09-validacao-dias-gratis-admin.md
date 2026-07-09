# Analise - validacao de dias gratis admin

## Contexto

No smoke MVP em producao/staging de 2026-07-09, o endpoint administrativo
`POST /api/admin/contas/{contaId}/dias-gratis` retornou `500 Internal Server Error`
quando recebeu payload invalido sem `inicioAt` e `fimAt`.

## Objetivo

Transformar erro operacional previsivel em resposta `400 Bad Request` clara,
sem alterar a regra de negocio de dias gratis nem o fluxo de billing.

## Projetos impactados

- API: controller administrativo de contas e testes de integracao.
- Web: sem mudanca.
- Mobile: sem mudanca.
- Landing: sem mudanca.
- Packages: sem mudanca.
- Infra: sem mudanca.

## Fluxo atual

O controller chama `DiasGratisConta.Create` diretamente. Quando datas chegam
como valor padrao ou motivo vazio, a validacao do dominio pode lançar excecao e
o cliente recebe erro `500`.

## Fluxo proposto

Antes de criar o dominio, o controller valida:

- permissao de SuperAdmin;
- existencia da conta;
- motivo obrigatorio;
- datas informadas;
- data final posterior a inicial.

Payload invalido retorna `400` com mensagem legivel.

## Regras de negocio

- Dias gratis continuam restritos a admin autorizado.
- `fimAt` deve ser posterior a `inicioAt`.
- motivo e obrigatorio para auditoria.
- Payload invalido nao deve gravar dias gratis nem auditoria.

## Impactos tecnicos

- Adicionar helper local de validacao no controller.
- Reusar a mesma validacao para dias gratis individual e em lote.
- Cobrir payload invalido em teste de integracao.

## Riscos

- Bloquear payload valido se a validacao rejeitar `DateTimeOffset` legitimo.
- Divergir mensagem de erro entre endpoint individual e lote.

## Duvidas

- Nenhuma duvida bloqueante. O comportamento esperado e retorno `400`, nao `500`.
