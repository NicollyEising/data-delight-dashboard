import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getCompletionRate, getTasksByStatus } from '@/data/tasks';
import { TrendingUp } from 'lucide-react';

interface CompletionGaugeProps {
  tasks: Task[];
}

export function CompletionGauge({ tasks }: CompletionGaugeProps) {
  const completionRate = getCompletionRate(tasks);
  const { ativas, concluidas } = getTasksByStatus(tasks);
  
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Taxa de Conclusão</CardTitle>
            <CardDescription>Progresso geral das tarefas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{completionRate}%</span>
            <span className="text-xs text-muted-foreground">concluído</span>
          </div>
        </div>
        <div className="flex gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{ativas}</div>
            <div className="text-xs text-muted-foreground">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{concluidas}</div>
            <div className="text-xs text-muted-foreground">Concluídas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
