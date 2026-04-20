import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle, MaintenanceType } from "@/types";
import { MAINTENANCE_LABELS } from "@/types";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MaintenanceLogDialogProps {
  vehicle: Vehicle;
  trigger?: React.ReactNode;
  preselectedType?: MaintenanceType;
}

const MAINTENANCE_TYPES = Object.entries(MAINTENANCE_LABELS) as [MaintenanceType, string][];

export function MaintenanceLogDialog({
  vehicle,
  trigger,
  preselectedType,
}: MaintenanceLogDialogProps) {
  const { addMaintenanceRecord } = useVehicles();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<MaintenanceType>(preselectedType ?? "oil_change");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [km, setKm] = useState<string>(String(vehicle.currentKilometers));
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<string>("");
  const [garage, setGarage] = useState("");

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && preselectedType) setType(preselectedType);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const kmNum = parseInt(km, 10);
    if (isNaN(kmNum) || kmNum < 0) {
      toast.error("Veuillez saisir un kilométrage valide.");
      return;
    }

    addMaintenanceRecord(vehicle.id, {
      date: new Date(date).toISOString(),
      kilometers: kmNum,
      type,
      description: description.trim() || MAINTENANCE_LABELS[type],
      cost: cost ? parseFloat(cost) : undefined,
      garage: garage.trim() || undefined,
      performedBy: currentUser!.id,
    });

    toast.success(`Entretien enregistré : ${MAINTENANCE_LABELS[type]}`);
    setOpen(false);
    // Reset
    setDescription("");
    setCost("");
    setGarage("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Saisir un entretien
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un entretien</DialogTitle>
          <DialogDescription>
            {vehicle.make} {vehicle.model} — {vehicle.registrationPlate}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="type">Type d'entretien</Label>
              <Select value={type} onValueChange={(v) => setType(v as MaintenanceType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_TYPES.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-date">Date</Label>
              <Input
                id="maint-date"
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-km">Kilométrage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="maint-km"
                  type="number"
                  min="0"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  required
                />
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="maint-desc">Description (optionnelle)</Label>
              <Input
                id="maint-desc"
                placeholder={MAINTENANCE_LABELS[type]}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-garage">Garage</Label>
              <Input
                id="maint-garage"
                placeholder="Nom du garage"
                value={garage}
                onChange={(e) => setGarage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maint-cost">Coût (€)</Label>
              <Input
                id="maint-cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
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
