# Análise Web - Redesign Login Cadastro Conversão

## Contexto

Demanda para refinar a tela pública de login/cadastro do Emprely Orçamentos com foco em conversão, clareza da promessa, ausência de scroll no cadastro desktop e acabamento visual mais profissional.

## Objetivo da tela/fluxo

Fazer o visitante entender rapidamente que o Emprely cria orçamentos profissionais, organiza clientes e acompanha propostas, abrindo em login por padrão e mantendo cadastro simples, leve e confiável.

## Rotas impactadas

- Rota publica raiz do app web quando nao ha sessao.

## Componentes impactados

- `AuthContent`.
- Campo de senha especifico para autenticacao.
- Estilos `.auth-*` em `styles.css`.
- E2E do fluxo MVP para novos labels.
- `index.html` para título público acentuado.

## Formularios e validacao

- Campos do fluxo de teste: nome completo, email profissional, senha e nome da empresa.
- Campos de login: email e senha.
- Regras: email válido, senha do teste com mínimo de 8 caracteres, nome e empresa obrigatórios.
- Mensagens: "Digite um e-mail válido.", "A senha precisa ter pelo menos 8 caracteres.", "Este campo é obrigatório." e erro de login humano quando a API não encontrar a conta.

## Dados e chamadas de API

- Queries: nenhuma nova.
- Mutations: preservar `registerMutation` e `loginMutation`.
- Estados de loading/erro/vazio: loading no botao, erro abaixo do formulario, sucesso via entrada na area autenticada.

## Responsividade e acessibilidade

- Labels sempre visiveis.
- Botao de mostrar/ocultar senha com nome acessivel sem conflitar com label do input.
- Foco visivel em tabs, inputs, links e botoes.
- Desktop com card contido em `100dvh`, sem overflow vertical no cadastro.
- Mobile com branding reduzido e formulário rolável dentro do card quando necessário.
- Abas por teclado com "Entrar" à esquerda e "Testar 7 dias" à direita.

## Duvidas

- Produto pago com 7 dias de teste gratuito; usar "Iniciar teste de 7 dias".
- Reset de senha não identificado na API; "Esqueci minha senha" será link de suporte nesta entrega.

## Atualização - teste de 7 dias

- O produto deve ser apresentado como SaaS pago com 7 dias de teste gratuito.
- O fluxo público da direita não deve parecer conta gratuita permanente.
- Manter login como estado inicial.
- Substituir a aba direita por "Testar 7 dias".
- Substituir o CTA do fluxo de teste por "Iniciar teste de 7 dias".
- Exibir transparência comercial após o CTA: "Teste por 7 dias. Depois, escolha um plano para continuar."
- Não usar promessas não confirmadas como "Não precisa de cartão" ou "Sem compromisso".

## Atualização - remover logo redundante

- Remover o logo pequeno do topo do painel esquerdo para reduzir redundância visual.
- Manter o favicon grande como foco de marca.
- Manter o texto "Emprely Orçamentos" imediatamente abaixo do favicon grande.

## Atualização - copy de praticidade e credibilidade

- A chamada do painel esquerdo deve vender o ganho prático do produto com mais força.
- Novo título: "Orçamentos em 2 minutos".
- Novo subtítulo: "Troque mensagens soltas no WhatsApp por propostas profissionais, claras e com mais credibilidade."
