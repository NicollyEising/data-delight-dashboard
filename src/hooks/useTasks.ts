import { useState, useEffect } from 'react';
import { Task, parseCSV } from '@/data/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/data/tarefas.csv');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const csvText = await response.text();
        const parsedTasks = parseCSV(csvText);
        setTasks(parsedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return { tasks, loading, error };
}
