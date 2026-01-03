import { Card, CardContent } from '@/components/ui/card';
import { Task, getTotalEffort, getAverageEffort, getCompletionRate, getTasksByStatus, getPriorityDistribution } from '@/data/tasks';
import { CheckCircle, Clock, Target, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

interface KPICardsProps {
  tasks: Task[];
}

export function KPICards({ tasks }: KPICardsProps) {
  const completionRate = getCompletionRate(tasks);
  const totalEffort = getTotalEffort(tasks);
  const averageEffort = getAverageEffort(tasks);
  const { ativas, concluidas } = getTasksByStatus(tasks);
  const priorityDist = getPriorityDistribution(tasks);
  
  const kpis = [
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      subtitle: `${concluidas} de ${tasks.length} tarefas`,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Esforço Total',
      value: `${totalEffort}h`,
      subtitle: 'Horas estimadas',
      icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Esforço Médio',
      value: `${averageEffort}h`,
      subtitle: 'Por tarefa',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Tarefas Ativas',
      value: ativas.toString(),
      subtitle: `${tasks.length > 0 ? Math.round((ativas / tasks.length) * 100) : 0}% do total`,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Distribution */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Distribuição por Prioridade</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(priorityDist).map(([priority, count]) => {
              const colors: Record<string, string> = {
                'Urgente': 'bg-destructive/10 text-destructive border-destructive/20',
                'Alta': 'bg-warning/10 text-warning border-warning/20',
                'Média': 'bg-info/10 text-info border-info/20',
                'Baixa': 'bg-success/10 text-success border-success/20',
                'Não definida': 'bg-muted text-muted-foreground border-muted-foreground/20',
              };
              return (
                <div
                  key={priority}
                  className={`px-3 py-2 rounded-lg border ${colors[priority]} flex items-center gap-2`}
                >
                  <span className="text-sm font-medium">{priority}</span>
                  <span className="text-lg font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
