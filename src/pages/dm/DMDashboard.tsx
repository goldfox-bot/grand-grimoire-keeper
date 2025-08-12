import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Sword, Shield, Sparkles, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DMDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      {/* Header Dashboard */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-fantasy font-bold adventure-glow mb-4">
          Interface Maître du Jeu
        </h1>
        <p className="text-lg text-muted-foreground mb-4 font-modern">
          Campagne D&D • Les Maraudeurs de Joyaux Tendres
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Badge variant="outline" className="text-orange-200 border-orange-400/50 bg-orange-500/10">
            <Sparkles className="w-4 h-4 mr-2" />
            Niveau de Groupe : 5-8
          </Badge>
          <Badge variant="outline" className="text-blue-200 border-blue-400/50 bg-blue-500/10">
            Sessions : 8
          </Badge>
        </div>
      </div>

      {/* Outils Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fiche de Groupe */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Shield className="w-6 h-6 text-green-400" />
              Fiche de Groupe
            </CardTitle>
            <CardDescription>
              Les héros des Maraudeurs de Joyaux Tendres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-slate-300 leading-relaxed">
              Fiches optimisées pour les combats avec statistiques et portraits de chaque membre.
            </p>
            <Button 
              onClick={() => navigate("/dm/group")} 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Voir le Groupe
            </Button>
          </CardContent>
        </Card>

        {/* Annuaire des PNJ */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Users className="w-6 h-6 text-blue-400" />
              Annuaire des PNJ
            </CardTitle>
            <CardDescription>
              Gérez vos personnages non-joueurs et leurs relations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-slate-300 leading-relaxed">
              Créez des fiches détaillées pour chaque PNJ avec portraits, descriptions et inventaires marchands.
            </p>
            <Button 
              onClick={() => navigate("/dm/npcs")} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Voir les PNJ
            </Button>
          </CardContent>
        </Card>

        {/* Catalogue d'Objets */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Sword className="w-6 h-6 text-purple-400" />
              Catalogue d'Objets
            </CardTitle>
            <CardDescription>
              Armes, armures, potions et trésors magiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-slate-300 leading-relaxed">
              Gérez l'inventaire du groupe et les objets légendaires de votre campagne.
            </p>
            <Button 
              onClick={() => navigate("/dm/items")} 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Explorer le Catalogue
            </Button>
          </CardContent>
        </Card>

        {/* Outils de Session */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Plus className="w-6 h-6 text-amber-400" />
              Outils de Session
            </CardTitle>
            <CardDescription>
              Générateurs et aides de jeu en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-slate-300 leading-relaxed">
              Initiative, météo, générateurs de noms et événements aléatoires.
            </p>
            <Button 
              variant="outline"
              className="w-full border-amber-400/50 text-amber-200 hover:bg-amber-500/10"
            >
              Bientôt Disponible
            </Button>
          </CardContent>
        </Card>

        {/* Outils de Session */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Plus className="w-6 h-6 text-amber-400" />
              Outils de Session
            </CardTitle>
            <CardDescription>
              Générateurs et aides de jeu en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-slate-300 leading-relaxed">
              Initiative, météo, générateurs de noms et événements aléatoires.
            </p>
            <Button 
              variant="outline"
              className="w-full border-amber-400/50 text-amber-200 hover:bg-amber-500/10"
            >
              Bientôt Disponible
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">4</h3>
          <p className="text-sm text-slate-400 font-medium">Héros Actifs</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">25</h3>
          <p className="text-sm text-slate-400 font-medium">PNJ Rencontrés</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">47</h3>
          <p className="text-sm text-slate-400 font-medium">Objets Collectés</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">8</h3>
          <p className="text-sm text-slate-400 font-medium">Sessions Jouées</p>
        </div>
      </div>
    </div>
  );
};

export default DMDashboard;