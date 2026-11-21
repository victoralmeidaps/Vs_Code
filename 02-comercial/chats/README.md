# Chats — Sprint de Conversão

Cada conversa com uma empresa em potencial vira um arquivo aqui dentro.
O arquivo mora na pasta que representa o status real da conversa — para saber
onde cada chat está, basta olhar em qual pasta o arquivo dele está, direto
aqui no VS Code.

## Como usar

1. **Novo contato:** copie `_MODELO-CHAT.md`, renomeie para o nome da
   empresa (ex.: `Petshop-Amigo-Fiel.md`) e preencha. Coloque em
   `1-Em-Aberto`.
2. **Todo fim de dia** (ou quando o status mudar durante o dia): abra o
   arquivo, atualize o campo "Próximo passo" e arraste o arquivo para a
   pasta certa:
   - `1-Em-Aberto` — primeiro contato feito ou na lista, aguardando
     resposta.
   - `2-Em-Analise` — qualificando ou avaliando a proposta com a empresa.
   - `3-Em-Processamento` — pago, em execução (do kickoff até a entrega).
   - `4-Finalizado` — entregue ou encerrado (ganho ou perdido). Se perdido,
     registre o motivo no próprio arquivo.
3. Para decisões financeiras (valores recebidos, prazos, SLA), o registro
   detalhado continua em
   `dados/PIPELINE-PROSPECCAO.csv` (local, fora do Git). Esta pasta é só
   para bater o olho rápido e saber onde cada conversa está agora.
