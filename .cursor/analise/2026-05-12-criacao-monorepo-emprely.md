# Analise - Criacao do monorepo Emprely

## Contexto

O projeto Emprely Orçamentos precisa sair da fase de landing e preparar a base técnica do MVP funcional.

Fontes usadas:

- plano local `C:\Users\Usuario\Downloads\plano-execucao-emprely-orcamentos.md`;
- contexto do Notion sobre Central Emprely, arquitetura, backlog MVP e padrão SDD;
- decisão do usuário de usar a pasta atual como raiz e .NET 9 instalado.

## Objetivo

Criar a estrutura inicial do monorepo, scaffolds técnicos e fluxo SDD antes da implementação das features do MVP.

## Projetos impactados

- API: scaffold ASP.NET Core com camadas e testes.
- Web: scaffold Next.js com Tailwind.
- Mobile: placeholder para Expo futuro.
- Landing: referência à landing existente.
- Packages: tokens, tipos compartilhados e config.
- Infra: Docker, Terraform e pipelines como base documental.

## Regras

- Não criar subpasta `emprely/` dentro da raiz.
- Não copiar a landing existente para `apps/landing`.
- Usar .NET 9 porque é o SDK disponível e aprovado para esta execução.
- Criar SDD em cada projeto.
- Usar PortuguesIngles em funções, arquivos e variáveis de domínio.

## Riscos

- .NET 9 não é a recomendação LTS original do plano, mas foi escolhido para esta máquina.
- Mobile e landing ficam placeholders, então não devem ser tratados como apps finais.
- Pnpm 11 exige aprovação explícita de build scripts para dependências como `sharp`.

## Dúvidas resolvidas

- Raiz: `D:\Emprely\Projetos\Emprely`.
- .NET: usar SDK atual 9.0.313.
- Landing: referenciar por enquanto.
