import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";

export type SecretItem = {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  rarity: string;
  description?: string;
  weight?: number;
  value?: number;
  stats?: Record<string, number>;
  image?: string; // data URL for now
  code: string; // e.g., LMJT000
  usedByCharacterId?: string;
  usedAt?: string; // ISO date
};

interface SecretItemsContextType {
  items: SecretItem[];
  createSecretItem: (input: Omit<SecretItem, "id" | "code" | "usedByCharacterId" | "usedAt"> & { code?: string }) => SecretItem;
  deleteSecretItem: (id: string) => void;
  redeemCode: (code: string, characterId: string) => { success: boolean; item?: any; message?: string };
}

const STORAGE_KEY = "grimoire_secret_items_v1";

const SecretItemsContext = createContext<SecretItemsContextType | undefined>(undefined);

function generateCode(existing: Set<string>) {
  let attempt = 0;
  while (attempt < 5000) {
    const n = Math.floor(Math.random() * 1000);
    const code = `LMJT${n.toString().padStart(3, "0")}`;
    if (!existing.has(code)) return code;
    attempt++;
  }
  // Fallback extremely unlikely
  return `LMJT${Date.now().toString().slice(-3)}`;
}

export const SecretItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<SecretItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse secret items from storage", e);
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save secret items", e);
    }
  }, [items]);

  const createSecretItem: SecretItemsContextType["createSecretItem"] = (input) => {
    const existingCodes = new Set(items.map((i) => i.code));
    const code = input.code?.trim().toUpperCase() || generateCode(existingCodes);
    if (existingCodes.has(code)) {
      toast.error("Ce code existe déjà");
      throw new Error("Duplicate code");
    }
    const item: SecretItem = {
      id: crypto.randomUUID(),
      name: input.name,
      type: input.type,
      subtype: input.subtype,
      rarity: input.rarity,
      description: input.description,
      weight: input.weight,
      value: input.value,
      stats: input.stats,
      image: input.image,
      code,
    };
    setItems((prev) => [item, ...prev]);
    toast.success(`Item secret créé. Code: ${code}`);
    return item;
  };

  const deleteSecretItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const redeemCode: SecretItemsContextType["redeemCode"] = (code, characterId) => {
    const normalized = code.trim().toUpperCase();
    const idx = items.findIndex((i) => i.code === normalized);
    if (idx === -1) return { success: false, message: "Code introuvable" };
    const item = items[idx];
    if (item.usedByCharacterId) return { success: false, message: "Code déjà utilisé" };

    // Mark code as used
    const updated = { ...item, usedByCharacterId: characterId, usedAt: new Date().toISOString() };
    setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));

    // Return a non-secret inventory item payload (without code)
    const inventoryItem = {
      id: `${item.id}-${characterId}`,
      name: item.name,
      type: item.type,
      subtype: item.subtype,
      rarity: item.rarity,
      description: item.description,
      weight: item.weight ?? 0,
      value: item.value ?? 0,
      stats: item.stats,
      image: item.image,
      equipped: false,
    };

    return { success: true, item: inventoryItem };
  };

  const value = useMemo(() => ({ items, createSecretItem, deleteSecretItem, redeemCode }), [items]);

  return (
    <SecretItemsContext.Provider value={value}>
      {children}
    </SecretItemsContext.Provider>
  );
};

export const useSecretItems = () => {
  const ctx = useContext(SecretItemsContext);
  if (!ctx) throw new Error("useSecretItems must be used within a SecretItemsProvider");
  return ctx;
};
