# Changelog

Todos os desvios notáveis e implementações deste projeto serão documentados neste arquivo.

## [Milestone 10 - Etapa 10.2: Executive Copilot & Strategic Decision Intelligence] - 2026-08-04

### Adicionado
- **Módulo Executive Copilot (`server/modules/executiveCopilot/`)**:
  - `executiveCopilotTypes.ts`: Interfaces para `HealthScoreBreakdown`, `ExecutiveRisk`, `ExecutiveOpportunity`, `ExecutiveDailyBrief`, `ExecutiveCopilotDashboard` e `ExecutiveCopilotSummaryForAI`.
  - `executiveCopilotRepository.ts`: Repositório Multi-Tenant de análise quantitativa e diagnósticos 100% READ-ONLY que consome exclusivamente os serviços públicos de Executive Intelligence, Revenue, Marketing, Sales, Direct Booking, CRM, Recepção, Governança, Manutenção e PMS.
  - `executiveCopilotService.ts`: Serviço agregador que calcula o `Executive Health Score` (0–100), `Risk Score`, `Opportunity Score`, Healths setoriais, Top 10 riscos, Top 10 oportunidades, prioridades e o `Executive Daily Brief`.
  - `executiveCopilotRouter.ts`: Endpoints REST padronizados (`GET /api/executive-copilot/dashboard`, `/summary`, `/health`, `/risks`, `/opportunities`, `/brief`) protegidos por Rate Limiting e isolamento Multi-Tenant.
- **Injeção do Resumo do Copilot Executivo no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto ultra-compacto `executiveCopilotSummary` no `OperationalContext` fornecendo visão sintética de scores, top riscos (máx 5), top oportunidades (máx 5) e breve diário.
- **Agente de Copilot Executivo (`executive_copilot_agent`) e Roteamento Determinístico**:
  - Registro de `executive_copilot_agent` no `PromptRegistry` (`server/ai/promptRegistry.ts`) com diretrizes estritas em MODO CONSULTA / READ-ONLY para auxílio à diretoria, presidência e CEO.
  - Atualização do `AgentRouter` (`server/modules/ai/agentRouter.ts`) com mapeamento determinístico para os termos: `copilot`, `executive copilot`, `health score`, `executive score`, `risk score`, `opportunity score`, `executive dashboard`, `estratégia`, `prioridades`, `diretoria`, `presidência`, `ceo`, `gestão`, `decisão` e `brief`.
- **Documentação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Inclusão da tag `Executive Copilot & Strategic Decision` e documentação de todas as rotas `/executive-copilot/*`.
- **Suíte de Testes Automatizados (`server/modules/executiveCopilot/executiveCopilotService.test.ts`)**:
  - Validação completa (100% sucesso) do dashboard do Copilot, Health Scores, Riscos, Oportunidades, Executive Daily Brief, `executive_copilot_agent`, `AgentRouter` e `ContextService`.

## [Milestone 10 - Etapa 10.1: Executive Intelligence Foundation] - 2026-08-04

### Adicionado
- **Módulo Executive Intelligence (`server/modules/executive/`)**:
  - `executiveTypes.ts`: Interfaces para `ExecutiveKpis`, `ExecutiveAlert`, `ExecutivePriorities`, `ExecutiveSummaryModule`, `ExecutiveDashboard` e `ExecutiveSummaryForAI`.
  - `executiveRepository.ts`: Repositório Multi-Tenant de agregação 100% READ-ONLY que consolida métricas públicas dos serviços de Revenue, Marketing, Sales, Direct Booking, Recepção, Governança, Manutenção e PMS.
  - `executiveService.ts`: Camada de serviço agregadora que fornece dashboard unificado, KPIs da diretoria, alertas estratégicos, prioridades operacionais do dia e o resumo condensado `ExecutiveSummaryForAI`.
  - `executiveRouter.ts`: Endpoints REST padronizados (`GET /api/executive/dashboard`, `GET /api/executive/kpis`, `GET /api/executive/alerts`, `GET /api/executive/priorities`, `GET /api/executive/summary`) protegidos por Rate Limiting e cabeçalhos Multi-Tenant.
