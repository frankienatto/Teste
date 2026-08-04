# Changelog

Todos os desvios notáveis e implementações deste projeto serão documentados neste arquivo.

## [Milestone 6 - Etapa 6.3: Guest Intelligence & Concierge AI] - 2026-08-03

### Adicionado
- **Módulo Guest Intelligence (`server/modules/crm/`)**:
  - `intelligenceTypes.ts`: Tipos do domínio de Inteligência (`GuestIntelligence`, `GuestSummary`, `RecurrenceLevel`).
  - `guestIntelligenceService.ts`: Serviço que calcula automaticamente `profileSummary`, `engagementScore` (faixa 0 a 100), `recurrenceLevel` ('new' | 'occasional' | 'frequent' | 'champion'), `averageSpendPerStay`, `averageStayDays`, `topPreferences`, `operationalAlerts` e `conciergeSuggestions` sem side-effects.
- **Integração com o ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do campo `guestIntelligence` no `OperationalContext`, transmitindo um resumo sintetizado e inteligente quando o `activeGuestId` é fornecido, sem expor históricos brutos.
- **Atualização do Prompt Registry (`server/ai/promptRegistry.ts`)**:
  - Atualização dos prompts dos agentes `reception_agent`, `marketing_agent` e criação/atualização do `concierge_agent` para consumir o resumo de `guestIntelligence` e personalizar o atendimento proativamente.
- **Roteamento Determinístico do Concierge (`server/modules/ai/agentRouter.ts`)**:
  - Adição de regra determinística para `concierge_agent` baseada em palavras-chave do universo de concierge (`concierge`, `experiências`, `restaurantes`, `passeios`, `aniversário`, `lua de mel`, `transporte`, `transfer`, `turismo`).
- **Endpoints REST Read-Only (`server/modules/crm/crmRouter.ts`)**:
  - `GET /api/crm/guests/:guestId/intelligence` (retorna objeto completo de inteligência do hóspede).
  - `GET /api/crm/guests/:guestId/summary` (retorna resumo enxuto).


## [Milestone 6 - Etapa 6.2: Guest Timeline & Perfil 360°] - 2026-08-03

### Adicionado
- **Módulo Guest Timeline & Perfil 360° (`server/modules/crm/`)**:
  - `timelineTypes.ts`: Tipos do domínio da Timeline (`TimelineEventSource`, `TimelineEventType`, `GuestTimelineEvent`, `AppendTimelineEventDTO`, `Guest360Profile`, `GuestTimelineSummary`).
  - `timelineRepository.ts`: Repositório Event-Driven em memória com política de retenção FIFO configurável (máximo 200 eventos por hóspede).
  - `timelineService.ts`: Serviço unificado para publicação Event-Driven via `appendTimelineEvent`, consulta de eventos, carregamento do Perfil 360° (`getGuest360Profile`) e geração de resumo enxuto para os Agentes de IA (`getTimelineSummaryForAI`).
  - `crmService.ts`: Integração automática de eventos da Timeline no cadastro de hóspede, atualização de preferências, conclusão de estadias e alteração dinâmica de classificação.
  - `crmRouter.ts`: Endpoints REST `POST /api/crm/guests/:guestId/timeline`, `GET /guests/:guestId/timeline` e `GET /guests/:guestId/360`.
- **Enriquecimento Enxuto do ContextService para IA (`server/modules/ai/contextService.ts`)**:
  - Inclusão do campo `activeGuestTimelineSummary` no `guestCrm` do contexto operacional da IA (contendo os últimos 5 eventos, classificação do hóspede, preferências principais e alertas urgentes), sem sobrecarregar a janela de contexto.

## [Milestone 6 - Etapa 6.1: CRM Inteligente de Hóspedes (Guest CRM Foundation)] - 2026-08-03

