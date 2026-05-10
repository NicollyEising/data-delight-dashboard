import { useMemo, useState } from 'react';
import { Task } from '@/data/tasks';
import { formatMinutes, formatBRL } from '@/lib/ekyteParser';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Flame, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLS = [
  { key: 'tarefa', label: 'Tarefa' },
  { key: 'workspace', label: 'Workspace' },
  { key: 'fluxoTrabalho', label: 'Fluxo' },
  { key: 'etapa', label: 'Etapa' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'executor', label: 'Executor' },
  { key: 'prioridade', label: 'Prioridade' },
  { key: 'concluirTarefaAte', label: 'Concluir até' },
  { key: 'restamMin', label: 'Restam' },
  { key: 'esforcoRealizadoMin', label: 'Esforço Real.' },
  { key: 'valorRealizado', label: 'Valor Real.' },
  { key: 'origem', label: 'Origem' },
] as const;

type SortKey = typeof COLS[number]['key'];

const PAGE_SIZE = 25;

function priorityVariant(p: string): { label: string; cls: string } {
  const lower = p.toLowerCase();
  if (lower.includes('urgente')) return { label: p, cls: 'bg-destructive/10 text-destructive border-destructive/20' };
  if (lower.includes('alta')) return { label: p, cls: 'bg-warning/10 text-warning border-warning/20' };
  if (lower.includes('média') || lower.includes('media')) return { label: p, cls: 'bg-info/10 text-info border-info/20' };
  if (lower.includes('baixa')) return { label: p, cls: 'bg-success/10 text-success border-success/20' };
  return { label: '—', cls: 'bg-muted text-muted-foreground border-border' };
}

export function TasksTable({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'concluirTarefaAte', dir: 'asc' });
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const arr = [...tasks];
    arr.sort((a, b) => {
      const av = (a as any)[sort.key];
      const bv = (b as any)[sort.key];
      let cmp = 0;
      if (sort.key === 'concluirTarefaAte') {
        const ad = av ? av.split('/').reverse().join('-') : '';
        const bd = bv ? bv.split('/').reverse().join('-') : '';
        cmp = ad.localeCompare(bd);
      } else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else if (Array.isArray(av) && Array.isArray(bv)) cmp = av.join(',').localeCompare(bv.join(','));
      else cmp = String(av ?? '').localeCompare(String(bv ?? ''));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [tasks, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (sort.key === k) setSort({ key: k, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    else setSort({ key: k, dir: 'asc' });
  };

  const SortIcon = ({ k }: { k: SortKey }) => sort.key !== k
    ? <ArrowUpDown className="h-3 w-3 opacity-40" />
    : sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {COLS.map(c => (
                <th key={c.key} className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                  <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    {c.label} <SortIcon k={c.key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map(t => {
              const pv = priorityVariant(t.prioridade);
              const restamCls = t.restamMin > 0 && t.restamMin < 8 * 60
                ? 'text-destructive font-bold'
                : t.restamMin > 0 && t.restamMin < 24 * 60 ? 'text-destructive' : 'text-foreground';
              return (
                <tr
                  key={t.id}
                  onClick={() => onSelect(t)}
                  className={cn(
                    'border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors',
                    t.atrasada && 'border-l-4 border-l-destructive'
                  )}
                >
                  <td className="px-3 py-2.5 max-w-[280px]">
                    <div className="flex items-center gap-1.5">
                      {t.urgente && <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] px-1.5 py-0 h-5"><Flame className="h-2.5 w-2.5 mr-0.5" />URGENTE</Badge>}
                      {t.semResponsavel && <Badge className="bg-warning/10 text-warning border border-warning/20 text-[10px] px-1.5 py-0 h-5"><UserX className="h-2.5 w-2.5 mr-0.5" />Sem resp.</Badge>}
                      <span className="truncate font-medium">{t.tarefa}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{t.workspace}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{t.fluxoTrabalho || '—'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{t.etapa}</td>
                  <td className="px-3 py-2.5 max-w-[180px] truncate">{t.responsavel.join(', ') || '—'}</td>
                  <td className="px-3 py-2.5 max-w-[160px] truncate">{t.executor}</td>
                  <td className="px-3 py-2.5"><Badge className={cn('text-[10px] py-0 h-5 border', pv.cls)}>{pv.label || '—'}</Badge></td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{t.concluirTarefaAte || '—'}</td>
                  <td className={cn('px-3 py-2.5 whitespace-nowrap', restamCls)}>{t.restamMin > 0 ? formatMinutes(t.restamMin) : '—'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{formatMinutes(t.esforcoRealizadoMin)}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{t.valorRealizado ? formatBRL(t.valorRealizado) : '—'}</td>
                  <td className="px-3 py-2.5 max-w-[200px] truncate text-muted-foreground">{t.origem || '—'}</td>
                </tr>
              );
            })}
            {slice.length === 0 && (
              <tr><td colSpan={COLS.length} className="text-center py-10 text-muted-foreground">Nenhuma tarefa</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 border-t border-border text-sm">
        <span className="text-muted-foreground">
          {sorted.length} tarefa(s) · página {safePage} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
