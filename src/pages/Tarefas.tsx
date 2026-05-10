import { useState } from 'react';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { EtapaChart } from '@/components/dashboard/EtapaChart';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { CompletionGauge } from '@/components/dashboard/CompletionGauge';
import { PecasFormulariosChart } from '@/components/dashboard/PecasFormulariosChart';
import { KPICards } from '@/components/dashboard/KPICards';
import { EtapaDonutChart } from '@/components/dashboard/EtapaDonutChart';
import { Top5EffortChart } from '@/components/dashboard/Top5EffortChart';
import { EffortTimelineChart } from '@/components/dashboard/EffortTimelineChart';
import { GanttChart } from '@/components/dashboard/GanttChart';
import { RiskAnalysisCard } from '@/components/dashboard/RiskAnalysisCard';
import { LoadByPersonChart } from '@/components/dashboard/LoadByPersonChart';
import { WorkflowDistributionChart } from '@/components/dashboard/WorkflowDistributionChart';
import { TasksFilterBar } from '@/components/dashboard/TasksFilterBar';
import { ViewSelector, ViewMode } from '@/components/dashboard/ViewSelector';
import { KanbanView } from '@/components/dashboard/KanbanView';
import { TasksTable } from '@/components/dashboard/TasksTable';
import { TaskDetailDrawer } from '@/components/dashboard/TaskDetailDrawer';
import { useTasks } from '@/hooks/useTasks';
import { useTasksFilters } from '@/hooks/useTasksFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, X } from 'lucide-react';
import { Task } from '@/data/tasks';
import { exportCsv } from '@/lib/exportCsv';

const Tarefas = () => {
  const { tasks, loading, error } = useTasks();
  const { filters, setFilters, filtered, options, reset } = useTasksFilters(tasks);
  const [view, setView] = useState<ViewMode>('cards');
  const [selected, setSelected] = useState<Task | null>(null);

  const handleExport = () => {
    const headers = [
      'Id', 'Situação', 'Tarefa', 'Tags', 'Workspace', 'Criada por', 'Criada em', 'Canal',
      'Fluxo de trabalho', 'Etapa', 'Responsável', 'Executor', 'Quantidade de peças',
      'Quantidade de formulários', 'Iniciar etapa em', 'Executar etapa até',
      'Concluir tarefa até', 'Restam (min)', 'Última resposta', 'Prioridade',
      'Esforço Realizado (min)', 'Origem', 'Orçamento', 'Valor previsto', 'Valor realizado',
      'atrasada', 'urgente', 'sem_responsavel'
    ];
    const rows = filtered.map(t => [
      t.id, t.situacao, t.tarefa, t.tags, t.workspace, t.criadaPor, t.criadaEm, t.canal,
      t.fluxoTrabalho, t.etapa, t.responsavel.join(', '), t.executor, t.quantidadePecas,
      t.quantidadeFormularios, t.iniciarEtapaEm, t.executarEtapaAte,
      t.concluirTarefaAte, t.restamMin, t.ultimaResposta, t.prioridade,
      t.esforcoRealizadoMin, t.origem, t.orcamento, t.valorPrevisto, t.valorRealizado,
      t.atrasada, t.urgente, t.semResponsavel
    ]);
    exportCsv('tarefas-export', headers, rows);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background to-muted/30 p-8">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const isEmpty = filtered.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard de Tarefas</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} de {tasks.length} tarefa(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar..."
                className="pl-8 pr-8 h-9 w-[220px]"
              />
              {filters.search && (
                <button onClick={() => setFilters({ ...filters, search: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <ViewSelector value={view} onChange={setView} />
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" /> Exportar
            </Button>
          </div>
        </div>

        <TasksFilterBar filters={filters} setFilters={setFilters} options={options} onReset={reset} />

        <section className="mb-8">
          <KPICards tasks={filtered} />
        </section>

        {isEmpty && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-lg font-medium text-foreground mb-2">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">Ajuste os filtros ou a busca para ver resultados</p>
            <Button variant="outline" size="sm" onClick={() => { reset(); setFilters({ ...filters, search: '' }); }}>
              Limpar filtros
            </Button>
          </div>
        )}

        {!isEmpty && view === 'kanban' && (
          <KanbanView tasks={filtered} onSelect={setSelected} />
        )}

        {!isEmpty && view === 'table' && (
          <TasksTable tasks={filtered} onSelect={setSelected} />
        )}

        {!isEmpty && view === 'cards' && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CompletionGauge tasks={filtered} />
              <StatusChart tasks={filtered} />
              <PriorityChart tasks={filtered} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <EtapaDonutChart tasks={filtered} />
              <Top5EffortChart tasks={filtered} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <EtapaChart tasks={filtered} />
              <EffortTimelineChart tasks={filtered} />
            </section>
            <section className="mb-8">
              <GanttChart tasks={filtered} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <LoadByPersonChart tasks={filtered} />
              <WorkflowDistributionChart tasks={filtered} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RiskAnalysisCard tasks={filtered} />
              <UpcomingTasks tasks={filtered} />
            </section>
            <section className="mb-8">
              <PecasFormulariosChart tasks={filtered} />
            </section>
          </>
        )}

        <TaskDetailDrawer task={selected} onClose={() => setSelected(null)} />
      </main>
    </div>
  );
};

export default Tarefas;
