# Spec - bateria de layout e usabilidade

## Objetivo

Gerar um relatorio completo com erros e melhorias de layout/usabilidade para orientar o proximo ciclo de correcoes.

## Rotina

1. Abrir `https://app.emprely.com.br`.
2. Capturar tela publica de login.
3. Logar com usuario comum de teste.
4. Auditar telas principais em desktop, tablet e mobile.
5. Auditar formulario e wizard sem persistir novos dados.
6. Registrar screenshots e metricas objetivas.
7. Consolidar achados em documento final.

## Artefatos esperados

- Screenshots em `docs/testing/evidencias/layout-usabilidade-2026-06-20/`.
- JSON bruto da auditoria na mesma pasta.
- Relatorio final em `docs/testing/resultados/2026-06-20-relatorio-layout-usabilidade.md`.

## Criterios de aceite

- Relatorio lista erros, melhorias, severidade, telas afetadas e recomendacao de correcao.
- Evidencias apontam desktop, tablet e mobile.
- Falhas de automacao sao separadas de falhas reais de produto.
