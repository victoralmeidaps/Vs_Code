# AGENTS

Instruções para agentes de IA neste repositório.

## Contexto

- Este repositório é a base operacional da METVI (agência de branding e performance).
- O conteúdo é documento de negócio (Markdown, CSV, HTML), não software.
- Mapa das pastas: [README.md](README.md). Rotina diária: [COMECE-AQUI.md](COMECE-AQUI.md).

## Regras obrigatórias

- **Nunca** versionar dados reais (leads, contatos, valores, contas). Eles ficam em `dados/`, que está no `.gitignore`. No Git só entram modelos com o cabeçalho.
- **Nunca** enviar mensagem, proposta, cobrança ou publicação em nome do Victor. Prepare o rascunho e entregue para aprovação.
- Não inventar números, prazos, preços ou resultados. Se faltar dado, deixe em branco e sinalize.
- Não duplicar arquivos: referencie com link relativo.
- Material de cliente preenchido vai para `dados/clientes/<nome>/`, nunca para `05-entrega/modelos/`.

## Padrões

- Arquivo novo vai para a pasta da área (`01-marca`, `02-comercial`, `03-marketing`, `04-financeiro`, `05-entrega`, `docs`).
- Nomes em minúsculas com hífen; planilhas de controle em `MAIÚSCULAS.csv`.
- Ao mover ou renomear arquivo, use `git mv` e atualize todos os links que apontam para ele.
- Texto em português do Brasil, direto e orientado a ação.

## Antes de concluir

- `npm run lint:md` sem erros.
- Nenhum link quebrado para arquivo movido.
- `git status` sem nada de `dados/`.
