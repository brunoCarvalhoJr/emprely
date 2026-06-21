# Analise - Mascara de telefone fixo e celular

## Ideia

Ajustar a mascara de telefone para aceitar os dois formatos brasileiros com DDD:

- `(XX) XXXX-XXXX` para telefone fixo.
- `(XX) XXXXX-XXXX` para celular.

## Contexto

A mascara atual aceitava apenas 11 digitos nacionais, o que bloqueava telefones fixos com 10 digitos nacionais. A Anatel informa que a telefonia fixa usa 8 digitos no numero do assinante e a telefonia movel celular usa 9 digitos.

## Decisao

- Manter o formatador proprio ja existente no app.
- Evitar adicionar biblioteca nova para uma regra simples e centralizada.
- Validar 10 ou 11 digitos nacionais.
- Formatar dinamicamente conforme a quantidade de digitos apos o DDD.

## Duvidas

Nao ha duvidas bloqueantes.
