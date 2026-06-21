# E2E web

Esta pasta contem os testes Playwright do webapp Emprely. O objetivo da suite e
smoke/regressao critica do MVP, nao cobrir todos os detalhes da UI.

## Comandos

```powershell
pnpm test:e2e:web
pnpm --dir apps/web test:e2e
```

O comando raiz usa `scripts/run-web-e2e.mjs`, que trata Windows/WSL/Linux e
encerra corretamente o servidor Vite iniciado pelo Playwright.

## Escopo atual

`mvp-fluxo.spec.ts` cobre:

- sessao expirada local;
- 401 em endpoint autenticado;
- fluxo principal do MVP com cliente, servico, proposta e geracao;
- configuracoes/perfil e tema;
- cadastro com confirmacao de email;
- recuperacao de senha.

## Padroes de escrita

- Prefira `getByRole`, `getByLabel` e texto visivel relevante.
- Use classes ou seletores tecnicos apenas quando nao houver alternativa
  acessivel estavel.
- Mocks de API devem representar contratos reais do backend.
- Um teste E2E deve validar uma jornada de usuario, nao implementacao interna.
- Use nomes em portugues do dominio quando o teste expressar comportamento do
  produto.
- Mantenha massa de teste local ao arquivo ou extraia helpers pequenos quando a
  repeticao ficar alta.

## Mocks de API

O E2E atual mocka `**/api/**` para manter o smoke rapido e deterministico. Ao
alterar contrato:

1. Ajuste o mock no E2E.
2. Ajuste ou crie teste de integracao na API.
3. Registre na spec qual contrato mudou.

Para pre-release, mantenha tambem um smoke manual ou futuro smoke automatizado
contra API real/staging.

## Responsividade

Mudancas em fluxo critico devem ser testadas em:

- desktop padrao do Playwright;
- viewport mobile estreito, no minimo 360px, em validacao manual ou futura suite;
- tablet quando a tela tiver sidebar, modal grande ou preview de proposta.

Antes de adicionar matriz mobile ao PR, medir duracao e estabilidade.

## Flakiness

Nao corrija falha intermitente apenas aumentando timeout. Verifique:

- locator fragil;
- dado compartilhado;
- animacao/transicao ainda em andamento;
- rota mockada incompleta;
- servidor reaproveitado de execucao anterior;
- texto alterado sem atualizacao de teste.

Use trace em falha como evidencia principal.

## Checklist antes de merge

- `pnpm test:e2e:web` verde quando fluxo web critico foi alterado.
- O teste falha quando a regra principal e quebrada.
- O mock continua coerente com contratos da API.
- Textos testados sao relevantes para o usuario.
- A spec da feature lista E2E criado, ajustado ou dispensado com justificativa.
