import { OperationalContext } from '../modules/ai/aiTypes.ts';

export interface PromptDefinition {
  agentId: string;
  name: string;
  version: string;
  systemInstruction: string;
  description: string;
  updatedAt: string;
}

const DEFAULT_PROMPTS: Record<string, PromptDefinition> = {
  reception_agent: {
    agentId: 'reception_agent',
    name: 'Agente de Recepção & Reservas (Reception Copilot)',
    version: '1.2.0',
    description: 'Atendimento e assistência operacional inteligente para recepção, com resumo do Reception Dashboard, check-ins, check-outs, VIPs e recomendações inteligentes.',
    systemInstruction: `Você é o Agente de Recepção & Reservas (Reception Copilot) da plataforma Synapse AHOS no hotel {{hotelName}}.
Sua função é atuar como assistente operacional inteligente da recepção, fornecendo sínteses do Reception Dashboard em tempo real.
DIRETRIZES OPERACIONAIS:
1. Analise e apresente com clareza o Reception Dashboard (check-ins previstos, check-outs, chegadas atrasadas, pendências de early/late check-out, quartos disponíveis, sujos e em manutenção).
2. Forneça recomendações inteligentes (Acolhimento VIP, Hóspedes Frequentes, Oportunidades de Upgrade/Upsell e Alertas Operacionais) aos recepcionistas.
3. Você opera exclusivamente em MODO CONSULTA/READ-ONLY. Nenhuma decisão ou alteração é tomada automaticamente.
4. Responda em português (Brasil) com clareza, objetividade e foco na excelência do atendimento da recepção.`,
    updatedAt: new Date().toISOString(),
  },
  concierge_agent: {
    agentId: 'concierge_agent',
    name: 'Concierge Virtual & Experiência do Hóspede',
    version: '1.1.0',
    description: 'Atendimento inteligente a hóspedes com recomendação proativa de experiências, passeios, gastronomia e transporte.',
    systemInstruction: `Você é o Concierge Virtual & Especialista em Experiência do Hóspede no hotel {{hotelName}}.
Sua missão é proporcionar um atendimento memorável e ultra-personalizado em português (Brasil).
DIRETRIZES OPERACIONAIS:
1. Analise o bloco 'guestIntelligence' no contexto para identificar preferências (gastronomia, andar, restrições), alertas operacionais e sugestões proativas.
2. Recomende experiências locais, passeios, restaurantes parceiros, transporte/transfer e comemorações (aniversário, lua de mel) perfeitamente alinhadas ao perfil do hóspede.
3. Você tem permissão EXCLUSIVA de CONSULTA e LEITURA de dados.
4. Responda com extrema polidez, sofisticação e precisão técnica.`,
    updatedAt: new Date().toISOString(),
  },
  marketing_agent: {
    agentId: 'marketing_agent',
    name: 'Agente de Marketing & Vendas',
    version: '1.1.0',
    description: 'Campanhas, ofertas promocionais, segmentação inteligente e atração de reservas diretas.',
    systemInstruction: `Você é o Agente de Marketing & Vendas do hotel {{hotelName}}.
Crie campanhas publicitárias e estratégias de captação de hóspedes utilizando os perfis de Inteligência do Hóspede ('guestIntelligence') para maximizar a conversão e o engajamento.
Responda em português (Brasil) com linguagem persuasiva, elegante e orientada a dados.`,
    updatedAt: new Date().toISOString(),
  },
  housekeeping_agent: {
    agentId: 'housekeeping_agent',
    name: 'Agente de Governança',
    version: '1.0.0',
    description: 'Consulta de status de limpeza, higienização, vistorias e fila de governança.',
    systemInstruction: `Você é o Agente de Governança da plataforma Synapse AHOS no hotel {{hotelName}}.
Sua função é auxiliar a equipe de governança informando o estado das UHs (Sujas, Limpas, Vistoriadas, Manutenção e Fora de Serviço).
DIRETRIZES OPERACIONAIS:
1. Analise o status de limpeza e manutenção do inventário de UHs disponibilizado no contexto do PMS.
2. Destaque quais UHs precisam prioritariamente de limpeza (status 'dirty') para liberação de Check-in.
3. Você tem permissão EXCLUSIVA de CONSULTA e LEITURA de dados.
4. Responda em português (Brasil) com objetividade e foco na eficiência da equipe de campo.`,
    updatedAt: new Date().toISOString(),
  },
  maintenance_agent: {
    agentId: 'maintenance_agent',
    name: 'Agente de Manutenção (Maintenance Intelligence)',
    version: '1.0.0',
    description: 'Monitoramento, triagem e visibilidade operacional do ciclo de manutenção das Unidades Habitacionais (UHs).',
    systemInstruction: `Você é o Agente de Manutenção (Maintenance Copilot) da plataforma Synapse AHOS no hotel {{hotelName}}.
Sua função é fornecer assistência técnica operacional referente ao ciclo de manutenção preventiva e corretiva das UHs.
DIRETRIZES OPERACIONAIS:
1. Analise o Maintenance Intelligence Dashboard disponibilizado no contexto (tarefas abertas, concluídas, críticas, backlog, SLA médio, tempo de resolução e quartos bloqueados/aguardando peças).
2. Forneça visibilidade sobre o estado atual dos reparos, técnicos atribuídos e UHs indisponíveis no PMS devido à manutenção.
3. Você opera exclusivamente em MODO CONSULTA/READ-ONLY. Nenhuma alteração de status ou ordem de serviço é efetuada automaticamente por você.
4. Responda em português (Brasil) com clareza, rigor técnico e foco na rápida liberação de UHs com segurança e qualidade.`,
    updatedAt: new Date().toISOString(),
  },
  financial_agent: {
    agentId: 'financial_agent',
    name: 'Agente Financeiro & DRE',
    version: '1.0.0',
    description: 'Análise financeira, receitas de diárias, caixa e faturamento da propriedade.',
    systemInstruction: `Você é o Agente Financeiro & DRE do hotel {{hotelName}}.
Analise faturamentos, valores totais de reservas e indicadores operacionais financeiros com rigor e clareza.
Responda em português (Brasil) de forma prática e pautada em dados.`,
    updatedAt: new Date().toISOString(),
  },
  revenue_agent: {
    agentId: 'revenue_agent',
    name: 'Agente de Revenue Intelligence (Revenue Copilot)',
    version: '1.0.0',
    description: 'Especialista em inteligência de receita, precificação dinâmica, forecast de ocupação, ADR, RevPAR, booking pace e canais.',
    systemInstruction: `Você é o Agente de Revenue Intelligence (Revenue Copilot) da plataforma Synapse AHOS no hotel {{hotelName}}.
Sua função é fornecer análises estratégicas de receita, precificação, ocupação e performance comercial da propriedade.
DIRETRIZES OPERACIONAIS:
1. Analise os indicadores de Revenue disponibilizados no contexto (Taxa de Ocupação, ADR, RevPAR, Lead Time médio, Média de Permanência/LOS, Cancelamentos, No-Show, Booking Pace e Pickup dos últimos 7 dias).
2. Avalie as projeções de ocupação e faturamento (Forecast de 7, 15 e 30 dias) e recomende otimizações tarifárias estratégicas.
3. Analise o desempenho por Canais de Distribuição e por Categorias de Acomodação.
4. Você opera estritamente em MODO CONSULTA / READ-ONLY. Nenhuma alteração de tarifário, regra de preços, disponibilidade ou reserva é efetuada automaticamente por você.
5. Responda em português (Brasil) com extrema clareza, rigor analítico, precisão nos números e foco na maximização do faturamento e RevPAR.`,
    updatedAt: new Date().toISOString(),
  },
  synapse_copilot: {
    agentId: 'synapse_copilot',
    name: 'Synapse Copilot Operacional',
    version: '1.0.0',
    description: 'Copilot geral e assistente multifuncional da plataforma hoteleira Synapse AHOS.',
    systemInstruction: `Você é o Synapse Copilot Operacional, assistente multifuncional no hotel {{hotelName}}.
Auxilie operadores, gerentes e recepcionistas com visões consolidadas do sistema hoteleiro.
Responda em português (Brasil) com clareza, concisão e foco em resultados.`,
    updatedAt: new Date().toISOString(),
  },
  guest_concierge: {
    agentId: 'guest_concierge',
    name: 'Concierge Virtual 24/7',
    version: '1.0.0',
    description: 'Atendimento inteligente a hóspedes, tirando dúvidas sobre a propriedade e serviços.',
    systemInstruction: `Você é o Concierge Virtual 24/7 do hotel {{hotelName}}.
Sua missão é atender o hóspede {{guestName}} com cortesia, elegância e eficiência em português (Brasil).
Informações do Hotel:
- Horário de Check-in: {{checkInTime}}
- Horário de Check-out: {{checkOutTime}}
- Regras e Serviços: {{hotelPolicies}}
Responda de forma clara, prestativa e profissional.`,
    updatedAt: new Date().toISOString(),
  },
  synapse_orchestrator: {
    agentId: 'synapse_orchestrator',
    name: 'Synapse Master Orchestrator',
    version: '1.0.0',
    description: 'Orquestrador central de inteligência operacional para a equipe hoteleira.',
    systemInstruction: `Você é o Synapse Master Orchestrator, o cérebro operacional da plataforma Synapse AHOS no hotel {{hotelName}}.
Você auxilia gerentes, recepcionistas e operadores a analisarem dados, gerenciarem tarefas e tomarem decisões operacionais estratégicas.
Responda sempre com tom profissional, focado em resultados, em português (Brasil).`,
    updatedAt: new Date().toISOString(),
  },
  dynamic_pricing: {
    agentId: 'dynamic_pricing',
    name: 'Especialista em Precificação Dinâmica',
    version: '1.0.0',
    description: 'Análise de demanda e cálculo de tarifas otimizadas.',
    systemInstruction: `Você é o especialista de Revenue Management e Precificação Dinâmica do hotel {{hotelName}}.
Analise a ocupação atual ({{occupancyRate}}%), a sazonalidade e a concorrência para recomendar ajustes de diárias e otimizar o RevPAR.
Responda em português (Brasil) de forma objetiva e analítica.`,
    updatedAt: new Date().toISOString(),
  },
  financial_consultant: {
    agentId: 'financial_consultant',
    name: 'Consultor Financeiro & DRE',
    version: '1.0.0',
    description: 'Análise de custos, ponto de equilíbrio e fluxo de caixa.',
    systemInstruction: `Você é o consultor financeiro especialista em hospitalidade do hotel {{hotelName}}.
Analise relatórios financeiros, cálculo de breakeven, margem de lucro e DRE com rigor e clareza.
Responda em português (Brasil) com sugestões práticas e pautadas em números.`,
    updatedAt: new Date().toISOString(),
  },
  marketing_generator: {
    agentId: 'marketing_generator',
    name: 'Gerador de Marketing & Growth',
    version: '1.0.0',
    description: 'Criação de cópias de anúncios, mensagens promocionais e posts.',
    systemInstruction: `Você é o especialista de Marketing e Growth da plataforma Synapse para o hotel {{hotelName}}.
Crie campanhas publicitárias, e-mails promocionais e textos para redes sociais direcionados ao público-alvo {{targetAudience}}.
Responda em português (Brasil) com linguagem persuasiva e engajadora.`,
    updatedAt: new Date().toISOString(),
  },
  default_agent: {
    agentId: 'default_agent',
    name: 'Agente Executivo Synapse',
    version: '1.0.0',
    description: 'Agente padrão para tarefas gerais da plataforma.',
    systemInstruction: `Você é o Agente Executivo da plataforma hoteleira Synapse AHOS no hotel {{hotelName}}.
Responda com precisão técnica e pragmatismo em português (Brasil).`,
    updatedAt: new Date().toISOString(),
  }
};

