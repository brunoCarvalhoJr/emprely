# Relatorio de UX, layout e fluxo completo via Chrome - Emprely

Data: 2026-06-20  
Execucao: Chrome plugin, perfil Chrome selecionado `Profile 3`  
Ambiente: `https://app.emprely.com.br` e `https://app.emprely.com.br/admin`  
Usuario SaaS: `teste.codex.20260620@emprely.com.br`  
Admin: `admin.codex.20260620@emprely.com.br`  
Prefixo da massa criada: `QA UX 20260620-1612`  
Evidencias: `docs/testing/evidencias/ux-fluxo-completo-2026-06-20-chrome/`

## Resumo executivo

Foi executada uma bateria assistida no Chrome cobrindo o fluxo principal do SaaS: login, dashboard, clientes, servicos, criacao de proposta, item de catalogo, item livre, selecao dos 9 templates ativos, detalhes comerciais, revisao, salvar rascunho, gerar proposta, download de PDF, status Enviada/Aceita/Recusada, duplicacao e cleanup da massa QA. Tambem foi feita uma passada no painel admin com foco em carregamento, filtros, formularios e riscos de usabilidade/seguranca.

O fluxo principal funciona de ponta a ponta, mas ha problemas relevantes para atacar antes de ampliar uso beta: entrada monetaria interpreta valores digitados de forma contraintuitiva, varias telas exibem textos sem acento ou em ingles, controles repetidos dificultam automacao e acessibilidade, o admin nao carregou usuarios/admins, e formularios administrativos sofreram autofill de credenciais do Chrome.

## Cobertura executada

| Area | Resultado |
|---|---|
| Login usuario comum | Passou |
| Dashboard SaaS | Passou com inconsistencia de nomenclatura |
| Clientes | Criar, buscar e excluir passaram |
| Servicos | Criar, buscar e excluir passaram, mas mascara monetaria falhou |
| Proposta completa | Passou com problemas de moeda, copy e testabilidade |
| Templates | 9 templates clicados e selecionaveis |
| PDF | PDF baixado com sucesso em Downloads e copiado para evidencias |
| Status | Gerada, Enviada, Aceita e Recusada cobertos |
| Duplicacao | Passou, copia virou rascunho editavel |
| Cleanup | 2 propostas, 1 servico e 1 cliente QA arquivados |
| Suporte | Formulario aberto, envio real nao executado |
| Admin | Login existente funcionou, mas dados nao carregaram |
| Mobile | Nao coberto nesta rodada Chrome; viewport efetivo foi desktop largo |

## Achados prioritarios

### P0 - Campo monetario converte valores digitados para centavos sem clareza

Evidencias: `09-servicos-salvo-mascara-1500.png`, `15-proposta-item-catalogo-adicionado.png`, `17-proposta-item-livre-preenchido.png`, `21-proposta-detalhes-preenchidos.png`, `24-proposta-gerada.png`.

O usuario digita `1500` no preco do servico esperando naturalmente `R$ 1.500,00`, mas o sistema registra `R$ 15,00`. O mesmo ocorreu no item livre: `500` virou `R$ 5,00`; e no desconto: `5` virou `R$ 0,05`.

Impacto: alto. Esse erro afeta diretamente o valor do orcamento, o PDF e o aceite comercial.

Recomendacao:
- Aceitar entrada decimal natural em pt-BR: `1500`, `1.500`, `1500,00` devem virar `R$ 1.500,00`.
- Se a mascara por centavos for intencional, exibir placeholder e ajuda explicita, por exemplo `Digite 150000 para R$ 1.500,00`, mas essa experiencia e inferior.
- Adicionar testes unitarios e E2E para servico, item livre e desconto.

### P0 - Painel admin autenticado nao carregou usuarios/admins

Evidencias: `40-admin-start.png`, `41-admin-dashboard-carregado.png`.

O admin abriu autenticado como SuperAdmin, mas metricas ficaram em zero, tabelas de usuarios/admins ficaram vazias e a tela nao exibiu erro recuperavel. O usuario comum de teste existia e foi usado no SaaS, entao o painel deveria listar ao menos esse usuario ou explicar restricao/falha.

Impacto: alto. O admin fica operacionalmente inutil para suporte beta se nao carregar usuarios.

Recomendacao:
- Exibir estado de erro com mensagem clara quando a API falhar.
- Registrar no console/log a causa real da falha.
- Validar contrato da API admin e permissao do SuperAdmin.
- Criar smoke admin: login, metricas > 0, busca por usuario QA e abertura de detalhe.

### P0 - Autofill de credenciais em formularios administrativos

