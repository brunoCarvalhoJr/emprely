# Spec - Corrigir logging dos testes de integracao no Windows

## Contexto

Durante a revisao geral de 2026-06-16, `dotnet test apps/api/Emprely.sln --no-build` falhou nos testes de integracao com erro de acesso ao Windows Event Log:

```txt
Cannot open log for source '.NET Runtime'. You may not have write access.
```

Com o override temporario `Logging__EventLog__LogLevel__Default=None`, os testes passavam. Isso indicou que o problema era o provider de logging usado pelo TestHost no Windows, nao uma falha funcional confirmada da API.

## Objetivo

Garantir que os testes de integracao rodem sem exigir permissao administrativa ou acesso ao Windows Event Log.

## Requisitos

- R01: Os testes de integracao nao devem depender do Windows Event Log.
- R02: A correcao deve ficar restrita ao projeto de testes.
- R03: A API em runtime real nao deve ter logging alterado por esta correcao.
- R04: `dotnet test apps/api/Emprely.sln` deve passar sem variavel manual de logging.

## Implementacao

- Em `EmprelyApiFactory`, limpar os providers de logging do TestHost com `builder.ConfigureLogging(logging => logging.ClearProviders())`.

## Criterios de aceite

- `dotnet test apps/api/Emprely.sln` passa no Windows.
- Testes unitarios e de integracao continuam executando.
- Nenhum arquivo de configuracao de runtime da API e alterado.

## Validacao

Executado em 2026-06-16:

```powershell
dotnet test apps/api/Emprely.sln
```

Resultado:

- 47 testes unitarios aprovados.
- 13 testes de integracao aprovados.
