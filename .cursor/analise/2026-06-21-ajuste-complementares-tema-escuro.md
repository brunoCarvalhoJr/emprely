# Analise - Informacoes complementares no tema escuro

## Contexto

No cadastro/edicao de cliente em mobile, o bloco "Informacoes complementares" ficava com fundo cinza claro no tema escuro. O resultado visual era inconsistente: painel claro, inputs escuros e botoes sociais com contraste ruim.

## Diagnostico

O bloco usava utilitarios `bg-slate-50/70` sem uma regra especifica para o componente. A regra global do tema escuro nao cobria a variante com opacidade e o painel herdava um cinza lavado.

## Decisao

Criar a classe `client-complementary-panel` nos dois usos do componente e aplicar tema escuro dedicado:

- fundo escuro translúcido;
- borda coerente com o restante do app;
- header escuro com texto claro;
- inputs escuros com placeholder legivel;
- botoes/links sociais alinhados ao dark theme.

