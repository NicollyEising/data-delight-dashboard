import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getTasksByMonth } from '@/data/tasks';
import { CalendarDays } from 'lucide-react';

interface TimelineChartProps {
  tasks: Task[];
}

export function TimelineChart({ tasks }: TimelineChartProps) {
  const data = getTasksByMonth(tasks);

  if (data.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-info/10">
              <CalendarDays className="h-4 w-4 text-info" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Tarefas por Mês</CardTitle>
              <CardDescription>Evolução temporal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <p className="text-muted-foreground">Sem dados de datas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-info/10">
            <CalendarDays className="h-4 w-4 text-info" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Tarefas Criadas por Mês</CardTitle>
            <CardDescription>Evolução temporal das demandas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ left: 10, right: 20, top: 10 }}>
            <defs>
              <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [value, 'Tarefas']}
            />
            <Area 
              type="monotone"
              dataKey="value" 
              stroke="hsl(215, 70%, 50%)"
              strokeWidth={2}
              fill="url(#timelineGradient)"
              name="Tarefas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
