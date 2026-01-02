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
