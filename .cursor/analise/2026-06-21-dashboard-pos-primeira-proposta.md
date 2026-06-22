# Análise - Dashboard após primeira proposta gerada

## Contexto

Depois que a conta já possui uma proposta gerada, o dashboard ainda mostra a
mensagem "Crie sua primeira proposta profissional em minutos" e mantém o botão
"Abrir guia inicial" logo abaixo do hero. Isso cria desalinhamento de contexto:
o usuário já passou da etapa inicial e precisa acompanhar propostas, criar novas
versões e evoluir o fluxo comercial.

## Decisão

Tornar o hero do dashboard sensível ao progresso:

- antes da primeira proposta gerada, manter a mensagem de ativação e o botão de
  guia inicial;
- depois da primeira proposta gerada, trocar a mensagem para acompanhamento do
  pipeline comercial;
- remover o botão `Abrir guia inicial` desse local quando a primeira proposta já
  existir, evitando ruído visual e linguagem de onboarding fora de contexto.

## Critérios de aceite

- Conta sem proposta gerada continua vendo a chamada para criar a primeira
  proposta.
- Conta com proposta gerada não vê mais "Crie sua primeira proposta".
- Conta com proposta gerada não vê mais o botão "Abrir guia inicial" nessa área
  do dashboard.
- O dashboard passa a orientar acompanhamento e próximos fechamentos.
