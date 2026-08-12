# Plano de caixa — 27 dias

## Decisão central

Esta é uma operação de caixa, não uma campanha de marca. O objetivo é proteger os vencimentos mais próximos e receber pagamentos por um serviço de escopo fechado antes de iniciar a entrega. Nenhuma proposta aceita, comissão futura ou conversa promissora entra na meta até o Pix estar recebido.

Há duas frentes, com funções diferentes:

| Frente | Função | O que conta como caixa | Regra |
|---|---|---|---|
| Uber | Proteger os vencimentos de curto prazo | Resultado líquido do turno, depois de combustível, pedágios e custos do dia | Registrar e separar o dinheiro ao encerrar cada turno |
| Sprint comercial | Criar entradas de maior valor para os vencimentos seguintes | Somente Pix efetivamente creditado e identificado | Não iniciar entrega antes do pagamento |

Não existe estimativa de ganho da Uber neste plano. A [própria Uber informa que os ganhos variam conforme quando, onde e com que frequência se dirige](https://www.uber.com/br/pt-br/drive/how-much-drivers-make/); por isso, a gestão será feita por resultado líquido real, não por uma promessa diária.

## Meta financeira

| Item | Valor |
|---|---:|
| Meta total informada | R$ 7.630,00 |
| Obrigações essenciais | R$ 7.121,33 |
| Pet e aprendizado | R$ 508,67 |

Os valores em reais foram calculados a partir da cotação implícita informada de R$ 5,086667 por US$ 1. O investimento no pet só será liberado depois que as obrigações essenciais estiverem pagas ou 100% reservadas.

Os valores individuais abaixo são estimativas de conversão. Como o arredondamento por item soma R$ 7.630,01, a meta financeira oficial deste plano é o total informado pelo Victor: **R$ 7.630,00**. Antes de qualquer pagamento, substituir as estimativas pelos valores exatos das faturas e vencimentos.

## Modelo de receita de teste

**Oferta:** Sprint de Conversão no WhatsApp

**Preço de teste:** R$ 1.297,00 à vista, antes de iniciar

**Meta matemática:** 6 pagamentos x R$ 1.297,00 = **R$ 7.782,00**

Isso cria R$ 152,00 de folga sobre a meta total. É uma hipótese de planejamento, não uma previsão de vendas.

## Regras de caixa

1. Registrar apenas dinheiro recebido no campo `valor_recebido` do pipeline. Avançar para `Fechado pago` somente depois de o Pix estar efetivamente creditado e identificado; registrar o identificador da transação sem salvar dados bancários sensíveis.
2. Não iniciar entrega sem pagamento confirmado, salvo exceção deliberada e registrada.
3. Não dar desconto sem contrapartida concreta: pagamento à vista, escopo menor ou indicação qualificada.
4. Não usar escassez falsa. Só anunciar o número de vagas que a capacidade permitir.
5. Não comprar créditos de IA, anúncios ou ferramentas enquanto o piso essencial de R$ 7.121,33 não estiver protegido.
6. A receita da Uber só vira caixa disponível depois de descontar combustível, pedágios e outros custos do turno. O combustível de trabalho não pode ser confundido com a conta de gasolina com vencimento em 20/08.
7. Todo valor separado recebe um destino: água/luz, gasolina, mãe, aluguel ou escola. Dinheiro reservado para vencimento próximo não é usado para outro item sem atualizar o quadro de prioridades.
8. Limite inicial de capacidade: no máximo dois atendimentos ativos no total, somando Sprint de Conversão e Reativação Express. Um atendimento fica ativo do Pix confirmado até a entrega e o encerramento registrados. Antes de receber um novo Pix, conferir a capacidade no pipeline e confirmar por escrito a data de início; se a fila ultrapassar o prazo da oferta, pausar novas vendas ou ajustar o prazo antes do aceite.

## Funil comercial

| Etapa | Critério de entrada | Próxima ação | Critério de saída |
|---|---|---|---|
| Lista | Empresa identificada | Pesquisar atendimento e decisor | Perfil verificado |
| Contato | Mensagem aprovada e enviada pelo Victor | Acompanhar resposta | Respondeu ou perdeu prazo |
| Qualificado | Tem atendimento por WhatsApp, decisor acessível e problema observável | Marcar diagnóstico de 15 minutos | Reunião marcada ou desqualificado |
| Oportunidade | Diagnóstico realizado e necessidade confirmada | Apresentar escopo e preço | Pagamento, perda ou próximo compromisso |
| Fechado pago | Pix efetivamente creditado e identificado | Agendar onboarding | Entrega iniciada |
| Entregue | Materiais e reunião final concluídos | Pedir feedback e indicação autorizada | Feedback ou encerramento |

O `PIPELINE-PROSPECCAO.csv` registra oferta, aprovação da mensagem, tempo de primeira resposta, kickoff, recebimento de insumos, prazo e encerramento. Meta inicial de SLA: responder em até 5 minutos quando o bloco comercial estiver ativo; fora desse período, responder no próximo bloco útil e registrar o tempo real, sem fabricar conformidade.

## Calendário operacional

### Dia 0 — preparação

- [x] Registrar as datas de vencimento no quadro abaixo.
- [ ] Preencher o caixa disponível agora, o valor exato do aluguel e o valor exato da gasolina.
- [ ] Confirmar quantas horas reais estão disponíveis para Uber e para o projeto nos próximos 27 dias.
- [ ] Revisar a oferta e definir a quantidade real de vagas. Não anunciar seis vagas sem essa confirmação.
- [ ] Criar uma base inicial de 20 contatos: 10 quentes e 10 empresas locais. Expandir de forma personalizada até o limite planejado de 60 abordagens no período, sem abordagem em massa.
- [ ] Usar os rascunhos de mensagens, sem enviar nada sem aprovação.

### Dias 1–5 — validação da oferta

- Registrar cada turno da Uber no `CONTROLE-UBER-DIARIO.csv` e separar primeiro água/luz, que vencem em 17/08.
- Fazer abordagens personalizadas e registrar cada ação no pipeline.
- Fazer chamadas gratuitas de qualificação de 15 minutos com decisores.
- Buscar o primeiro pagamento, não apenas reuniões.
- Fazer o diagnóstico pago de 45 minutos só depois do Pix e do aceite escrito.
- Entregar o primeiro sprint em até 3 dias úteis após kickoff e recebimento dos insumos.

**Checkpoint do dia 5:** se, após 10 abordagens personalizadas aprovadas e todas as respostas tratadas, não houver conversa qualificada, revisar ICP e mensagem antes de ampliar o volume.

### Dias 6–14 — repetição controlada

- Repetir a abordagem que gerou conversa qualificada.
- Entregar sem aumentar escopo.
- Pedir uma indicação apenas depois de uma entrega satisfatória.
- Acompanhar recebimentos diários e vencimentos.

**Checkpoint do dia 12:** se, após 30 abordagens personalizadas aprovadas e pelo menos 2 chamadas qualificadas, não houver Pix recebido, revisar prova, escopo e preço antes de aumentar volume.

### Dias 15–21 — acelerar apenas o que converteu

- Priorizar segmentos, mensagens e canais que geraram reuniões.
- Descartar abordagens sem resposta após follow-up aprovado.
- Evitar criar novos serviços, anúncios ou automações nesta fase.

### Dias 22–27 — fechamento e proteção de caixa

- Fechar pendências com próximo passo e data objetiva.
- Só considerar pagamento futuro como previsão, nunca como caixa.
- Conferir os pagamentos essenciais antes de separar verba para o pet.

## Plano de contingência

Se, no checkpoint do dia 5, a oferta não gerar conversa qualificada, preparar a segunda rota no dia seguinte e iniciar abordagens aprovadas a partir de 17/08. Não esperar até o fim do mês: a alternativa precisa ter tempo de gerar caixa para os vencimentos de 27/08, 30/08 e 03/09.

### Reativação Express de Agenda — R$ 597,00 à vista

Escopo: uma chamada de diagnóstico, dois roteiros de retorno, uma planilha de controle e uma reunião de treinamento para que a própria equipe retome até 30 contatos pelo canal oficial do cliente. Sem extrair dados, enviar mensagens em nome do cliente ou prometer conversões.

Se houver 5 Sprints de Conversão pagos (R$ 6.485,00), faltam R$ 1.145,00 para a meta. Duas Reativações Express somam R$ 1.194,00 e levam o recebimento previsto a R$ 7.679,00. Não aceitar somente comissão futura para atender uma necessidade de caixa em 27 dias.

## Ordem de caixa por vencimento

O prazo de 17/08 é o primeiro teste do plano. O projeto comercial pode ajudar, mas não deve ser considerado fonte certa para essa data: o primeiro objetivo é reservar o valor de água e luz pela Uber e pelo caixa já disponível.

| Prioridade | Obrigação | Valor em R$ | Vencimento | Regra de proteção |
|---:|---|---:|---|---|
| 1 | Água e luz | 610,40 (total estimado) | 17/08/2026 | Reservar primeiro; confirmar os valores individuais antes de pagar |
| 2 | Gasolina | A confirmar | 20/08/2026 | Separar da gasolina usada para trabalhar na Uber |
| 3 | Mãe | 3.001,24 (estimado) | 27/08/2026 | Só prometer data apoiada em caixa real |
| 4 | Aluguel | A confirmar | 30/08/2026 | Deixar reservado até 29/08; domingo não é capacidade de trabalho |
| 5 | Escola | 1.600,67 (estimado) | 03/09/2026 | Não usar esse valor para uma conta posterior |
| 6 | Pet e aprendizado | 508,67 (estimado) | Após essenciais | Só liberar depois das cinco prioridades anteriores |

Os valores de aluguel e gasolina aparecem juntos no levantamento inicial como R$ 1.909,03. Eles precisam ser separados antes de existir uma meta diária líquida confiável.

## Cálculo da meta diária líquida da Uber

Não preencher por estimativa. Registrar os três primeiros turnos reais da Uber e, quando estiverem acessíveis, o caixa disponível, o aluguel exato e a gasolina exata.

`meta líquida Uber até o próximo vencimento = (valor a reservar até a data - caixa já reservado para ele - Pix comercial já creditado e destinado a ele) / dias reais de trabalho até a data`

Os dois primeiros turnos servem para medir a realidade; a referência diária é calculada a partir do terceiro. Desde o primeiro turno, separar o resultado líquido para o vencimento mais próximo. Se um resultado ficar abaixo da referência, registrar o fato e ajustar o próximo turno sem tirar dinheiro já reservado para um vencimento anterior.

## Quadro de vencimentos — controlar antes de pagar

| Obrigação | Valor em R$ | Vencimento | Consequência de atraso | Ação de hoje |
|---|---:|---|---|---|
| Água e luz | 610,40 (total estimado) | 17/08/2026 | Confirmar com os fornecedores | Separar o valor e preencher faturas individuais |
| Gasolina | A confirmar | 20/08/2026 | Pode reduzir a capacidade de gerar caixa | Informar o valor da conta e o mínimo operacional para Uber |
| Mãe | 3.001,24 (estimado) | 27/08/2026 | Relação pessoal; alinhar sem prometer além do caixa | Atualizar somente com valor já reservado |
| Aluguel | A confirmar | 30/08/2026 | Confirmar consequência e forma de pagamento | Informar valor exato e reservar até 29/08 |
| Escola | 1.600,67 (estimado) | 03/09/2026 | Confirmar com a escola | Proteger depois das quatro prioridades anteriores |
| Ajuste de arredondamento da meta | -0,01 | N/A | N/A | Substituir por valores exatos das faturas |
| Pet e aprendizado | 508,67 | Após essenciais | Adiável | Não liberar antes do piso essencial |

## Critério de pronto desta fase

- A oferta, preço e escopo estão definidos em uma página.
- O pipeline possui a base inicial de 20 contatos ou indicação de que essa base não existe.
- Todas as obrigações têm vencimento, valor exato e próxima ação registrados.
- Cada turno da Uber e cada valor reservado têm registro separado.
- Nenhuma mensagem externa foi enviada sem aprovação específica.