- **Injeção de Resumo Executivo no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto enxuto `executiveSummary` no `OperationalContext` fornecendo visão sintética de KPIs e prioridades sem estouro de contexto.
- **Agente de Diretoria e Roteamento Determinístico (`executive_agent`)**:
  - Registro do `executive_agent` no `PromptRegistry` (`server/ai/promptRegistry.ts`) com diretrizes estritas em MODO CONSULTA / READ-ONLY.
  - Atualização do `AgentRouter` (`server/modules/ai/agentRouter.ts`) com mapeamento determinístico para dúvidas sobre diretoria, gerência, dashboard, kpis, indicadores, estratégia, prioridades e riscos.
- **Documentação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Inclusão da tag `Inteligência Executiva & Diretoria` e documentação de todas as rotas `/executive/*`.
- **Suíte de Testes Automatizados (`server/modules/executive/executiveService.test.ts`)**:
  - Validação completa (100% sucesso) do dashboard, KPIs, alertas, prioridades, resumo para IA, `executive_agent`, `AgentRouter` e `ContextService`.

## [Milestone 9 - Etapa 9.4: Marketing Intelligence Foundation] - 2026-08-04

### Adicionado
- **Módulo Marketing Intelligence (`server/modules/marketing/`)**:
  - `marketingTypes.ts`: Interfaces para `MarketingSegmentSummary`, `CustomerJourneyMetrics`, `MarketGeographicInsight`, `ChannelPerformance`, `MarketingRetentionAnalysis`, `MarketingAlert`, `MarketingDashboard` e `MarketingSummaryForAI`.
  - `marketingRepository.ts`: Repositório Multi-Tenant READ-ONLY que agrega dados do CRM, Sales CRM, Direct Booking e ReservationService do Aloha PMS. Calcula segmentação inteligente (VIP, Recorrentes, Primeira Estadia, Corporate, Long Stay, Famílias, Casais, Internacionais, Blacklist, Aniversariantes, Inativos), Customer Journey, perfil geográfico, canais e retenção.
  - `marketingService.ts`: Serviço de inteligência analítica de marketing 100% READ-ONLY, oferecendo visões do dashboard, segmentos, jornada, mercados, canais, retenção/LTV e resumo enxuto para IA.
  - `marketingRouter.ts`: Endpoints REST padronizados (`GET /api/marketing/dashboard`, `GET /api/marketing/segments`, `GET /api/marketing/journey`, `GET /api/marketing/markets`, `GET /api/marketing/channels`, `GET /api/marketing/retention`) protegidos por Rate Limiting.
- **Injeção de Resumo de Marketing no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto enxuto `marketingSummary` no `OperationalContext` (Top Segmentos, Top Mercados, Taxa de Retenção, Recorrência, LTV estimado e alertas) sem envio de listas extensas.
- **Agente de Marketing e Roteamento Determinístico (`marketing_agent`)**:
  - Registro do `marketing_agent` em modo estritamente READ-ONLY no `PromptRegistry` (`server/ai/promptRegistry.ts`) com diretrizes explícitas proibindo envio de campanhas ou alterações externas.
  - Atualização do `AgentRouter` (`server/modules/ai/agentRouter.ts`) com palavras-chave de marketing (`marketing`, `campanha`, `segmentação`, `retenção`, `cliente`, `engajamento`, `mercado`, `perfil`, `recorrência`, `ltv`, `journey`).
- **Documentação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Inclusão da tag `Marketing Intelligence & Segmentação` e de todas as rotas `/marketing/*`.
- **Suíte de Testes Automatizados (`server/modules/marketing/marketingService.test.ts`)**:
  - Testes com 100% de cobertura para cálculo do dashboard, segmentos, jornada do cliente, retenção, LTV, `marketing_agent`, `ContextService` e `AgentRouter`.

## [Milestone 9 - Etapa 9.3: Sales CRM Intelligence Foundation] - 2026-08-04

