import type { Language } from "@/lib/i18n";

const phraseTranslations: Array<[string, string]> = [
  ["Testosterone is below the general optimization range.", "La testosterona esta por debajo del rango general de optimizacion."],
  ["Testosterone is above the general optimization range.", "La testosterona esta por encima del rango general de optimizacion."],
  ["Resting heart rate is above the recovery optimization range.", "La frecuencia cardiaca en reposo esta por encima del rango de optimizacion de recuperacion."],
  ["Resting heart rate is below the broad wellness context range.", "La frecuencia cardiaca en reposo esta por debajo del rango general de contexto de bienestar."],
  ["Sleep quality is below the optimization range.", "La calidad del sueno esta por debajo del rango de optimizacion."],
  ["Sleep duration is below the optimization range.", "La duracion del sueno esta por debajo del rango de optimizacion."],
  ["CRP is above the optimization range.", "La CRP esta por encima del rango de optimizacion."],
  ["hsCRP is above the optimization range.", "La hsCRP esta por encima del rango de optimizacion."],
  ["Vitamin D is below the optimization range.", "La vitamina D esta por debajo del rango de optimizacion."],
  ["Fasting glucose is above the optimization range.", "La glucosa en ayunas esta por encima del rango de optimizacion."],
  ["HbA1c is above the optimization range.", "La HbA1c esta por encima del rango de optimizacion."],
  ["This is educational wellness guidance, not a diagnosis.", "Esto es orientacion educativa de bienestar, no un diagnostico."],
  ["Current signal appears within the optimization range.", "La senal actual aparece dentro del rango de optimizacion."],
  ["is supporting optimization", "esta apoyando la optimizacion"],
  ["optimization constraint", "limite de optimizacion"],
  ["protocol priority", "prioridad de protocolo"],
  ["optimization opportunity", "oportunidad de optimizacion"],
  ["Recovery capacity appears to be the limiting biological pillar.", "La capacidad de recuperacion parece ser el pilar biologico limitante."],
  ["Inflammation marker appears outside the configured optimization target.", "El marcador de inflamacion aparece fuera del objetivo de optimizacion configurado."],
  ["Hormonal signal may be limiting readiness and recovery context.", "La senal hormonal puede limitar la preparacion y el contexto de recuperacion."],
  ["Glucose regulation signal shows an optimization opportunity.", "La senal de regulacion de glucosa muestra una oportunidad de optimizacion."]
];

export function localizeBiologicalText(value: string | null | undefined, language: Language) {
  if (!value || language !== "es") return value ?? "";
  return phraseTranslations.reduce((text, [source, target]) => text.replaceAll(source, target), value);
}
