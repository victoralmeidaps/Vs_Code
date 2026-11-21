# METVI — Branding & Performance

Base operacional da METVI: posicionamento, ofertas, processo comercial, marketing e controle financeiro em um só lugar.

## Comece aqui

Abra [COMECE-AQUI.md](COMECE-AQUI.md) para a próxima ação do dia.

## Estrutura

| Pasta | Área | O que tem |
|---|---|---|
| [`01-marca/`](01-marca/) | Marca | Posicionamento, público ideal e mensagem central |
| [`02-comercial/`](02-comercial/) | Comercial | Ofertas, aceites, mensagens, chats por status e modelo de pipeline |
| [`03-marketing/`](03-marketing/) | Marketing | Landing page e peças de divulgação |
| [`04-financeiro/`](04-financeiro/) | Financeiro | Plano de caixa, agenda e modelos de controle |
| [`05-entrega/`](05-entrega/) | Entrega | Processo do Pix ao encerramento e modelos de onboarding, briefing, cronograma, relatório e encerramento |
| [`docs/`](docs/) | Operação interna | Guias de ferramentas e padrões do repositório |
| `dados/` | Dados reais | Planilhas preenchidas (leads, caixa) e pastas de clientes ativos. Fica só na sua máquina, fora do Git |

## Regras da casa

1. **Dado real não entra no Git.** Leads, contatos, valores e contas ficam em `dados/`. No repositório só sobem modelos vazios.
2. **Um arquivo, um lugar.** Nada de cópia duplicada; se precisar referenciar, use link.
3. **Nomes em minúsculas com hífen** (`oferta-sprint-conversao.md`). Exceção: planilhas de controle em `MAIÚSCULAS.csv`.
4. **Nada externo sai sem aprovação do Victor**: mensagens, propostas, pagamentos e publicações.

## Planilhas de controle

Para começar uma planilha nova, copie o modelo para `dados/`:

```bash
cp 02-comercial/modelos/PIPELINE-PROSPECCAO.csv dados/
cp 04-financeiro/modelos/*.csv dados/
```

## Ferramentas

- `npm install` instala o lint de Markdown e o hook de pré-commit.
- `npm run lint:md` verifica os documentos; `npm run lint:md:fix` corrige o que for automático.
- Detalhes em [docs/como-ativar-o-lint.md](docs/como-ativar-o-lint.md).