### Adicionado
- **Módulo Sales CRM (`server/modules/sales/`)**:
  - `salesTypes.ts`: Interfaces para `SalesOpportunity`, `CommercialInteraction`, `NextFollowUp`, `SalesMetrics`, `SalesDashboard`, `SalesSummaryForAI` e DTOs de criação/atualização/agendamento.
  - `salesRepository.ts`: Repositório Multi-Tenant e em memória com suporte ao funil comercial completo (`lead`, `inquiry`, `opportunity`, `proposal`, `negotiation`, `won`, `lost`, `cancelled`), lead scoring (`cold`, `warm`, `hot`), origens multi-canal e controle de interações e follow-ups.
  - `salesService.ts`: Serviço de regras de negócio comerciais, cálculo de taxas de conversão, tempo médio de fechamento, valor total do pipeline e resumo enxuto para IA.
  - `salesRouter.ts`: Endpoints REST padronizados (`GET /api/sales/dashboard`, `GET /api/sales/metrics`, `GET /api/sales/opportunities`, `GET /api/sales/opportunities/:id`, `POST /api/sales/opportunities`, `PUT /api/sales/opportunities/:id`, `POST /api/sales/opportunities/:id/interactions`, `POST /api/sales/opportunities/:id/follow-up`) protegidos por Rate Limiting e cabeçalhos Multi-Tenant.
- **Injeção de Resumo de Vendas no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto enxuto `salesSummary` no `OperationalContext` (valor em pipeline, leads quentes, follow-ups atrasados, conversões e alertas) sem envio de listas completas.
- **Agente de Sales CRM e Roteamento Determinístico (`sales_agent`)**:
  - Registro do `sales_agent` em modo READ-ONLY no `PromptRegistry` (`server/ai/promptRegistry.ts`).
  - Atualização do `AgentRouter` (`server/modules/ai/agentRouter.ts`) com palavras-chave comerciais (`lead`, `pipeline`, `crm`, `vendas`, `negociação`, `follow-up`, `cliente`, `proposta`, `oportunidade`, `funil`).
- **Documentação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Inclusão da tag `Sales CRM & Gestão do Pipeline Commercial` e de todas as rotas `/sales/*`.
- **Suíte de Testes Automatizados (`server/modules/sales/salesService.test.ts`)**:
  - Testes com 100% de cobertura para cálculo de métricas, ciclo de vida da oportunidade, interações, follow-ups, `sales_agent`, `ContextService` e `AgentRouter`.

## [Milestone 9 - Etapa 9.2: Commercial CRM & Direct Booking Intelligence] - 2026-08-04

### Adicionado
- **Módulo Commercial CRM & Direct Booking Intelligence (`server/modules/directBooking/`)**:
  - `directBookingTypes.ts`: Interfaces para `CommercialProposal`, `DirectBookingMetrics`, `DirectBookingDashboard`, `DirectBookingSummaryForAI` e DTOs de criação/atualização.
  - `directBookingRepository.ts`: Repositório com suporte a Multi-Tenant e ciclo completo de vida de propostas comerciais (draft, sent, viewed, negotiating, accepted, rejected, expired).
  - `directBookingService.ts`: Serviço comercial para cotações, orçamentos, cálculo de conversões, tempo médio de fechamento, valor em aberto e auto-expiração de propostas.
  - `directBookingRouter.ts`: Endpoints REST padronizados (`GET /api/direct-booking/dashboard`, `GET /api/direct-booking/metrics`, `GET /api/direct-booking/proposals`, `POST /api/direct-booking/proposals`, `PUT /api/direct-booking/proposals/:proposalId`) protegidos com Rate Limiting e cabeçalhos Multi-Tenant.
- **Injeção de Resumo Comercial no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto enxuto `directBookingSummary` no `OperationalContext` (propostas abertas, taxa de conversão, receita em potencial e alertas comerciais) sem exceder limites de contexto.
- **Roteamento Determinístico e Agente de Reservas Diretas (`direct_booking_agent`)**:
  - Registro de `direct_booking_agent` em modo READ-ONLY em `PromptRegistry` (`server/ai/promptRegistry.ts`).
  - Adição de regras de roteamento determinístico em `AgentRouter` (`server/modules/ai/agentRouter.ts`) para `proposta`, `orçamento`, `cotação`, `vendas`, `negociação`, `follow-up`, `reserva direta` e `desconto`.
