# Importar negócios para o HubSpot

Modelo: [`IMPORTACAO-HUBSPOT.csv`](../modelos/IMPORTACAO-HUBSPOT.csv). Os cabeçalhos usam os nomes das propriedades do HubSpot, então o importador faz o mapeamento sozinho.

## Como usar

1. Copie o modelo para `dados/` (o arquivo preenchido nunca vai para o Git):

   ```bash
   cp 02-comercial/modelos/IMPORTACAO-HUBSPOT.csv dados/
   ```

2. Preencha uma linha por negócio, separando por vírgula. Valor com vírgula vai entre aspas.
3. No HubSpot: **Importar → Arquivo do computador → Um arquivo → Vários objetos → Negócios e Contatos (e Empresas, se houver)**.
4. Confira o mapeamento e importe.

## Colunas

| Coluna | Obrigatória | Como preencher | Origem no pipeline antigo |
|---|---|---|---|
| Deal Name | Sim | `Empresa — Oferta` (ex.: `Padaria Sol — Essentials 12m`) | `nome_empresa` + `oferta` |
| Pipeline | Sim | `METVI \| Vendas Consultivas` | — |
| Deal Stage | Sim | Nome exato da etapa do funil | `etapa` (tabela abaixo) |
| Amount | Sim, a partir de Proposta | Valor total do contrato (mensalidade × meses + implantação) | `ticket_proposto` |
| Close Date | Sim | Data prevista do Pix, `AAAA-MM-DD` | `data_proximo_passo` |
| METVI \| Oferta Comercial | Sim | Essentials, Sprint de Conversão ou Reativação Express | `oferta` |
| METVI \| Tipo de Receita | Sim | Mensalidade, Setup + Recorrência ou Projeto Avulso | — |
| METVI \| Prazo do contrato | Essentials | 3 meses, 6 meses, 12 meses ou Acima de 12 | — |
| METVI \| Tipo de pessoa | Sim | CNPJ ou CPF | — |
| METVI \| Verba de mídia mensal | Essentials | Número, sem "R$" (mínimo 1000) | — |
| Deal Type | Sim | New Business ou Existing Business | — |
| Next step | Sim | Próxima ação concreta, com data | `proximo_passo` |
| Closed Lost Reason | Se perdido | Motivo real | `motivo_perda` |
| First Name / Last Name | Sim | Decisor | `decisor` |
| Email | Recomendado | E-mail do decisor (chave para não duplicar contato) | `contato` |
| Phone Number | Recomendado | Com DDI e DDD: `+55 11 99999-9999` | `contato` |
| Company Name | Sim | Nome da empresa | `nome_empresa` |
| Website URL | Recomendado | Site ou Instagram | — |
| Lead Status | Sim | Novo, Tentando contato, Conectado, Qualificado ou Desqualificado | `respondeu` |

As colunas Prazo do contrato, Tipo de pessoa e Verba de mídia só são importadas depois de criadas as propriedades (ver [funil-hubspot.md](funil-hubspot.md#ajustes-manuais-nas-configurações)). Até lá, deixe em branco.

## Etapas: pipeline antigo → HubSpot

| Etapa no CSV antigo | Etapa no HubSpot |
|---|---|
| Lista | Não vira negócio: só contato com Lead Status "Novo" |
| Contato | Não vira negócio: contato com Lead Status "Tentando contato" |
| Qualificado | Qualificação |
| Oportunidade | Diagnóstico ou Proposta Enviada |
| Fechado pago | Fechado - Ganho |
| Entregue | Fechado - Ganho (e entra no funil de Entrega) |

## Regras

- Só importar negócio com **decisor e próximo passo** definidos.
- **Amount** nunca é estimativa de interesse: é o valor do contrato proposto.
- Fechado - Ganho só com Pix creditado e identificado.
- Não importar CPF, dados bancários ou conversas.
