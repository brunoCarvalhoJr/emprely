# Spec - Reset do tour inicial por usuario

## Objetivo

Permitir que o painel administrativo reabra o tour inicial para um usuario especifico e resetar o estado atual de todos os usuarios no banco, garantindo que a proxima entrada seja tratada como primeira experiencia de tour.

## Fluxo administrativo

1. Admin acessa o painel administrativo.
2. Admin seleciona um usuario.
3. Super Admin ve a acao `Resetar tour`.
4. Ao clicar, abre modal de acao administrativa.
5. Admin informa o motivo.
6. Sistema chama `POST /api/admin/usuarios/{usuarioId}/reset-tour`.
7. Sistema invalida a lista/detalhe e registra auditoria.

## Contrato de API

### `POST /api/admin/usuarios/{usuarioId}/reset-tour`

Entrada:

```json
{
  "motivo": "Reabrir tour inicial para suporte"
}
```

Saida:

- `204 No Content` em sucesso.
- `403 Forbidden` quando o admin nao for Super Admin.
- `404 Not Found` quando o usuario nao existir.
- `400 ValidationProblem` quando o motivo estiver ausente.

## Persistencia

Atualiza registros de `onboarding_usuarios` do usuario:

- `StatusTour = 'NaoIniciado'`
- `TourExibidoAt = null`
- `TourPuladoAt = null`
- `TourConcluidoAt = null`
- `UpdatedAt = now()`

Se o usuario tem conta, mas ainda nao tem registro de onboarding, cria um registro inicial para a conta.

## UI

- Adicionar botao `Resetar tour` no painel lateral de detalhe do usuario.
- Exibir apenas para Super Admin.
- Reutilizar modal administrativa existente com campo de motivo.

## Testes

- Cobrir via teste de integracao:
  - usuario conclui tour;
  - Super Admin reseta tour;
  - usuario consulta `/api/onboarding`;
  - status do tour volta para `NaoIniciado` e timestamps ficam nulos.

## Nao objetivos

- Nao alterar banco via migration.
- Nao apagar dados de negocio.
- Nao alterar regras do wizard de primeira proposta.
