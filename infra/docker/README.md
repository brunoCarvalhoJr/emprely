# Docker

## Beta/staging

Arquivos adicionados para um beta controlado:

- `Dockerfile.api`
- `Dockerfile.web`
- `nginx.web.conf`
- `docker-compose.beta.example.yml`
- `beta.env.example`

Valide a sintaxe com:

```powershell
pnpm validate:deploy
```

Valide build, migrations e health checks em runtime temporario com:

```powershell
pnpm validate:deploy:runtime
```

Guia operacional: `docs/product/beta-staging-deploy.md`.

Configurações Docker locais e futuras imagens do projeto.

O PostgreSQL local inicial é definido no `docker-compose.yml` da raiz.
