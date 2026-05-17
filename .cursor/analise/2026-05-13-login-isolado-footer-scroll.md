# Analise - Login isolado e footer com scroll

## Contexto

O usuario pediu tres correcoes:

- O footer nao deve ficar fixo como sidebar e topbar.
- O botao de suporte WhatsApp deve usar icone do WhatsApp.
- A tela de login deve ser isolada, com box flutuante central inspirado no anexo.

## Diagnostico

- O footer estava como filho direto do grid autenticado, em uma linha propria, ficando sempre visivel enquanto o conteudo central rolava.
- O suporte usava `MessageCircle` do Lucide, que nao representa explicitamente o WhatsApp.
- A tela publica atual usava um layout em duas colunas com card de marca, mais parecido com landing do que login isolado.

## Decisoes

- Mover o footer para dentro de `.app-content`, para rolar junto com a pagina.
- Criar um icone SVG local `WhatsAppIcon`, ja que `lucide-react` nao possui o icone oficial.
- Remover header publico e deixar a tela publica como area centralizada de autenticacao.
- Manter cadastro/login no mesmo box com controle segmentado.

## Fora de escopo

- Alterar endpoints ou validacoes de autenticacao.
- Criar rotas separadas no React Router.
