# Spec - Formulario publico de suporte e interesse

## Visao geral

Adicionar uma tela publica separada para visitantes entrarem em contato com a Emprely, tirarem duvidas de compra ou demonstrarem interesse no Plano Fundador, usando o email oficial `contato@emprely.com.br`.

## Escopo

Inclui:

- Criar contrato de contato publico na API.
- Criar endpoint anonimo `POST /api/support/public`.
- Enviar a mensagem para `EmailTransacional:SuporteDestinoEmail`.
- Proteger o endpoint publico com rate limit.
- Criar tela publica web em `/suporte`.
- Manter a tela autenticada de suporte sem mudanca funcional.
- Atualizar documentacao local, Notion e Obsidian.

Fora do escopo:

- Alterar a landing fora deste monorepo.
- Criar tabela de leads.
- Criar CRM, automacao comercial ou pipeline de vendas.
- Criar captcha.
- Configurar provedor real de email transacional em producao.

## Fluxo ponta a ponta

1. Visitante acessa `/suporte`.
2. Visitante informa nome, email, telefone opcional, empresa opcional, interesse e mensagem.
3. Web valida campos obrigatorios e formato do email.
4. Web envia `POST /api/support/public` sem token.
5. API valida o payload e aplica limite por IP/host.
6. API envia email para `EmailTransacional:SuporteDestinoEmail`.
7. Web mostra confirmacao de recebimento.

## Requisitos

- R01: O endpoint publico deve aceitar requisicoes anonimas.
- R02: O endpoint publico deve exigir nome, email, interesse e mensagem.
- R03: Telefone e empresa devem ser opcionais.
- R04: O destino do email deve ser `EmailTransacional:SuporteDestinoEmail`.
- R05: O endpoint publico nao deve criar conta, usuario, cliente ou proposta.
- R06: O endpoint publico deve usar rate limit especifico ou equivalente.
- R07: A tela publica deve ser acessivel por `/suporte`.
- R08: A tela publica deve funcionar sem sessao autenticada.
- R09: A tela autenticada `Suporte` deve continuar usando `POST /api/support`.

## Regras de negocio

- A caixa oficial inicial e `contato@emprely.com.br`.
- Mensagens publicas representam lead, duvida de compra, suporte pre-venda ou interesse no Plano Fundador.
- O retorno ao visitante deve ser generico e nao prometer prazo de resposta especifico.

## Impactos por projeto

- API: contrato, endpoint anonimo, rate limit e teste de integracao.
- Web: tipos, chamada API, schema e tela publica.
- Mobile: sem impacto.
- Landing: depois do deploy, apontar CTA de contato para `/suporte`.
- Packages: sem impacto.
- Infra: CORS e CloudFront/S3 devem permitir a rota SPA `/suporte`.

## Criterios de aceite

- CA01: Visitante sem login consegue abrir `/suporte`.
- CA02: Formulario valido envia mensagem para `POST /api/support/public`.
- CA03: API responde sucesso sem exigir JWT.
- CA04: Email transacional de tipo `SuporteRecebido` e criado/enviado para `EmailTransacional:SuporteDestinoEmail`.
- CA05: Payload invalido retorna erro de validacao.
- CA06: Endpoint publico tem rate limit.
- CA07: Suporte autenticado continua funcionando.
- CA08: Notion e Obsidian registram a decisao e o ponto atual.

## Estrategia de implementacao

1. Criar contratos `CreateContatoPublicoRequest` e `ContatoPublicoResponse`.
2. Adicionar policy de rate limit para contato publico.
3. Adicionar action anonima em `SupportController`.
4. Adicionar tipos e chamada no cliente web.
5. Adicionar schema, mutation e tela publica `/suporte` no `App.tsx`.
6. Atualizar docs/rastreadores.
7. Rodar build/testes relevantes.

## Testes

- `dotnet test apps/api/Emprely.sln --filter FullyQualifiedName~MvpFluxoApiTests`
- `pnpm --dir apps/web build`
- Smoke manual: abrir `/suporte`, preencher e enviar com API local.
