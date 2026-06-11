import type { LabCategory, PillarName } from "@/types/database";

export type MarkerDefinition = {
  key: string;
  name: string;
  aliases: string[];
  category: LabCategory;
  optimalMin?: number;
  optimalMax?: number;
  attentionMin?: number;
  attentionMax?: number;
  unit?: string;
  impacts: Partial<Record<PillarName, number>>;
};

export const markerDefinitions: MarkerDefinition[] = [
  { key: "glucose", name: "Glucose", aliases: ["fasting glucose", "glucose"], category: "CMP", optimalMin: 70, optimalMax: 95, attentionMax: 105, unit: "mg/dL", impacts: { Metabolic: -8, Cognitive: -2 } },
  { key: "hba1c", name: "HbA1c", aliases: ["hemoglobin a1c", "hba1c", "a1c"], category: "CMP", optimalMin: 4.5, optimalMax: 5.4, attentionMax: 5.7, unit: "%", impacts: { Metabolic: -12, Longevity: -3 } },
  { key: "insulin", name: "Insulin", aliases: ["fasting insulin", "insulin"], category: "Hormones", optimalMin: 2, optimalMax: 8, attentionMax: 15, unit: "uIU/mL", impacts: { Metabolic: -9 } },
  { key: "triglycerides", name: "Triglycerides", aliases: ["triglycerides", "trig"], category: "Lipids", optimalMin: 40, optimalMax: 100, attentionMax: 150, unit: "mg/dL", impacts: { Metabolic: -7, Longevity: -4 } },
  { key: "hdl", name: "HDL", aliases: ["hdl cholesterol", "hdl-c", "hdl"], category: "Lipids", optimalMin: 50, optimalMax: 100, attentionMin: 40, unit: "mg/dL", impacts: { Metabolic: -4, Longevity: -4 } },
  { key: "ldl", name: "LDL", aliases: ["ldl cholesterol", "ldl-c", "ldl"], category: "Lipids", optimalMin: 50, optimalMax: 100, attentionMax: 130, unit: "mg/dL", impacts: { Longevity: -5 } },
  { key: "total_cholesterol", name: "Total Cholesterol", aliases: ["total cholesterol", "cholesterol total"], category: "Lipids", optimalMin: 140, optimalMax: 200, attentionMax: 240, unit: "mg/dL", impacts: { Longevity: -3 } },
  { key: "crp", name: "CRP", aliases: ["hs-crp", "high sensitivity crp", "c-reactive protein", "crp"], category: "Inflammation", optimalMin: 0, optimalMax: 1, attentionMax: 3, unit: "mg/L", impacts: { Longevity: -12, Recovery: -5, Beauty: -3 } },
  { key: "tsh", name: "TSH", aliases: ["thyroid stimulating hormone", "tsh"], category: "Hormones", optimalMin: 0.5, optimalMax: 2.5, attentionMin: 0.3, attentionMax: 4.5, unit: "mIU/L", impacts: { Cognitive: -5, Recovery: -4, Beauty: -3 } },
  { key: "free_t3", name: "Free T3", aliases: ["free t3", "ft3"], category: "Hormones", optimalMin: 3, optimalMax: 4.2, attentionMin: 2.3, attentionMax: 4.8, unit: "pg/mL", impacts: { Cognitive: -4, Metabolic: -4 } },
  { key: "free_t4", name: "Free T4", aliases: ["free t4", "ft4"], category: "Hormones", optimalMin: 1, optimalMax: 1.5, attentionMin: 0.8, attentionMax: 1.8, unit: "ng/dL", impacts: { Cognitive: -4, Metabolic: -3 } },
  { key: "testosterone", name: "Testosterone", aliases: ["total testosterone", "testosterone total", "testosterone"], category: "Hormones", optimalMin: 450, optimalMax: 900, attentionMin: 300, attentionMax: 1100, unit: "ng/dL", impacts: { Recovery: -5, Cognitive: -3, Beauty: -2 } },
  { key: "free_testosterone", name: "Free Testosterone", aliases: ["free testosterone", "testosterone free"], category: "Hormones", optimalMin: 9, optimalMax: 25, attentionMin: 5, attentionMax: 30, unit: "ng/dL", impacts: { Recovery: -5, Cognitive: -3 } },
  { key: "estradiol", name: "Estradiol", aliases: ["estradiol", "e2"], category: "Hormones", optimalMin: 20, optimalMax: 45, attentionMin: 10, attentionMax: 60, unit: "pg/mL", impacts: { Recovery: -3, Beauty: -4 } },
  { key: "vitamin_d", name: "Vitamin D", aliases: ["25-oh vitamin d", "vitamin d 25 hydroxy", "vitamin d"], category: "Nutrients", optimalMin: 40, optimalMax: 70, attentionMin: 30, attentionMax: 100, unit: "ng/mL", impacts: { Recovery: -6, Longevity: -5, Beauty: -5 } },
  { key: "ferritin", name: "Ferritin", aliases: ["ferritin"], category: "Nutrients", optimalMin: 50, optimalMax: 150, attentionMin: 20, attentionMax: 250, unit: "ng/mL", impacts: { Recovery: -5, Cognitive: -5 } },
  { key: "ast", name: "AST", aliases: ["aspartate aminotransferase", "ast", "sgot"], category: "CMP", optimalMin: 10, optimalMax: 30, attentionMax: 40, unit: "U/L", impacts: { Longevity: -4 } },
  { key: "alt", name: "ALT", aliases: ["alanine aminotransferase", "alt", "sgpt"], category: "CMP", optimalMin: 7, optimalMax: 30, attentionMax: 45, unit: "U/L", impacts: { Longevity: -4, Metabolic: -2 } },
  { key: "creatinine", name: "Creatinine", aliases: ["creatinine"], category: "CMP", optimalMin: 0.7, optimalMax: 1.2, attentionMin: 0.5, attentionMax: 1.4, unit: "mg/dL", impacts: { Longevity: -4 } },
  { key: "bun", name: "BUN", aliases: ["blood urea nitrogen", "bun"], category: "CMP", optimalMin: 10, optimalMax: 20, attentionMin: 7, attentionMax: 25, unit: "mg/dL", impacts: { Longevity: -3, Recovery: -2 } },
  { key: "wbc", name: "WBC", aliases: ["white blood cell count", "wbc"], category: "CBC", optimalMin: 4.5, optimalMax: 8, attentionMin: 4, attentionMax: 11, unit: "K/uL", impacts: { Recovery: -3, Longevity: -2 } },
  { key: "hemoglobin", name: "Hemoglobin", aliases: ["hemoglobin", "hgb"], category: "CBC", optimalMin: 13.5, optimalMax: 17, attentionMin: 12, attentionMax: 18, unit: "g/dL", impacts: { Recovery: -4, Cognitive: -4 } }
];

export const markerByKey = new Map(markerDefinitions.map((definition) => [definition.key, definition]));
