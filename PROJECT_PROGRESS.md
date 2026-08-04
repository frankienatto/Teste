# Progresso do Projeto Synapse AHOS

## Estrutura Oficial de Milestones (Marcos)

### MILESTONE 1 — Núcleo de IA Estável [CONCLUÍDO & CONSOLIDADO]
- [x] **Sprint 01**: Execução e Proxificação Server-Side de IA (Segurança & Isolamento de Credenciais)
- [x] **Sprint 02**: Prompt Registry Server-Side & Desacoplamento de Prompts
- [x] **Consolidação do Milestone 1**: Unificação do Pipeline de IA (`runGeminiCoreExecution`), eliminação de duplicidades e redirecionamento interno das rotas legadas.

---

### MILESTONE 2 — Fundação SaaS Multi-Tenant [CONCLUÍDO]
- [x] **Arquitetura Módulo SaaS**: Estrutura modular em `server/modules/saas/`.
- [x] **Domínio Organization e Property**: Separação clara de tenants e propriedades com IDs independentes.
- [x] **Camada de Repositório (`organizationRepository`)**: Desacoplamento da persistência e suporte a operações CRUD.
- [x] **Serviço de Onboarding (`organizationService`)**: Provisionamento atômico de Organization, Property e Owner User sem criar agentes automaticamente. Retorno completo de status e próximos passos.
- [x] **Gestão de Usuários e RBAC**: Papéis (`UserRole`) e permissões granulares (`Permission`) validadas via middleware.
- [x] **Middlewares com Responsabilidade Única**: `authMiddleware`, `tenantMiddleware` (com obrigatoriedade em produção e fallback de dev), `rbacMiddleware`.
- [x] **IntegrationRegistry**: Registro e gestão de status/metadados de integrações externas sem acoplamento de OAuth.
- [x] **Composição de Rotas**: `saasRouter` Express montado no `server.ts`.

---

### MILESTONE 3 — Memória Operacional, Contexto e Orquestração de IA [CONCLUÍDO]
- [x] **Etapa 3.1**: Módulos Core de Memória, Contexto e Seleção de Agentes (`SessionMemory`, `ContextService`, `AgentSelector`).
- [x] **Etapa 3.2**: Orquestrador Unificado de IA (`aiOrchestrator`), Integração de Memória Operacional/Contexto com `PromptRegistry` e criação de `POST /api/ai/copilot`.
- [x] **Etapa 3.3**: Synapse Agent Router com Roteamento Determinístico por Palavras-Chave e Níveis de Confiança (`agentRouter`).
- [x] **Etapa 3.4**: Validação End-to-End, Testes de Regressão e Encerramento Oficial do Milestone 3.

---

### MILESTONE 4 — Núcleo do PMS (Property Management System) [CONCLUÍDO]
- [x] **Etapa 4.1**: Núcleo do PMS - Inventário de Acomodações & UHs (`RoomCategory`, `RoomUnit`, `RoomStatus`, `IRoomRepository`, `InMemoryRoomRepository`, `pmsService`, `pmsRouter`).
- [x] **Etapa 4.2**: Motor de Reservas (Reservation Core) (`Reservation`, `Guest`, `StayPeriod`, `IReservationRepository`, `InMemoryReservationRepository`, `reservationService`, `reservationRouter`, prevenção atômica de overbooking, bloqueio de UHs inativas/em manutenção, transições de estado Check-in/Check-out/Cancelamento/No-Show).
- [x] **Etapa 4.3**: Integração do PMS com os Agentes de IA (Alimentação do `ContextService` via `pmsService` e `reservationService`, prompts especializados de `reception_agent` e `housekeeping_agent`, permissão em modo read-only de consulta sem mutação de dados operacionais e suporte total a multi-tenant).

---

### MILESTONE 5 — Barramento de Integração n8n, Aloha PMS, iCal Universal & Google Calendar [CONCLUÍDO]
- [x] **Etapa 5.1**: Módulo de Integração n8n & Normalização de Payloads (`integrationTypes`, `eventNormalizer`, `alohaIntegrationService`, `n8nService`, `n8nRouter`, ingestão de eventos do Aloha PMS, auditoria por tenant e alimentação do `ContextService`).
- [x] **Etapa 5.2**: Motor de Sincronização iCal Universal (`icalTypes`, `icalParser` RFC 5545, `icalGenerator`, `icalService`, `icalRouter`, exportação de feeds `.ics` por UH/propriedade, importação/parsing de calendários externos e alimentação read-only do `ContextService`).
- [x] **Etapa 5.3**: Integração com Google Calendar API via n8n (`googleCalendarTypes`, `googleCalendarService`, `googleCalendarRouter`, suporte a 7 tipos de eventos operacionais, trava de idempotência, versionamento, logs de auditoria e métricas read-only no `ContextService`).

---

### MILESTONE 6 — CRM Inteligente, Regras de Fidelidade & Automação de Marketing [EM ANDAMENTO]
- [x] **Etapa 6.1**: CRM Inteligente de Hóspedes - Guest CRM Foundation (`guestTypes`, `guestRepository`, `crmService`, `crmRouter`, perfil do hóspede unificado em nível de `Organization`, deduplicação automática por e-mail/documento, classificação dinâmica de hóspedes `standard` -> `frequent` -> `vip`, histórico de estadias multi-propriedade, métricas de receita acumulada e integração read-only com `ContextService`).
- [x] **Etapa 6.2**: Guest Timeline & Perfil 360° (`timelineTypes`, `timelineRepository`, `timelineService`, `crmRouter`, publicação de eventos Event-Driven via `appendTimelineEvent`, origens explícitas `pms`, `crm`, `n8n`, `aloha`, `google_calendar`, `ical`, `ai_agent`, `user`, `system`, metadata flexível `Record<string, unknown>`, Perfil 360° completo `Guest360Profile`, retenção FIFO com teto de 200 eventos por hóspede e resumo enxuto no `ContextService` para IA).
- [ ] **Etapa 6.3**: Segmentação de Clientes & Automações de Marketing (Email/WhatsApp via n8n).

---

## Status Atual da Plataforma
- **Build**: ✅ Aprovado
- **Lint**: ✅ Aprovado
- **Segurança**: Chaves e SDK do Gemini 100% isolados no servidor.
- **Pipeline de IA**: Unificado via `aiOrchestrator` e `agentRouter`.
- **Arquitetura SaaS**: Multi-Tenant desacoplado com RBAC, Repository, Onboarding e Middlewares de responsabilidade única.
- **Milestone 3**: 100% Concluído e testado end-to-end com isolamento de tenant e retenção FIFO de sessão.
- **Milestone 4 (Etapas 4.1, 4.2 e 4.3)**: 100% Concluído e validado com inventário de UHs, motor de reservas, prevenção atômica de overbooking e integração completa com os Agentes de IA (`reception_agent` e `housekeeping_agent`).
- **Milestone 5 (Etapas 5.1, 5.2 e 5.3)**: 100% Concluído e validado com o Barramento de Integração n8n, adaptador Aloha PMS, motor iCal Universal (RFC 5545), Google Calendar Foundation via n8n, endpoints REST `/api/integration/n8n`, `/api/integration/ical`, `/api/integration/google-calendar` e suporte read-only no `ContextService` da IA.
- **Milestone 6 (Etapas 6.1 e 6.2)**: 100% Concluído e validado com o módulo Guest CRM Foundation, Guest Timeline & Perfil 360°, retenção FIFO de 200 eventos por hóspede, publicação Event-Driven com origens explícitas, endpoints REST `/api/crm/guests/:guestId/360` e `/api/crm/guests/:guestId/timeline` e resumo enxuto no `ContextService` da IA.
- **Arquitetura Atualizada**: Channel Manager Próprio eliminado/substituído pela camada inteligente sobre Aloha PMS + n8n + iCal + Google Calendar (ADR-005).

