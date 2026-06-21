# Analise: linkar landing ao fluxo real do app

## Contexto

- Tarefa solicitada: linkar a landing para o fluxo real do app, principalmente `https://app.emprely.com.br/suporte`.
- Objetivo: permitir que a landing envie visitantes para rotas reais do SaaS publicado, em vez de manter todos os CTAs presos ao formulario interno da landing.
- Area impactada: inicializacao publica do app autenticado.
- Tipo de mudanca: produto, codigo, roteamento e conversao.

## Fontes consultadas

- `AGENTS.md` do monorepo: SDD antes de implementar.
- `apps/web/src/App.tsx`: modo publico, rota `/suporte`, tabs de login/cadastro e `getAuthModeInicial`.
- `apps/web/src/main.tsx`: roteamento por pathname para admin/app.
- Landing externa `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`: CTAs atuais ainda apontam para `#lead-form`.

## Estado encontrado

- `https://app.emprely.com.br/suporte` e uma rota publica real do app, detectada por `isSuportePublicoPath()`.
- O app possui fluxo de cadastro/trial via `authMode === "cadastro"`, mas `getAuthModeInicial()` nao reconhece uma URL direta para abrir essa aba.
- A landing precisa conseguir apontar o CTA de teste para um destino real de cadastro, sem depender de clique manual na aba depois que o visitante chega ao app.

## Decisao

- Adicionar suporte ao query param `?auth=cadastro` em `getAuthModeInicial()`.
- A landing podera usar `https://app.emprely.com.br/?auth=cadastro` para o CTA principal de trial.
- A landing deve usar `https://app.emprely.com.br/suporte` para contato, suporte, duvidas e Plano Fundador.

## Impacto

- Produto/conversao: reduz friccao entre a landing e o app real.
- Copy/tom: nao altera promessa principal.
- UI/identidade: nao altera visual do webapp.
- SEO/performance: impacto irrelevante; apenas leitura de query param no cliente.
- Analytics: eventos de clique da landing continuam sendo disparados antes da navegacao externa.

## Riscos

- `?auth=cadastro` precisa preservar os fluxos ja existentes de confirmacao e reset. Por isso a mudanca deve ser aditiva e nao alterar os parametros `confirm-email`, `reset-password` e `confirm-change-email`.

## Conclusao

- Implementar leitura de `auth=cadastro` no app e ajustar a landing para usar os destinos reais.
