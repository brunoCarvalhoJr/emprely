# Spec - Pagamento publico de billing

## Objetivo

Adicionar paginas publicas para regularizacao do Plano Fundador por link assinado.

## Rotas

### `/billing/regularizar`

- Exibe formulario de e-mail.
- Chama `POST /api/billing/public/payment-links`.
- Mostra mensagem generica: se houver conta vinculada, o link sera enviado.

### `/billing/pagar/:token`

- Consulta `GET /api/billing/public/payment-links/{token}`.
- Exibe conta, plano atual, status, validade, planos e metodos.
- Permite escolher ciclo e metodo.
- Exige apenas tipo de pessoa, nome/razao social e CPF/CNPJ.
- Chama `POST /api/billing/public/payment-links/{token}/checkouts`.
- Redireciona para o checkout Asaas.

## Regras de UI

- Nao exigir login.
- Nao mostrar busca por CPF/CNPJ.
- Nao exibir dados sensiveis do usuario.
- Se token for invalido/expirado, orientar a solicitar novo link.
- Textos de botao:
  - `Enviar link seguro`
  - `Realizar Pagamento`

## Criterios de aceite

- Build web passa.
- Rota de solicitacao funciona sem auth.
- Rota de token valido renderiza plano e checkout.
- Token invalido mostra estado de erro.
