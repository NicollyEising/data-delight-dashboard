import { Task } from '@/data/tasks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, AlertTriangle, UserX, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KanbanView({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  const etapas = Array.from(new Set(tasks.map(t => t.etapa).filter(Boolean)));
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min">
        {etapas.map(etapa => {
          const list = tasks.filter(t => t.etapa === etapa);
          return (
            <div key={etapa} className="w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-foreground">{etapa}</h3>
                <Badge variant="secondary">{list.length}</Badge>
              </div>
              <div className="space-y-2">
                {list.map(t => (
                  <Card
                    key={t.id}
                    onClick={() => onSelect(t)}
                    draggable
                    className={cn(
                      'p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 active:opacity-60',
                      t.atrasada ? 'border-l-destructive' : t.urgente ? 'border-l-orange-500' : 'border-l-primary/30'
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {t.urgente && <Flame className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />}
                      <p className="text-sm font-medium text-foreground line-clamp-2">{t.tarefa}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] py-0 h-4">{t.workspace}</Badge>
                      {t.semResponsavel && (
                        <span className="inline-flex items-center gap-0.5 text-warning"><UserX className="h-3 w-3" /></span>
                      )}
                      {t.atrasada && (
                        <span className="inline-flex items-center gap-0.5 text-destructive"><AlertTriangle className="h-3 w-3" /></span>
                      )}
                    </div>
                    {t.responsavel.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1.5 truncate">{t.responsavel.join(', ')}</p>
                    )}
                    {t.concluirTarefaAte && (
                      <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {t.concluirTarefaAte}
                      </p>
                    )}
                  </Card>
                ))}
                {list.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">vazio</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
