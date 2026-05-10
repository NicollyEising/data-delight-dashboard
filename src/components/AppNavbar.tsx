import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ListChecks, FolderKanban, Filter, Share2, Menu, X, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/tarefas', label: 'Tarefas', icon: ListChecks },
  { to: '/projetos', label: 'Projetos', icon: FolderKanban },
  { to: '/funil', label: 'Funil Multicanal', icon: Filter },
  { to: '/redes-sociais', label: 'Redes Sociais', icon: Share2 },
];

export function AppNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/tarefas" className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg">eKyte Insights</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2 border-transparent',
                    isActive
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                    isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
