# Spec Web - Mascara de telefone do sistema

## Visao geral

Adicionar mascara de telefone reutilizavel no web para campos de telefone, mantendo o formato `(XX) XXXXX-XXXX`.

## Rotas

- App autenticado: clientes, propostas/cliente rapido e configuracoes.
- App publico: cadastro de usuario.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: campo permanece vazio.
- Erro: telefone incompleto mostra mensagem de DDD e numero completo.
- Sucesso: valor aparece mascarado e salvo no fluxo atual.

## Componentes

- `CampoTexto` recebe props de telefone ja preparadas pelo helper.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Cadastro telefone | tel | Sim | 11 digitos nacionais, exibidos como `(XX) XXXXX-XXXX` |
| Cliente telefone | tel | Nao | Vazio ou 11 digitos nacionais |
| Cliente rapido telefone | tel | Nao | Vazio ou 11 digitos nacionais |
| Perfil telefoneContato | tel | Nao | Vazio ou 11 digitos nacionais |

## Integracao com API

- Sem mudanca de contrato.
- Payloads continuam enviando string ou `null`.
- Links de WhatsApp continuam normalizando para `55DDDN...`.

## Criterios de aceite

- Letras e simbolos digitados/colados sao removidos.
- O campo limita o telefone nacional ao formato `(XX) XXXXX-XXXX`.
- Todos os formularios de telefone usam o mesmo comportamento.
- Lint e build passam.

## Testes

- Lint: `pnpm.cmd --dir apps/web lint`.
- Build: `pnpm.cmd --dir apps/web build`.
- Cenarios manuais: digitar letras, colar telefone com `+55`, salvar cadastro/cliente/perfil.