- **Atualização da Especificação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Documentação dos endpoints `/direct-booking/*` e schemas de propostas comerciais.
- **Suíte de Testes da Etapa 9.2 (`server/modules/directBooking/directBookingService.test.ts`)**:
  - Testes cobrindo criação, atualização, auto-expiração, cálculo de conversões, roteamento, PromptRegistry e injeção no ContextService.

## [Milestone 9 - Etapa 9.1: Revenue Intelligence Foundation] - 2026-08-04

### Adicionado
- **Módulo Dedicado de Revenue Intelligence (`server/modules/revenue/`)**:
  - `revenueTypes.ts`: Interfaces para KPIs comerciais, `RevenueDashboard`, `RevenueMetrics`, `ForecastDay`, `ChannelRevenue`, `CategoryRevenue`, `PropertyRevenue`, `WeekdayOccupancy` e `RevenueSummaryForAI`.
  - `revenueRepository.ts`: Camada de agregação de dados consumindo exclusivamente `reservationService` e `pmsService`, garantindo o princípio da menor alteração e desacoplamento sem acesso direto aos repositórios de banco de dados.
  - `revenueService.ts`: Motor analítico estritamente READ-ONLY para cálculo preciso de KPIs (Taxa de Ocupação Diária, Semanal e Mensal, ADR, RevPAR, LOS/Média de Permanência, Lead Time médio, Taxas de Cancelamento e No-Show, Pickup dos últimos 7 dias, Booking Pace e Forecast de Ocupação para 7, 15 e 30 dias).
  - `revenueRouter.ts`: Endpoints REST padronizados (`GET /api/revenue/dashboard`, `GET /api/revenue/metrics`, `GET /api/revenue/forecast`, `GET /api/revenue/channels`, `GET /api/revenue/categories`) protegidos com isolamento Multi-Tenant e Rate Limiting.
- **Injeção de Resumo Executivo no ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do objeto enxuto `revenueSummary` no `OperationalContext` (ocupação, ADR, RevPAR, forecast, canal principal, alertas e tendências) sem inflar prompts com tabelas brutas.
- **Roteamento Determinístico e Prompt para `revenue_agent`**:
  - Registro de `revenue_agent` em modo READ-ONLY em `PromptRegistry` (`server/ai/promptRegistry.ts`).
  - Adição de regras determinísticas em `AgentRouter` (`server/modules/ai/agentRouter.ts`) para termos como `revenue`, `adr`, `revpar`, `ocupação`, `forecast`, `diária média`, `booking pace` e `pickup`.
- **Atualização da Especificação OpenAPI 3.0 (`server/docs/openapi.json`)**:
  - Documentação completa dos novos endpoints `/revenue/*` e schemas associados no Swagger UI.
- **Suíte de Testes da Etapa 9.1 (`server/modules/revenue/revenueService.test.ts`)**:
  - Testes cobrindo 100% dos KPIs de Revenue, Forecast, Canais, Categorias, Roteamento do `revenue_agent`, `PromptRegistry` e `ContextService`.

## [Milestone 8 - Etapa 8.4: OpenAPI, Swagger & API Documentation] - 2026-08-04

### Adicionado
- **Especificação Completa OpenAPI 3.0.3 (`server/docs/openapi.json`)**:
  - Especificação OpenAPI 3.0.3 cobrindo 100% dos módulos do sistema: AI Orchestrator, PMS (Categorias, UHs, Inventário e Reservas), CRM (Hóspedes, Timeline e Intelligence), Recepção Copilot, Governança (Housekeeping), Manutenção, Integrações (n8n, iCal, Google Calendar), Health Probes e Métricas.
  - Componentes e Schemas reutilizáveis para `ErrorResponse`, `Pagination`, `Guest`, `GuestTimelineEvent`, `GuestIntelligence`, `Reservation`, `RoomCategory`, `RoomUnit`, `HousekeepingTask`, `MaintenanceTask`, `AIRequest`, `AIResponse`, `HealthStatus` e `MetricsSummary`.
  - Configuração rigorosa de esquemas de segurança JWT (`BearerAuth`) e cabeçalhos Multi-Tenant (`OrganizationHeader`, `PropertyHeader`, `X-Request-ID`, `X-Correlation-ID`).
  - Preparação para o padrão `/api/v1` em adição ao mapeamento legado `/api`.
