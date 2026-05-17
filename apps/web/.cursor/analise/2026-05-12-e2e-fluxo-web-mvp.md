# Analise Web - E2E leve do fluxo MVP

## Contexto

O MVP ja possui testes unitarios e integracao da API. Falta uma validacao automatizada do fluxo principal no web para reduzir regressao em cadastro, navegacao e acoes comerciais, sem depender de print, imagem ou ajuste visual.

## Objetivo

Adicionar testes E2E leves para o web usando API mockada no navegador.

## Escopo

- Testar renderizacao inicial do app.
- Simular cadastro/login com resposta mockada.
- Navegar por dashboard, clientes, servicos e propostas.
- Criar cliente, servico e proposta via UI com respostas mockadas.
- Validar acao de gerar proposta e exibir acoes comerciais basicas.

## Fora do escopo

- Testar PDF, print ou screenshot.
- Validar layout visual.
- Subir backend real.
- Usar PostgreSQL real.
- Testar WhatsApp real.

## Decisao

Usar Playwright com `webServer` do Vite e interceptar chamadas `http://localhost:5262/api/*`. Assim o teste cobre a experiencia web sem acoplar ao estado do banco local.

## Riscos

- Necessidade de instalar browser do Playwright no ambiente.
- Teste ficar sensivel a textos de botao; manter seletores por papel/label sempre que possivel.
