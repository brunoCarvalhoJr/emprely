# Analise - Pagina de personalizacao separada das configuracoes

## Contexto

A tela atual de `Configuracoes` mistura dados do negocio, credenciais, cores da marca, template padrao de orcamento e seletor de tema. Isso dificulta a leitura da pagina e coloca acoes de aparencia junto com dados cadastrais.

O usuario pediu uma separacao clara:

- `Configuracoes`: somente dados da conta/negocio, como nome comercial, responsavel, email, telefone, site, Instagram, documento e logomarca.
- `Personalizacao`: tema do sistema, template padrao de impressao/exportacao de orcamentos e cores dos templates.

## Objetivo

Criar uma pagina separada de personalizacao e deixar configuracoes focada em dados cadastrais do negocio, mantendo a persistencia no perfil da conta.

## Fluxo

1. Usuario abre o menu da conta.
2. Usuario escolhe `Configuracoes` para editar dados cadastrais do negocio.
3. Usuario escolhe `Personalizacao` para editar aparencia e padroes visuais.
4. Em `Personalizacao`, o usuario altera:
   - tema claro/escuro do sistema;
   - template padrao usado em novos orcamentos;
   - cor primaria e cor secundaria dos templates dinamicos.
5. Ao salvar, o frontend envia o perfil completo para o backend.
6. O backend persiste os campos no perfil da conta.
7. Novas propostas usam o template padrao salvo e previews/exportacoes usam as cores de template salvas.

## Regras

- Tema claro/escuro continua local no navegador, pois e preferencia de interface do usuario/dispositivo.
- A tela de personalizacao nao deve oferecer edicao de cores da interface; o tema do sistema deve ficar restrito a claro/escuro.
- Cores dos templates devem continuar independentes do tema do sistema.
- Templates com cores estaticas podem ignorar cores de template, mantendo o aviso visual existente.
- O usuario deve conseguir restaurar o `templateVisualPadrao` para o default do sistema a partir da area de templates.
- A pagina `Configuracoes` nao deve exibir controles de cores, tema ou template padrao.
- A pagina `Personalizacao` nao deve misturar campos de cadastro como documento, responsavel ou email.
- O bloco `Preview dos orcamentos` deve permitir abrir uma modal com o preview real do template padrao selecionado, usando dados e cores atuais da personalizacao.

## Impactos

- `apps/api`: mantem compatibilidade com os campos visuais existentes do perfil.
- `apps/web`: tipo `PerfilContaResponse`, payload de atualizacao, schema do formulario, menu da conta, nova view `personalizacao`, tema claro/escuro e restauracao do template padrao.
- `spec`: registrar regras de produto e aceite para a separacao.

## Dependencias

- Endpoint existente `GET/PUT /api/account/profile`.
- `PerfilConta` como fonte dos padroes visuais da conta.
- Sistema de templates de proposta ja implementado no frontend.
- Preferencia local de tema ja baseada em `localStorage`.

## Riscos

- Campos novos precisam ter fallback para contas existentes.
- Ao remover a edicao de cores da interface, propostas antigas nao devem mudar o layout salvo alem das cores dinamicas de template.
- Se o CSS global receber uma cor invalida, botoes e estados de foco podem perder contraste; manter validacao `#RRGGBB`.
- Nao quebrar o fluxo de upload da logomarca, que continua em `Configuracoes`.

## Duvidas

- Futuramente pode ser necessario salvar tema claro/escuro por usuario no backend, mas para o MVP a preferencia local atende ao fluxo atual.
