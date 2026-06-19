# Correcao de validacao dos formularios administrativos

## Contexto

O painel administrativo envia formularios sem validacao local suficiente. Quando um campo obrigatorio falta, esta curto ou esta em formato invalido, a interface pode exibir erro generico da API, como "Erro 429", sem orientar o admin sobre qual campo precisa de correcao.

## Objetivo

Exibir erros claros por campo antes de enviar a requisicao administrativa, informando quando um campo obrigatorio falta, quando um valor esta invalido e quando um motivo administrativo esta curto demais.

## Fluxo

1. Admin preenche uma acao administrativa.
2. Ao confirmar, o frontend valida os campos do formulario atual.
3. Campos invalidos recebem mensagem abaixo do input.
4. A requisicao so e enviada quando nao houver erro local.
5. Caso a API ainda retorne erro, a mensagem global continua sendo exibida.
6. Erro HTTP 429 passa a ter mensagem humana.

## Regras

- Campos obrigatorios devem informar explicitamente que precisam ser preenchidos.
- E-mail deve validar formato basico antes do envio.
- Senha temporaria deve ter ao menos 8 caracteres.
- Motivo administrativo deve ter ao menos 5 caracteres.
- Periodo de dias gratis deve ter inicio, fim e fim posterior ao inicio.
- Formulario de e-mail personalizado deve exigir destinatario, assunto, HTML e motivo.

## Impactos

- `apps/web/src/AdminApp.tsx`: adiciona validacao local e mensagens por campo.
- `apps/web/src/lib/api.ts`: melhora fallback de erro HTTP 429.
- Documentacao SDD registra a regra de validacao.

## Dependencias

- Componentes locais `LabeledInput`, `TextAreaField` e `RevisaoUsuarios`.
- Tipos dos formularios administrativos.

## Riscos

- Validacao local pode bloquear valores que o backend aceitaria, especialmente motivo curto.
- Mensagens atuais sem acento seguem o padrao existente do arquivo para evitar alteracao ampla de encoding.

## Duvidas

- Nenhuma duvida bloqueante. Foi adotado minimo de 5 caracteres para motivo administrativo para evitar textos sem utilidade, como "gf".
