# Analise - Onboarding guiado do beta

## Contexto

O Emprely ja possui o fluxo principal publicado em beta: cadastro/login, perfil da conta, clientes, servicos, propostas, templates, exportacao e compartilhamento. Tambem ja existe um bloco de "Primeiros passos" no dashboard e um assistente de nova proposta.

A nova decisao de produto e adicionar um passo antes do smoke MVP completo: implementar uma experiencia guiada para ensinar o usuario novo a configurar a conta e criar a primeira proposta. O objetivo e reduzir abandono no primeiro acesso, diminuir necessidade de explicacao manual no beta assistido e transformar o proprio fluxo de teste em roteiro de ativacao.

Pesquisa web consultada em 2026-06-19:

- React Joyride docs: biblioteca React para tours com steps, progresso, botao de pular, callback e modo controlado.
- Reactour docs: alternativa React com mask, popover, foco e controle de steps.
- GOV.UK Design System - Task list: lista de tarefas ajuda usuarios a identificar o que esta pronto e o que falta em servicos longos ou retomaveis.
- WAI-ARIA APG - Dialog Modal Pattern: wizard/modal precisa prender foco, permitir fechamento previsivel e usar rotulos acessiveis.
- WAI-ARIA APG - Disclosure Pattern: secoes expansivas devem usar botao com `aria-expanded`.
- WCAG 2.2 Target Size: controles interativos precisam ter area de toque suficiente, especialmente no mobile.

## Objetivo

Criar um onboarding guiado em duas frentes:

1. Wizard de configuracao da conta e marca.
2. Wizard de primeira proposta.

O resultado esperado e que o usuario novo entenda e execute o ciclo minimo do Emprely sem depender de uma explicacao externa:

- configurar perfil da conta;
- subir logomarca;
- escolher template padrao;
- escolher cores da marca;
- escolher preferencia de arquivo;
- cadastrar ou selecionar cliente;
- cadastrar ou selecionar servico;
- montar, revisar, gerar e enviar a primeira proposta.

## Projetos impactados

- API: provavel necessidade de persistir progresso de onboarding e preferencia de arquivo da conta.
- Web: principal impacto; criacao das telas guiadas, checklist persistente, tour contextual e ajustes no dashboard/fluxo de proposta.
- Mobile: mesmo app web responsivo; os wizards devem ser mobile-first e respeitar a fundacao mobile ja implementada.
- Landing: sem impacto direto.
- Packages: sem impacto esperado.
- Infra: sem impacto funcional; apenas novo build/deploy web e possivel migration da API.

## Fluxo atual

Hoje a conta nova acessa o dashboard com primeiros passos e consegue navegar para:

- perfil/personalizacao da conta;
- clientes;
- servicos;
- propostas;
- assistente de nova proposta.

O bloco atual ajuda como checklist, mas ainda nao cobre toda a configuracao inicial desejada:

- nao orienta de forma dedicada a escolha de template padrao;
- nao trata preferencia de arquivo como passo de onboarding;
- nao explica o motivo de cada etapa para o usuario iniciante;
- nao persiste um estado completo de onboarding entre dispositivos;
- nao separa claramente "configurar conta" de "gerar primeira proposta".

O assistente de proposta ja reduz friccao ao comecar por cliente, mas o usuario ainda pode chegar ao editor sem entender o papel de cliente, servico, template, revisao, geracao e envio.

## Fluxo proposto

### Entrada do onboarding

1. Usuario cria conta ou faz primeiro login.
2. Sistema identifica que o onboarding da conta ainda nao foi concluido.
3. No primeiro login sem onboarding concluido, o sistema abre automaticamente o onboarding em tela cheia.
4. Dashboard tambem mostra um painel de ativacao com duas jornadas:
   - Configurar conta e marca.
   - Gerar primeira proposta.
5. Usuario pode continuar, pular tudo ou retomar depois.
6. Se pular, o sistema mostra lembrete no proximo login e mantem uma acao clara para retomar no dashboard.

### Wizard 1 - Configurar conta e marca

1. Boas-vindas curta explicando que os dados serao usados nas propostas.
2. Dados da marca/profissional:
   - nome da marca;
   - segmento;
   - telefone/WhatsApp;
   - email;
   - cidade/UF;
   - apresentacao curta opcional.
3. Logomarca:
   - upload;
   - validacao de tipo e tamanho;
   - preview.
   - etapa recomendada, mas pulavel.
