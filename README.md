# 📊 Dashboard de Gestão de Tarefas

Um dashboard analítico moderno e responsivo para visualização e gestão de tarefas, desenvolvido com React, TypeScript e Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)

## ✨ Funcionalidades

### 📈 Indicadores Gerais (KPIs)
- **Taxa de conclusão** - Percentual de tarefas finalizadas
- **Esforço total** - Soma de horas estimadas
- **Esforço médio** - Média de horas por tarefa
- **Tarefas ativas** - Contagem e percentual
- **Distribuição por prioridade** - Alta, Média, Baixa, Urgente

### 📊 Visualizações
- **Gráfico de Rosca** - Distribuição por etapa do fluxo
- **Gráfico de Pizza** - Status das tarefas (Ativa vs Concluída)
- **Gráfico de Barras Horizontal** - Top 5 tarefas por esforço
- **Gráfico de Área** - Timeline de esforço acumulado por mês
- **Gráfico de Gantt** - Cronograma visual com prazos
- **Gauge de Progresso** - Taxa de conclusão visual

### 🔥 Análise de Risco
- Tarefas sem prioridade definida
- Concentração por executor
- Tarefas de alto esforço (>10h)
- Tarefas com prazo vencido
- Análise temporal por mês

## 🚀 Tecnologias

- **[React 18](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[Recharts](https://recharts.org/)** - Gráficos
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[date-fns](https://date-fns.org/)** - Manipulação de datas

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dashboard-tarefas.git

# Entre no diretório
cd dashboard-tarefas

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/
│   │   ├── KPICards.tsx          # Cards de indicadores
│   │   ├── EtapaDonutChart.tsx   # Gráfico de rosca por etapa
│   │   ├── StatusChart.tsx       # Gráfico de status
│   │   ├── PriorityChart.tsx     # Gráfico de prioridade
│   │   ├── Top5EffortChart.tsx   # Top 5 por esforço
│   │   ├── EffortTimelineChart.tsx # Timeline de esforço
│   │   ├── GanttChart.tsx        # Gráfico de Gantt
│   │   ├── CompletionGauge.tsx   # Gauge de conclusão
│   │   ├── RiskAnalysisCard.tsx  # Análise de risco
│   │   └── ...
│   └── ui/                       # Componentes shadcn/ui
├── data/
│   └── tasks.ts                  # Funções de processamento
├── hooks/
│   └── useTasks.ts               # Hook para carregar tarefas
├── pages/
│   └── Index.tsx                 # Página principal
└── public/
    └── data/
        └── tarefas.csv           # Dados das tarefas
```

## 📋 Formato dos Dados

O dashboard lê dados de um arquivo CSV com as seguintes colunas:

| Campo | Descrição |
|-------|-----------|
| `Id` | Identificador único |
| `Situação` | Status (Ativa/Concluída) |
| `Tarefa` | Nome da tarefa |
| `Tags` | Tags associadas |
| `Workspace` | Espaço de trabalho |
| `Criada por` | Autor da tarefa |
| `Criada em` | Data de criação |
| `Canal` | Canal de origem |
| `Etapa` | Etapa do fluxo |
| `Executor` | Responsável |
| `Quantidade de peças` | Número de peças |
| `Quantidade de formulários` | Número de formulários |
| `Iniciar etapa em` | Data de início |
| `Executar etapa até` | Prazo da etapa |
| `Concluir tarefa até` | Prazo final |
| `Esforço` | Tempo estimado (HH:MM) |
| `Última resposta` | Data da última resposta |
| `Prioridade` | Nível de prioridade |
| `Origem` | Origem da demanda |

## 🎨 Customização

### Cores
As cores podem ser customizadas no arquivo `src/index.css`:

```css
:root {
  --chart-1: 220 70% 50%;  /* Azul */
  --chart-2: 160 60% 45%;  /* Verde */
  --chart-3: 30 80% 55%;   /* Laranja */
  --chart-4: 280 65% 60%;  /* Roxo */
  --chart-5: 340 75% 55%;  /* Rosa */
}
```

### Dados
Substitua o arquivo `public/data/tarefas.csv` com seus próprios dados mantendo o formato especificado.

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- **Desktop** - Layout em grid com múltiplas colunas
- **Tablet** - Grid adaptativo
- **Mobile** - Layout em coluna única

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)
