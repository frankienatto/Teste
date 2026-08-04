import { Router, Request, Response } from 'express';
import { strategyService } from './strategyService.ts';

export const strategyRouter = Router();

/**
 * GET /api/strategy/dashboard
 * Retorna o dashboard completo do módulo Strategic Simulation & Explainable AI
 */
strategyRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.headers['x-organization-id'] as string) || (req.query.organizationId as string) || 'org_dev_default';
    const propertyId = (req.headers['x-property-id'] as string) || (req.query.propertyId as string) || 'prop_dev_default';

    const dashboard = await strategyService.getDashboard(organizationId, propertyId);
    return res.status(200).json(dashboard);
  } catch (error: any) {
    console.error('❌ [StrategyRouter] Erro ao obter dashboard:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar dashboard de estratégia e simulação.' });
  }
});

/**
 * GET /api/strategy/scenarios
 * Retorna os cenários de simulação "What If"
 */
strategyRouter.get('/scenarios', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.headers['x-organization-id'] as string) || (req.query.organizationId as string) || 'org_dev_default';
    const propertyId = (req.headers['x-property-id'] as string) || (req.query.propertyId as string) || 'prop_dev_default';

    const scenarios = await strategyService.getScenarios(organizationId, propertyId);
    return res.status(200).json(scenarios);
  } catch (error: any) {
    console.error('❌ [StrategyRouter] Erro ao obter cenários:', error);
    return res.status(500).json({ error: 'Erro interno ao obter cenários de simulação.' });
  }
});

/**
 * POST /api/strategy/simulate
 * Recebe parâmetros de simulação e retorna projeção em memória sem alterar nenhum dado
 */
strategyRouter.post('/simulate', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.headers['x-organization-id'] as string) || (req.body.organizationId as string) || 'org_dev_default';
    const propertyId = (req.headers['x-property-id'] as string) || (req.body.propertyId as string) || 'prop_dev_default';

    const result = await strategyService.simulate(req.body, organizationId, propertyId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('❌ [StrategyRouter] Erro ao executar simulação:', error);
    return res.status(500).json({ error: 'Erro interno ao executar simulação em memória.' });
  }
});

/**
 * GET /api/strategy/summary
 * Retorna o resumo para IA (strategySummary)
 */
strategyRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.headers['x-organization-id'] as string) || (req.query.organizationId as string) || 'org_dev_default';
    const propertyId = (req.headers['x-property-id'] as string) || (req.query.propertyId as string) || 'prop_dev_default';

    const summary = await strategyService.getStrategySummaryForAI(organizationId, propertyId);
    return res.status(200).json(summary);
  } catch (error: any) {
    console.error('❌ [StrategyRouter] Erro ao obter resumo:', error);
    return res.status(500).json({ error: 'Erro interno ao obter resumo estratégico.' });
  }
});
