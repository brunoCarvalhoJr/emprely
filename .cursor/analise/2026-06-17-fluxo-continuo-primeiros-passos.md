# Analise - Fluxo continuo de primeiros passos

## Contexto

O dashboard mostra um checklist de primeiros passos para contas novas. O estado visual atual indica progresso, mas a experiencia ainda funciona como atalhos independentes: depois de cadastrar o primeiro cliente, o usuario permanece no cadastro de cliente; depois de cadastrar o primeiro servico, permanece no cadastro de servico.

## Problema

Para uma conta em ativacao, o objetivo nao e cadastrar varios clientes ou varios servicos, e sim aprender o fluxo minimo completo:

1. revisar perfil;
2. cadastrar o primeiro cliente;
3. cadastrar o primeiro servico;
4. criar a primeira proposta.

Quando o sistema mantem o usuario no mesmo formulario apos concluir uma etapa inicial, ele quebra o aprendizado guiado e aumenta a chance de abandono.

## Hipoteses

- O usuario novo precisa ser conduzido para a proxima acao operacional sem voltar ao dashboard.
- O comportamento continuo deve valer apenas para a primeira conclusao de cliente e servico.
- Edicoes e cadastros adicionais devem preservar o comportamento atual para nao atrapalhar uso recorrente.

## Duvidas e decisoes

- Decisao: apos salvar o primeiro cliente, abrir automaticamente o formulario de novo servico.
- Decisao: apos salvar o primeiro servico, abrir automaticamente o assistente de nova proposta.
- Decisao: o checklist do dashboard deve destacar o proximo passo e tratar os passos futuros como roteiro, nao como varias acoes concorrentes.
- Fora do escopo: criar tours, popovers, modais obrigatorios ou alterar API.

## Riscos

- Navegacao automatica pode surpreender usuarios recorrentes se aplicada a todo cadastro. Por isso a regra deve depender de contagem zero antes do salvamento.
- O assistente de proposta depende de cliente e servico ja existirem; o fluxo guiado so chama essa etapa depois do primeiro servico salvo.

