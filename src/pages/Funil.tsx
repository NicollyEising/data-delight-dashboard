import { useEffect, useMemo, useState } from 'react';
import { ChannelRow, parseFunnelCSV } from '@/data/funnel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { exportCsv } from '@/lib/exportCsv';
import { formatBRL } from '@/lib/ekyteParser';
import { Download, DollarSign, Eye, MousePointerClick, Users, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';

function fmt(n: number) { return new Intl.NumberFormat('pt-BR').format(Math.round(n)); }
function pct(num: number, den: number) { return den > 0 ? (num / den) * 100 : 0; }

const Funil = () => {
  const [rows, setRows] = useState<ChannelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/multicanal.csv')
      .then(r => { if (!r.ok) throw new Error('Falha ao carregar dados'); return r.text(); })
      .then(text => setRows(parseFunnelCSV(text)))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro'))
      .finally(() => setLoading(false));
  }, []);

  const channels = useMemo(() => rows.filter(r => !r.isTotal), [rows]);

  const totals = useMemo(() => {
    const sum = (k: keyof ChannelRow) => channels.reduce((s, r) => s + (Number(r[k]) || 0), 0);
    const valorGasto = sum('valorGasto');
    const impressoes = sum('impressoes');
    const cliques = sum('cliques');
    const visitasUnicas = sum('visitasUnicas');
    const leadsMqlSql = sum('leadsMqlSql');
    const leadsSql = sum('leadsSql');
    const vendas = sum('vendas');
    const receita = sum('receita');
    return { valorGasto, impressoes, cliques, visitasUnicas, leadsMqlSql, leadsSql, vendas, receita,
      ctr: pct(cliques, impressoes), conv: pct(leadsSql, visitasUnicas), close: pct(vendas, leadsSql),
      cpl: leadsMqlSql > 0 ? valorGasto / leadsMqlSql : 0, cpa: vendas > 0 ? valorGasto / vendas : 0, roas: valorGasto > 0 ? receita / valorGasto : 0 };
  }, [channels]);

  const funnelStages = useMemo(() => [
    { name: 'Impressões', value: totals.impressoes, color: 'hsl(215 70% 55%)' },
    { name: 'Cliques', value: totals.cliques, color: 'hsl(200 70% 50%)' },
    { name: 'Visitas Únicas', value: totals.visitasUnicas, color: 'hsl(180 65% 45%)' },
    { name: 'Leads MQL+SQL', value: totals.leadsMqlSql, color: 'hsl(160 60% 45%)' },
    { name: 'Leads SQL', value: totals.leadsSql, color: 'hsl(140 65% 42%)' },
    { name: 'Vendas', value: totals.vendas, color: 'hsl(120 60% 38%)' },
  ], [totals]);

  const maxFunnel = funnelStages[0].value || 1;

  const investData = useMemo(() => channels.filter(c => c.valorGasto > 0).sort((a, b) => b.valorGasto - a.valorGasto).map(c => ({ name: c.canal, value: c.valorGasto })), [channels]);
  const leadsData = useMemo(() => channels.filter(c => c.leadsMqlSql > 0).sort((a, b) => b.leadsMqlSql - a.leadsMqlSql).slice(0, 10).map(c => ({ name: c.canal, MQL: c.leadsMqlSql - c.leadsSql, SQL: c.leadsSql })), [channels]);
  const cplData = useMemo(() => channels.filter(c => c.cplMql > 0).sort((a, b) => a.cplMql - b.cplMql).map(c => ({ name: c.canal, value: c.cplMql })), [channels]);
  const visitasData = useMemo(() => channels.filter(c => c.visitasUnicas > 0).sort((a, b) => b.visitasUnicas - a.visitasUnicas).slice(0, 10).map(c => ({ name: c.canal, value: c.visitasUnicas })), [channels]);

  const handleExport = () => {
    const headers = ['Canal', 'Valor gasto', 'Impressões', 'Cliques', 'Visitas únicas', 'Leads MQL+SQL', 'Leads SQL', 'Vendas', 'Receita', 'CPL', 'CPA', 'ROAS'];
    const data = channels.map(c => [c.canal, c.valorGasto, c.impressoes, c.cliques, c.visitasUnicas, c.leadsMqlSql, c.leadsSql, c.vendas, c.receita, c.cplMql, c.cpa, c.roas]);
    exportCsv('funil-export', headers, data);
  };

  if (loading) return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28" />)}</div>
      <Skeleton className="h-96" />
    </div>
  );
  if (error) return <div className="text-center text-destructive py-20">{error}</div>;

  const kpis = [
    { title: 'Investimento', value: formatBRL(totals.valorGasto), subtitle: 'Total no período', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Impressões', value: fmt(totals.impressoes), subtitle: `CTR ${totals.ctr.toFixed(2)}%`, icon: Eye, color: 'text-info', bg: 'bg-info/10' },
    { title: 'Cliques', value: fmt(totals.cliques), subtitle: `CPC médio ${formatBRL(totals.valorGasto && totals.cliques ? totals.valorGasto / totals.cliques : 0)}`, icon: MousePointerClick, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Leads SQL', value: fmt(totals.leadsSql), subtitle: `Conv. visita→SQL ${totals.conv.toFixed(2)}%`, icon: Users, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Vendas', value: fmt(totals.vendas), subtitle: `Close rate ${totals.close.toFixed(2)}%`, icon: Target, color: 'text-success', bg: 'bg-success/10' },
    { title: 'ROAS', value: totals.roas.toFixed(2) + 'x', subtitle: `Receita ${formatBRL(totals.receita)}`, icon: TrendingUp, color: totals.roas >= 1 ? 'text-success' : 'text-destructive', bg: totals.roas >= 1 ? 'bg-success/10' : 'bg-destructive/10' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Funil Multicanal</h1>
            <p className="text-sm text-muted-foreground">{channels.length} canais analisados</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport}><Download className="h-4 w-4 mr-1.5" /> Exportar</Button>
        </div>

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

        {/* Visual funnel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Funil de conversão</CardTitle>
            <p className="text-xs text-muted-foreground">Taxas calculadas etapa por etapa</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelStages.map((s, i) => {
                const w = Math.max((s.value / maxFunnel) * 100, 4);
                const prev = i > 0 ? funnelStages[i - 1].value : null;
                const conv = prev && prev > 0 ? (s.value / prev) * 100 : null;
                return (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-foreground text-right">{s.name}</div>
                    <div className="flex-1 relative h-12 bg-muted/30 rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg flex items-center justify-between px-4 transition-all" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${s.color} 0%, ${s.color}cc 100%)` }}>
                        <span className="text-sm font-bold text-white drop-shadow">{fmt(s.value)}</span>
                        {conv !== null && <span className="text-xs text-white/90 font-medium">{conv.toFixed(1)}%</span>}
                      </div>
                    </div>
                    <div className="w-20 text-xs text-muted-foreground text-right">
                      {i > 0 && conv !== null ? `↓ ${conv.toFixed(1)}%` : '100%'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts row 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Investimento por canal</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatBRL(v)} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <RTooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Leads MQL × SQL por canal</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="MQL" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="SQL" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CPL por canal</CardTitle>
              <p className="text-xs text-muted-foreground">Linha de referência: CPL médio do funil</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cplData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatBRL(v)} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <RTooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <ReferenceLine x={totals.cpl} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: `Médio ${formatBRL(totals.cpl)}`, fill: 'hsl(var(--destructive))', fontSize: 10 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="value" position="right" formatter={(v: number) => formatBRL(v)} fontSize={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Top 10 canais por visitas únicas</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-25} textAnchor="end" height={70} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <RTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Matrix table */}
        <Card>
          <CardHeader><CardTitle className="text-base">Matriz por canal</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-right">Investimento</TableHead>
                  <TableHead className="text-right">Impressões</TableHead>
                  <TableHead className="text-right">Cliques</TableHead>
                  <TableHead className="text-right">Visitas únicas</TableHead>
                  <TableHead className="text-right">Leads MQL+SQL</TableHead>
                  <TableHead className="text-right">Leads SQL</TableHead>
                  <TableHead className="text-right">CPL</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map(c => (
                  <TableRow key={c.canal}>
                    <TableCell className="font-medium">{c.canal}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.valorGasto > 0 ? formatBRL(c.valorGasto) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.impressoes > 0 ? fmt(c.impressoes) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.cliques > 0 ? fmt(c.cliques) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.visitasUnicas > 0 ? fmt(c.visitasUnicas) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.leadsMqlSql > 0 ? fmt(c.leadsMqlSql) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.leadsSql > 0 ? fmt(c.leadsSql) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.cplMql > 0 ? formatBRL(c.cplMql) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.vendas > 0 ? fmt(c.vendas) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.receita > 0 ? formatBRL(c.receita) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
export default Funil;
