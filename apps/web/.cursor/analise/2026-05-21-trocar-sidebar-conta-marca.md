# Analise - Trocar conta e marca no menu lateral

## Componente afetado

`src/App.tsx` e `src/styles.css`.

## Contexto tecnico

O sidebar e renderizado inline no shell autenticado. A marca fica no bloco `sidebar-product-brand`; o menu da conta fica no bloco `sidebar-account` com dropdown absoluto.

## Decisao

Reposicionar os blocos no JSX e ajustar CSS do dropdown para abrir para baixo quando a conta estiver no topo. O bloco da marca passa a usar uma variante de rodape no sidebar.
