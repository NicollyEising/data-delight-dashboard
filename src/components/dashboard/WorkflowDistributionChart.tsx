import { Task } from '@/data/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export function WorkflowDistributionChart({ tasks }: { tasks: Task[] }) {
  const map = new Map<string, { name: string; Ativa: number; Concluída: number; Cancelada: number; Pausada: number; Outro: number }>();
  tasks.forEach(t => {
    const f = t.fluxoTrabalho || '(sem fluxo)';
    const e = map.get(f) || { name: f, Ativa: 0, Concluída: 0, Cancelada: 0, Pausada: 0, Outro: 0 };
    if (t.situacao === 'Ativa') e.Ativa++;
    else if (t.situacao === 'Concluída') e.Concluída++;
    else if (t.situacao === 'Cancelada') e.Cancelada++;
    else if (t.situacao === 'Pausada') e.Pausada++;
    else e.Outro++;
    map.set(f, e);
  });
  const data = Array.from(map.values())
    .sort((a, b) => (b.Ativa + b.Concluída + b.Cancelada + b.Pausada + b.Outro) - (a.Ativa + a.Concluída + a.Cancelada + a.Pausada + a.Outro));

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Distribuição por Fluxo de Trabalho</CardTitle>
        <p className="text-xs text-muted-foreground">Tarefas por situação</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(300, data.length * 36)}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="Ativa" stackId="s" fill="hsl(var(--success))" />
            <Bar dataKey="Concluída" stackId="s" fill="hsl(var(--muted-foreground))" />
            <Bar dataKey="Pausada" stackId="s" fill="hsl(var(--warning))" />
            <Bar dataKey="Cancelada" stackId="s" fill="hsl(var(--destructive))" />
            <Bar dataKey="Outro" stackId="s" fill="hsl(var(--chart-5))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
