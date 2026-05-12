# AGENTS.md

## Regra principal

Neste repositório, a IA deve trabalhar com SDD:

```txt
US ou ideia -> analise -> perguntas -> spec -> implementacao
```

## Antes de implementar

1. Ler o contexto do projeto e o template SDD do app ou package afetado.
2. Criar ou atualizar a análise em `.cursor/analise/`.
3. Levantar dúvidas de negócio, fluxo, escopo, aceite e integrações.
4. Criar ou atualizar a spec em `spec/`.
5. Implementar apenas o comportamento coberto pela spec.

## Convenções

- Preservar a arquitetura modular do monorepo.
- Usar nomes PortuguesIngles para funções, arquivos e variáveis de domínio.
- Não criar microserviços no MVP.
- Não mover a landing existente para `apps/landing` sem decisão explícita.
- Não colocar secrets no repositório.
- Validar com os comandos reais do app afetado.