### Adicionado
- **Módulo Guest CRM Foundation (`server/modules/crm/`)**:
  - `guestTypes.ts`: Tipos e contratos do domínio CRM (`GuestProfile`, `GuestPreferences`, `GuestDocument`, `GuestStayRecord`, `GuestClassification`, `CreateGuestDTO`, `UpdateGuestDTO`, `GuestQueryFilters`, `GuestMetricsSummary`).
  - `guestRepository.ts`: Repositório com suporte a busca avançada por e-mail, documento e tags, consolidando perfis em nível de `Organization`.
  - `crmService.ts`: Serviço do CRM com deduplicação automática de contatos, elevação dinâmica de classificação (`standard` -> `frequent` -> `vip`), agregação de histórico de estadias em múltiplas propriedades da Organização e cálculo de receita acumulada.
  - `crmRouter.ts`: Endpoints Express REST (`POST /api/crm/guests`, `GET /guests`, `GET /guests/:guestId`, `PUT /guests/:guestId`, `POST /guests/:guestId/stays`, `GET /metrics`).
- **Enriquecimento do ContextService para Agentes de IA (`server/modules/ai/contextService.ts`)**:
  - Exposição de `guestCrm` (métricas de total de hóspedes, VIPs, recorrentes, estadias acumuladas e receita total) em modo read-only para os Agentes de IA.

## [Milestone 5 - Etapa 5.3: Integração Google Calendar (via n8n)] - 2026-08-03

### Adicionado
- **Módulo Google Calendar Foundation (`server/modules/integration/gcal/`) conforme ADR-005**:
  - `googleCalendarTypes.ts`: Tipos e interfaces de contrato (`GCalEventType`, `GCalEventPayload`, `GCalSyncRequest`, `GCalSyncLog`, `GCalSyncStatus`, `GCalSyncResponse`).
  - `googleCalendarService.ts`: Serviço orquestrador desacoplado com trava de idempotência por `eventId`, controle de versionamento `eventVersion`, mapeamento de 7 eventos operacionais (`reservation.created`, `reservation.updated`, `reservation.cancelled`, `room.blocked`, `room.maintenance`, `housekeeping.task`, `custom.calendar.event`), atualização do PMS e retenção de auditoria por tenant.
  - `googleCalendarRouter.ts`: Endpoints Express REST (`POST /api/integration/google-calendar/sync`, `GET /status`, `GET /logs`) com contexto multi-tenant.
- **Integração com o ContextService da IA (`server/modules/ai/contextService.ts`)**:
  - Exposição de `googleCalendar` (resumo de ID do calendário, total sincronizados e status) em modo read-only no contexto dos Agentes de IA.

## [Milestone 5 - Etapa 5.2: Motor de Sincronização iCal Universal] - 2026-08-03

### Adicionado
- **Módulo iCal Universal Desacoplado (`server/modules/integration/ical/`)**:
  - `icalTypes.ts`: Tipos e contratos conforme norma RFC 5545 (`ICalEvent`, `ICalParseResult`, `ICalGenerateOptions`, `ICalFeedSummary`).
  - `icalParser.ts`: Parser iCalendar RFC 5545 puro com suporte a line unfolding, tratamento flexível de datas UTC/ISO (`parseICalDate`) e conversão de eventos para `CreateReservationDTO`.
  - `icalGenerator.ts`: Gerador de especificações RFC 5545 (`BEGIN:VCALENDAR`, `BEGIN:VEVENT`, `UID`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, `STATUS`) para exportação de calendários `.ics`.
  - `icalService.ts`: Serviço orquestrador de exportação por propriedade/UH, importação de feeds externos e controle de métricas.
  - `icalRouter.ts`: Endpoints Express REST (`GET /api/integration/ical/export/property/:propertyId`, `GET /export/unit/:unitId`, `POST /import`).
- **Resumo para Agentes de IA (`server/modules/ai/contextService.ts`)**:
  - Exposição de `icalFeed` (resumo de feeds ativos e timestamp de exportação/importação) em modo read-only no contexto dos Agentes.

## [Milestone 5 - Etapa 5.1: Módulo de Integração n8n & Aloha PMS Foundation] - 2026-08-03

### Adicionado
- **Arquitetura de Barramento de Integração n8n (ADR-005)**:
  - Criação da infraestrutura desacoplada para consumo de webhooks e payloads vindos do n8n (conectado ao Aloha PMS, iCal Universal e Google Calendar).
