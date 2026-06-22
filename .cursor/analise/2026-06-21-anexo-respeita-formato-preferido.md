# Análise - Anexo respeita formato preferido da conta

## Contexto

A opção `Mensagem inicial + anexo` na modal de envio informa que o PDF da
proposta será anexado quando disponível. Porém o perfil da conta possui o campo
`formatoArquivoPreferido`, com opções `Pdf`, `Imagem` e `PdfImagem`. Quando o
usuário escolhe imagem como padrão, a primeira opção de envio deve refletir essa
preferência.

## Decisão

Usar o formato preferido do perfil para definir o arquivo gerado pela opção
principal de envio:

- `Pdf`: gerar e baixar/compartilhar PDF;
- `Imagem`: gerar e baixar/compartilhar imagem PNG;
- `PdfImagem`: gerar e baixar/compartilhar os dois arquivos.

O texto do card e a mensagem final ao usuário também devem mudar conforme o
formato preferido.

## Critérios de aceite

- Se o formato preferido for `Pdf`, o card informa PDF e baixa PDF.
- Se o formato preferido for `Imagem`, o card informa imagem e baixa PNG.
- Se o formato preferido for `PdfImagem`, o card informa PDF + imagem e baixa
  os dois arquivos.
- No desktop, o aviso final menciona o tipo correto de arquivo salvo em
  Downloads.
