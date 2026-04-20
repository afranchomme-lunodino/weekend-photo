/**
 * Affiche le statut de toutes les opérations d'entretien d'un véhicule
 * sous forme de liste avec indicateurs visuels.
 */
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Wrench } from "lucide-react";
import type { Vehicle, MaintenanceAlert, AlertSeverity } from "@/types";
import { useVehicleNotifications } from "@/hooks/useNotifications";
import { findMaintenancePlan, findPlanVariant } from "@/data/maintenancePlans";
import { MAINTENANCE_LABELS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MaintenanceLogDialog } from "./MaintenanceLogDialog";
import type { MaintenanceType } from "@/types";
import { cn } from "@/lib/utils";

interface MaintenanceStatusCardProps {
  vehicle: Vehicle;
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  switch (severity) {
    case "critical":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }
}

function alertToBadgeVariant(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return "destructive" as const;
    case "warning":
      return "warning" as const;
    case "info":
      return "info" as const;
    default:
      return "success" as const;
  }
}

function formatKmRemaining(km: number | undefined): string {
  if (km === undefined) return "";
  if (km <= 0) return `${Math.abs(km).toLocaleString("fr-FR")} km dépassés`;
  return `${km.toLocaleString("fr-FR")} km restants`;
}

function formatDaysRemaining(days: number | undefined): string {
  if (days === undefined) return "";
  if (days <= 0) {
    const abs = Math.abs(days);
    return `${abs} jour${abs > 1 ? "s" : ""} dépassé${abs > 1 ? "s" : ""}`;
  }
  if (days < 30) return `${days} jour${days > 1 ? "s" : ""} restant${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  return `${months} mois restant${months > 1 ? "s" : ""}`;
}

/** Calcule le % de consommation d'un intervalle (pour la barre de progression) */
function computeProgressPercent(alert: MaintenanceAlert): number {
  // On utilise les km comme base principale, sinon les jours
  if (alert.kmRemaining !== undefined) {
    const plan = findMaintenancePlan("", "", 0); // placeholder
    // Simple heuristic : on considère 100% = alerte à 0 km restant
    // On ne peut pas facilement récupérer l'intervalle ici,
    // donc on clamp sur une échelle visuelle
    const pct = Math.max(0, Math.min(100, ((alert.kmRemaining + 1500) / 1500) * 100));
    return 100 - pct;
  }
  if (alert.daysRemaining !== undefined) {
    const pct = Math.max(0, Math.min(100, ((alert.daysRemaining + 60) / 60) * 100));
    return 100 - pct;
  }
  return 0;
}

export function MaintenanceStatusCard({ vehicle }: MaintenanceStatusCardProps) {
  const alerts = useVehicleNotifications(vehicle);
  const plan = findMaintenancePlan(vehicle.make, vehicle.model, vehicle.year, vehicle.engine);
  const variant = plan ? findPlanVariant(plan, vehicle.engine) : undefined;

  // Construire la liste complète des opérations (alertes + opérations OK)
  const alertMap = new Map<MaintenanceType, MaintenanceAlert>(
    alerts.map((a) => [a.type, a])
  );

  const allIntervals = variant?.intervals ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="h-4 w-4 text-primary" />
          Plan d'entretien constructeur
          {plan ? (
            <Badge variant="info" className="ml-auto text-xs font-normal">
              {plan.make} {plan.model} {plan.yearFrom}+
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto text-xs font-normal">
              Plan non disponible
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {allIntervals.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Aucun plan d'entretien disponible pour ce véhicule.
            <br />
            Vous pouvez tout de même enregistrer les entretiens manuellement.
          </p>
        )}

        {allIntervals.map((interval) => {
          const alert = alertMap.get(interval.type);
          const severity: AlertSeverity = alert?.severity ?? "ok";

          const details: string[] = [];
          if (interval.intervalKm)
            details.push(`tous les ${interval.intervalKm.toLocaleString("fr-FR")} km`);
          if (interval.intervalMonths)
            details.push(`tous les ${interval.intervalMonths} mois`);

          const progressPct = alert ? computeProgressPercent(alert) : 0;

          return (
            <div
              key={interval.type}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                severity === "critical" && "border-red-200 bg-red-50",
                severity === "warning" && "border-amber-200 bg-amber-50",
                severity === "info" && "border-blue-200 bg-blue-50",
                severity === "ok" && "border-transparent bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SeverityIcon severity={severity} />
                  <span className="text-sm font-medium">
                    {MAINTENANCE_LABELS[interval.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {alert && (
                    <MaintenanceLogDialog
                      vehicle={vehicle}
                      preselectedType={interval.type}
                      trigger={
                        <button className="text-xs text-primary hover:underline">
                          Marquer fait
                        </button>
                      }
                    />
                  )}
                  <Badge variant={alertToBadgeVariant(severity)} className="text-xs">
                    {severity === "ok" ? "À jour" : severity === "critical" ? "Dépassé" : "Bientôt"}
                  </Badge>
                </div>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">{details.join(" · ")}</p>

              {alert && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {alert.kmRemaining !== undefined && formatKmRemaining(alert.kmRemaining)}
                      {alert.kmRemaining !== undefined && alert.daysRemaining !== undefined && " · "}
                      {alert.daysRemaining !== undefined && formatDaysRemaining(alert.daysRemaining)}
                    </span>
                  </div>
                  {severity !== "ok" && (
                    <Progress
                      value={progressPct}
                      className={cn(
                        "h-1.5",
                        severity === "critical" && "[&>div]:bg-red-500",
                        severity === "warning" && "[&>div]:bg-amber-500",
                        severity === "info" && "[&>div]:bg-blue-500"
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
