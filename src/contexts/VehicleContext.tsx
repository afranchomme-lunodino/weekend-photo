import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { Vehicle, MaintenanceRecord, KilometerEntry } from "@/types";
import {
  getVehicles,
  getVehicleById,
  saveVehicle,
  deleteVehicle,
  generateId,
} from "@/lib/storage";
import { addYears, parseISO, formatISO } from "date-fns";

// ─── Types ─────────────────────────────────────────────────────────────────

interface VehicleContextValue {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id" | "maintenanceHistory" | "kilometerHistory">) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (vehicleId: string) => void;
  getVehicle: (vehicleId: string) => Vehicle | undefined;
  updateKilometers: (vehicleId: string, km: number, memberId: string) => void;
  addMaintenanceRecord: (vehicleId: string, record: Omit<MaintenanceRecord, "id">) => void;
  deleteMaintenanceRecord: (vehicleId: string, recordId: string) => void;
  refreshVehicles: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const VehicleContext = createContext<VehicleContextValue | null>(null);

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Calcule la prochaine date de contrôle technique.
 * En France : 1ère visite 4 ans après la 1ère mise en circulation,
 * puis renouvellement tous les 2 ans.
 */
function computeNextTechnicalInspection(lastInspectionDate: string): string {
  const next = addYears(parseISO(lastInspectionDate), 2);
  return formatISO(next, { representation: "date" });
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getVehicles());

  const refreshVehicles = useCallback(() => {
    setVehicles(getVehicles());
  }, []);

  const addVehicle = useCallback(
    (data: Omit<Vehicle, "id" | "maintenanceHistory" | "kilometerHistory">): Vehicle => {
      const vehicle: Vehicle = {
        ...data,
        id: generateId("vehicle"),
        maintenanceHistory: [],
        kilometerHistory: [
          {
            id: generateId("km"),
            date: new Date().toISOString(),
            kilometers: data.currentKilometers,
            recordedBy: data.ownerId,
          },
        ],
        nextTechnicalInspectionDate: computeNextTechnicalInspection(
          data.lastTechnicalInspectionDate
        ),
      };
      saveVehicle(vehicle);
      setVehicles(getVehicles());
      return vehicle;
    },
    []
  );

  const updateVehicle = useCallback((vehicle: Vehicle) => {
    saveVehicle(vehicle);
    setVehicles(getVehicles());
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    deleteVehicle(vehicleId);
    setVehicles(getVehicles());
  }, []);

  const getVehicle = useCallback((vehicleId: string): Vehicle | undefined => {
    return getVehicleById(vehicleId);
  }, []);

  const updateKilometers = useCallback(
    (vehicleId: string, km: number, memberId: string) => {
      const vehicle = getVehicleById(vehicleId);
      if (!vehicle) return;

      const entry: KilometerEntry = {
        id: generateId("km"),
        date: new Date().toISOString(),
        kilometers: km,
        recordedBy: memberId,
      };

      const updated: Vehicle = {
        ...vehicle,
        currentKilometers: km,
        lastKilometerUpdate: new Date().toISOString(),
        kilometerHistory: [...vehicle.kilometerHistory, entry],
      };

      saveVehicle(updated);
      setVehicles(getVehicles());
    },
    []
  );

  const addMaintenanceRecord = useCallback(
    (vehicleId: string, record: Omit<MaintenanceRecord, "id">) => {
      const vehicle = getVehicleById(vehicleId);
      if (!vehicle) return;

      const newRecord: MaintenanceRecord = {
        ...record,
        id: generateId("maint"),
      };

      // Si c'est un contrôle technique, mettre à jour les dates
      let updates: Partial<Vehicle> = {};
      if (record.type === "technical_inspection") {
        const nextDate = computeNextTechnicalInspection(record.date);
        updates = {
          lastTechnicalInspectionDate: record.date,
          nextTechnicalInspectionDate: nextDate,
        };
      }

      const updated: Vehicle = {
        ...vehicle,
        ...updates,
        maintenanceHistory: [...vehicle.maintenanceHistory, newRecord],
      };

      saveVehicle(updated);
      setVehicles(getVehicles());
    },
    []
  );

  const deleteMaintenanceRecord = useCallback(
    (vehicleId: string, recordId: string) => {
      const vehicle = getVehicleById(vehicleId);
      if (!vehicle) return;

      const updated: Vehicle = {
        ...vehicle,
        maintenanceHistory: vehicle.maintenanceHistory.filter(
          (r) => r.id !== recordId
        ),
      };

      saveVehicle(updated);
      setVehicles(getVehicles());
    },
    []
  );

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        removeVehicle,
        getVehicle,
        updateKilometers,
        addMaintenanceRecord,
        deleteMaintenanceRecord,
        refreshVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useVehicles(): VehicleContextValue {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicles must be used inside <VehicleProvider>");
  return ctx;
}
