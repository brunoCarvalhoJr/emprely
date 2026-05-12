# ADR-001 - Stack oficial do MVP

## Status

Aceita.

## Decisão

O MVP do Emprely Orçamentos usa monorepo, API ASP.NET Core, web React com Vite, banco PostgreSQL e infraestrutura planejada na AWS.

Nesta máquina, a API foi criada com .NET 9 porque o SDK disponível é `9.0.313`.

## Consequências

- O backend nasce como monolito modular, não microserviços.
- O frontend web e a landing compartilham decisões visuais e tipos quando fizer sentido.
- O mobile fica preparado como app Expo futuro, sem entrar no scaffold inicial.
- A landing existente permanece em `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`.
