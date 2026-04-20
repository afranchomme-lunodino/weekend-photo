/**
 * Calcule les alertes d'entretien et de contrôle technique pour tous les véhicules.
 *
 * Logique :
 * - Pour chaque véhicule, on récupère son plan d'entretien constructeur.
 * - Pour chaque opération du plan, on calcule le km et le temps restants
 *   en fonction du dernier enregistrement dans l'historique.
 * - On émet une alerte si : dépassé (critical), < 500 km ou < 30 j (warning),
 *   < 1 000 km ou < 60 j (info).
 * - Le contrôle technique génère une alerte 30 jours avant la date limite.
 */

import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import type { Vehicle, MaintenanceAlert, AlertSeverity, MaintenanceType } from "@/types";
import { MAINTENANCE_LABELS } from "@/types";
import { findMaintenancePlan, findPlanVariant } from "@/data/maintenancePlans";

// ─── Seuils d'alerte ───────────────────────────────────────────────────────

const KM_CRITICAL = 0;      // dépassé
const KM_WARNING = 500;     // moins de 500 km
const KM_INFO = 1500;       // moins de 1 500 km

const DAYS_CRITICAL = 0;    // dépassé
const DAYS_WARNING = 30;    // moins de 30 jours
const DAYS_INFO = 60;       // moins de 60 jours

// ─── Helpers ───────────────────────────────────────────────────────────────

function computeSeverity(kmRemaining?: number, daysRemaining?: number): AlertSeverity {
  const kmCrit = kmRemaining !== undefined && kmRemaining <= KM_CRITICAL;
  const daysCrit = daysRemaining !== undefined && daysRemaining <= DAYS_CRITICAL;
  if (kmCrit || daysCrit) return "critical";

  const kmWarn = kmRemaining !== undefined && kmRemaining <= KM_WARNING;
  const daysWarn = daysRemaining !== undefined && daysRemaining <= DAYS_WARNING;
  if (kmWarn || daysWarn) return "warning";

  const kmInfo = kmRemaining !== undefined && kmRemaining <= KM_INFO;
  const daysInfo = daysRemaining !== undefined && daysRemaining <= DAYS_INFO;
  if (kmInfo || daysInfo) return "info";

  return "ok";
}

function getLastRecord(vehicle: Vehicle, type: MaintenanceType) {
  return vehicle.maintenanceHistory
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

// ─── Calcul des alertes ────────────────────────────────────────────────────

function computeAlertsForVehicle(vehicle: Vehicle): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];
  const vehicleName = `${vehicle.make} ${vehicle.model} (${vehicle.registrationPlate})`;

  // 1. Contrôle technique
  const daysToTI = differenceInDays(
    parseISO(vehicle.nextTechnicalInspectionDate),
    new Date()
  );
  const tiSeverity = computeSeverity(undefined, daysToTI);
  if (tiSeverity !== "ok") {
    alerts.push({
      vehicleId: vehicle.id,
      vehicleName,
      type: "technical_inspection",
      label: MAINTENANCE_LABELS["technical_inspection"],
      severity: tiSeverity,
      daysRemaining: daysToTI,
    });
  }

  // 2. Entretien constructeur
  const plan = findMaintenancePlan(
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.engine
  );
  if (!plan) return alerts;

  const variant = findPlanVariant(plan, vehicle.engine);
  if (!variant) return alerts;

  for (const interval of variant.intervals) {
    // Ignorer technical_inspection (géré ci-dessus)
    if (interval.type === "technical_inspection") continue;

    const lastRecord = getLastRecord(vehicle, interval.type);
    const lastKm = lastRecord?.kilometers ?? 0;
    const lastDate = lastRecord?.date ?? vehicle.lastKilometerUpdate;

    let kmRemaining: number | undefined;
    let daysRemaining: number | undefined;

    if (interval.intervalKm) {
      const kmDone = vehicle.currentKilometers - lastKm;
      kmRemaining = interval.intervalKm - kmDone;
    }

    if (interval.intervalMonths) {
      const daysSinceLast = differenceInDays(new Date(), parseISO(lastDate));
      const intervalDays = interval.intervalMonths * 30;
      daysRemaining = intervalDays - daysSinceLast;
    }

    const severity = computeSeverity(kmRemaining, daysRemaining);
    if (severity !== "ok") {
      alerts.push({
        vehicleId: vehicle.id,
        vehicleName,
        type: interval.type,
        label: MAINTENANCE_LABELS[interval.type],
        severity,
        kmRemaining,
        daysRemaining,
        lastRecordDate: lastRecord?.date,
        lastRecordKm: lastRecord?.kilometers,
      });
    }
  }

  return alerts;
}

// ─── Hook public ───────────────────────────────────────────────────────────

export function useNotifications(vehicles: Vehicle[]): {
  alerts: MaintenanceAlert[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  totalCount: number;
} {
  return useMemo(() => {
    const all = vehicles.flatMap(computeAlertsForVehicle);

    // Tri : critical > warning > info, puis par véhicule
    const sorted = all.sort((a, b) => {
      const order: Record<AlertSeverity, number> = {
        critical: 0,
        warning: 1,
        info: 2,
        ok: 3,
      };
      return order[a.severity] - order[b.severity];
    });

    return {
      alerts: sorted,
      criticalCount: sorted.filter((a) => a.severity === "critical").length,
      warningCount: sorted.filter((a) => a.severity === "warning").length,
      infoCount: sorted.filter((a) => a.severity === "info").length,
      totalCount: sorted.length,
    };
  }, [vehicles]);
}

/** Retourne les alertes pour un seul véhicule */
export function useVehicleNotifications(vehicle: Vehicle | undefined): MaintenanceAlert[] {
  return useMemo(() => {
    if (!vehicle) return [];
    return computeAlertsForVehicle(vehicle);
  }, [vehicle]);
}
