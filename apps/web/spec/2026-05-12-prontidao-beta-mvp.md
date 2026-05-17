# Spec Web - Prontidao beta do MVP

## Visao geral

Adicionar no dashboard um resumo funcional de prontidao beta. O objetivo e dar visibilidade rapida sobre o que falta para uma conta testar o MVP de ponta a ponta.

## Regras

- O resumo deve usar somente dados ja carregados no web.
- O percentual deve ser `itens concluidos / total`.
- Quando todos os itens estiverem concluidos, o status deve indicar conta pronta para beta.
- Quando houver pendencias, o status deve indicar o proximo ajuste funcional.

## Itens avaliados

| Item | Concluido quando | Acao |
| --- | --- | --- |
| Perfil configurado | `perfilConta.updatedAt` existe | abrir Conta |
| Base minima | existe cliente e servico | abrir cliente ou servico |
| Proposta criada | existe proposta ativa | abrir nova proposta |
| Fluxo comercial usado | existe proposta `Gerada`, `Enviada`, `Aceita` ou `Recusada` | abrir propostas |
| WhatsApp preparado | existe cliente com telefone valido | abrir clientes |
| Acesso comercial | conta pode gerar/enviar proposta | abrir Conta |

## Criterios de aceite

- Dashboard mostra percentual de prontidao.
- Dashboard lista itens prontos e pendentes.
- Item pendente tem botao que leva ao fluxo correspondente.
- O resumo nao faz nova chamada de API.
- O resumo nao bloqueia o uso do sistema.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