- **Roteador e Interface Interativa Swagger UI (`server/routes/docsRouter.ts`)**:
  - Endpoint `GET /api/docs` servindo a interface interativa do Swagger UI integrada.
  - Endpoint `GET /api/docs/openapi.json` fornecendo a especificação JSON estruturada.
  - Mapeamento e registro oficial do roteador em `server.ts`.

## [Milestone 8 - Etapa 8.3: Performance, Context Cache & Runtime Metrics] - 2026-08-04

### Adicionado
- **Context Cache em Memória (`server/modules/ai/contextService.ts` & `server/config/cacheConfig.ts`)**:
  - Camada de cache em memória de altíssimo desempenho no `ContextService` com chaveamento composto por `organizationId:propertyId:userId:sessionId:activeGuestId`.
  - TTL padrão de 5 segundos configurável via `cacheConfig.DEFAULT_CONTEXT_CACHE_TTL`.
  - Invalidação automática e reativa em todas as mutações dos módulos PMS (`reservationService`, `pmsService`), CRM (`crmService`), Governança (`housekeepingService`), Manutenção (`maintenanceService`) e Integração n8n (`n8nService`).
  - Garantia estrita de isolamento multi-tenant (impossibilidade de vazar contexto entre tenants distintos).
- **Utilitário de Paginação Padronizado (`server/utils/pagination.ts`)**:
  - Helper puro `parsePaginationParams` e `paginateArray` com parâmetros `page`, `limit`, `sort` e `direction`.
  - Limites máximos configuráveis (`MAX_TIMELINE_PAGE_SIZE`, `MAX_LOG_PAGE_SIZE`, `MAX_HISTORY_PAGE_SIZE`) via `cacheConfig.ts`.
  - Integração nos endpoints do CRM (`GET /api/crm/guests`, `GET /api/crm/guests/:guestId/timeline`) e Integrações (`GET /api/integration/n8n/logs`).
- **Coletor e Endpoint de Métricas de Runtime (`server/utils/metricsCollector.ts` & `server/routes/metricsRouter.ts`)**:
  - Módulo singleton `metricsCollector` para rastreamento em tempo real de uptime, uso de memória (RSS, heapTotal, heapUsed), tempo médio de resposta HTTP, hits/misses/invalidações do cache de contexto, latência de execução dos agentes de IA e contadores de entidades locais.
  - Endpoint REST `GET /metrics` integrado ao Express em `server.ts`.
- **Instrumentação de Desempenho na IA (`server/modules/ai/aiOrchestrator.ts`)**:
  - Instrumentação do método `execute` no `AiOrchestrator` para registro preciso de duração de execução da IA e contagem de invocação.

### Adicionado
- **Central Error Handler Middleware (`server/middlewares/errorHandler.ts`)**:
  - Middleware global de tratamento de exceções com assinatura express de 4 parâmetros.
  - Padronização de respostas de erro no formato estrito: `{ success: false, code, message, details, timestamp, requestId, correlationId }`.
  - Tratamento estruturado de `AppError`, `ZodError`, falhas de parsing JSON e exceções não tratadas.
  - Ocultação automática de stack traces em ambiente de produção (`NODE_ENV === 'production'`).
- **Structured JSON Logger (`server/utils/logger.ts`)**:
  - Logger estruturado no formato JSON nativamente compatível com Google Cloud Logging (`timestamp`, `severity`, `level`, `message`, `module`, `requestId`, `correlationId`, `organizationId`, `propertyId`, etc.).
  - Contexto de requisição com propagação automática via `AsyncLocalStorage` (`runWithLogContext`).
