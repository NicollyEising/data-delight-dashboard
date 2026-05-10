import { TasksFilters } from '@/hooks/useTasksFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X, Filter as FilterIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  filters: TasksFilters;
  setFilters: (f: TasksFilters) => void;
  options: { workspaces: string[]; situacoes: string[]; fluxos: string[]; responsaveis: string[]; };
  onReset: () => void;
}

function MultiSelect({ label, values, all, onChange, searchable = false }: {
  label: string; values: string[]; all: string[]; onChange: (v: string[]) => void; searchable?: boolean;
}) {
  const [q, setQ] = useState('');
  const filtered = searchable && q ? all.filter(o => o.toLowerCase().includes(q.toLowerCase())) : all;
  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          {label}
          {values.length > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5">{values.length}</Badge>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {searchable && (
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..." className="mb-2 h-8" />
        )}
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filtered.length === 0 && <p className="text-xs text-muted-foreground p-2">Nenhuma opção</p>}
          {filtered.map(o => (
            <label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-sm">
              <Checkbox checked={values.includes(o)} onCheckedChange={() => toggle(o)} />
              <span className="truncate">{o || '(vazio)'}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ToggleGroup({ label, options, values, onChange }: {
  label: string; options: string[]; values: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs font-medium text-muted-foreground mr-1">{label}:</span>
      {options.map(o => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            onClick={() => onChange(active ? values.filter(x => x !== o) : [...values, o])}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
              active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:bg-muted/50'
            )}
          >{o}</button>
        );
      })}
    </div>
  );
}

export function TasksFilterBar({ filters, setFilters, options, onReset }: Props) {
  const upd = <K extends keyof TasksFilters>(k: K, v: TasksFilters[K]) => setFilters({ ...filters, [k]: v });
  const hasAny = filters.workspaces.length || filters.situacoes.length || filters.fluxos.length ||
    filters.responsaveis.length || filters.prioridades.length || filters.origemTipos.length ||
    filters.prazoFrom || filters.prazoTo;

  return (
    <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm -mx-4 px-4 py-3 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mr-1">
          <FilterIcon className="h-4 w-4" /> Filtros:
        </div>
        <MultiSelect label="Workspace" values={filters.workspaces} all={options.workspaces} onChange={v => upd('workspaces', v)} />
        <MultiSelect label="Situação" values={filters.situacoes} all={options.situacoes} onChange={v => upd('situacoes', v)} />
        <MultiSelect label="Fluxo" values={filters.fluxos} all={options.fluxos} onChange={v => upd('fluxos', v)} />
        <MultiSelect label="Responsável" values={filters.responsaveis} all={options.responsaveis} onChange={v => upd('responsaveis', v)} searchable />
        <ToggleGroup label="Prioridade" options={['Urgente', 'Alta', 'Média', 'Baixa', 'Sem prioridade']} values={filters.prioridades} onChange={v => upd('prioridades', v)} />
        <ToggleGroup label="Origem" options={['Projeto', 'Ticket', 'Sem origem']} values={filters.origemTipos} onChange={v => upd('origemTipos', v)} />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Prazo:</span>
          <Input type="date" value={filters.prazoFrom} onChange={e => upd('prazoFrom', e.target.value)} className="h-8 w-[140px] text-xs" />
          <span className="text-xs text-muted-foreground">a</span>
          <Input type="date" value={filters.prazoTo} onChange={e => upd('prazoTo', e.target.value)} className="h-8 w-[140px] text-xs" />
        </div>
        <div className="ml-auto">
          {hasAny ? (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
              <X className="h-3.5 w-3.5 mr-1" /> Limpar filtros
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
