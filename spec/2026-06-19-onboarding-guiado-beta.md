# Spec - Onboarding guiado do beta

## Visao geral

Adicionar onboarding guiado ao Emprely para conduzir usuarios novos pelo ciclo minimo de ativacao:

1. configurar conta e marca;
2. criar e enviar a primeira proposta.

A feature deve reduzir friccao no beta assistido, ensinar o funcionamento do produto dentro do proprio app e deixar o usuario pronto para testar o MVP completo sem orientacao manual constante.

## Escopo

Inclui:

- Abertura automatica do onboarding em tela cheia no primeiro login.
- Checklist persistente de ativacao no dashboard.
- Wizard 1: configuracao de conta e marca.
- Wizard 2: primeira proposta.
- Persistencia de progresso do onboarding no backend, por usuario.
- Preferencia padrao de arquivo da proposta.
- Tour contextual com React Joyride para explicar pontos especificos da interface.
- Estados de "iniciar", "continuar", "pular por agora", "retomar" e "concluir".
- Lembrete no proximo login quando o usuario pular o onboarding.
- Eventos de analytics internos no backend.
- UX responsiva para desktop e mobile.
- Documentacao do novo passo antes do smoke MVP completo.

Fora do escopo:

- Checkout/pagamento recorrente.
- CRM completo.
- Contratos, agenda ou novos modulos.
- Recriacao visual completa do app.
- Landing V2.
- App mobile nativo.
- Analytics externo complexo.
- IA para gerar propostas.
- Obrigatoriedade de concluir onboarding para usar o sistema.

## Fluxo ponta a ponta

### Fluxo de entrada

1. Usuario cria conta ou faz login.
2. Frontend carrega dados da sessao, conta, perfil, clientes, servicos, propostas e progresso de onboarding.
3. Sistema calcula o estado de ativacao.
4. Se o onboarding nao estiver concluido, o sistema abre automaticamente o onboarding em tela cheia no primeiro login.
5. O dashboard tambem exibe painel de ativacao.
6. Usuario escolhe:
   - iniciar configuracao da conta;
   - continuar de onde parou;
   - iniciar primeira proposta quando a configuracao minima existir;
   - pular todo o onboarding por agora.
7. Se pular, o sistema lembra no proximo login.
8. Usuario pode retomar o onboarding depois pelo dashboard ou menu de ajuda.

### Wizard 1 - Configuracao da conta e marca

1. Boas-vindas:
   - explicar que essas informacoes aparecem nas propostas.
2. Dados da marca:
   - nome da marca/profissional;
   - segmento;
   - telefone/WhatsApp;
   - email;
   - cidade/UF opcional;
   - apresentacao curta opcional.
3. Logomarca:
   - upload de PNG, JPG ou WebP;
   - limite atual de 2 MB;
   - preview apos upload;
   - etapa recomendada e pulavel;
   - sem logo, usar iniciais da marca em simbolo simples.
4. Cores:
   - sugestao automatica a partir da logo;
   - cor primaria editavel;
   - cor secundaria editavel;
   - preview em componente de proposta.
5. Template padrao:
   - listar templates ativos;
   - mostrar uso recomendado;
   - permitir preview;
   - salvar `templateVisualPadrao`.
6. Preferencia de arquivo:
   - usuario escolhe entre PDF, imagem ou PDF e imagem;
   - WhatsApp e o canal obrigatorio padrao de envio.
7. Revisao:
   - mostrar resumo dos dados configurados;
   - permitir voltar para editar;
   - concluir wizard.
8. Ao concluir:
   - marcar onboarding de conta como concluido;
   - sugerir iniciar primeira proposta.

### Wizard 2 - Primeira proposta

1. Introducao:
   - explicar que uma proposta combina cliente, servico, valores, template e envio.
2. Cliente:
   - selecionar cliente existente;
   - ou cadastrar cliente rapido;
   - explicar que cliente e quem recebera o orcamento.
3. Servico:
   - selecionar servico/pacote existente;
   - ou cadastrar servico rapido;
   - explicar que servico e o que esta sendo vendido.
4. Orcamento:
   - titulo;
   - validade;
   - itens;
   - quantidade;
   - valor;
   - desconto opcional.
5. Template:
   - carregar template padrao da conta;
   - permitir troca;
   - mostrar preview.
6. Detalhamento:
   - mensagem opcional;
   - condicoes comerciais opcionais;
   - prazo/observacoes opcionais.
7. Revisao:
   - preview da proposta;
   - conferir cliente, itens, total, dados da marca e template.
8. Geracao:
   - gerar proposta;
   - concluir Wizard 2 ao gerar a proposta;
   - disponibilizar PDF/imagem conforme preferencia da conta.
