export interface Task {
  id: string;
  situacao: 'Ativa' | 'Concluída';
  tarefa: string;
  tags: string;
  workspace: string;
  criadaPor: string;
  criadaEm: string;
  canal: string;
  etapa: string;
  executor: string;
  quantidadePecas: number;
  quantidadeFormularios: number;
  iniciarEtapaEm: string;
  executarEtapaAte: string;
  concluirTarefaAte: string;
  esforco: number;
  ultimaResposta: string;
  prioridade: string;
  origem: string;
}

// Parse esforço string (HH:MM) to hours
const parseEsforco = (esforco: string): number => {
  if (!esforco) return 0;
  const [hours, minutes] = esforco.split(':').map(Number);
  return hours + (minutes || 0) / 60;
};

// Parse priority string to get category
const parsePrioridade = (prioridade: string): 'Urgente' | 'Alta' | 'Média' | 'Baixa' | 'Não definida' => {
  if (!prioridade) return 'Não definida';
  if (prioridade.includes('Urgente')) return 'Urgente';
  if (prioridade.includes('Alta')) return 'Alta';
  if (prioridade.includes('Média')) return 'Média';
  if (prioridade.includes('Baixa')) return 'Baixa';
  return 'Não definida';
};

// Parse CSV to tasks array
export const parseCSV = (csvText: string): Task[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].replace(/^\uFEFF/, '').split(';').map(h => h.replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.replace(/"/g, ''));
    return {
      id: values[0],
      situacao: values[1] as 'Ativa' | 'Concluída',
      tarefa: values[2],
      tags: values[3],
      workspace: values[4],
      criadaPor: values[5],
      criadaEm: values[6],
      canal: values[7],
      etapa: values[8],
      executor: values[9],
      quantidadePecas: parseInt(values[10]) || 0,
      quantidadeFormularios: parseInt(values[11]) || 0,
      iniciarEtapaEm: values[12],
      executarEtapaAte: values[13],
      concluirTarefaAte: values[14],
      esforco: parseEsforco(values[15]),
      ultimaResposta: values[16],
      prioridade: values[17],
      origem: values[18],
    };
  });
};

// Helper functions for dashboard metrics
export const getTasksByStatus = (tasks: Task[]) => {
  const ativas = tasks.filter(t => t.situacao === 'Ativa').length;
  const concluidas = tasks.filter(t => t.situacao === 'Concluída').length;
  return { ativas, concluidas };
};

export const getTasksByPriority = (tasks: Task[]) => {
  const priorities = ['Urgente', 'Alta', 'Média', 'Baixa', 'Não definida'] as const;
  return priorities.map(p => ({
    name: p,
    value: tasks.filter(t => parsePrioridade(t.prioridade) === p).length
  })).filter(p => p.value > 0);
};

export const getTasksByEtapa = (tasks: Task[]) => {
  const etapasSet = new Set(tasks.map(t => t.etapa));
  return Array.from(etapasSet).map(e => ({
    name: e,
    value: tasks.filter(t => t.etapa === e).length
  }));
};

export const getTotalEffort = (tasks: Task[]) => {
  return Math.round(tasks.reduce((sum, t) => sum + t.esforco, 0));
};

