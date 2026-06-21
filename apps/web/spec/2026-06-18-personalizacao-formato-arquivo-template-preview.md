# Spec - Personalizacao de formato de arquivo e preview por card

## Visao geral

A personalizacao da conta deve permitir escolher o formato preferido de arquivo usado no envio com anexo e melhorar a interacao dos cards de template.

## Escopo

- Adicionar escolha entre PDF e imagem na pagina de personalizacao.
- Persistir a escolha no perfil da conta.
- Usar a escolha no envio "Mensagem inicial + anexo".
- Remover o botao superior de preview real.
- Adicionar um botao de preview dentro de cada card de template.
- Manter clique no card como selecao do template.

## Fora do escopo

- Remover os cards separados de download PDF e download imagem.
- Enviar anexo automaticamente pelo WhatsApp Web sem acao do usuario.
- Alterar conteudo visual dos templates.

## Criterios de aceite

- A personalizacao salva o formato preferido.
- O envio com anexo usa PDF quando a preferencia for PDF.
- O envio com anexo usa imagem quando a preferencia for imagem.
- Cada card de template tem botao de preview.
- O botao superior "Ver preview real" nao aparece mais.
- Lint e build do web passam.
