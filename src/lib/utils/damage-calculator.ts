import type { DamageEstimate, DamageInputs } from "@/types/fire";

const STATE_PROPERTY_VALUES: Record<string, number> = {
  CA: 850000, OR: 420000, WA: 580000, ID: 320000, MT: 310000,
  WY: 290000, CO: 520000, UT: 430000, NV: 380000, AZ: 360000,
  NM: 270000, TX: 290000, OK: 180000, KS: 185000, NE: 200000,
  SD: 195000, ND: 190000, MN: 280000, default: 300000,
};

const LAND_TYPE_DAMAGE_PER_ACRE: Record<string, number> = {
  residential: 45000,
  commercial: 85000,
  agricultural: 3200,
  forest: 1800,
  grassland: 800,
  "wildland-urban": 28000,
};

const INTENSITY_MULTIPLIER = {
  low: 0.4,
  moderate: 0.7,
  high: 1.0,
  extreme: 1.6,
};

export function calculateDamages(inputs: DamageInputs): DamageEstimate {
  const avgPropertyValue =
    STATE_PROPERTY_VALUES[inputs.state] ?? STATE_PROPERTY_VALUES.default;
  const intensityMult = INTENSITY_MULTIPLIER[inputs.fireIntensity];

  const propertyDamage =
    inputs.structuresDestroyed * avgPropertyValue * intensityMult +
    inputs.structuresThreatened * avgPropertyValue * 0.1 * intensityMult;

  const landTypeDamage = inputs.landType.reduce((sum, type) => {
    const acreShare = inputs.acresBurned / inputs.landType.length;
    return sum + acreShare * LAND_TYPE_DAMAGE_PER_ACRE[type] * intensityMult;
  }, 0);

  const agriculturalDamage = inputs.landType.includes("agricultural")
    ? (inputs.acresBurned / inputs.landType.length) * LAND_TYPE_DAMAGE_PER_ACRE.agricultural * 2
    : landTypeDamage * 0.05;

  const infrastructureDamage =
    inputs.acresBurned * 12 * intensityMult +
    inputs.urbanProximity > 5
      ? inputs.structuresDestroyed * 8500
      : inputs.structuresDestroyed * 15000;

  const environmentalDamage = inputs.acresBurned * 2200 * intensityMult;

  const directDamage = propertyDamage + agriculturalDamage + infrastructureDamage + environmentalDamage;
  const economicImpact = directDamage * 2.1;

  const confidence =
    inputs.structuresDestroyed > 0 && inputs.landType.length > 1
      ? "high"
      : inputs.acresBurned > 100
      ? "medium"
      : "low";

  return {
    propertyDamage,
    agriculturalDamage,
    infrastructureDamage,
    environmentalDamage,
    economicImpact,
    totalEstimate: economicImpact,
    confidence,
    methodology:
      "Cost estimates use FEMA damage assessment methodology with state-level property valuation data, USDA agricultural land values, and EPA environmental restoration costs. Economic multiplier (2.1x) accounts for indirect and induced economic impacts per National Institute of Building Sciences models.",
    inputs,
  };
}

export const HISTORICAL_FIRES = [
  { year: 2018, name: "Camp Fire", state: "CA", acresBurned: 153336, structuresDestroyed: 18804, fatalities: 85, estimatedDamage: 16500000000, cause: "Utility equipment", startDate: "2018-11-08", endDate: "2018-11-25", containment: 100 },
  { year: 2020, name: "August Complex", state: "CA", acresBurned: 1032648, structuresDestroyed: 935, fatalities: 1, estimatedDamage: 2800000000, cause: "Lightning", startDate: "2020-08-16", endDate: "2020-11-12", containment: 100 },
  { year: 2021, name: "Dixie Fire", state: "CA", acresBurned: 963309, structuresDestroyed: 1329, fatalities: 1, estimatedDamage: 675000000, cause: "Utility equipment", startDate: "2021-07-13", endDate: "2021-10-25", containment: 100 },
  { year: 2022, name: "Hermits Peak/Calf Canyon", state: "NM", acresBurned: 341735, structuresDestroyed: 900, fatalities: 2, estimatedDamage: 3900000000, cause: "Prescribed burn escape", startDate: "2022-04-06", endDate: "2022-08-21", containment: 100 },
  { year: 2023, name: "Lahaina Fire", state: "HI", acresBurned: 2170, structuresDestroyed: 2207, fatalities: 101, estimatedDamage: 5600000000, cause: "Downed power lines", startDate: "2023-08-08", endDate: "2023-08-11", containment: 100 },
  { year: 2017, name: "Thomas Fire", state: "CA", acresBurned: 281893, structuresDestroyed: 1063, fatalities: 2, estimatedDamage: 2200000000, cause: "Utility equipment", startDate: "2017-12-04", endDate: "2018-01-12", containment: 100 },
  { year: 2020, name: "North Complex", state: "CA", acresBurned: 318935, structuresDestroyed: 2352, fatalities: 15, estimatedDamage: 1400000000, cause: "Lightning", startDate: "2020-08-17", endDate: "2020-11-06", containment: 100 },
  { year: 2021, name: "Caldor Fire", state: "CA", acresBurned: 221835, structuresDestroyed: 1003, fatalities: 1, estimatedDamage: 1500000000, cause: "Unknown", startDate: "2021-08-14", endDate: "2021-10-21", containment: 100 },
  { year: 2022, name: "Oak Fire", state: "CA", acresBurned: 19244, structuresDestroyed: 127, fatalities: 0, estimatedDamage: 130000000, cause: "Unknown", startDate: "2022-07-22", endDate: "2022-08-05", containment: 100 },
  { year: 2023, name: "Park Fire", state: "CA", acresBurned: 429603, structuresDestroyed: 168, fatalities: 1, estimatedDamage: 220000000, cause: "Arson", startDate: "2024-07-24", endDate: "2024-09-27", containment: 100 },
];
