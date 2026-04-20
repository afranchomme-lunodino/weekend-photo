// ─── Auth ──────────────────────────────────────────────────────────────────

export interface FamilyMember {
  id: string;
  email: string;
  name: string;
  /** Initiales affichées dans l'avatar */
  initials: string;
  role: "admin" | "member";
  /** bcrypt hash or plain string for demo */
  passwordHash: string;
}

// ─── Maintenance ───────────────────────────────────────────────────────────

export type MaintenanceType =
  | "oil_change"
  | "air_filter"
  | "cabin_filter"
  | "brake_fluid"
  | "spark_plugs"
  | "timing_belt"
  | "tire_rotation"
  | "brake_service"
  | "gearbox_service"
  | "coolant"
  | "technical_inspection"
  | "other";

export const MAINTENANCE_LABELS: Record<MaintenanceType, string> = {
  oil_change: "Vidange huile moteur",
  air_filter: "Filtre à air",
  cabin_filter: "Filtre habitacle",
  brake_fluid: "Liquide de frein",
  spark_plugs: "Bougies d'allumage",
  timing_belt: "Courroie de distribution",
  tire_rotation: "Permutation pneus",
  brake_service: "Freins (plaquettes/disques)",
  gearbox_service: "Vidange boîte de vitesses",
  coolant: "Liquide de refroidissement",
  technical_inspection: "Contrôle technique",
  other: "Autre entretien",
};

export interface MaintenanceInterval {
  type: MaintenanceType;
  /** Périodicité kilométrique */
  intervalKm?: number;
  /** Périodicité temporelle (mois) */
  intervalMonths?: number;
  notes?: string;
}

export interface MaintenancePlanModel {
  /** Moteur / version (ex: "1.0 TCe 90", "1.5 BlueHDi 130") */
  engine?: string;
  intervals: MaintenanceInterval[];
}

export interface MaintenancePlan {
  make: string;
  model: string;
  /** Année de début de validité du plan */
  yearFrom: number;
  yearTo?: number;
  variants: MaintenancePlanModel[];
}

// ─── Vehicle ───────────────────────────────────────────────────────────────

export interface KilometerEntry {
  id: string;
  date: string; // ISO 8601
  kilometers: number;
  recordedBy: string; // FamilyMember.id
}

export interface MaintenanceRecord {
  id: string;
  date: string; // ISO 8601
  kilometers: number;
  type: MaintenanceType;
  description: string;
  cost?: number;
  garage?: string;
  performedBy: string; // FamilyMember.id
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  /** Motorisation/version (utilisé pour matcher le plan d'entretien) */
  engine?: string;
  year: number;
  /** Plaque d'immatriculation */
  registrationPlate: string;
  color?: string;
  /** Kilométrage actuel */
  currentKilometers: number;
  /** Date de la dernière mise à jour du kilométrage */
  lastKilometerUpdate: string; // ISO 8601
  /** Date de la dernière visite en contrôle technique */
  lastTechnicalInspectionDate: string; // ISO 8601
  /** Date du prochain contrôle technique calculée */
  nextTechnicalInspectionDate: string; // ISO 8601
  /** Membre de la famille propriétaire principal */
  ownerId: string;
  maintenanceHistory: MaintenanceRecord[];
  kilometerHistory: KilometerEntry[];
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type AlertSeverity = "ok" | "info" | "warning" | "critical";

export interface MaintenanceAlert {
  vehicleId: string;
  vehicleName: string;
  type: MaintenanceType;
  label: string;
  severity: AlertSeverity;
  /** km restants avant échéance (négatif = dépassé) */
  kmRemaining?: number;
  /** jours restants avant échéance (négatif = dépassé) */
  daysRemaining?: number;
  lastRecordDate?: string;
  lastRecordKm?: number;
}

// ─── App State ─────────────────────────────────────────────────────────────

export interface AppStorage {
  familyMembers: FamilyMember[];
  vehicles: Vehicle[];
  lastUpdated: string;
}
