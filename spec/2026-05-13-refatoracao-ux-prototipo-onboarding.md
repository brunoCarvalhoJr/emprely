# Spec - Refatoracao UX do SaaS pelo prototipo

## Visao geral

Refatorar o SaaS Emprely para ficar mais proximo do prototipo enviado, com foco em rapidez para criar orcamento, clareza nas listagens e configuracao simples da marca do usuario.

## Escopo

Inclui:

- Esconder primeiros passos quando todos estiverem concluidos.
- Substituir "MVP funcional" por tarja Trial apenas para plano Trial.
- Refatorar layout visual para se aproximar do prototipo.
- Adicionar paginacao e tamanho de pagina em clientes, servicos e propostas.
- Ajustar comportamento pos-cadastro/pos-edicao.
- Adicionar upload de logo com sugestao de cores.
- Header com marca do negocio e Emprely secundaria.
- Rodape com direitos e suporte.

Fora do escopo:

- Checkout/pagamento real.
- Storage externo de arquivos.
- Multiusuario avancado.
- Reescrever backend de propostas.

## Fluxo ponta a ponta

1. Usuario entra no dashboard.
2. Se ainda faltam primeiros passos, ve checklist acionavel.
3. Se concluiu tudo, checklist desaparece.
4. Se esta em Trial, ve tarja de marca d'agua e chamada para contratar.
5. Usuario cria cliente/servico/proposta por CTAs acima das listagens.
6. Listagens suportam busca, filtros, pagina e tamanho de pagina.
7. Usuario anexa logo em Conta, recebe sugestao de cores e aplica no perfil.
8. Header usa logo/nome do negocio quando disponivel.

## Requisitos

- Preservar React/Vite, Tailwind e lucide-react.
- Preservar contratos existentes exceto limite de `LogoUrl`.
- Reduzir logo no frontend antes de salvar.
- Manter labels de formulario e botoes usados pelos testes.
- Respeitar responsividade mobile/desktop.

## Regras de negocio

- Trial mostra incentivo de upgrade e informa marca d'agua.
- Fundador nao mostra tarja de trial.
- Cadastro novo mantem formulario pronto para novo registro.
- Edicao concluida limpa selecao e retorna visualmente para listagem.

## Impactos por projeto

- API: aumentar limite de `LogoUrl` e gerar migration.
- Web: refatorar `App.tsx` e `styles.css`.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- Primeiros passos somem quando 100% concluidos.
- Dashboard nao mostra "MVP funcional".
- Trial mostra tarja comercial apropriada.
- Clientes, servicos e propostas tem paginacao e seletor de tamanho.
- Upload de logo abre modal com cores sugeridas e aplica no perfil.
- Header exibe marca do usuario quando configurada.
- Rodape aparece no app.
- Build e testes passam.

## Estrategia de implementacao

- Fazer mudancas incrementais mantendo estado atual.
- Criar helper de paginacao local.
- Criar helper de extracao de cores em canvas.
- Ajustar CSS para o visual do prototipo com sidebar clara e cards arredondados.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`
