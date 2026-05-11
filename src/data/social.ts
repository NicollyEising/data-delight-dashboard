import { parseEkyteCSV, parseEkyteDate } from '@/lib/ekyteParser';

export interface Publication {
  id: string;
  canal: string;
  publicacao: string;
  workspace: string;
  template: string;
  etapa: string;
  veiculacao: Date | null;
  veiculacaoRaw: string;
  situacao: string;
  publicada: boolean;
  vencida: boolean;
}

export function parsePublicationsCSV(csvText: string): Publication[] {
  const rows = parseEkyteCSV(csvText);
  const today = new Date(); today.setHours(0,0,0,0);
  return rows.map(r => {
    const veic = parseEkyteDate(r['Veiculação']);
    const situacao = r['Situação'] || '—';
    const publicada = situacao.toLowerCase().includes('publicado') && !situacao.toLowerCase().includes('não');
    return {
      id: r['Id'] || '',
      canal: r['Canal'] || '—',
      publicacao: r['Publicação'] || '—',
      workspace: r['Workspace'] || '—',
      template: r['Template'] || '—',
      etapa: r['Etapa'] || '—',
      veiculacao: veic,
      veiculacaoRaw: r['Veiculação'] || '',
      situacao,
      publicada,
      vencida: !publicada && veic !== null && veic < today,
    };
  }).filter(p => p.id);
}