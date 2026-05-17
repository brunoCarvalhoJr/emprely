# Spec Web - Logo upload, footer e tema escuro

## Escopo

Aplicar ajustes de UX no app React/Vite:

- rodape sempre no fim visual da pagina ou abaixo do conteudo com scroll;
- usar logo propria para tema escuro;
- substituir upload local em base64 por upload para API;
- avisar limite maximo recomendado de 2 MB para logo;
- trocar texto `Abrir WhatsApp` por `WhatsApp`.

## Comportamento

- `FooterAplicacao` escolhe logo clara ou escura conforme o tema atual.
- Layout autenticado deve permitir que `.app-content` organize conteudo e footer em coluna, com conteudo principal flexivel.
- Input de logo aceita `png`, `jpg`, `jpeg` e `webp`.
- Se arquivo passar de 2 MB, o usuario recebe aviso e o upload nao acontece.
- Se upload concluir, a tela recebe `PerfilContaResponse`, atualiza cache/form e mostra mensagem de sucesso.
- Campo `Logo URL` nao deve incentivar colagem de `data:image`; quando usado manualmente, aceita apenas URL HTTP(S) ou caminho relativo publico.

## Integracao

- Chamar `POST /api/account/profile/logo` com `FormData`.
- Enviar token de autenticacao.
- Invalidar/atualizar query `perfil-conta`.

## Criterios de aceite

- Rodape nao fica flutuando no meio da viewport em paginas curtas.
- Com scroll, rodape aparece depois do conteudo.
- Tema escuro usa logo de marca escura/legivel.
- Upload de logo salva referencia retornada pela API.
- `Abrir WhatsApp` passa a ser `WhatsApp`.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
