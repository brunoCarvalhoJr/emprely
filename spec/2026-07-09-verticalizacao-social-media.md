# Spec - Verticalizacao social media

## Visao geral

Verticalizar a experiencia do Emprely para social media, creators, trafego pago e agencias pequenas, tornando o app mais personalizado para o publico principal sem alterar contratos de API nesta etapa.

## Escopo

Inclui:

- Ajustar copy do dashboard e do wizard.
- Renomear templates visuais para ofertas do nicho.
- Adicionar presets editaveis de servicos/pacotes.
- Orientar cadastro de cliente como briefing simples.
- Atualizar a matriz de testes dos templates.

Fora do escopo:

- Criar tabelas/campos novos no banco.
- Alterar contratos de API.
- Criar templates visuais completamente novos do zero.
- Automatizar preenchimento por IA.

## Fluxo ponta a ponta

1. Usuario entra no dashboard e ve linguagem de propostas, conteudo e follow-up.
2. Usuario cria servico a partir de um preset como Social media mensal, Reels/UGC ou Trafego pago.
3. Usuario cadastra cliente com canais sociais e observacoes guiadas para briefing.
4. Usuario cria proposta com etapa de entregaveis e templates nomeados por oferta.
5. Preview/PDF usa o template tecnico existente, mas o label e contexto ficam alinhados ao nicho.

## Requisitos

- Presets devem preencher nome, categoria, preco, unidade, tipo e descricao.
- Templates devem manter os mesmos `value` para compatibilidade.
- Campos atuais devem continuar opcionais quando ja eram opcionais.
- Mobile deve herdar as melhorias sem layout novo complexo.

## Regras de negocio

- Os templates ativos devem refletir ofertas vendidas por social media e agencias digitais.
- Verba de midia, deslocamentos, direitos de uso e revisoes devem aparecer como sugestoes claras de escopo.
- O usuario deve poder editar qualquer valor sugerido.

## Impactos por projeto

- API: nenhum.
- Web: `apps/web/src/App.tsx`.
- Mobile: responsividade do app web.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- Dashboard e menu deixam de soar genericos para o publico social media.
- Formulario de servico exibe presets de pacotes do nicho.
- Cadastro de cliente orienta canais sociais e briefing.
- Templates exibidos na galeria incluem Social media mensal, Reels/UGC, Trafego pago, Midia kit/rate card e Calendario editorial.
- Build web passa.

## Estrategia de implementacao

- Editar labels/detalhes dos templates mantendo `value`.
- Criar constante local de presets de servico.
- Adicionar botoes/chips de preset no formulario de servico.
- Ajustar helper texts/placeholders do cliente e proposta.
- Atualizar rotina 82.

## Testes

- `pnpm build:web`.
- Smoke manual/Playwright das telas principais quando necessario.
