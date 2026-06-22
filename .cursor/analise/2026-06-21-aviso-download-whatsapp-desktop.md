# Análise - Aviso após envio com anexo no desktop

## Contexto

Na modal `Como deseja enviar?`, a primeira opção (`Mensagem inicial + anexo`)
gera o PDF, baixa o arquivo e abre o WhatsApp. No desktop, porém, o navegador
não permite anexar automaticamente um arquivo ao WhatsApp Web. O usuário precisa
pegar o PDF baixado na pasta Downloads e anexar manualmente na conversa aberta.

O fluxo atual informa apenas que o PDF foi baixado e o WhatsApp foi aberto, mas
não explica claramente o próximo passo.

## Decisão

No fallback desktop:

- fechar a modal de compartilhamento antes de abrir o WhatsApp;
- baixar o PDF normalmente;
- abrir o WhatsApp com a mensagem inicial;
- exibir um aviso claro dizendo que a proposta já foi baixada na pasta Downloads
  e que basta anexar o arquivo na conversa aberta.

## Critérios de aceite

- Ao clicar em `Mensagem inicial + anexo` no desktop, a modal fecha.
- O WhatsApp abre com a mensagem inicial.
- O PDF é baixado pelo navegador.
- O usuário recebe mensagem clara: a proposta foi baixada em Downloads e deve
  ser anexada na conversa aberta do WhatsApp.
