# Emprely Mobile

Placeholder do app mobile do Emprely Orçamentos.

O scaffold Expo será criado após a validação do fluxo web do MVP.

## Contrato da feature de orçamento com template

- O backend salva apenas os dados estruturados da proposta e o template visual escolhido.
- PDF e PNG devem ser gerados sob demanda no dispositivo com os dados atuais do backend.
- No mobile, o fluxo esperado é gerar o arquivo localmente e abrir o compartilhamento nativo do sistema com a mensagem e o arquivo anexado.
- A mensagem para WhatsApp deve informar que o orçamento detalhado está sendo enviado abaixo; o arquivo segue como anexo do compartilhamento nativo.
- Enquanto este app estiver apenas como placeholder, o contrato compartilhado vive em `packages/shared-types`.

## Stack futura

- React Native.
- Expo.
- TypeScript.
- Expo Router.
- TanStack Query.
- React Hook Form.
- Zod.
