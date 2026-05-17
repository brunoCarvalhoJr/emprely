# Analise Web - Logo upload, footer e tema escuro

## Contexto

O frontend precisa corrigir quatro pontos de polimento do MVP: rodape preso ao final visual quando a pagina for menor que a tela, logo adequada para tema escuro, upload de logo na tela de configuracoes sem base64 no banco e texto do botao de WhatsApp mais curto.

## Fluxo afetado

- Shell autenticado e publico.
- Rodape global.
- Tela `Configuracoes`.
- Acoes de proposta com WhatsApp.
- Assets de marca em `public/brand`.

## Decisoes

- Rodape deve participar do fluxo normal: fica no fim da tela quando ha pouco conteudo e abaixo de todo o conteudo quando ha scroll.
- Logo escura sera um asset separado para uso quando `data-theme="dark"`.
- Upload de logo deve usar endpoint da API e salvar a URL retornada em `LogoUrl`.
- Limite recomendado no frontend: 2 MB por arquivo, com aviso claro antes do upload.

## Duvidas

- Sem bloqueio. O storage local no servidor e suficiente para o MVP, com caminho preparado para migrar para S3/CDN depois.

## Riscos

- Se a API nao estiver rodando, o upload falha; a mensagem deve explicar que nao foi possivel enviar.
- Imagens com fundo transparente devem continuar transparentes sempre que o processamento WebP preservar alpha.
