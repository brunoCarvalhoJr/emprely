# Spec - E-mails transacionais HTML com retenção

## Visão geral

Melhorar todos os e-mails transacionais atuais do Emprely para que a primeira experiência do usuário seja profissional, clara e coerente com a marca. O template deve usar português brasileiro revisado, botão de ação, fallback de link e logomarca real do projeto.

## Escopo

Inclui:

- confirmação de e-mail;
- recuperação de senha;
- boas-vindas após confirmação;
- início de teste de 7 dias;
- confirmação de troca de e-mail;
- aviso de e-mail de acesso alterado;
- reenvio administrativo de confirmação;
- formulário público de contato/interesse;
- solicitação autenticada de suporte;
- tipos futuros já previstos no domínio para trial próximo do fim e trial expirado.

Fora do escopo:

- editor visual de templates;
- tracking de abertura/clique;
- automação de compra/assinatura, porque ainda não há fluxo de pagamento implementado;
- anexos;
- migração do Zoho para envio transacional.

## Provedor e remetente

- Provedor transacional público: Amazon SES em `us-east-1`.
- Domínio verificado: `emprely.com.br`.
- Remetente oficial: `contato@emprely.com.br`.
- Caixa de entrada profissional: Zoho Mail em `contato@emprely.com.br`.
- SES deve ser usado para e-mails automáticos do SaaS.
- Zoho deve continuar sendo usado para leitura/resposta manual.

## Fluxo ponta a ponta

1. Usuário aciona cadastro, confirmação, recuperação de senha, troca de e-mail ou suporte.
2. API monta a URL pública usando `App__PublicWebUrl`.
3. API chama `EmailTransacionalTemplateBuilder`.
4. Builder escolhe copy, CTA, preheader, nota de segurança e fallback conforme `TipoEmailTransacional`.
5. API persiste o registro em `EmailsTransacionais`.
6. Provedor real envia o HTML e o texto alternativo.
7. Usuário recebe e-mail com botão e fallback de URL.

## Requisitos funcionais

- Todo e-mail transacional atual deve usar o mesmo builder central.
- O HTML deve conter botão de ação quando houver URL.
- O fallback da URL deve existir abaixo do botão.
- O texto alternativo deve conter título, instrução, CTA textual e URL.
- Textos visíveis devem estar em português brasileiro com acentuação correta.
- O template deve usar a marca real do Emprely por imagem otimizada pública.
- E-mails internos de suporte não devem exibir bloco comercial de benefícios.

## Requisitos técnicos

- Classe central: `EmailTransacionalTemplateBuilder`.
- Namespace: `Emprely.Api.Comunicacoes`.
- Asset de logo: `/brand/emprely-logo-dark.png` servido pelo webapp público.
- CSS inline e estrutura baseada em tabelas para compatibilidade com clientes de e-mail.
- Nenhum secret deve ser gravado no repositório.
- Controllers não devem montar HTML transacional próprio.

## Critérios de aceite

- `AuthController`, `MeController`, `AdminEmailsController` e `SupportController` usam o builder central.
- Não há strings visíveis com erros como `voce`, `nao`, `confirmacao`, `servico`, `seguranca`.
- Confirmação de e-mail tem título, texto, botão e fallback.
- Recuperação de senha tem título, texto, botão, fallback e nota de segurança.
- Suporte público/autenticado envia conteúdo em template legível para `contato@emprely.com.br`.
- `dotnet build apps/api/src/Emprely.Api/Emprely.Api.csproj` passa.

## Validação

Executado em 2026-06-17:

```powershell
dotnet build apps/api/src/Emprely.Api/Emprely.Api.csproj
```

Resultado:

- build com êxito;
- 0 avisos;
- 0 erros.

## Próximos testes operacionais

- Fazer deploy da API no Lightsail.
- Cadastrar usuário novo e validar confirmação em Gmail e Hotmail.
- Solicitar recuperação de senha e validar e-mail em Gmail e Hotmail.
- Testar solicitação pública de suporte em `/suporte`.
- Validar que a logo carrega em clientes que permitem imagens externas.
