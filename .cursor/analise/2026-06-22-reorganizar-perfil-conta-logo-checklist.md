# Analise - Reorganizacao do perfil da conta

## Contexto

Na tela de Perfil da conta, a logomarca aparece depois dos blocos de
identificacao e contato. Para o fluxo de primeira configuracao, isso deixa a
marca visual em uma posicao secundaria, embora ela seja um dos primeiros dados
que definem a aparencia das propostas.

Quando o perfil esta completo, o painel de progresso tambem continua exibindo
todos os itens individuais, ocupando altura desnecessaria.

## Decisao

- Manter a tela unica de Perfil da conta.
- Posicionar o bloco Marca/Logomarca imediatamente abaixo de `Passo Perfil da
  conta`.
- Manter Identificacao e Contato depois da marca.
- Quando todos os itens do perfil estiverem completos, substituir a lista de
  tarjas por um resumo compacto `Perfil completo`.
- Quando houver pendencias, manter a lista detalhada para orientar o usuario.

## Criterios de aceite

- A primeira linha funcional abaixo do passo do perfil deve ser a logomarca.
- Perfil completo nao deve mostrar as tarjas individuais.
- Perfil incompleto continua mostrando pendencias detalhadas.
- Tema claro e escuro devem manter contraste legivel.
- Lint e build do web devem passar.
