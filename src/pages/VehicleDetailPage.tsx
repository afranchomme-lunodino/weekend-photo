import { useParams, useNavigate, Link } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Car,
  Gauge,
  Calendar,
  Trash2,
  AlertCircle,
  TrendingUp,
  Euro,
} from "lucide-react";
import { toast } from "sonner";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import { MAINTENANCE_LABELS } from "@/types";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { KilometerUpdateDialog } from "@/components/vehicles/KilometerUpdateDialog";
import { MaintenanceLogDialog } from "@/components/vehicles/MaintenanceLogDialog";
import { MaintenanceStatusCard } from "@/components/vehicles/MaintenanceStatusCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVehicle, removeVehicle, deleteMaintenanceRecord } = useVehicles();
  const { familyMembers } = useAuth();

  const vehicle = getVehicle(id!);

  if (!vehicle) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Car className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Véhicule introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux véhicules
          </Link>
        </Button>
      </div>
    );
  }

  const owner = familyMembers.find((m) => m.id === vehicle.ownerId);
  const daysToTI = differenceInDays(parseISO(vehicle.nextTechnicalInspectionDate), new Date());

  const sortedHistory = [...vehicle.maintenanceHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedKmHistory = [...vehicle.kilometerHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalCost = vehicle.maintenanceHistory.reduce((sum, r) => sum + (r.cost ?? 0), 0);

  function handleDelete() {
    removeVehicle(vehicle.id);
    toast.success(`Véhicule ${vehicle.make} ${vehicle.model} supprimé.`);
    navigate("/vehicles");
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title={`${vehicle.make} ${vehicle.model}`}
        subtitle={`${vehicle.registrationPlate} · ${vehicle.year}`}
      />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/vehicles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <KilometerUpdateDialog vehicle={vehicle} />
              <MaintenanceLogDialog vehicle={vehicle} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer le véhicule</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir supprimer{" "}
                      <strong>
                        {vehicle.make} {vehicle.model} ({vehicle.registrationPlate})
                      </strong>{" "}
                      ? Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Annuler</Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Supprimer définitivement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Fiche véhicule */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Gauge className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {vehicle.currentKilometers.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    km · mis à jour le{" "}
                    {format(parseISO(vehicle.lastKilometerUpdate), "dd/MM/yyyy", { locale: fr })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={daysToTI <= 30 ? "border-red-200 bg-red-50" : daysToTI <= 60 ? "border-amber-200 bg-amber-50" : ""}>
              <CardContent className="flex items-center gap-3 p-4">
                <Calendar className={`h-8 w-8 ${daysToTI <= 30 ? "text-red-500" : daysToTI <= 60 ? "text-amber-500" : "text-primary"}`} />
                <div>
                  <p className="text-2xl font-bold">
                    {format(parseISO(vehicle.nextTechnicalInspectionDate), "MM/yyyy", { locale: fr })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prochain CT ·{" "}
                    {daysToTI <= 0
                      ? `${Math.abs(daysToTI)} j. dépassé`
                      : `dans ${daysToTI} j.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{vehicle.maintenanceHistory.length}</p>
                  <p className="text-xs text-muted-foreground">Entretiens enregistrés</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Euro className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {totalCost.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                  </p>
                  <p className="text-xs text-muted-foreground">Coût total entretiens</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Infos générales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="h-4 w-4 text-primary" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                {[
                  { label: "Marque", value: vehicle.make },
                  { label: "Modèle", value: vehicle.model },
                  { label: "Motorisation", value: vehicle.engine ?? "Non renseignée" },
                  { label: "Année", value: vehicle.year },
                  { label: "Immatriculation", value: vehicle.registrationPlate },
                  { label: "Couleur", value: vehicle.color ?? "—" },
                  { label: "Propriétaire", value: owner?.name ?? "—" },
                  {
                    label: "Dernier CT",
                    value: format(parseISO(vehicle.lastTechnicalInspectionDate), "dd/MM/yyyy", {
                      locale: fr,
                    }),
                  },
                  {
                    label: "CT à venir",
                    value: format(parseISO(vehicle.nextTechnicalInspectionDate), "dd/MM/yyyy", {
                      locale: fr,
                    }),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Tabs : entretien + historique km */}
          <Tabs defaultValue="maintenance">
            <TabsList>
              <TabsTrigger value="maintenance">Plan d'entretien</TabsTrigger>
              <TabsTrigger value="history">
                Historique{" "}
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                  {sortedHistory.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="km">
                Kilométrage{" "}
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                  {sortedKmHistory.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Onglet plan d'entretien */}
            <TabsContent value="maintenance">
              <MaintenanceStatusCard vehicle={vehicle} />
            </TabsContent>

            {/* Onglet historique des entretiens */}
            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
                  {sortedHistory.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <p className="text-sm text-muted-foreground">Aucun entretien enregistré.</p>
                      <MaintenanceLogDialog vehicle={vehicle} />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Km</TableHead>
                          <TableHead>Opération</TableHead>
                          <TableHead>Garage</TableHead>
                          <TableHead className="text-right">Coût</TableHead>
                          <TableHead className="text-right">Effectué par</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedHistory.map((record) => {
                          const member = familyMembers.find((m) => m.id === record.performedBy);
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="whitespace-nowrap text-sm">
                                {format(parseISO(record.date), "dd/MM/yyyy", { locale: fr })}
                              </TableCell>
                              <TableCell className="text-sm">
                                {record.kilometers.toLocaleString("fr-FR")} km
                              </TableCell>
                              <TableCell>
                                <div>
                                  <Badge variant="secondary" className="text-xs">
                                    {MAINTENANCE_LABELS[record.type]}
                                  </Badge>
                                  {record.description &&
                                    record.description !== MAINTENANCE_LABELS[record.type] && (
                                      <p className="mt-0.5 text-xs text-muted-foreground">
                                        {record.description}
                                      </p>
                                    )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {record.garage ?? "—"}
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {record.cost != null
                                  ? `${record.cost.toFixed(2)} €`
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                {member?.name ?? "—"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    deleteMaintenanceRecord(vehicle.id, record.id)
                                  }
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet historique kilométrique */}
            <TabsContent value="km">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Kilométrage</TableHead>
                        <TableHead>Écart</TableHead>
                        <TableHead>Saisi par</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedKmHistory.map((entry, idx) => {
                        const member = familyMembers.find((m) => m.id === entry.recordedBy);
                        const prev = sortedKmHistory[idx + 1];
                        const diff = prev ? entry.kilometers - prev.kilometers : null;
                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="text-sm">
                              {format(parseISO(entry.date), "dd/MM/yyyy HH:mm", { locale: fr })}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {entry.kilometers.toLocaleString("fr-FR")} km
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {diff != null ? `+${diff.toLocaleString("fr-FR")} km` : "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {member?.name ?? "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* CT alerte si proche */}
          {daysToTI <= 60 && (
            <Card className={daysToTI <= 30 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}>
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${daysToTI <= 30 ? "text-red-500" : "text-amber-500"}`} />
                <div>
                  <p className="font-medium">
                    {daysToTI <= 0
                      ? "Contrôle technique dépassé !"
                      : `Contrôle technique dans ${daysToTI} jour${daysToTI > 1 ? "s" : ""}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date limite :{" "}
                    {format(parseISO(vehicle.nextTechnicalInspectionDate), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                    . Pensez à prendre rendez-vous.
                  </p>
                  <MaintenanceLogDialog
                    vehicle={vehicle}
                    preselectedType="technical_inspection"
                    trigger={
                      <Button size="sm" className="mt-2">
                        Enregistrer le CT effectué
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
