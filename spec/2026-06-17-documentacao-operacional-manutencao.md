# Spec - Documentacao operacional e manutencao

## Visao geral

Criar uma documentacao operacional para deploy, configuracao, dados e manutencao dos projetos Emprely, deixando claro como o assistente deve proceder em manutencoes futuras.

## Escopo

Inclui:

- Manual central de operacoes em `docs/operations/manutencao-projetos-emprely.md`.
- Inventario dos projetos: API, webapp SaaS, landing, mobile, packages e infra.
- Configuracoes e variaveis de ambiente por projeto.
- Procedimentos de acesso ao banco local e remoto sem expor secrets.
- Playbooks de deploy e validacao.
- Inclusao operacional da landing externa no workspace via `apps/landing` e scripts.
- Atualizacao do README raiz com link para o manual.
- Sincronizacao da documentacao operacional com Notion e Obsidian.

Fora do escopo:

- Copiar fisicamente a landing externa para dentro de `apps/landing`.
- Alterar secrets, DNS, AWS, Neon, Zoho ou SES.
- Executar deploy real.
- Alterar codigo funcional da API, web ou landing.

## Fluxo ponta a ponta

1. O mantenedor abre o manual operacional.
2. Identifica o projeto afetado.
3. Confere variaveis, dados e secrets necessarios.
4. Executa validacao local adequada.
5. Executa o playbook de deploy ou manutencao.
6. Confere health checks, dominio e logs.
7. Atualiza rastreadores/decisoes quando houver mudanca relevante.

## Requisitos

- O manual deve ser claro para uma manutencao futura feita pelo assistente.
- O manual deve separar valores publicos de secrets.
- O manual deve explicar banco local, banco beta/Neon, migrations e backup.
- O manual deve documentar os comandos reais ja existentes.
- A landing deve ficar acessivel por comandos do workspace, preservando sua localizacao externa.

## Regras de negocio

- Nao registrar connection strings reais, chaves JWT, AWS keys, admin keys ou tokens privados.
- Para beta real, usar API em Lightsail, banco Neon, web em S3/CloudFront e e-mail transacional via SES.
- Landing canonica continua em `www.emprely.com.br` e `emprely.com.br`.
- SaaS web deve usar `app.emprely.com.br`.
- API deve usar `api.emprely.com.br`.

## Impactos por projeto

- API: documentacao operacional, sem alteracao de codigo.
- Web: documentacao operacional, sem alteracao de codigo.
- Mobile: documentacao do status placeholder.
- Landing: atualizacao do placeholder para operar a landing externa.
- Packages: documentacao do status atual.
- Infra: documentacao dos runbooks existentes.

## Criterios de aceite

- Existe manual central com inventario, deploy, banco, secrets e manutencao.
- README raiz aponta para o manual.
- `apps/landing` aponta explicitamente para a landing externa e oferece comandos de manutencao.
- `package.json` da raiz inclui scripts de conveniencia para a landing.
- Notion possui pagina/rastreador atualizado com o manual operacional e o estado vigente.
- Obsidian possui nota operacional espelhada e rastreador apontando para ela.
- JSON dos package files continua valido.
- Nenhum secret real e adicionado ao repositorio.

## Estrategia de implementacao

- Criar novo documento em `docs/operations`.
- Atualizar `README.md`.
- Atualizar `apps/landing/README.md`.
- Atualizar scripts em `apps/landing/package.json` e `package.json` da raiz.
- Atualizar Notion e Obsidian com a mesma referencia operacional, sem secrets reais.

## Testes

- Validar JSON de `package.json` e `apps/landing/package.json`.
- Rodar `pnpm validate:mvp` se o tempo permitir.
- Rodar ou pelo menos validar o script de check da landing externa quando aplicavel.
- Conferir leitura posterior das paginas/notas sincronizadas.
