/**
 * Service de persistance localStorage.
 * Toutes les données de l'application sont sérialisées dans une clé unique.
 */

import type { AppStorage, FamilyMember, Vehicle } from "@/types";
import { INITIAL_DATA } from "@/data/initialData";

const STORAGE_KEY = "rappel_vehicule_data";

// ─── Lecture / Écriture brute ──────────────────────────────────────────────

function loadStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_DATA };
    return JSON.parse(raw) as AppStorage;
  } catch {
    return { ...INITIAL_DATA };
  }
}

function saveStorage(data: AppStorage): void {
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Réinitialise le localStorage avec les données de démonstration */
export function resetToInitialData(): void {
  saveStorage({ ...INITIAL_DATA });
}

// ─── Membres de la famille ─────────────────────────────────────────────────

export function getFamilyMembers(): FamilyMember[] {
  return loadStorage().familyMembers;
}

export function saveFamilyMember(member: FamilyMember): void {
  const data = loadStorage();
  const idx = data.familyMembers.findIndex((m) => m.id === member.id);
  if (idx >= 0) {
    data.familyMembers[idx] = member;
  } else {
    data.familyMembers.push(member);
  }
  saveStorage(data);
}

export function deleteFamilyMember(memberId: string): void {
  const data = loadStorage();
  data.familyMembers = data.familyMembers.filter((m) => m.id !== memberId);
  saveStorage(data);
}

/**
 * Authentification simple par email + mot de passe (comparaison plain-text).
 * En production, remplacer par un hash bcrypt côté serveur.
 */
export function authenticateMember(
  email: string,
  password: string
): FamilyMember | null {
  const members = getFamilyMembers();
  const member = members.find(
    (m) => m.email.toLowerCase() === email.toLowerCase()
  );
  if (!member) return null;
  if (member.passwordHash !== password) return null;
  return member;
}

// ─── Véhicules ─────────────────────────────────────────────────────────────

export function getVehicles(): Vehicle[] {
  return loadStorage().vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return loadStorage().vehicles.find((v) => v.id === id);
}

export function saveVehicle(vehicle: Vehicle): void {
  const data = loadStorage();
  const idx = data.vehicles.findIndex((v) => v.id === vehicle.id);
  if (idx >= 0) {
    data.vehicles[idx] = vehicle;
  } else {
    data.vehicles.push(vehicle);
  }
  saveStorage(data);
}

export function deleteVehicle(vehicleId: string): void {
  const data = loadStorage();
  data.vehicles = data.vehicles.filter((v) => v.id !== vehicleId);
  saveStorage(data);
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

/** Génère un identifiant unique */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
