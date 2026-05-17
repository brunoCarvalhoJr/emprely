# Análise - Redesign Login Cadastro Conversão

## Contexto

Demanda do usuário para refinar a tela pública de login/cadastro do Emprely Orçamentos, um SaaS de orçamentos, propostas comerciais, organização de clientes e acompanhamento comercial. A tela já possui layout em duas colunas, painel escuro à esquerda e formulário à direita, mas precisa de hierarquia mais clara, copy com acentuação correta, login como estado inicial e cadastro sem scroll em desktop.

## Objetivo

Aumentar a conversão e a confiança na autenticação, valorizando o favicon grande como elemento principal de marca, mantendo o login simples e rápido, e deixando o cadastro leve, profissional e contido em `100dvh`.

## Projetos impactados

- API: sem alteracao.
- Web: tela publica de autenticacao em `apps/web`.
- Mobile: sem alteracao.
- Landing: sem alteracao.
- Packages: sem alteracao.
- Infra: sem alteracao.

## Fluxo atual

A tela pública usa card dividido com painel visual escuro e formulário à direita. O estado inicial já deve abrir em login, mas a linguagem anterior ainda tratava o fluxo direito como criação de conta, sem explicar que o produto é pago com 7 dias de teste gratuito. O cadastro/teste pode criar overflow vertical em desktop por altura, padding e espaçamentos acumulados.

## Fluxo proposto

Manter um card desktop em duas colunas dentro de `100dvh`. A coluna esquerda deve ter fundo azul escuro com gradiente sutil, grid/círculos/brilho leves, favicon grande em card translúcido, título "Do orçamento à aprovação", texto de apoio e um mini card de orçamento com cliente, proposta, total e status. A coluna direita deve iniciar em login, com abas na ordem "Entrar" | "Testar 7 dias", labels sempre visíveis, senha com mostrar/ocultar, erros humanos e CTA claro.

No mobile, o formulário fica priorizado e o branding é reduzido para preservar usabilidade.

## Regras de negocio

- Fluxo de teste continua enviando nome, email, senha e nomeConta para a API atual.
- Login continua enviando email e senha para a API atual.
- CTA do fluxo de teste será "Iniciar teste de 7 dias".
- O link "Esqueci minha senha" nao deve criar fluxo de reset sem endpoint; sera uma acao de suporte.
- Estado inicial da tela pública sem sessão deve ser login.
- Textos públicos da autenticação devem usar acentuação correta: orçamento, orçamentos, aprovação, Conexão segura, Mínimo, Você, Política de privacidade, Já tem conta e Ainda não tem conta.

## Impactos tecnicos

- Ajustar `AuthContent` e estilos de autenticacao em `apps/web/src`.
- Preservar estados existentes de erro, loading e sucesso por autenticacao.
- Atualizar testes E2E que selecionam labels antigos da tela publica.
- Ajustar schema de validação pública para mensagens humanas pedidas na demanda.
- Ajustar dimensões do card, gaps e inputs para evitar overflow vertical no cadastro em desktop.

## Riscos

- Mudar labels pode quebrar testes automatizados ou seletores externos.
- Excesso de efeitos visuais pode reduzir legibilidade em mobile.
- O link de recuperacao de senha pode parecer fluxo completo se nao for tratado como suporte.
- `100dvh` em telas muito baixas pode exigir compactação adicional de tipografia e gaps.

## Duvidas

- Existe plano gratuito para usar "Criar conta grátis"? Assumido que não.
- Haverá endpoint de recuperação de senha no MVP? Assumido que não nesta entrega.

## Atualização - teste de 7 dias

- O Emprely deve ser comunicado como produto pago com 7 dias de teste gratuito.
- A tela não deve sugerir conta gratuita permanente.
- O estado inicial permanece login.
- A aba direita deixa de ser "Criar conta" e passa a ser "Testar 7 dias".
- O CTA do fluxo de teste deve ser "Iniciar teste de 7 dias".
- Como a demanda informa escolha de plano após o período gratuito, a tela deve usar texto transparente sem prometer ausência de cartão: "Teste por 7 dias. Depois, escolha um plano para continuar."
- Frases como "Cadastro gratuito", "Criar conta grátis", "Grátis para sempre", "Não precisa de cartão" e "Sem compromisso" ficam fora do escopo.

## Atualização - remover logo redundante

- Remover o lockup/wordmark pequeno do topo esquerdo do painel escuro.
- Manter apenas o favicon grande como marca principal.
- Exibir "Emprely Orçamentos" abaixo do favicon grande, antes do título "Do orçamento à aprovação".

## Atualização - copy de praticidade e credibilidade

- Trocar a chamada genérica do painel esquerdo por uma promessa mais direta sobre praticidade, rapidez e profissionalismo.
- Novo título curto: "Orçamentos em 2 minutos".
- Novo subtítulo curto: "Troque mensagens soltas no WhatsApp por propostas profissionais, claras e com mais credibilidade."
