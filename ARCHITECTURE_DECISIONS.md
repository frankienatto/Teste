# Registro de Decisões Arquiteturais (ADR)

## ADR-001: Isolamento do SDK Gemini no Backend (Sprint 01)
- **Data**: 2026-08-03
- **Decisão**: Toda interação com os modelos Gemini (`@google/genai`) deve ocorrer estritamente no servidor backend Express (`server.ts`).
- **Motivação**: Prevenir vazamento de chaves `GEMINI_API_KEY` para o navegador e garantir resiliência operacional via proxies e fallbacks.

## ADR-002: Prompt Registry Server-Side com Interpolação Nativa (Sprint 02)
- **Data**: 2026-08-03
- **Decisão**: Criar o repositório central de prompts em `/server/ai/promptRegistry.ts` utilizando interpolação simples por Regex (`{{variavel}}`), sem adicionar a biblioteca Mustache.
- **Motivação**: Atender estritamente ao princípio de menor alteração e evitar dependências externas desnecessárias mantendo simplicidade e facilidade de manutenção. Cache foi postergado para avaliações pós-produção.

## ADR-003: Pipeline Unificado de Execução de IA (Milestone 1 - Consolidação)
- **Data**: 2026-08-03
- **Decisão**: Toda chamada de geração de texto/estruturada no backend Express deve obrigatoriamente transitar pela função central `runGeminiCoreExecution`.
- **Motivação**: Eliminar duplicidade de código entre rotas legadas (`/api/gemini/generateText`, webhooks) e a rota de agentes (`/api/gemini/agent-execute`), garantindo que retries com backoff, compilação de prompts via Prompt Registry e tratamento de mocks sejam aplicados de forma consistente em todo o sistema sem quebrar nenhuma interface do frontend.

## ADR-004: Fundação SaaS Multi-Tenant e Composição por Módulos (Milestone 2)
- **Data**: 2026-08-03
- **Decisão**: 
  1. Organizar módulos do servidor sob `server/modules/saas/`.
  2. Utilizar `organizationService` e `organizationRepository` para desacoplar lógica de domínio e persistência.
  3. Separar middlewares com responsabilidade única (`authMiddleware`, `tenantMiddleware` com obrigatoriedade em produção e fallback de dev, `rbacMiddleware`).
  4. Montar rotas usando `saasRouter` do Express para manter `server.ts` puramente como ponto de composição.
  5. Onboarding atômico que provisiona `Organization`, `Property` e `Owner User` com IDs independentes, retornando status e `nextSteps` sem criar agentes automaticamente.
  6. `IntegrationRegistry` atua exclusivamente registrando e listando metadados de conectores de terceiros, sem acoplamento prévio de fluxos OAuth.
- **Motivação**: Construir uma fundação SaaS limpa, escalável e segura sem contaminar o arquivo `server.ts` e com isolamento total entre tenants e controle granular de permissões.
