import { Task } from '@/data/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export function LoadByPersonChart({ tasks }: { tasks: Task[] }) {
  const map = new Map<string, { name: string; responsavel: number; executor: number }>();
  tasks.forEach(t => {
    t.responsavel.forEach(r => {
      const e = map.get(r) || { name: r, responsavel: 0, executor: 0 };
      e.responsavel++; map.set(r, e);
    });
    if (t.executor) {
      const e = map.get(t.executor) || { name: t.executor, responsavel: 0, executor: 0 };
      e.executor++; map.set(t.executor, e);
    }
  });
  const data = Array.from(map.values())
    .sort((a, b) => (b.responsavel + b.executor) - (a.responsavel + a.executor))
    .slice(0, 15);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Carga por pessoa</CardTitle>
        <p className="text-xs text-muted-foreground">Top 15 — Responsável vs Executor</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(300, data.length * 32)}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="responsavel" name="Como Responsável" fill="hsl(var(--primary))" />
            <Bar dataKey="executor" name="Como Executor" fill="hsl(var(--success))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
