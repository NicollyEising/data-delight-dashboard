Esta é uma evolução grande (4 páginas + navbar + dezenas de gráficos, filtros, drawers, exportação). Para entregar com qualidade sem quebrar o que já funciona, proponho dividir em **4 entregas sequenciais**. Cada entrega resulta em um app utilizável e estável. Após cada uma você revisa e libera a próxima.

---

## Convenções globais (aplicadas em todas as entregas)

- Criar `src/lib/ekyteParser.ts` com helpers reutilizáveis: `parseEkyteDuration` (HH:MM → minutos), `parseEkyteMoney` (R$ com `.` ou `,`), `parseEkyteNumber`, `parseEkyteDate` (DD/MM/AAAA), `parseEkyteCSV` (separador `;`, BOM, aspas).
- Criar `src/lib/exportCsv.ts`: gera CSV `;` UTF-8 com BOM, nome `{pagina}-export-AAAA-MM-DD.csv`.
- Cores semânticas via tokens HSL em `index.css`: `--success`, `--danger`, `--warning`, `--info`, `--neutral` (já existem alguns; estendo).
- Skeletons de carregamento (sem spinners), estados vazios com botão "Limpar filtros", tooltips em KPIs, atalhos `/` e `Esc`.

---

## Entrega 1 — Navbar global + extensão do Dashboard de Tarefas

**Fase 0 — Navbar**
- `src/components/AppNavbar.tsx`: logo "eKyte Insights" à esquerda; itens Tarefas/Projetos/Funil/Redes-Sociais com ícones lucide; sticky `top-0 z-50` com sombra ao rolar; ativo com borda inferior `primary`; menu hambúrguer < 768px.
- Montar no `App.tsx` envolvendo `<Routes>`.
- Renomear rota `/` para `/tarefas` e adicionar redirect `/` → `/tarefas`. Stubs simples para `/projetos`, `/funil`, `/redes-sociais` (substituídos nas próximas entregas).

**Fase 1 — Parser completo de tarefa.csv (25 colunas)**
- Renomear `public/data/tarefas.csv` → `public/data/tarefa.csv` (e atualizar `useTasks.ts`).
- Estender `Task`: `fluxoTrabalho`, `responsavel: string[]`, `restamMin`, `orcamento`, `valorPrevisto`, `valorRealizado`.
- Derivados: `atrasada`, `urgente`, `semResponsavel`.

**Fase 2 — KPIs (4 → 7)**
- Adicionar `KPICard` para Atrasadas (vermelho), Sem responsável (amarelo), Saldo financeiro (verde/vermelho).

**Fase 3 — Barra de filtros sticky**
- `src/components/dashboard/TasksFilterBar.tsx` com Workspace, Situação, Fluxo, Responsável (multi com search), Prioridade (toggles), período "Concluir até" (date range), tipo de origem (Projeto/Ticket/Sem). Estado central via `useTasksFilters` hook. Todos KPIs/gráficos passam a ler `filteredTasks`.

**Fase 4 — Seletor de visualização**
- Toggle Cards+Gráficos / Kanban / Tabela acima do conteúdo.
- Kanban: colunas por Etapa, cards com nome/workspace/responsável/prazo/badges.

**Fase 5 — Tabela completa + Drawer**
- Tabela paginada (25/pg) com ordenação, badges de atrasada/urgente/sem-responsavel, formatação Restam.
- Drawer lateral com 25 campos agrupados (Identificação, Workflow, Pessoas, Datas, Volume, Financeiro).

**Fase 6 — Novos gráficos**
- `LoadByPersonChart` (Responsável vs Executor, top 15) e `WorkflowDistributionChart` (empilhado por Situação).

**Fase 7 — Search global + Exportar**
- Input de search (Tarefa, Workspace, Responsável, Executor, Etapa, Tags) + botão Exportar (25 cols + 3 derivados).

**Fase 8 — Polimento**
- Estados vazios, skeletons, tooltips, atalhos `/`, `Esc`, `1/2/3`.

---

## Entrega 2 — Página /projetos