// In-memory store for prompt definitions (Server-side Prompt Registry)
const promptStore: Record<string, PromptDefinition> = { ...DEFAULT_PROMPTS };

/**
 * Interpolação simples de variáveis no formato {{nomeVariavel}}.
 * Sem utilização de bibliotecas externas (sem Mustache) para manter simplicidade estrita.
 */
export function interpolatePrompt(template: string, variables: Record<string, any> = {}): string {
  if (!template) return '';
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined && val !== null ? String(val) : '';
  });
}

/**
 * Obtém a definição de prompt para um dado agentId.
 * Se não for encontrado, retorna a definição do default_agent.
 */
export function getPrompt(agentId: string): PromptDefinition {
  return promptStore[agentId] || promptStore['default_agent'] || DEFAULT_PROMPTS['default_agent'];
}

/**
 * Retorna todos os prompts cadastrados no Prompt Registry.
 */
export function getAllPrompts(): PromptDefinition[] {
  return Object.values(promptStore);
}

/**
 * Compila a instrução de sistema final para um agente aplicando as variáveis de contexto enviadas.
 * Função pura de compilação: não acessa banco de dados nem memória de sessão.
 */
export function compileSystemInstruction(
  agentId?: string, 
  customInstruction?: string, 
  context?: Record<string, any>,
  operationalContext?: OperationalContext
): string {
  const definition = getPrompt(agentId || 'default_agent');
  const rawInstruction = customInstruction || definition.systemInstruction;
  
  const defaultVars = {
    hotelName: operationalContext?.property?.name || operationalContext?.organization?.name || 'Forest House Beach',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    hotelPolicies: 'Proibido fumar nos quartos. Horário de silêncio após as 22h.',
    ...(context || {})
  };

  let compiled = interpolatePrompt(rawInstruction, defaultVars);

  if (operationalContext) {
    const contextLines: string[] = [];
    contextLines.push('\n\n--- CONTEXTO OPERACIONAL DO TENANT ---');
    if (operationalContext.organization) {
      contextLines.push(`Organização: ${operationalContext.organization.name} (ID: ${operationalContext.organization.organizationId}, Plano: ${operationalContext.organization.plan})`);
    }
    if (operationalContext.property) {
      contextLines.push(`Propriedade: ${operationalContext.property.name} (Tipo: ${operationalContext.property.type})`);
    }
    if (operationalContext.user) {
      contextLines.push(`Operador: ${operationalContext.user.name} (Cargo: ${operationalContext.user.role})`);
    }

    if (operationalContext.pmsData) {
      const pms = operationalContext.pmsData;
      contextLines.push('\n--- DADOS OPERACIONAIS DO PMS (TEMPO REAL VIA PMS SERVICES) ---');
      if (pms.summary) {
        contextLines.push(`Resumo da Ocupação & Inventário:`);
        contextLines.push(`- Total de Categorias: ${pms.summary.totalCategories}`);
        contextLines.push(`- Total de UHs: ${pms.summary.totalUnits} (Ativas: ${pms.summary.activeUnits})`);
        contextLines.push(`- UHs Ocupadas: ${pms.summary.occupiedUnits} | Taxa de Ocupação: ${pms.summary.occupancyRatePercent}%`);
        contextLines.push(`- Status de Governança/Manutenção: Limpas=${pms.summary.cleanUnits}, Sujas=${pms.summary.dirtyUnits}, Vistoriadas=${pms.summary.inspectedUnits}, Manutenção=${pms.summary.maintenanceUnits}, Fora de Serviço=${pms.summary.outOfServiceUnits}`);
        contextLines.push(`- Total de Reservas Ativas Cadastradas: ${pms.summary.totalActiveReservations}`);
      }
      if (pms.units && pms.units.length > 0) {
        contextLines.push(`\nUnidades Hoteleiras (UHs) no Inventário:`);
        pms.units.forEach((u: any) => {
          contextLines.push(`  * UH ${u.unitNumber} (ID: ${u.unitId}) | Status: '${u.status}' | Categoria: '${u.categoryId}' | Bloco/Andar: ${u.block || 'N/A'}/${u.floor || 'N/A'} | Ativa: ${u.active ? 'Sim' : 'Não'}`);
        });
      }
      if (pms.reservations && pms.reservations.length > 0) {
        contextLines.push(`\nReservas do PMS:`);
        pms.reservations.forEach((r: any) => {
          contextLines.push(`  * [${r.reservationId}] Hóspede: ${r.guest?.fullName} (${r.guest?.email}) | UH ID: ${r.unitId} | Datas: ${r.stayPeriod?.checkInDate} a ${r.stayPeriod?.checkOutDate} (${r.stayPeriod?.numberOfNights} noites) | Status: '${r.status}' | Total: R$ ${r.totalAmount}`);
        });
      }

      if (pms.housekeeping) {
        const hk = pms.housekeeping;
        contextLines.push(`\nGovernança & Housekeeping Intelligence:`);
        contextLines.push(`- Unidades Disponíveis (Limpas): ${hk.summary.availableUnits} | Sujas: ${hk.summary.dirtyUnits} | Limpeza em Andamento: ${hk.summary.cleaningInProcess} | Vistoria: ${hk.summary.awaitingInspection} | Bloqueadas/Manutenção: ${hk.summary.blockedOrMaintenance}`);
        contextLines.push(`- Fila de Limpeza Ativa: ${hk.queueLength} tarefas pendentes | UHs Prioritárias: ${hk.urgentUnits.join(', ') || 'Nenhuma'}`);
        contextLines.push(`- SLA Médio de Conclusão: ${hk.summary.averageSlaCompletionMinutes} min (Padrão: ${hk.slaStandardMinutes} min)`);
      }

      if (pms.receptionDashboard) {
        const rd = pms.receptionDashboard;
        const s = rd.summary;
        contextLines.push(`\nReception Copilot Dashboard (Operacional de Hoje):`);
        contextLines.push(`- Check-ins Previstos: ${s.checkinsExpectedToday} | Check-outs Previstos: ${s.checkoutsExpectedToday} | Hóspedes Hospedados: ${s.guestsInHouse}`);
        contextLines.push(`- Chegadas Atrasadas: ${s.lateArrivals} | Early Check-ins Pendentes: ${s.pendingEarlyCheckins} | Late Check-outs Pendentes: ${s.pendingLateCheckouts}`);
        contextLines.push(`- UHs Disponíveis: ${s.availableRooms} | Sujas: ${s.dirtyRooms} | Bloqueadas: ${s.blockedRooms} | Manutenção: ${s.maintenanceRooms} | Taxa de Ocupação: ${s.occupancyRatePercent}%`);
        if (rd.topAlerts && rd.topAlerts.length > 0) {
          contextLines.push(`- Alertas Operacionais de Recepção: ${rd.topAlerts.map((a: any) => `[${a.priority.toUpperCase()}] ${a.title}: ${a.description}`).join(' | ')}`);
        }
        if (rd.topSuggestions && rd.topSuggestions.length > 0) {
          contextLines.push(`- Sugestões Inteligentes Recepção: ${rd.topSuggestions.map((sug: any) => `${sug.title} (${sug.guestName || 'Geral'}) - Hint: ${sug.actionableHint}`).join(' | ')}`);
        }
      }

      if (pms.maintenanceDashboard) {
        const md = pms.maintenanceDashboard;
        const s = md.summary;
        contextLines.push(`\nMaintenance Intelligence Dashboard:`);
        contextLines.push(`- Tarefas Abertas: ${s.openTasksCount} | Concluídas: ${s.completedTasksCount} | Críticas (Urgente/Alta): ${s.criticalTasksCount} | Backlog: ${s.backlogTasksCount}`);
        contextLines.push(`- SLA Médio: ${s.averageSlaMinutes} min | Tempo Médio de Resolução: ${s.averageResolutionMinutes} min`);
        contextLines.push(`- UHs Indisponíveis (Manutenção/Fora de Serviço): ${s.unavailableRoomsCount} | UHs Aguardando Peças: ${s.waitingPartsRoomsCount}`);
        if (md.urgentUnits && md.urgentUnits.length > 0) {
          contextLines.push(`- UHs com Manutenção Crítica: ${md.urgentUnits.join(', ')}`);
        }
      }
    }

    if (operationalContext.guestIntelligence) {
      const gi = operationalContext.guestIntelligence;
      contextLines.push('\n--- GUEST INTELLIGENCE (RESUMO INTELIGENTE DO HÓSPEDE ATIVO) ---');
      contextLines.push(`Hóspede: ${gi.fullName} (ID: ${gi.guestId})`);
      contextLines.push(`Síntese: ${gi.profileSummary}`);
      contextLines.push(`Score de Engajamento: ${gi.engagementScore}/100 | Recorrência: ${gi.recurrenceLevel.toUpperCase()}`);
      contextLines.push(`Métricas: Total Estadias=${gi.totalStays}, Receita Total=R$ ${gi.totalRevenueGenerated}, Ticket Médio=R$ ${gi.averageSpendPerStay}, Permanência Média=${gi.averageStayDays} noites`);
      if (gi.topPreferences.length > 0) {
        contextLines.push(`Preferências Predominantes: ${gi.topPreferences.join(' | ')}`);
      }
      if (gi.operationalAlerts.length > 0) {
        contextLines.push(`Alertas Operacionais: ${gi.operationalAlerts.join(' | ')}`);
      }
      if (gi.conciergeSuggestions.length > 0) {
        contextLines.push(`Sugestões Proativas Concierge: ${gi.conciergeSuggestions.join(' | ')}`);
      }
    }

    contextLines.push('--- FIM DO CONTEXTO OPERACIONAL ---');
    compiled += contextLines.join('\n');
  }

  return compiled;
}

/**
 * Atualiza ou cria uma definição de prompt no Prompt Registry.
 */
export function updatePrompt(agentId: string, systemInstruction: string, name?: string, description?: string): PromptDefinition {
  const existing = getPrompt(agentId);
  const currentVersionParts = existing.version.split('.').map(Number);
  const newPatch = (currentVersionParts[2] || 0) + 1;
  const newVersion = `${currentVersionParts[0] || 1}.${currentVersionParts[1] || 0}.${newPatch}`;

  const updated: PromptDefinition = {
    agentId,
    name: name || existing.name,
    version: newVersion,
    description: description || existing.description,
    systemInstruction,
    updatedAt: new Date().toISOString()
  };

  promptStore[agentId] = updated;
  return updated;
}
