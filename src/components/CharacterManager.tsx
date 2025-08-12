import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, Shield, Wand2, Sword, Heart } from "lucide-react";
import { useCharacter, type Character } from "@/contexts/CharacterContext";
import { toast } from "sonner";

const CharacterManager = () => {
  const { getAllCharacters, addCharacter, removeCharacter } = useCharacter();
  const [isAddingCharacter, setIsAddingCharacter] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    race: "",
    class: "",
    level: 1
  });

  const characters = getAllCharacters();

  const handleAddCharacter = () => {
    if (!newCharacter.name || !newCharacter.race || !newCharacter.class) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const character: Omit<Character, 'id'> = {
      name: newCharacter.name,
      race: newCharacter.race,
      class: newCharacter.class,
      level: newCharacter.level,
      stats: {
        hp: { current: 25 + newCharacter.level * 5, max: 25 + newCharacter.level * 5 },
        ac: 10 + newCharacter.level,
        proficiencyBonus: Math.ceil(newCharacter.level / 4) + 1,
        weaponDamage: "1d6",
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      inventory: {
        gold: 50,
        weight: { current: 0, max: 50 },
        equippedItems: 0,
        maxEquipped: 10,
        items: []
      },
      quests: {
        active: [],
        completed: []
      },
      exploration: {
        locationsDiscovered: 0,
        dungeonsExplored: 0,
        citiesVisited: 0
      },
      xp: {
        current: 0,
        total: newCharacter.level * 1000
      },
      sessionsPlayed: 0
    };

    addCharacter(character);
    setNewCharacter({ name: "", race: "", class: "", level: 1 });
    setIsAddingCharacter(false);
    toast.success(`${character.name} a été ajouté au groupe`);
  };

  const handleRemoveCharacter = (characterId: string, characterName: string) => {
    removeCharacter(characterId);
    toast.success(`${characterName} a été retiré du groupe`);
  };

  const getClassIcon = (characterClass: string) => {
    switch (characterClass.toLowerCase()) {
      case 'paladin':
      case 'guerrier':
        return <Shield className="w-4 h-4" />;
      case 'magicien':
      case 'clerc':
        return <Wand2 className="w-4 h-4" />;
      case 'rôdeur':
      case 'rôdeuse':
        return <Sword className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-fantasy font-bold text-gold-200 mb-2">
            Gestion des Personnages
          </h2>
          <p className="text-muted-foreground">
            Ajoutez ou supprimez des personnages joueurs de votre groupe
          </p>
        </div>
        <Dialog open={isAddingCharacter} onOpenChange={setIsAddingCharacter}>
          <DialogTrigger asChild>
            <Button className="bg-gold-600 hover:bg-gold-700 text-dungeon-900">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Personnage
            </Button>
          </DialogTrigger>
          <DialogContent className="dungeon-card">
            <DialogHeader>
              <DialogTitle className="text-gold-200">Nouveau Personnage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gold-200">Nom *</Label>
                <Input
                  id="name"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du personnage"
                  className="bg-dungeon-800/50 border-gold-500/30"
                />
              </div>
              <div>
                <Label htmlFor="race" className="text-gold-200">Race *</Label>
                <Input
                  id="race"
                  value={newCharacter.race}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, race: e.target.value }))}
                  placeholder="Humain, Elfe, Nain..."
                  className="bg-dungeon-800/50 border-gold-500/30"
                />
              </div>
              <div>
                <Label htmlFor="class" className="text-gold-200">Classe *</Label>
                <Select 
                  value={newCharacter.class} 
                  onValueChange={(value) => setNewCharacter(prev => ({ ...prev, class: value }))}
                >
                  <SelectTrigger className="bg-dungeon-800/50 border-gold-500/30">
                    <SelectValue placeholder="Choisir une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guerrier">Guerrier</SelectItem>
                    <SelectItem value="Paladin">Paladin</SelectItem>
                    <SelectItem value="Magicien">Magicien</SelectItem>
                    <SelectItem value="Clerc">Clerc</SelectItem>
                    <SelectItem value="Rôdeur">Rôdeur</SelectItem>
                    <SelectItem value="Rôdeuse">Rôdeuse</SelectItem>
                    <SelectItem value="Voleur">Voleur</SelectItem>
                    <SelectItem value="Barbare">Barbare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level" className="text-gold-200">Niveau</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  max="20"
                  value={newCharacter.level}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                  className="bg-dungeon-800/50 border-gold-500/30"
                />
              </div>
              <Button onClick={handleAddCharacter} className="w-full bg-gold-600 hover:bg-gold-700 text-dungeon-900">
                Créer le Personnage
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="dungeon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold-200">
            <Users className="w-5 h-5" />
            Personnages du Groupe ({characters.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {characters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun personnage dans le groupe</p>
              <p className="text-sm">Ajoutez des personnages pour commencer l'aventure</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <Card key={character.id} className="dungeon-card border border-gold-500/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gold-200 mb-1">{character.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getClassIcon(character.class)}
                          <span className="text-sm text-muted-foreground">
                            {character.race} • {character.class}
                          </span>
                        </div>
                        <Badge variant="outline">Niveau {character.level}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveCharacter(character.id, character.name)}
                        className="opacity-70 hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">PV:</span>
                        <span className="ml-1 text-red-400">{character.stats.hp.current}/{character.stats.hp.max}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CA:</span>
                        <span className="ml-1 text-blue-400">{character.stats.ac}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Or:</span>
                        <span className="ml-1 text-gold-400">{character.inventory.gold}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sessions:</span>
                        <span className="ml-1">{character.sessionsPlayed}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterManager;