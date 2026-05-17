# Analise - Logo drag-and-drop com salvamento explicito

## Contexto

Na tela de configuracoes, a logomarca e enviada no momento em que o usuario anexa o arquivo. O endpoint atual tambem grava `LogoUrl` no perfil imediatamente, antes do usuario clicar em `Salvar perfil`.

## Fluxo afetado

- Configuracoes da conta no app web.
- `POST /api/account/profile/logo`.
- `PUT /api/account/profile`.
- Preview e identidade visual derivados da logomarca.

## Decisoes

- Selecionar ou soltar arquivo deve ficar apenas no estado local do navegador.
- A imagem escolhida deve aparecer como preview antes do salvamento.
- O upload para o servidor deve acontecer dentro do submit de `Salvar perfil`.
- O endpoint de upload deve salvar o arquivo e devolver a URL processada, sem alterar o perfil da conta.
- O `PUT /api/account/profile` continua sendo o ponto que atribui a `LogoUrl` ao cadastro.
- A mesma area deve oferecer uma acao para limpar a logomarca atual; a limpeza fica pendente ate `Salvar perfil`.

## Duvidas

- Sem bloqueio. Os formatos e tamanho seguem a regra atual: PNG, JPG/JPEG ou WebP ate 2 MB.

## Riscos

- Se o upload funcionar e o `PUT` falhar, o arquivo pode ficar orfao no storage local, mas a conta nao recebe a logo.
- O frontend precisa limpar previews locais ao salvar, cancelar sessao ou recarregar perfil para evitar URL de objeto vazando.
- A limpeza nao deve apagar o arquivo fisico antigo no servidor neste MVP; apenas remove a referencia do perfil.
