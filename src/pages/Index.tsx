import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { EtapaChart } from '@/components/dashboard/EtapaChart';
import { EffortChart } from '@/components/dashboard/EffortChart';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { tasks, getTasksByStatus, getTotalEffort, getTasksByPriority } from '@/data/tasks';

const Index = () => {
  const { ativas, concluidas } = getTasksByStatus();
  const totalEffort = getTotalEffort();
  const urgentTasks = getTasksByPriority().find(p => p.name === 'Urgente')?.value || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard de Tarefas</h1>
              <p className="text-muted-foreground mt-1">Controle e acompanhamento de atividades</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="text-sm font-medium">31/12/2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total de Tarefas"
            value={tasks.length}
            subtitle="Todas as tarefas cadastradas"
            icon={ListTodo}
            variant="primary"
          />
          <MetricCard
            title="Tarefas Ativas"
            value={ativas}
            subtitle={`${concluidas} concluídas`}
            icon={Clock}
          />
          <MetricCard
            title="Esforço Total"
            value={`${totalEffort}h`}
            subtitle="Horas estimadas"
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Urgentes"
            value={urgentTasks}
            subtitle="Tarefas prioritárias"
            icon={AlertTriangle}
            variant="warning"
          />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusChart />
          <PriorityChart />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EtapaChart />
          <EffortChart />
        </section>

        {/* Upcoming Tasks */}
        <section className="mb-8">
          <UpcomingTasks />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>Dashboard de Controle de Tarefas • Executor: Fernanda Boaventura</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
