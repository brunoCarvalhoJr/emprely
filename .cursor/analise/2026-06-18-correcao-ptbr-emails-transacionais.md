# Analise - Correcao pt-BR dos e-mails transacionais

## Contexto

Durante a validacao real dos e-mails enviados pelo Emprely, foram percebidos erros de portugues e caracteres quebrados em pt-BR nos templates transacionais. A publicacao de `https://app.emprely.com.br` ja esta concluida e o app ja consome `https://api.emprely.com.br`; a pendencia atual e corrigir a qualidade textual dos e-mails antes de continuar o aceite beta.

## Objetivo

Revisar todos os textos visiveis dos e-mails transacionais atuais para garantir ortografia, acentuacao e clareza em portugues brasileiro.

## Projetos impactados

- API: templates e textos-base de e-mails transacionais.
- Web: sem mudanca funcional.
- Mobile: sem mudanca funcional.
- Landing: sem mudanca funcional.
- Packages: sem mudanca.
- Infra: sem mudanca.

## Fluxo atual

Os e-mails usam `EmailTransacionalTemplateBuilder`, mas varios textos foram salvos com caracteres quebrados, como `vocÃª`, `serviÃ§os`, `confirmaÃ§Ã£o` e `orÃ§amentos`. Esses textos aparecem em HTML e texto alternativo.

## Fluxo proposto

Manter o builder central e corrigir:

- conteudo de confirmacao de e-mail;
- recuperacao de senha;
- boas-vindas;
- trial iniciado, proximo do fim e expirado;
- alteracao de e-mail;
- aviso de e-mail alterado;
- suporte recebido;
- fallback generico;
- textos-base enviados pelos controllers para esses templates.

## Regras de negocio

- Nao alterar expiracao de links.
- Nao alterar URLs, tokens, hash ou persistencia.
- Nao alterar destinatarios, remetente ou provedor.
- Preservar tom profissional e claro em pt-BR.

## Impactos tecnicos

- Ajuste concentrado em strings.
- Build da API deve continuar passando.
- Busca por caracteres quebrados em `apps/api/src/Emprely.Api` deve nao retornar ocorrencias nos arquivos de codigo editados.

## Riscos

- Clientes de e-mail podem continuar exibindo versao antiga ate a API corrigida ser publicada.
- Alguma string fora do fluxo transacional pode ainda exigir revisao posterior.

## Duvidas

- Nenhuma duvida bloqueante para esta correcao.
