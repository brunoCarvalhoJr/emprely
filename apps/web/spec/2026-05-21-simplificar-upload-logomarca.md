# Spec Web - Simplificar upload de logomarca

## Visao geral

Simplificar o layout do drag and drop de logomarca na pagina de configuracoes.

## Rotas

- Configuracoes da conta.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: quadrado mostra icone de upload.
- Erro: mensagem de erro do campo continua abaixo.
- Sucesso: preview aparece no quadrado.

## Componentes

- Bloco de upload de logomarca.
- Botao de limpeza/remocao com icone de lixeira.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| logoUrl | hidden | Nao | URL de upload valida ou vazio |
| arquivo | file | Nao | PNG, JPG/JPEG ou WebP ate 2 MB |

## Integracao com API

- Sem mudanca de contrato.
- O upload continua ocorrendo no salvamento do perfil quando existe arquivo pendente.

## Criterios de aceite

- Sem textos longos explicando rascunho.
- Sem "Logomarca salva no perfil".
- Sem "Arraste e solte ou selecione uma imagem".
- Tipos aceitos ficam abaixo do quadrado.
- Lixeira aparece acima do anexo, alinhada a direita.

## Testes

- Lint: `pnpm.cmd --dir apps/web lint`.
- Build: `pnpm.cmd --dir apps/web build`.
- Busca textual dos textos removidos.
