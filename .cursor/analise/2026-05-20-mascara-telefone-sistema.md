# Analise - Mascara de telefone do sistema

## Contexto

O sistema possui campos de telefone em cadastro, clientes, cliente rapido na proposta e configuracoes da conta. Hoje a validacao aceita telefone com ou sem prefixo 55 e o input permite digitacao livre, o que deixa o formato inconsistente.

## Objetivo

Garantir que os campos de telefone aceitem apenas digitos digitados/colados pelo usuario e exibam a mascara brasileira com DDD e numero: `(XX) XXXXX-XXXX`.

## Projetos impactados

- API: sem mudanca planejada.
- Web: formulario de cadastro, clientes, cliente rapido e configuracoes.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Fluxo atual

O usuario pode digitar texto livre nos campos de telefone. A validacao remove caracteres nao numericos para conferir o telefone, mas a interface nao aplica mascara durante a digitacao.

## Fluxo proposto

Ao digitar ou colar telefone, o frontend deve extrair apenas numeros, limitar aos digitos nacionais necessarios e exibir o valor como `(XX) XXXXX-XXXX`. A validacao deve exigir DDD e numero completo quando o campo for preenchido.

## Regras de negocio

- Telefone obrigatorio no cadastro de usuario.
- Telefone opcional em clientes e configuracoes, mas quando preenchido deve conter DDD e numero completo.
- O link de WhatsApp continua usando o telefone normalizado com prefixo `55` internamente.

## Impactos tecnicos

- Criar helper reutilizavel de mascara no web.
- Aplicar a mascara nos registros de telefone dos formularios existentes.
- Ajustar mensagens de validacao para remover referencia a prefixo `55` digitavel.

## Riscos

- Telefones antigos com formato livre precisam ser exibidos de forma consistente ao editar.
- O helper de WhatsApp deve continuar funcionando com o valor mascarado.

## Duvidas

- Nenhuma bloqueante.
