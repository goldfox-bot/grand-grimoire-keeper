import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Equipment = {
  head?: any;
  neck?: any;
  chest?: any;
  arms?: any;
  mainHand?: any;
  offHand?: any;
  ring1?: any;
  ring2?: any;
  legs?: any;
};

interface EquipmentContextType {
  equipmentByCharacter: Record<string, Equipment>;
  getEquipment: (characterId: string) => Equipment;
  equipItem: (characterId: string, slotId: keyof Equipment, item: any) => void;
  unequipItem: (characterId: string, slotId: keyof Equipment) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentByCharacter, setEquipmentByCharacter] = useState<Record<string, Equipment>>({});

  const getEquipment = (characterId: string): Equipment => equipmentByCharacter[characterId] || {};

  const equipItem = (characterId: string, slotId: keyof Equipment, item: any) => {
    setEquipmentByCharacter((prev) => {
      const current = prev[characterId] || {};
      return { ...prev, [characterId]: { ...current, [slotId]: item } };
    });
  };

  const unequipItem = (characterId: string, slotId: keyof Equipment) => {
    setEquipmentByCharacter((prev) => {
      const current = prev[characterId] || {};
      const next = { ...current } as Equipment;
      (next as any)[slotId] = undefined;
      return { ...prev, [characterId]: next };
    });
  };

  const value = useMemo(() => ({
    equipmentByCharacter,
    getEquipment,
    equipItem,
    unequipItem,
  }), [equipmentByCharacter]);

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const ctx = useContext(EquipmentContext);
  if (!ctx) throw new Error("useEquipment must be used within an EquipmentProvider");
  return ctx;
};
