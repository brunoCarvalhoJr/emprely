# Spec - validacao de dias gratis admin

## Visao geral

O painel admin deve tratar payload invalido de dias gratis como erro de cliente,
com resposta clara e sem excecao interna.

## Escopo

Inclui:

- Validar `inicioAt`, `fimAt` e `motivo` nos endpoints de dias gratis.
- Retornar `400 Bad Request` para dados invalidos.
- Manter `204 No Content` para payload valido.
- Adicionar teste de integracao.

Fora do escopo:

- Alterar tela admin.
- Alterar billing, Asaas, creditos manuais ou rate limit.
- Criar novos endpoints.

## Fluxo ponta a ponta

1. Admin autenticado chama dias gratis individual ou em lote.
2. API valida permissao, conta, datas e motivo.
3. Se houver erro de entrada, API retorna `400` com mensagem.
4. Se estiver valido, API cria dias gratis, registra auditoria e retorna `204`.

## Requisitos

- Payload sem datas nao pode retornar `500`.
- `fimAt <= inicioAt` deve retornar `400`.
- motivo vazio deve retornar `400`.
- Endpoint individual deve exigir SuperAdmin como as demais operacoes criticas de conta.

## Regras de negocio

- Dias gratis dependem de janela temporal valida.
- Motivo e obrigatorio para rastreabilidade.
- Nenhuma alteracao deve ser feita quando a entrada for invalida.

## Impactos por projeto

- API: validacao defensiva no controller e teste.
- Web: sem impacto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Criterios de aceite

- `POST /api/admin/contas/{contaId}/dias-gratis` com payload sem datas retorna `400`.
- `POST /api/admin/contas/{contaId}/dias-gratis` valido continua retornando `204`.
- Testes de integracao passam.

## Estrategia de implementacao

- Criar metodo privado de validacao em `AdminContasController`.
- Chamar validacao antes de `DiasGratisConta.Create`.
- Reusar no endpoint em lote.
- Adicionar teste focado em payload invalido.

## Testes

- `dotnet test apps/api/Emprely.sln --filter MvpFluxoApiTests`
