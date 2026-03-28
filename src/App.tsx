import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WowFrame from "@/components/WowFrame";
import WowNavBar from "@/components/WowNavBar";
import CharacterSheet from "./pages/CharacterSheet";
import ProfessionsPage from "./pages/ProfessionsPage";
import TalentTree from "./pages/TalentTree";
import InventoryPage from "./pages/InventoryPage";
import AchievementsPage from "./pages/AchievementsPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={
            <WowFrame>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<CharacterSheet />} />
                    <Route path="/professions" element={<ProfessionsPage />} />
                    <Route path="/talents" element={<TalentTree />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <WowNavBar />
              </div>
            </WowFrame>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
