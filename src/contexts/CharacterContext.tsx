import { createContext, useContext, useState, ReactNode } from "react";

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  avatar?: string;
  stats: {
    hp: { current: number; max: number };
    ac: number;
    proficiencyBonus: number;
    weaponDamage: string;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  inventory: {
    gold: number;
    weight: { current: number; max: number };
    equippedItems: number;
    maxEquipped: number;
    items: any[];
  };
  quests: {
    active: any[];
    completed: any[];
  };
  exploration: {
    locationsDiscovered: number;
    dungeonsExplored: number;
    citiesVisited: number;
  };
  xp: {
    current: number;
    total: number;
  };
  sessionsPlayed: number;
}

const characterData: Record<string, Character> = {
  arannis: {
    id: "arannis",
    name: "Arannis",
    class: "Paladin",
    level: 7,
    race: "Humain",
    stats: {
      hp: { current: 95, max: 98 },
      ac: 18,
      proficiencyBonus: 3,
      weaponDamage: "1d8+4",
      strength: 16,
      dexterity: 10,
      constitution: 14,
      intelligence: 11,
      wisdom: 13,
      charisma: 16
    },
    inventory: {
      gold: 340,
      weight: { current: 65, max: 80 },
      equippedItems: 10,
      maxEquipped: 15,
      items: []
    },
    quests: {
      active: [
        {
          id: "1",
          title: "La Lame Sacrée",
          description: "Récupérer l'épée légendaire des anciens paladins",
          status: "active",
          progress: 60
        }
      ],
      completed: []
    },
    exploration: {
      locationsDiscovered: 8,
      dungeonsExplored: 2,
      citiesVisited: 4
    },
    xp: {
      current: 1200,
      total: 23000
    },
    sessionsPlayed: 12
  },
  sfriri: {
    id: "sfriri",
    name: "Sfriri",
    class: "Magicien",
    level: 6,
    race: "Elfe",
    stats: {
      hp: { current: 42, max: 48 },
      ac: 12,
      proficiencyBonus: 3,
      weaponDamage: "1d4",
      strength: 8,
      dexterity: 14,
      constitution: 13,
      intelligence: 18,
      wisdom: 12,
      charisma: 10
    },
    inventory: {
      gold: 285,
      weight: { current: 25, max: 40 },
      equippedItems: 6,
      maxEquipped: 10,
      items: []
    },
    quests: {
      active: [
        {
          id: "2",
          title: "Le Grimoire Perdu",
          description: "Retrouver l'ancien grimoire de magie élémentaire",
          status: "active",
          progress: 40
        }
      ],
      completed: []
    },
    exploration: {
      locationsDiscovered: 15,
      dungeonsExplored: 1,
      citiesVisited: 6
    },
    xp: {
      current: 800,
      total: 14000
    },
    sessionsPlayed: 10
  },
  caellum: {
    id: "caellum",
    name: "Caellum",
    class: "Rôdeur",
    level: 6,
    race: "Demi-Elfe",
    stats: {
      hp: { current: 68, max: 72 },
      ac: 14,
      proficiencyBonus: 3,
      weaponDamage: "1d8+3",
      strength: 13,
      dexterity: 16,
      constitution: 14,
      intelligence: 12,
      wisdom: 15,
      charisma: 11
    },
    inventory: {
      gold: 220,
      weight: { current: 45, max: 60 },
      equippedItems: 8,
      maxEquipped: 12,
      items: []
    },
    quests: {
      active: [
        {
          id: "3",
          title: "Piste du Loup Noir",
          description: "Traquer la bête légendaire qui terrorise la région",
          status: "active",
          progress: 75
        }
      ],
      completed: []
    },
    exploration: {
      locationsDiscovered: 20,
      dungeonsExplored: 4,
      citiesVisited: 3
    },
    xp: {
      current: 400,
      total: 14000
    },
    sessionsPlayed: 11
  },
  naia: {
    id: "naia",
    name: "Naïa",
    class: "Clerc",
    level: 6,
    race: "Halfeline",
    stats: {
      hp: { current: 55, max: 58 },
      ac: 16,
      proficiencyBonus: 3,
      weaponDamage: "1d6+2",
      strength: 10,
      dexterity: 12,
      constitution: 15,
      intelligence: 13,
      wisdom: 17,
      charisma: 14
    },
    inventory: {
      gold: 195,
      weight: { current: 35, max: 50 },
      equippedItems: 7,
      maxEquipped: 10,
      items: []
    },
    quests: {
      active: [
        {
          id: "4",
          title: "Bénédiction Divine",
          description: "Purifier le temple corrompu par les forces obscures",
          status: "active",
          progress: 30
        }
      ],
      completed: []
    },
    exploration: {
      locationsDiscovered: 10,
      dungeonsExplored: 2,
      citiesVisited: 5
    },
    xp: {
      current: 600,
      total: 14000
    },
    sessionsPlayed: 9
  },
};

interface CharacterContextType {
  selectedCharacterId: string | null;
  selectedCharacter: Character | null;
  setSelectedCharacterId: (id: string | null) => void;
  getAllCharacters: () => Character[];
  getCharacterById: (id: string) => Character | null;
  addCharacter: (character: Omit<Character, 'id'>) => void;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [characters, setCharacters] = useState<Record<string, Character>>(characterData);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const selectedCharacter = selectedCharacterId ? characters[selectedCharacterId] || null : null;

  const getAllCharacters = () => Object.values(characters);
  
  const getCharacterById = (id: string) => characters[id] || null;

  const addCharacter = (character: Omit<Character, 'id'>) => {
    const id = Date.now().toString();
    const newCharacter = { ...character, id };
    setCharacters(prev => ({ ...prev, [id]: newCharacter }));
  };

  const removeCharacter = (id: string) => {
    setCharacters(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    if (selectedCharacterId === id) {
      setSelectedCharacterId(null);
    }
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  return (
    <CharacterContext.Provider value={{
      selectedCharacterId,
      selectedCharacter,
      setSelectedCharacterId,
      getAllCharacters,
      getCharacterById,
      addCharacter,
      removeCharacter,
      updateCharacter
    }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};