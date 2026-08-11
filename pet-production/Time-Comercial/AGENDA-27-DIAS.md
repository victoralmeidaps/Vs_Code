# Agenda de caixa e prospecção — 10/08 a 05/09/2026

## Decisão operacional

Não vou manter a antiga meta de 100 empresas em três dias. Ela disputa tempo com a Uber, incentiva abordagem genérica e não protege o primeiro vencimento. O plano passa a ter uma rotina sustentável: Uber para caixa imediato e um bloco comercial de 45 a 90 minutos em cada dia útil para gerar conversas qualificadas.

## Regras de autonomia

- Ao terminar cada turno da Uber: preencher `CONTROLE-UBER-DIARIO.csv`, calcular o resultado líquido e transferir ou separar o valor para o vencimento mais próximo.
- Usar `PRIORIDADES-CAIXA.csv` como a única fila de pagamentos. Não usar valor já reservado para uma conta posterior.
- O projeto comercial não depende de crédito de IA, anúncios ou ferramentas pagas.
- Nenhuma mensagem, proposta, pagamento ou acesso a dados de terceiros será enviado por este plano automaticamente. O Victor aprova e executa cada ação externa.
- Reservar 15 minutos no início ou no fim do bloco comercial para aprovar um lote de até cinco mensagens. Registrar aprovação, data e versão no pipeline. Sem aprovação, o lote fica marcado como pendente; ele não é enviado.
- Domingo não entra como capacidade de Uber, prospecção, entrega ou promessa de prazo. Se houver uma necessidade de pagamento no domingo, a reserva precisa estar pronta até sábado.
- Trabalho comercial diário: primeiro responder interessados e agendar chamadas; depois pesquisar contatos; por último preparar rascunhos. Não gastar tempo criando materiais antes de ter Pix e aceite.

## Dados para a meta diária — coletar aos poucos

Você não precisa saber de antemão quanto a Uber vai render por dia. Os valores serão coletados na ordem abaixo, sem estimativa:

1. Depois do primeiro turno: repasse mostrado no app, dinheiro/gorjetas, combustível, pedágios e outros custos.
2. Quando acessar as faturas: valor exato de gasolina e aluguel.
3. Quando consultar banco ou carteira: registrar o caixa disponível em `CONTROLE-CAIXA-INICIAL.csv`.

Os dois primeiros turnos servem para registrar a realidade. A referência de ganho líquido diário será calculada depois de três turnos, mas o dinheiro já será separado para o vencimento mais próximo desde o primeiro.

## Agenda por data

