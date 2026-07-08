# Obsidian update - Checkout com dados do pagador

## Onde paramos

Implementado fluxo de checkout no app com dados do pagador e escolha de Pix ou cartao hospedado no Asaas.

## Pontos importantes

- Emprely coleta CPF/CNPJ e dados cadastrais do pagador.
- Emprely nao coleta dados sensiveis de cartao.
- API normaliza CPF/CNPJ, telefone e CEP antes de chamar provider.
- Asaas customer passa a receber dados fiscais/de contato.
- Cartao deixou de ficar bloqueado no catalogo, mas segue hospedado no Asaas.

## Validacao feita

- API: 50 unitarios + 61 integracao passando.
- Web: lint passando.
- Web: build beta passando.

## Proximo passo

Executar teste real de checkout com uma conta de teste e validar webhook/reconciliacao.

## Deploy

- API publicada no Lightsail em 2026-07-08.
- Webapp publicado em S3 + CloudFront.
- Invalidation criada: `ICZHXD5QP88J1DH0O5TF7CADRT`.
- API live/ready e app/rotas de retorno billing responderam HTTP 200.
- Permissao `cloudfront:GetInvalidation` segue ausente no usuario de deploy; isso nao bloqueou publicacao nem validacao HTTP.
