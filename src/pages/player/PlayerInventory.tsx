import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Package, 
  Sword, 
  Shield, 
  Gem, 
  Coins,
  Weight,
  Star,
  Shirt,
  FlaskConical,
  User,
  KeyRound
} from "lucide-react";
import { useCharacter } from "@/contexts/CharacterContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useSecretItems } from "@/contexts/SecretItemsContext";
import EquipmentSlots from "@/components/EquipmentSlots";
import { Input } from "@/components/ui/input";
const PlayerInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("inventory");
  const { redeemCode } = useSecretItems();
  const [redeemCodeValue, setRedeemCodeValue] = useState("");
  const { selectedCharacter } = useCharacter();

  if (!selectedCharacter) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          Aucun personnage sélectionné
        </h2>
        <p className="text-muted-foreground">
          Veuillez sélectionner un personnage dans la barre latérale pour voir son inventaire.
        </p>
      </div>
    );
  }

  // État par personnage: items et équipement
  type Equipment = {
    head?: any; neck?: any; chest?: any; arms?: any; mainHand?: any; offHand?: any; ring1?: any; ring2?: any; legs?: any;
  };
  const [itemsByCharacter, setItemsByCharacter] = useState<Record<string, any[]>>({});
  // Équipement géré globalement via contexte
  const { getEquipment, equipItem: ctxEquipItem, unequipItem: ctxUnequipItem } = useEquipment();

  // Inventaire par défaut utilisé à la première ouverture d'un perso
  const defaultItems: any[] = [
    { id: 1, name: "Arc long elfique +1", type: "weapon", subtype: "bow", rarity: "uncommon", equipped: false, description: "Un arc long finement ouvragé avec des inscriptions elfiques.", weight: 2, value: 150, stats: { damage: 2, dexterity: 1 } },
    { id: 2, name: "Armure de cuir clouté +1", type: "armor", subtype: "armor", rarity: "uncommon", equipped: false, description: "Une armure de cuir renforcée de clous métalliques enchantés.", weight: 13, value: 200, stats: { ac: 3, dexterity: 1 } },
    { id: 3, name: "Épée courte", type: "weapon", subtype: "sword", rarity: "common", equipped: false, description: "Une épée courte de qualité standard.", weight: 2, value: 10, stats: { damage: 1 } },
    { id: 4, name: "Casque de guerre", type: "armor", subtype: "helmet", rarity: "common", equipped: false, description: "Un casque de métal forgé pour la protection.", weight: 3, value: 25, stats: { ac: 1 } },
    { id: 5, name: "Gantelets de force", type: "armor", subtype: "gauntlets", rarity: "uncommon", equipped: false, description: "Des gantelets enchantés qui augmentent la force.", weight: 1, value: 150, stats: { strength: 2 } },
    { id: 6, name: "Amulette de protection", type: "jewelry", subtype: "amulet", rarity: "rare", equipped: false, description: "Une amulette qui protège contre les sorts.", weight: 0.1, value: 300, stats: { ac: 1, wisdom: 1 } },
    { id: 7, name: "Anneau de dextérité", type: "jewelry", subtype: "ring", rarity: "uncommon", equipped: false, description: "Un anneau qui améliore l'agilité.", weight: 0.1, value: 200, stats: { dexterity: 2 } },
    { id: 8, name: "Bottes de l'explorateur", type: "armor", subtype: "boots", rarity: "common", equipped: false, description: "Des bottes robustes pour les longs voyages.", weight: 2, value: 50, stats: { constitution: 1 } },
    { id: 9, name: "Potion de soins", type: "consumable", rarity: "common", equipped: false, description: "Restaure 2d4+2 points de vie.", weight: 0.5, value: 50, quantity: 3 },
    { id: 10, name: "Gemme de vision nocturne", type: "treasure", rarity: "rare", equipped: false, description: "Une gemme qui brille d'une lueur argentée.", weight: 0.1, value: 500 },
    { id: 11, name: "Corde de soie", type: "gear", rarity: "common", equipped: false, description: "Une corde de soie de 15 mètres.", weight: 5, value: 2 },
  ];

  // Initialisation pour le personnage courant
  useEffect(() => {
    if (!itemsByCharacter[selectedCharacter.id]) {
      setItemsByCharacter((prev) => ({ ...prev, [selectedCharacter.id]: defaultItems }));
    }
  }, [selectedCharacter.id]);

