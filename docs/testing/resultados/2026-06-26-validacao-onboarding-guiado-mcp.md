# Validacao item 1 - onboarding guiado com MCP

Data/hora: 2026-06-26 22:31 -03:00

Ambiente: `https://app.emprely.com.br`

Ferramenta: MCP `chrome-devtools`

Usuario: usuario comum de teste `teste.codex.20260620@emprely.com.br` (senha nao registrada neste relatorio)

## Objetivo

Validar o onboarding guiado no app real com usuario de teste autenticado, conforme item 1 da ordem pratica.

## Estado inicial observado

- Login do usuario comum de teste passou com sucesso.
- Chamadas principais autenticadas retornaram 200:
  - `POST https://api.emprely.com.br/api/auth/login`
  - `GET https://api.emprely.com.br/api/me`
  - `GET https://api.emprely.com.br/api/account/profile`
  - `GET https://api.emprely.com.br/api/onboarding`
- A modal `Conheca a Emprely antes de comecar` abriu automaticamente apos login/reload.
- Estado de onboarding retornado pela API:
  - `configuracaoConta.status`: `NaoIniciado`
  - `primeiraProposta.status`: `Concluido`
  - `tour.status` antes da conclusao final: `EmAndamento`
  - `deveAbrirAutomaticamente`: `true`

Limitacao da validacao: a conta de teste nao estava limpa como uma conta nova. Ela ja tinha clientes, servicos e propostas, e a primeira proposta ja estava concluida por dados. Mesmo assim, a jornada de configuracao da conta estava pendente e disparou o guia inicial.

## Resultado

Validacao parcialmente aprovada, com falhas de fluxo no tour guiado.

## O que funcionou

- Login no app real funcionou.
- Modal do guia inicial abriu automaticamente.
- Modal mostrou status coerente com o estado da conta: conta pendente e proposta concluida.
- Botao `Ver tour guiado` iniciou o Joyride.
- Passos 7 a 11 do tour foram exibidos:
  - `Primeiro passo: configurar a conta`
  - `Marca no documento`
  - `Templates prontos`
  - `Cores e formato de envio`
  - `Criar o primeiro orcamento`
- Botao `Concluir` removeu o overlay do Joyride.
- Backend marcou `tour.status` como `Concluido`.
- Console nao mostrou erros JavaScript; apenas issues de campos de formulario sem `id` ou `name`.

## Falhas encontradas

### 1. Tour guiado inicia no passo 7/11

Ao clicar em `Ver tour guiado`, o tour abriu diretamente em `Primeiro passo: configurar a conta`, com botao `Proximo (7 de 11)`, na tela `Perfil da conta`.

Esperado pelo spec `apps/web/spec/2026-06-21-correcoes-tour-guia-inicial.md`: o tour deveria iniciar pelo mapa dos menus no Dashboard, com `Dashboard`, `Clientes`, `Servicos/Pacotes`, `Propostas`, `Suporte` e `Conta/Personalizacao` antes dos passos operacionais.

Impacto: usuario perde os passos introdutorios de navegacao e contexto.

### 2. Botao `Voltar` no passo 7 fecha o tour

No passo `Primeiro passo: configurar a conta (7 de 11)`, clicar em `Voltar` retornou ao Dashboard e removeu o overlay do Joyride, sem exibir o passo anterior.

Esperado: voltar para o passo anterior do tour, provavelmente `Perfil da conta`/menu da conta, mantendo o Joyride ativo.

Impacto: navegacao regressiva do tour fica quebrada no limite entre tela de configuracao e passos de menu.

### 3. Ao concluir o tour, a modal do guia inicial reabre

Apos clicar em `Concluir` no passo 11, o Joyride fechou e a API retornou `tour.status = Concluido`, mas a modal `Conheca a Emprely antes de comecar` reabriu automaticamente porque `configuracaoConta.status` continuava `NaoIniciado` e `deveAbrirAutomaticamente` continuava `true`.

Impacto: a tela nao volta completamente ao estado normal apos concluir o tour; o usuario cai novamente na modal.

## Evidencias

- `.artifacts/onboarding-item1-01-modal.png`
- `.artifacts/onboarding-item1-02-tour-started-step7.png`
- `.artifacts/onboarding-item1-03-tour-template-step9.png`
- `.artifacts/onboarding-item1-04-tour-format-step10.png`
- `.artifacts/onboarding-item1-05-tour-final-step11.png`
- `.artifacts/onboarding-item1-06-after-concluir.png`

## Recomendacao

Corrigir antes de considerar o item 1 aceito:

1. Garantir que `Ver tour guiado` sempre inicie no passo 1 quando acionado pela modal.
2. Tratar `Voltar` entre passos que mudam de view sem encerrar o Joyride.
3. Apos `TourConcluiu`, evitar reabrir a modal na mesma sessao, mesmo que a configuracao da conta ainda esteja pendente.
4. Revalidar com uma conta realmente nova ou resetada para cobrir o estado puro de primeiro acesso.
