# Spec: UI de troca de senha do admin

## Objetivo

Dar ao admin logado uma area clara dentro do `/admin` para trocar a propria senha.

## Fluxo

1. Admin entra em `/admin`.
2. Painel exibe a area "Seguranca da conta".
3. Admin informa senha atual, nova senha e confirmacao.
4. UI valida campos obrigatorios, tamanho minimo e confirmacao.
5. UI envia `POST /api/admin/auth/password` com token admin.
6. Em sucesso, limpa o formulario e exibe confirmacao.
7. Em erro, mostra mensagem retornada pela API.

## Regras de UI

- Campos devem usar `type=password`.
- Botao deve ficar desabilitado durante envio.
- O formulario nao deve exibir nem persistir senhas em storage.
- A area deve ser visivel para SuperAdmin e Suporte, pois ambos precisam trocar a propria senha.

## Criterio de pronto

- Build web passa.
- Lint web passa.
- Fluxo da API esta coberto por teste de integracao.
