# Analise - Refatoracao Login Prototipo Emprely

## Contexto

O login/cadastro publico precisa seguir o print anexado pelo usuario: card horizontal no desktop, painel de marca em degradê azul à esquerda, formulario branco à direita e uma divisoria organica entre os blocos. No mobile, o painel de marca fica acima do formulario em um card vertical.

## Objetivo

Refatorar apenas a tela publica de autenticacao, usando as cores da logo Emprely e mantendo os fluxos existentes de cadastro, login, mensagens de erro e sessao expirada.

## Decisoes

- Manter React/Vite e componentes de formulario existentes.
- Usar textos em portugues para o produto Emprely.
- Preservar labels e botoes usados pelos testes (`Criar conta`, `Entrar`, `Nome`, `Email`, `Senha`, `Conta`).
- Criar o efeito visual do print via CSS, sem imagens externas.
- Preservar o footer nao fixo dentro do fluxo da pagina.

## Riscos

- Excesso de efeito decorativo pode comprometer legibilidade.
- O layout precisa continuar usavel em mobile pequeno.
- A pagina nao deve quebrar os testes de cadastro/login.

## Perguntas

- Nao ha duvidas bloqueantes. A referencia visual foi fornecida e o comportamento funcional existente deve ser preservado.
