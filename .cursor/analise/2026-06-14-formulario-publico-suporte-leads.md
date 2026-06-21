# Analise - Formulario publico de suporte e interesse

## Contexto

Na revisao do MVP foi identificado que o SaaS ja possui suporte autenticado em `api/support` e na tela interna `Suporte`, mas ainda nao existe um formulario publico para visitantes, leads, duvidas de compra ou interesse no plano fundador.

A decisao de email atual usa `contato@emprely.com.br` como caixa oficial inicial, configurada no Zoho Mail e refletida em `EmailTransacional:SuporteDestinoEmail`.

## Objetivo

Criar uma tela publica separada de suporte/contato para capturar mensagens de visitantes sem login e enviar essas mensagens para o email oficial da Emprely.

## Projetos impactados

- API: criar contrato e endpoint publico anonimo para contato.
- Web: criar tela publica separada em `/suporte` e cliente API sem token.
- Mobile: sem impacto.
- Landing: linkar a landing para `/suporte` depois do deploy do webapp.
- Packages: sem impacto.
- Infra: endpoint publico deve ter rate limit e CORS compatbivel com o dominio publico que usar o formulario.

## Fluxo atual

- Usuario autenticado acessa a tela interna `Suporte`.
- A API registra `SuporteSolicitacao` vinculada a conta/usuario.
- A API envia email para `EmailTransacional:SuporteDestinoEmail`.
- Visitante sem login nao tem formulario publico para contato ou interesse.

## Fluxo proposto

1. Visitante acessa `/suporte`.
2. Web exibe formulario publico com nome, email, telefone opcional, empresa opcional, tipo de interesse e mensagem.
3. Web envia `POST /api/support/public` sem token.
4. API valida campos, aplica rate limit e monta email com os dados do lead.
5. API envia para `EmailTransacional:SuporteDestinoEmail`.
6. Web confirma envio e limpa o formulario.

## Regras de negocio

- A caixa oficial inicial para contato, suporte e interesse e `contato@emprely.com.br`.
- O formulario publico nao exige cadastro ou login.
- O suporte interno autenticado continua separado e vinculado a conta.
- O lead publico nao cria usuario, conta, cliente ou proposta.
- O envio publico deve ter limite basico para reduzir spam.

## Impactos tecnicos

- Novo contrato em `Emprely.Contracts.Suporte`.
- Novo endpoint anonimo no `SupportController`.
- Nova funcao `createContatoPublico` no cliente API web.
- Nova tela publica renderizada quando `window.location.pathname` for `/suporte`.
- Reaproveitamento do servico de email transacional existente.

## Riscos

- Endpoint publico pode receber spam; mitigar com rate limit inicial.
- Se a landing atual estiver em outro projeto, ainda sera necessario adicionar o link para a tela `/suporte`.
- Se o provedor transacional real nao estiver configurado no beta, o envio pode ficar restrito ao provider fake/local.

## Duvidas

- No futuro, decidir se leads publicos devem ser persistidos em uma tabela propria.
- No futuro, decidir se o formulario deve usar captcha apos haver trafego real.
