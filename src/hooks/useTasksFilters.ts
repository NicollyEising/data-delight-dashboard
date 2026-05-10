import { useMemo, useState } from 'react';
import { Task } from '@/data/tasks';
import { parseEkyteDate } from '@/lib/ekyteParser';

export interface TasksFilters {
  workspaces: string[];
  situacoes: string[];
  fluxos: string[];
  responsaveis: string[];
  prioridades: string[]; // 'Urgente' | 'Alta' | 'Média' | 'Baixa' | 'Sem prioridade'
  origemTipos: string[]; // 'Projeto' | 'Ticket' | 'Sem origem'
  prazoFrom: string; // YYYY-MM-DD
  prazoTo: string;
  search: string;
}

export const emptyFilters: TasksFilters = {
  workspaces: [], situacoes: [], fluxos: [], responsaveis: [],
  prioridades: [], origemTipos: [], prazoFrom: '', prazoTo: '', search: '',
};

function priorityKey(p: string): string {
  const lower = p.toLowerCase();
  if (lower.includes('urgente')) return 'Urgente';
  if (lower.includes('alta')) return 'Alta';
  if (lower.includes('média') || lower.includes('media')) return 'Média';
  if (lower.includes('baixa')) return 'Baixa';
  return 'Sem prioridade';
}

export function useTasksFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TasksFilters>(emptyFilters);

  const options = useMemo(() => ({
    workspaces: Array.from(new Set(tasks.map(t => t.workspace).filter(Boolean))).sort(),
    situacoes: Array.from(new Set(tasks.map(t => t.situacao).filter(Boolean))).sort(),
    fluxos: Array.from(new Set(tasks.map(t => t.fluxoTrabalho).filter(Boolean))).sort(),
    responsaveis: Array.from(new Set(tasks.flatMap(t => t.responsavel))).sort(),
  }), [tasks]);

  const filtered = useMemo(() => {
    const from = filters.prazoFrom ? new Date(filters.prazoFrom) : null;
    const to = filters.prazoTo ? new Date(filters.prazoTo) : null;
    if (to) to.setHours(23, 59, 59, 999);
    const q = filters.search.trim().toLowerCase();
    return tasks.filter(t => {
      if (filters.workspaces.length && !filters.workspaces.includes(t.workspace)) return false;
      if (filters.situacoes.length && !filters.situacoes.includes(t.situacao)) return false;
      if (filters.fluxos.length && !filters.fluxos.includes(t.fluxoTrabalho)) return false;
      if (filters.responsaveis.length && !filters.responsaveis.some(r => t.responsavel.includes(r))) return false;
      if (filters.prioridades.length && !filters.prioridades.includes(priorityKey(t.prioridade))) return false;
      if (filters.origemTipos.length && !filters.origemTipos.includes(t.tipoOrigem)) return false;
      if (from || to) {
        const d = parseEkyteDate(t.concluirTarefaAte);
        if (!d) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      if (q) {
        const hay = [t.tarefa, t.workspace, t.responsavel.join(' '), t.executor, t.etapa, t.tags]
          .join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const reset = () => setFilters(emptyFilters);

  return { filters, setFilters, filtered, options, reset };
}
