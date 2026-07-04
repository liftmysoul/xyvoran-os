import type { Language } from "@/lib/i18n";
import type { AdaptiveMission, BiologicalConstraint, ProgressState } from "@/lib/adaptive-protocol-engine/types";

const missionNamesEs: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "Restaurar la capacidad de recuperacion",
  "Metabolic Flexibility": "Reconstruir la flexibilidad metabolica",
  "Inflammation Load": "Reducir la carga inflamatoria",
  "Hormonal Optimization": "Estabilizar fundamentos hormonales",
  "Cognitive Performance": "Potenciar la preparacion cognitiva",
  "Longevity Foundation": "Construir fundamentos de longevidad",
  "Lifestyle Consistency": "Asegurar consistencia biologica",
  "Missing Data Limitation": "Completar inteligencia de senales"
};

const constraintsEs: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "Capacidad de recuperacion",
  "Metabolic Flexibility": "Flexibilidad metabolica",
  "Inflammation Load": "Carga inflamatoria",
  "Hormonal Optimization": "Optimizacion hormonal",
  "Cognitive Performance": "Rendimiento cognitivo",
  "Longevity Foundation": "Fundamento de longevidad",
  "Lifestyle Consistency": "Consistencia de estilo de vida",
  "Missing Data Limitation": "Limitacion por datos faltantes"
};

const nextSignalsEs: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "Tendencia de HRV",
  "Metabolic Flexibility": "Tendencia de glucosa en ayunas y HbA1c",
  "Inflammation Load": "Tendencia de CRP o hsCRP",
  "Hormonal Optimization": "Panel hormonal revisado con contexto clinico",
  "Cognitive Performance": "Calidad de sueno, REM, horario de cafeina y tendencia de enfoque",
  "Longevity Foundation": "Vitamina D, CRP, lipidos y consistencia de ejercicio",
  "Lifestyle Consistency": "Adherencia de 7 dias a sueno, nutricion y movimiento",
  "Missing Data Limitation": "Carga de laboratorio y linea base de HRV"
};

const nextUpgradeEs: Record<BiologicalConstraint, string> = {
  "Recovery Capacity": "Prioriza ritmo de sueno, tendencia de HRV y progresion controlada de entrenamiento antes de aumentar la carga de rendimiento.",
  "Metabolic Flexibility": "Estabiliza proteina, fibra, caminatas post-comida y una ventana nocturna constante antes de intensificar el ayuno.",
  "Inflammation Load": "Refuerza sueno, dias de recuperacion y nutricion antiinflamatoria mientras monitoreas CRP o hsCRP.",
  "Hormonal Optimization": "Protege sueno, fuerza progresiva, energia suficiente y regulacion del estres; revisa senales hormonales con un profesional autorizado.",
  "Cognitive Performance": "Organiza el bloque cognitivo principal temprano, protege el sueno y controla el horario de cafeina.",
  "Longevity Foundation": "Construye una base con zona 2, fuerza, sueno consistente y seguimiento de vitamina D, CRP y lipidos.",
  "Lifestyle Consistency": "Completa una semana de adherencia simple: sueno, nutricion, movimiento y recuperacion medidos sin cambios agresivos.",
  "Missing Data Limitation": "Conecta HRV, sueno y laboratorio reciente para elevar la precision de inteligencia biologica antes de escalar protocolos."
};

const progressStateEs: Record<ProgressState, string> = {
  Improving: "Mejorando",
  Stable: "Estable",
  Declining: "En descenso",
  "Baseline established": "Linea base establecida",
  "Unknown due missing data": "Desconocido por datos faltantes"
};

const safetyNoteEs = "Optimizacion educativa de bienestar solamente. Esta mision no diagnostica enfermedades, no prescribe tratamientos y no sustituye atencion medica autorizada. Consulta biomarcadores anormales, sintomas, hormonas, medicamentos o condiciones medicas con un profesional calificado.";

export function localizeConstraint(value: string, language: Language) {
  if (language !== "es") return value;
  return constraintsEs[value as BiologicalConstraint] ?? value;
}

export function localizeAdaptiveMission(mission: AdaptiveMission, language: Language): AdaptiveMission {
  if (language !== "es") return mission;
  const constraint = mission.constraint;
  return {
    ...mission,
    missionName: missionNamesEs[constraint] ?? mission.missionName,
    constraint: localizeConstraint(constraint, language) as AdaptiveMission["constraint"],
    duration: mission.duration === "8 weeks" ? "8 semanas" : mission.duration,
    reason: `${constraintsEs[constraint] ?? constraint} es el cuello de botella biologico actual. La mision debe mejorar preparacion, recuperacion y calidad de senales antes de expandir la optimizacion de forma agresiva.`,
    nextUpgrade: nextUpgradeEs[constraint] ?? mission.nextUpgrade,
    nextSignalNeeded: nextSignalsEs[constraint] ?? mission.nextSignalNeeded,
    prioritySignals: mission.prioritySignals.map((signal) => localizeAdaptiveText(signal, language)),
    trackingSignals: mission.trackingSignals.map((signal) => localizeAdaptiveText(signal, language)),
    progressState: (progressStateEs[mission.progressState] ?? mission.progressState) as AdaptiveMission["progressState"],
    safetyNote: safetyNoteEs
  };
}

export function localizeAdaptiveText(value: string, language: Language) {
  if (language !== "es") return value;
  const replacements: Record<string, string> = {
    "HRV trend": "Tendencia de HRV",
    "Fasting glucose and HbA1c trend": "Tendencia de glucosa en ayunas y HbA1c",
    "CRP or hsCRP trend": "Tendencia de CRP o hsCRP",
    "Clinician-reviewed hormone panel context": "Contexto de panel hormonal revisado por un profesional",
    "Sleep quality, REM, caffeine timing, and focus trend": "Calidad de sueno, REM, horario de cafeina y tendencia de enfoque",
    "Vitamin D, CRP, lipids, and exercise consistency": "Vitamina D, CRP, lipidos y consistencia de ejercicio",
    "Seven-day sleep, nutrition, and movement adherence": "Adherencia de siete dias a sueno, nutricion y movimiento",
    "Bloodwork upload and HRV baseline": "Carga de laboratorio y linea base de HRV",
    "Inflammation marker appears outside the configured optimization target.": "El marcador de inflamacion aparece fuera del objetivo de optimizacion configurado.",
    "Hormonal signal may be limiting readiness and recovery context.": "La senal hormonal puede estar limitando preparacion y contexto de recuperacion.",
    "Recovery capacity appears to be the limiting biological pillar.": "La capacidad de recuperacion parece ser el pilar biologico limitante.",
    "Glucose regulation signal shows an optimization opportunity.": "La senal de regulacion de glucosa muestra una oportunidad de optimizacion."
  };
  return replacements[value] ?? value;
}
