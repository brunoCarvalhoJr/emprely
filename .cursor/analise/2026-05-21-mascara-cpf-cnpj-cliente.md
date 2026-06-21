# Analise - Mascara inteligente de CPF/CNPJ no cliente

## Ideia

Trocar o campo `Documento` do cadastro de cliente para `CPF/CNPJ` com mascara inteligente.

## Contexto

O cadastro de cliente tinha um campo livre `Documento`. O pedido e iniciar com mascara de CPF e, quando o preenchimento indicar CNPJ, trocar automaticamente para a mascara de CNPJ.

## Referencia

A Receita Federal usa os formatos `000.000.000-00` para CPF e `00.000.000/0000-00` para CNPJ em seus formularios.

## Decisao

- Manter o campo da API como `documento`.
- Alterar apenas o rotulo e a experiencia do app web.
- Aceitar somente digitos digitados e aplicar mascara no `onChange`.
- Usar CPF enquanto houver ate 11 digitos.
- Usar CNPJ quando houver mais de 11 digitos, limitado a 14.
- Validar campo vazio, CPF com 11 digitos ou CNPJ com 14 digitos.

## Duvidas

Nao ha duvidas bloqueantes.
