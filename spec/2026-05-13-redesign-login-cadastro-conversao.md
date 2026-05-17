# Spec - Redesign Login Cadastro Conversão

## Visao geral

Refinar a tela pública de autenticação do Emprely Orçamentos para transmitir segurança, clareza e velocidade, mantendo as integrações atuais de cadastro e login.

## Escopo

Inclui:

- Layout desktop em duas colunas.
- Login como estado inicial/default.
- Abas na ordem "Entrar" | "Testar 7 dias".
- Coluna esquerda com favicon grande em card glassmorphism, proposta de valor e preview de orçamento.
- Coluna direita com login/teste de 7 dias, alternância clara e copy revisado.
- Labels claros, textos auxiliares, senha com mostrar/ocultar, loading, erro e foco visível.
- Cadastro sem scroll em desktop, cabendo em `100dvh`.
- Responsividade mobile com formulario priorizado.

Fora do escopo:

- Alterar API de autenticacao.
- Criar endpoint de recuperacao de senha.
- Alterar dashboard autenticado.
- Mover landing para `apps/landing`.

## Fluxo ponta a ponta

1. Visitante abre o app web sem sessao.
2. Tela pública exibe painel de marca e formulário de login por padrão.
3. Visitante preenche e-mail e senha, usa "Entrar na conta" e `loginMutation`.
4. Visitante pode alternar para "Testar 7 dias", preencher nome completo, e-mail profissional, senha e nome da empresa.
5. O fluxo de teste usa `registerMutation` e, em sucesso, segue para a área autenticada.
6. Em erro de validação ou API, mensagem continua visível abaixo do campo/formulário.

## Requisitos

- Evitar textos proibidos: "Seu workspace comercial" como promessa principal, "Conta" como label, claims absolutos de seguranca ou superioridade.
- Usar "Entrar" em vez de "Login" na interface.
- O estado inicial deve ser `login`.
- A aba "Entrar" deve ficar à esquerda e ativa ao abrir a tela.
- A aba "Testar 7 dias" deve ficar à direita.
- O painel esquerdo deve exibir favicon grande entre 140px e 190px no desktop.
- Título do painel esquerdo: "Do orçamento à aprovação".
- Texto de apoio: "Crie propostas profissionais, organize clientes e acompanhe tudo em um só lugar."
- Preview visual deve exibir "Orçamento", "Cliente: Ana Martins", "Proposta: Reforma residencial", "Total: R$ 4.750,00" e "Aguardando aprovação".
- Chips pequenos: "Clientes organizados" e "Propostas bonitas".
- Login deve usar badge "Conexão segura", título "Bem-vindo de volta" e subtítulo "Acesse seus clientes, orçamentos e propostas."
- O fluxo de teste deve usar badge "Teste grátis por 7 dias", título "Teste o Emprely antes de escolher seu plano" e subtítulo "Crie orçamentos profissionais, organize clientes e veja como o Emprely funciona no seu dia a dia."
- Campo senha deve permitir mostrar/ocultar caracteres sem quebrar acessibilidade.
- Botão do fluxo de teste deve ser "Iniciar teste de 7 dias".
- Texto de transparência comercial e texto legal devem aparecer abaixo do botão do teste.
- Login deve exibir "Esqueci minha senha".
- Inputs devem ter foco claro, erro visual e mensagens humanas: "Digite um e-mail válido.", "A senha precisa ter pelo menos 8 caracteres.", "Este campo é obrigatório.", "Não encontramos uma conta com esses dados."

## Regras de negocio

- Nome da empresa continua mapeado para `nomeConta`.
- Senha de cadastro exige mínimo de 8 caracteres.
- Recuperacao de senha nao faz chamada de API nesta entrega.

## Impactos por projeto

- API: nenhum.
- Web: `apps/web/src/App.tsx`, `apps/web/src/styles.css`, `apps/web/index.html`, testes E2E afetados.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- Desktop mostra painel de marca e formulário lado a lado, sem sobreposição e sem scroll no cadastro.
- Mobile empilha/reduz branding e prioriza o formulario.
- Fluxo de teste usa labels "Nome completo", "E-mail profissional", "Senha" e "Nome da empresa".
- Login usa labels "E-mail" e "Senha".
- A alternância mostra "Entrar" à esquerda e "Testar 7 dias" à direita.
- Login abre ativo por padrão.
- O formulario continua usando as mutations existentes.
- Todos os textos da autenticação usam acentuação correta.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` passam.

## Estrategia de implementacao

- Atualizar o componente `AuthContent` com o novo copy e os blocos visuais.
- Criar um campo de senha reutilizavel para a tela publica.
- Ajustar CSS existente de autenticacao sem alterar o restante do app.
- Atualizar E2E para os novos labels do cadastro.

## Testes

- Lint web.
- Build web.
- E2E web quando viavel.
- QA visual desktop e mobile via navegador local.

## Atualização - teste de 7 dias

Requisitos adicionais:

- Abas: "Entrar" à esquerda e "Testar 7 dias" à direita.
- Login deve manter badge "Conexão segura", título "Bem-vindo de volta", subtítulo "Acesse seus orçamentos, clientes e propostas.", CTA "Entrar na conta" e texto inferior "Novo no Emprely? Teste por 7 dias".
- Fluxo de teste deve usar badge "Teste grátis por 7 dias", título "Teste o Emprely antes de escolher seu plano", subtítulo "Crie orçamentos profissionais, organize clientes e veja como o Emprely funciona no seu dia a dia.", CTA "Iniciar teste de 7 dias" e texto inferior "Já usa o Emprely? Entrar".
- Abaixo do CTA de teste deve ficar claro que o Emprely é pago após o período gratuito: "Teste por 7 dias. Depois, escolha um plano para continuar."
- O texto legal do teste deve ser "Ao iniciar o teste, você concorda com os Termos de uso e a Política de privacidade."
- Não exibir "Criar conta" como CTA principal nem "Cadastro" como nome principal da aba.

## Atualização - remover logo redundante

- O painel esquerdo não deve exibir o wordmark pequeno no topo.
- O favicon grande em card glassmorphism deve ser o único símbolo de marca no painel.
- A assinatura textual "Emprely Orçamentos" deve aparecer abaixo do favicon grande.

## Atualização - copy de praticidade e credibilidade

Requisitos adicionais:

- O título do painel esquerdo deve ser curto e focar em rapidez: "Orçamentos em 2 minutos".
- O subtítulo deve conectar praticidade, profissionalismo e credibilidade, sem ocupar muitas linhas: "Troque mensagens soltas no WhatsApp por propostas profissionais, claras e com mais credibilidade."
- A copy deve reforçar que o usuário deixa de enviar mensagens soltas e passa a apresentar orçamentos com aparência mais profissional.
