import { useEffect, useState } from 'react';
import { Project, parseProjectsCSV } from '@/data/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/projeto.csv')
      .then(r => { if (!r.ok) throw new Error('Falha ao carregar projetos'); return r.text(); })
      .then(text => setProjects(parseProjectsCSV(text)))
      .catch(e => setError(e instanceof Error ? e.message : 'Erro'))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}