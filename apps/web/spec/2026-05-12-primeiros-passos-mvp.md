# Spec Web - Primeiros passos do MVP

## Visao geral

Adicionar ao dashboard um checklist funcional para guiar contas novas ate o uso minimo do produto: configurar perfil, cadastrar cliente, cadastrar servico e criar proposta.

## Comportamento

- O dashboard deve mostrar progresso `concluidos/total`.
- Cada passo deve exibir estado concluido ou pendente.
- O proximo passo pendente deve ter acao primaria.
- Todos os passos devem ter botao para abrir o fluxo correspondente.

## Passos

| Passo | Concluido quando | Acao |
| --- | --- | --- |
| Perfil da conta | `perfilConta.updatedAt` existe | abrir tela Conta |
| Cliente | `clientes.length > 0` | abrir novo cliente |
| Servico | `servicos.length > 0` | abrir novo servico |
| Primeira proposta | `propostas.length > 0` | abrir nova proposta |

## Criterios de aceite

- Conta nova ve checklist no dashboard.
- Ao clicar em perfil, navega para `Conta`.
- Ao clicar em cliente, abre formulario de novo cliente.
- Ao clicar em servico, abre formulario de novo servico.
- Ao clicar em proposta, abre formulario de nova proposta.
- Checklist reflete os dados carregados sem chamada nova de API.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
