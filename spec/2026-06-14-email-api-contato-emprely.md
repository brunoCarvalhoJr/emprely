# Spec - Email da API usando contato@emprely.com.br

## Visao geral

Alinhar o email operacional da API com a caixa criada no Zoho Mail: `contato@emprely.com.br`.

## Escopo

Inclui:

- Alterar defaults da API para `contato@emprely.com.br`.
- Alterar `appsettings.Development.json` e `appsettings.Staging.example.json`.
- Atualizar docs de deploy e README.
- Atualizar specs antigas que citavam o endereco antigo de suporte.
- Registrar a decisao nos rastreadores Notion/Obsidian.

Fora do escopo:

- Criar alias separado de suporte no Zoho.
- Configurar SES real.
- Validar DNS do Zoho/SES em producao.
- Renomear a propriedade tecnica `SuporteDestinoEmail`.

## Fluxo ponta a ponta

1. Usuario solicita suporte ou formulario de contato.
2. API monta email de suporte usando `EmailTransacional:SuporteDestinoEmail`.
3. Valor configurado aponta para `contato@emprely.com.br`.
4. Emails transacionais enviados pela API usam `Emprely <contato@emprely.com.br>`.

## Requisitos

- R01: `EmailTransacionalOptions.FromEmail` deve usar `contato@emprely.com.br`.
- R02: `EmailTransacionalOptions.SuporteDestinoEmail` deve usar `contato@emprely.com.br`.
- R03: `appsettings.Development.json` deve usar `contato@emprely.com.br`.
- R04: `appsettings.Staging.example.json` deve usar `contato@emprely.com.br`.
- R05: Docs de deploy devem orientar `EmailTransacional__FromEmail=contato@emprely.com.br`.
- R06: Nenhum arquivo deve continuar recomendando endereco separado de suporte como decisao atual.

## Regras de negocio

- A caixa oficial inicial e `contato@emprely.com.br`.
- Um endereco separado de suporte pode ser criado depois como alias ou caixa separada, se houver necessidade.
- A API nao deve depender de uma caixa inexistente no Zoho.

## Impactos por projeto

- API: alterar options e appsettings.
- Web: sem impacto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: SES/Zoho transacional deve validar o remetente `contato@emprely.com.br`.

## Criterios de aceite

- CA01: Build da API passa.
- CA02: Testes da API passam.
- CA03: Busca textual confirma que os valores operacionais da API usam `contato@emprely.com.br`.
- CA04: Notion e Obsidian registram que a API usa `contato@emprely.com.br`.

## Estrategia de implementacao

1. Trocar defaults e appsettings.
2. Atualizar README/runbook/specs.
3. Atualizar rastreadores.
4. Rodar build/testes e busca textual.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `rg -n "contato@emprely.com.br|EmailTransacional__FromEmail|EmailTransacional__SuporteDestinoEmail"`
