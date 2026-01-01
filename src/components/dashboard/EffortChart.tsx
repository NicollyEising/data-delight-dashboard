import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, getEffortByTask } from '@/data/tasks';

interface EffortChartProps {
  tasks: Task[];
}

export function EffortChart({ tasks }: EffortChartProps) {
  const data = getEffortByTask(tasks);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Esforço por Tarefa (horas)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={180}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [`${value}h`, 'Esforço']}
            />
            <Bar 
              dataKey="esforco" 
              fill="hsl(160, 60%, 45%)" 
              radius={[0, 4, 4, 0]}
              name="Esforço (h)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
