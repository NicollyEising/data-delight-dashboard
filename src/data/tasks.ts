export interface Task {
  id: string;
  titulo: string;
  situacao: 'Ativa' | 'Concluída';
  etapa: string;
  prioridade: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  esforco: number;
  concluirAte: string;
  executor: string;
}

export const tasks: Task[] = [
  {
    id: "1",
    titulo: "Pauta",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Urgente",
    esforco: 2,
    concluirAte: "2025-12-30",
    executor: "Fernanda Boaventura"
  },
  {
    id: "2",
    titulo: "E1 - LP - REVISÃO PEÇAS",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Urgente",
    esforco: 1,
    concluirAte: "2025-12-30",
    executor: "Fernanda Boaventura"
  },
  {
    id: "3",
    titulo: "E1 - MKT - REVISÃO DO MAPA",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Média",
    esforco: 3,
    concluirAte: "2025-12-31",
    executor: "Fernanda Boaventura"
  },
  {
    id: "4",
    titulo: "E1 - MKT - REVISÃO DO MAPA",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Baixa",
    esforco: 1,
    concluirAte: "2025-12-31",
    executor: "Fernanda Boaventura"
  },
  {
    id: "5",
    titulo: "Pauta",
    situacao: "Concluída",
    etapa: "Análise",
    prioridade: "Média",
    esforco: 2,
    concluirAte: "2025-12-26",
    executor: "Fernanda Boaventura"
  },
  {
    id: "6",
    titulo: "Pauta",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Baixa",
    esforco: 1,
    concluirAte: "2026-01-06",
    executor: "Fernanda Boaventura"
  },
  {
    id: "7",
    titulo: "E1 - LP - BRIEFING DE NOVAS PEÇAS",
    situacao: "Ativa",
    etapa: "Briefing",
    prioridade: "Urgente",
    esforco: 3,
    concluirAte: "2025-12-30",
    executor: "Fernanda Boaventura"
  },
  {
    id: "8",
    titulo: "E1 - MKT - REVISÃO DE PEÇA",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Média",
    esforco: 1,
    concluirAte: "2025-12-30",
    executor: "Fernanda Boaventura"
  },
  {
    id: "9",
    titulo: "E1 - MKT - REVISÃO DE PEÇA",
    situacao: "Ativa",
    etapa: "Análise",
    prioridade: "Média",
    esforco: 1,
    concluirAte: "2025-12-31",
    executor: "Fernanda Boaventura"
  },
  {
    id: "10",
    titulo: "E1 - MKT - REVISÃO DE PEÇA",
    situacao: "Concluída",
    etapa: "Briefing",
    prioridade: "Alta",
    esforco: 1,
    concluirAte: "2025-12-26",
    executor: "Fernanda Boaventura"
  },
  {
    id: "11",
    titulo: "E1 - MKT - REVISÃO DE PEÇA",
    situacao: "Ativa",
    etapa: "Planejamento",
    prioridade: "Média",
    esforco: 1,
    concluirAte: "2026-01-03",
    executor: "Fernanda Boaventura"
  },
  {
    id: "12",
    titulo: "E1 - MKT - APROVAÇÃO DE PEÇA",
    situacao: "Ativa",
    etapa: "Planejamento",
    prioridade: "Baixa",
    esforco: 1,
    concluirAte: "2026-01-07",
    executor: "Fernanda Boaventura"
  },
  {
    id: "13",
    titulo: "E1 - LP - REVISÃO DA LP",
    situacao: "Ativa",
    etapa: "Planejamento",
    prioridade: "Alta",
    esforco: 2,
    concluirAte: "2026-01-02",
    executor: "Fernanda Boaventura"
  },
  {
    id: "14",
    titulo: "E1 - LP - REVISÃO DA LP",
    situacao: "Ativa",
    etapa: "Briefing",
    prioridade: "Alta",
    esforco: 4,
    concluirAte: "2026-01-02",
    executor: "Fernanda Boaventura"
  }
];

// Helper functions for dashboard metrics
export const getTasksByStatus = () => {
  const ativas = tasks.filter(t => t.situacao === 'Ativa').length;
  const concluidas = tasks.filter(t => t.situacao === 'Concluída').length;
  return { ativas, concluidas };
};

export const getTasksByPriority = () => {
  const priorities = ['Urgente', 'Alta', 'Média', 'Baixa'] as const;
  return priorities.map(p => ({
    name: p,
    value: tasks.filter(t => t.prioridade === p).length
  }));
};

export const getTasksByEtapa = () => {
  const etapas = ['Análise', 'Briefing', 'Planejamento'] as const;
  return etapas.map(e => ({
    name: e,
    value: tasks.filter(t => t.etapa === e).length
  }));
};

export const getTotalEffort = () => {
  return tasks.reduce((sum, t) => sum + t.esforco, 0);
};

export const getUpcomingTasks = () => {
  return tasks
    .filter(t => t.situacao === 'Ativa')
    .sort((a, b) => new Date(a.concluirAte).getTime() - new Date(b.concluirAte).getTime())
    .slice(0, 5);
};

export const getEffortByTask = () => {
  return tasks
    .slice(0, 8)
    .map(t => ({
      name: t.titulo.length > 20 ? t.titulo.substring(0, 20) + '...' : t.titulo,
      esforco: t.esforco
    }));
};
