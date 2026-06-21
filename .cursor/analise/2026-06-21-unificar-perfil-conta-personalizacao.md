# Analise - Unificacao de Perfil da Conta, Configuracoes e Personalizacao

## Contexto

O dashboard orienta o usuario a concluir o passo "Perfil da conta", mas os campos que tornam esse passo completo estao distribuidos entre dois menus: `Configuracoes` e `Personalizacao`. Isso cria uma quebra de expectativa: o usuario entra em "Editar perfil", preenche dados cadastrais, mas ainda pode faltar template, cores ou formato preferido, que hoje ficam em outra area.

Pelo codigo atual, o passo de perfil da conta so e considerado completo quando existem:

- nome comercial;
- telefone de contato;
- e-mail de contato;
- segmento;
- template visual padrao;
- cor primaria;
- cor secundaria;
- formato de arquivo preferido.

Cidade/UF, documento, site, Instagram e logo sao importantes para qualidade do material, mas nao sao obrigatorios para a conclusao tecnica do passo.

## Problemas encontrados

1. A separacao entre `Configuracoes` e `Personalizacao` nao acompanha a tarefa mental do usuario. Para concluir o perfil, ele precisa de campos que estao em ambas as telas.
2. O menu de conta tem duas entradas parecidas e pouco claras para um usuario em onboarding.
3. O tour inicial explica "conta e personalizacao" como uma area dupla, mas depois desloca o usuario para duas telas diferentes.
4. O CTA "Editar perfil" no dashboard nao deixa evidente que tambem e necessario escolher template, cores e formato de proposta.
5. A area de seguranca de acesso esta misturada com dados comerciais, mas e uma configuracao operacional distinta.

## Decisao de produto

Substituir a exposicao publica de `Configuracoes` e `Personalizacao` por uma unica area chamada `Perfil da conta`.

Essa area deve concentrar:

- identidade do negocio;
- contato comercial;
- marca visual;
- tema do sistema;
- cores e formato dos templates;
- template padrao de propostas;
- seguranca de acesso em bloco separado.

O estado interno legado `personalizacao` pode ser preservado somente para compatibilidade tecnica, mas nao deve aparecer como menu independente. Qualquer navegacao para `personalizacao` deve ser normalizada para `conta`.

## Organizacao proposta

1. `Perfil da conta`
   - card de orientacao: explica o que falta para concluir o passo;
   - `Identificacao`: nome comercial, segmento, cidade/UF, responsavel, CPF/CNPJ;
   - `Contato comercial`: e-mail, telefone/WhatsApp, site, Instagram;
   - `Marca`: upload/remocao da logomarca;
   - `Aparencia do sistema`: tema claro/escuro;
   - `Preferencias dos orcamentos`: formato de envio, cores dos templates e template padrao;
   - `Seguranca de acesso`: troca de e-mail de acesso.

2. Menu lateral e drawer mobile
   - remover a entrada `Personalizacao`;
   - renomear `Configuracoes` para `Perfil da conta`;
   - manter o logout separado.

3. Tour inicial
   - explicar primeiro os menus;
   - depois orientar o usuario a configurar perfil, marca, template, cores e formato dentro da mesma area.

## Fora de escopo

- Alterar contratos da API.
- Alterar schema de banco.
- Criar uma biblioteca de UI nova.
- Mudar regras de obrigatoriedade no backend.
- Remover o recurso de preview de template.

## Riscos

- O formulario de perfil e o formulario de personalizacao compartilham o mesmo `react-hook-form`. A refatoracao deve preservar o estado e os salvamentos existentes.
- Testes E2E podem depender de `data-testid` ou labels antigos. A mudanca deve ser feita mantendo alvos importantes e normalizando a view antiga.
- A area unificada pode ficar longa. Em desktop, a solucao deve usar blocos escaneaveis; em mobile, os blocos devem empilhar sem overflow horizontal.

## Criterios de aceite

- O usuario consegue concluir o passo de perfil em uma unica pagina.
- O menu lateral e o drawer mobile exibem apenas `Perfil da conta`, sem `Configuracoes` e `Personalizacao` separados.
- O dashboard deixa claro que o perfil inclui contato, marca, cores, formato e template.
- O tour inicial nao leva mais o usuario para uma pagina separada de personalizacao.
- A tela funciona em desktop e mobile sem corte de conteudo, overflow horizontal ou perda das acoes de salvar.
