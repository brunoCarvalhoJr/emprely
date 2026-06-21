# Spec - Formato de arquivo preferido no perfil da conta

## Visao geral

Adicionar ao perfil da conta a preferencia de formato do arquivo usado em envios de proposta com anexo.

## Escopo

- Novo campo `FormatoArquivoPreferido` no perfil.
- Valores aceitos: `Pdf` e `Imagem`.
- Default `Pdf` para contas existentes e novas.
- Retornar o campo em `GET /api/account/profile`.
- Aceitar o campo em `PUT /api/account/profile`.

## Fora do escopo

- Alterar endpoints de proposta.
- Criar upload ou envio automatico pelo WhatsApp.

## Criterios de aceite

- API salva e retorna o formato preferido.
- Valores invalidos retornam `400`.
- Build da API passa.