9. Envio:
   - compartilhar por WhatsApp;
   - copiar texto/link quando disponivel;
   - marcar como enviada.
10. Ao concluir:
   - marcar onboarding de primeira proposta como concluido;
   - mostrar proxima acao: acompanhar proposta, criar outra ou ir ao dashboard.

### Tour contextual

1. Tour aparece automaticamente uma vez.
2. Tour deve ser curto e ligado a elementos reais:
   - painel de ativacao;
   - personalizacao;
   - templates;
   - preview;
   - gerar/exportar/enviar.
3. Tour deve ter botao de pular.
4. Tour deve registrar conclusao ou pulo.
5. Elementos alvos devem usar seletores estaveis, preferencialmente `data-tour`.
6. No mobile, o tour deve ser simplificado e nao competir com wizard, drawer ou bottom navigation.

## Requisitos

- O onboarding deve ser pulavel.
- O onboarding deve ser retomavel.
- O progresso deve ser persistido no backend por usuario individual.
- O progresso deve ser recalculado a partir dos dados reais quando possivel.
- Etapas concluidas fora do wizard devem aparecer como concluidas no checklist.
- O dashboard deve destacar a proxima acao recomendada.
- O Wizard 1 deve concluir apenas quando houver configuracao minima salva.
- O Wizard 2 deve concluir quando a primeira proposta for gerada.
- O usuario deve conseguir voltar etapas sem perder dados ja salvos.
- O usuario deve conseguir sair no meio do Wizard 2 com progresso/rascunho salvo.
- Textos devem explicar o "por que" de cada etapa sem virar tutorial longo.
- Mobile deve priorizar uma tarefa por tela.
- Acoes principais devem ficar acessiveis em etapas longas.
- Campos opcionais devem ser claramente marcados ou recolhidos.
- O tour contextual automatico deve aparecer uma vez por usuario e nao impedir uso recorrente.
- O sistema deve permitir reabrir ajuda depois.
- Eventos de onboarding devem ser registrados no backend.

## Regras de negocio

- Configuracao minima da conta:
  - nome da marca/profissional;
  - WhatsApp;
  - email;
  - segmento;
  - template padrao;
  - cores da marca;
  - preferencia de arquivo.
- Logomarca e recomendada, mas pode ser pulada.
- Sem logomarca, a proposta deve usar iniciais da marca em um simbolo simples.
- Template padrao e obrigatorio para concluir o Wizard 1.
- Primeira proposta concluida:
  - proposta criada e gerada.
- Trial expirado continua bloqueando geracao/exportacao/envio conforme regra atual.
- Preferencia de arquivo define defaults, mas nao remove opcoes manuais.
- Usuarios existentes com dados ja cadastrados devem ter progresso preenchido automaticamente quando os dados reais satisfizerem as regras.
- O onboarding nao cria permissao nova nem altera regras de admin.
- O fluxo deve reaproveitar templates ativos e preservar compatibilidade com propostas antigas.
- Cliente e servico podem ser criados ou selecionados no Wizard 2.
- A primeira proposta deve mostrar campos minimos e manter campos opcionais recolhidos.
- WhatsApp e o canal obrigatorio padrao do onboarding.

## Impactos por projeto

- API:
  - adicionar persistencia de progresso/preferencia por usuario;
  - criar migration/campos novos se necessario;
  - possivel retorno de progresso em `/api/me` ou endpoint dedicado.
  - registrar eventos de onboarding.
- Web:
  - criar componentes de onboarding;
  - integrar dashboard, personalizacao, clientes, servicos e propostas;
  - adicionar dependencia de tour contextual, preferencialmente `react-joyride`;
  - adicionar `data-tour` em elementos alvo.
- Mobile:
  - sem app nativo;
  - garantir responsividade no webapp;
  - tour simplificado;
  - evitar popovers complexos em telas pequenas.
- Landing:
  - sem impacto.
- Packages:
  - sem impacto esperado.
- Infra:
  - novo build/deploy web;
  - novo build/deploy API se houver migration/campos novos.

## Criterios de aceite

