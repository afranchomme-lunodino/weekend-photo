import { useState } from "react";
import { Gauge } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/types";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface KilometerUpdateDialogProps {
  vehicle: Vehicle;
  trigger?: React.ReactNode;
}

export function KilometerUpdateDialog({ vehicle, trigger }: KilometerUpdateDialogProps) {
  const { updateKilometers } = useVehicles();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [km, setKm] = useState<string>(String(vehicle.currentKilometers));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const newKm = parseInt(km, 10);
    if (isNaN(newKm) || newKm < 0) {
      setError("Veuillez saisir un kilométrage valide.");
      return;
    }
    if (newKm < vehicle.currentKilometers) {
      setError(
        `Le kilométrage ne peut pas être inférieur au kilométrage actuel (${vehicle.currentKilometers.toLocaleString("fr-FR")} km).`
      );
      return;
    }

    updateKilometers(vehicle.id, newKm, currentUser!.id);
    toast.success(`Kilométrage mis à jour : ${newKm.toLocaleString("fr-FR")} km`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Gauge className="mr-2 h-4 w-4" />
            Mettre à jour le km
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Mise à jour du kilométrage</DialogTitle>
          <DialogDescription>
            {vehicle.make} {vehicle.model} — {vehicle.registrationPlate}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="km">Kilométrage actuel</Label>
            <div className="flex items-center gap-2">
              <Input
                id="km"
                type="number"
                min={vehicle.currentKilometers}
                step="1"
                value={km}
                onChange={(e) => {
                  setKm(e.target.value);
                  setError(null);
                }}
                placeholder="Ex : 45 000"
                className="flex-1"
                autoFocus
              />
              <span className="text-sm text-muted-foreground">km</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Kilométrage actuel enregistré :{" "}
              <strong>{vehicle.currentKilometers.toLocaleString("fr-FR")} km</strong>
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
