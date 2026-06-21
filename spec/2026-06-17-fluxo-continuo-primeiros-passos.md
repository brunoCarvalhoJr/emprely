# Spec - Fluxo continuo de primeiros passos

## Visao geral

Transformar o checklist de primeiros passos em um fluxo guiado de ativacao. O objetivo e ensinar o usuario novo a executar o ciclo minimo do Emprely: perfil, cliente, servico e proposta.

## Escopo

Inclui:

- Redesenhar o bloco "Primeiros passos" do dashboard para destacar a proxima acao.
- Guiar automaticamente o usuario para o primeiro servico apos cadastrar o primeiro cliente.
- Guiar automaticamente o usuario para a primeira proposta apos cadastrar o primeiro servico.
- Manter o comportamento atual para edicoes e cadastros adicionais.

Fora do escopo:

- Alteracoes de API.
- Tours com overlay.
- Notificacoes por email ou WhatsApp.
- Mudancas no fluxo de pagamento.

## Fluxo ponta a ponta

1. Usuario acessa o dashboard com primeiros passos pendentes.
2. Usuario clica na acao primaria do proximo passo.
3. Ao concluir o primeiro cliente, o sistema abre o cadastro de primeiro servico.
4. Ao concluir o primeiro servico, o sistema abre o assistente de nova proposta.
5. Ao criar a primeira proposta, o dashboard deixa de mostrar o bloco de primeiros passos.

## Requisitos

- O proximo passo pendente deve ser visualmente mais forte que os demais.
- Passos concluidos devem permitir revisao sem competir com a acao principal.
- Passos futuros devem ficar visiveis para dar contexto do roteiro.
- A navegacao automatica deve usar os dados existentes no cliente web, sem nova regra no backend.

## Regras de negocio

- Primeiro cliente: `clientesTotal === 0` antes do salvamento e nao e edicao.
- Primeiro servico: `servicosTotal === 0` antes do salvamento e nao e edicao.
- Edicao de cliente ou servico sempre volta para listagem, como hoje.
- Cadastro adicional de cliente ou servico continua no modo novo, como hoje.

## Impactos por projeto

- API: sem impacto.
- Web: dashboard, clientes, servicos e assistente de proposta.
- Mobile: mesmo app web responsivo; fluxo deve caber em viewport pequena.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto funcional, apenas novo build/deploy web.

## Criterios de aceite

- Apos salvar o primeiro cliente, o usuario ve o formulario de novo servico.
- Apos salvar o primeiro servico, o usuario ve o assistente de nova proposta.
- O dashboard mostra "Fluxo guiado" com progresso e proxima acao clara.
- Mobile e desktop nao apresentam sobreposicao, texto cortado ou card excessivamente alto.
- `pnpm --dir apps/web lint` passa.
- Build beta web passa e gera assets validos.

## Estrategia de implementacao

- Ajustar `PrimeirosPassosDashboard` para expor progresso, barra visual e cards por estado.
- Adicionar estado derivado de passo atual no componente.
- Alterar `onSuccess` das mutacoes de cliente e servico com regra de primeira conclusao.
- Reutilizar funcoes de preparacao existentes para abrir novo servico e nova proposta.

## Testes

- Lint do app web.
- Build beta.
- Teste automatizado em viewport mobile cobrindo cliente -> servico -> proposta.
- Verificacao visual em desktop e mobile.

