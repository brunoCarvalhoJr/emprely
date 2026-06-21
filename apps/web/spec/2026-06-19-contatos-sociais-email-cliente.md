# Spec Web - Contatos sociais e e-mail do cliente

## Visão geral

Adicionar botoes especificos para redes sociais e e-mail nos dados complementares do cliente. O comportamento deve funcionar em desktop e mobile usando links externos padrao do navegador/sistema.

## Rotas

- Fluxo de nova proposta.
- Cadastro/edicao rapida de cliente reutilizando `ClienteFormularioCampos`.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: botao social/e-mail fica desabilitado quando o campo esta vazio ou invalido.
- Erro: validacao existente do formulario continua exibindo mensagem do campo.
- Sucesso: clicar abre nova aba/app correspondente.

## Componentes

- `ClienteFormularioCampos`: recebe nome da marca e URL da logo para assinatura.
- `LinkSocialClienteButton`: passa a renderizar icone por rede.
- `EmailClienteButton`: abre `mailto:` com destinatario preenchido.

## Formulários

| Campo | Tipo | Obrigatório | Validação |
| --- | --- | --- | --- |
| Instagram | texto | Nao | maximo existente |
| Facebook | texto | Nao | maximo existente |
| TikTok | texto | Nao | maximo existente |
| E-mail | email | Nao | formato de e-mail existente |

## Integração com API

- Nenhuma nova chamada.
- Reutiliza perfil da conta ja carregado no app.

## Critérios de aceite

- Instagram, Facebook e TikTok exibem icones referentes a cada rede.
- O campo E-mail possui botao igual aos demais.
- Clicar no botao de e-mail abre o cliente de e-mail padrao com destinatario preenchido.
- O corpo do e-mail termina com assinatura contendo nome da empresa e URL da logo quando existir.
- Botoes sem dados validos ficam desabilitados.

## Testes

- Lint: `npm.cmd run lint` em `apps/web`.
- Build: `npm.cmd run build` em `apps/web`.
- Cenários manuais: preencher redes sociais e e-mail no fluxo de cliente, clicar nos botoes e confirmar URLs/`mailto:`.
