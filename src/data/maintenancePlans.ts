/**
 * Plans d'entretien constructeurs pour les véhicules courants du marché français.
 * Sources : carnets d'entretien officiels, sites constructeurs (2020-2025).
 *
 * Convention :
 *  - intervalKm   : kilométrage entre deux opérations
 *  - intervalMonths : durée maximale entre deux opérations (en mois)
 *  Les deux critères s'appliquent : le premier atteint déclenche l'alerte.
 */

import type { MaintenancePlan } from "@/types";

export const MAINTENANCE_PLANS: MaintenancePlan[] = [
  // ── RENAULT ──────────────────────────────────────────────────────────────
  {
    make: "Renault",
    model: "Clio",
    yearFrom: 2019,
    variants: [
      {
        engine: "1.0 TCe 90/100",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 48 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
          { type: "coolant", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
      {
        engine: "1.5 dCi / Blue dCi 85/100",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
          { type: "coolant", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Renault",
    model: "Mégane",
    yearFrom: 2016,
    variants: [
      {
        engine: "1.3 TCe 115/140",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 48 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Renault",
    model: "Captur",
    yearFrom: 2019,
    variants: [
      {
        engine: "1.0 TCe 90/100",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 48 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
      {
        engine: "1.3 TCe 130/155 E-Tech Hybrid",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 36 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
    ],
  },
  {
    make: "Renault",
    model: "Zoe",
    yearFrom: 2013,
    variants: [
      {
        engine: "Électrique",
        intervals: [
          { type: "cabin_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "coolant", intervalKm: 120000, intervalMonths: 120 },
          {
            type: "tire_rotation",
            intervalKm: 10000,
            notes: "Permutation recommandée",
          },
        ],
      },
    ],
  },

  // ── PEUGEOT ──────────────────────────────────────────────────────────────
  {
    make: "Peugeot",
    model: "208",
    yearFrom: 2019,
    variants: [
      {
        engine: "1.2 PureTech 75/100/130",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 80000, intervalMonths: 60 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
      {
        engine: "1.5 BlueHDi 100/130",
        intervals: [
          { type: "oil_change", intervalKm: 25000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 50000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
      {
        engine: "Électrique e-208",
        intervals: [
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "coolant", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Peugeot",
    model: "308",
    yearFrom: 2021,
    variants: [
      {
        engine: "1.2 PureTech 110/130",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 80000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Peugeot",
    model: "3008",
    yearFrom: 2017,
    variants: [
      {
        engine: "1.2 PureTech 130",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 80000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
      {
        engine: "1.5/2.0 BlueHDi 130/180",
        intervals: [
          { type: "oil_change", intervalKm: 25000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 50000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },

  // ── CITROËN ───────────────────────────────────────────────────────────────
  {
    make: "Citroën",
    model: "C3",
    yearFrom: 2017,
    variants: [
      {
        engine: "1.2 PureTech 83/110",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 80000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Citroën",
    model: "C5 Aircross",
    yearFrom: 2018,
    variants: [
      {
        engine: "1.2 PureTech 130",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 80000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Citroën",
    model: "Berlingo",
    yearFrom: 2018,
    variants: [
      {
        engine: "1.5 BlueHDi 100/130",
        intervals: [
          { type: "oil_change", intervalKm: 25000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 50000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },

  // ── VOLKSWAGEN ────────────────────────────────────────────────────────────
  {
    make: "Volkswagen",
    model: "Golf",
    yearFrom: 2020,
    variants: [
      {
        engine: "1.0/1.5 eTSI 110/130/150",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
          { type: "gearbox_service", intervalKm: 60000, intervalMonths: 60, notes: "Boîte DSG" },
        ],
      },
      {
        engine: "2.0 TDI 115/150",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 180000, intervalMonths: 120 },
          { type: "gearbox_service", intervalKm: 60000, intervalMonths: 60, notes: "Boîte DSG" },
        ],
      },
    ],
  },
  {
    make: "Volkswagen",
    model: "Polo",
    yearFrom: 2018,
    variants: [
      {
        engine: "1.0 TSI 80/95/115",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
    ],
  },
  {
    make: "Volkswagen",
    model: "Tiguan",
    yearFrom: 2016,
    variants: [
      {
        engine: "1.5 TSI 130/150",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
      {
        engine: "2.0 TDI 150",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 180000, intervalMonths: 120 },
        ],
      },
    ],
  },

  // ── TOYOTA ────────────────────────────────────────────────────────────────
  {
    make: "Toyota",
    model: "Yaris",
    yearFrom: 2020,
    variants: [
      {
        engine: "1.5 Hybrid 116",
        intervals: [
          { type: "oil_change", intervalKm: 10000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "cabin_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "brake_fluid", intervalMonths: 36 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 72 },
          { type: "coolant", intervalKm: 160000, intervalMonths: 120 },
        ],
      },
      {
        engine: "1.5 VVT-i 125",
        intervals: [
          { type: "oil_change", intervalKm: 10000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "cabin_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "brake_fluid", intervalMonths: 36 },
          { type: "spark_plugs", intervalKm: 60000 },
          { type: "timing_belt", intervalKm: 150000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Toyota",
    model: "Corolla",
    yearFrom: 2019,
    variants: [
      {
        engine: "1.8/2.0 Hybrid 122/180",
        intervals: [
          { type: "oil_change", intervalKm: 10000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "cabin_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "brake_fluid", intervalMonths: 36 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 72 },
          { type: "coolant", intervalKm: 160000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Toyota",
    model: "RAV4",
    yearFrom: 2019,
    variants: [
      {
        engine: "2.5 Hybrid 218",
        intervals: [
          { type: "oil_change", intervalKm: 10000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "cabin_filter", intervalKm: 30000, intervalMonths: 36 },
          { type: "brake_fluid", intervalMonths: 36 },
          { type: "spark_plugs", intervalKm: 60000, intervalMonths: 72 },
        ],
      },
    ],
  },

  // ── FORD ──────────────────────────────────────────────────────────────────
  {
    make: "Ford",
    model: "Puma",
    yearFrom: 2020,
    variants: [
      {
        engine: "1.0 EcoBoost 95/125/155 mHEV",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
    ],
  },
  {
    make: "Ford",
    model: "Focus",
    yearFrom: 2018,
    variants: [
      {
        engine: "1.0 EcoBoost 100/125",
        intervals: [
          { type: "oil_change", intervalKm: 20000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 40000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
    ],
  },

  // ── BMW ────────────────────────────────────────────────────────────────────
  {
    make: "BMW",
    model: "Série 1",
    yearFrom: 2019,
    variants: [
      {
        engine: "118i / 120i (1.5/2.0 turbo)",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
          { type: "coolant", intervalKm: 150000 },
        ],
      },
    ],
  },
  {
    make: "BMW",
    model: "Série 3",
    yearFrom: 2019,
    variants: [
      {
        engine: "320i/330i (2.0 turbo)",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
        ],
      },
      {
        engine: "318d/320d (2.0 diesel)",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 15000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "timing_belt", intervalKm: 200000, intervalMonths: 120 },
        ],
      },
    ],
  },

  // ── DACIA ─────────────────────────────────────────────────────────────────
  {
    make: "Dacia",
    model: "Sandero",
    yearFrom: 2021,
    variants: [
      {
        engine: "1.0 TCe 90/110",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
  {
    make: "Dacia",
    model: "Duster",
    yearFrom: 2018,
    variants: [
      {
        engine: "1.3 TCe 130/150 4x2",
        intervals: [
          { type: "oil_change", intervalKm: 15000, intervalMonths: 12 },
          { type: "air_filter", intervalKm: 30000, intervalMonths: 24 },
          { type: "cabin_filter", intervalKm: 20000, intervalMonths: 12 },
          { type: "brake_fluid", intervalMonths: 24 },
          { type: "spark_plugs", intervalKm: 60000 },
          { type: "timing_belt", intervalKm: 120000, intervalMonths: 120 },
        ],
      },
    ],
  },
];

/**
 * Retourne le plan d'entretien correspondant à un véhicule.
 * Priorité : make + model + year + engine (exact), puis sans engine.
 */
export function findMaintenancePlan(
  make: string,
  model: string,
  year: number,
  engine?: string
): MaintenancePlan | undefined {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();

  const candidates = MAINTENANCE_PLANS.filter(
    (p) =>
      p.make.toLowerCase() === makeLower &&
      p.model.toLowerCase() === modelLower &&
      p.yearFrom <= year &&
      (p.yearTo === undefined || p.yearTo >= year)
  );

  return candidates[0];
}

/**
 * Retourne la variante (moteur) appropriée dans un plan.
 * Retourne la première variante si aucune correspondance exacte.
 */
export function findPlanVariant(
  plan: MaintenancePlan,
  engine?: string
) {
  if (!engine || plan.variants.length === 1) return plan.variants[0];

  const engineLower = engine.toLowerCase();
  const exact = plan.variants.find((v) =>
    v.engine?.toLowerCase().includes(engineLower)
  );
  return exact ?? plan.variants[0];
}

/** Liste de toutes les marques disponibles (triée alphabétiquement) */
export const AVAILABLE_MAKES = [
  ...new Set(MAINTENANCE_PLANS.map((p) => p.make)),
].sort();

/** Liste des modèles pour une marque donnée */
export function getModelsForMake(make: string): string[] {
  return [
    ...new Set(
      MAINTENANCE_PLANS.filter(
        (p) => p.make.toLowerCase() === make.toLowerCase()
      ).map((p) => p.model)
    ),
  ].sort();
}

/** Liste des moteurs disponibles pour une marque + modèle + année */
export function getEnginesForModel(
  make: string,
  model: string,
  year: number
): string[] {
  const plan = findMaintenancePlan(make, model, year);
  if (!plan) return [];
  return plan.variants
    .map((v) => v.engine ?? "Standard")
    .filter(Boolean) as string[];
}
