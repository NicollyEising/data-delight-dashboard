import { LayoutGrid, Columns3, Table as TableIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'cards' | 'kanban' | 'table';

const items: { mode: ViewMode; label: string; icon: any }[] = [
  { mode: 'cards', label: 'Cards + Gráficos', icon: LayoutGrid },
  { mode: 'kanban', label: 'Kanban', icon: Columns3 },
  { mode: 'table', label: 'Tabela', icon: TableIcon },
];

export function ViewSelector({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
      {items.map(it => {
        const active = value === it.mode;
        return (
          <button
            key={it.mode}
            onClick={() => onChange(it.mode)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <it.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