- **Tipagem e Módulos de Integração (`server/modules/integration/`)**:
  - `integrationTypes.ts`: Tipos para `N8nWebhookPayload`, `N8nEventType`, `AlohaReservationPayload`, `AlohaUnitStatusPayload`, `IngestionResult`, `N8nSyncLog`, `ICalSyncConfig` e `GCalSyncConfig`.
  - `eventNormalizer.ts`: Normalizador de payloads brutos do Aloha/OTAs para os DTOs internos do Synapse PMS (`toCreateReservationDTO`, `toUpdateUnitStatusDTO`, `normalizeSourceChannel`).
  - `alohaIntegrationService.ts`: Adaptador desacoplado para sanitização e validação de contratos do Aloha PMS sem acoplamento de regras de negócio.
  - `n8nService.ts`: Orquestrador central de eventos (`reservation.created`, `reservation.updated`, `reservation.cancelled`, `unit.status_changed`, `ical.sync_requested`, `gcal.sync_requested`) com log de auditoria em memória por tenant.
  - `n8nRouter.ts`: Endpoints REST (`POST /api/integration/n8n/webhook`, `GET /health`, `GET /logs`) com autenticação via token e contexto multi-tenant.
- **Integração com o ContextService de IA (`server/modules/ai/contextService.ts`)**:
  - `ContextService` atualizado para incluir resumo das métricas de sincronização e saúde do n8n (`totalEventsProcessed`, `lastSyncStatus`, `icalSyncStatus`, `gcalSyncStatus`) no contexto dos Agentes em modo somente leitura.

## [Milestone 4 - Etapa 4.3: Integração do PMS com os Agentes de IA] - 2026-08-03

### Adicionado
- **Integração do ContextService com Serviços do PMS (`server/modules/ai/contextService.ts`)**:
  - `ContextService` atualizado para consumir diretamente `pmsService` e `reservationService` (sem nunca acessar repositórios diretamente).
  - Leitura em tempo real e agregação de dados de inventário, categorias de acomodação, unidades hoteleiras (UHs), reservas e resumos de taxa de ocupação e governança.
  - Suporte estrito a isolamento multi-tenant (`organizationId` e `propertyId`).
- **Prompts Especializados dos Agentes Operacionais (`server/ai/promptRegistry.ts`)**:
  - Cadastradas definições formais para `reception_agent` (Agente de Recepção & Reservas) e `housekeeping_agent` (Agente de Governança & Manutenção), além dos agentes setoriais (`financial_agent`, `marketing_agent`, `synapse_copilot`).
  - Atualizada a função pura `compileSystemInstruction` para embutir o bloco de dados operacionais em tempo real do PMS no contexto do agente.
  - Regra de permissão estrita nos prompts: agentes operacionais atuam em modo **read-only**, sem permissão para criar, alterar ou cancelar reservas nesta etapa.
- **Aprimoramento de Palavras-Chave no Roteamento (`server/modules/ai/agentRouter.ts`)**:
  - Ampliação das palavras-chave do `housekeeping_agent` (termos de limpeza, higienização, vistoria, sujo/limpo, camareira) mantendo o roteamento 100% determinístico.

## [Milestone 4 - Etapa 4.2: Motor de Reservas (Reservation Core)] - 2026-08-03

### Adicionado
- **Modelagem de Domínio de Reservas (`server/modules/pms/reservationTypes.ts`)**:
  - Tipagem estrita para `Reservation`, `Guest`, `StayPeriod`, `ReservationStatus` (`confirmed`, `checked_in`, `checked_out`, `cancelled`, `no_show`), `ReservationSource`, `PaymentStatus` e DTOs de criação, edição e filtragem.
- **Camada de Repositório Transacional (`server/modules/pms/reservationRepository.ts`)**:
  - Interface `IReservationRepository` e implementação concreta `InMemoryReservationRepository`.
  - Método de busca de reservas conflitantes para cálculo de sobreposição de datas e prevenção de overbooking.
  - Método de abstração `runInTransaction` preparado para futura integração transacional (ex: Firestore `runTransaction`).
- **Serviço do Motor de Reservas (`server/modules/pms/reservationService.ts`)**:
  - Prevenção ativa de overbooking e validação estrita de conflitos de datas em tempo de criação.
  - Bloqueio imediato de criação de reservas para Unidades Hoteleiras inativas, em manutenção ou fora de serviço.
  - Validações de capacidade máxima da categoria de acomodação (adultos e total de hóspedes).
  - Cálculo automático de valor total estimado (diária base da categoria x número de noites) sem integrações de pagamento ou gateways.
  - Transições puras de estado: Check-in (`confirmed` -> `checked_in`) e Check-out (`checked_in` -> `checked_out`).
  - Mudança automática de estado da Unidade Hoteleira para `dirty` no Check-out para liberação da equipe de governança.
  - Fluxos de Cancelamento e No-Show com registro de observações.
