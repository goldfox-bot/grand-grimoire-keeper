import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSecretItems } from "@/contexts/SecretItemsContext";
import { Trash2, Copy, Plus, LockKeyhole } from "lucide-react";

const rarityOptions = ["common", "uncommon", "rare", "epic", "legendary"] as const;
const typeOptions = ["weapon", "armor", "consumable", "treasure", "gear", "jewelry"] as const;

const SecretItems = () => {
  const { items, createSecretItem, deleteSecretItem } = useSecretItems();
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("weapon");
  const [rarity, setRarity] = useState<string>("common");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [customCode, setCustomCode] = useState<string>("");

  useEffect(() => {
    document.title = "Items Secrets MJ - Grimoire";
  }, []);

  const resetForm = () => {
    setName(""); setType("weapon"); setRarity("common"); setDescription(""); setWeight(""); setValue(""); setImage(undefined); setCustomCode("");
  };

  const handleCreate = () => {
    if (!name) { toast.error("Nom requis"); return; }
    const created = createSecretItem({
      name,
      type,
      rarity,
      description,
      weight: weight ? Number(weight) : undefined,
      value: value ? Number(value) : undefined,
      image,
      stats: undefined,
      code: customCode || undefined,
    });
    toast.success(`Créé avec le code ${created.code}`);
    setIsOpen(false);
    resetForm();
  };

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt).then(() => toast.success("Code copié"));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LockKeyhole className="h-6 w-6 text-primary" />
            Items Secrets
          </h1>
          <p className="text-muted-foreground">Créez des objets cachés avec un code de déblocage à usage unique.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nouvel Item Secret
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un item secret</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nom</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Lame de la Tombe" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <select className="w-full input-modern" value={type} onChange={(e) => setType(e.target.value)}>
                    {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Rareté</Label>
                  <select className="w-full input-modern" value={rarity} onChange={(e) => setRarity(e.target.value)}>
                    {rarityOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Poids (kg)</Label>
                  <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div>
                  <Label>Valeur (po)</Label>
                  <Input type="number" step="1" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Visuel (format carte TCG vertical)</Label>
                <Input type="file" accept="image/*" onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setImage(reader.result as string);
                  reader.readAsDataURL(file);
                }} />
                {image && (
                  <img src={image} alt="Aperçu" className="mt-2 w-full aspect-[2.5/3.5] object-cover rounded-md border" />
                )}
              </div>
              <div>
                <Label>Code personnalisé (optionnel)</Label>
                <Input placeholder="LMJT000" value={customCode} onChange={(e) => setCustomCode(e.target.value.toUpperCase())} />
              </div>
              <div className="pt-2">
                <Button className="w-full" onClick={handleCreate}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{item.name}</span>
                <Button size="icon" variant="ghost" onClick={() => deleteSecretItem(item.id)} aria-label="Supprimer">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline">{item.type}</Badge>
                <Badge variant="outline">{item.rarity}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full aspect-[2.5/3.5] object-cover rounded-md border" />
              ) : (
                <div className="w-full aspect-[2.5/3.5] rounded-md border border-dashed text-muted-foreground grid place-items-center text-sm">
                  Pas d'image
                </div>
              )}
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Code:</span> <span className="font-mono">{item.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => copy(item.code)}>
                    <Copy className="h-4 w-4 mr-2" /> Copier
                  </Button>
                </div>
              </div>
              {item.usedByCharacterId ? (
                <Badge variant="outline" className="text-green-400 border-green-400/50">Utilisé</Badge>
              ) : (
                <Badge variant="outline">Disponible</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecretItems;