# Ativação do lint de Markdown

Tudo já está configurado neste repositório. Este arquivo existe para o caso de
você clonar o repo em outra máquina — ou esquecer o que foi feito.

## Em um clone novo, rode uma vez

```bash
npm install
```

O `prepare: husky` no `package.json` ativa o hook automaticamente.

## As três camadas

| Camada | Quando | O que faz |
| --- | --- | --- |
| VS Code | ao salvar | Prettier formata, markdownlint corrige lint |
| `.husky/pre-commit` | no `git commit` | barra segredos, corrige Markdown |
| GitHub Action | no push e toda segunda 9h | corrige e commita de volta |

A Action roda em servidor do GitHub — não depende deste Mac estar ligado.

## O hook de pre-commit

Gerenciado pelo husky. Chama o markdownlint direto, sem lint-staged.

**Corrige Markdown** — roda `markdownlint-cli2 --fix` só nos `.md` staged e
   re-staga o que corrigiu. Se sobrar violação não auto-fixável (por exemplo
   `MD040`, code fence sem linguagem), o commit é bloqueado.

Bypass de emergência: `git commit --no-verify`.

## Comandos manuais

```bash
npx markdownlint-cli2 "**/*.md" "#node_modules"          # só reporta
npx markdownlint-cli2 --fix "**/*.md" "#node_modules"    # corrige
```

## Regras

Ligadas: MD034 (URL/e-mail nu), MD040 (linguagem no code fence), MD012, MD047,
MD009, MD022, MD031, MD032, MD051.

Desligadas de propósito, cada uma medida no corpus real (659 arquivos):

| Regra | Ocorrências | Por que está desligada |
| --- | --- | --- |
| MD013 | 2954 | comprimento de linha — reflow gera diff gigante, zero ganho |
| MD060 | 197 | alinhamento de pipe de tabela — puramente cosmético |
| MD033 | 172 | HTML inline — `<br>`, `<details>` são necessários |
| MD036 | 84 | negrito como subtítulo é o estilo da casa, e **não é auto-corrigível** |
| MD041 | 55 | nem todo `.md` começa com H1 |
| MD025 | 26 | múltiplos H1 são normais em docs de skill |

Com essa calibragem, 3793 violações se corrigem sozinhas e só 10 exigem sua
mão — todas MD040, code fence sem linguagem.

Para silenciar uma regra num trecho:

```markdown
<!-- markdownlint-disable-next-line MD034 -->
https://exemplo.com
```

Referência: <https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md>
