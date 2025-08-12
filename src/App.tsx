import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CharacterProvider } from "@/contexts/CharacterContext";
import { EquipmentProvider } from "@/contexts/EquipmentContext";
import { GroupProvider } from "@/contexts/GroupContext";
import { SecretItemsProvider } from "./contexts/SecretItemsContext";
// Pages
import DMDashboard from "./pages/dm/DMDashboard";
import PlayerDashboard from "./pages/player/PlayerDashboard";
import CharacterSheet from "./pages/player/CharacterSheet";
import PlayerInventory from "./pages/player/PlayerInventory";
import QuestJournal from "./pages/player/QuestJournal";
import NPCDirectory from "./components/NPCDirectory";
import ItemCatalog from "./components/ItemCatalog";
import GroupPanel from "./components/GroupPanel";

import QuestManager from "./components/QuestManager";
import CharacterManager from "./components/CharacterManager";
import SecretItems from "./pages/dm/SecretItems";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [currentView, setCurrentView] = useState<"dm" | "player">("dm");
  const location = useLocation();

  // Synchronize view with route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/player")) {
      setCurrentView("player");
    } else if (path.startsWith("/dm") || path === "/") {
      setCurrentView("dm");
    }
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
            <div className="ml-4">
              <h1 className="font-fantasy font-bold text-primary">
                {currentView === "dm" ? "Interface Maître du Jeu" : "Interface Joueur"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Routes MJ */}
              <Route path="/dm" element={<DMDashboard />} />
              <Route path="/dm/quests" element={<QuestManager />} />
              <Route path="/dm/items" element={<ItemCatalog />} />
              <Route path="/dm/secret-items" element={<SecretItems />} />
              <Route path="/dm/group" element={<GroupPanel />} />
              <Route path="/dm/characters" element={<CharacterManager />} />
              
              {/* Routes Joueur */}
              <Route path="/player" element={<PlayerDashboard />} />
              <Route path="/player/character" element={<CharacterSheet />} />
              <Route path="/player/inventory" element={<PlayerInventory />} />
              <Route path="/player/journal" element={<QuestJournal />} />
              
              {/* Redirections */}
              <Route path="/" element={<Navigate to="/dm" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CharacterProvider>
          <GroupProvider>
            <EquipmentProvider>
              <SecretItemsProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </SecretItemsProvider>
            </EquipmentProvider>
          </GroupProvider>
        </CharacterProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
