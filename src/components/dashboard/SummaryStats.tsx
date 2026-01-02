import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getTotalPecas, getTotalFormularios, getTotalEffort, getAverageEffort } from '@/data/tasks';
import { Boxes, FileText, Clock, BarChart2 } from 'lucide-react';

interface SummaryStatsProps {
  tasks: Task[];
}

export function SummaryStats({ tasks }: SummaryStatsProps) {
  const totalPecas = getTotalPecas(tasks);
  const totalFormularios = getTotalFormularios(tasks);
  const totalEffort = getTotalEffort(tasks);
  const avgEffort = getAverageEffort(tasks);

  const stats = [
    {
      label: 'Total de Peças',
      value: totalPecas,
      icon: Boxes,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'Total de Formulários',
      value: totalFormularios,
      icon: FileText,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Esforço Total',
      value: `${totalEffort}h`,
      icon: Clock,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Média por Tarefa',
      value: `${avgEffort}h`,
      icon: BarChart2,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Resumo de Produção</CardTitle>
        <CardDescription>Métricas de entregáveis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
