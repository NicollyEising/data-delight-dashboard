import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Task, getTasksByEtapa } from '@/data/tasks';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(215 60% 65%)',
  'hsl(160 50% 55%)',
];

interface EtapaDonutChartProps {
  tasks: Task[];
}

export function EtapaDonutChart({ tasks }: EtapaDonutChartProps) {
  const data = getTasksByEtapa(tasks);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const dataWithPercent = data.map(d => ({
    ...d,
    percent: total > 0 ? Math.round((d.value / total) * 100) : 0
  }));

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Distribuição por Etapa</CardTitle>
        <CardDescription>Análise, Briefing, Planejamento, Revisão</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercent}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent}%`}
                labelLine={false}
              >
                {dataWithPercent.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [`${value} tarefas (${dataWithPercent.find(d => d.name === name)?.percent}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {dataWithPercent.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">
                {entry.name} ({entry.percent}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
