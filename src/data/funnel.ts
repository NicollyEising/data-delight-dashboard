import { parseEkyteCSV, parseEkyteMoney, parseEkyteNumber } from '@/lib/ekyteParser';

export interface ChannelRow {
  canal: string;
  valorGasto: number;
  impressoes: number;
  cpm: number;
  cliques: number;
  cpc: number;
  visitasTotais: number;
  cpvTotal: number;
  visitasUnicas: number;
  cpvUnico: number;
  leadsMqlSql: number;
  cplMql: number;
  leadsSql: number;
  cplSql: number;
  vendas: number;
  cpa: number;
  receita: number;
  roas: number;
  ticketMedio: number;
  isTotal: boolean;
}

export function parseFunnelCSV(csvText: string): ChannelRow[] {
  const rows = parseEkyteCSV(csvText);
  return rows.map(r => {
    const canal = (r['Canal'] || '').replace(/\s+/g, ' ').trim();
    return {
      canal,
      valorGasto: parseEkyteMoney(r['Valor gasto']),
      impressoes: parseEkyteNumber(r['Impressões']),
      cpm: parseEkyteMoney(r['CPM']),
      cliques: parseEkyteNumber(r['Cliques']),
      cpc: parseEkyteMoney(r['CPC']),
      visitasTotais: parseEkyteNumber(r['Visitas Totais']),
      cpvTotal: 0,
      visitasUnicas: parseEkyteNumber(r['Visitas Únicas']),
      cpvUnico: 0,
      leadsMqlSql: parseEkyteNumber(r['Leads (MQL+SQL)']),
      cplMql: parseEkyteMoney(r['CPL']),
      leadsSql: parseEkyteNumber(r['Leads (SQL)']),
      cplSql: 0,
      vendas: parseEkyteNumber(r['Vendas']),
      cpa: parseEkyteMoney(r['CPA']),
      receita: parseEkyteMoney(r['Receita']),
      roas: parseEkyteNumber(r['ROAS']),
      ticketMedio: parseEkyteMoney(r['Ticket médio']),
      isTotal: canal.toLowerCase() === 'total',
    };
  }).filter(r => r.canal);
}