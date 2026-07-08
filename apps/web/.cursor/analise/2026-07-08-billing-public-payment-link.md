# Analise - Tela publica de regularizacao de plano

## Contexto

O Emprely precisa de uma alternativa para pagamento quando o usuario nao consegue acessar o app. A experiencia deve ser objetiva, segura e sem expor dados da conta em busca publica.

## Fluxo escolhido

- `/billing/regularizar`: tela publica para informar e-mail e receber link seguro.
- `/billing/pagar/:token`: tela publica do link assinado, com plano, validade/status e formulario minimo do pagador.

## UX

- Tela de solicitacao nao confirma se e-mail existe.
- Tela de pagamento mostra contexto suficiente para o usuario reconhecer a conta, sem informacoes sensiveis.
- Mesmos controles de ciclo, metodo e pagador minimo do billing autenticado.
- Se houver cobranca aberta, a tela deve abrir/reusar a cobranca existente.

## Estados necessarios

- carregando link
- link invalido/expirado
- e-mail enviado/instrucao para verificar caixa
- criando checkout
- erro de checkout
