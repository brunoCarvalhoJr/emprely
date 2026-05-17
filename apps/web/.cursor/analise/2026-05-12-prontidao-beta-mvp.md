# Analise Web - Prontidao beta do MVP

## Contexto

O MVP ja possui os fluxos principais implementados e uma bateria de aceite da API. Ainda falta uma leitura operacional dentro do produto para saber se uma conta esta pronta para teste beta sem depender de checklist externo.

## Objetivo

Adicionar ao dashboard um resumo de prontidao beta baseado nos dados carregados da conta.

## Escopo

- Mostrar percentual de requisitos funcionais atendidos.
- Listar requisitos prontos e pendentes.
- Direcionar o usuario para o fluxo correto quando houver pendencia.

## Requisitos avaliados

- Perfil da conta configurado.
- Cliente e servico cadastrados.
- Proposta criada.
- Proposta ja avancada para fluxo comercial.
- Pelo menos um cliente com telefone valido para WhatsApp.
- Conta com acesso comercial ativo para gerar/enviar proposta.

## Fora do escopo

- Prints, imagens e polimento final de layout.
- Persistencia do checklist no backend.
- Checklist administrativo interno.
- Bloqueio de uso quando a prontidao nao estiver completa.

## Duvidas

- O criterio de beta pode ficar mais rigoroso depois que houver checkout real e deploy.
- O criterio de fluxo comercial pode exigir proposta aceita futuramente; no MVP, proposta gerada ou enviada ja indica que o fluxo foi usado.
