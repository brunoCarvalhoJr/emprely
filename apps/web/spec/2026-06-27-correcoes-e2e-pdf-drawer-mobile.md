# Spec - Correcoes E2E PDF e drawer mobile

## Objetivo

Corrigir os E2E restantes do item 3 sem mudar comportamento de produto: validacao do PDF visual com link de aprovacao e acesso ao Perfil da conta pelo drawer mobile.

## Comportamento esperado

1. Ao baixar a proposta em PDF no fluxo principal, o E2E confirma:
   - nome do arquivo com extensao `.pdf`;
   - assinatura `%PDF-`;
   - arquivo com tamanho minimo compativel com exportacao real;
   - imagem embutida no PDF;
   - link clicavel de aprovacao para `https://app.emprely.test/aprovar-proposta/token-proposta-1`.
2. O E2E nao exige texto selecionavel no PDF, pois a spec de templates permite PDF visual rasterizado.
3. No viewport mobile, o E2E abre o drawer pelo botao com nome acessivel `Abrir mais opções`.
4. O drawer mobile continua exibindo `Perfil da conta` e nao exibe entradas separadas de `Personalizacao`.

## Fora de escopo

- Reimplementar geracao de PDF textual.
- Alterar templates visuais de proposta.
- Alterar fluxo de onboarding, perfil ou autenticacao.

## Testes

- `pnpm --dir apps/web exec playwright test --grep "fluxo principal|drawer mobile" --reporter=line`
- `pnpm lint:web`
- `pnpm build:web`
