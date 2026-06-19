# Spec - Preview mobile com zoom de proposta e template

## Visao geral

Melhorar a visualizacao mobile do preview de proposta e template para permitir ver o documento inteiro e alternar para zoom de detalhes.

## Escopo

Inclui:

- Controles de zoom nos modais de preview.
- Fit-to-screen padrao no mobile.
- Botao fechar sempre visivel.
- Aplicacao nos previews de proposta em construcao e template.

Fora do escopo:

- Alterar PDF/exportacao.
- Alterar conteudo visual dos templates.
- Implementar pinch zoom nativo customizado.

## Criterios de aceite

- No mobile, o preview abre mostrando o documento por inteiro.
- Usuario consegue alternar para zoom.
- Usuario consegue voltar para `Inteiro`.
- Usuario consegue fechar sem rolar horizontalmente.
- Lint/build passam.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `scripts/build-web-beta.ps1`
- Teste visual mobile com Playwright.

