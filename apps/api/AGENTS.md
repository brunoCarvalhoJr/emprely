# AGENTS.md - API

## Fluxo obrigatório

Antes de alterar a API:

1. Criar análise em `apps/api/.cursor/analise/`.
2. Criar spec em `apps/api/spec/`.
3. Validar impacto em contratos, domínio, aplicação e infraestrutura.
4. Implementar apenas o que a spec cobre.

## Convenções

- Manter Clean Architecture.
- `Emprely.Contracts` define requests/responses públicos.
- O frontend nunca decide `AccountId`; a API resolve pelo contexto autenticado.
- Funções e arquivos de domínio usam PortuguesIngles, como `FindByUsuarioAsync`.
- Rotas HTTP podem permanecer em inglês para estabilidade pública.
