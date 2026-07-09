# Analise: melhoria de layout e usabilidade do painel admin

## Contexto

O painel `/admin` acumulou metricas, filtros, tabela de usuarios, troca de senha, administradores, emails e painel de detalhe na mesma tela. No uso real, a interface ficou estreita, muito longa e com tabelas exigindo rolagem horizontal constante.

## Problemas observados

- Conteudo principal espremido por painel lateral fixo mesmo quando a secao nao precisa de detalhe.
- Todas as areas aparecem empilhadas, dificultando foco operacional.
- Administradores e emails ficam muito abaixo da dobra, parecendo quebrados.
- Tabelas largas nao possuem alternativa boa em telas menores.
- Acoes principais competem visualmente entre si.

## Decisao

Refatorar o painel para navegacao por secoes:

- `Usuarios`: metricas, filtros, acoes de usuarios, tabela/lista e detalhe lateral.
- `Seguranca`: troca de senha do admin logado.
- `Administradores`: gestao de admins, apenas para SuperAdmin.
- `Emails`: confirmacoes e historico, apenas para SuperAdmin.

## Fora de escopo

- Mudancas de permissoes ou regras de API.
- Novos endpoints.
- Redesign visual completo de marca.
