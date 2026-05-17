# Spec - Logo drag-and-drop com salvamento explicito

## Visao geral

Corrigir o fluxo de logomarca para que anexar uma imagem nao altere o cadastro imediatamente. A selecao deve usar drag-and-drop com preview, informacoes de formatos/tamanho aceitos e persistencia somente apos `Salvar perfil`.

## Regras de negocio

- Selecionar arquivo nao chama API.
- Soltar arquivo na area de upload deve validar tipo e tamanho.
- A imagem escolhida fica em preview local e marca o formulario como alterado.
- `Salvar perfil` envia a imagem pendente, recebe uma `logoUrl` publica e grava essa URL via `PUT /api/account/profile`.
- `POST /api/account/profile/logo` nao cria nem atualiza `PerfilConta`.
- Limpar logomarca remove a referencia no formulario e so persiste `logoUrl` vazia ao salvar.

## Criterios de aceite

- A logo atual da conta nao muda ao anexar arquivo sem salvar.
- O usuario ve preview da imagem escolhida.
- O usuario ve os formatos aceitos e o limite de tamanho abaixo da area drag-and-drop.
- Ao salvar, a logo processada passa a aparecer no perfil e no topo do app.
- Arquivos fora de PNG, JPG/JPEG ou WebP e acima de 2 MB sao recusados antes do upload.
- Ao clicar em limpar e salvar, o topo e o perfil deixam de usar a logomarca anterior.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `dotnet test apps/api/tests/Emprely.IntegrationTests/Emprely.IntegrationTests.csproj --filter Perfil_DeveEnviarLogoComoWebpSemGravarReferenciaAntesDoSalvar`
