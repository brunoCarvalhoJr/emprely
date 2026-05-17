# Analise - Ajustes Login Sem Redundancia

## Contexto

O usuario revisou a tela de login exclusiva e apontou problemas objetivos:

- figura animada nao representa a logomarca Emprely;
- logo aparece repetida;
- palavra `Orcamentos` aparece mais do que deveria;
- preview de proposta visual nao deve aparecer na pagina de login;
- pagina nao deve ter scroll, exceto se o formulario precisar;
- textos e tamanhos precisam ser refinados.

## Objetivo

Refatorar a pagina publica de login/cadastro para ser mais limpa, objetiva e alinhada à marca, usando o favicon/simbolo real da Emprely como elemento visual principal.

## Decisoes

- Remover ribbons/figura abstrata e usar o favicon SVG real da Emprely.
- Remover preview de proposta.
- Remover repeticoes de `Orcamentos` no conteudo da tela.
- Usar uma unica assinatura visual no painel de marca.
- Manter formulario, validacoes e mutations existentes.
- Travar o scroll da pagina publica em `100dvh`; se necessario, apenas o painel de formulario tera `overflow-y: auto`.

## Riscos

- Em telas muito pequenas, cadastro tem mais campos que login; por isso o scroll local do formulario e necessario.
- Remover excesso visual nao deve deixar a tela generica; o simbolo real da marca precisa ter destaque.

## Perguntas

Nao ha duvidas bloqueantes. Os ajustes solicitados sao diretos.
