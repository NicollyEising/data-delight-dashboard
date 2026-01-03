import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Task, getRiskAnalysis, getEffortByMonth } from '@/data/tasks';
import { AlertTriangle, AlertCircle, Users, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RiskAnalysisCardProps {
  tasks: Task[];
}

export function RiskAnalysisCard({ tasks }: RiskAnalysisCardProps) {
  const risk = getRiskAnalysis(tasks);
  const monthlyData = getEffortByMonth(tasks);

  const getRiskLevel = (percent: number) => {
    if (percent >= 50) return { label: 'Alto', color: 'text-destructive', bgColor: 'bg-destructive' };
    if (percent >= 25) return { label: 'Médio', color: 'text-warning', bgColor: 'bg-warning' };
    return { label: 'Baixo', color: 'text-success', bgColor: 'bg-success' };
  };

  const noPriorityRisk = getRiskLevel(risk.noPriorityPercent);
  const concentrationRisk = getRiskLevel(risk.concentrationPercent);
  const highEffortRisk = getRiskLevel(risk.highEffortPercent);

  const risks = [
    {
      title: 'Sem prioridade definida',
      value: risk.noPriorityPercent,
      risk: noPriorityRisk,
      icon: AlertTriangle,
      description: 'Tarefas sem classificação de urgência',
    },
    {
      title: 'Concentração em executor',
      value: risk.concentrationPercent,
      risk: concentrationRisk,
      icon: Users,
      description: 'Tarefas concentradas em um executor',
    },
    {
      title: 'Alto esforço (>10h)',
      value: risk.highEffortPercent,
      risk: highEffortRisk,
      icon: Clock,
      description: 'Tarefas com esforço acima de 10 horas',
    },
  ];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Análise de Risco</CardTitle>
            <CardDescription>Indicadores de atenção</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {risks.map((item) => (
          <div key={item.title} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.risk.color}`} />
                <span className="text-sm font-medium text-foreground">{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${item.risk.color}`}>{item.value}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.risk.bgColor}/10 ${item.risk.color}`}>
                  {item.risk.label}
                </span>
              </div>
            </div>
            <Progress value={item.value} className="h-2" />
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}

        {risk.overdueCount > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {risk.overdueCount} tarefa(s) com prazo vencido
              </span>
            </div>
          </div>
        )}

        {/* Monthly breakdown */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Análise Temporal</h4>
          <div className="grid grid-cols-3 gap-2">
            {monthlyData.map((month) => (
              <div key={month.name} className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{month.name}</p>
                <p className="text-lg font-bold text-foreground">{month.tarefas}</p>
                <p className="text-xs text-muted-foreground">{month.esforco}h</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
