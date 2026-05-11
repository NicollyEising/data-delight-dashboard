import { useEffect, useMemo, useState } from 'react';
import { Publication, parsePublicationsCSV } from '@/data/social';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { exportCsv } from '@/lib/exportCsv';
import { formatDate } from '@/lib/ekyteParser';
import { Search, Download, X, Calendar, CheckCircle2, Clock, AlertCircle, FileText, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList, RadialBarChart, RadialBar } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const RedesSociais = () => {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [etapa, setEtapa] = useState('all');
  const [situacao, setSituacao] = useState('all');
  const [template, setTemplate] = useState('all');

  useEffect(() => {
    fetch('/data/redes-sociais.csv')
      .then(r => { if (!r.ok) throw new Error('Falha ao carregar dados'); return r.text(); })
      .then(text => setPubs(parsePublicationsCSV(text)))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro'))
      .finally(() => setLoading(false));
  }, []);

  const etapas = useMemo(() => Array.from(new Set(pubs.map(p => p.etapa))).sort(), [pubs]);
  const situacoes = useMemo(() => Array.from(new Set(pubs.map(p => p.situacao))).sort(), [pubs]);
  const templates = useMemo(() => Array.from(new Set(pubs.map(p => p.template))).sort(), [pubs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pubs.filter(p => {
      if (etapa !== 'all' && p.etapa !== etapa) return false;
      if (situacao !== 'all' && p.situacao !== situacao) return false;
      if (template !== 'all' && p.template !== template) return false;
      if (q && !(p.publicacao.toLowerCase().includes(q) || p.template.toLowerCase().includes(q) || p.workspace.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [pubs, search, etapa, situacao, template]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const publicadas = filtered.filter(p => p.publicada).length;
    const naoPub = total - publicadas;
    const vencidas = filtered.filter(p => p.vencida).length;
    const taxa = total > 0 ? (publicadas / total) * 100 : 0;
    return { total, publicadas, naoPub, vencidas, taxa, templates: new Set(filtered.map(p => p.template)).size };
  }, [filtered]);

  const byEtapa = useMemo(() => {
    const m = new Map<string, { Publicado: number; 'Não publicado': number }>();
    filtered.forEach(p => {
      const e = m.get(p.etapa) || { Publicado: 0, 'Não publicado': 0 };
      if (p.publicada) e.Publicado += 1; else e['Não publicado'] += 1;
      m.set(p.etapa, e);
    });
    return Array.from(m.entries()).map(([name, v]) => ({ name, ...v }));
  }, [filtered]);

  const byTemplate = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach(p => m.set(p.template, (m.get(p.template) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({
      name: name.length > 30 ? name.slice(0, 30) + '…' : name, value,
    }));
  }, [filtered]);

  const bySituacao = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach(p => m.set(p.situacao, (m.get(p.situacao) || 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const byDay = useMemo(() => {
    const m = new Map<string, { Publicado: number; 'Não publicado': number }>();
    filtered.filter(p => p.veiculacao).forEach(p => {
      const k = formatDate(p.veiculacao);
      const e = m.get(k) || { Publicado: 0, 'Não publicado': 0 };
      if (p.publicada) e.Publicado += 1; else e['Não publicado'] += 1;
      m.set(k, e);
    });
    return Array.from(m.entries()).sort((a, b) => {
      const [da, ma, ya] = a[0].split('/').map(Number);
      const [db, mb, yb] = b[0].split('/').map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
    }).map(([name, v]) => ({ name, ...v }));
  }, [filtered]);

  const taxaRadial = useMemo(() => [{ name: 'Taxa', value: stats.taxa, fill: 'hsl(var(--success))' }], [stats.taxa]);

  const handleExport = () => {
    const headers = ['Id', 'Canal', 'Publicação', 'Workspace', 'Template', 'Etapa', 'Veiculação', 'Situação'];
    const data = filtered.map(p => [p.id, p.canal, p.publicacao, p.workspace, p.template, p.etapa, formatDate(p.veiculacao), p.situacao]);
    exportCsv('redes-sociais-export', headers, data);
  };

  if (loading) return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28" />)}</div>
      <Skeleton className="h-80" />
    </div>
  );
  if (error) return <div className="text-center text-destructive py-20">{error}</div>;

  const isEmpty = filtered.length === 0;

  const kpis = [
    { title: 'Publicações', value: stats.total.toString(), subtitle: `${stats.templates} templates`, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Publicadas', value: stats.publicadas.toString(), subtitle: `${stats.taxa.toFixed(0)}% do total`, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Em produção', value: stats.naoPub.toString(), subtitle: 'Aguardando veiculação', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Atrasadas', value: stats.vencidas.toString(), subtitle: 'Veiculação no passado', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { title: 'Templates únicos', value: stats.templates.toString(), subtitle: 'Formatos diferentes', icon: Layers, color: 'text-info', bg: 'bg-info/10' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendário de Redes Sociais</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} de {pubs.length} publicação(ões)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-8 pr-8 h-9 w-[220px]" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}><Download className="h-4 w-4 mr-1.5" /> Exportar</Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-3 flex flex-wrap gap-2 items-center">
            <Select value={etapa} onValueChange={setEtapa}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Etapa" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas etapas</SelectItem>{etapas.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Situação" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas situações</SelectItem>{situacoes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger className="h-9 w-[260px]"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos templates</SelectItem>{templates.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            {(etapa !== 'all' || situacao !== 'all' || template !== 'all' || search) && (
              <Button variant="ghost" size="sm" className="h-9" onClick={() => { setEtapa('all'); setSituacao('all'); setTemplate('all'); setSearch(''); }}>Limpar</Button>
            )}
          </CardContent>
        </Card>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
            <p className="text-lg font-medium mb-2">Nenhuma publicação encontrada</p>
            <Button variant="outline" size="sm" onClick={() => { setEtapa('all'); setSituacao('all'); setTemplate('all'); setSearch(''); }}>Limpar filtros</Button>
          </div>
        ) : (
        <>
        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Taxa de publicação</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={taxaRadial} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground" style={{ fontSize: 32, fontWeight: 700 }}>
                    {stats.taxa.toFixed(0)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground text-center">{stats.publicadas} publicadas · {stats.naoPub} pendentes</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Distribuição por etapa</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byEtapa}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Publicado" stackId="a" fill="hsl(var(--success))" />
                  <Bar dataKey="Não publicado" stackId="a" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Volume por template</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byTemplate} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={200} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="value" position="right" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Status das publicações</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bySituacao} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55} label={(e) => `${e.name}: ${e.value}`}>
                    {bySituacao.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Calendário de veiculação</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="Publicado" stackId="a" fill="hsl(var(--success))" />
                <Bar dataKey="Não publicado" stackId="a" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Lista de publicações</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publicação</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Veiculação</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium max-w-[280px] truncate flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {p.publicacao}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">{p.template}</TableCell>
                    <TableCell><Badge variant="outline">{p.etapa}</Badge></TableCell>
                    <TableCell className={`text-xs ${p.vencida ? 'text-destructive font-medium' : ''}`}>{formatDate(p.veiculacao)}</TableCell>
                    <TableCell>
                      <Badge variant={p.publicada ? 'default' : 'secondary'} className={p.publicada ? 'bg-success text-success-foreground hover:bg-success/90' : ''}>{p.situacao}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length > 50 && <p className="text-xs text-muted-foreground p-3 text-center">Mostrando 50 de {filtered.length}.</p>}
          </CardContent>
        </Card>
        </>
        )}
      </main>
    </div>
  );
};
export default RedesSociais;
