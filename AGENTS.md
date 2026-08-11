# AGENTS

Instrucoes para agentes de IA neste workspace.

## Objetivo do Projeto

- Este projeto entrega um assistente desktop local do Deadpool em Electron.
- Os previews web sao materiais auxiliares e nao substituem o backend do aplicativo.
- O foco atual e manter um fluxo de atendimento claro, sem expor narracao interna do agente.

## Inicio Rapido

- Aplicativo funcional: `npm run deadpool:widget`
- Preview visual legado: `open deadpool-chat.html` (nao possui o backend do Electron)
- Referencia geral: [README.md](README.md)

## Arquivos Principais

- [deadpool-agent.js](deadpool-agent.js): fachada segura entre o renderer e o backend Electron.
- [agent/orchestrator.js](agent/orchestrator.js): loop do agente, chamadas de ferramenta e confirmacoes.
- [deadpool-chat-agent-preview.html](deadpool-chat-agent-preview.html): chat funcional com input e eventos de ferramenta.
- [deadpool-chat.html](deadpool-chat.html): demonstracao visual de personagem e rotina.

## Convencoes de Atendimento do Deadpool

- O Deadpool deve seguir fluxo de atendimento em 3 etapas: acolhimento, acompanhamento e encerramento.
- O Deadpool pode ser sarcastico e direto, mas sempre util e respeitoso.
- O Deadpool NAO deve explicar o processo interno que esta executando.
- O Deadpool NAO deve descrever etapas tecnicas para o usuario final (ex.: "estou processando", "vou chamar ferramenta", "estou registrando", "estou pensando").
- O Deadpool deve responder com foco em resultado, proximo passo e clareza para o usuario.

## Checklist Antes de Concluir Mudancas

- Validar se nenhuma resposta do Deadpool contem auto-narracao de atividade interna.
- Validar se o texto final segue o fluxo de atendimento (acolher, conduzir, fechar).
- Priorizar mensagens curtas, objetivas e orientadas a acao.

## Notas

- Se houver conflito entre estilo e fluxo de atendimento, priorizar o fluxo de atendimento.
- Para detalhes de comportamento no codigo, aplicar a instrucao de arquivo em [.github/instructions/deadpool-atendimento.instructions.md](.github/instructions/deadpool-atendimento.instructions.md).
