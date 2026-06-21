# Analise - Redes sociais opcionais no cliente

## Contexto

O cadastro completo de cliente ja possui dados de contato e endereco. O usuario pediu novos campos opcionais para redes sociais: Instagram, Facebook e TikTok.

## Decisao

Adicionar os campos como strings opcionais persistidas no cliente, aceitando perfil ou URL. Nao aplicar mascara porque cada rede social possui formatos de perfil e link diferentes.

## Impacto

- API: entidade `Cliente`, contratos de request/response, controller, EF Core e migracao.
- Web: tipos do cliente, schema do formulario, valores padrao, payload, busca e detalhe.
- Testes: normalizacao do dominio e fluxo integrado de criacao de cliente.

## Riscos

- Contratos posicionais em C# exigem atualizacao de todos os construtores.
- O formulario de cliente nao deve ficar visualmente pesado; os campos entram em uma linha compacta propria.
