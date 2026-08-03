import React, { useMemo } from 'react';
import { resetDb } from '../../../services/apiService';
import { DBState, Staff, BriefingAction, DashboardActionCard, TaskStatus, DailyBriefing, AdminSection } from '../../../types';
import { KPICard, DailyBriefingWidget } from './widgets';
import { DollarSign, Percent, TrendingUp, TrendingDown, Sparkles, Loader2, Lightbulb, Megaphone, ClipboardCheck, Star, Warehouse, ClipboardList, RefreshCw } from 'lucide-react';

interface GeneralAdminDashboardProps {
    db: DBState;
    currentUser: Staff;
    onBriefingAction: (action: BriefingAction) => void;
    dailyBriefing: DailyBriefing | null;
    isLoadingBriefing: boolean;
    dashboardActions: DashboardActionCard[];
    isLoadingActions: boolean;
    onNavigate: (section: AdminSection) => void;
}

export const GeneralAdminDashboard: React.FC<GeneralAdminDashboardProps> = ({ db, onBriefingAction, dailyBriefing, isLoadingBriefing, dashboardActions, isLoadingActions, onNavigate }) => {
    
    const summary = useMemo(() => {
        const totalBookingRevenue = db.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
        const totalPOSRevenue = db.transactions.reduce((sum, t) => sum + t.total, 0);
        const totalRevenue = totalBookingRevenue + totalPOSRevenue;
        const totalExpenses = db.expenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        const occupancyRate = (db.rooms.filter(r => r.status === 'Ocupado').length / db.rooms.length) * 100;
        return { totalRevenue, netProfit, occupancyRate };
    }, [db]);
    
    const iconMap: { [key: string]: React.ElementType } = {
        Megaphone, ClipboardCheck, TrendingUp, Lightbulb, Star, Warehouse, ClipboardList
    };

    const ActionCard: React.FC<{ card: DashboardActionCard }> = ({ card }) => {
        const Icon = iconMap[card.icon] || Lightbulb;
        return (
            <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col h-full" style={{borderRadius: 'var(--admin-card-radius)'}}>
                <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className="text-brand-green flex-shrink-0" />
                    <h4 className="font-bold text-gray-800">{card.title}</h4>
                </div>
                <p className="text-sm text-gray-600 flex-grow">{card.justification}</p>
                {card.action && (
                <button 
                    onClick={() => onBriefingAction(card.action)} 
                    className="mt-3 w-full bg-brand-dark text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-gray-700"
                    style={{ borderRadius: 'var(--admin-button-radius)'}}
                >
                    {card.action.label}
                </button>
                )}
            </div>
        );
    };

    const QuickAlertsWidget: React.FC = () => {
        const pendingReviews = db.reviews.filter(r => r.status === 'Pending');
        const lowStockItems = db.products.filter(p => p.stock <= p.lowStockThreshold);
        const overdueTasks = db.staffTasks.filter(t => t.endDate && new Date(t.endDate) < new Date() && t.status !== TaskStatus.DONE);
        const today = new Date().toISOString().split('T')[0];
        const checkInsToday = db.bookings.filter(b => b.checkIn === today);
        const checkOutsToday = db.bookings.filter(b => b.checkOut === today);

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border h-full flex flex-col" style={{ borderRadius: 'var(--admin-card-radius)'}}>
                <h3 className="font-semibold text-gray-700 mb-4 text-lg">Visão Rápida do Dia</h3>
                <div className="space-y-2">
                     <button onClick={() => onNavigate('calendar')} className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-left flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-gray-600"><TrendingUp size={16} className="text-green-500"/> Check-ins Hoje</span>
                        <span className="font-bold text-lg text-gray-800">{checkInsToday.length}</span>
                    </button>
                    <button onClick={() => onNavigate('calendar')} className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-left flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-gray-600"><TrendingDown size={16} className="text-red-500"/> Check-outs Hoje</span>
                        <span className="font-bold text-lg text-gray-800">{checkOutsToday.length}</span>
                    </button>
                    <div className="pt-3 border-t">
                        <h4 className="text-md font-semibold text-gray-700 mb-2">Alertas Acionáveis</h4>
                         <div className="space-y-2">
                            <button onClick={() => onNavigate('ai_strategy_consultant')} className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-left flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500"/> Avaliações Pendentes</span>
                                <span className={`font-bold px-2 py-0.5 rounded-full ${pendingReviews.length > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{pendingReviews.length}</span>
                            </button>
                            <button onClick={() => onNavigate('inventory')} className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-left flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><Warehouse size={16} className="text-red-500"/> Estoque Baixo</span>
                                <span className={`font-bold px-2 py-0.5 rounded-full ${lowStockItems.length > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{lowStockItems.length}</span>
                            </button>
                            <button onClick={() => onNavigate('projects')} className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-left flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><ClipboardList size={16} className="text-orange-500"/> Tarefas Atrasadas</span>
                                <span className={`font-bold px-2 py-0.5 rounded-full ${overdueTasks.length > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{overdueTasks.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <DailyBriefingWidget briefing={dailyBriefing} isLoading={isLoadingBriefing} onAction={onBriefingAction} />
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-6 xl:col-span-1">
                    <KPICard title="Receita Total" value={summary.totalRevenue.toFixed(2)} prefix="R$ " icon={DollarSign} />
                    <KPICard title="Lucro Líquido" value={summary.netProfit.toFixed(2)} prefix="R$ " icon={TrendingUp} />
                    <KPICard title="Ocupação Média" value={summary.occupancyRate.toFixed(1)} suffix="%" icon={Percent} />
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                        <Sparkles className="text-brand-green"/>
                        Comando Central SYNAPSE
                    </h2>
                    {isLoadingActions ? (
                        <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin text-brand-green" /></div>
                    ) : dashboardActions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dashboardActions.map((action, index) => <ActionCard key={index} card={action} />)}
                        </div>
                    ) : (
                         <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">
                            <p>Tudo em ordem! Nenhum alerta crítico da IA no momento.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <QuickAlertsWidget />
                    <button 
                        onClick={() => { if(confirm('Tem certeza? Isso irá resetar todos os dados para o estado inicial.')) resetDb(); }}
                        className="mt-6 w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
                    >
                        <RefreshCw size={16} />
                        Resetar Sistema
                    </button>
                </div>
            </div>
        </div>
    );
};