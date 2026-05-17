# Analise API - Bloqueio por trial expirado

## Contexto

O MVP ja possui trial de 7 dias e ativacao manual do Plano Fundador. Falta aplicar a regra comercial no fluxo de propostas para impedir uso comercial quando o trial terminou.

## Objetivo

Bloquear geracao e envio comercial de proposta quando a conta estiver com `StatusComercialConta.TrialExpirado`, mantendo leitura, cadastro, edicao e historico acessiveis.

## Endpoints impactados

- `POST /api/proposals/{id}/generate`
- `POST /api/proposals/{id}/send`
- `GET /api/proposals`
- `GET /api/proposals/{id}`

## Contratos impactados

- Requests: nenhum.
- Responses: erro `403` com `message` amigavel quando a conta nao pode gerar proposta.

## Dominio impactado

- Entidades: `Conta`.
- Value objects: nenhum.
- Regras:
  - Conta `Fundador` pode gerar e enviar proposta.
  - Conta `Trial` pode gerar e enviar enquanto o trial estiver ativo.
  - Conta `TrialExpirado` nao pode gerar nem enviar proposta.

## Persistencia e integracoes

- Banco: sem migration nova.
- S3/SES/SQS: nao impactado.
- Auth/Billing: billing real continua fora do escopo; ativacao manual do Fundador destrava o fluxo.

## Multi-tenancy

O bloqueio consulta a conta pelo `ICurrentContaContext.ContaId`, nunca por dado enviado no request.

## Riscos

- Bloquear leitura/historico por engano.
- Gerar erro generico sem orientar o usuario a ativar o Plano Fundador.

## Duvidas

- Confirmar futuramente se edicao de rascunhos tambem deve ser bloqueada apos trial expirado.
- Confirmar quando o bloqueio sera substituido por assinatura real via gateway.
