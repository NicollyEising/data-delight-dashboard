import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { EtapaChart } from '@/components/dashboard/EtapaChart';
import { EffortChart } from '@/components/dashboard/EffortChart';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { getTasksByStatus, getTotalEffort, getTasksByPriority } from '@/data/tasks';
import { useTasks } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { ativas, concluidas } = getTasksByStatus(tasks);
  const totalEffort = getTotalEffort(tasks);
  const urgentTasks = getTasksByPriority(tasks).find(p => p.name === 'Urgente')?.value || 0;

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
          <StatusChart tasks={tasks} />
          <PriorityChart tasks={tasks} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EtapaChart tasks={tasks} />
          <EffortChart tasks={tasks} />
        </section>

        {/* Upcoming Tasks */}
        <section className="mb-8">
          <UpcomingTasks tasks={tasks} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>Dashboard de Controle de Tarefas • Workspace: {tasks[0]?.workspace || 'Teste'}</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
