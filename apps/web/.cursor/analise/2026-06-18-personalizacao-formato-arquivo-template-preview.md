# Analise - Personalizacao de formato de arquivo e preview por card

## Contexto

A pagina de personalizacao ja permite escolher cores e template padrao dos orcamentos. O envio com anexo usa um arquivo gerado automaticamente, mas ainda nao respeita uma preferencia configurada pelo usuario. Alem disso, o preview real do template fica em um botao no topo, enquanto os cards de template representam a escolha do template.

## Objetivo

- Permitir configurar o formato preferido de arquivo para envio: PDF ou imagem.
- Usar esse formato preferido no card "Mensagem inicial + anexo" da modal de envio.
- Adicionar botao de preview em cada card de template.
- Fazer clique no card selecionar o template, e clique no preview apenas abrir a visualizacao.
- Remover o botao superior "Ver preview real".

## Regras

- A preferencia deve ser salva no perfil da conta.
- PDF continua sendo o padrao para contas existentes.
- O envio com anexo deve gerar PDF ou imagem conforme a preferencia.
- Downloads diretos de PDF e imagem continuam existindo como acoes separadas.
- O card de template deve continuar selecionavel em desktop e mobile.

## Impactos

- Web: formulario de personalizacao, cards de template e modal de envio.
- API: contrato e persistencia do perfil da conta.

## Riscos

- O compartilhamento nativo de arquivo em mobile varia por navegador; o fallback deve continuar baixando o arquivo e abrindo o WhatsApp.
