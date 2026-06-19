# Análise - E-mails transacionais HTML com retenção

## Contexto

O envio real de e-mails pelo Amazon SES foi configurado para o domínio `emprely.com.br` em `us-east-1`, com remetente oficial `contato@emprely.com.br`. O domínio já está verificado no SES, o acesso à produção foi concedido, o envio para Gmail foi validado e o Hotmail/Outlook passou a receber a confirmação.

Depois do primeiro teste no Hotmail, o e-mail de confirmação ainda ficou visualmente fraco: texto sem acentuação, URL longa exposta, botão pouco contextualizado e logomarca divergente da identidade real do Emprely.

## Objetivo

Padronizar todos os e-mails transacionais atuais do SaaS com um template mais profissional, leve e compatível com Gmail, Hotmail e Outlook, usando copy em português brasileiro revisada e a marca real do projeto.

## Escopo impactado

- API: centralização da montagem de HTML/texto alternativo em `EmailTransacionalTemplateBuilder`.
- Auth: confirmação de e-mail, recuperação de senha, boas-vindas, início de teste e aviso de e-mail alterado.
- Conta do usuário: confirmação de troca de e-mail.
- Admin: reenvio administrativo de confirmação.
- Suporte: formulário público/interesse e solicitação autenticada de suporte.
- Web: sem alteração funcional nesta rodada; o template usa a URL pública configurada em `App__PublicWebUrl`.

## Estado antes da alteração

- Alguns e-mails ainda eram montados manualmente dentro dos controllers.
- Havia textos sem acentuação, como `voce`, `servico`, `confirmacao`, `seguranca`.
- O HTML antigo usava uma marca simplificada com a letra `E`, diferente da logomarca real do Emprely.
- O link de confirmação aparecia como URL longa no corpo do e-mail, prejudicando a primeira experiência do usuário.

## Decisão técnica

Criar um builder central em `Emprely.Api.Comunicacoes` para gerar:

- HTML com layout único, CSS inline e estrutura compatível com clientes de e-mail;
- texto alternativo legível para clientes sem HTML;
- botão de ação com fallback da URL;
- preheader;
- nota de segurança;
- bloco curto de valor do produto;
- logomarca real carregada de `https://app.emprely.com.br/brand/emprely-logo-dark.png`.

## Regras de negócio

- Confirmação de e-mail continua valendo por 24 horas.
- Recuperação de senha continua valendo por 1 hora.
- O usuário deve conseguir ignorar e-mails de ações que não solicitou.
- O e-mail de confirmação deve reforçar o valor do produto sem parecer campanha agressiva de marketing.
- O remetente oficial inicial permanece `contato@emprely.com.br`.
- Zoho continua como caixa de entrada profissional; SES fica como provedor transacional para o SaaS.

## Riscos e mitigação

- Alguns clientes de e-mail bloqueiam imagens externas por padrão.
  - Mitigação: o e-mail continua legível sem a logo e mantém texto/CTA/fallback.
- Hotmail/Outlook podem alterar estilos.
  - Mitigação: HTML com tabelas simples e CSS inline.
- Se `App__PublicWebUrl` estiver errado, botões e logo podem apontar para URL incorreta.
  - Mitigação: manter `App__PublicWebUrl=https://app.emprely.com.br` no ambiente público.

## Validação executada

- `dotnet build apps/api/src/Emprely.Api/Emprely.Api.csproj` passou em 2026-06-17 sem avisos e sem erros.

## Pendente

- Fazer deploy da API no Lightsail com a nova imagem.
- Reenviar e-mail de confirmação para Gmail e Hotmail após o deploy.
- Testar também recuperação de senha e troca de e-mail.
- Quando houver checkout/Plano Fundador automatizado, criar o tipo/template de confirmação de compra ou assinatura usando o mesmo builder.
