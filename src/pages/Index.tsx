import { StatusChart } from '@/components/dashboard/StatusChart';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { EtapaChart } from '@/components/dashboard/EtapaChart';
import { EffortChart } from '@/components/dashboard/EffortChart';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { ExecutorChart } from '@/components/dashboard/ExecutorChart';
import { CanalChart } from '@/components/dashboard/CanalChart';
import { CompletionGauge } from '@/components/dashboard/CompletionGauge';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { OrigemChart } from '@/components/dashboard/OrigemChart';
import { CriadorChart } from '@/components/dashboard/CriadorChart';
import { PecasFormulariosChart } from '@/components/dashboard/PecasFormulariosChart';
import { TimelineChart } from '@/components/dashboard/TimelineChart';
import { SummaryStats } from '@/components/dashboard/SummaryStats';
import { useTasks } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-8">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard de Tarefas</h1>
                <p className="text-sm text-muted-foreground">Controle e acompanhamento de atividades</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Última atualização</p>
              <p className="text-sm font-semibold text-foreground">31/12/2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <StatsOverview tasks={tasks} />
        </section>

        {/* Row 1: Gauge + Status + Priority */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <CompletionGauge tasks={tasks} />
          <StatusChart tasks={tasks} />
          <PriorityChart tasks={tasks} />
        </section>

        {/* Row 2: Etapa + Effort */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EtapaChart tasks={tasks} />
          <EffortChart tasks={tasks} />
        </section>

        {/* Row 3: Executor + Canal */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExecutorChart tasks={tasks} />
          <CanalChart tasks={tasks} />
        </section>

        {/* Row 4: Origem + Criador */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <OrigemChart tasks={tasks} />
          <CriadorChart tasks={tasks} />
        </section>

        {/* Row 5: Timeline + Peças/Formulários */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TimelineChart tasks={tasks} />
          <PecasFormulariosChart tasks={tasks} />
        </section>

        {/* Row 6: Summary Stats + Upcoming Tasks */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SummaryStats tasks={tasks} />
          <UpcomingTasks tasks={tasks} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border/50">
          <p>Dashboard de Controle de Tarefas • Workspace: {tasks[0]?.workspace || 'Teste'}</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
