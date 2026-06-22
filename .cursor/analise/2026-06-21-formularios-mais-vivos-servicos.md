# Análise - Formulários de serviços mais vivos e padronizados

## Contexto

No detalhe de serviço/pacote, o nome aparece apenas como texto maior. A tela
fica funcional, mas pouco orientada visualmente: não destaca bem a entidade, não
usa ícones para leitura rápida e os metadados parecem campos soltos.

## Decisão

Criar um padrão visual reutilizável para formulários/detalhes:

- cabeçalho com ícone de domínio e gradiente sutil;
- nome da entidade destacado em bloco próprio;
- metadados em cards com ícones;
- descrição como bloco editorial leve;
- formulário de criação/edição com cabeçalho mais rico e primeiro campo
  destacado como informação principal.

## Critérios de aceite

- No detalhe de serviço, o nome é o elemento principal da tela e aparece com
  ícone/realce, não apenas fonte maior.
- Categoria, tipo, valor e unidade aparecem em cards com ícones.
- O formulário de novo/editar serviço usa o mesmo padrão visual base.
- A mudança não altera contrato de API nem regras de negócio.
