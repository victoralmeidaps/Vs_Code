# Comercial no HubSpot — funil, catálogo e pendências

Diagnóstico da conta HubSpot da METVI feito em 21/11/2026, só com leitura. As mudanças que dependem das configurações do HubSpot estão em [Ajustes manuais](#ajustes-manuais-nas-configurações).

## 1. O que existe hoje

### Funil "METVI | Vendas Consultivas"

| Etapa | Probabilidade |
|---|---:|
| Diagnóstico | 10% |
| Proposta Enviada | 40% |
| Ajustes / Follow-up | 60% |
| Negociação / Decisão | 80% |
| Fechado - Ganho | 100% |
| Fechado - Perdido | 0% |

### Propriedades personalizadas de negócio

| Propriedade | Opções atuais |
|---|---|
| METVI \| Oferta Comercial | Diagnóstico METVI · Presença Local · Captação · Marketing + Vendas · Projeto Avulso · Projeto Personalizado |
| METVI \| Tipo de Receita | Setup · Mensalidade · Projeto Avulso · Setup + Recorrência |

### Registros

- 2 negócios: 1 de exemplo criado pelo HubSpot e 1 real em "Proposta Enviada" desde 01/09/2026, sem valor preenchido e sem atualização desde 10/09/2026.
- Catálogo de produtos vazio.
- Configuração inicial da conta (onboarding do HubSpot) não concluída.

## 2. O que está defasado ou faltando

| # | Problema | Impacto | Correção |
|---|---|---|---|
| 1 | Não há etapa entre "Negociação" e "Ganho" para **aceite enviado / aguardando Pix** | Negócio aceito mas não pago aparece como ganho ou some da previsão | Criar a etapa **Aceite / Aguardando Pix** (90%) |
| 2 | "Fechado - Ganho" sem critério | Venda sem Pix entra como receita | Ganho = Pix creditado e identificado no extrato |
| 3 | Prospecção (lista, contato, qualificação) não tem lugar | Funil começa no diagnóstico e o volume de abordagem não é medido | Prospecção fica no **contato** (Lead Status); o negócio nasce quando a chamada de qualificação é marcada |
| 4 | Oferta Comercial não tem Essentials, Sprint de Conversão nem Reativação Express | Não dá para medir venda por oferta atual | Adicionar as 3 opções (ver dúvida no fim) |
| 5 | Faltam campos do contrato recorrente | Renovação, multa e reajuste ficam fora do CRM | Criar as propriedades da seção 4 |
| 6 | Não há acompanhamento do pós-venda | Entrega e renovação ficam só no repositório | Criar o funil **METVI \| Entrega** (seção 4) |
| 7 | Negócio real parado há mais de 70 dias, sem valor | Previsão de receita distorcida | Preencher valor e próximo passo, ou marcar como perdido com motivo |
| 8 | Negócio de exemplo do HubSpot | Polui relatórios | Excluir |
| 9 | Catálogo de produtos vazio | Negócio sem itens, sem MRR e sem valor de contrato | Cadastrar os produtos (seção 3) |
| 10 | Cotações, faturas e listas pedem nova autorização da conexão | Não dá para gerar cotação pelo Claude | Reconectar o HubSpot no Claude quando for usar cotações |

## 3. Catálogo de produtos (a cadastrar)

| SKU | Produto | Preço | Cobrança | Prazo |
|---|---|---:|---|---|
| ESS-03 | Essentials — 3 meses | R$ 2.477,77 | Mensal | 3 meses |
| ESS-06 | Essentials — 6 meses | R$ 2.077,77 | Mensal | 6 meses |
| ESS-12 | Essentials — 12 meses | R$ 1.677,77 | Mensal | 12 meses |
| IMP-ESS-03 | Implantação Essentials — 3 meses | R$ 1.477,77 | Única | — |
| IMP-ESS-06 | Implantação Essentials — 6 meses | R$ 977,77 | Única | — |
| BLK-ESS-03 | Bloco adicional Essentials — 3 meses | R$ 421,22 | Única (por mês contratado) | — |
| BLK-ESS-06 | Bloco adicional Essentials — 6 meses | R$ 353,22 | Única (por mês contratado) | — |
| BLK-ESS-12 | Bloco adicional Essentials — 12 meses | R$ 285,22 | Única (por mês contratado) | — |
| SPR-01 | Sprint de Conversão no WhatsApp | R$ 1.297,00 | Única | — |
| REA-01 | Reativação Express de Agenda | R$ 597,00 | Única | — |

O plano Performance entra no catálogo só depois de aprovado ([proposta](../estrategia/precificacao-essentials.md#7-plano-superior-performance--proposta)).

## 4. Estrutura recomendada

### Funil de vendas (ajustado)

| Etapa | Probabilidade | Entra quando | Sai quando |
|---|---:|---|---|
| Qualificação | 5% | Chamada de 15 min marcada | Chamada feita: segue ou desqualifica |
| Diagnóstico | 10% | Necessidade confirmada | Proposta enviada |
| Proposta Enviada | 40% | Escopo e preço enviados por escrito | Cliente responde |
| Ajustes / Follow-up | 60% | Cliente pediu ajuste ou está avaliando | Decisão |
| Negociação / Decisão | 80% | Prazo e plano definidos | Aceite enviado |
| **Aceite / Aguardando Pix** | 90% | Aceite enviado | "De acordo" + Pix creditado |
| Fechado - Ganho | 100% | Pix creditado e identificado | — |
| Fechado - Perdido | 0% | Desistência ou sem resposta após 3 follow-ups | — |

### Funil "METVI | Entrega" (novo)

Espelha o processo de [05-entrega](../../05-entrega/README.md): Onboarding → Kickoff → Produção → Entrega e reunião final → Ajustes → Encerramento. Para o Essentials, acrescentar a etapa **Recorrente ativo** e a **Renovação** (30 dias antes do término).

### Propriedades novas de negócio

| Propriedade | Tipo | Opções |
|---|---|---|
| METVI \| Prazo do contrato | Seleção | 3 meses · 6 meses · 12 meses · Acima de 12 |
| METVI \| Tipo de pessoa | Seleção | CNPJ · CPF |
| METVI \| Data de término do contrato | Data | — |
| METVI \| Renovação | Seleção | Automática · Por novo aceite |
| METVI \| Verba de mídia mensal | Número (R$) | — |
| METVI \| Bloco adicional | Seleção | Nenhum · Conteúdo · Anúncios |

### Status de lead (prospecção no contato)

Novo → Tentando contato → Conectado → Qualificado (vira negócio) → Desqualificado.

## Ajustes manuais nas configurações

A conexão do Claude com o HubSpot cria e edita registros, mas não altera funis nem propriedades. Faça em **Configurações**:

1. **Objetos → Negócios → Pipelines → METVI | Vendas Consultivas:** criar "Qualificação" (5%) antes de Diagnóstico e "Aceite / Aguardando Pix" (90%) antes de Fechado - Ganho.
2. **Mesma tela → Criar pipeline:** "METVI | Entrega", com as etapas da seção 4.
3. **Propriedades → Negócio → METVI | Oferta Comercial:** adicionar Essentials, Sprint de Conversão e Reativação Express.
4. **Propriedades → Negócio → Criar propriedade:** as 6 da seção 4.
5. **Negócios:** excluir o negócio de exemplo e atualizar o negócio parado.

## Dúvida em aberto

As ofertas antigas do HubSpot (Diagnóstico METVI, Presença Local, Captação, Marketing + Vendas) não aparecem no repositório. Elas continuam sendo vendidas ou podem ser arquivadas?