- **Controlador REST HTTP (`server/modules/pms/reservationRouter.ts`)**:
  - Endpoints REST desacoplados sob `/api/pms/reservations` com suporte nativo a isolamento multi-tenant (`organizationId` e `propertyId`).
  - Acoplamento limpo no `pmsRouter.ts` como sub-roteador.

## [Milestone 4 - Etapa 4.1: Núcleo do PMS - Inventário de Acomodações & UHs] - 2026-08-03

### Adicionado
- **Tipagem e Contratos do PMS (`server/modules/pms/pmsTypes.ts`)**:
  - Definições estritas de `RoomCategory`, `RoomUnit`, `RoomStatus` (`clean`, `dirty`, `inspected`, `out_of_service`, `maintenance`), `BedType`, `CapacityConfig` e DTOs de mutação.
- **Camada de Repositório Desacoplada (`server/modules/pms/roomRepository.ts`)**:
  - Interface `IRoomRepository` e implementação concreta `InMemoryRoomRepository` com suporte nativo a tenant isolado por `organizationId` e `propertyId`.
  - Carga inicial (seed) para o hotel dev `Forest House Beach`.
- **Camada de Serviço e Regras de Negócio (`server/modules/pms/pmsService.ts`)**:
  - Validações de duplicação de códigos de categoria e números de UHs dentro da mesma propriedade.
  - Regras de consistência de capacidade e soft delete em cascata para categorias e UHs (`active: false`).
  - Cálculo de métricas e inventário em tempo real (`getInventorySummary`).
- **Controlador REST HTTP (`server/modules/pms/pmsRouter.ts`)**:
  - Endpoints REST desacoplados sob `/api/pms/*` com respostas padronizadas `{ success: true, data: ... }`.

### Modificado
- **Ponto de Composição HTTP (`server.ts`)**:
  - Registro e acoplamento do `pmsRouter` sem quebrar contratos existentes.

## [Milestone 3 - Etapa 3.4: Validação End-to-End, Regressão e Encerramento do Milestone 3] - 2026-08-03

### Adicionado
- **Bateria de Testes End-to-End e Regressão**:
  - Validação de isolamento de memória multi-tenant entre diferentes organizações.
  - Testes de truncamento FIFO e limpeza automática da `SessionMemory` (limite configurável de mensagens).
  - Teste de integração do orquestrador de IA (`aiOrchestrator`), roteador determinístico (`agentRouter`) e contexto desacoplado (`contextService`).
- **Encerramento Oficial do Milestone 3**:
  - Arquitetura de Memória Operacional, Contexto e Orquestração de IA validada com 100% de aprovação no Build e Lint.

## [Milestone 3 - Etapa 3.3: Synapse Agent Router & Roteamento Determinístico] - 2026-08-03

### Adicionado
- **Roteador Determinístico de Agentes (`server/modules/ai/agentRouter.ts`)**:
  - Novo módulo `AgentRouter` com regras explícitas e pontuação por correspondência de palavras-chave para os domínios de Recepção, Financeiro, Governança/Manutenção, Marketing e Copilot.
  - Avaliação de nível de confiança (`HIGH`, `MEDIUM`, `FALLBACK`) com detalhamento das palavras-chave identificadas.

### Modificado
- **Tipos de IA (`server/modules/ai/aiTypes.ts`)**:
  - Atualização da interface `AgentSelectionResult` para incluir confiança `MEDIUM` e array opcional `matchedKeywords`.
- **Adaptador de Compatibilidade (`server/modules/ai/agentSelector.ts`)**:
  - `AgentSelector` refatorado para delegar diretamente ao `AgentRouter`, preservando 100% da compatibilidade com código existente.
- **Orquestrador de IA (`server/modules/ai/aiOrchestrator.ts`)**:
  - Atualizado para utilizar o `AgentRouter` como ponto oficial de decisão de roteamento.

## [Milestone 3 - Etapa 3.2: Orquestrador de IA e Integração de Memória/Contexto] - 2026-08-03

