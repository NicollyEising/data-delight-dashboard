import { Task } from '@/data/tasks';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { formatMinutes, formatBRL } from '@/lib/ekyteParser';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary border-b border-border pb-1.5">{title}</h4>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">{children}</dl>
    </div>
  );
}
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground font-medium break-words">{value || <span className="text-muted-foreground">—</span>}</dd>
    </>
  );
}

export function TaskDetailDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  return (
    <Sheet open={!!task} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {task && (
          <>
            <SheetHeader>
              <SheetTitle className="text-left pr-6">{task.tarefa}</SheetTitle>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline">{task.situacao}</Badge>
                {task.urgente && <Badge className="bg-destructive/10 text-destructive border border-destructive/20">URGENTE</Badge>}
                {task.atrasada && <Badge className="bg-destructive/10 text-destructive border border-destructive/20">Atrasada</Badge>}
                {task.semResponsavel && <Badge className="bg-warning/10 text-warning border border-warning/20">Sem responsável</Badge>}
              </div>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <Group title="Identificação">
                <Field label="Id" value={task.id} />
                <Field label="Workspace" value={task.workspace} />
                <Field label="Tags" value={task.tags} />
                <Field label="Origem" value={task.origem} />
              </Group>
              <Group title="Workflow">
                <Field label="Fluxo de trabalho" value={task.fluxoTrabalho} />
                <Field label="Etapa" value={task.etapa} />
                <Field label="Situação" value={task.situacao} />
                <Field label="Prioridade" value={task.prioridade} />
                <Field label="Canal" value={task.canal} />
              </Group>
              <Group title="Pessoas">
                <Field label="Criada por" value={task.criadaPor} />
                <Field label="Responsável" value={task.responsavel.join(', ')} />
                <Field label="Executor" value={task.executor} />
              </Group>
              <Group title="Datas">
                <Field label="Criada em" value={task.criadaEm} />
                <Field label="Iniciar etapa em" value={task.iniciarEtapaEm} />
                <Field label="Executar etapa até" value={task.executarEtapaAte} />
                <Field label="Concluir tarefa até" value={task.concluirTarefaAte} />
                <Field label="Última resposta" value={task.ultimaResposta} />
                <Field label="Restam" value={task.restamMin > 0 ? formatMinutes(task.restamMin) : '—'} />
              </Group>
              <Group title="Volume de produção">
                <Field label="Quantidade de peças" value={task.quantidadePecas} />
                <Field label="Quantidade de formulários" value={task.quantidadeFormularios} />
                <Field label="Esforço Realizado" value={formatMinutes(task.esforcoRealizadoMin)} />
              </Group>
              <Group title="Financeiro">
                <Field label="Orçamento" value={formatBRL(task.orcamento)} />
                <Field label="Valor previsto" value={formatBRL(task.valorPrevisto)} />
                <Field label="Valor realizado" value={formatBRL(task.valorRealizado)} />
              </Group>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