export const getUpcomingTasks = (tasks: Task[]) => {
  return tasks
    .filter(t => t.situacao === 'Ativa')
    .sort((a, b) => {
      const dateA = a.concluirTarefaAte.split('/').reverse().join('-');
      const dateB = b.concluirTarefaAte.split('/').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .slice(0, 5);
};

export const getEffortByTask = (tasks: Task[]) => {
  return tasks
    .slice(0, 8)
    .map(t => ({
      name: t.tarefa.length > 25 ? t.tarefa.substring(0, 25) + '...' : t.tarefa,
      esforco: t.esforco
    }));
};

export const getTasksByExecutor = (tasks: Task[]) => {
  const executorMap = new Map<string, number>();
  tasks.forEach(t => {
    const executor = t.executor || 'Não atribuído';
    executorMap.set(executor, (executorMap.get(executor) || 0) + 1);
  });
  return Array.from(executorMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTasksByCanal = (tasks: Task[]) => {
  const canalMap = new Map<string, number>();
  tasks.forEach(t => {
    const canal = t.canal || 'Não definido';
    canalMap.set(canal, (canalMap.get(canal) || 0) + 1);
  });
  return Array.from(canalMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTasksByOrigem = (tasks: Task[]) => {
  const origemMap = new Map<string, number>();
  tasks.forEach(t => {
    const origem = t.origem || 'Não definida';
    origemMap.set(origem, (origemMap.get(origem) || 0) + 1);
  });
  return Array.from(origemMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTasksByCriador = (tasks: Task[]) => {
  const criadorMap = new Map<string, number>();
  tasks.forEach(t => {
    const criador = t.criadaPor || 'Não definido';
    criadorMap.set(criador, (criadorMap.get(criador) || 0) + 1);
  });
  return Array.from(criadorMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getPecasFormulariosData = (tasks: Task[]) => {
  return tasks.map(t => ({
    name: t.tarefa.length > 20 ? t.tarefa.substring(0, 20) + '...' : t.tarefa,
    pecas: t.quantidadePecas,
    formularios: t.quantidadeFormularios,
  })).filter(t => t.pecas > 0 || t.formularios > 0);
};

export const getTotalPecas = (tasks: Task[]) => {
  return tasks.reduce((sum, t) => sum + t.quantidadePecas, 0);
};

export const getTotalFormularios = (tasks: Task[]) => {
  return tasks.reduce((sum, t) => sum + t.quantidadeFormularios, 0);
};

export const getTasksByMonth = (tasks: Task[]) => {
  const monthMap = new Map<string, number>();
  tasks.forEach(t => {
    if (t.criadaEm) {
      const parts = t.criadaEm.split('/');
      if (parts.length >= 2) {
        const monthYear = `${parts[1]}/${parts[2]}`;
        monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
      }
    }
  });
  return Array.from(monthMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const [mA, yA] = a.name.split('/').map(Number);
      const [mB, yB] = b.name.split('/').map(Number);
      return (yA * 12 + mA) - (yB * 12 + mB);
    });
};

export const getCompletionRate = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.situacao === 'Concluída').length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const getAverageEffort = (tasks: Task[]) => {
  const total = tasks.reduce((sum, t) => sum + t.esforco, 0);
  return tasks.length > 0 ? Math.round((total / tasks.length) * 10) / 10 : 0;
};

export const getPrioridadeLabel = parsePrioridade;

// Parse date from DD/MM/YYYY format
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return null;
};

// Top 5 tasks by effort
export const getTop5EffortTasks = (tasks: Task[]) => {
  return tasks
    .filter(t => t.esforco > 0)
    .sort((a, b) => b.esforco - a.esforco)
    .slice(0, 5)
    .map(t => ({
      name: t.tarefa.length > 30 ? t.tarefa.substring(0, 30) + '...' : t.tarefa,
      fullName: t.tarefa,
      value: t.esforco,
      etapa: t.etapa
    }));
};

// Tasks with deadlines analysis
export const getTasksWithDeadlines = (tasks: Task[]) => {
  const now = new Date();
  return tasks
    .filter(t => t.concluirTarefaAte && t.situacao === 'Ativa')
    .map(t => {
      const deadline = parseDate(t.concluirTarefaAte);
      const isOverdue = deadline && deadline < now;
      const daysUntil = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
      return {
        ...t,
        deadline,
        isOverdue,
        daysUntil
      };
    })
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.getTime() - b.deadline.getTime();
    });
};

// Risk analysis
export const getRiskAnalysis = (tasks: Task[]) => {
  const noPriority = tasks.filter(t => !t.prioridade || t.prioridade.trim() === '').length;
  const highEffort = tasks.filter(t => t.esforco > 10).length;
  const overdue = getTasksWithDeadlines(tasks).filter(t => t.isOverdue).length;
  
  const executors: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.executor) {
      executors[t.executor] = (executors[t.executor] || 0) + 1;
    }
  });
  const maxConcentration = Math.max(...Object.values(executors), 0);
  const totalWithExecutor = Object.values(executors).reduce((a, b) => a + b, 0);
  
  return {
    noPriorityPercent: tasks.length > 0 ? Math.round((noPriority / tasks.length) * 100) : 0,
    highEffortPercent: tasks.length > 0 ? Math.round((highEffort / tasks.length) * 100) : 0,
    overdueCount: overdue,
    concentrationPercent: totalWithExecutor > 0 ? Math.round((maxConcentration / totalWithExecutor) * 100) : 0
  };
};

// Effort accumulation by month
export const getEffortByMonth = (tasks: Task[]) => {
  const monthMap = new Map<string, { tarefas: number; esforco: number }>();
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  tasks.forEach(t => {
    if (t.criadaEm) {
      const parts = t.criadaEm.split('/');
      if (parts.length >= 3) {
        const monthKey = `${parts[2]}-${parts[1].padStart(2, '0')}`;
        const existing = monthMap.get(monthKey) || { tarefas: 0, esforco: 0 };
        existing.tarefas += 1;
        existing.esforco += t.esforco;
        monthMap.set(monthKey, existing);
      }
    }
  });
  
  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      return {
        name: monthNames[parseInt(month) - 1],
        tarefas: data.tarefas,
        esforco: Math.round(data.esforco)
      };
    });
};

// Gantt data
export const getGanttData = (tasks: Task[]) => {
  return tasks
    .filter(t => t.iniciarEtapaEm || t.concluirTarefaAte)
    .map(t => {
      const start = parseDate(t.iniciarEtapaEm) || parseDate(t.criadaEm);
      const end = parseDate(t.concluirTarefaAte) || parseDate(t.executarEtapaAte);
      
      return {
        id: t.id,
        name: t.tarefa.length > 35 ? t.tarefa.substring(0, 35) + '...' : t.tarefa,
        fullName: t.tarefa,
        start,
        end,
        etapa: t.etapa,
        prioridade: t.prioridade,
        situacao: t.situacao,
        esforco: t.esforco
      };
    })
    .filter(t => t.start || t.end)
    .sort((a, b) => {
      if (!a.start) return 1;
      if (!b.start) return -1;
      return a.start.getTime() - b.start.getTime();
    });
};

// Priority distribution object
export const getPriorityDistribution = (tasks: Task[]) => {
  const priorities = {
    'Urgente': 0,
    'Alta': 0,
    'Média': 0,
    'Baixa': 0,
    'Não definida': 0
  };
  
  tasks.forEach(t => {
    const p = parsePrioridade(t.prioridade);
    priorities[p]++;
  });
  
  return priorities;
};