- **Request ID & Correlation ID Middleware (`server/middlewares/correlationMiddleware.ts`)**:
  - Preservação ou geração automática de `X-Request-ID` e `X-Correlation-ID` com UUIDv4.
  - Anexo nos cabeçalhos de resposta HTTP e propagação para o contexto de logs e chamadas downstream.
  - Registro estruturado do ciclo de vida das requisições HTTP (`durationMs`, `statusCode`, `ip`, `userAgent`).
- **Endpoints de Health Checks Probes (`server/routes/healthRouter.ts`)**:
  - `GET /health/liveness`: Verificação de vitalidade do processo Node.js (uptime, timestamp e ambiente).
  - `GET /health/readiness`: Verificação local de prontidão do sistema sem chamadas externas (carregamento de ambiente, orquestrador de IA, módulos SaaS e integração n8n).

## [Milestone 8 - Etapa 8.1: Security Hardening] - 2026-08-04

### Adicionado
- **Módulo de Validação Zod (`server/middlewares/validationMiddleware.ts` & `server/schemas/routeSchemas.ts`)**:
  - Schemas de validação rigorosos com Zod para PMS (categorias e UHs), Reservas, Governança, Manutenção, CRM (hóspedes e estadias) e Execução de Agentes de IA.
  - Middleware de validação com sanitização e mensagens de erro estruturadas.
  - Aplicação do `validateRequest` nos roteadores do PMS, Reservas, Governança, Manutenção e CRM.
- **Validador de Ambiente Centralizado (`server/config/environment.ts`)**:
  - Schema Zod obrigatório para validar variáveis críticas (`NODE_ENV`, `PORT`, `GEMINI_API_KEY`, `JWT_SECRET`, `N8N_SECRET`, `ALOHA_API_KEY`) e Feature Flags.
  - Interrupção segura em ambiente de produção em caso de ausência de credenciais obrigatórias.
- **Middleware de Rate Limiting Configurável (`server/middlewares/rateLimitMiddleware.ts` & `server/config/rateLimitConfig.ts`)**:
  - Rate limiters independentes em memória para APIs de IA, endpoints REST, Webhooks, endpoints de Health Check e Documentação Swagger, configuráveis por variáveis de ambiente.
- **Prompt Injection Guard (`server/middlewares/promptGuardMiddleware.ts`)**:
  - Middleware de segurança com inspeção profunda para bloquear substituição ou sequestro de System Instructions, injeções conhecidas ("ignore previous instructions", "system prompt", etc.) e limitar payloads massivos (máx. 100KB) antes de processamento no LLM.
- **Configurações Centralizadas (`server/config/`)**:
  - `appConfig.ts`, `securityConfig.ts`, `rateLimitConfig.ts`, `cacheConfig.ts`, `aiConfig.ts` para eliminar constantes dispersas no código.

## [Milestone 7 - Etapa 7.3: Maintenance Intelligence] - 2026-08-03

### Adicionado
- **Módulo Maintenance Intelligence (`server/modules/maintenance/`)**:
  - `maintenanceTypes.ts`: Interfaces de domínio (`MaintenanceTask`, `MaintenanceStatus`, `MaintenanceCategory`, `MaintenancePriority`, `MaintenanceDashboardSummary`, `MaintenanceHistory`, DTOs e filtros).
  - `maintenanceRepository.ts`: Repositório com persistência em memória e isolamento multi-tenant (`organizationId`, `propertyId`).
  - `maintenanceService.ts`: Serviço de manutenção com ciclo completo de estados (`reported` -> `triage` -> `assigned` -> `in_progress` -> `waiting_parts` -> `inspection` -> `completed` -> `closed` / `cancelled`). Bloqueio automático de UH no PMS (`status = 'maintenance'`) ao abrir/iniciar reparos e liberação automática no término. Publicação de eventos na Guest Timeline quando associado a hóspede.
  - `maintenanceRouter.ts`: Endpoints REST (`GET /api/maintenance/tasks`, `POST /api/maintenance/tasks`, `PATCH /api/maintenance/tasks/:id`, `GET /api/maintenance/dashboard`, `GET /api/maintenance/history`).
