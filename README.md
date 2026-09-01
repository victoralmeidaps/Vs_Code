# Deadpool Assistente

Assistente desktop local em Electron com um unico orquestrador para OpenAI e Claude. O modelo executor pode usar ferramentas; no modo de dupla revisao, o segundo modelo revisa apenas o texto final e nunca executa a acao novamente.

## Configuracao inicial

1. Crie o arquivo local de configuracao:

```bash
cp .env.example .env
```

1. Preencha no `.env` pelo menos uma chave:

```text
OPENAI_API_KEY=sua_chave
ANTHROPIC_API_KEY=sua_chave
```

Para usar `dual-review`, configure as duas. O arquivo `.env` ja esta ignorado pelo Git e as chaves permanecem no processo principal do Electron; elas nao sao expostas ao HTML.

O indicador da interface confirma apenas que uma chave foi configurada. A autenticacao e a disponibilidade do modelo so ficam validadas depois de uma chamada real ao provedor.

1. Instale e execute:

```bash
npm install
npm run deadpool:widget
```

O widget roda em instancia unica. Clique no avatar, escolha o modo e escreva a mensagem. `Enter` envia e `Shift+Enter` cria uma nova linha.

## Modos

- `Automatico`: usa o provedor principal e troca para o outro se a primeira chamada falhar.
- `Dupla revisao`: um provedor executa a tarefa e o outro revisa somente a resposta final.
- `Somente OpenAI`: força a Responses API da OpenAI.
- `Somente Claude`: força a Messages API da Anthropic.

O provedor principal e controlado por `DEADPOOL_PRIMARY_PROVIDER=openai|claude`.

## Ferramentas da primeira versao

- `get_weather`: consulta clima atual sem confirmacao.
- `save_note`: salva nota local somente depois de confirmacao explicita.
- `list_notes`: consulta notas locais sem alterar dados.

As notas ficam no diretorio privado de dados do aplicativo, fora do repositorio. O executor de ferramentas e unico mesmo no modo de dupla revisao.

## Seguranca

- Renderer com `contextIsolation`, `sandbox` e sem Node.js.
- Chaves acessiveis somente no processo principal.
- IPC restrito por `preload.js`.
- Permissoes de navegador negadas por padrao.
- Escritas locais exigem confirmacao.
- Chamadas de ferramenta sao executadas sequencialmente para impedir duplicidade.

## Validacao

```bash
npm run check
npm test
```

Os testes usam provedores simulados e nao consomem creditos de API.

## Versao web responsiva

Abra `deadpool-web.html` a partir de um servidor HTTPS para usar a interface no
iPhone. A pagina envia conversas para `POST /api/chat` no mesmo dominio, com o
corpo `{ "message": "...", "history": [...] }`, e espera `{ "reply": "..." }`.
As chaves dos provedores devem permanecer exclusivamente nesse backend.

## Arquivos principais

- `main.js`: janela Electron e handlers IPC.
- `preload.js`: ponte segura com a interface.
- `deadpool-agent.js`: fachada do renderer.
- `agent/orchestrator.js`: loop, confirmacoes e dupla revisao.
- `agent/model-router.js`: selecao, fallback e revisor.
- `agent/providers/`: adaptadores OpenAI e Claude.
- `agent/tools.js`: registro e execucao unica de ferramentas.
- `avatar-widget.html`: chat e estados visuais.
