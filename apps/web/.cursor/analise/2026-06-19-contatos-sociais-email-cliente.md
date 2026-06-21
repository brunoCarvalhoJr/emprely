# Analise Web - Contatos sociais e e-mail do cliente

## Contexto

Na etapa de cliente da nova proposta, os campos Instagram, Facebook e TikTok possuem botoes de abertura de link com icone generico. O usuario quer que cada botao use o icone visual da rede correspondente e que o campo de e-mail tenha uma acao equivalente para abrir o cliente de e-mail padrao do dispositivo.

## Objetivo da tela/fluxo

Melhorar a area de informacoes complementares do cliente para contato rapido:

- abrir Instagram, Facebook e TikTok com botoes identificaveis por rede;
- abrir `mailto:` a partir do e-mail informado;
- preencher destinatario, assunto e corpo base;
- incluir assinatura com nome da empresa e referencia da logo quando houver.

## Rotas impactadas

- App web autenticado, fluxo de clientes e nova proposta.

## Componentes impactados

- `ClienteFormularioCampos`
- `LinkSocialClienteButton`
- novo botao de e-mail do cliente
- helpers de URL de redes sociais e e-mail

## Formulários e validação

- Campos: Instagram, Facebook, TikTok e E-mail do cliente.
- Regras: manter validacoes existentes de texto/e-mail; botao fica desabilitado sem valor valido.
- Mensagens: tooltips informam abrir rede/e-mail ou dado nao informado.

## Dados e chamadas de API

- Sem nova query ou mutation.
- Usa dados ja carregados do perfil da conta para nome comercial e logo.

## Responsividade e acessibilidade

- Botoes mantem tamanho estavel de 44px e aria-label descritivo.
- Em mobile continuam abaixo/ao lado dos campos conforme grid existente.
- Icones sao decorativos e o nome da acao fica no tooltip/aria-label.

## Dúvidas

- `mailto:` nao permite anexar ou embutir imagem de logo de forma confiavel; a assinatura usara texto e URL da logo quando disponivel.
