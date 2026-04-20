import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  AVAILABLE_MAKES,
  getModelsForMake,
  getEnginesForModel,
} from "@/data/maintenancePlans";
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

// Marques non présentes dans les plans (entretien générique)
const ALL_MAKES = [
  ...AVAILABLE_MAKES,
  "Mercedes-Benz",
  "Audi",
  "Opel",
  "Nissan",
  "Hyundai",
  "Kia",
  "Seat",
  "Skoda",
  "Fiat",
  "Alfa Romeo",
  "Autre",
].sort((a, b) => a.localeCompare(b, "fr"));

interface FormState {
  make: string;
  model: string;
  engine: string;
  year: string;
  registrationPlate: string;
  color: string;
  currentKilometers: string;
  lastTechnicalInspectionDate: string;
  ownerId: string;
}

const EMPTY_FORM: FormState = {
  make: "",
  model: "",
  engine: "",
  year: String(new Date().getFullYear()),
  registrationPlate: "",
  color: "",
  currentKilometers: "0",
  lastTechnicalInspectionDate: "",
  ownerId: "",
};

export function AddVehicleDialog() {
  const { addVehicle } = useVehicles();
  const { currentUser, familyMembers } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ownerId: currentUser?.id ?? "" });

  const availableModels = form.make ? getModelsForMake(form.make) : [];
  const availableEngines =
    form.make && form.model
      ? getEnginesForModel(form.make, form.model, parseInt(form.year) || new Date().getFullYear())
      : [];

  useEffect(() => {
    setForm((f) => ({ ...f, model: "", engine: "" }));
  }, [form.make]);

  useEffect(() => {
    setForm((f) => ({ ...f, engine: "" }));
  }, [form.model]);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const km = parseInt(form.currentKilometers, 10);
    const year = parseInt(form.year, 10);

    if (!form.lastTechnicalInspectionDate) {
      toast.error("Veuillez saisir la date du dernier contrôle technique.");
      return;
    }

    addVehicle({
      make: form.make,
      model: form.model,
      engine: form.engine || undefined,
      year,
      registrationPlate: form.registrationPlate.toUpperCase(),
      color: form.color || undefined,
      currentKilometers: km,
      lastKilometerUpdate: new Date().toISOString(),
      lastTechnicalInspectionDate: new Date(form.lastTechnicalInspectionDate).toISOString(),
      nextTechnicalInspectionDate: "", // calculé dans le contexte
      ownerId: form.ownerId || currentUser!.id,
    });

    toast.success(`Véhicule ${form.make} ${form.model} ajouté avec succès !`);
    setOpen(false);
    setForm({ ...EMPTY_FORM, ownerId: currentUser?.id ?? "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule</DialogTitle>
          <DialogDescription>
            Renseignez les informations du véhicule. Le plan d'entretien constructeur sera
            automatiquement associé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Marque */}
            <div className="space-y-2">
              <Label>Marque</Label>
              <Select value={form.make} onValueChange={(v) => set("make", v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner…" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_MAKES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modèle */}
            <div className="space-y-2">
              <Label>Modèle</Label>
              {availableModels.length > 0 ? (
                <Select
                  value={form.model}
                  onValueChange={(v) => set("model", v)}
                  disabled={!form.make}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner…" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Ex : Golf, 308, Yaris…"
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  required
                />
              )}
            </div>

            {/* Motorisation */}
            <div className="col-span-2 space-y-2">
              <Label>
                Motorisation{" "}
                <span className="text-muted-foreground font-normal">(optionnel)</span>
              </Label>
              {availableEngines.length > 0 ? (
                <Select value={form.engine} onValueChange={(v) => set("engine", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une motorisation…" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEngines.map((eng) => (
                      <SelectItem key={eng} value={eng}>
                        {eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Ex : 1.5 dCi 110, 1.2 PureTech 130…"
                  value={form.engine}
                  onChange={(e) => set("engine", e.target.value)}
                />
              )}
            </div>

            {/* Année */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-year">Année</Label>
              <Input
                id="vehicle-year"
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                required
              />
            </div>

            {/* Immatriculation */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-plate">Immatriculation</Label>
              <Input
                id="vehicle-plate"
                placeholder="AB-123-CD"
                value={form.registrationPlate}
                onChange={(e) => set("registrationPlate", e.target.value)}
                required
              />
            </div>

            {/* Couleur */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-color">
                Couleur <span className="text-muted-foreground font-normal">(optionnel)</span>
              </Label>
              <Input
                id="vehicle-color"
                placeholder="Ex : Blanc Nacré"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
              />
            </div>

            {/* Kilométrage */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-km">Kilométrage actuel</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="vehicle-km"
                  type="number"
                  min="0"
                  value={form.currentKilometers}
                  onChange={(e) => set("currentKilometers", e.target.value)}
                  required
                />
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>

            {/* Dernier CT */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="vehicle-ct">Date du dernier contrôle technique</Label>
              <Input
                id="vehicle-ct"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={form.lastTechnicalInspectionDate}
                onChange={(e) => set("lastTechnicalInspectionDate", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Le prochain contrôle technique sera calculé automatiquement (+ 2 ans).
              </p>
            </div>

            {/* Propriétaire */}
            <div className="col-span-2 space-y-2">
              <Label>Utilisateur principal</Label>
              <Select value={form.ownerId} onValueChange={(v) => set("ownerId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre…" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!form.make || !form.model}>
              Ajouter le véhicule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
