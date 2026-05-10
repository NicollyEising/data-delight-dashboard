// Generic helpers to parse eKyte CSV exports.

/** Parse "HH:MM" duration into total minutes. Returns 0 for empty/invalid. */
export function parseEkyteDuration(value: string | undefined | null): number {
  if (!value) return 0;
  const v = value.trim();
  if (!v) return 0;
  const parts = v.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/** Format minutes as "Xh Ymin" (or "Ymin" if <60). */
export function formatMinutes(min: number): string {
  if (!min || min <= 0) return '0min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Parse R$ monetary string. Handles "R$ 11,73", "R$ 0.00", "1.234,56", "1,234.56". */
export function parseEkyteMoney(value: string | undefined | null): number {
  if (!value) return 0;
  let v = value.replace(/R\$\s*/i, '').trim();
  if (!v) return 0;
  // If both . and , present, the last one is the decimal separator
  const lastDot = v.lastIndexOf('.');
  const lastComma = v.lastIndexOf(',');
  if (lastDot >= 0 && lastComma >= 0) {
    if (lastComma > lastDot) {
      v = v.replace(/\./g, '').replace(',', '.');
    } else {
      v = v.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    // Only comma -> decimal separator pt-BR
    v = v.replace(/\./g, '').replace(',', '.');
  }
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

/** Format number as Brazilian currency. */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

/** Parse generic numeric value (pt-BR or en-US). */
export function parseEkyteNumber(value: string | undefined | null): number {
  if (!value) return 0;
  return parseEkyteMoney(value);
}

/** Parse DD/MM/YYYY (with optional " HH:MM"). Returns null for empty/invalid. */
export function parseEkyteDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  const [datePart, timePart] = v.split(' ');
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  let hh = 0, mm = 0;
  if (timePart) {
    const [h, m] = timePart.split(':');
    hh = parseInt(h, 10) || 0;
    mm = parseInt(m, 10) || 0;
  }
  return new Date(year, month, day, hh, mm);
}

/** Format Date as DD/MM/YYYY. */
export function formatDate(d: Date | null): string {
  if (!d) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/** Parse a full eKyte CSV (separator ;, BOM, quoted fields with embedded ;).
 *  Returns rows as Record<headerName, rawString>. */
export function parseEkyteCSV(csvText: string): Record<string, string>[] {
  const text = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let cur = '';
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ';') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c === '\r') { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r.some(v => v.trim() !== ''))
    .map(r => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => { obj[h] = (r[idx] ?? '').trim(); });
      return obj;
    });
}

/** Split a person field (comma separated). */
export function parsePeople(value: string | undefined | null): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}
