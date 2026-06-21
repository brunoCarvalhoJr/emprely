# Spec - Mascara de telefone do sistema

## Visao geral

Adicionar mascara reutilizavel para os campos de telefone do sistema, aceitando apenas numeros como entrada e exibindo o padrao `(XX) XXXXX-XXXX`.

## Escopo

Inclui:

- Campo telefone no cadastro.
- Campo telefone no cadastro/edicao de clientes.
- Campo telefone no cliente rapido da proposta.
- Campo telefone nas configuracoes da conta.
- Normalizacao visual de telefones vindos da API ao abrir formularios.

Fora do escopo:

- Migracao de dados existentes no banco.
- Alteracao de contratos da API.
- Suporte internacional de telefone.

## Fluxo ponta a ponta

1. Usuario foca em um campo de telefone.
2. Usuario digita ou cola qualquer texto.
3. Frontend remove caracteres nao numericos, limita o telefone nacional e aplica a mascara.
4. Ao salvar, o payload segue com o valor mascarado valido.
5. Links de WhatsApp continuam usando o numero normalizado internamente.

## Requisitos

- O input deve aceitar apenas digitos como fonte de dados.
- A mascara final deve ser `(XX) XXXXX-XXXX`.
- Campos opcionais podem ficar vazios.
- Campos preenchidos devem ter DDD e numero completo.

## Regras de negocio

- Cadastro de usuario exige telefone valido.
- Cliente/configuracoes exigem telefone valido apenas quando preenchido.

## Impactos por projeto

- API: sem alteracao.
- Web: `apps/web/src/App.tsx`.
- Mobile: sem alteracao.
- Landing: sem alteracao.
- Packages: sem alteracao.
- Infra: sem alteracao.

## Criterios de aceite

- Digitar letras ou simbolos no telefone nao persiste esses caracteres no campo.
- Colar `+55 (11) 99999-9999` resulta em `(11) 99999-9999`.
- Cadastro, cliente, cliente rapido e configuracoes usam a mesma mascara.
- Telefone incompleto exibe erro objetivo.
- Lint e build do web passam.

## Estrategia de implementacao

- Criar helpers de extracao, formatacao e validacao de telefone nacional.
- Criar helper de props para campo de telefone com `onChange` mascarado.
- Aplicar o helper nos campos existentes e nos mapeamentos de formulario.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- Verificacao textual das ocorrencias de telefone no `App.tsx`.
