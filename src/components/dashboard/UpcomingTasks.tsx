import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUpcomingTasks } from '@/data/tasks';
import { Calendar, AlertCircle } from 'lucide-react';

const priorityColors = {
  Urgente: 'bg-destructive text-destructive-foreground',
  Alta: 'bg-warning text-warning-foreground',
  Média: 'bg-primary text-primary-foreground',
  Baixa: 'bg-success text-success-foreground',
};

export function UpcomingTasks() {
  const tasks = getUpcomingTasks();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr) < new Date();
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
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{task.titulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{task.etapa}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{task.esforco}h</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge className={priorityColors[task.prioridade]} variant="secondary">
                  {task.prioridade}
                </Badge>
                <div className={`flex items-center gap-1 text-xs ${isOverdue(task.concluirAte) ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {isOverdue(task.concluirAte) && <AlertCircle className="h-3 w-3" />}
                  {formatDate(task.concluirAte)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