Evidencia segura: `42-admin-filtros-avancados-redigido.png`. As screenshots com valores sensiveis foram removidas.

O Chrome preencheu automaticamente campos de criacao de admin e criacao de usuario com e-mail e senha salvos no navegador. Isso ocorreu em areas administrativas de alto risco.

Impacto: alto. Risco de envio acidental de credenciais pessoais para um usuario/admin criado por engano.

Recomendacao:
- Usar `autocomplete="off"` ou tokens apropriados como `new-password`, `one-time-code`, `email`, `name` conforme o campo.
- Separar nomes dos inputs de senha temporaria de nomes comuns de login.
- Limpar valores default em modais administrativos ao abrir.
- No perfil de teste, desabilitar gerenciador de senhas/autofill.

### P1 - Wizard mostra 4 etapas antes da selecao de cliente e 6 etapas depois

Evidencias: `11-proposta-wizard-inicio.png`, `13-proposta-dados.png`.

Na entrada da nova proposta aparecem 4 etapas: Cliente, Proposta, Itens, Revisao. Apos selecionar cliente, o wizard passa para 6 etapas: Cliente, Proposta, Itens, Template, Detalhes, Revisao.

Impacto: medio-alto. Quebra expectativa e dificulta documentacao/testes.

Recomendacao:
- Mostrar 6 etapas desde o inicio, mesmo que Template/Detalhes fiquem pendentes.
- Ou separar a escolha inicial de cliente como etapa preliminar antes do wizard.

### P1 - Textos sem acento e termos em ingles na interface

Evidencias: `21-proposta-detalhes-preenchidos.png`, `22-proposta-revisao.png`, `35-proposta-duplicada-gerada.png`, `41-admin-dashboard-carregado.png`.

Exemplos observados:
- `Esta etapa e opcional`
- `Condicoes de pagamento`
- `2 items`
- `(copia)`
- `Filtros avancados`
- `Ultimo login`
- `Motivo e acoes`

Impacto: medio. Reduz percepcao de qualidade em um produto que gera documentos comerciais.

Recomendacao:
- Centralizar strings pt-BR.
- Adicionar teste de snapshot/copy para termos criticos.
- Padronizar pluralizacao: `1 item`, `2 itens`.

### P1 - Controles repetidos e sem seletores estaveis dificultam automacao e acessibilidade

Evidencias: `03-clientes-form-novo.png`, `07-servicos-form-novo.png`, `16-proposta-item-livre.png`, `28-proposta-menu-acoes.png`.

Problemas:
- Dois botoes `Novo cliente` e dois `Novo servico` na mesma tela.
- Dois botoes `Gerar proposta` na revisao.
- Campos repetidos em itens com o mesmo label: `Item`, `Qtd`, `Valor`, `Descricao`.
- `getByLabel` falhou em alguns comboboxes apesar do nome aparecer no snapshot.

Impacto: medio-alto. Aumenta flakiness e prejudica leitores de tela.

Recomendacao:
- Adicionar `data-testid` conforme rotina 83.
- Tornar labels unicos por contexto: `Item 01 - Valor`, `Item 02 - Valor`.
- Associar `label` e controle com `htmlFor/id` em selects e inputs.
- Diferenciar CTAs globais e locais por nome acessivel.

### P1 - Fluxo guiado perde continuidade apos salvar cliente/servico

Evidencias: `04-clientes-pos-salvar.png`, `09-servicos-salvo-mascara-1500.png`.

Apos salvar cliente ou servico, a tela permanece no formulario limpo com toast. A rotina de primeira proposta espera continuidade para o proximo passo quando aplicavel.

Impacto: medio. O usuario iniciante pode nao saber se deve voltar, criar outro ou seguir para proposta.

Recomendacao:
- Apos salvar primeiro cliente, oferecer CTA `Cadastrar servico` e `Criar proposta`.
- Apos salvar primeiro servico, oferecer CTA `Criar proposta`.
- Se permanecer no formulario, incluir feedback persistente com proximo passo.

### P2 - Listagens ficam densas com observacoes longas e links extensos

Evidencias: `05-clientes-busca-qa-ux.png`, `49-cleanup-clientes-busca.png`.

Observacoes longas deixam a linha muito alta; link de WhatsApp compete com telefone e acao principal.

Impacto: medio. Afeta escaneabilidade em base maior.

Recomendacao:
- Truncar observacao em 1-2 linhas com expansao no detalhe.
- Mostrar WhatsApp como icone/botao compacto com tooltip.
- Usar layout de card responsivo em telas estreitas.

### P2 - Download PDF funcionou, mas evento automatizado nao foi capturado

