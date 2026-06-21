# Spec: contato WhatsApp e e-mail oficiais

## Origem

- Analise relacionada: `.cursor/analise/2026-06-21-contato-whatsapp-email-global.md`
- Data: 2026-06-21
- Solicitante: Bruno

## Objetivo

- Resultado esperado: todo ponto de suporte, compra, ativacao de plano ou contato institucional deve apontar para `+55 (35) 99738-9755` e/ou `contato@emprely.com.br`.
- Problema que resolve: falta de canal de contato direto e padronizado para clientes interessados.
- Areas impactadas: webapp SaaS e landing externa.

## Escopo

### Incluido

- Criar constantes/links oficiais de contato no webapp.
- Exibir WhatsApp e e-mail no suporte publico e logado.
- Direcionar ativacao de plano trial para conversa comercial via WhatsApp.
- Atualizar mensagens de bloqueio de trial expirado para orientar contato.
- Atualizar documentacao operacional quando necessario.
- Atualizar landing externa em SDD proprio.

### Fora do escopo

- Alterar contratos de API.
- Criar checkout/pagamento.
- Alterar banco de dados.
- Trocar telefones dos clientes usados em propostas.

## Requisitos funcionais

- WhatsApp exibido: `+55 (35) 99738-9755`.
- WhatsApp link: `https://wa.me/5535997389755`.
- E-mail exibido: `contato@emprely.com.br`.
- O CTA "Ativar plano" deve abrir WhatsApp com mensagem contextual.
- O formulario de suporte continua funcionando pela API existente.
- Links externos devem abrir em nova aba quando fizer sentido.

## Requisitos de copy

- Tom: claro, profissional e direto.
- Textos devem indicar que WhatsApp atende suporte, compra, Plano Fundador e duvidas comerciais.
- Nao prometer ativacao automatica ou resultado financeiro garantido.

## Requisitos tecnicos

- Preservar arquitetura React/Vite atual.
- Nao adicionar dependencias.
- Evitar hardcode repetido usando constantes.
- Manter data-testid e labels essenciais de testes existentes.

## Criterios de aceite

- `/suporte` publico mostra WhatsApp e e-mail oficiais.
- Tela logada de Suporte mostra WhatsApp e e-mail oficiais.
- Banner de trial permite ativar plano pelo WhatsApp oficial.
- Mensagens de trial expirado orientam falar com o Emprely.
- Landing externa usa os mesmos canais oficiais.
- Build/lint aplicaveis executados ou justificativa registrada.
