import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Crown, 
  User, 
  Users, 
  Sword, 
  Shield, 
  ScrollText, 
  Map, 
  Home,
  BookOpen,
  Package,
  KeyRound
} from "lucide-react";
import grimoireLogo from "@/assets/grimoire-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import ViewSelector from "./ViewSelector";

interface AppSidebarProps {
  currentView: "dm" | "player";
  onViewChange: (view: "dm" | "player") => void;
}

const dmItems = [
  { title: "Tableau de Bord", url: "/dm", icon: Home },
  { title: "Gestion des Quêtes", url: "/dm/quests", icon: ScrollText },
  { title: "PNJ", url: "/dm/npcs", icon: Users },
  { title: "Objets", url: "/dm/items", icon: Sword },
  { title: "Objets Secrets", url: "/dm/secret-items", icon: KeyRound },
  { title: "Groupe", url: "/dm/group", icon: Shield },
  { title: "Carte Interactive", url: "/dm/map", icon: Map },
];

const playerItems = [
  { title: "Tableau de Bord", url: "/player", icon: Home },
  { title: "Fiche de Personnage", url: "/player/character", icon: User },
  { title: "Inventaire", url: "/player/inventory", icon: Package },
  { title: "Journal de Quête", url: "/player/journal", icon: BookOpen },
  { title: "Carte", url: "/player/map", icon: Map },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const items = currentView === "dm" ? dmItems : playerItems;
  
  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary border-primary/20 border" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className="w-60"
    >
      <SidebarContent className="bg-card/50 backdrop-blur-sm border-r border-border/50">
        {/* Header avec logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <img 
              src={grimoireLogo} 
              alt="Grimoire" 
              className="h-8 w-auto object-contain"
            />
            {true && (
              <div>
                <h2 className="font-fantasy font-bold text-primary text-sm">
                  Grimoire MJ
                </h2>
                <p className="text-xs text-muted-foreground">
                  Les Maraudeurs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sélecteur de vue */}
        {true && (
          <div className="p-4 border-b border-border/50">
            <ViewSelector 
              currentView={currentView} 
              onViewChange={onViewChange} 
            />
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-fantasy">
            {currentView === "dm" ? "Interface MJ" : "Interface Joueur"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {true && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}