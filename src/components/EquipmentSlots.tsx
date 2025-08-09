import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Crown, 
  Shield, 
  Hand, 
  Shirt, 
  FootprintsIcon,
  Circle,
  Plus,
  X
} from "lucide-react";

interface EquipmentSlot {
  id: string;
  name: string;
  type: 'head' | 'chest' | 'arms' | 'neck' | 'rings' | 'legs';
  equipped?: any;
  position: { x: number; y: number };
  icon: any;
}

interface EquipmentSlotsProps {
  character: any;
  availableItems: any[];
  onEquipItem: (slotId: string, item: any) => void;
  onUnequipItem: (slotId: string) => void;
}

const EquipmentSlots = ({ character, availableItems, onEquipItem, onUnequipItem }: EquipmentSlotsProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const equipmentSlots: EquipmentSlot[] = [
    {
      id: 'head',
      name: 'Tête',
      type: 'head',
      position: { x: 50, y: 10 },
      icon: Crown,
      equipped: character.equipment?.head
    },
    {
      id: 'neck',
      name: 'Cou',
      type: 'neck',
      position: { x: 50, y: 25 },
      icon: Circle,
      equipped: character.equipment?.neck
    },
    {
      id: 'chest',
      name: 'Buste',
      type: 'chest',
      position: { x: 50, y: 40 },
      icon: Shirt,
      equipped: character.equipment?.chest
    },
    {
      id: 'arms',
      name: 'Bras',
      type: 'arms',
      position: { x: 20, y: 35 },
      icon: Hand,
      equipped: character.equipment?.arms
    },
    {
      id: 'mainHand',
      name: 'Main principale',
      type: 'rings',
      position: { x: 80, y: 35 },
      icon: Shield,
      equipped: character.equipment?.mainHand
    },
    {
      id: 'ring1',
      name: 'Bague 1',
      type: 'rings',
      position: { x: 25, y: 55 },
      icon: Circle,
      equipped: character.equipment?.ring1
    },
    {
      id: 'ring2',
      name: 'Bague 2',
      type: 'rings',
      position: { x: 75, y: 55 },
      icon: Circle,
      equipped: character.equipment?.ring2
    },
    {
      id: 'legs',
      name: 'Jambes',
      type: 'legs',
      position: { x: 50, y: 70 },
      icon: FootprintsIcon,
      equipped: character.equipment?.legs
    }
  ];

  const getSlotItems = (slotType: string) => {
    const slotTypeMap: Record<string, string[]> = {
      head: ['helmet', 'crown', 'tiara'],
      chest: ['armor', 'robe', 'shirt'],
      arms: ['gauntlets', 'gloves'],
      neck: ['amulet', 'pendant'],
      rings: ['ring'],
      legs: ['boots', 'shoes']
    };

    return availableItems.filter(item => 
      slotTypeMap[slotType]?.some(type => 
        item.type === type || item.subtype === type
      )
    );
  };

  const getEquippedStats = () => {
    const stats = {
      ac: 0,
      damage: 0,
      hp: 0,
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    };

    equipmentSlots.forEach(slot => {
      if (slot.equipped?.stats) {
        Object.keys(slot.equipped.stats).forEach(stat => {
          if (stats.hasOwnProperty(stat)) {
            stats[stat as keyof typeof stats] += slot.equipped.stats[stat];
          }
        });
      }
    });

    return stats;
  };

  const equippedStats = getEquippedStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mannequin avec emplacements */}
      <Card className="modern-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Équipement</h3>
          <div className="relative w-full h-96 mx-auto bg-gradient-to-b from-background/50 to-background border-2 border-dashed border-border rounded-lg">
            {/* Silhouette centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-32 bg-muted/30 rounded-full opacity-50" />
            </div>

            {/* Emplacements d'équipement */}
            {equipmentSlots.map((slot) => {
              const Icon = slot.icon;
              return (
                <Dialog key={slot.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 p-2 ${
                        slot.equipped 
                          ? 'bg-primary/20 border-primary hover:bg-primary/30' 
                          : 'bg-muted/50 border-dashed hover:bg-muted/70'
                      }`}
                      style={{
                        left: `${slot.position.x}%`,
                        top: `${slot.position.y}%`
                      }}
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {slot.equipped ? (
                        <img 
                          src={slot.equipped.image || '/placeholder.svg'} 
                          alt={slot.equipped.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {slot.name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Objet actuellement équipé */}
                      {slot.equipped && (
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{slot.equipped.name}</h4>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onUnequipItem(slot.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {slot.equipped.description}
                          </p>
                          {slot.equipped.stats && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(slot.equipped.stats).map(([stat, value]) => (
                                <Badge key={stat} variant="outline" className="text-xs">
                                  +{String(value)} {stat}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Objets disponibles */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Objets disponibles :</h4>
                        {getSlotItems(slot.type).length > 0 ? (
                          getSlotItems(slot.type).map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-card border border-border rounded-lg hover:bg-accent/50 cursor-pointer"
                              onClick={() => onEquipItem(slot.id, item)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">{item.name}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                                <Plus className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Aucun objet compatible dans l'inventaire
                          </p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bonus d'équipement */}
      <Card className="modern-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bonus d'équipement</h3>
          
          <div className="space-y-3">
            {Object.entries(equippedStats).map(([stat, value]) => {
              if (value === 0) return null;
              
              const statNames: Record<string, string> = {
                ac: 'Classe d\'armure',
                damage: 'Dégâts',
                hp: 'Points de vie',
                strength: 'Force',
                dexterity: 'Dextérité',
                constitution: 'Constitution',
                intelligence: 'Intelligence',
                wisdom: 'Sagesse',
                charisma: 'Charisme'
              };

              return (
                <div key={stat} className="flex justify-between items-center p-2 bg-primary/5 rounded">
                  <span className="text-sm font-medium">{statNames[stat]}</span>
                  <Badge variant="outline" className="text-primary">
                    +{value}
                  </Badge>
                </div>
              );
            })}
            
            {Object.values(equippedStats).every(v => v === 0) && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Aucun bonus d'équipement actif
              </p>
            )}
          </div>

          {/* Objets équipés */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Objets équipés :</h4>
            <div className="space-y-2">
              {equipmentSlots
                .filter(slot => slot.equipped)
                .map((slot) => (
                  <div key={slot.id} className="flex items-center gap-2 p-2 bg-card border border-border rounded">
                    <slot.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{slot.equipped.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {slot.name}
                    </Badge>
                  </div>
                ))}
              
              {equipmentSlots.filter(slot => slot.equipped).length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-2">
                  Aucun objet équipé
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentSlots;