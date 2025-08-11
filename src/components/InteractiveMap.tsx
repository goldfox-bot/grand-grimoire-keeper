
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit2, Eye, Castle, TreePine, Mountain, Sword } from "lucide-react";

interface MapLocation {
  id: string;
  name: string;
  type: 'city' | 'dungeon' | 'forest' | 'mountain' | 'poi';
  x: number;
  y: number;
  description: string;
  image?: string;
  npcs: string[];
  discovered: boolean;
}

const InteractiveMap = () => {
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: '1',
      name: 'Cité de Lumière Dorée',
      type: 'city',
      x: 300,
      y: 200,
      description: 'Grande métropole commerciale où les Maraudeurs ont établi leur base. Connue pour ses marchés aux gemmes et ses guildes d\'artisans.',
      npcs: ['Maître Eldric', 'Dame Seraphina'],
      discovered: true
    },
    {
      id: '2',
      name: 'Donjon des Échos Perdus',
      type: 'dungeon',
      x: 150,
      y: 350,
      description: 'Ancienne forteresse abandonnée où résonnent encore les voix des guerriers tombés. Rumeurs de trésors cachés.',
      npcs: ['Gardien Spectral'],
      discovered: true
    },
    {
      id: '3',
      name: 'Forêt des Murmures',
      type: 'forest',
      x: 500,
      y: 300,
      description: 'Forêt mystique où les arbres parlent aux voyageurs. Habitat des fées et des créatures sylvestres.',
      npcs: ['Archidruide Thalion', 'Reine des Pixies'],
      discovered: false
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'poi' as MapLocation['type'],
    description: '',
    x: 0,
    y: 0,
    image: ''
  });

  const getLocationIcon = (type: MapLocation['type']) => {
    switch (type) {
      case 'city': return <Castle className="w-6 h-6" />;
      case 'dungeon': return <Sword className="w-6 h-6" />;
      case 'forest': return <TreePine className="w-6 h-6" />;
      case 'mountain': return <Mountain className="w-6 h-6" />;
      default: return <MapPin className="w-6 h-6" />;
    }
  };

  const getLocationColor = (type: MapLocation['type']) => {
    switch (type) {
      case 'city': return 'text-gold-400';
      case 'dungeon': return 'text-red-400';
      case 'forest': return 'text-green-400';
      case 'mountain': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingLocation) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setNewLocation(prev => ({ ...prev, x, y }));
    }
  };

  const addLocation = () => {
    if (newLocation.name && newLocation.description) {
      const location: MapLocation = {
        id: Date.now().toString(),
        ...newLocation,
        npcs: [],
        discovered: true
      };
      
      setLocations(prev => [...prev, location]);
      setNewLocation({ name: '', type: 'poi', description: '', x: 0, y: 0, image: '' });
      setIsAddingLocation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-fantasy font-bold text-gold-200 mb-2">
            Carte du Royaume
          </h2>
          <p className="text-muted-foreground">
            Cliquez sur les marqueurs pour découvrir les lieux de votre campagne
          </p>
        </div>
        <Button
          onClick={() => setIsAddingLocation(!isAddingLocation)}
          className={`bg-gold-600 hover:bg-gold-700 text-dungeon-900 ${isAddingLocation ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAddingLocation ? 'Annuler' : 'Ajouter un Lieu'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="dungeon-card">
            <CardContent className="p-0">
              <div 
                className="relative w-full h-96 lg:h-[600px] bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleMapClick}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4841f' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                {/* Compass */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-dungeon-800/80 rounded-full flex items-center justify-center border-2 border-gold-500/50">
                  <div className="text-gold-300 font-bold text-sm">N</div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-dungeon-800/90 p-3 rounded-lg border border-gold-500/30">
                  <h4 className="text-gold-200 font-semibold mb-2 text-sm">Légende</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Castle className="w-4 h-4 text-gold-400" />
                      <span>Cité</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-red-400" />
                      <span>Donjon</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-green-400" />
                      <span>Forêt</span>
                    </div>
                  </div>
                </div>

                {/* Location Markers */}
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform ${
                      location.discovered ? '' : 'opacity-50'
                    }`}
                    style={{ left: location.x, top: location.y }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(location);
                    }}
                  >
                    <div className={`w-10 h-10 bg-dungeon-800/90 rounded-full flex items-center justify-center border-2 border-gold-500/50 ${getLocationColor(location.type)} hover:bg-dungeon-700/90`}>
                      {getLocationIcon(location.type)}
                    </div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-dungeon-800/90 px-2 py-1 rounded text-xs whitespace-nowrap border border-gold-500/30">
                      {location.name}
                    </div>
                  </div>
                ))}

                {/* New Location Preview */}
                {isAddingLocation && newLocation.name && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-75"
                    style={{ left: newLocation.x, top: newLocation.y }}
                  >
                    <div className="w-10 h-10 bg-blue-600/80 rounded-full flex items-center justify-center border-2 border-blue-400/50">
                      {getLocationIcon(newLocation.type)}
                    </div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-blue-800/90 px-2 py-1 rounded text-xs whitespace-nowrap">
                      {newLocation.name}
                    </div>
                  </div>
                )}

                {isAddingLocation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-gold-200 text-lg font-semibold">
                      Cliquez sur la carte pour placer le nouveau lieu
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Add Location Form */}
          {isAddingLocation && (
            <Card className="dungeon-card">
              <CardHeader>
                <CardTitle className="text-gold-200">Nouveau Lieu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Nom du lieu"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-dungeon-800/50 border-gold-500/30"
                />
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, type: e.target.value as MapLocation['type'] }))}
                  className="w-full p-2 rounded bg-dungeon-800/50 border border-gold-500/30 text-foreground"
                >
                  <option value="poi">Point d'intérêt</option>
                  <option value="city">Cité</option>
                  <option value="dungeon">Donjon</option>
                  <option value="forest">Forêt</option>
                  <option value="mountain">Montagne</option>
                </select>
                <Textarea
                  placeholder="Description du lieu..."
                  value={newLocation.description}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-dungeon-800/50 border-gold-500/30"
                />
                <div>
                  <Label htmlFor="newLocationImage" className="text-gold-200">Visuel (optionnel)</Label>
                  <Input
                    id="newLocationImage"
                    type="file"
                    accept="image/*"
                    className="bg-dungeon-800/50 border-gold-500/30"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setNewLocation(prev => ({ ...prev, image: reader.result as string }));
                      reader.readAsDataURL(file);
                    }}
                  />
                  {newLocation.image && (
                    <img
                      src={newLocation.image}
                      alt={`Aperçu visuel ${newLocation.name || 'lieu'}`}
                      loading="lazy"
                      className="mt-2 w-full aspect-[2.5/3.5] object-cover rounded-lg border border-gold-500/30"
                    />
                  )}
                </div>
                <Button onClick={addLocation} className="w-full bg-gold-600 hover:bg-gold-700 text-dungeon-900">
                  Ajouter le Lieu
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Location Details */}
          {selectedLocation && (
            <Card className="dungeon-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold-200">
                  {getLocationIcon(selectedLocation.type)}
                  {selectedLocation.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={selectedLocation.discovered ? "default" : "secondary"}>
                    {selectedLocation.discovered ? "Découvert" : "Inexploré"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedLocation.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  {selectedLocation.description}
                </p>

                {selectedLocation.image ? (
                  <img
                    src={selectedLocation.image}
                    alt={`Visuel ${selectedLocation.name}`}
                    loading="lazy"
                    className="w-full aspect-[2.5/3.5] object-cover rounded-lg border border-gold-500/30"
                  />
                ) : (
                  <div className="w-full aspect-[2.5/3.5] rounded-lg border border-dashed border-border/40 text-muted-foreground flex items-center justify-center text-sm">
                    Aucun visuel
                  </div>
                )}

                <div>
                  <Label htmlFor="editLocationImage" className="text-gold-200">Mettre à jour le visuel</Label>
                  <Input
                    id="editLocationImage"
                    type="file"
                    accept="image/*"
                    className="bg-dungeon-800/50 border-gold-500/30"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const img = reader.result as string;
                        setLocations(prev => prev.map(l => l.id === selectedLocation.id ? { ...l, image: img } : l));
                        setSelectedLocation(prev => prev ? { ...prev, image: img } : prev);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
                
                {selectedLocation.npcs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gold-200 mb-2">PNJ Présents</h4>
                    <div className="space-y-1">
                      {selectedLocation.npcs.map((npc, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {npc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Galerie
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="dungeon-card">
            <CardHeader>
              <CardTitle className="text-gold-200">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lieux découverts:</span>
                  <span className="text-gold-300">{locations.filter(l => l.discovered).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lieux cachés:</span>
                  <span className="text-gold-300">{locations.filter(l => !l.discovered).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total PNJ:</span>
                  <span className="text-gold-300">{locations.reduce((acc, l) => acc + l.npcs.length, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
