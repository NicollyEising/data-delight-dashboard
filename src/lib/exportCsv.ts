/** Export rows as CSV with ; separator, UTF-8 BOM, quoted fields. */
export function exportCsv(filenamePrefix: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]) {
  const esc = (v: string | number | boolean | null | undefined) => {
    if (v === null || v === undefined) return '""';
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.map(esc).join(';')];
  rows.forEach(r => lines.push(r.map(esc).join(';')));
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `${filenamePrefix}-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
