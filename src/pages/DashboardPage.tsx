import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, AlertCircle, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useVehicles } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertsPanel } from "@/components/notifications/AlertsPanel";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { AddVehicleDialog } from "@/components/vehicles/AddVehicleDialog";

export function DashboardPage() {
  const { currentUser } = useAuth();
  const { vehicles } = useVehicles();
  const { alerts, criticalCount, warningCount, infoCount } = useNotifications(vehicles);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Tableau de bord"
        subtitle={today.charAt(0).toUpperCase() + today.slice(1)}
      />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Message de bienvenue */}
          <div>
            <h2 className="text-xl font-semibold">
              {greeting()}, {currentUser?.name?.split(" ")[0]} !
            </h2>
            <p className="text-sm text-muted-foreground">
              {vehicles.length === 0
                ? "Commencez par ajouter un véhicule à la flotte familiale."
                : `Vous gérez ${vehicles.length} véhicule${vehicles.length > 1 ? "s" : ""} familiaux.`}
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Véhicule{vehicles.length > 1 ? "s" : ""}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={criticalCount > 0 ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${criticalCount > 0 ? "bg-red-100" : "bg-muted"}`}>
                  <AlertCircle className={`h-5 w-5 ${criticalCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{criticalCount}</p>
                  <p className="text-xs text-muted-foreground">Critique{criticalCount > 1 ? "s" : ""}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={warningCount > 0 ? "border-amber-200 bg-amber-50" : ""}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${warningCount > 0 ? "bg-amber-100" : "bg-muted"}`}>
                  <AlertTriangle className={`h-5 w-5 ${warningCount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{warningCount}</p>
                  <p className="text-xs text-muted-foreground">Alerte{warningCount > 1 ? "s" : ""}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {vehicles.length - new Set(alerts.map((a) => a.vehicleId)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">À jour</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deux colonnes : véhicules + alertes */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Colonne gauche : véhicules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Véhicules</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/vehicles">Voir tous</Link>
                </Button>
              </div>
              {vehicles.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center gap-3 py-10">
                    <Car className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Aucun véhicule pour le moment</p>
                    <AddVehicleDialog />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {vehicles.slice(0, 3).map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                  {vehicles.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/vehicles">
                        Voir les {vehicles.length - 3} autres véhicules
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Colonne droite : alertes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Alertes
                  {alerts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {alerts.length}
                    </Badge>
                  )}
                </h3>
                {alerts.length > 0 && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/alerts">Voir toutes</Link>
                  </Button>
                )}
              </div>
              <AlertsPanel alerts={alerts.slice(0, 5)} />
            </div>
          </div>

          {/* Prochains entretiens à réaliser */}
          {criticalCount > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-red-700">
                  <Wrench className="h-4 w-4" />
                  Action requise immédiatement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-red-800">
                  {alerts
                    .filter((a) => a.severity === "critical")
                    .slice(0, 3)
                    .map((a, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span className="font-medium">{a.vehicleName}</span>
                        <span>—</span>
                        <span>{a.label}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
