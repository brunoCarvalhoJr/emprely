# Analise - Troca senha usuario MVP

## Contexto

Depois de melhorar a sessao, o proximo requisito minimo de seguranca para beta e permitir que o usuario autenticado altere a propria senha. Recuperacao por email ainda exige infraestrutura transacional, entao nao entra nesta rodada.

## Objetivo

Adicionar troca de senha autenticada, com senha atual, nova senha e confirmacao, cobrindo API, web, testes e documentacao.

## Projetos impactados

- API: novo endpoint autenticado.
- Web: formulario simples na area Conta.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: documentar limite do MVP.

## Fluxo atual

- Usuario pode cadastrar e logar.
- Nao existe troca de senha no produto.
- Se esquecer a senha, nao ha fluxo automatizado.

## Fluxo proposto

1. Usuario logado acessa Conta.
2. Informa senha atual, nova senha e confirmacao.
3. API valida usuario atual e troca senha via ASP.NET Identity.
4. Web limpa o formulario e mostra mensagem de sucesso.
5. Login com senha antiga passa a falhar, login com senha nova passa.

## Regras de negocio

- Somente usuario autenticado pode trocar a propria senha.
- Senha atual e obrigatoria.
- Nova senha precisa seguir a politica atual do Identity.
- Confirmacao deve ser igual a nova senha.
- Recuperacao por email fica fora do MVP ate existir envio transacional.

## Impactos tecnicos

- Criar contrato `ChangeSenhaUsuarioRequest`.
- Adicionar `PUT /api/me/password`.
- Adicionar chamada no cliente web.
- Adicionar formulario na area Conta.
- Ampliar testes de integracao e E2E mockado.

## Riscos

- Mensagens do Identity podem vir em ingles; manter retorno padrao de validacao por enquanto.
- Troca de senha nao invalida JWTs ja emitidos nesta rodada.

## Duvidas

- Sem duvidas bloqueantes. Assumo que invalidacao global de tokens e recuperacao por email ficam para pos-MVP.