const items = itemsByCharacter[selectedCharacter.id] || defaultItems;
const equipment = getEquipment(selectedCharacter.id) || {};

  const autoSlotForItem = (item: any): string | null => {
    const key = item.subtype || item.type;
    switch (key) {
      case "helmet": case "crown": case "tiara": return "head";
      case "armor": case "robe": case "shirt": return "chest";
      case "gauntlets": case "gloves": return "arms";
      case "amulet": case "pendant": return "neck";
      case "ring": return !equipment.ring1 ? "ring1" : (!equipment.ring2 ? "ring2" : "ring1");
      case "boots": case "shoes": return "legs";
      case "sword": case "bow": case "axe": case "mace": case "dagger": case "staff":
        return !equipment.mainHand ? "mainHand" : (!equipment.offHand ? "offHand" : "mainHand");
      default:
        return null;
    }
  };

const handleEquipItem = (slotId: string, item: any) => {
  const prevEquip = getEquipment(selectedCharacter.id) || {} as Equipment;
  const previousItemInSlot = (prevEquip as any)[slotId];

  // Met à jour le contexte d'équipement global
  ctxEquipItem(selectedCharacter.id, slotId as keyof Equipment, item);

  // Met à jour les flags d'équipement des items (local à l'inventaire)
  setItemsByCharacter((itemsState) => {
    const current = itemsState[selectedCharacter.id] || [];
    const next = current.map((it) => {
      if (it.id === item.id) return { ...it, equipped: true };
      if (previousItemInSlot && it.id === previousItemInSlot.id) return { ...it, equipped: false };
      return it;
    });
    return { ...itemsState, [selectedCharacter.id]: next };
  });

  toast.success(`${item.name} équipé dans l'emplacement ${slotId}`);
};

const handleUnequipItem = (slotId: string) => {
  const prevEquip = getEquipment(selectedCharacter.id) || {} as Equipment;
  const item = (prevEquip as any)[slotId];

  // Met à jour le contexte global
  ctxUnequipItem(selectedCharacter.id, slotId as keyof Equipment);

  // Met à jour les flags d'équipement des items (local à l'inventaire)
  setItemsByCharacter((itemsState) => {
    const current = itemsState[selectedCharacter.id] || [];
    const next = current.map((it) => (item && it.id === item.id ? { ...it, equipped: false } : it));
    return { ...itemsState, [selectedCharacter.id]: next };
  });

  toast.success(`Objet déséquipé de l'emplacement ${slotId}`);
};

