# Correcao de validacao dos formularios administrativos

## Visao geral

A correcao melhora a experiencia do painel administrativo exibindo erros claros nos campos antes do envio. O admin deve saber exatamente se faltou preencher algo, se o formato esta incorreto ou se o valor informado nao atende a regra minima.

## Escopo

- Validar login admin.
- Validar modais administrativos de usuario, conta, plano, dias gratis, suspensao, bloqueio, desbloqueio, reativacao e e-mail personalizado.
- Mostrar erro abaixo do campo.
- Mostrar erro geral apenas como complemento.
- Melhorar mensagem de erro 429.

## Fluxo ponta a ponta

1. Admin abre formulario ou modal.
2. Admin clica em confirmar/entrar.
3. Frontend executa validacao local.
4. Se houver erro, campos invalidos recebem mensagens e a chamada API nao ocorre.
5. Se nao houver erro, frontend envia a requisicao.
6. Se a API rejeitar, erro global exibe a mensagem retornada.

## Requisitos

- Campo obrigatorio vazio deve exibir mensagem especifica.
- E-mail invalido deve exibir mensagem de formato.
- Senha temporaria menor que 8 caracteres deve exibir mensagem especifica.
- Motivo com menos de 5 caracteres deve exibir mensagem especifica.
- Datas de dias gratis devem ser validas e o fim deve ser posterior ao inicio.
- Se nenhum alvo for selecionado em lote/e-mail, a revisao deve exibir erro.
- HTTP 429 deve exibir mensagem compreensivel.

## Regras de negocio

- Toda acao administrativa que altera acesso, plano ou dados deve ter motivo util.
- Validacao local nao substitui validacao do backend, apenas antecipa feedback.
- Erro global deve continuar existindo para falhas de permissao, rede, rate limit ou regras do servidor.

## Impactos por projeto

- Webapp admin: melhora componentes e handlers de formulario.
- API: sem alteracao de comportamento.
- Biblioteca de API frontend: melhora mensagem fallback.

## Criterios de aceitacao

- Ao tentar bloquear usuario com motivo "gf", a tela mostra erro no campo motivo.
- Ao tentar confirmar com motivo vazio, a tela informa que o motivo e obrigatorio.
- Ao criar usuario com e-mail invalido, a tela informa e-mail invalido.
- Ao cadastrar datas invalidas de dias gratis, a tela informa o campo correto.
- Ao receber 429, a tela nao mostra apenas "Erro 429".

## Estrategia de implementacao

- Criar helpers simples de validacao local em `AdminApp.tsx`.
- Passar mensagens de erro para inputs e textareas.
- Validar por modo de acao antes de chamar mutation.
- Alterar fallback de status HTTP no `api.ts`.
