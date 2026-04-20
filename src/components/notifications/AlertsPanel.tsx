import { AlertCircle, AlertTriangle, Info, Calendar, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import type { MaintenanceAlert, AlertSeverity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertsPanelProps {
  alerts: MaintenanceAlert[];
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  switch (severity) {
    case "critical":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function formatRemaining(alert: MaintenanceAlert): string {
  const parts: string[] = [];

  if (alert.daysRemaining !== undefined) {
    if (alert.daysRemaining <= 0) {
      parts.push(`${Math.abs(alert.daysRemaining)} jour(s) dépassé(s)`);
    } else {
      parts.push(`${alert.daysRemaining} jour(s) restant(s)`);
    }
  }

  if (alert.kmRemaining !== undefined) {
    if (alert.kmRemaining <= 0) {
      parts.push(`${Math.abs(alert.kmRemaining).toLocaleString("fr-FR")} km dépassés`);
    } else {
      parts.push(`${alert.kmRemaining.toLocaleString("fr-FR")} km restants`);
    }
  }

  return parts.join(" · ");
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <AlertCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-foreground">Tout est à jour !</p>
          <p className="text-sm text-muted-foreground">
            Aucune alerte d'entretien pour le moment.
          </p>
        </div>
      </div>
    );
  }

  const grouped = alerts.reduce<Record<string, MaintenanceAlert[]>>((acc, alert) => {
    const key = `${alert.severity}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(alert);
    return acc;
  }, {});

  const sections: { severity: AlertSeverity; label: string; color: string }[] = [
    { severity: "critical", label: "Critique — Action immédiate", color: "text-red-600" },
    { severity: "warning", label: "Attention — À prévoir bientôt", color: "text-amber-600" },
    { severity: "info", label: "Information — À surveiller", color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ severity, label, color }) => {
        const sectionAlerts = grouped[severity];
        if (!sectionAlerts?.length) return null;

        return (
          <div key={severity}>
            <h3 className={cn("mb-3 text-sm font-semibold", color)}>{label}</h3>
            <div className="space-y-2">
              {sectionAlerts.map((alert, idx) => (
                <div
                  key={`${alert.vehicleId}-${alert.type}-${idx}`}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3",
                    severity === "critical" && "border-red-200 bg-red-50",
                    severity === "warning" && "border-amber-200 bg-amber-50",
                    severity === "info" && "border-blue-200 bg-blue-50"
                  )}
                >
                  <SeverityIcon severity={severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{alert.label}</span>
                      <Badge
                        variant={
                          severity === "critical"
                            ? "destructive"
                            : severity === "warning"
                            ? "warning"
                            : "info"
                        }
                        className="text-xs"
                      >
                        {severity === "critical" ? "Dépassé" : "Bientôt"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.vehicleName}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      {alert.daysRemaining !== undefined && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRemaining(alert)}
                        </span>
                      )}
                      {alert.kmRemaining !== undefined && alert.daysRemaining === undefined && (
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          {formatRemaining(alert)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs" asChild>
                    <Link to={`/vehicles/${alert.vehicleId}`}>Voir</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
