# Onboarding guiado do beta - Emprely

## Objetivo

Este documento resume a decisao de produto de inserir onboarding guiado antes do smoke MVP completo. A implementacao detalhada fica em:

- `.cursor/analise/2026-06-19-onboarding-guiado-beta.md`
- `spec/2026-06-19-onboarding-guiado-beta.md`

## Decisao

Antes de executar o smoke funcional completo do MVP em producao, o Emprely deve implementar um onboarding guiado para contas novas.

O onboarding sera dividido em duas jornadas:

1. Configurar conta e marca.
2. Gerar a primeira proposta.

Decisoes fechadas:

- Abrir automaticamente em tela cheia no primeiro login.
- Permitir pular todo o onboarding.
- Se pular, lembrar no proximo login.
- Persistir progresso por usuario individual no backend.
- Logomarca recomendada, mas pulavel.
- Sem logo, usar iniciais da marca em simbolo simples.
- Dados obrigatorios: nome da marca, WhatsApp, email e segmento.
- Sugerir cores a partir da logo e permitir edicao manual.
- Template padrao obrigatorio.
- Preferencia de arquivo escolhida entre PDF, imagem ou PDF + imagem.
- WhatsApp como canal obrigatorio padrao.
- Primeira proposta concluida quando a proposta for gerada.
- Cliente e servico podem ser criados ou selecionados.
- Wizard 2 salva progresso/rascunho ao sair no meio.
- Primeira proposta mostra campos minimos e opcionais recolhidos.
- Tour com React Joyride entra na primeira versao, aparece automaticamente uma vez e tem mobile simplificado.
- Registrar eventos de onboarding no backend.
- Implementar tudo em uma entrega unica, seguindo a ordem checklist, Wizard 1, Wizard 2, tour e deploy.

## Motivo

O Emprely ja esta publicado em beta e os proximos testes precisam validar nao apenas se o sistema funciona, mas se um usuario novo entende o fluxo sem explicacao externa.

Sem onboarding guiado, o beta assistido tende a depender de chamadas, mensagens e suporte manual para ensinar tarefas basicas. Com onboarding, o proprio produto conduz o usuario pelo ciclo minimo:

- configurar marca;
- escolher template;
- cadastrar cliente;
- cadastrar servico;
- montar proposta;
- gerar arquivo;
- enviar orcamento.

## Posicao na ordem do beta

Ordem recomendada atual:

1. Implementar onboarding guiado do beta em uma entrega unica.
2. Validar onboarding em producao com conta nova.
3. Executar smoke MVP completo.
4. Configurar alertas de custo AWS, se ainda pendente.
5. Vender Plano Fundador manualmente.
6. Abrir beta assistido com poucos usuarios.

## Escopo resumido

### Wizard 1 - Configurar conta e marca

- Boas-vindas.
- Dados da marca/profissional.
- Logomarca.
- Cores da marca.
- Template padrao.
- Preferencia de arquivo.
- Revisao e conclusao.

### Wizard 2 - Primeira proposta

- Introducao.
- Cliente.
- Servico/pacote.
- Orcamento.
- Template.
- Detalhamento opcional.
- Revisao.
- Geracao.
- Envio/compartilhamento.

### Checklist persistente

O dashboard deve mostrar progresso real do onboarding e permitir iniciar, continuar, pular e retomar.

### Tour contextual

Tours com overlay devem ser usados para explicar pontos especificos da interface ja na primeira versao. A decisao tecnica atual e usar React Joyride, por compatibilidade com React 19 e suporte a steps, progresso, skip e callbacks. No mobile, o tour deve ser simplificado.

## Nao fazer agora

- Nao transformar onboarding em bloqueio obrigatorio.
- Nao criar checkout recorrente junto com onboarding.
- Nao iniciar app mobile nativo.
- Nao refazer toda a UI do sistema.
- Nao criar modulos novos fora do ciclo de proposta.

## Criterio de sucesso

Uma conta nova deve conseguir sair do primeiro login com:

- marca configurada;
- iniciais da marca aplicadas se nao houver logo;
- template padrao escolhido;
- preferencias basicas definidas;
- primeira proposta criada;
- proposta gerada;
- orcamento enviado ou pronto para envio.

Depois desse teste, o smoke MVP completo deve ser executado com menos incerteza de usabilidade.
