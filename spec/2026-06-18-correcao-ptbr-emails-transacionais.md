# Spec - Correcao pt-BR dos e-mails transacionais

## Visao geral

Corrigir a ortografia, acentuacao e naturalidade dos e-mails transacionais enviados pelo Emprely, mantendo o builder central existente e sem mudar o comportamento tecnico de envio.

## Escopo

Inclui:

- confirmacao de e-mail;
- recuperacao de senha;
- boas-vindas;
- inicio de teste;
- trial proximo do fim;
- trial expirado;
- confirmacao de troca de e-mail;
- aviso de e-mail alterado;
- suporte publico e autenticado;
- fallback generico do template.

Fora do escopo:

- criar novos tipos de e-mail;
- mudar provider SES/Zoho;
- editar layout visual estrutural;
- alterar token, validade, rota ou regra de negocio.

## Fluxo ponta a ponta

1. Usuario ou admin aciona um fluxo que envia e-mail.
2. Controller monta assunto/texto-base.
3. `EmailTransacionalTemplateBuilder` gera HTML e texto alternativo.
4. Usuario recebe e-mail com pt-BR correto.

## Requisitos

- Todos os textos visiveis dos templates devem estar com acentuacao correta.
- O texto alternativo deve usar os mesmos termos corrigidos.
- Nao deve haver mojibake em arquivos de codigo do fluxo transacional.
- O tom deve ser profissional, direto e natural em pt-BR.

## Regras de negocio

- Links de confirmacao continuam valendo 24 horas.
- Links de recuperacao continuam valendo 1 hora.
- Mensagens de seguranca continuam orientando o usuario a ignorar a acao se nao tiver solicitado.

## Impactos por projeto

- API: correcao de strings em builder/controllers.
- Web: sem impacto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Criterios de aceite

- `EmailTransacionalTemplateBuilder` nao contem caracteres quebrados.
- Controllers que enviam e-mail transacional nao contem caracteres quebrados nos textos enviados.
- `dotnet build apps/api/src/Emprely.Api/Emprely.Api.csproj` passa.

## Estrategia de implementacao

- Revisar o builder central.
- Corrigir os textos-base dos controllers que chamam o builder.
- Validar por busca textual e build.

## Testes

- Busca por caracteres quebrados em `apps/api/src/Emprely.Api`.
- Build da API.
