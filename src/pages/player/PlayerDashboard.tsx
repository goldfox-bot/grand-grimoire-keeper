import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Package, BookOpen, Heart, Zap, Shield, Sword } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "@/contexts/CharacterContext";
import { useGroup } from "@/contexts/GroupContext";

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const { selectedCharacter } = useCharacter();
  const { name: groupName, members } = useGroup();

  if (!selectedCharacter) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          Aucun personnage sélectionné
        </h2>
        <p className="text-muted-foreground">
          Veuillez sélectionner un personnage dans la barre latérale pour accéder à votre tableau de bord.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Joueur */}
      <div className="text-center">
        <h1 className="text-4xl font-fantasy font-bold adventure-glow mb-4">
          Interface Joueur
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          {groupName}
        </p>
        <Badge variant="outline" className="text-green-200 border-green-400/50 bg-green-500/10">
          <User className="w-4 h-4 mr-2" />
          Personnage Actif
        </Badge>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {members.map((m) => (
            <Badge key={m.id} variant="outline" className="text-xs">
              {m.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Résumé du Personnage */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-slate-100">
            <User className="w-6 h-6 text-blue-400" />
            {selectedCharacter.name}
          </CardTitle>
          <CardDescription>
            {selectedCharacter.race} {selectedCharacter.class} • Niveau {selectedCharacter.level}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
              <Heart className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-lg font-bold text-red-300">{selectedCharacter.stats.hp.current}/{selectedCharacter.stats.hp.max}</p>
                <p className="text-xs text-red-200">Points de Vie</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-lg font-bold text-blue-300">{selectedCharacter.stats.ac}</p>
                <p className="text-xs text-blue-200">Classe d'Armure</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-lg font-bold text-green-300">+{selectedCharacter.stats.proficiencyBonus}</p>
                <p className="text-xs text-green-200">Bonus Profil</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
              <Sword className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-lg font-bold text-purple-300">{selectedCharacter.stats.weaponDamage}</p>
                <p className="text-xs text-purple-200">Dégâts Arme</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/player/character")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Voir la Fiche Complète
          </Button>
        </CardContent>
      </Card>

      {/* Outils Joueur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventaire */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Package className="w-6 h-6 text-amber-400" />
              Mon Inventaire
            </CardTitle>
            <CardDescription>
              Objets, équipement et richesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Pièces d'or</span>
                <span className="text-amber-300 font-bold">{selectedCharacter.inventory.gold} po</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Objets équipés</span>
                <span className="text-blue-300">{selectedCharacter.inventory.equippedItems}/{selectedCharacter.inventory.maxEquipped}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Poids transporté</span>
                <span className="text-green-300">{selectedCharacter.inventory.weight.current}/{selectedCharacter.inventory.weight.max} kg</span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/player/inventory")} 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Gérer l'Inventaire
            </Button>
          </CardContent>
        </Card>

        {/* Journal de Quête */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Journal de Quête
            </CardTitle>
            <CardDescription>
              Aventures et objectifs en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {selectedCharacter.quests.active.map((quest, index) => (
                <div key={quest.id} className="p-2 bg-emerald-500/10 border border-emerald-400/20 rounded text-sm">
                  <span className="text-emerald-300 font-medium">Active:</span> {quest.title}
                </div>
              ))}
              <div className="text-xs text-slate-400">
                {selectedCharacter.quests.completed.length} quêtes terminées
              </div>
            </div>
            <Button 
              onClick={() => navigate("/player/journal")} 
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              Consulter le Journal
            </Button>
          </CardContent>
        </Card>

        {/* Carte d'Exploration */}
        <Card className="modern-card group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-100 group-hover:text-orange-200 transition-colors">
              <Map className="w-6 h-6 text-cyan-400" />
              Carte d'Exploration
            </CardTitle>
            <CardDescription>
              Lieux découverts et points d'intérêt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-slate-300">
                <span className="text-cyan-300 font-medium">{selectedCharacter.exploration.locationsDiscovered}</span> lieux découverts
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-purple-300 font-medium">{selectedCharacter.exploration.dungeonsExplored}</span> donjons explorés
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-green-300 font-medium">{selectedCharacter.exploration.citiesVisited}</span> villes visitées
              </div>
            </div>
            <Button 
              onClick={() => navigate("/player/map")} 
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
            >
              Explorer la Carte
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progression et Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">{selectedCharacter.level}</h3>
          <p className="text-sm text-slate-400 font-medium">Niveau Actuel</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">{selectedCharacter.xp.total.toLocaleString()}</h3>
          <p className="text-sm text-slate-400 font-medium">XP Total</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">{selectedCharacter.quests.completed.length}</h3>
          <p className="text-sm text-slate-400 font-medium">Quêtes Terminées</p>
        </div>
        <div className="stats-card p-6 text-center">
          <h3 className="text-3xl font-bold text-orange-300 mb-2">{selectedCharacter.sessionsPlayed}</h3>
          <p className="text-sm text-slate-400 font-medium">Sessions Jouées</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;