- **Integração com ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão da propriedade `maintenanceDashboard` no objeto `pmsData` para visibilidade operacional read-only dos agentes de IA.
- **Atualização do Prompt Registry (`server/ai/promptRegistry.ts`)**:
  - Registro/Atualização do agente `maintenance_agent` (v1.0.0) em MODO ESTRITAMENTE READ-ONLY e compilação do bloco `Maintenance Intelligence Dashboard` na função `compileSystemInstruction`.

## [Milestone 7 - Etapa 7.2: Reception Copilot] - 2026-08-03

### Adicionado
- **Módulo Reception Copilot (`server/modules/reception/`)**:
  - `receptionTypes.ts`: Interfaces de domínio (`ReceptionDashboardSummary`, `ReceptionCheckinItem`, `ReceptionCheckoutItem`, `ReceptionSmartSuggestion`, `ReceptionDashboardData`).
  - `receptionService.ts`: Serviço agregador operacional para recepção. Consome exclusivamente os serviços existentes (`reservationService`, `pmsService`, `housekeepingService`, `crmService`, `guestIntelligenceService`) sem acesso direto a repositórios. Consolida resumos operacionais, check-ins, check-outs, chegadas atrasadas, pendências e gera sugestões inteligentes (VIPs, recorrentes, upgrades, upsell e alertas de governança).
  - `receptionRouter.ts`: Endpoints REST (`GET /api/reception/dashboard`, `GET /api/reception/checkins/today`, `GET /api/reception/checkouts/today`, `GET /api/reception/alerts`, `GET /api/reception/vips`).
- **Integração com ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão do bloco `receptionDashboard` em `pmsData` com resumos de check-ins, check-outs, pendências e alertas operacionais.
- **Atualização do Prompt Registry (`server/ai/promptRegistry.ts`)**:
  - Atualização do agente `reception_agent` (v1.2.0 - Reception Copilot) em MODO ESTRITAMENTE READ-ONLY e renderização das métricas do `Reception Copilot Dashboard` no `compileSystemInstruction`.

## [Milestone 7 - Etapa 7.1: Housekeeping Intelligence] - 2026-08-03

### Adicionado
- **Módulo Housekeeping Intelligence (`server/modules/housekeeping/`)**:
  - `housekeepingTypes.ts`: Estrutura do domínio de Governança (`HousekeepingTask`, `CleaningStatus`, `InspectionStatus`, `TaskPriority`, `HousekeepingDashboardSummary`, DTOs).
  - `housekeepingRepository.ts`: Repositório in-memory multi-tenant (`HousekeepingRepository`) com isolamento por `organizationId` e `propertyId`.
  - `housekeepingService.ts`: Serviço central de governança com máquina de estados operacional (`dirty` -> `assigned` -> `cleaning` -> `clean` -> `inspection` -> `available`), automação de tarefas no check-out, bloqueio para UHs em manutenção/fora de serviço, cancelamento com histórico preservado, publicação de eventos na Guest Timeline (`appendTimelineEvent`) e resumo do dashboard.
  - `housekeepingRouter.ts`: Endpoints REST (`GET /api/housekeeping/tasks`, `POST /api/housekeeping/tasks`, `PATCH /api/housekeeping/tasks/:id`, `GET /api/housekeeping/dashboard`).
- **Automação no PMS (`server/modules/pms/reservationService.ts`)**:
  - Disparo automático de `housekeepingService.createTaskForCheckout` ao realizar check-out em reservas.
- **Integração com o ContextService (`server/modules/ai/contextService.ts`)**:
  - Inclusão de `housekeeping` no `pmsData` com resumo de fila, unidades prioritárias e SLA médio para consumo read-only pelos agentes de IA.
- **Prompt Registry (`server/ai/promptRegistry.ts`)**:
  - Atualização do `compileSystemInstruction` e prompt do `housekeeping_agent` para apresentar dados em tempo real da governança.

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
