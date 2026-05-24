# Spec Web - Cadastro de cliente simplificado

## Visao geral

Simplificar o cadastro de cliente mantendo campos principais sempre visiveis e movendo dados opcionais para um bloco recolhivel de informacoes complementares.

## Rotas

- Clientes.

## Estados da interface

- Novo cliente: collapse de informacoes complementares fechado por padrao.
- Editar cliente: collapse aberto se houver qualquer dado complementar salvo.
- Visualizar cliente: collapse aberto se houver qualquer dado complementar salvo.
- Sem dado social/WhatsApp: botao de acesso fica desabilitado.

## Componentes

- Formulario de cliente.
- Visualizacao de cliente.
- Botao de WhatsApp do cliente.
- Botao de link social do cliente.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Nome | texto | Sim | 2 a 160 caracteres |
| Telefone | texto | Nao | DDD + numero quando preenchido |
| Instagram | texto | Nao | ate 160 caracteres |
| Facebook | texto | Nao | ate 160 caracteres |
| TikTok | texto | Nao | ate 160 caracteres |
| Email | email | Nao | email valido quando preenchido |
| CPF/CNPJ | texto | Nao | CPF ou CNPJ valido quando preenchido |
| Endereco | texto | Nao | ate 200 caracteres |
| Numero | texto | Nao | ate 30 caracteres |
| Cidade | texto | Nao | ate 120 caracteres |
| Observacoes | textarea | Nao | ate 1000 caracteres |

## Integracao com API

- `CreateClienteRequest`, `UpdateClienteRequest` e `ClienteResponse` devem incluir `cidade`.
- A entidade `Cliente` deve persistir `Cidade`.

## Criterios de aceite

- Primeira linha do formulario mostra Nome e Telefone com botao de WhatsApp.
- Telefone ocupa uma largura compacta e Nome ocupa o restante.
- Informacoes complementares ficam em collapse fechado no novo cadastro.
- Collapse abre automaticamente na edicao/visualizacao quando ja houver dados complementares.
- Redes sociais possuem botao de acesso ao link quando preenchidas.
- Observacoes ficam fora do collapse.
- O cadastro de novo cliente aberto pelo fluxo de proposta usa os mesmos campos,
  layout e validacoes do cadastro direto na tela de clientes.
- Ao salvar cliente pelo fluxo de proposta, o cliente criado continua sendo
  selecionado automaticamente na proposta.
- No cadastro avulso de clientes, o botao principal continua "Salvar cliente".
- No cadastro de cliente dentro da proposta, o botao principal deve ser "Proximo".
- Nos passos da proposta, a navegacao deve ficar no rodape: voltar a esquerda e
  proximo/acao principal a direita.
- Os passos do formulario de proposta devem manter uma altura minima consistente
  para reduzir mudancas bruscas de layout entre etapas.
- A altura minima dos passos nao deve criar rolagem vertical desnecessaria em
  telas de notebook quando existir apenas espaco em branco no corpo do card.

## Testes

- Lint/build do web app.
- Build/test da API quando o ambiente permitir.