- Parser de `public/data/projeto.csv` (29 colunas) usando helpers do `ekyteParser`.
- Hook `useProjects` + `useProjectsFilters`.
- 4 KPIs (Total, Ativos vs Pausados, Tarefas atrasadas, Saldo financeiro).
- Filtros sticky (Workspace, Situação, Responsável, Planejado, datas Início/Conclusão, faixa de Valor previsto, "apenas com atraso").
- 4 gráficos 2×2: Top 10 por tarefas (empilhado), Top 10 por Valor previsto (agrupado), Donut por Situação, Scatter Margem prev × real com diagonal.
- Timeline Gantt (top 20 por valor) com marca "hoje".
- Tabela paginada + Drawer com 29 campos + mini-gráfico Realizado/Previsto.
- Search + Export + skeletons + estados vazios.

---

## Entrega 3 — Página /funil (Funil Multicanal)

- Copiar `multicanal.csv` para `public/data/funil-multicanal.csv`.
- Parser com **unpivot**: detecta datas no header, separa sufixos de origem (Google Analytics, RD Station, Meta Ads), mantém matriz pivotada original em memória.
- 6 KPIs com delta vs período anterior.
- Funil visual em trapézios (Impressões → Vendas) com taxas de conversão entre etapas, gradiente azul→verde.
- Gráficos: Evolução diária (linhas, eixo Y duplo), Origem dos Leads SQL (barras empilhadas), CPL por origem (linhas) com média.
- Eficiência por origem: funil agrupado + ROAS horizontal com referência em 1.
- Filtros: período, canais, granularidade (Dia/Semana/Mês com agregação), comparação (vs anterior / ano passado / off).
- Tabela matriz colapsável com sticky col/row + Exportar matriz CSV.

---

## Entrega 4 — Página /redes-sociais

- Copiar arquivo. Como o input fornecido é `redes-sociais.csv` (não xlsx), usarei o CSV; se houver xlsx, instalo `xlsx` lib e leio a aba "Monitoramento de Redes Sociais".
- Parser com cabeçalho de 2 linhas (merge → `instagram_seguidores`, etc.) e estrutura aninhada `redes.{instagram|facebook|linkedin|tiktok}`.
- Derivados por linha/rede: `taxa_engajamento`, `interacoes_totais`, `crescimento_pct`.
- 4 cards de rede com cores das marcas + sparkline de seguidores.
- Faixa de Insights (4 cards: Melhor performer, Maior crescimento, Atenção, Oportunidade).
- 4 gráficos 2×2: Seguidores por rede×workspace, Radar de performance (por workspace), Composição engajamento empilhada, Engajamento/seguidor horizontal.
- Tabela com cabeçalhos agrupados por rede (cores das marcas), workspace sticky, totais.
- Filtros: Workspace, Redes (toggles), Métrica destacada, período, mínimo de seguidores.
- Drill-down (drawer fullscreen) ao clicar no card da rede: histórico, ranking, donut de engajamento, export por rede.
- Search global + export consolidado + atalhos `1/2/3/4`.

---

## Detalhes técnicos relevantes

- Stack: React 18 + Vite + TS + Tailwind + shadcn/ui + recharts + react-router-dom (já no projeto).
- Sem novas dependências para Entregas 1–3. Para Entrega 4, possivelmente `xlsx` (SheetJS) se o arquivo real for `.xlsx`.
- Filtros como contexto/hook por página para evitar prop drilling.
- Date range: usar `react-day-picker` (já em shadcn `Calendar`).
- Drag-and-drop visual no Kanban: implementação leve com HTML5 DnD (sem libs novas).
- Toda formatação de datas, moeda e duração centralizada em `src/lib/format.ts`.

---

## Pergunta antes de começar

A Entrega 1 sozinha já é grande (~15 arquivos novos/editados). Confirma que quer que eu comece por ela e siga em sequência, ou prefere que eu entregue tudo de uma vez (maior risco de erros e iteração mais lenta)?

```text
Entrega 1: Navbar + Tarefas estendido  ← começar aqui
Entrega 2: /projetos
Entrega 3: /funil
Entrega 4: /redes-sociais
```