### Adicionado
- **Orquestrador Unificado de IA (`server/modules/ai/aiOrchestrator.ts`)**:
  - Encapsulamento completo do fluxo de execução de IA: `AgentSelector` -> `ContextService` -> `SessionMemory` (User) -> `PromptRegistry` -> `@google/genai` -> `SessionMemory` (Assistant).
  - Suporte a retries automáticos com backoff exponencial para `429/RESOURCE_EXHAUSTED` e fallbacks limpos.
- **Endpoint Oficial do Copilot (`POST /api/ai/copilot`)**:
  - Novo endpoint HTTP para requisições do Copilot operacional com suporte nativo a `sessionId`, `organizationId`, `propertyId` e `userId`.

### Modificado
- **Compilador de Prompts (`server/ai/promptRegistry.ts`)**:
  - Atualizado para aceitar `OperationalContext` de forma totalmente pura, injetando metadados de tenant/propriedade/usuário no prompt sem consultar repositórios ou bancos.
- **Ponto de Composição HTTP (`server.ts`)**:
  - `runGeminiCoreExecution` refatorado para atuar como thin wrapper delegante para o `aiOrchestrator`.
  - Inclusão do endpoint `/api/ai/copilot`.

## [Milestone 3 - Etapa 3.1: Módulos Core de Memória e Contexto] - 2026-08-03

### Adicionado
- **Tipos de Memória e Contexto (`server/modules/ai/aiTypes.ts`)**:
  - Definição da constante configurável `DEFAULT_SESSION_HISTORY_LIMIT` (10 mensagens).
  - Interfaces `ChatMessage`, `SessionMemory`, `SessionMemoryRepository`, `OperationalContext` e `AgentSelectionResult`.
- **Repositório de Memória de Sessão (`server/modules/ai/sessionMemory.ts`)**:
  - Classe `InMemorySessionMemory` implementando a interface `SessionMemoryRepository`, permitindo troca futura para Firestore/Redis sem alterar chamadores.
  - Truncamento automático mantendo o limite configurado das N últimas mensagens.
- **Serviço de Contexto Operacional (`server/modules/ai/contextService.ts`)**:
  - Leitura desacoplada de dados do Tenant via `organizationRepository` sem duplicação de lógica.
  - Agregação do histórico recente mantendo responsabilidade estrita (retorna `OperationalContext` puro, sem interpolação de prompts).
- **Seletor Determinístico de Agentes (`server/modules/ai/agentSelector.ts`)**:
  - Mapeamento direto por agente explícito ou palavras-chave de intenção (recepção, financeiro, governança, marketing).
  - Fallback estruturado para `synapse_copilot` com retorno contendo `agentId`, `reason` e `confidence` ('HIGH' | 'FALLBACK').


## [Milestone 2 - Fundação SaaS Multi-Tenant] - 2026-08-03

### Adicionado
- **Estrutura de Módulos SaaS (`server/modules/saas/`)**:
  - `saasTypes.ts`: Definição de tipos e interfaces para Organization, Property, SaaSUser, IntegrationConfig, RBAC e Onboarding.
  - `organizationRepository.ts`: Camada de repositório e persistência com métodos CRUD isolados.
  - `organizationService.ts`: Serviço de domínio de negócio para onboarding e gestão de organizações/propriedades/usuários.
  - `integrationRegistry.ts`: Registro e gestão de metadados/status de integrações externas sem acoplamento de OAuth real.
  - `saasRouter.ts`: Roteador Express isolado montado no `server.ts` como ponto de composição.
- **Middlewares com Responsabilidade Única (`server/modules/saas/middlewares/`)**:
  - `authMiddleware.ts`: Autenticação e identificação de usuário via headers (`x-user-id` / token).
  - `tenantMiddleware.ts`: Resolução estrita de Tenant (`x-organization-id` / `x-tenant-id`) e Propriedade, com obrigatoriedade em produção e fallback de dev.
  - `rbacMiddleware.ts`: Controle de acesso baseado em papéis (Roles) e permissões granulares (`requirePermission`, `requireRole`).
- **Endpoint de Onboarding Completo (`POST /api/saas/onboarding`)**:
  - Processamento atômico que cria `Organization`, `Property` e `Owner User` com IDs independentes.
  - Retorno estruturado contendo `organization`, `property`, `owner`, `onboardingStatus` e `nextSteps`.

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
