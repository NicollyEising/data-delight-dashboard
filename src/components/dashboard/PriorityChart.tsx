import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getTasksByPriority } from '@/data/tasks';
import { Flag } from 'lucide-react';

const COLORS: Record<string, string> = {
  'Urgente': 'hsl(0, 72%, 55%)',
  'Alta': 'hsl(45, 90%, 55%)',
  'Média': 'hsl(215, 70%, 55%)',
  'Baixa': 'hsl(160, 60%, 50%)',
  'Não definida': 'hsl(210, 15%, 60%)',
};

interface PriorityChartProps {
  tasks: Task[];
}

export function PriorityChart({ tasks }: PriorityChartProps) {
  const data = getTasksByPriority(tasks);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Flag className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Tarefas por Prioridade</CardTitle>
            <CardDescription>Níveis de urgência</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              name="Tarefas"
            >
              {data.map((entry) => (
                <Cell 
                  key={`cell-${entry.name}`} 
                  fill={COLORS[entry.name] || COLORS['Não definida']} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
