# Analise - API Lambda e upload de logo em S3

## Contexto

A decisao atual de infraestrutura do beta real e publicar a API ASP.NET Core em AWS Lambda + API Gateway. Ao revisar o codigo, a API ainda nao tinha adaptador Lambda e o upload de logomarca gravava o arquivo em disco local dentro de `wwwroot/uploads/account-logos`.

Esse desenho funciona em desenvolvimento, mas nao e adequado para Lambda: o pacote da funcao nao deve ser tratado como storage persistente, e arquivos de usuario precisam ir para storage externo ou o upload precisa ser desativado temporariamente.

## Objetivo

Preparar a API para rodar em Lambda sem perder o modo local atual:

- adicionar suporte oficial a Lambda hosting;
- manter upload local apenas para desenvolvimento/testes;
- permitir upload de logo em S3 no beta real;
- permitir desativar temporariamente o upload de logo em ambiente serverless se o bucket ainda nao estiver pronto;
- documentar variaveis e restricoes para deploy.

## Projetos impactados

- API: `Emprely.Api`, DI, configuracao e servico de upload de logo.
- Web: sem mudanca direta; continua consumindo `LogoUrl`.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: novos pacotes AWS no projeto da API.
- Infra: exige bucket/CloudFront ou desativacao temporaria do upload em Lambda.

## Fluxo atual

1. Usuario envia `POST /api/account/profile/logo`.
2. API valida tipo/tamanho, converte para WebP e grava em `wwwroot/uploads/account-logos/{contaId}`.
3. API retorna URL relativa `/uploads/account-logos/...`.
4. `UseStaticFiles` serve o arquivo localmente.

## Fluxo proposto

1. API registra `AddAWSLambdaHosting(LambdaEventSource.HttpApi)` para funcionar atras de API Gateway HTTP API.
2. Configuracao `LogoPerfilStorage:Provider` escolhe o storage:
   - `Local`: comportamento atual, apenas dev/testes;
   - `S3`: converte para WebP e envia para bucket S3;
   - `Disabled`: endpoint responde erro de negocio controlado, sem tentar gravar arquivo.
3. Em Lambda, `Local` deve falhar na inicializacao para evitar deploy com disco local acidental.
4. Em `S3`, a API exige bucket e base publica/CDN para retornar uma URL persistente valida.
5. Static files locais so sao registrados quando o provider for `Local`.

## Regras de negocio

- Upload de logomarca nao pode bloquear o beta inteiro; se S3 nao estiver pronto, o provider `Disabled` permite rodar a API sem upload.
- Logo salva no perfil continua sendo apenas referencia `LogoUrl`.
- A imagem continua limitada a 2 MB e convertida para WebP.
- Em beta real, usar IAM Role da Lambda em vez de access key fixa sempre que possivel.

## Impactos tecnicos

- `net9.0` continua no projeto. Como .NET 9 nao e runtime LTS gerenciado comum do Lambda, o deploy precisara empacotar como self-contained executable ou OCI image, ou uma decisao futura pode migrar a API para `net8.0`.
- O evento escolhido para Lambda e `HttpApi`, alinhado ao objetivo de baixo custo.
- S3 precisa de `BucketName`, `PublicBaseUrl`, `KeyPrefix` e opcionalmente `Region`.
- O provider `Local` permanece como padrao em desenvolvimento para manter os testes de upload existentes.

## Riscos

- Se `LogoPerfilStorage:S3PublicBaseUrl` apontar para dominio sem acesso ao bucket, as logos serao salvas mas nao carregarao no web.
- Se o bucket/CloudFront nao estiver configurado com CORS adequado, exportacoes futuras por canvas/PDF podem falhar ao carregar imagem externa.
- Se o deploy continuar em `net9.0`, a publicacao Lambda precisa respeitar o empacotamento exigido para STS.
- Esta tarefa nao cria bucket, CloudFront, politicas IAM nem pipeline de deploy.

## Duvidas

- Definir nome final do bucket e dominio/CDN para assets (`assets.emprely.com.br` ou outro).
- Definir se a API vai publicar Lambda como self-contained zip, OCI image, ou se havera downgrade controlado para `net8.0`.
