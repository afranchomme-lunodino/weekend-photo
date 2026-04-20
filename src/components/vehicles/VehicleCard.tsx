import { Link } from "react-router-dom";
import { Car, Gauge, Calendar, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import type { Vehicle } from "@/types";
import { useVehicleNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KilometerUpdateDialog } from "./KilometerUpdateDialog";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const alerts = useVehicleNotifications(vehicle);
  const { familyMembers } = useAuth();

  const owner = familyMembers.find((m) => m.id === vehicle.ownerId);
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");

  const daysToTI = differenceInDays(parseISO(vehicle.nextTechnicalInspectionDate), new Date());

  const statusColor =
    criticalAlerts.length > 0
      ? "border-red-200 bg-red-50"
      : warningAlerts.length > 0
      ? "border-amber-200 bg-amber-50"
      : "border-emerald-200 bg-emerald-50";

  const StatusIcon =
    criticalAlerts.length > 0
      ? AlertCircle
      : warningAlerts.length > 0
      ? AlertTriangle
      : CheckCircle2;

  const statusIconColor =
    criticalAlerts.length > 0
      ? "text-red-500"
      : warningAlerts.length > 0
      ? "text-amber-500"
      : "text-emerald-500";

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", statusColor)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Infos véhicule */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="font-semibold hover:text-primary hover:underline"
              >
                {vehicle.make} {vehicle.model}
              </Link>
              <p className="text-sm text-muted-foreground">
                {vehicle.year} · {vehicle.color ?? "—"} · {owner?.name ?? "—"}
              </p>
            </div>
          </div>

          {/* Statut global */}
          <StatusIcon className={cn("h-5 w-5 shrink-0", statusIconColor)} />
        </div>

        {/* Métriques */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Kilométrage */}
          <div className="flex items-center gap-2 rounded-lg bg-white/70 p-2.5">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Kilométrage</p>
              <p className="text-sm font-semibold">
                {vehicle.currentKilometers.toLocaleString("fr-FR")} km
              </p>
            </div>
          </div>

          {/* Contrôle technique */}
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg p-2.5",
              daysToTI <= 30
                ? "bg-red-100"
                : daysToTI <= 60
                ? "bg-amber-100"
                : "bg-white/70"
            )}
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Prochain CT</p>
              <p className="text-sm font-semibold">
                {format(parseISO(vehicle.nextTechnicalInspectionDate), "MM/yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Plaque + alertes */}
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-xs">
            {vehicle.registrationPlate}
          </Badge>
          <div className="flex items-center gap-1.5">
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts.length} critique{criticalAlerts.length > 1 ? "s" : ""}
              </Badge>
            )}
            {warningAlerts.length > 0 && (
              <Badge variant="warning" className="text-xs">
                {warningAlerts.length} alerte{warningAlerts.length > 1 ? "s" : ""}
              </Badge>
            )}
            {alerts.length === 0 && (
              <Badge variant="success" className="text-xs">
                À jour
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t bg-white/50 px-5 py-3">
        <KilometerUpdateDialog
          vehicle={vehicle}
          trigger={
            <Button variant="outline" size="sm" className="flex-1 bg-white">
              <Gauge className="mr-1.5 h-3.5 w-3.5" />
              Km
            </Button>
          }
        />
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/vehicles/${vehicle.id}`}>Détails</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
