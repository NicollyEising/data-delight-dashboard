import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getTasksByCriador } from '@/data/tasks';
import { UserPlus } from 'lucide-react';

const COLORS = [
  'hsl(280, 60%, 55%)',
  'hsl(280, 60%, 60%)',
  'hsl(280, 60%, 65%)',
  'hsl(280, 60%, 70%)',
  'hsl(280, 60%, 75%)',
];

interface CriadorChartProps {
  tasks: Task[];
}

export function CriadorChart({ tasks }: CriadorChartProps) {
  const data = getTasksByCriador(tasks);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-chart-5/10">
            <UserPlus className="h-4 w-4 text-chart-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Tarefas por Criador</CardTitle>
            <CardDescription>Quem criou as tarefas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: 'hsl(var(--foreground))'
              }}
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 6, 6, 0]}
              name="Tarefas"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
