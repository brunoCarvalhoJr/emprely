# Analise API - Trial e Plano Fundador

## Contexto

O MVP ja permite cadastro, login, perfil de conta, clientes, servicos, propostas, geracao, impressao e compartilhamento. O proximo passo comercial precisa representar a conta como SaaS: toda conta nasce em trial e pode ser ativada no Plano Fundador.

## Objetivo

Adicionar na API o estado comercial da conta com trial de 7 dias e ativacao manual do Plano Fundador, sem gateway de pagamento nesta etapa.

## Endpoints impactados

- `GET /api/me`: deve devolver a conta com dados comerciais.
- `GET /api/account`: deve devolver a conta com dados comerciais.
- `POST /api/auth/register`: deve criar conta em trial.
- `POST /api/auth/login`: deve devolver conta com dados comerciais.
- `POST /api/account/activate-founder`: novo endpoint autenticado para ativar o Plano Fundador.

## Contratos impactados

- Requests: nenhum novo payload no endpoint de ativacao.
- Responses: `ContaAtualResponse` passa a incluir plano, status comercial, fim do trial, dias restantes, data de ativacao do fundador e preco mensal do fundador.

## Dominio impactado

- Entidades: `Conta`.
- Value objects: nenhum.
- Regras:
  - Toda conta nova nasce no plano `Trial`.
  - O trial termina 7 dias apos a criacao da conta.
  - `TrialAtivo` vale enquanto o fim do trial for maior que o horario atual.
  - `TrialExpirado` vale quando o plano ainda e `Trial` e a data final ja passou.
  - `FundadorAtivo` vale quando a conta esta no plano `Fundador`.
  - Ativar Plano Fundador deve ser idempotente.

## Persistencia e integracoes

- Banco: adicionar `Plano`, `TrialEndsAt` e `PlanoFundadorAtivadoAt` em `contas`.
- S3/SES/SQS: nao impactado.
- Auth/Billing: auth passa a retornar o contrato enriquecido; billing real fica fora do escopo.

## Multi-tenancy

O endpoint de ativacao usa `ICurrentContaContext.ContaId`; o cliente web nunca envia `ContaId`.

## Riscos

- Quebrar login e `/me` se algum ponto continuar instanciando `ContaAtualResponse` com a assinatura antiga.
- Contas existentes precisam receber valores padrao na migration.
- O botao de ativacao manual nao pode ser confundido com cobranca real.

## Duvidas

- Confirmar futuramente se o preco fundador sera fixo em `R$ 19,90/mes` ou configuravel.
- Confirmar quando integrar gateway de pagamento e bloqueios por trial expirado.
