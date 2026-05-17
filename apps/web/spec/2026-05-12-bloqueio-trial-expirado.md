# Spec Web - Bloqueio por trial expirado

## Visao geral

Aplicar bloqueio visual e funcional para geracao/exportacao/compartilhamento de propostas quando o trial da conta estiver expirado. A tela deve orientar o usuario a ativar o Plano Fundador.

## Rotas

- `/`: SPA React, view `propostas`.
- `/`: SPA React, view `conta`.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: erro `403` de geracao aparece no card de proposta.
- Sucesso: ativacao do Plano Fundador remove o bloqueio imediatamente pelo cache de conta atualizado.

## Componentes

- Banner de bloqueio na view `propostas`.
- Mensagem compacta no card de proposta selecionada.
- Botoes e links de proposta respeitam `contaPodeExportarProposta`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- `POST /api/proposals/{id}/generate` pode retornar `403` com `message`.
- `POST /api/account/activate-founder` continua sendo a forma manual de remover o bloqueio no MVP.

## Criterios de aceite

- Trial expirado desabilita `Gerar proposta`.
- Trial expirado desabilita `Imprimir/PDF`.
- Trial expirado desabilita `Abrir WhatsApp`.
- Trial expirado desabilita `Marcar enviada`.
- Trial expirado nao bloqueia visualizar historico.
- Trial expirado nao bloqueia marcar proposta ja enviada como aceita/recusada.
- Plano Fundador remove os bloqueios.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Conta com `TrialExpirado` deve ver banner e botoes bloqueados.
  - Conta `Fundador` deve ver botoes liberados quando a proposta estiver gerada.
