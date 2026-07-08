# Analise - Billing sem duplicidade na tela de plano

## Contexto

Na tela `Plano e pagamento`, um usuario que acabou de pagar via Pix ainda enxerga a tela como se pudesse iniciar outro pagamento. A API ja reaproveita cobrancas abertas e bloqueia nova compra quando existe assinatura paga vigente no mesmo ciclo, mas a experiencia visual nao deixa isso claro e os dados do pagador exigem campos alem do necessario para criar/atualizar cliente e checkout hospedado no Asaas.

## Problemas identificados

- A tela exibe `AguardandoPagamento` sem espacamento, o que dificulta leitura e quebra o quadro de status.
- A acao principal `Ir para o checkout Asaas` parece iniciar sempre uma nova compra.
- A UI nao bloqueia visualmente o pagamento do mesmo ciclo quando existe cobranca aberta ou assinatura ativa.
- O payload do pagador exige endereco completo, telefone e e-mail, embora o fluxo hospedado do Asaas consiga operar com dados basicos do cliente e coletar dados sensiveis do cartao no proprio Asaas.
- O link da cobranca aberta aparece como `Abrir checkout`, mas para o usuario o objetivo e abrir o comprovante/link da cobranca.
- Pagamento publico sem login nao deve ser liberado apenas por e-mail, porque isso permitiria descoberta/manipulacao de contas. Precisa de link assinado ou fluxo de recuperacao autenticado.

## Decisoes

- Manter a protecao de duplicidade na API: cobranca aberta e reaproveitada; assinatura ativa no mesmo ciclo bloqueia novo checkout.
- Relaxar validacao do pagador para obrigar apenas tipo de pessoa, nome/razao social e CPF/CNPJ. E-mail, telefone e endereco ficam opcionais e validados somente quando informados.
- Manter pagamento dentro do app nesta entrega, pois conta expirada/inadimplente continua podendo acessar a area de billing autenticada.
- Documentar pagamento publico por link assinado como evolucao separada, com token de curta duracao e identificacao segura da conta.

## Impacto tecnico

- Contratos de billing passam a aceitar campos opcionais em `BillingPagadorRequest`.
- Provider Asaas continua recebendo os campos opcionais quando existirem; valores nulos sao omitidos pelo JSON.
- Testes devem cobrir checkout com pagador minimo.
