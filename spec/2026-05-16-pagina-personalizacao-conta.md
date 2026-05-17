# Spec - Pagina de personalizacao separada das configuracoes

## Visao geral

Separar dados cadastrais do negocio e preferencias visuais em duas paginas:

- `Configuracoes`: perfil do negocio e seguranca.
- `Personalizacao`: tema, template padrao e cores dos templates.

## Escopo

- Adicionar item `Personalizacao` no menu da conta.
- Remover seletor de tema do menu suspenso da conta.
- Remover campos de cor e template da pagina `Configuracoes`.
- Criar pagina `Personalizacao`.
- Manter cores dos templates persistidas no perfil da conta.
- Manter tema do sistema restrito a escolha claro/escuro.
- Permitir restaurar o template padrao para o default do sistema.

## Fora do escopo

- Salvar tema claro/escuro por usuario no backend.
- Criar templates novos.
- Alterar regras de exportacao PDF/imagem/WhatsApp.

## Fluxo ponta a ponta

1. Frontend carrega `/api/account/profile`.
2. Frontend popula formulario unico de perfil com dados cadastrais e visuais.
3. Em `Configuracoes`, o usuario edita dados do negocio e salva.
4. Em `Personalizacao`, o usuario edita tema, template padrao e cores dos templates.
5. Frontend envia `PUT /api/account/profile` com o perfil completo.
6. Backend valida cores em formato `#RRGGBB` e template valido.
7. Backend persiste no `PerfilConta`.
8. Frontend invalida/cacheia perfil atualizado.
9. Novas propostas usam `templateVisualPadrao`; previews e exportacoes usam cores de template.

## Requisitos

- `Configuracoes` deve conter apenas dados do negocio, logomarca, plano e seguranca.
- `Personalizacao` deve conter tema claro/escuro, template padrao e cores dos templates.
- A interface nao deve exibir campos para alterar cores do sistema.
- Cores dos templates devem alterar propostas dinamicas.
- Templates de cores estaticas devem continuar se identificando como estaticos.
- O usuario deve conseguir salvar personalizacao sem editar dados cadastrais.
- O usuario deve conseguir restaurar o template padrao para o default do sistema.
- O bloco `Preview dos orcamentos` deve ter uma acao para abrir uma modal com o template padrao renderizado pelo mesmo componente visual usado nas propostas.

## Regras de negocio

- Campos visuais pertencem ao perfil da conta.
- `corPrimaria` e `corSecundaria` continuam representando cores dos templates.
- `corSistemaPrimaria` e `corSistemaSecundaria` permanecem no contrato por compatibilidade, mas sem controle visual nesta tela.
- Tema claro/escuro e salvo localmente no navegador.
- Template padrao define o template inicial de novas propostas, sem alterar propostas ja criadas.

## Impactos por projeto

### apps/api

- Sem nova alteracao nesta etapa.
- Manter compatibilidade com os campos visuais ja existentes no perfil.

### apps/web

- Atualizar tipos de conta.
- Expandir schema e payload de perfil.
- Adicionar `personalizacao` ao `AppView`.
- Adicionar item no menu da conta.
- Criar a pagina de personalizacao.
- Limpar a pagina de configuracoes.
- Mostrar apenas controles de tema claro/escuro para a interface.
- Adicionar acao para restaurar o template padrao.

## Criterios de aceitacao

- O menu da conta mostra `Configuracoes` e `Personalizacao`.
- O seletor de tema nao aparece mais direto no menu suspenso.
- `Configuracoes` nao mostra campos de cor nem template padrao.
- `Personalizacao` mostra tema do sistema, template padrao e cores dos templates.
- `Personalizacao` nao mostra campos de cor da interface.
- O botao de restaurar muda o template padrao para o default do sistema.
- Em `Personalizacao`, o usuario consegue abrir o preview real do template padrao selecionado.
- Salvar personalizacao persiste no backend.
- Recarregar a pagina mantem cores dos templates.
- Criar nova proposta usa o template padrao salvo.
- Build do backend e frontend passam.

## Estrategia de implementacao

1. Manter compatibilidade com os campos existentes do perfil.
2. Atualizar tipos e formulario do frontend.
3. Criar view `Personalizacao`.
4. Mover controles visuais da conta para a nova view.
5. Adicionar acao de restauracao do template padrao.
6. Validar com build/test/lint.