| Data | Caixa/Uber | Projeto comercial | Critério de pronto |
|---|---|---|---|
| Seg, 10/08 | Registrar o caixa atual em `CONTROLE-CAIXA-INICIAL.csv` e o primeiro resultado líquido de Uber, se houver turno | Listar 10 contatos quentes; não enviar | Caixa e 10 contatos registrados |
| Ter, 11/08 | Separar o que houver para água/luz; registrar custo de combustível | Pesquisar 10 empresas locais e preparar 5 rascunhos | 20 contatos e 5 rascunhos prontos |
| Qua, 12/08 | Atualizar o valor que ainda falta para água/luz | Preparar mais 5 rascunhos personalizados | 10 rascunhos aguardando aprovação |
| Qui, 13/08 | Registrar resultado líquido e reservar para 17/08 | Enviar apenas rascunhos aprovados; responder interessados | Cada conversa tem próximo passo e data |
| Sex, 14/08 | Conferir a lacuna de água/luz e ajustar os turnos seguintes | Fazer chamadas de qualificação; se não houver conversa qualificada, acionar a preparação da Reativação Express | Água/luz reservada ou lacuna explícita |
| Sáb, 15/08 | Revisar caixa e deixar a reserva do dia 17 identificada | Follow-up de conversas abertas e preparar a Reativação Express, se acionada | Nenhum compromisso sem data |
| Dom, 16/08 | Folga — não é capacidade planejada | Folga | Nenhuma atividade obrigatória |
| Seg, 17/08 | Pagar ou confirmar água/luz com dinheiro já reservado; registrar saldo | Follow-up aprovado das conversas abertas e, se acionada, apresentar a Reativação Express | Pagamento ou status real registrado |
| Ter, 18/08 | Iniciar reserva da gasolina e preservar combustível operacional | Novas abordagens personalizadas para contatos elegíveis; incluir a rota alternativa quando apropriado | Próximo vencimento atualizado |
| Qua, 19/08 | Conferir quanto falta para gasolina | Chamadas qualificadas e aceite comercial | Nenhuma proposta contada como caixa |
| Qui, 20/08 | Pagar ou confirmar gasolina; registrar o saldo após pagamento | Só kickoff de cliente com Pix creditado | Gasolina tratada e caixa atualizado |
| Sex, 21/08 | Reservar para a mãe; registrar a Uber líquida | Conferir conversão e corrigir uma mensagem ou ICP com evidência | Checkpoint comercial registrado |
| Sáb, 22/08 | Revisar a reserva da mãe e o custo operacional da próxima semana | Organizar chamadas e entregas já pagas | Sem pendência sem data |
| Dom, 23/08 | Folga — não é capacidade planejada | Folga | Nenhuma atividade obrigatória |
| Seg, 24/08 | Atualizar a lacuna para o pagamento da mãe | Priorizar conversas e propostas com decisão nesta semana | Cada oportunidade tem decisão ou data |
| Ter, 25/08 | Separar caixa para a mãe antes de qualquer gasto adiável | Qualificação e proposta; manter escopo fechado | Reserva da mãe atualizada |
| Qua, 26/08 | Conferir valor reservado e plano de pagamento da mãe | Entregar somente sprints pagos dentro do limite de dois ativos | Sem aumento de escopo |
| Qui, 27/08 | Pagar ou confirmar pagamento à mãe; registrar saldo | Follow-up de oportunidades abertas | Status real registrado, sem promessas |
| Sex, 28/08 | Concentrar reserva no aluguel | Executar ou acompanhar apenas a Reativação Express que já tenha Pix e aceite | Valor do aluguel pendente visível |
| Sáb, 29/08 | Deixar o aluguel reservado ou registrar a lacuna antes do domingo | Preparar semana final e tratar propostas quentes | Reserva do aluguel pronta ou lacuna explícita |
| Dom, 30/08 | Vencimento do aluguel: confirmar pagamento com caixa reservado; sem contar trabalho neste dia | Folga | Pagamento ou status real registrado |
| Seg, 31/08 | Iniciar reserva da escola e atualizar caixa | Retomar apenas oportunidades com próximo passo claro | Cada oportunidade encerrada ou avançada |
| Ter, 01/09 | Atualizar lacuna da escola | Reativação Express, se paga e dentro da capacidade | Pix antes do kickoff |
| Qua, 02/09 | Proteger a reserva da escola | Entregar pendências de escopo fechado | Nenhum prazo sem insumos |
| Qui, 03/09 | Pagar ou confirmar escola; registrar saldo restante | Revisar vencimentos e caixa recebido | Status real da escola registrado |
| Sex, 04/09 | Atualizar caixa total e custos de Uber | Último ciclo de follow-up respeitoso | Motivos de perda registrados |
| Sáb, 05/09 | Conciliar Uber, Pix recebidos, contas pagas e saldo | Definir a próxima decisão comercial com base no que converteu | Painéis atualizados e decisão documentada |

## Checkpoints que mudam a rota

1. **Fim de 11/08:** caixa atual, aluguel, gasolina e pelo menos um resultado líquido de Uber registrados. Sem isso, não há meta diária confiável.
2. **Fim de 14/08:** água/luz deve estar integralmente reservada ou com a lacuna explícita. A solução para a lacuna é aumentar caixa real; não contar propostas como dinheiro.
3. **Fim de 21/08:** se houver 30 abordagens personalizadas aprovadas e tratadas, duas chamadas qualificadas e nenhum Pix, revisar a mensagem, o nicho, a prova, o escopo e o preço. A Reativação Express já deve estar pronta desde o dia 15, não esperar este checkpoint para criá-la.
4. **Fim de 29/08:** aluguel reservado ou lacuna explícita antes do domingo. Se houver demanda comercial válida, usar apenas a oferta de Reativação Express já definida e com pagamento antecipado.
5. **Fim de 03/09:** escola paga ou situação real registrada. O investimento no pet permanece bloqueado até as cinco obrigações prioritárias estarem protegidas.

## Ação única de agora

Faça apenas o primeiro turno da Uber. Ao terminar, abra `CONTROLE-UBER-DIARIO.csv` e preencha a linha de hoje com: repasse do app, dinheiro/gorjetas, combustível, pedágios e outros custos. Se ainda não tiver os valores de aluguel, gasolina ou caixa atual, deixe-os em branco por enquanto.
