import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, getPecasFormulariosData } from '@/data/tasks';
import { Boxes } from 'lucide-react';

interface PecasFormulariosChartProps {
  tasks: Task[];
}

export function PecasFormulariosChart({ tasks }: PecasFormulariosChartProps) {
  const data = getPecasFormulariosData(tasks);

  if (data.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Boxes className="h-4 w-4 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Peças e Formulários</CardTitle>
              <CardDescription>Quantidade por tarefa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[280px]">
          <p className="text-muted-foreground">Sem dados de peças ou formulários</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-chart-1/10">
            <Boxes className="h-4 w-4 text-chart-1" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Peças e Formulários</CardTitle>
            <CardDescription>Quantidade por tarefa</CardDescription>
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
            <Legend 
              verticalAlign="top"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '16px' }}
            />
            <Bar 
              dataKey="pecas" 
              fill="hsl(215, 70%, 50%)"
              radius={[4, 4, 0, 0]}
              name="Peças"
            />
            <Bar 
              dataKey="formularios" 
              fill="hsl(160, 60%, 50%)"
              radius={[4, 4, 0, 0]}
              name="Formulários"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
