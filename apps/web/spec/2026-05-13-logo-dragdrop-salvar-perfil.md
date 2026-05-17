# Spec Web - Logo drag-and-drop com salvamento explicito

## Visao geral

Refazer a area de logomarca da tela de configuracoes para suportar drag-and-drop, preview local e persistencia apenas ao salvar perfil.

## Rotas

- View autenticada `Configuracoes`.

## Estados da interface

- Vazio: area de drop mostra chamada para arrastar ou selecionar arquivo.
- Preview: imagem local ou logo salva aparece na area.
- Erro: arquivo invalido mostra mensagem no formulario.
- Sucesso: apos salvar, mensagem confirma perfil salvo.

## Componentes

- Area drag-and-drop clicavel.
- Preview de logomarca.
- Input file oculto.
- Metadados de tipo e tamanho aceitos.
- Botao `Limpar logomarca` para remover a referencia atual.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| logoUrl | hidden | nao | URL HTTP(S) ou caminho `/uploads/account-logos/` |
| arquivo pendente | File local | nao | PNG, JPG/JPEG ou WebP ate 2 MB |
| limpar logo | boolean local | nao | quando ativo, envia `logoUrl` vazia no submit |

## Integracao com API

- Se houver arquivo pendente, o submit chama `POST /api/account/profile/logo`.
- O response do upload retorna apenas `logoUrl`.
- O submit chama `PUT /api/account/profile` com a `logoUrl` final.
- Se a logo foi limpa, o submit chama somente `PUT /api/account/profile` com `logoUrl` nula.

## Criterios de aceite

- Anexar ou soltar arquivo nao altera o perfil no servidor.
- Preview aparece antes de salvar.
- Informacoes aceitas aparecem abaixo da area de upload.
- A URL da logo so entra no formulario definitivo apos o submit.
- Limpar logomarca remove o preview e persiste a remocao apenas depois de `Salvar perfil`.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- Manual: escolher arquivo, conferir preview, recarregar antes de salvar e confirmar que a logo antiga permanece.
- Manual: clicar em limpar, conferir preview vazio, salvar e confirmar topo sem logomarca.
