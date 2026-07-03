import type { BiologicalConstraint, MissionPhase } from "@/lib/adaptive-protocol-engine/types";
import type { PillarName } from "@/types/database";

export const constraintPillars: Record<BiologicalConstraint, PillarName> = {
  "Recovery Capacity": "Recovery",
  "Metabolic Flexibility": "Metabolic",
  "Inflammation Load": "Longevity",
  "Hormonal Optimization": "Recovery",
  "Cognitive Performance": "Cognitive",
  "Longevity Foundation": "Longevity",
  "Lifestyle Consistency": "Recovery",
  "Missing Data Limitation": "Longevity"
};

export const missionNames: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "Restore Recovery Capacity",
  "Metabolic Flexibility": "Rebuild Metabolic Flexibility",
  "Inflammation Load": "Reduce Inflammatory Load",
  "Hormonal Optimization": "Stabilize Hormonal Foundations",
  "Cognitive Performance": "Sharpen Cognitive Readiness",
  "Longevity Foundation": "Build Longevity Foundation",
  "Lifestyle Consistency": "Lock Biological Consistency",
  "Missing Data Limitation": "Complete Signal Intelligence"
};

export const nextSignals: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "HRV trend",
  "Metabolic Flexibility": "Fasting glucose and HbA1c trend",
  "Inflammation Load": "CRP or hsCRP trend",
  "Hormonal Optimization": "Clinician-reviewed hormone panel context",
  "Cognitive Performance": "Sleep quality, REM, caffeine timing, and focus trend",
  "Longevity Foundation": "Vitamin D, CRP, lipids, and exercise consistency",
  "Lifestyle Consistency": "Seven-day sleep, nutrition, and movement adherence",
  "Missing Data Limitation": "Bloodwork upload and HRV baseline"
};

export function phasesForConstraint(constraint: BiologicalConstraint): MissionPhase[] {
  const sharedValidation = {
    name: "Validation",
    objective: "Confirm whether the mission is moving the right biological signals.",
    actions: ["Compare pillar scores after the mission window.", "Repeat or update the highest-priority signal.", "Adjust the next mission based on trend direction."]
  };
  if (constraint === "Metabolic Flexibility") {
    return [
      { name: "Foundation", objective: "Stabilize meal rhythm and glucose-supportive behaviors.", actions: ["Anchor protein and fiber at the first meal.", "Walk 10 minutes after carbohydrate-heavy meals.", "Protect sleep timing before adding aggressive fasting."] },
      { name: "Expansion", objective: "Build glucose disposal capacity.", actions: ["Add two resistance sessions weekly.", "Use a consistent overnight eating break.", "Track energy crashes and cravings."] },
      sharedValidation
    ];
  }
  if (constraint === "Missing Data Limitation") {
    return [
      { name: "Foundation", objective: "Establish the missing signal baseline.", actions: ["Add HRV or sleep duration trend.", "Upload recent bloodwork if available.", "Log fasting glucose or HbA1c when available."] },
      { name: "Expansion", objective: "Convert baseline data into a clearer biological priority.", actions: ["Recalculate biological intelligence.", "Generate the next mission after signal coverage improves.", "Avoid aggressive changes until context improves."] },
      sharedValidation
    ];
  }
  return [
    { name: "Foundation", objective: "Restore biological readiness before expanding performance load.", actions: ["Lock wake time and sleep opportunity.", "Use low-intensity movement on low-readiness days.", "Reduce late stimulants, alcohol, and heavy meals when recovery is limited."] },
    { name: "Expansion", objective: "Progress capacity without outrunning recovery.", actions: ["Add controlled resistance training progression.", "Align protein, hydration, and minerals with training days.", "Track HRV, resting heart rate, stress, and energy."] },
    sharedValidation
  ];
}

export const safetyNote = "Educational wellness optimization only. This mission does not diagnose disease, prescribe treatment, or replace licensed medical care. Discuss abnormal biomarkers, symptoms, hormones, medications, or medical conditions with a qualified professional.";
