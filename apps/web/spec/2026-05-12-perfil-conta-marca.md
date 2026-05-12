# Spec Web - Perfil Conta Marca

## Visao geral

Adicionar no web autenticado uma area de configuracoes da conta para consultar e atualizar o perfil profissional e a marca.

## Escopo

Inclui:

- Tipos TypeScript para `PerfilConta`.
- Funcoes `getPerfilContaAtual` e `updatePerfilConta`.
- Query de perfil habilitada quando houver token.
- Formulario de perfil exibido para usuario logado.
- Botao de salvar com estado de loading.
- Mensagem de sucesso e erro.

Fora do escopo:

- Upload de imagem.
- Roteamento com React Router.
- Preview visual de proposta.
- Aplicar as cores globalmente no tema do app.

## Criterios de aceite

- Usuario logado carrega o perfil com `GET /api/account/profile`.
- Usuario logado salva alteracoes com `PUT /api/account/profile`.
- Campos salvos aparecem no formulario apos recarregar.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint do web.
- Build do web.
- Smoke test manual via API e web local.
