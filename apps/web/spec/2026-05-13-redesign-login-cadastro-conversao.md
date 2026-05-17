# Spec Web - Redesign Login Cadastro Conversão

## Visao geral

Refinar a tela pública de autenticação do app web para um SaaS premium, limpo e confiável, mantendo os fluxos atuais de cadastro e entrada.

## Rotas

- Publica raiz sem usuario autenticado.

## Estados da interface

- Carregando: botao principal mostra "Processando..." e sheen de loading.
- Vazio: formulário inicia em login com campos vazios.
- Erro: validações aparecem abaixo do campo e erro da API aparece abaixo do formulário.
- Sucesso: usuário entra na área autenticada após mutation bem-sucedida.

## Componentes

- `AuthContent`: layout, copy, tabs, formularios e painel de marca.
- `CampoSenhaAuth`: input de senha com mostrar/ocultar.
- `SubmitButton`, `MensagemErro`: preservados.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Nome completo | text | Sim | Minimo 2 caracteres |
| E-mail profissional | email | Sim | Email valido |
| Senha | password/text | Sim | Mínimo 8 caracteres no cadastro |
| Nome da empresa | text | Sim | Minimo 2 caracteres |
| E-mail | email | Sim | Email valido no login |
| Senha | password/text | Sim | Obrigatoria no login |

## Integracao com API

- Cadastro continua usando `registerUsuario`.
- Login continua usando `loginUsuario`.
- "Esqueci minha senha" nao chama API nesta entrega.

## Criterios de aceite

- Estado inicial da tela pública é login.
- Abas ficam na ordem "Entrar" | "Testar 7 dias".
- Coluna esquerda exibe favicon grande em card glassmorphism, chamada "Do orçamento à aprovação", texto de apoio e preview de orçamento.
- Preview contém "Orçamento", "Cliente: Ana Martins", "Proposta: Reforma residencial", "Total: R$ 4.750,00" e "Aguardando aprovação".
- Coluna direita exibe login ou teste de 7 dias com copy definido na demanda.
- Login usa badge "Conexão segura", título "Bem-vindo de volta", subtítulo "Acesse seus orçamentos, clientes e propostas.", link "Esqueci minha senha" e CTA "Entrar na conta".
- Teste usa badge "Teste grátis por 7 dias", título "Teste o Emprely antes de escolher seu plano", subtítulo "Crie orçamentos profissionais, organize clientes e veja como o Emprely funciona no seu dia a dia.", auxiliares "Mínimo de 8 caracteres." e "Você poderá alterar depois.", CTA "Iniciar teste de 7 dias", transparência sobre plano após 7 dias e texto legal com "Política de privacidade".
- Label "Conta" nao aparece no cadastro publico.
- Campo senha tem botao para mostrar/ocultar.
- Texto inferior alterna entre "Novo no Emprely? Teste por 7 dias" e "Já usa o Emprely? Entrar".
- Layout nao sobrepoe elementos em desktop ou mobile.
- Cadastro não gera scroll em desktop.
- Lint e build do web passam.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- E2E: `pnpm --dir apps/web test:e2e` se o ambiente permitir.
- Cenarios manuais: cadastro, entrada, alternancia de modo, senha visivel/oculta, foco por teclado, desktop e mobile.

## Atualização - teste de 7 dias

Critérios adicionais:

- Estado inicial segue em login.
- Abas: "Entrar" ativa à esquerda e "Testar 7 dias" à direita.
- Login: subtítulo "Acesse seus orçamentos, clientes e propostas." e texto inferior "Novo no Emprely? Teste por 7 dias".
- Teste gratuito: badge "Teste grátis por 7 dias", título "Teste o Emprely antes de escolher seu plano", subtítulo "Crie orçamentos profissionais, organize clientes e veja como o Emprely funciona no seu dia a dia.", CTA "Iniciar teste de 7 dias".
- Abaixo do CTA do teste: "Teste por 7 dias. Depois, escolha um plano para continuar."
- Texto legal: "Ao iniciar o teste, você concorda com os Termos de uso e a Política de privacidade."
- Não usar "Cadastro" como aba principal nem "Criar conta" como CTA principal.

## Atualização - remover logo redundante

Critérios adicionais:

- Remover o wordmark pequeno do topo do painel esquerdo.
- O painel esquerdo deve manter apenas o favicon grande em destaque.
- "Emprely Orçamentos" deve ficar abaixo do favicon grande e antes da chamada principal.

## Atualização - copy de praticidade e credibilidade

Critérios adicionais:

- Substituir a chamada "Do orçamento à aprovação" por "Orçamentos em 2 minutos".
- Substituir o texto de apoio por "Troque mensagens soltas no WhatsApp por propostas profissionais, claras e com mais credibilidade."
- A copy deve manter tom SaaS profissional, com foco em rapidez, praticidade e credibilidade percebida pelo cliente.
