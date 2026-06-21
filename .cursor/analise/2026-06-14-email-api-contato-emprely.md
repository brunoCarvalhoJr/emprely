# Analise - Email da API usando contato@emprely.com.br

## Contexto

O email profissional configurado no Zoho Mail para a Emprely e `contato@emprely.com.br`. A API, porem, ainda tinha configuracoes padrao e exemplos usando outro endereco como remetente e destino de suporte.

Isso cria divisao operacional: usuarios e leads veriam uma caixa diferente da caixa realmente criada no Zoho.

## Objetivo

Alinhar a API, docs e rastreadores para usar `contato@emprely.com.br` como email oficial inicial do produto.

## Projetos impactados

- API: defaults de email transacional e appsettings.
- Web: sem impacto direto.
- Mobile: sem impacto.
- Landing: sem impacto direto.
- Packages: sem impacto.
- Infra: no beta, SES/Zoho transacional deve validar `contato@emprely.com.br`.

## Fluxo atual

- Zoho Mail: usuario criado `contato@emprely.com.br`.
- API: `EmailTransacional:FromEmail` e `EmailTransacional:SuporteDestinoEmail` apontavam para um endereco separado de suporte.
- Specs antigas citavam remetente de suporte separado.

## Fluxo proposto

1. API passa a usar `contato@emprely.com.br` como remetente padrao.
2. API passa a enviar mensagens de suporte/contato para `contato@emprely.com.br`.
3. Docs de deploy orientam configurar `EmailTransacional__FromEmail=contato@emprely.com.br`.
4. A decisao fica registrada: nao criar `suporte@` agora; usar `contato@` como caixa unica inicial.

## Regras de negocio

- `contato@emprely.com.br` e a caixa oficial inicial para contato, suporte simples, duvidas e comunicacoes do beta.
- Um endereco separado de suporte nao sera necessario agora.
- Se o volume crescer, pode ser criado alias ou caixa de suporte no Zoho posteriormente.
- Se o provedor transacional for SES, o remetente validado tambem deve ser `contato@emprely.com.br`.

## Impactos tecnicos

- Manter a propriedade `SuporteDestinoEmail` para evitar renomear contratos internos nesta tarefa.
- Ajustar valores de configuracao e documentacao.
- Nenhum secret deve ser adicionado.

## Riscos

- SES pode exigir verificacao de identidade/remetente antes de enviar como `contato@emprely.com.br`.
- Se o Zoho ainda nao estiver com MX/SPF/DKIM/DMARC validados, recebimento e entregabilidade podem falhar ate a conclusao do DNS.

## Duvidas

- Nenhuma duvida bloqueante para trocar o valor para `contato@emprely.com.br`.