- Conta nova ve painel de ativacao no dashboard.
- Conta nova abre onboarding automaticamente em tela cheia no primeiro login.
- Usuario consegue iniciar Wizard 1.
- Usuario consegue salvar dados da marca.
- Usuario consegue subir ou pular logo.
- Sem logo, preview/proposta usa iniciais da marca em simbolo simples.
- Usuario recebe sugestao de cores a partir da logo e consegue editar cores da marca.
- Usuario consegue escolher template padrao.
- Usuario consegue escolher preferencia de arquivo.
- Wizard 1 mostra revisao e conclui.
- Dashboard passa a indicar configuracao da conta concluida.
- Usuario consegue iniciar Wizard 2.
- Usuario consegue criar ou selecionar cliente.
- Usuario consegue criar ou selecionar servico.
- Usuario consegue montar orcamento.
- Usuario consegue revisar preview.
- Usuario consegue gerar proposta.
- Wizard 2 conclui quando a proposta e gerada.
- Usuario consegue compartilhar ou marcar como enviada apos gerar.
- Wizard 2 conclui e dashboard reflete progresso.
- Usuario consegue pular e retomar onboarding.
- Se o usuario pular, o sistema lembra no proximo login.
- Usuario consegue sair no meio do Wizard 2 e retomar com progresso/rascunho salvo.
- Usuario existente com dados reais nao e forcado a repetir etapas ja concluidas.
- Mobile 360/390/430 px nao tem overflow horizontal, texto cortado ou acoes inacessiveis.
- Desktop mantem densidade operacional sem parecer landing page.
- Tour contextual aparece automaticamente uma vez, pode ser pulado e pode ser reaberto pela ajuda.
- Tour mobile e simplificado.
- Tour contextual nao quebra quando um alvo nao existe; deve pular step ou encerrar com seguranca.
- Eventos de onboarding sao gravados no backend.
- Lint web passa.
- Build web passa.
- Teste manual ou Playwright cobre conta nova ate primeira proposta.

## Estrategia de implementacao

### Etapa 1 - Modelo e progresso

- Mapear campos existentes de conta/perfil.
- Criar persistencia no backend por usuario.
- Implementar leitura e escrita do progresso.
- Registrar eventos: iniciou, pulou, concluiu conta, concluiu primeira proposta.
- Derivar conclusao por dados reais:
  - perfil preenchido;
  - template padrao;
  - cores;
  - clientes;
  - servicos;
  - proposta gerada/enviada.

### Etapa 2 - Checklist de ativacao

- Evoluir o bloco atual de primeiros passos.
- Separar duas jornadas:
  - Conta e marca.
  - Primeira proposta.
- Mostrar status: nao iniciado, em andamento, concluido, pulado.
- Destacar proxima acao.
- Abrir onboarding automaticamente no primeiro login quando pendente.

### Etapa 3 - Wizard de conta

- Reaproveitar schema/formulario de perfil quando possivel.
- Reaproveitar upload de logomarca.
- Implementar fallback de iniciais quando nao houver logo.
- Sugerir cores a partir da logo e permitir edicao manual.
- Reaproveitar lista de templates ativos.
- Adicionar preferencia de arquivo.
- Definir WhatsApp como canal padrao obrigatorio.
- Criar revisao final.

### Etapa 4 - Wizard de primeira proposta

- Reaproveitar assistente de nova proposta existente.
- Reaproveitar mutations de cliente, servico e proposta.
- Dividir explicacoes por etapa.
- Manter preview e geracao atuais.
- Integrar preferencia de arquivo.
- Salvar progresso/rascunho ao sair no meio do fluxo.
- Concluir onboarding quando a proposta for gerada.

### Etapa 5 - Tour contextual

- Instalar `react-joyride`.
- Criar provider central do tour.
- Adicionar `data-tour` em alvos estaveis.
- Criar steps curtos por contexto.
- Persistir conclusao/pulo.
- Criar comportamento mobile simplificado.

### Etapa 6 - Validacao e deploy

- Rodar lint/build.
- Rodar teste automatizado mobile.
- Fazer smoke local com conta nova.
- Publicar web/API se necessario.
- Fazer smoke em producao com conta nova.

Observacao: a entrega sera publicada como uma unica entrega funcional, seguindo a ordem interna acima.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- `dotnet build apps/api/Emprely.sln`, se API mudar.
- `dotnet test apps/api/Emprely.sln`, se API mudar.
- Playwright ou script equivalente para:
  - conta nova no dashboard;
  - abertura automatica no primeiro login;
  - iniciar/pular/retomar onboarding;
  - lembrete no login seguinte apos pular;
  - concluir Wizard 1;
  - concluir Wizard 2;
  - sair no meio do Wizard 2 e retomar rascunho/progresso;
  - tour automatico uma vez e skip;
  - validar mobile 360, 390 e 430 px sem overflow horizontal.
- Smoke manual em producao:
  - criar conta;
  - configurar marca;
  - criar primeira proposta;
  - gerar PDF/imagem;
  - compartilhar por WhatsApp;
  - validar retomada do onboarding em outro login.

## Fontes de referencia

- React Joyride: https://docs.react-joyride.com/
- React Joyride props/callback: https://docs.react-joyride.com/props e https://docs.react-joyride.com/callback
- Reactour: https://docs.reactour.dev/
- GOV.UK Task List: https://design-system.service.gov.uk/components/task-list/
- WAI-ARIA Dialog Modal Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- WCAG 2.2 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