const handleRedeem = () => {
  if (!redeemCodeValue.trim()) { toast.error("Entrez un code"); return; }
  const res = redeemCode(redeemCodeValue, selectedCharacter.id);
  if (!res.success || !res.item) { toast.error(res.message || "Code invalide"); return; }
  setItemsByCharacter((prev) => {
    const current = prev[selectedCharacter.id] || [];
    return { ...prev, [selectedCharacter.id]: [res.item, ...current] };
  });
  toast.success(`Objet ajouté: ${res.item.name}`);
  setRedeemCodeValue("");
};

  // Objet d'inventaire pour l'UI
  const inventory = {
    coins: { gold: selectedCharacter.inventory.gold, silver: 15, copper: 8 },
    capacity: { current: selectedCharacter.inventory.weight.current, max: selectedCharacter.inventory.weight.max },
    items,
  };

  // Handlers définis plus haut (remplacent les placeholders)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400/50 bg-gray-500/10";
      case "uncommon": return "text-green-400 border-green-400/50 bg-green-500/10";
      case "rare": return "text-blue-400 border-blue-400/50 bg-blue-500/10";
      case "epic": return "text-purple-400 border-purple-400/50 bg-purple-500/10";
      case "legendary": return "text-orange-400 border-orange-400/50 bg-orange-500/10";
      default: return "text-gray-400 border-gray-400/50 bg-gray-500/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weapon": return Sword;
      case "armor": return Shield;
      case "consumable": return FlaskConical;
      case "treasure": return Gem;
      case "gear": return Package;
      default: return Package;
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? inventory.items 
    : inventory.items.filter(item => item.type === selectedCategory);

  const totalValue = inventory.items.reduce((sum, item) => 
    sum + (item.value * (item.quantity || 1)), 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de l'inventaire */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Package className="w-6 h-6 text-primary" />
            Inventaire de {selectedCharacter.name}
          </CardTitle>
          <CardDescription>
            Gestion des objets et équipements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Richesse */}
            <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="font-medium text-amber-300">Richesse</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-amber-300">{inventory.coins.gold}</span> po
                </div>
                <div className="text-sm">
                  <span className="text-gray-300">{inventory.coins.silver}</span> pa
                </div>
                <div className="text-sm">
                  <span className="text-orange-300">{inventory.coins.copper}</span> pc
                </div>
              </div>
            </div>

            {/* Poids */}
            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-blue-300">Poids</span>
              </div>
              <div className="text-lg font-bold text-blue-300">
                {inventory.capacity.current} / {inventory.capacity.max} kg
              </div>
              <Progress 
                value={(inventory.capacity.current / inventory.capacity.max) * 100} 
                className="h-2 mt-2"
              />
            </div>

            {/* Objets équipés */}
            <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shirt className="w-5 h-5 text-green-400" />
                <span className="font-medium text-green-300">Équipés</span>
              </div>
              <div className="text-lg font-bold text-green-300">
                {inventory.items.filter(item => item.equipped).length} objets
              </div>
              <div className="text-sm text-muted-foreground">
                Bonus actifs
              </div>
            </div>

            {/* Valeur totale */}
            <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-purple-300">Valeur</span>
              </div>
              <div className="text-lg font-bold text-purple-300">
                {totalValue} po
              </div>
              <div className="text-sm text-muted-foreground">
                Total estimé
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 tab-modern">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Équipement
          </TabsTrigger>
          <TabsTrigger value="codes" className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Code Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment">
          <EquipmentSlots
            character={{ ...selectedCharacter, equipment }}
            availableItems={inventory.items}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
          />
        </TabsContent>

        {/* Onglet Inventaire */}
        <TabsContent value="inventory">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6 tab-modern">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="weapon">Armes</TabsTrigger>
              <TabsTrigger value="armor">Armures</TabsTrigger>
              <TabsTrigger value="consumable">Consommables</TabsTrigger>
              <TabsTrigger value="treasure">Trésors</TabsTrigger>
              <TabsTrigger value="gear">Équipement</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <Card key={item.id} className="modern-card group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                          </div>
                          {item.equipped && (
                            <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-500/10">
                              Équipé
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={getRarityColor(item.rarity)}
                          >
                            {item.rarity}
                          </Badge>
                          {item.quantity && item.quantity > 1 && (
                            <Badge variant="outline">
                              x{item.quantity}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Poids: {item.weight} kg
                          </span>
                          <span className="text-amber-300 font-medium">
                            {item.value} po
                          </span>
                        </div>
                        {item.stats && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <Badge key={stat} variant="outline" className="text-xs">
                                +{String(value)} {stat}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant={item.equipped ? "destructive" : "default"}
                            className="flex-1"
                            onClick={() => {
                              if (item.equipped) {
const equip = getEquipment(selectedCharacter.id) || {} as Equipment;
const found = Object.entries(equip).find(([, v]) => (v as any)?.id === item.id);
const slotId = (found?.[0] as string) || null;
if (slotId) handleUnequipItem(slotId);
                              } else {
                                const slot = autoSlotForItem(item);
                                if (!slot) {
                                  toast.error("Aucun emplacement compatible");
                                  return;
                                }
                                handleEquipItem(slot, item);
                              }
                            }}
                          >
                            {item.equipped ? "Déséquiper" : "Équiper"}
                          </Button>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="codes">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" /> Débloquer un item
              </CardTitle>
              <CardDescription>Entrez votre code (ex: LMJT000) pour ajouter l'objet à votre inventaire.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="LMJT000"
                  value={redeemCodeValue}
                  onChange={(e) => setRedeemCodeValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRedeem();
                  }}
                />
                <Button onClick={handleRedeem}>Valider</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerInventory;