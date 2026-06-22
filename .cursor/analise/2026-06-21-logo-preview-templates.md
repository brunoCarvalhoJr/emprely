# Análise - Logo salva não aparece no preview dos templates

## Contexto

Ao visualizar templates, a área da marca mostra o ícone de imagem quebrada e o
texto alternativo da logo. Isso indica que `logoUrl` existe no perfil, mas o
`img` falha ao carregar. O componente `DocumentoMarca` renderiza a imagem
diretamente quando há URL e não possui fallback visual para erro de carregamento.

Uma causa provável em ambiente publicado é o atributo `crossOrigin="anonymous"`
em uma imagem hospedada em storage/CDN sem cabeçalhos CORS compatíveis. Nesse
caso, o browser pode bloquear o carregamento no preview, mesmo a URL existindo.

## Decisão

Criar um componente dedicado para a logo do documento:

- renderizar sempre um fallback com as iniciais da marca;
- tentar carregar a imagem com `crossOrigin="anonymous"` primeiro;
- se falhar, tentar novamente sem `crossOrigin`;
- se continuar falhando, manter o fallback visível e remover o ícone quebrado;
- preservar `crossOrigin` quando funcionar, para não prejudicar exportações que
  dependem de canvas.

## Critérios de aceite

- Logo configurada no perfil aparece nos previews de template quando a URL é
  acessível.
- Se o storage bloquear CORS, o preview ainda tenta carregar a imagem sem
  `crossOrigin`.
- Se a imagem realmente falhar, o template exibe as iniciais da marca, não um
  ícone de imagem quebrada.
