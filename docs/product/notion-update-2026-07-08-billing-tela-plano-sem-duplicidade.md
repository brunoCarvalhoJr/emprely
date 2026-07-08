# Notion update - Billing sem duplicidade na tela de plano

Data: 2026-07-08

Registrar no rastreador:

- Tela `Plano e pagamento` melhorada para diferenciar plano ativo, validade, proxima cobranca, cobranca em andamento e historico.
- Bloqueio visual contra pagamento duplicado do mesmo ciclo quando existe cobranca aberta ou plano vigente.
- Formulario de pagador reduzido para campos minimos: tipo de pessoa, nome/razao social e CPF/CNPJ.
- Textos alterados:
  - `Ir para o checkout Asaas` -> `Realizar Pagamento`
  - `Abrir checkout` -> `Abrir Comprovante`
  - `AguardandoPagamento` -> `Aguardando Pagamento`
- API aceita pagador minimo e mantem reaproveitamento/bloqueio de checkout duplicado.
- Pagamento publico sem login fica como V2 por link assinado, nao por busca aberta de e-mail/CPF.
- Testes e deploy aprovados em 2026-07-08.
