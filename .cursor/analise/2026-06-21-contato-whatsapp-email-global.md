# Analise: contato WhatsApp e e-mail oficiais

## Contexto

- Tarefa solicitada: revisar landing page e projetos Emprely para adicionar o WhatsApp pessoal `+55 (35) 99738-9755` e o e-mail `contato@emprely.com.br` como canais oficiais de contato, suporte e ativacao de plano.
- Objetivo da mudanca: deixar os pontos de conversao, suporte e compra com canal claro, direto e consistente.
- Areas impactadas: webapp SaaS, suporte publico, suporte logado, trial/ativacao de plano, documentacao SDD.
- Tipo de mudanca: produto, copy, UX, codigo e documentacao.

## Fontes consultadas

- `AGENTS.md`: exige fluxo SDD antes de implementar.
- `docs/architecture/dominios-ambientes.md`: ja define `contato@emprely.com.br` como email profissional/transacional.
- `docs/operations/manutencao-projetos-emprely.md`: ja referencia suporte e email transacional.
- `apps/web/src/App.tsx`: pontos de suporte, trial, bloqueio de plano e links de WhatsApp.
- `apps/web/src/styles.css`: estilos existentes de suporte/trial quando necessario.
- Projeto externo da landing `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`: regras, PRD, conteudo e componentes de contato.

## Decisoes

- O WhatsApp publico oficial passa a ser `+55 (35) 99738-9755`.
- O link tecnico para WhatsApp deve usar `https://wa.me/5535997389755`.
- O e-mail publico oficial permanece `contato@emprely.com.br`.
- O contato deve aparecer onde houver intencao de suporte, compra, ativacao de plano ou duvida comercial.
- Nao alterar contrato de API nem banco nesta mudanca.
- Nao substituir WhatsApp de cliente usado em propostas; este contato oficial e do Emprely.

## Impactos

- Produto/conversao: reduz atrito para falar com o Emprely e ativar plano.
- Copy/tom: textos devem ser diretos e comerciais, sem promessa financeira.
- UI: CTA de WhatsApp deve ser claro, mas nao competir com fluxos primarios de proposta.
- Acessibilidade: links devem ter texto/aria-label descritivos.
- Integracoes: apenas links `wa.me` e `mailto`; sem credenciais ou automacao nova.

## Riscos

- Confundir WhatsApp do Emprely com WhatsApp do cliente dentro dos fluxos de propostas.
- Espalhar telefone hardcoded em muitos componentes.
- Quebrar E2E que depende de labels/data-testid existentes.

## Conclusao

- Centralizar o contato oficial em constantes reutilizaveis.
- Adicionar CTAs de WhatsApp/e-mail no suporte publico, suporte logado e ativacao de plano.
- Atualizar a landing externa para expor o mesmo contato em navegacao, formulario, CTA final e rodape.
- Proxima etapa: criar spec correspondente e implementar.
