# Analise - Ajustes do template na nova proposta

## Contexto

Na etapa de template do fluxo de nova proposta, os cards ja permitem escolher diretamente o layout. O botao de preview desses cards abria o preview, mas tambem deixava a modal de selecao de template ativa por baixo. Ao fechar o preview, o usuario voltava para uma modal redundante.

## Objetivo

- Abrir o preview de template a partir dos cards sem abrir a modal de selecao.
- Dar mais espaco visual entre o texto explicativo da etapa e a grade de cards no desktop.
- Garantir que o template padrao configurado na personalizacao venha marcado em uma nova proposta quando os dados da conta carregarem.

## Regras

- Preservar a escolha por cards na tela da etapa 4.
- Manter a modal de selecao apenas para os pontos existentes que ainda dependem dela.
- Nao alterar exportacao, PDF, imagem ou WhatsApp.
- Nao sobrescrever template se o usuario ja iniciou edicao da proposta.

## Impactos

- Frontend: estado de modal/preview, sincronizacao do template inicial e CSS da etapa de template.
- Backend: sem impacto.

## Riscos

- Sincronizar o template padrao tarde demais pode sobrescrever uma escolha manual; por isso a atualizacao deve ocorrer apenas quando o formulario ainda nao estiver sujo.
