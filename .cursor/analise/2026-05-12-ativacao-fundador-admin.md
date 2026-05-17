# Analise - Ativacao Fundador Admin

## Contexto

O MVP ja possui trial, bloqueio comercial e Plano Fundador, mas a ativacao manual estava exposta para qualquer usuario autenticado em `POST /api/account/activate-founder`. Para beta, isso permite autoativacao sem controle operacional.

## Objetivo

Transformar a ativacao do Plano Fundador em uma operacao administrativa protegida por chave de operacoes, removendo o autoatendimento do web ate existir billing real.

## Projetos impactados

- API: bloquear autoativacao e criar endpoint admin.
- Web: remover chamadas de autoativacao e ajustar texto funcional.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: documentar variavel administrativa.

## Fluxo atual

1. Usuario loga no web.
2. Web exibe botoes de ativar Fundador.
3. Usuario chama `POST /api/account/activate-founder`.
4. A propria conta vira Fundador.

## Fluxo proposto

1. Usuario ve status de Trial/Fundador no web.
2. Se precisar ativar Fundador, a ativacao e tratada fora do web do cliente.
3. Operador interno chama `POST /api/admin/accounts/{contaId}/activate-founder`.
4. API exige header `X-Emprely-Admin-Key`.
5. Conta e ativada como Fundador e retorna resumo administrativo.

## Regras de negocio

- Usuario comum nao pode autoativar Plano Fundador.
- Sem billing real, ativacao Fundador e manual e administrativa.
- Endpoint admin nao deve depender de microservico ou painel separado no MVP.
- Nao versionar chave administrativa real.

## Impactos tecnicos

- Criar configuracao `AdminOperacoes:OperationsKey`.
- Preservar `POST /api/account/activate-founder` como rota bloqueada para evitar autoativacao acidental.
- Atualizar testes de integracao cobrindo chave ausente e chave valida.
- Remover chamada do web para rota de autoativacao.

## Riscos

- Sem `AdminOperacoes:OperationsKey`, endpoint admin deve retornar erro operacional claro.
- Uma chave administrativa fraca colocaria ativacoes em risco.

## Duvidas

- Sem duvidas bloqueantes. Assumo que o operador beta tera acesso ao `contaId` pelo banco/logs/API de suporte ate existir painel interno.
