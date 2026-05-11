import { parseEkyteCSV, parseEkyteDate, parseEkyteMoney, parseEkyteNumber } from '@/lib/ekyteParser';

export interface Project {
  id: string;
  identificacao: string;
  projeto: string;
  tags: string;
  cronogramaCompartilhado: boolean;
  workspace: string;
  evolucaoTarefasPct: number;
  tarefasRealizadas: number;
  tarefasPrevistas: number;
  evolucaoHorasPct: number;
  horasRealizadas: number;
  horasPrevistas: number;
  tendenciaEsforco: number;
  tarefas: number;
  tarefasAtrasadas: number;
  tickets: number;
  ticketsAtrasados: number;
  inicio: Date | null;
  termino: Date | null;
  responsavel: string;
  piPrevisto: number;
  piRealizado: number;
  planejado: string;
  situacao: string;
  // derived
  saldo: number;
  margem: number;
  ativo: boolean;
  comAtraso: boolean;
}

function pct(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace('%', '').replace(',', '.')) || 0;
}

export function parseProjectsCSV(csvText: string): Project[] {
  const rows = parseEkyteCSV(csvText);
  return rows.map(r => {
    const horasPrev = parseEkyteNumber(r['Horas previstas']);
    const horasReal = parseEkyteNumber(r['Horas realizadas']);
    const piPrev = parseEkyteMoney(r['PI previsto']);
    const piReal = parseEkyteMoney(r['PI realizado']);
    const situacao = r['Situação'] || '—';
    const termino = parseEkyteDate(r['Término']);
    const tarefasAtras = parseInt(r['Tarefas atrasadas'] || '0', 10) || 0;
    return {
      id: r['Id'] || '',
      identificacao: r['Identificação'] || '',
      projeto: r['Projeto'] || '—',
      tags: r['Tags'] || '',
      cronogramaCompartilhado: !!(r['Cronograma compartilhado'] || '').trim(),
      workspace: r['Workspace'] || '—',
      evolucaoTarefasPct: pct(r['Evolução tarefas']),
      tarefasRealizadas: parseInt(r['Tarefas realizadas'] || '0', 10) || 0,
      tarefasPrevistas: parseInt(r['Tarefas previstas'] || '0', 10) || 0,
      evolucaoHorasPct: pct(r['Evolução horas']),
      horasRealizadas: horasReal,
      horasPrevistas: horasPrev,
      tendenciaEsforco: parseEkyteNumber(r['Tendência esforço']),
      tarefas: parseInt(r['Tarefas'] || '0', 10) || 0,
      tarefasAtrasadas: tarefasAtras,
      tickets: parseInt(r['Tickets'] || '0', 10) || 0,
      ticketsAtrasados: parseInt(r['Tickets atrasados'] || '0', 10) || 0,
      inicio: parseEkyteDate(r['Início']),
      termino,
      responsavel: r['Responsável'] || '—',
      piPrevisto: piPrev,
      piRealizado: piReal,
      planejado: r['Planejado'] || '—',
      situacao,
      saldo: piReal - piPrev,
      margem: piPrev > 0 ? ((piPrev - piReal) / piPrev) * 100 : 0,
      ativo: situacao === 'Ativo',
      comAtraso: tarefasAtras > 0,
    };
  });
}