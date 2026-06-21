# Spec - Refatorar preferencias do Perfil da conta

## Objetivo

Melhorar a organizacao da pagina `Perfil da conta`, especialmente na visao
mobile, separando template, cores e formato de envio em blocos independentes e
substituindo os inputs de cor largos por controles de color picker mais claros.

## Escopo

- Reordenar a area de preferencias da proposta.
- Criar componente visual de selecao de cor para campos do perfil.
- Manter os campos atuais e o mesmo payload de API.
- Ajustar CSS responsivo da pagina.
- Atualizar testes E2E quando necessario.

## Fora de escopo

- Alterar backend, banco ou contrato de API.
- Alterar templates de documento.
- Criar nova biblioteca de componentes.

## Criterios de aceite

1. Mobile exibe preferencias na ordem: tema, template, cores, formato.
2. Desktop exibe blocos escaneaveis sem misturar assunto de cor e formato.
3. Cores manuais usam color picker e campo HEX legivel.
4. Labels nao ficam cortadas nem sobrepostas.
5. `pnpm --filter web lint`, `pnpm --filter web build` e E2E do web passam.
