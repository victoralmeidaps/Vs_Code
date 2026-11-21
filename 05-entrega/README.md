# Entrega — do Pix ao encerramento

Processo único para entregar qualquer oferta da METVI. A venda termina no Pix; a reputação começa aqui.

## Onde fica cada coisa

- **Modelos (no Git):** [`modelos/`](modelos/) — nunca preencha direto neles.
- **Cliente ativo (fora do Git):** `dados/clientes/<nome-do-cliente>/` — copie os modelos para lá e preencha.

```bash
mkdir -p dados/clientes/nome-do-cliente
cp 05-entrega/modelos/*.md dados/clientes/nome-do-cliente/
```

## Fluxo

| # | Fase | Gatilho de entrada | Modelo | Saída obrigatória |
|---|---|---|---|---|
| 1 | Onboarding | Pix creditado e identificado + aceite escrito | [onboarding.md](modelos/onboarding.md) | Kickoff agendado e lista de insumos enviada |
| 2 | Kickoff / diagnóstico | Data do kickoff | [briefing-diagnostico.md](modelos/briefing-diagnostico.md) | Problema prioritário e escopo confirmados por escrito |
| 3 | Produção | Insumos recebidos | [cronograma.md](modelos/cronograma.md) | Materiais prontos para revisão interna |
| 4 | Entrega + reunião final | Materiais revisados | [cronograma.md](modelos/cronograma.md) | Reunião de implementação/treinamento feita |
| 5 | Ajustes | Pedido consolidado do cliente | [encerramento.md](modelos/encerramento.md) | Uma rodada aplicada |
| 6 | Encerramento | Ajustes entregues ou prazo de ajuste vencido | [encerramento.md](modelos/encerramento.md) | Feedback registrado e pipeline atualizado |

Recorrente (Essentials): após o onboarding, o ciclo vira produção mensal com [relatório semanal](modelos/relatorio-semanal.md).

## Prazos por oferta

Prazos contam a partir do **kickoff e do recebimento dos insumos**. Atraso de insumo desloca o prazo na mesma proporção.

| Oferta | Kickoff | Entrega | Reunião final | Ajustes |
|---|---|---|---|---|
| [Sprint de Conversão](../02-comercial/ofertas/oferta-sprint-conversao.md) | 45 min | até 3 dias úteis | 45 min | 1 rodada, pedido em até 2 dias úteis |
| [Reativação Express](../02-comercial/ofertas/oferta-reativacao-express.md) | 30 min | até 2 dias úteis | 30 min (treinamento) | Conforme aceite |
| [Essentials](../02-comercial/ofertas/oferta-essentials.md) | A definir no aceite | Mensal, por 3, 6, 12 meses ou mais | — | Relatório semanal |

## Regras de entrega

1. **Sem Pix, sem início.** Exceção só se deliberada e registrada.
2. **Capacidade:** no máximo dois atendimentos ativos somando Sprint e Reativação. Ativo = do Pix até o encerramento registrado.
3. **Prometa só o que controla:** diagnóstico, materiais, implementação e prazo. Nunca leads, vendas ou faturamento.
4. **Dados do cliente:** nenhum acesso, envio ou exportação sem autorização escrita e específica.
5. **Nada publicado ou enviado** em nome do cliente sem aprovação expressa dele.
6. **Revisão humana** em todo material gerado com IA antes de chegar ao cliente.
7. **Registro:** cada mudança de fase atualiza `dados/PIPELINE-PROSPECCAO.csv` (kickoff, insumos, prazo, encerramento) e move o chat em [`02-comercial/chats/`](../02-comercial/chats/).
