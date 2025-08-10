
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save, X } from "lucide-react";

interface NPC {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  location: string;
  role: 'ally' | 'enemy' | 'neutral' | 'merchant' | 'noble' | 'guard';
  description: string;
  portrait?: string;
  items?: Array<{
    name: string;
    price: number;
    type: string;
  }>;
  relationship: 'friendly' | 'hostile' | 'neutral' | 'romantic';
  notes: string;
}

interface NPCFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (npc: Omit<NPC, 'id'>) => void;
  editingNPC?: NPC | null;
}

const NPCForm = ({ isOpen, onClose, onSave, editingNPC }: NPCFormProps) => {
  const [formData, setFormData] = useState({
    name: editingNPC?.name || '',
    race: editingNPC?.race || '',
    class: editingNPC?.class || '',
    level: editingNPC?.level || 1,
    location: editingNPC?.location || '',
    role: editingNPC?.role || 'neutral' as const,
    description: editingNPC?.description || '',
    relationship: editingNPC?.relationship || 'neutral' as const,
    notes: editingNPC?.notes || '',
    items: editingNPC?.items || [],
    portrait: editingNPC?.portrait || ''
  });

  const [newItem, setNewItem] = useState({ name: '', price: 0, type: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      race: '',
      class: '',
      level: 1,
      location: '',
      role: 'neutral',
      description: '',
      relationship: 'neutral',
      notes: '',
      items: [],
      portrait: ''
    });
  };

  const addItem = () => {
    if (newItem.name && newItem.type) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      setNewItem({ name: '', price: 0, type: '' });
    }
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dungeon-card max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold-200 text-xl">
            {editingNPC ? 'Modifier le PNJ' : 'Nouveau PNJ'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gold-200">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-dungeon-800/50 border-gold-500/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="race" className="text-gold-200">Race</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
                className="bg-dungeon-800/50 border-gold-500/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="class" className="text-gold-200">Classe</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                className="bg-dungeon-800/50 border-gold-500/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="level" className="text-gold-200">Niveau</Label>
              <Input
                id="level"
                type="number"
                min="1"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                className="bg-dungeon-800/50 border-gold-500/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gold-200">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-dungeon-800/50 border-gold-500/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-gold-200">Rôle</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as NPC['role'] }))}
                className="w-full px-3 py-2 rounded bg-dungeon-800/50 border border-gold-500/30 text-foreground"
              >
                <option value="ally">Allié</option>
                <option value="enemy">Ennemi</option>
                <option value="merchant">Marchand</option>
                <option value="noble">Noble</option>
                <option value="guard">Garde</option>
                <option value="neutral">Neutre</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="relationship" className="text-gold-200">Relation</Label>
              <select
                id="relationship"
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value as NPC['relationship'] }))}
                className="w-full px-3 py-2 rounded bg-dungeon-800/50 border border-gold-500/30 text-foreground"
              >
                <option value="friendly">Amical</option>
                <option value="hostile">Hostile</option>
                <option value="neutral">Neutre</option>
                <option value="romantic">Romantique</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="portrait" className="text-gold-200">Portrait (optionnel)</Label>
              <Input
                id="portrait"
                type="file"
                accept="image/*"
                className="bg-dungeon-800/50 border-gold-500/30"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setFormData(prev => ({ ...prev, portrait: reader.result as string }));
                  reader.readAsDataURL(file);
                }}
              />
              {formData.portrait && (
                <img
                  src={formData.portrait}
                  alt={`Portrait ${formData.name || 'PNJ'}`}
                  loading="lazy"
                  className="mt-2 w-full aspect-[2.5/3.5] object-cover rounded-lg border border-gold-500/30"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gold-200">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-dungeon-800/50 border-gold-500/30 min-h-20"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-gold-200">Notes du MJ</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-dungeon-800/50 border-gold-500/30 min-h-16"
            />
          </div>

          {/* Items Section */}
          <div>
            <Label className="text-gold-200">Objets en vente</Label>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-dungeon-800/50 rounded border border-gold-500/30">
                  <div className="flex-1">
                    <span className="text-gold-200">{item.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({item.type})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-300">{item.price} po</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nom objet"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-dungeon-800/50 border-gold-500/30 text-sm"
                />
                <Input
                  placeholder="Type"
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-dungeon-800/50 border-gold-500/30 text-sm"
                />
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="Prix"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="bg-dungeon-800/50 border-gold-500/30 text-sm flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addItem}
                    className="bg-gold-600 hover:bg-gold-700 h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-gold-600 hover:bg-gold-700 text-dungeon-900">
              <Save className="w-4 h-4 mr-2" />
              {editingNPC ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NPCForm;
