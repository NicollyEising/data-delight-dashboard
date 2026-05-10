import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tarefas from "./pages/Tarefas";
import Projetos from "./pages/Projetos";
import Funil from "./pages/Funil";
import RedesSociais from "./pages/RedesSociais";
import NotFound from "./pages/NotFound";
import { AppNavbar } from "./components/AppNavbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Navigate to="/tarefas" replace />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/funil" element={<Funil />} />
          <Route path="/redes-sociais" element={<RedesSociais />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
