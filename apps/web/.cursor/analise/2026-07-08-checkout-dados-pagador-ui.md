# Analise - UI de checkout com dados do pagador

## Contexto

O app possui tela de billing com plano, ciclo e botoes de metodo de pagamento. O novo requisito pede uma pagina/area onde o cliente informe dados de CPF/CNPJ, escolha Pix ou cartao e pague pelo Asaas.

## Problema

- A tela atual nao coleta CPF/CNPJ nem dados do pagador.
- A acao de checkout fica em cada metodo, sem resumo claro da selecao antes do envio.
- Cartao aparece como indisponivel por causa do catalogo da API.

## Decisoes de UX

- Manter a experiencia dentro da tela `Plano e pagamento`.
- Separar a area de pagamento em:
  - selecao de ciclo ja existente;
  - formulario de dados do pagador;
  - selecao Pix/cartao;
  - botao unico para abrir o checkout Asaas.
- Exibir aviso claro de que cartao e preenchido somente no Asaas.
- Usar componentes e mascaras existentes de CPF/CNPJ e telefone.

## Impacto tecnico

- `CreateBillingCheckoutInput` passa a incluir `pagador`.
- `BillingContent` cria e valida formulario local com `react-hook-form` e `zod`.
- O submit chama `onCriarCheckout` com plano, ciclo, metodo e pagador.
