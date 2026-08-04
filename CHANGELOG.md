# Changelog

Todos os desvios notáveis e implementações deste projeto serão documentados neste arquivo.

## [Milestone 1 - Consolidação] - 2026-08-03

### Alterado
- **Pipeline Unificado de IA (`runGeminiCoreExecution`)**: Unificada toda a execução de chamadas de IA do backend em um único pipeline centralizado.
- **Redirecionamento Interno de Rotas Legadas**: A rota `/api/gemini/generateText` e o webhook `/api/webhooks/aloha-pro` foram refatorados para utilizar internamente o `runGeminiCoreExecution`.
- **Eliminação de Duplicidades**: Unificados o tratamento de retries (HTTP 429), fallbacks inteligentes sem API Key, checagem de regras de mock e compilação do Prompt Registry.
- **Preservação de Interfaces**: Nenhuma interface pública REST ou do frontend foi alterada.

## [Sprint 02] - 2026-08-03

### Adicionado
- Criado o módulo `/server/ai/promptRegistry.ts` para centralização server-side dos prompts do sistema.
- Mecanismo simples de interpolação de variáveis no formato `{{variavel}}` sem dependência externa de Mustache.
- Endpoints REST no backend Express:
  - `GET /api/prompts`: Lista todos os prompts registrados e suas versões.
  - `GET /api/prompts/:agentId`: Obtém o prompt específico de um agente.
  - `POST /api/prompts`: Atualiza ou registra novo prompt com versionamento automático.
- Helpers de integração no `services/geminiService.ts` (`callGeminiAgent`, `getPromptRegistryList`, `getPromptRegistryByAgent`, `updatePromptRegistry`).

### Alterado
- Endpoint `/api/gemini/agent-execute` em `server.ts` atualizado para utilizar o `compileSystemInstruction` do Prompt Registry server-side.

## [Sprint 01] - 2026-08-03

### Adicionado
- Endpoint server-side `/api/gemini/agent-execute` no Express para gerenciar chamadas de agentes de IA.
- Mecanismo de retry com backoff exponencial para lidar com limites de requisição (HTTP 429) no backend.

### Alterado
- Desacoplado o SDK do Gemini `@google/genai` totalmente do frontend, centralizando no backend.
