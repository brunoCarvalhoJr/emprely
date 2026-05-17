# Analise API - Bateria de aceite do MVP

## Contexto

As principais features do MVP ja foram implementadas, mas o projeto de testes de integracao ainda possui apenas um teste placeholder. Isso deixa o fluxo ponta a ponta da API sem protecao automatizada.

## Objetivo

Criar uma bateria inicial de aceite automatizado para validar o fluxo funcional do MVP sem depender de prints, imagens ou ajuste visual.

## Fluxos cobertos

- Cadastro de usuario e conta.
- Consulta autenticada de sessao/conta.
- Cadastro de cliente com telefone valido.
- Rejeicao de cliente com telefone WhatsApp invalido.
- Cadastro de servico.
- Criacao de proposta.
- Geracao, envio e aceite de proposta.
- Duplicacao de proposta gerando novo rascunho numerado.
- Bloqueio comercial quando o trial estiver expirado.

## Escopo fora desta etapa

- Teste visual do web.
- Teste de impressao/PDF/imagem.
- Teste real de WhatsApp.
- Teste com PostgreSQL real.

## Duvidas

- Testes E2E com navegador devem entrar depois, quando o layout e os prints forem estabilizados.
- Testes com banco PostgreSQL em container podem entrar antes do deploy, mas para esta etapa o objetivo e feedback rapido no `dotnet test`.

## Riscos

- Teste acoplado demais aos dados de UI.
- Teste depender de servidor local ou banco externo.

## Decisao

Usar `WebApplicationFactory<Program>` com banco em memoria isolado por teste, mantendo a API real e sem abrir portas locais.
