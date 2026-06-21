# Atualização para Notion - Regras de proposta, trial e marca d'água

Data: 2026-05-23

## Resumo executivo

As regras V1 de ciclo de vida de propostas, trial expirado e marca d'água foram consolidadas e implementadas na API e no webapp do Emprely Orçamentos.

## O que mudou

- Proposta `Rascunho` continua editável.
- Proposta `Gerada` continua editável, mas ao salvar volta para `Rascunho`.
- Antes de editar uma proposta `Gerada`, o webapp exibe aviso de que ela voltará para rascunho.
- Propostas `Enviada`, `Aceita` e `Recusada` não podem mais ser editadas diretamente.
- Para alterar uma proposta enviada/aceita/recusada, o usuário deve duplicar a proposta.
- Duplicação cria uma nova proposta como `Rascunho` e mantém a original intacta.
- Propostas arquivadas continuam fora da listagem principal.
- A API retorna `409 Conflict` para ações bloqueadas por regra de status.
- Trial ativo permite uso comercial com marca d'água discreta.
- Trial expirado bloqueia gerar, imprimir/PDF, exportar imagem, enviar e compartilhar proposta.
- Trial expirado ainda permite visualizar propostas internamente, criar clientes, criar serviços, criar rascunhos e duplicar propostas.
- Trial expirado exibe marca d'água grande atravessando a proposta na visualização interna.
- Dashboard e tela de propostas exibem banner de trial expirado com CTA “Ativar plano”.
- A copy pública evita “Plano Fundador” no CTA principal, embora o nome interno continue no domínio/API por enquanto.

## Arquivos principais alterados

- `apps/api/src/Emprely.Domain/Propostas/Proposta.cs`
- `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`
- `apps/api/tests/Emprely.UnitTests/Propostas/PropostaTests.cs`
- `apps/api/tests/Emprely.IntegrationTests/MvpFluxoApiTests.cs`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `spec/2026-05-23-regras-proposta-trial-watermark.md`

## Validações

- `npm run build` no webapp: passou.
- `npm run lint` no webapp: passou.
- `dotnet test` na API: pendente neste ambiente, porque `dotnet` não está disponível.

## Próxima validação recomendada

Rodar `dotnet test` em ambiente com .NET SDK instalado e executar aceite manual com os seguintes cenários:

1. Editar proposta `Gerada` e confirmar retorno para `Rascunho` ao salvar.
2. Tentar editar proposta `Enviada`, `Aceita` e `Recusada` pela UI.
3. Chamar `PUT /api/proposals/{id}` diretamente em proposta `Enviada`, `Aceita` e `Recusada` e validar `409 Conflict`.
4. Duplicar proposta enviada/aceita/recusada e confirmar nova proposta como `Rascunho`.
5. Expirar trial de uma conta de teste e validar bloqueio de gerar/enviar/exportar.
6. Validar banner “Ativar plano” no dashboard e em propostas.
7. Validar marca d'água discreta em trial ativo.
8. Validar marca d'água grande em trial expirado.

## Link local da spec

`spec/2026-05-23-regras-proposta-trial-watermark.md`
