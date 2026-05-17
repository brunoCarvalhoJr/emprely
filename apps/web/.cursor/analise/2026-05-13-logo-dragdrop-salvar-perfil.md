# Analise Web - Logo drag-and-drop com salvamento explicito

## Contexto

O upload de logomarca atual usa um botao de anexo e chama a API assim que o arquivo e escolhido. Isso preenche `logoUrl` e atualiza cache/form antes do usuario confirmar o formulario.

## Fluxo afetado

- Tela `Configuracoes`.
- Formulario de perfil profissional e marca.
- Estado local de arquivo, preview e mensagens.
- Chamada `uploadLogoPerfilConta`.

## Decisoes

- Trocar o botao isolado por uma area drag-and-drop clicavel.
- Guardar `File` em estado local e gerar preview por `URL.createObjectURL`.
- Registrar `logoUrl` como campo oculto do formulario, atualizando-o somente quando o submit receber a URL do upload.
- Mostrar nome, tamanho e status da imagem pendente.
- Manter extracao de cores a partir do arquivo local, mas sem atribuir logo no modal de sugestao.
- Exibir acao de limpar quando houver logo salva, preview local ou limpeza pendente.
- A limpeza deve limpar arquivo pendente, preview e `logoUrl`, marcando o formulario como alterado.

## Duvidas

- Sem bloqueio. A remocao de imagem existente nao faz parte deste pedido.

## Riscos

- Drag-and-drop deve continuar acessivel por clique no input file.
- Preview local precisa ser revogado quando trocado ou limpo.
- A acao de limpar deve ser reversivel antes de salvar ao escolher uma nova imagem ou recarregar o perfil.
