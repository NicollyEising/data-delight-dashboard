import { useMemo, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/data/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { exportCsv } from '@/lib/exportCsv';
import { formatBRL, formatDate } from '@/lib/ekyteParser';
import { Search, Download, X, FolderKanban, Activity, AlertTriangle, DollarSign, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, LabelList,
} from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Projetos = () => {
  const { projects, loading, error } = useProjects();
  const [search, setSearch] = useState('');
  const [workspace, setWorkspace] = useState<string>('all');
  const [situacao, setSituacao] = useState<string>('all');
  const [responsavel, setResponsavel] = useState<string>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const workspaces = useMemo(() => Array.from(new Set(projects.map(p => p.workspace))).sort(), [projects]);
  const situacoes = useMemo(() => Array.from(new Set(projects.map(p => p.situacao))).sort(), [projects]);
  const responsaveis = useMemo(() => Array.from(new Set(projects.map(p => p.responsavel))).sort(), [projects]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter(p => {
      if (workspace !== 'all' && p.workspace !== workspace) return false;
      if (situacao !== 'all' && p.situacao !== situacao) return false;
      if (responsavel !== 'all' && p.responsavel !== responsavel) return false;
      if (q && !(p.projeto.toLowerCase().includes(q) || p.identificacao.toLowerCase().includes(q) || p.responsavel.toLowerCase().includes(q) || p.workspace.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [projects, search, workspace, situacao, responsavel]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const ativos = filtered.filter(p => p.ativo).length;
    const concluidos = filtered.filter(p => p.situacao === 'Concluído').length;
    const tarefasAtras = filtered.reduce((s, p) => s + p.tarefasAtrasadas, 0);
    const piPrev = filtered.reduce((s, p) => s + p.piPrevisto, 0);
    const piReal = filtered.reduce((s, p) => s + p.piRealizado, 0);
    const horasPrev = filtered.reduce((s, p) => s + p.horasPrevistas, 0);
    const horasReal = filtered.reduce((s, p) => s + p.horasRealizadas, 0);
    return { total, ativos, concluidos, tarefasAtras, piPrev, piReal, saldo: piReal - piPrev, horasPrev, horasReal };
  }, [filtered]);

  const topByTasks = useMemo(() =>
    [...filtered].sort((a, b) => b.tarefas - a.tarefas).slice(0, 10).map(p => ({
      name: p.projeto.length > 22 ? p.projeto.slice(0, 22) + '…' : p.projeto,
      Realizadas: p.tarefasRealizadas, Previstas: Math.max(0, p.tarefasPrevistas - p.tarefasRealizadas),
    })), [filtered]);

  const topByHours = useMemo(() =>
    [...filtered].sort((a, b) => b.horasPrevistas - a.horasPrevistas).slice(0, 10).map(p => ({
      name: p.projeto.length > 22 ? p.projeto.slice(0, 22) + '…' : p.projeto,
      Previstas: Math.round(p.horasPrevistas), Realizadas: Math.round(p.horasRealizadas),
    })), [filtered]);

  const bySituacao = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach(p => m.set(p.situacao, (m.get(p.situacao) || 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const byWorkspace = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach(p => m.set(p.workspace, (m.get(p.workspace) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const scatter = useMemo(() => filtered.filter(p => p.horasPrevistas > 0).map(p => ({
    x: p.horasPrevistas, y: p.horasRealizadas, name: p.projeto, situacao: p.situacao,
  })), [filtered]);

  const ganttRange = useMemo(() => {
    const dates = filtered.flatMap(p => [p.inicio, p.termino]).filter(Boolean) as Date[];
    if (!dates.length) return null;
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime()), Date.now()));
    return { min, max, span: max.getTime() - min.getTime() };
  }, [filtered]);

  const ganttItems = useMemo(() =>
    [...filtered].filter(p => p.inicio).sort((a, b) => (b.piPrevisto + b.horasPrevistas) - (a.piPrevisto + a.horasPrevistas)).slice(0, 15),
    [filtered]);

  const handleExport = () => {
    const headers = ['Id', 'Projeto', 'Workspace', 'Situação', 'Responsável', 'Tarefas', 'Tarefas atrasadas', 'Horas previstas', 'Horas realizadas', 'PI previsto', 'PI realizado', 'Saldo', 'Início', 'Término'];
    const rows = filtered.map(p => [p.id, p.projeto, p.workspace, p.situacao, p.responsavel, p.tarefas, p.tarefasAtrasadas, p.horasPrevistas, p.horasRealizadas, p.piPrevisto, p.piRealizado, p.saldo, formatDate(p.inicio), formatDate(p.termino)]);
    exportCsv('projetos-export', headers, rows);
  };

  if (loading) return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>
      <Skeleton className="h-80" />
    </div>
  );
  if (error) return <div className="text-center text-destructive py-20">{error}</div>;

  const isEmpty = filtered.length === 0;
  const today = new Date();

  const kpis = [
    { title: 'Projetos', value: stats.total.toString(), subtitle: `${stats.ativos} ativos · ${stats.concluidos} concluídos`, icon: FolderKanban, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Em andamento', value: stats.ativos.toString(), subtitle: `${stats.total ? Math.round(stats.ativos / stats.total * 100) : 0}% do portfólio`, icon: Activity, color: 'text-info', bg: 'bg-info/10' },
    { title: 'Tarefas atrasadas', value: stats.tarefasAtras.toString(), subtitle: 'Soma em todos os projetos', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { title: 'Saldo financeiro', value: formatBRL(stats.saldo), subtitle: `Prev: ${formatBRL(stats.piPrev)}`, icon: DollarSign, color: stats.saldo >= 0 ? 'text-success' : 'text-destructive', bg: stats.saldo >= 0 ? 'bg-success/10' : 'bg-destructive/10' },
    { title: 'Horas previstas', value: `${Math.round(stats.horasPrev)}h`, subtitle: 'Soma do escopo', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Horas realizadas', value: `${Math.round(stats.horasReal)}h`, subtitle: `${stats.horasPrev > 0 ? Math.round(stats.horasReal / stats.horasPrev * 100) : 0}% do previsto`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfólio de Projetos</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} de {projects.length} projeto(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar projeto..." className="pl-8 pr-8 h-9 w-[220px]" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}><Download className="h-4 w-4 mr-1.5" /> Exportar</Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-3 flex flex-wrap gap-2 items-center">
            <Select value={workspace} onValueChange={setWorkspace}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Workspace" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos workspaces</SelectItem>{workspaces.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Situação" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas situações</SelectItem>{situacoes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={responsavel} onValueChange={setResponsavel}>
              <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Responsável" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos responsáveis</SelectItem>{responsaveis.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            {(workspace !== 'all' || situacao !== 'all' || responsavel !== 'all' || search) && (
              <Button variant="ghost" size="sm" className="h-9" onClick={() => { setWorkspace('all'); setSituacao('all'); setResponsavel('all'); setSearch(''); }}>Limpar</Button>
            )}
          </CardContent>
        </Card>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map(k => (
            <Card key={k.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">{k.title}</p>
                    <p className="text-2xl font-bold break-words">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.subtitle}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${k.bg}`}><k.icon className={`h-5 w-5 ${k.color}`} /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {isEmpty ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-lg font-medium mb-2">Nenhum projeto encontrado</p>
            <Button variant="outline" size="sm" onClick={() => { setWorkspace('all'); setSituacao('all'); setResponsavel('all'); setSearch(''); }}>Limpar filtros</Button>
          </div>
        ) : (
        <>
        {/* Charts row 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Top 10 projetos por nº de tarefas</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topByTasks} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Realizadas" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 4]} />
                  <Bar dataKey="Previstas" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Top 10 por horas (previstas vs realizadas)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topByHours} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Previstas" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Realizadas" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Distribuição por situação</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bySituacao} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} label={(e) => `${e.name}: ${e.value}`}>
                    {bySituacao.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Projetos por workspace</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byWorkspace}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Scatter */}
        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Horas previstas × realizadas</CardTitle>
              <p className="text-xs text-muted-foreground">Pontos abaixo da diagonal estão dentro do orçamento de horas; acima estouraram.</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="x" name="Previstas" unit="h" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="number" dataKey="y" name="Realizadas" unit="h" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <ZAxis range={[60, 60]} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                    formatter={(v: number, n: string, p) => [`${v}h`, n]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''} />
                  <ReferenceLine segment={[{ x: 0, y: 0 }, { x: Math.max(...scatter.map(s => s.x), 1), y: Math.max(...scatter.map(s => s.x), 1) }]} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
                  <Scatter data={scatter} fill="hsl(var(--chart-1))" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Gantt */}
        {ganttRange && ganttItems.length > 0 && (
          <section className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cronograma — Top 15</CardTitle>
                <p className="text-xs text-muted-foreground">Janela {formatDate(ganttRange.min)} → {formatDate(ganttRange.max)} · Linha vermelha = hoje</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ganttItems.map(p => {
                    const start = p.inicio!.getTime();
                    const end = (p.termino || today).getTime();
                    const left = ((start - ganttRange.min.getTime()) / ganttRange.span) * 100;
                    const width = Math.max(((end - start) / ganttRange.span) * 100, 1);
                    const todayPct = ((today.getTime() - ganttRange.min.getTime()) / ganttRange.span) * 100;
                    const color = p.situacao === 'Concluído' ? 'bg-success' : p.comAtraso ? 'bg-destructive' : 'bg-primary';
                    return (
                      <div key={p.id} className="grid grid-cols-[200px_1fr] gap-3 items-center text-xs">
                        <button onClick={() => setSelected(p)} className="truncate text-left hover:text-primary text-foreground" title={p.projeto}>{p.projeto}</button>
                        <div className="relative h-6 bg-muted/40 rounded">
                          <div className={`absolute h-full rounded ${color} opacity-80`} style={{ left: `${left}%`, width: `${width}%` }} />
                          <div className="absolute top-0 bottom-0 w-px bg-destructive" style={{ left: `${todayPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Table */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Projetos detalhados</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Tarefas</TableHead>
                  <TableHead className="text-right">Atras.</TableHead>
                  <TableHead className="text-right">Horas</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map(p => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                    <TableCell className="font-medium max-w-[280px] truncate">{p.projeto}</TableCell>
                    <TableCell className="text-muted-foreground">{p.workspace}</TableCell>
                    <TableCell className="text-muted-foreground">{p.responsavel}</TableCell>
                    <TableCell><Badge variant={p.ativo ? 'default' : 'secondary'}>{p.situacao}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{p.tarefasRealizadas}/{p.tarefasPrevistas}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.tarefasAtrasadas > 0 ? <span className="text-destructive font-medium">{p.tarefasAtrasadas}</span> : 0}</TableCell>
                    <TableCell className="text-right tabular-nums">{Math.round(p.horasRealizadas)}/{Math.round(p.horasPrevistas)}h</TableCell>
                    <TableCell className={`text-right tabular-nums ${p.saldo > 0 ? 'text-destructive' : p.saldo < 0 ? 'text-success' : ''}`}>{formatBRL(p.saldo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length > 50 && <p className="text-xs text-muted-foreground p-3 text-center">Mostrando 50 de {filtered.length}. Use os filtros para refinar.</p>}
          </CardContent>
        </Card>
        </>
        )}

        {/* Drawer */}
        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selected && (
              <>
                <SheetHeader>
                  <SheetTitle>{selected.projeto}</SheetTitle>
                  <SheetDescription>{selected.identificacao} · {selected.workspace}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={selected.ativo ? 'default' : 'secondary'}>{selected.situacao}</Badge>
                    {selected.cronogramaCompartilhado && <Badge variant="outline">Cronograma compartilhado</Badge>}
                    {selected.comAtraso && <Badge variant="destructive">{selected.tarefasAtrasadas} atrasadas</Badge>}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Evolução de tarefas — {selected.evolucaoTarefasPct}%</p>
                    <Progress value={Math.min(selected.evolucaoTarefasPct, 100)} />
                    <p className="text-xs text-muted-foreground mt-1">{selected.tarefasRealizadas} de {selected.tarefasPrevistas} tarefas</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Evolução de horas — {selected.evolucaoHorasPct}%</p>
                    <Progress value={Math.min(selected.evolucaoHorasPct, 100)} />
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(selected.horasRealizadas)}h de {Math.round(selected.horasPrevistas)}h</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Responsável</p><p className="font-medium">{selected.responsavel}</p></div>
                    <div><p className="text-xs text-muted-foreground">Planejado</p><p className="font-medium">{selected.planejado}</p></div>
                    <div><p className="text-xs text-muted-foreground">Início</p><p className="font-medium">{formatDate(selected.inicio)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Término</p><p className="font-medium">{formatDate(selected.termino)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Tarefas / Tickets</p><p className="font-medium">{selected.tarefas} / {selected.tickets}</p></div>
                    <div><p className="text-xs text-muted-foreground">Tendência esforço</p><p className="font-medium">{selected.tendenciaEsforco}h</p></div>
                    <div><p className="text-xs text-muted-foreground">PI previsto</p><p className="font-medium">{formatBRL(selected.piPrevisto)}</p></div>
                    <div><p className="text-xs text-muted-foreground">PI realizado</p><p className="font-medium">{formatBRL(selected.piRealizado)}</p></div>
                    <div className="col-span-2"><p className="text-xs text-muted-foreground">Saldo</p><p className={`font-bold ${selected.saldo > 0 ? 'text-destructive' : 'text-success'}`}>{formatBRL(selected.saldo)}</p></div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};
export default Projetos;
