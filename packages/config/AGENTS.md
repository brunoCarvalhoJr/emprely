# AGENTS.md - Config

## Fluxo obrigatório

1. Criar análise em `packages/config/.cursor/analise/`.
2. Criar spec em `packages/config/spec/`.
3. Validar impacto nos apps consumidores.

## Convenções

- Configuração compartilhada deve reduzir duplicação real.
- Não adicionar ferramenta sem uso no workspace.
- Mudanças devem ser compatíveis com Windows PowerShell.
