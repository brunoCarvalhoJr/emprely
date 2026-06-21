# Analise - Admin emails no painel administrativo

## Contexto

A tela `Admin emails` aparece hoje no menu principal do app comum. Ela pede uma chave super admin manual para consultar historico e reenviar confirmacao de e-mail.

O produto ja possui um painel administrativo separado em `/admin`, com login administrativo, gestao de usuarios, planos e emails em lote.

## Necessidade

- Remover `Admin emails` da navegacao do app comum.
- Levar a operacao para dentro do painel administrativo.
- Reaproveitar a autenticacao administrativa do painel, sem exigir que o usuario comum veja essa opcao.
- Manter responsividade mobile no painel admin.

## Decisoes

- A funcionalidade entra como uma secao do `AdminApp`, junto dos controles administrativos.
- O backend passa a aceitar token administrativo nesses endpoints, mantendo a chave operacional antiga para compatibilidade.
- Acesso via token administrativo deve ser restrito a `SuperAdmin`, porque a tela antiga era equivalente a uma operacao super admin por chave.

## Criterios de aceite

- O menu do app comum nao mostra mais `Admin emails`.
- `/admin` mostra a secao de emails administrativos para `SuperAdmin`.
- A secao permite reenviar confirmacao por email e consultar historico recente.
- O layout funciona em desktop e mobile sem depender de tabela larga obrigatoria.
