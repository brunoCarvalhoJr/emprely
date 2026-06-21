# Analise - Refatoracao de preferencias no Perfil da conta

## Problema observado

Na visao mobile, a pagina `Perfil da conta` mistura decisoes diferentes dentro
do mesmo bloco visual:

- o titulo da area e `Cores dos templates`;
- logo abaixo aparece `Formato preferido para envio`, que e uma escolha de
arquivo/entrega, nao de cor;
- os color inputs nativos aparecem como barras grandes e pouco claras;
- a ordem da tela exige que o usuario entenda cores antes de escolher template;
- o aviso de `Cores estaticas` ocupa destaque maior que a propria acao.

No desktop, a mesma mistura prejudica escaneabilidade: tema do sistema, cores,
formato e galeria de templates dividem o mesmo formulario, mas sem uma ordem
mental clara.

## Decisao de UX

Reorganizar por tarefa, nao por campo tecnico:

1. Dados da conta, contato e marca.
2. Tema do sistema.
3. Template padrao da proposta.
4. Cores dos templates personalizaveis.
5. Formato preferido de envio.
6. Seguranca de acesso.

As cores devem usar um controle proprio com:

- amostra visual da cor;
- `input type="color"` para abrir o seletor nativo;
- campo HEX editavel para ajuste manual;
- descricao curta do uso da cor.

## Riscos

- A pagina usa uma unica instancia de `react-hook-form`; a refatoracao deve
  evitar registrar o mesmo campo duas vezes.
- A escolha de template e os campos de cor/formato precisam continuar salvando
  no mesmo endpoint `/api/account/profile`.

## Aceite

- Em mobile, `Formato preferido para envio` nao aparece dentro de `Cores dos templates`.
- As cores aparecem em bloco proprio, com color picker e campo HEX.
- O template padrao aparece antes das cores e do formato.
- O layout desktop mantem duas colunas quando houver espaco, sem cortar labels.
- O fluxo E2E mobile de preencher e salvar perfil continua passando.
