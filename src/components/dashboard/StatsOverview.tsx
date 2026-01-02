import { Card, CardContent } from "@/components/ui/card";
import { Task, getTotalEffort, getAverageEffort, getTasksByStatus, getTasksByPriority } from '@/data/tasks';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface StatsOverviewProps {
  tasks: Task[];
}

export function StatsOverview({ tasks }: StatsOverviewProps) {
  const { ativas, concluidas } = getTasksByStatus(tasks);
  const totalEffort = getTotalEffort(tasks);
  const avgEffort = getAverageEffort(tasks);
  const urgentTasks = getTasksByPriority(tasks).find(p => p.name === 'Urgente')?.value || 0;

  const stats = [
    {
      title: 'Total de Tarefas',
      value: tasks.length,
      icon: ListTodo,
      color: 'from-primary to-primary/80',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Tarefas Ativas',
      value: ativas,
      subtitle: `${concluidas} concluídas`,
      icon: Clock,
      color: 'from-info to-info/80',
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
    {
      title: 'Esforço Total',
      value: `${totalEffort}h`,
      subtitle: `Média: ${avgEffort}h/tarefa`,
      icon: TrendingUp,
      color: 'from-success to-success/80',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Urgentes',
      value: urgentTasks,
      subtitle: 'Prioridade máxima',
      icon: AlertTriangle,
      color: 'from-warning to-warning/80',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className="shadow-lg border-0 bg-gradient-to-br from-card to-card/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