4. Cores da marca:
   - sugestao automatica a partir da logo;
   - cor primaria e secundaria editaveis manualmente;
   - preview aplicado em mini-proposta.
5. Template padrao:
   - listar apenas templates ativos da curadoria atual;
   - mostrar nome, uso recomendado e preview.
6. Preferencia de arquivo:
   - PDF;
   - imagem;
   - PDF e imagem;
   - WhatsApp como canal obrigatorio padrao de envio.
7. Revisao:
   - mostrar resumo;
   - permitir editar etapa anterior;
   - concluir configuracao.

### Wizard 2 - Primeira proposta

1. Introducao curta:
   - explicar que proposta junta cliente, servico, valores, template e envio.
2. Cliente:
   - escolher cliente existente ou cadastrar cliente rapido.
   - explicar que cliente e o destinatario do orcamento.
3. Servico/pacote:
   - escolher servico existente ou cadastrar servico rapido.
   - explicar que servico e o item vendido.
4. Orcamento:
   - titulo;
   - validade;
   - itens;
   - quantidade;
   - valor;
   - desconto opcional.
5. Template:
   - usar template padrao da conta;
   - permitir troca;
   - explicar quando usar cada template.
6. Detalhamento opcional:
   - mensagem;
   - condicoes comerciais;
   - prazo;
   - observacoes.
7. Revisao:
   - preview da proposta;
   - checar cliente, valor total, template e dados da marca.
8. Geracao:
   - gerar proposta;
   - ao gerar a proposta, o onboarding de primeira proposta e considerado concluido.
9. Envio:
   - compartilhar no WhatsApp;
   - copiar texto/link;
   - marcar como enviada.
10. Conclusao:
   - onboarding de primeira proposta concluido;
   - usuario volta para dashboard ou lista de propostas.

### Tour contextual

O tour contextual nao deve substituir os wizards. Ele deve ser usado apenas para explicar elementos pontuais:

- painel de ativacao no dashboard;
- area de personalizacao;
- galeria de templates;
- preview da proposta;
- botoes de gerar/exportar/enviar.

Recomendacao tecnica: usar React Joyride para tour contextual, porque a versao atual declara compatibilidade com React 19 e oferece steps, progresso, skip, callback e modo controlado.

## Regras de negocio

- O wizard de configuracao da conta deve ser exibido para contas sem configuracao minima concluida.
- O progresso do onboarding e por usuario individual.
- O wizard de primeira proposta deve ser exibido enquanto o usuario nao tiver pelo menos uma proposta gerada.
- O usuario pode pular todo o onboarding, mas o sistema deve lembrar no proximo login e manter um caminho para retomar.
- Pular o onboarding nao pode bloquear uso do sistema.
- Concluir etapas reais deve atualizar o progresso automaticamente, mesmo se o usuario fizer a acao fora do wizard.
- A escolha de template padrao deve reaproveitar os templates ativos atuais.
- A escolha de template padrao e obrigatoria para concluir o Wizard 1.
- A logomarca e recomendada, mas pode ser pulada; sem logo, a proposta usa iniciais da marca em um simbolo simples.
- Propostas antigas devem manter compatibilidade com IDs de templates existentes.
- A preferencia de arquivo deve ser usada como padrao, nao como bloqueio.
- O canal de envio padrao do onboarding e WhatsApp.
- O onboarding deve respeitar trial/plano: se o trial estiver expirado, gerar/exportar/enviar segue bloqueado conforme regras comerciais atuais.
- O fluxo recorrente nao deve ser prejudicado para usuarios que ja concluiram o onboarding.

## Impactos tecnicos

### API

Possiveis dados novos:

- status do onboarding do usuario;
- etapa atual do onboarding de configuracao;
- etapa atual do onboarding de primeira proposta;
- timestamps de inicio, conclusao e pulo;
- preferencia de arquivo da proposta;
- eventos de analytics internos: iniciou, pulou, concluiu conta e concluiu primeira proposta.

Possiveis endpoints:

- `GET /api/onboarding`
- `PATCH /api/onboarding`
- ou reaproveitamento de `GET /api/me` e endpoints de conta, se o modelo ficar mais simples.

Decisao: a fonte principal de progresso deve ser o backend, com migration/campos novos se necessario. `localStorage` nao deve ser a fonte principal.

### Web

Componentes/areas provaveis:

