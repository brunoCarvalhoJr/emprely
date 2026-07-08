# Spec - Pagamento publico por link assinado

## Objetivo

Permitir que um usuario regularize o Plano Fundador fora da area autenticada, com seguranca, por link enviado ao e-mail da conta.

## API publica

### Solicitar link

`POST /api/billing/public/payment-links`

Payload:

```json
{
  "email": "cliente@empresa.com"
}
```

Regras:

- Validar formato basico do e-mail.
- Sempre retornar `204 No Content`.
- Se o e-mail pertencer a usuario ativo com membro ativo de conta ativa, enviar e-mail com link publico.
- Nao revelar se o e-mail existe.

### Consultar link

`GET /api/billing/public/payment-links/{token}`

Retorna:

- nome da conta
- status de billing
- planos disponiveis

Regras:

- Token deve estar assinado e dentro da validade.
- Usuario e membro da conta devem estar ativos.
- Nao retornar dados de outros usuarios.

### Criar checkout publico

`POST /api/billing/public/payment-links/{token}/checkouts`

Payload igual ao checkout autenticado:

```json
{
  "planoCodigo": "fundador",
  "metodoPagamento": "Pix",
  "ciclo": "Mensal",
  "pagador": {
    "tipoPessoa": "Fisica",
    "nome": "Cliente",
    "cpfCnpj": "123.456.789-01"
  }
}
```

Regras:

- Validar token antes de criar checkout.
- Usar as mesmas regras de duplicidade do checkout autenticado.
- Retornar URL do Asaas para redirecionamento.

## E-mail

- Assunto: `Link para regularizar seu Plano Fundador`.
- CTA: `Regularizar plano`.
- Link: `/billing/pagar/{token}`.
- Texto deve informar que o link expira e que cartao/Pix sao preenchidos no Asaas.

## Criterios de aceite

- Usuario consegue pedir link publico informando e-mail.
- Resposta nao revela existencia da conta.
- Link valido abre pagina publica de pagamento.
- Link expirado/invalido mostra erro.
- Checkout publico cria/reaproveita cobranca pelas regras atuais.
- Testes da API cobrem solicitacao generica, link valido e token invalido.
