import { useState } from "react";
import { Search, Car } from "lucide-react";
import { useVehicles } from "@/contexts/VehicleContext";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { AddVehicleDialog } from "@/components/vehicles/AddVehicleDialog";

export function VehiclesPage() {
  const { vehicles } = useVehicles();
  const [search, setSearch] = useState("");

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.registrationPlate.toLowerCase().includes(q) ||
      (v.color?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Véhicules"
        subtitle={`${vehicles.length} véhicule${vehicles.length > 1 ? "s" : ""} dans la flotte familiale`}
      />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-5">
          {/* Barre d'outils */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un véhicule…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <AddVehicleDialog />
          </div>

          {/* Grille de véhicules */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
              {search ? (
                <div>
                  <p className="font-medium">Aucun résultat pour « {search} »</p>
                  <p className="text-sm text-muted-foreground">
                    Essayez avec la marque, le modèle ou la plaque.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Aucun véhicule enregistré</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ajoutez le premier véhicule de la flotte familiale.
                  </p>
                  <AddVehicleDialog />
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
