import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Heart, 
  Zap, 
  Shield, 
  Sword, 
  Eye,
  Dumbbell,
  Brain,
  HandHeart,
  Wind,
  Crown,
  Target
} from "lucide-react";
import { useCharacter } from "@/contexts/CharacterContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useGroup } from "@/contexts/GroupContext";

const CharacterSheet = () => {
  const { selectedCharacter } = useCharacter();

  if (!selectedCharacter) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          Aucun personnage sélectionné
        </h2>
        <p className="text-muted-foreground">
          Veuillez sélectionner un personnage dans la barre latérale pour voir sa fiche.
        </p>
      </div>
    );
  }

  const { getEquipment } = useEquipment();
  const { name: groupName } = useGroup();

  // Base du personnage
  const base = selectedCharacter;
  const equipment = getEquipment(base.id) || {};

  // Calcul des bonus issus de l'équipement
  const eqBonuses = Object.values(equipment).reduce((acc: any, item: any) => {
    if (item?.stats) {
      Object.entries(item.stats).forEach(([k, v]) => {
        acc[k] = (acc[k] || 0) + (v as number);
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const derivedStats = {
    strength: base.stats.strength + (eqBonuses.strength || 0),
    dexterity: base.stats.dexterity + (eqBonuses.dexterity || 0),
    constitution: base.stats.constitution + (eqBonuses.constitution || 0),
    intelligence: base.stats.intelligence + (eqBonuses.intelligence || 0),
    wisdom: base.stats.wisdom + (eqBonuses.wisdom || 0),
    charisma: base.stats.charisma + (eqBonuses.charisma || 0),
  };

  const ac = base.stats.ac + (eqBonuses.ac || 0);
  const hp = { current: base.stats.hp.current + (eqBonuses.hp || 0), max: base.stats.hp.max + (eqBonuses.hp || 0) };
  const proficiencyBonus = base.stats.proficiencyBonus;

  const character = {
    name: base.name,
    race: base.race,
    class: base.class,
    level: base.level,
    archetype: "Aventurier",
    hp,
    ac,
    proficiencyBonus,
    speed: 30,
    stats: derivedStats,
    skills: [
      { name: "Perception", bonus: 8, proficient: true },
      { name: "Survie", bonus: 7, proficient: true },
      { name: "Discrétion", bonus: 8, proficient: true },
      { name: "Investigation", bonus: 5, proficient: true },
      { name: "Dressage", bonus: 7, proficient: true },
      { name: "Nature", bonus: 5, proficient: true }
    ],
    equipment: [
      // Liste illustrative; l'affichage détaillé de l'équipement est géré ailleurs
    ],
    spells: [
      { name: "Marque du chasseur", level: 1, slots: 2 },
      { name: "Passage sans trace", level: 2, slots: 1 },
      { name: "Localiser un objet", level: 2, slots: 1 }
    ]
  };

  const getModifier = (stat: number) => Math.floor((stat - 10) / 2);
  const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête du personnage */}
      <Card className="modern-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-fantasy text-primary">
                {character.name}
              </CardTitle>
              <CardDescription className="text-lg">
                {character.race} {character.class} • Niveau {character.level} • {character.archetype}
              </CardDescription>
              <div className="text-sm text-muted-foreground">Groupe: {groupName}</div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-orange-200 border-orange-400/50 bg-orange-500/10 mb-2">
                <Crown className="w-4 h-4 mr-1" />
                Niveau {character.level}
              </Badge>
              <div className="text-sm text-muted-foreground">
                2,840 / 6,500 XP
              </div>
              <Progress value={43.7} className="w-24 h-2 mt-1" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 tab-modern">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="spells">Sorts</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          {/* Statistiques de Combat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Heart className="w-5 h-5" />
                  Points de Vie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-300 mb-2">
                  {character.hp.current} / {character.hp.max}
                </div>
                <Progress 
                  value={(character.hp.current / character.hp.max) * 100} 
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Dés de vie: 6d10
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-5 h-5" />
                  Classe d'Armure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-300 mb-2">
                  {character.ac}
                </div>
                <p className="text-sm text-muted-foreground">
                  Armure de cuir clouté +1
                </p>
                <p className="text-sm text-muted-foreground">
                  Bonus Dex: +{getModifier(character.stats.dexterity)}
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Target className="w-5 h-5" />
                  Bonus de Maîtrise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-300 mb-2">
                  +{character.proficiencyBonus}
                </div>
                <p className="text-sm text-muted-foreground">
                  Vitesse: {character.speed} pieds
                </p>
                <p className="text-sm text-muted-foreground">
                  Initiative: +{getModifier(character.stats.dexterity)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caractéristiques */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(character.stats).map(([stat, value]) => {
                  const statNames: { [key: string]: { name: string, icon: any } } = {
                    strength: { name: "Force", icon: Dumbbell },
                    dexterity: { name: "Dextérité", icon: Wind },
                    constitution: { name: "Constitution", icon: Heart },
                    intelligence: { name: "Intelligence", icon: Brain },
                    wisdom: { name: "Sagesse", icon: Eye },
                    charisma: { name: "Charisme", icon: HandHeart }
                  };
                  
                  const StatIcon = statNames[stat].icon;
                  const modifier = getModifier(value);
                  
                  return (
                    <div key={stat} className="text-center p-4 bg-muted/20 rounded-lg border border-border/30">
                      <StatIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {statNames[stat].name}
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatModifier(modifier)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Compétences Maîtrisées</CardTitle>
              <CardDescription>
                Compétences avec bonus de maîtrise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/20">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">{skill.name}</span>
                      {skill.proficient && (
                        <Badge variant="outline" className="text-xs">
                          Maîtrisé
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      +{skill.bonus}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Équipement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.equipment.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/20">
                    <Sword className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spells" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Sorts de Rôdeur
              </CardTitle>
              <CardDescription>
                Emplacements de sorts disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {character.spells.map((spell, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/20">
                    <div>
                      <div className="font-medium">{spell.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Niveau {spell.level}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {spell.slots} emplacements
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CharacterSheet;