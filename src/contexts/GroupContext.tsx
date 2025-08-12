import { createContext, useContext, ReactNode, useMemo } from "react";
import { useCharacter, type Character } from "@/contexts/CharacterContext";

interface GroupContextType {
  name: string;
  members: Character[];
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const { getAllCharacters } = useCharacter();

  // Nom de groupe par défaut – peut être branché plus tard à un écran d'édition
  const name = "Les Maraudeurs de Joyaux Tendres";
  // Les membres du groupe sont maintenant les vrais personnages joueurs
  const members = useMemo(() => getAllCharacters(), [getAllCharacters]);

  return (
    <GroupContext.Provider value={{ name, members }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used within GroupProvider");
  return ctx;
};