- `OnboardingChecklistDashboard`;
- `OnboardingContaWizard`;
- `PrimeiraPropostaWizard`;
- `OnboardingTourProvider`;
- estados de progresso derivados dos dados reais;
- integracao com formularios existentes de perfil, logo, templates, clientes, servicos e propostas.

Dependencia provavel:

- `react-joyride` para tour contextual.

### Mobile

Requisitos de layout:

- uma tarefa principal por tela;
- botoes de avancar/voltar sempre acessiveis;
- safe-area no rodape;
- alvos de toque confortaveis;
- etapas longas com secoes opcionais recolhidas;
- evitar overlay complexo em telas pequenas quando um wizard full-screen resolver melhor.

### Dados e estado

O progresso deve combinar:

- estado persistido do onboarding no backend, por usuario;
- estado real da conta: logo existe, template padrao existe, cores existem, clientesTotal, servicosTotal, propostasTotal, propostaGerada/Enviada.

Isso evita inconsistencia quando o usuario executa uma acao fora do wizard.

## Riscos

- Criar um wizard obrigatorio demais e bloquear o usuario avancado.
- Duplicar formularios existentes e aumentar manutencao.
- Persistir tudo por usuario pode exigir migration e cuidado para nao misturar configuracao da conta com tutorial individual.
- Abrir automaticamente em tela cheia pode incomodar usuario recorrente se a regra de exibicao nao for precisa.
- Criar tours com seletores frageis que quebram quando o layout muda.
- Sobrepor popovers, drawer, bottom navigation e modais no mobile.
- Aumentar escopo da API no momento em que o objetivo e validar beta.
- Ensinar demais antes do usuario realizar a acao, gerando leitura longa e baixa conversao.

## Mitigacoes

- Wizard deve ser pulavel, retomavel e lembrado no proximo login quando pulado.
- Textos devem ser curtos, com explicacao no contexto da acao.
- Formularios existentes devem ser reaproveitados quando possivel.
- Tour contextual deve ter poucos steps e selectors estaveis via `data-tour`.
- Tour mobile deve ser simplificado.
- Progresso deve ser derivado dos dados reais sempre que possivel.
- Embora a entrega seja unica, a implementacao interna deve seguir a ordem checklist, Wizard 1, Wizard 2, tour e deploy.

## Decisoes respondidas

- O onboarding abre automaticamente em tela cheia no primeiro login.
- O usuario pode pular todo o onboarding.
- Se pular, o sistema lembra no proximo login.
- O progresso e por usuario individual.
- Logomarca e recomendada, mas pode ser pulada.
- Sem logo, usar iniciais da marca em simbolo simples.
- Dados obrigatorios do Wizard 1: nome da marca, WhatsApp, email e segmento.
- Cores devem ser sugeridas a partir da logo e editaveis pelo usuario.
- Preferencia de arquivo deve permitir escolher entre PDF, imagem ou PDF + imagem.
- WhatsApp e o canal obrigatorio padrao.
- Template padrao e obrigatorio para concluir o Wizard 1.
- Primeira proposta conclui o Wizard 2 quando a proposta e gerada.
- Cliente e servico podem ser criados ou selecionados.
- Usuario pode sair no meio do Wizard 2 com progresso/rascunho salvo.
- A primeira proposta mostra campos minimos e campos opcionais recolhidos.
- Tour com baloes/overlay entra ja na primeira versao.
- Tour aparece automaticamente uma vez.
- Tour mobile existe em versao simplificada.
- API pode receber migration/campos novos.
- Backend e a fonte principal do progresso.
- `react-joyride` pode ser instalado.
- Eventos/analytics de onboarding devem ser registrados agora no backend.
- Implementacao sera uma entrega unica, seguindo a ordem interna checklist, Wizard 1, Wizard 2, tour e deploy.

## Decisao recomendada

Implementar o onboarding guiado antes do smoke MVP completo, como Passo 10A da ordem do beta.

Ordem recomendada:

1. Criar persistencia de progresso/preferencias no backend, por usuario.
2. Evoluir o dashboard para checklist de ativacao retomavel.
3. Implementar Wizard 1 de configuracao de conta e marca.
4. Implementar Wizard 2 de primeira proposta reaproveitando o assistente atual.
5. Adicionar tour contextual com React Joyride, incluindo versao mobile simplificada.
6. Registrar eventos de onboarding no backend.
7. Publicar e validar com uma conta nova em producao.
8. So depois executar o smoke MVP completo, ja usando o fluxo guiado.
