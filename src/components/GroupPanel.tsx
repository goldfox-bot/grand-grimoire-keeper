import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Shield, Sword, Eye, Dice6 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "@/contexts/CharacterContext";
import { useGroup } from "@/contexts/GroupContext";

const GroupPanel = () => {
  const navigate = useNavigate();
  const { getAllCharacters, updateCharacter, getCharacterById, setSelectedCharacterId } = useCharacter();
  const { name: groupName } = useGroup();

  const characters = getAllCharacters();

  const getHPPercentage = (current: number, max: number) => {
    return Math.max(0, Math.min(100, (current / max) * 100));
  };

  const updateCharacterHP = (characterId: string, newHP: number) => {
    const ch = getCharacterById(characterId);
    if (!ch) return;
    const clamped = Math.max(0, Math.min(ch.stats.hp.max, newHP));
    updateCharacter(characterId, {
      stats: { ...ch.stats, hp: { current: clamped, max: ch.stats.hp.max } },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-fantasy font-bold text-gold-200 mb-2">
            {groupName}
          </h2>
          <p className="text-muted-foreground">
            Fiches de combat synchronisées avec les personnages joueurs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-300 border-green-500/30 px-3 py-1">
            <Heart className="w-4 h-4 mr-1" />
            Groupe prêt
          </Badge>
          <Button className="bg-gold-600 hover:bg-gold-700 text-dungeon-900">
            <Dice6 className="w-4 h-4 mr-2" />
            Initiative
          </Button>
        </div>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="dungeon-card">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-gold-300">
              {characters.reduce((acc, c) => acc + c.level, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Niveau Total</p>
          </CardContent>
        </Card>
        <Card className="dungeon-card">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-400">
              {characters.reduce((acc, c) => acc + c.stats.hp.current, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">PV Actuels</p>
          </CardContent>
        </Card>
        <Card className="dungeon-card">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-400">
              {characters.length > 0
                ? Math.round(
                    characters.reduce((acc, c) => acc + c.stats.ac, 0) / characters.length
                  )
                : 0}
            </h3>
            <p className="text-sm text-muted-foreground">CA Moyenne</p>
          </CardContent>
        </Card>
        <Card className="dungeon-card">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-purple-400">{characters.length}</h3>
            <p className="text-sm text-muted-foreground">Membres</p>
          </CardContent>
        </Card>
      </div>

      {/* Cartes Personnages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((character) => (
          <Card key={character.id} className="dungeon-card">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20 border-2 border-gold-500/50">
                  <AvatarImage src={character.avatar} />
                  <AvatarFallback className="bg-dungeon-700 text-gold-200 font-bold text-xl">
                    {character.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-gold-200 text-xl mb-1">{character.name}</CardTitle>
                  <div className="text-sm text-muted-foreground mb-2">
                    <span>
                      {character.race} {character.class}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Niveau {character.level}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span>CA {character.stats.ac}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PV */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    Points de Vie
                  </span>
                  <span className="text-sm font-semibold">
                    {character.stats.hp.current} / {character.stats.hp.max}
                  </span>
                </div>
                <Progress
                  value={getHPPercentage(character.stats.hp.current, character.stats.hp.max)}
                  className="h-3"
                />
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateCharacterHP(character.id, character.stats.hp.current - 5)
                    }
                    className="text-xs px-2"
                  >
                    -5
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateCharacterHP(character.id, character.stats.hp.current + 5)
                    }
                    className="text-xs px-2"
                  >
                    +5
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCharacterHP(character.id, character.stats.hp.max)}
                    className="text-xs px-2 ml-auto"
                  >
                    Soin complet
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-dungeon-900"
                  onClick={() => {
                    setSelectedCharacterId(character.id);
                    navigate("/dm/character");
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Détails (Fiche)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupPanel;
