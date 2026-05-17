# Spec API - Bateria de aceite do MVP

## Visao geral

Adicionar testes de integracao que executam o fluxo principal do MVP diretamente contra a API em memoria. A bateria deve ser rapida, reproduzivel e independente de servidor local.

## Cenarios

### Fluxo comercial feliz

1. Registrar usuario e conta.
2. Validar que a conta nasce em trial ativo.
3. Criar cliente com telefone WhatsApp valido.
4. Criar servico.
5. Criar proposta com item.
6. Gerar proposta.
7. Marcar proposta como enviada.
8. Marcar proposta como aceita.
9. Duplicar proposta aceita.

## Criterios de aceite

- `POST /api/auth/register` retorna token e conta trial.
- Cliente valido retorna `201`.
- Servico valido retorna `201`.
- Proposta criada retorna numero `1` e status `Rascunho`.
- Proposta gerada retorna status `Gerada`.
- Proposta enviada retorna status `Enviada`.
- Proposta aceita retorna status `Aceita`.
- Proposta duplicada retorna numero `2` e status `Rascunho`.

### Validacao e bloqueio comercial

1. Registrar usuario e conta.
2. Tentar criar cliente com telefone invalido.
3. Criar cliente, servico e proposta validos.
4. Expirar o trial da conta no banco de teste.
5. Tentar gerar proposta.

## Criterios de aceite

- Telefone invalido retorna `400`.
- Trial expirado retorna `403` ao gerar proposta.
- O teste nao depende de PostgreSQL real.
- O teste nao abre porta local.

## Testes

- `dotnet test apps/api/Emprely.sln`
