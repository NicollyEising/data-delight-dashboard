import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getEffortByTask } from '@/data/tasks';
import { Timer } from 'lucide-react';

interface EffortChartProps {
  tasks: Task[];
}

export function EffortChart({ tasks }: EffortChartProps) {
  const data = getEffortByTask(tasks);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <Timer className="h-4 w-4 text-success" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Esforço por Tarefa</CardTitle>
            <CardDescription>Horas estimadas de trabalho</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ left: 10, right: 20, top: 10 }}>
            <defs>
              <linearGradient id="effortGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 50%)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(160, 60%, 50%)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={9}
              tickLine={false}
              axisLine={false}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [`${value}h`, 'Esforço']}
            />
            <Area 
              type="monotone"
              dataKey="esforco" 
              stroke="hsl(160, 60%, 50%)"
              strokeWidth={2}
              fill="url(#effortGradient)"
              name="Esforço (h)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
