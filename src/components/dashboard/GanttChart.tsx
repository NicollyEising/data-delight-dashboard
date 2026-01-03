import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Task, getGanttData } from '@/data/tasks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GanttChartProps {
  tasks: Task[];
}

const ETAPA_COLORS: Record<string, string> = {
  'Análise': 'bg-chart-1',
  'Briefing': 'bg-chart-2',
  'Planejamento': 'bg-chart-3',
  'Revisão': 'bg-chart-4',
  'Execução': 'bg-chart-5',
};

const PRIORITY_BORDERS: Record<string, string> = {
  'Urgente': 'border-l-destructive',
  'Alta': 'border-l-warning',
  'Média': 'border-l-info',
  'Baixa': 'border-l-success',
};

export function GanttChart({ tasks }: GanttChartProps) {
  const ganttData = getGanttData(tasks);
  
  if (ganttData.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Cronograma de Tarefas</CardTitle>
          <CardDescription>Visualização temporal dos prazos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Sem dados de cronograma disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  // Find date range
  const allDates = ganttData.flatMap(t => [t.start, t.end].filter(Boolean) as Date[]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getBarPosition = (start: Date | null, end: Date | null) => {
    const startPos = start 
      ? ((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100
      : 0;
    const endPos = end 
      ? ((end.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100
      : 100;
    const width = Math.max(endPos - startPos, 5);
    return { left: `${Math.max(0, startPos)}%`, width: `${Math.min(width, 100 - startPos)}%` };
  };

  // Generate month markers
  const months: { name: string; position: number }[] = [];
  const currentMonth = new Date(minDate);
  while (currentMonth <= maxDate) {
    const position = ((currentMonth.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    months.push({
      name: currentMonth.toLocaleDateString('pt-BR', { month: 'short' }),
      position
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Cronograma de Tarefas</CardTitle>
        <CardDescription>Visualização temporal dos prazos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header with months */}
          <div className="relative h-6 mb-3 border-b border-border">
            {months.map((month, i) => (
              <span
                key={i}
                className="absolute text-xs text-muted-foreground"
                style={{ left: `${month.position}%` }}
              >
                {month.name}
              </span>
            ))}
          </div>

          {/* Task rows */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {ganttData.slice(0, 10).map((task) => {
              const { left, width } = getBarPosition(task.start, task.end);
              const etapaColor = ETAPA_COLORS[task.etapa] || 'bg-primary';
              const priorityBorder = PRIORITY_BORDERS[task.prioridade] || 'border-l-muted';
              const isCompleted = task.situacao === 'Concluída';

              return (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3">
                        <div className="w-[140px] shrink-0 truncate text-xs text-muted-foreground">
                          {task.name}
                        </div>
                        <div className="flex-1 relative h-7 bg-muted/30 rounded">
                          <div
                            className={`absolute h-full rounded border-l-4 ${etapaColor} ${priorityBorder} ${isCompleted ? 'opacity-50' : ''}`}
                            style={{ left, width }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <div className="space-y-1">
                        <p className="font-medium">{task.fullName}</p>
                        <p className="text-xs">Etapa: {task.etapa}</p>
                        <p className="text-xs">Prioridade: {task.prioridade || 'Não definida'}</p>
                        <p className="text-xs">Início: {formatDate(task.start)}</p>
                        <p className="text-xs">Fim: {formatDate(task.end)}</p>
                        <p className="text-xs">Esforço: {task.esforco}h</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border mt-4">
            {Object.entries(ETAPA_COLORS).map(([etapa, color]) => (
              <div key={etapa} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${color}`} />
                <span className="text-xs text-muted-foreground">{etapa}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