Evidencias: `25-proposta-modal-download-pdf.png`, `26-orcamento-0043-qa-ux.pdf`.

O PDF apareceu em Downloads, mas o evento `download` do browser automation expirou. Pode ser limitacao do plugin ou forma de disparo do app.

Impacto: baixo-medio. O usuario recebeu o PDF; automacao precisa de estrategia alternativa.

Recomendacao:
- Para testes E2E, validar arquivo por pasta de downloads ou endpoint/API de geracao.
- Exibir feedback visual de geracao/download concluido.

### P2 - Suporte nao informa destino/tempo de resposta antes do envio

Evidencia: `44-suporte-form.png`.

O formulario e simples e claro, mas nao informa prazo, canal de retorno ou se a solicitacao gera e-mail/ticket.

Impacto: baixo-medio.

Recomendacao:
- Incluir microcopy: prazo estimado, canal de resposta e escopo do suporte.
- Se envio for externo, explicitar antes do submit.

## Status e entidades exercitadas

| Item | Resultado |
|---|---|
| Cliente criado | `QA UX 20260620-1612 Cliente principal` |
| Servico criado | `QA UX 20260620-1612 Serviço máscara 1500` |
| Proposta gerada | `#0043 - QA UX 20260620-1612 Proposta completa UX` |
| Proposta duplicada | `#0044 - QA UX 20260620-1612 Proposta completa UX (copia)` |
| Templates clicados | 9 de 9 |
| Status Gerada | Coberto |
| Status Enviada | Coberto |
| Status Aceita | Coberto |
| Status Recusada | Coberto |
| Status Rascunho | Coberto temporariamente via salvar rascunho e duplicacao |
| PDF | Baixado e copiado para evidencias |
| WhatsApp | Botao visto, envio real nao executado |
| Suporte | Formulario visto, envio real nao executado |
| Cleanup propostas | 2 propostas QA arquivadas |
| Cleanup servicos | 1 servico QA arquivado |
| Cleanup clientes | 1 cliente QA arquivado |

## Evidencias principais

| Evidencia | Conteudo |
|---|---|
| `01-dashboard-desktop.png` | Dashboard SaaS |
| `05-clientes-busca-qa-ux.png` | Cliente criado e busca |
| `09-servicos-salvo-mascara-1500.png` | Mascara monetaria no servico |
| `17-proposta-item-livre-preenchido.png` | Item livre com valor convertido |
| `18-proposta-template.png` | Matriz de templates |
| `21-proposta-detalhes-preenchidos.png` | Detalhes, desconto e preview |
| `24-proposta-gerada.png` | Proposta gerada |
| `26-orcamento-0043-qa-ux.pdf` | PDF baixado |
| `32-proposta-status-aceita-confirmada.png` | Status Aceita |
| `38-proposta-status-recusada.png` | Status Recusada |
| `41-admin-dashboard-carregado.png` | Admin sem dados |
| `42-admin-filtros-avancados-redigido.png` | Admin com campos limpos apos autofill |
| `46-cleanup-propostas-apos-excluir.png` | Cleanup de propostas |
| `48-cleanup-servicos-apos-excluir.png` | Cleanup de servico |
| `50-cleanup-clientes-apos-excluir.png` | Cleanup de cliente |

## Melhorias recomendadas para o proximo ciclo

1. Corrigir a mascara monetaria antes de qualquer beta com usuarios externos.
2. Corrigir carregamento/estado de erro do admin.
3. Bloquear autofill em formularios administrativos e de senha temporaria.
4. Padronizar wizard para 6 etapas desde o inicio.
5. Revisar todas as strings pt-BR e pluralizacao.
6. Implementar `data-testid` nos comandos criticos da rotina 83.
7. Ajustar labels de campos repetidos no wizard.
8. Melhorar continuidade pos-salvamento de cliente/servico.
9. Truncar observacoes longas nas listagens.
10. Adicionar feedback visual ao download PDF.
11. Criar endpoint/comando de cleanup por prefixo conforme rotina 85.
12. Rodar uma bateria mobile separada com viewport controlado ou Playwright mobile.

## Limitacoes da rodada

- A validacao foi feita em Chrome desktop com viewport efetivo aproximado de `2400x1111`.
- Nao houve validacao mobile real/emulada nesta rodada.
- Nao foi enviado WhatsApp real.
- Nao foi enviada solicitacao real de suporte.
- Modais administrativos com autofill sensivel nao foram mantidos como evidencia visual para evitar exposicao de segredo.
- O check de console do admin mostrou erros de extensao/browser, mas a causa do painel vazio precisa de investigacao por API/logs.

