import { useVehicles } from "@/contexts/VehicleContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Header } from "@/components/layout/Header";
import { AlertsPanel } from "@/components/notifications/AlertsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function AlertsPage() {
  const { vehicles } = useVehicles();
  const { alerts, criticalCount, warningCount, infoCount } = useNotifications(vehicles);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Alertes d'entretien"
        subtitle="Toutes les alertes et rappels pour la flotte familiale"
      />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Résumé */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-sm">
              {criticalCount} critique{criticalCount > 1 ? "s" : ""}
            </Badge>
            <Badge variant="warning" className="gap-1.5 px-3 py-1 text-sm">
              {warningCount} avertissement{warningCount > 1 ? "s" : ""}
            </Badge>
            <Badge variant="info" className="gap-1.5 px-3 py-1 text-sm">
              {infoCount} information{infoCount > 1 ? "s" : ""}
            </Badge>
          </div>
          <AlertsPanel alerts={alerts} />
        </div>
      </ScrollArea>
    </div>
  );
}
