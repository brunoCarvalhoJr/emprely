# Analise - Identidade visual no SaaS web

## Contexto

A identidade visual da Emprely foi fornecida em `D:\Emprely\Identidade Visual`, com logo principal, favicon, icones e referencia visual. O SaaS web ja possui fluxos funcionais de autenticacao, conta, clientes, servicos e propostas, mas ainda usa uma interface generica.

## Objetivo

Aplicar a identidade visual da Emprely no sistema SaaS, tornando a experiencia mais clara, profissional e consistente com a marca, sem alterar regras de negocio nem contratos de API.

## Projetos impactados

- API: nao impactada.
- Web: aplicar logo, favicon, cores, layout, estados visuais, transicoes e preview de proposta.
- Mobile: nao impactado.
- Landing: fora do escopo; continua em projeto separado.
- Packages: nao impactados.
- Infra: nao impactada.

## Fluxo atual

O `apps/web` concentra a interface em `src/App.tsx` e usa Tailwind com variaveis simples em `src/styles.css`. A tela funciona, mas o shell, cards, botoes, auth, dashboard e preview de proposta ainda nao carregam a identidade da marca.

## Fluxo proposto

1. Copiar logo e favicon para `apps/web/public/brand`.
2. Atualizar `index.html` para usar favicon e titulo correto.
3. Atualizar paleta global para navy, roxo/azul e teal da marca.
4. Refatorar o shell do app com header, sidebar, navegacao e microinteracoes.
5. Melhorar auth, dashboard, cards, formularios e preview de proposta com hierarquia visual mais clara.
6. Preservar todos os textos, labels e acoes essenciais usados nos testes.

## Regras de negocio

- Nao alterar endpoints, payloads, validacoes ou status comerciais.
- Nao mover a landing existente para o monorepo.
- Manter `PortuguesIngles` nos nomes de dominio quando houver codigo novo.
- Manter rotulos acessiveis dos botoes e formularios.
- Evitar layout com cara de landing; o SaaS deve permanecer uma ferramenta operacional.

## Impactos tecnicos

- `apps/web/src/styles.css` passa a definir tokens visuais da marca e transicoes.
- `apps/web/src/App.tsx` passa a usar logo real, navegacao com icones e classes de shell.
- `apps/web/index.html` recebe favicon da marca.
- Assets de marca ficam versionados em `apps/web/public/brand`.

## Riscos

- Alteracoes visuais podem quebrar seletores acessiveis se textos forem removidos.
- Imagens SVG grandes podem impactar carregamento se usadas sem controle de dimensao.
- Transicoes excessivas podem prejudicar performance ou acessibilidade.

## Duvidas

- Nenhuma duvida bloqueante. Para o MVP, aplicar a identidade no SaaS web e deixar ajustes finos de imagens/prints para a etapa final, conforme decisoes anteriores.
