# Spec - Checklist final beta MVP

## Visao geral

Criar uma referencia operacional para decidir se o Emprely Orcamentos esta pronto para beta local/controlado e quais itens ainda faltam antes de abrir para usuarios reais.

## Escopo

Inclui:

- Checklist funcional do MVP.
- Checklist tecnico de beta.
- Itens bloqueantes antes de beta real.
- Itens explicitamente adiados para polimento final.
- Alias `validate:mvp` para executar a validacao automatizada completa.
- Link no README.

Fora do escopo:

- Alterar layout, prints, imagens ou identidade visual.
- Criar billing real.
- Criar deploy cloud.
- Criar novas entidades de produto.
- Atualizar Notion.

## Fluxo ponta a ponta

1. Pessoa desenvolvedora consulta o checklist final.
2. Roda `pnpm validate:mvp`.
3. Confere os itens manuais de aceite.
4. Decide se o MVP segue para beta controlado ou se ainda precisa resolver algum bloqueante.

## Requisitos

- O checklist deve deixar claro o que ja esta OK.
- O checklist deve separar bloqueantes de itens adiados.
- O README deve apontar para o checklist.
- `pnpm validate:mvp` deve executar o mesmo gate de `pnpm validate:beta`.

## Regras de negocio

- Trial expirado continua bloqueando gerar, imprimir/PDF, WhatsApp e marcar proposta como enviada.
- Plano Fundador continua sendo ativado apenas por operacao administrativa.
- Prints, imagens e polimento visual ficam fora desta rodada.

## Impactos por projeto

- API: nenhum codigo novo.
- Web: nenhum codigo novo.
- Mobile: nenhum impacto.
- Landing: nenhum impacto.
- Packages: nenhum impacto.
- Infra: compose continua validado pelo gate.

## Criterios de aceite

- Existe `docs/product/checklist-final-beta-mvp.md`.
- O README referencia o checklist final.
- `package.json` possui script `validate:mvp`.
- `pnpm validate:mvp` passa localmente.
- Ao final da validacao, nao ficam servidores web/API rodando nas portas locais do MVP.

## Estrategia de implementacao

- Criar documentacao de checklist.
- Atualizar scripts da raiz.
- Atualizar README.
- Rodar validacao automatizada.
- Limpar processos que possam ficar em execucao.

## Testes

- `pnpm validate:mvp`
- Verificacao de portas `5173`, `5262` e `7099` sem listener depois dos testes.
