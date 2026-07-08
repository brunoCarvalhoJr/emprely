# Analise - Pagamento publico por link assinado

## Contexto

Existe a preocupacao de usuarios vencidos, inadimplentes ou com dificuldade de login precisarem regularizar o Plano Fundador sem depender da tela autenticada. Uma tela publica nao pode localizar contas por e-mail/CPF e iniciar pagamento diretamente, porque isso abriria enumeracao de contas e manipulacao de billing de terceiros.

## Solucao escolhida

Criar um fluxo em duas etapas:

1. Solicitacao publica por e-mail.
2. Envio de link assinado e expiravel para o e-mail da conta.
3. Link abre pagina publica com resumo limitado do plano e permite iniciar checkout Pix/cartao hospedado.

## Decisoes tecnicas

- Usar ASP.NET Data Protection ja configurado e persistido no banco para assinar o token.
- Token contem `contaId`, `usuarioId` e expiracao UTC.
- Endpoint de solicitacao sempre responde sucesso, mesmo quando e-mail nao existe, para evitar enumeracao.
- Endpoint de detalhes e checkout valida token, expiracao, usuario ativo e membro ativo da conta.
- Checkout publico reutiliza as mesmas regras do checkout autenticado: reaproveita cobranca aberta e bloqueia assinatura vigente no mesmo ciclo.
- Dados sensiveis de cartao continuam no Asaas hospedado.

## Riscos mitigados

- Enumeracao: resposta generica no pedido do link.
- Manipulacao de conta: checkout exige token assinado enviado ao e-mail da conta.
- Link antigo: expiracao curta.
- Duplicidade: regra existente de billing continua centralizada no `BillingService`.

## Fora do escopo

- Pagamento anonimo por e-mail/CPF sem link.
- Alteracao de senha ou desbloqueio administrativo.
- Portal completo de billing publico.
