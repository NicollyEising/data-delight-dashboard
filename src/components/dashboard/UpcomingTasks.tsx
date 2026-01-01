import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, getUpcomingTasks, getPrioridadeLabel } from '@/data/tasks';
import { Calendar, AlertCircle } from 'lucide-react';

const priorityColors: Record<string, string> = {
  Urgente: 'bg-destructive text-destructive-foreground',
  Alta: 'bg-warning text-warning-foreground',
  Média: 'bg-primary text-primary-foreground',
  Baixa: 'bg-success text-success-foreground',
  'Não definida': 'bg-muted text-muted-foreground',
};

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const upcomingTasks = getUpcomingTasks(tasks);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [day, month, year] = dateStr.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const isOverdue = (dateStr: string) => {
    if (!dateStr) return false;
    const [day, month, year] = dateStr.split('/');
    const taskDate = new Date(Number(year), Number(month) - 1, Number(day));
    return taskDate < new Date();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximas Tarefas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingTasks.map((task) => {
            const prioridadeLabel = getPrioridadeLabel(task.prioridade);
            return (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.tarefa}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{task.etapa}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{task.esforco}h</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge className={priorityColors[prioridadeLabel]} variant="secondary">
                    {prioridadeLabel}
                  </Badge>
                  <div className={`flex items-center gap-1 text-xs ${isOverdue(task.concluirTarefaAte) ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isOverdue(task.concluirTarefaAte) && <AlertCircle className="h-3 w-3" />}
                    {formatDate(task.concluirTarefaAte)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
