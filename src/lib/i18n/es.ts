import type { Dictionary } from "./en";

export const es = {
  language: { english: "English", spanish: "Español", label: "Idioma" },
  legal: {
    short: "XYVORAN OS proporciona orientación educativa de bienestar y no constituye asesoría médica.",
    full: "XYVORAN OS proporciona orientación educativa de bienestar y optimización humana. No diagnostica enfermedades, no prescribe medicamentos y no sustituye la evaluación de un profesional médico autorizado."
  },
  common: {
    loading: "Cargando...", saving: "Guardando...", updating: "Actualizando...", generating: "Generando...",
    continue: "Continuar", back: "Atrás", date: "Fecha", status: "Estado", none: "Ninguno", notSet: "Sin registrar",
    active: "Activo", completed: "Completado", archived: "Archivado", save: "Guardar", error: "Ocurrió un error. Inténtalo de nuevo."
  },
  ageGate: {
    verification: "Verificación de edad", restricted: "Acceso restringido", beta: "Acceso beta privado",
    title: "Confirma tu edad", confirmation: "Confirmo que tengo 21 años de edad o más.",
    adult: "Tengo 21 años o más", underage: "Soy menor de 21 años",
    blocked: "XYVORAN OS está disponible únicamente para personas de 21 años de edad o más.",
    blockedDetail: "El registro, inicio de sesión, panel, laboratorios, protocolos y Coach de IA no están disponibles.",
    saveError: "No se pudo guardar la confirmación de edad."
  },
  landing: {
    login: "Iniciar sesión", start: "Iniciar optimización", enter: "Ir al panel",
    eyebrow: "Tu sistema operativo de optimización humana.",
    title: "Convierte tu biología en un protocolo de optimización medible.",
    description: "XYVORAN OS integra hábitos, biomarcadores, puntuaciones por pilar y un Coach de Biohacking con IA en un centro de control premium de bienestar educativo.",
    matrix: "Matriz de pilares en vivo", pillarsTitle: "Cinco pilares de optimización", coach: "Coach de Biohacking con IA",
    coachDescription: "Consulta sobre sueño, HRV, ayuno, recuperación, resiliencia al estrés, rendimiento cognitivo y longevidad. El coach utiliza tus datos dentro de límites claros de orientación educativa de bienestar.",
    membership: "Próximamente en la membresía", membershipTitle: "Laboratorios privados, protocolos avanzados y revisiones expertas.",
    question: "¿En qué debería enfocarme esta semana para tener más energía?",
    answer: "Según tu puntuación de sueño y carga de estrés, comienza con una hora fija para despertar, luz matutina, un desayuno rico en proteína y dos bloques de movimiento de baja intensidad."
  },
  auth: {
    email: "Correo electrónico", password: "Contraseña", loginTitle: "Ingresa a XYVORAN OS", login: "Iniciar sesión", authenticating: "Verificando...",
    newHere: "¿Primera vez aquí?", createProfile: "Crea tu perfil", signupTitle: "Crea tu perfil de optimización",
    creating: "Creando...", already: "¿Ya tienes acceso?", loginFailed: "No se pudo iniciar sesión", signupFailed: "No se pudo crear la cuenta",
    confirmEmail: "Tu cuenta fue creada. Revisa tu correo para confirmarla y luego vuelve al proceso de incorporación."
  },
  nav: {
    dashboard: "Panel", biomarkers: "Biomarcadores", labs: "Laboratorios", coach: "Coach de IA", protocols: "Protocolos",
    profile: "Perfil", settings: "Configuración", layer: "Capa de optimización", system: "SO de optimización humana",
    center: "Centro de control", athlete: "Perfil del usuario", logout: "Cerrar sesión"
  },
  onboarding: {
    eyebrow: "Evaluación de optimización XYVORAN", title: "Construye tu línea base",
    intro: "Seis pasos enfocados conectan tus hábitos con los cinco pilares de optimización.",
    step: "Paso", of: "de", progress: "Progreso de incorporación", complete: "Completar evaluación", saving: "Guardando evaluación...",
    disclaimerTitle: "Aviso educativo de bienestar",
    disclaimer: "Entiendo que XYVORAN OS proporciona orientación educativa de bienestar y no diagnostica enfermedades, prescribe tratamientos ni sustituye la atención médica autorizada.",
    disclaimerRequired: "Confirma el aviso educativo de bienestar para continuar.",
    signIn: "Inicia sesión antes de completar la evaluación.", migration: "Se requiere la migración de base de datos de la Fase 5.5 antes de guardar",
    saveError: "No se pudieron guardar los datos de incorporación"
  },
  dashboard: {
    overall: "Puntuación general de optimización", weakest: "Pilar prioritario", priorities: "3 acciones prioritarias",
    latestBiomarkers: "Resumen reciente de biomarcadores", latestProtocol: "Protocolo más reciente", coachPrompts: "Consulta a tu Coach de IA",
    why: "¿Por qué esta puntuación?", positive: "Factores favorables", limiting: "Factores limitantes", risks: "Señales de atención",
    noLimit: "No se identificaron factores limitantes importantes con los datos actuales.", nextAction: "Siguiente acción sugerida"
  },
  biomarkers: {
    input: "Registro manual de biomarcadores", history: "Historial de biomarcadores", notes: "Notas", save: "Guardar biomarcadores",
    noEntries: "Aún no hay biomarcadores registrados.", historyError: "No se pudo cargar el historial de biomarcadores",
    sessionError: "No se pudo verificar tu sesión", loginAgain: "Vuelve a iniciar sesión antes de guardar biomarcadores.", saveError: "No se pudo guardar el registro de biomarcadores"
  },
  coach: {
    title: "Coach de Biohacking con IA", description: "Guía educativa de bienestar personalizada con tu perfil, biomarcadores, laboratorios y puntuaciones por pilar.",
    test: "Probar contexto del Coach", testPrompt: "Prueba el contexto de mi coach. Menciona mi objetivo principal, sueño, estrés, energía, biomarcadores recientes, puntuaciones por pilar, laboratorios recientes y una idea de una conversación previa si está disponible.",
    empty: "Consulta sobre sueño, ayuno, HRV, resiliencia al estrés, rendimiento cognitivo o un plan de 7 días.",
    analyzing: "El Coach está analizando tu contexto de optimización...", placeholder: "Consulta a tu coach...", send: "Enviar",
    unavailable: "El Coach no está disponible.", historyError: "No se pudo cargar el historial del chat",
    notConfigured: "El Coach de IA aún no está configurado. Agrega OPENAI_API_KEY para habilitar respuestas reales."
  },
  protocols: {
    title: "Motor de protocolos", description: "Protocolos estructurados de 7 días generados con tu objetivo, biomarcadores, hábitos y pilar prioritario.",
    generate: "Generar protocolo", unable: "No se pudo generar el protocolo.", generated: "generado.", loadError: "No se pudieron cargar los protocolos",
    primaryGoal: "Objetivo principal", target: "Pilar prioritario", intensity: "Nivel de intensidad", reassess: "Cuándo reevaluar",
    plan: "Plan de 7 días", day: "Día", sleep: "Acción de sueño", nutrition: "Acción de nutrición", movement: "Acción de movimiento",
    recovery: "Acción de recuperación", tracking: "Acción de seguimiento", metrics: "Métricas a monitorear", safety: "Aviso de seguridad",
    goal: "Objetivo", weakest: "Pilar prioritario", markCompleted: "Marcar como completado", legacy: "Este protocolo utiliza el formato anterior del MVP. Genera uno nuevo para ver los detalles estructurados.",
    empty: "Aún no hay protocolos generados.", updateError: "No se pudo actualizar el estado del protocolo.", completeOnboarding: "Completa la incorporación antes de generar un protocolo."
  },
  labs: {
    eyebrow: "Inteligencia de laboratorio", title: "Análisis de laboratorio",
    intro: "Carga un reporte para extraer biomarcadores compatibles y convertirlos en señales educativas de optimización. Los resultados no diagnostican enfermedades ni sustituyen la atención médica.",
    upload: "Cargar análisis de sangre", latest: "Resumen del laboratorio más reciente", markers: "Biomarcadores principales", opportunities: "Mayores oportunidades",
    weakest: "Categoría prioritaria", priority: "Acciones prioritarias", noAnalysis: "Aún no hay un análisis completado.", extracted: "Biomarcadores extraídos",
    biomarker: "Biomarcador", category: "Categoría", current: "Valor actual", range: "Rango de referencia", status: "Estado",
    history: "Historial de cargas", noUploads: "Aún no has cargado análisis de sangre.", storageError: "El almacenamiento de laboratorios no está listo",
    optimal: "Óptimo", attention: "Requiere atención", priorityArea: "Área prioritaria",
    safety: "Interpretación educativa de bienestar únicamente. Consulta a un profesional médico autorizado sobre resultados anormales, síntomas, inquietudes hormonales, enfermedades crónicas o decisiones de medicación."
  },
  profile: { title: "Perfil", noneSelected: "Ninguno seleccionado", noneListed: "Ninguno registrado", hours: "horas" },
  settings: {
    title: "Configuración", description: "La configuración del MVP se administra mediante Supabase Auth, variables de entorno y seguridad a nivel de fila.",
    language: "Preferencia de idioma", languageHelp: "Elige el idioma de la interfaz, el Coach de IA, los protocolos y los nuevos análisis de laboratorio.",
    safetyTitle: "Límite de seguridad médica", safety: "XYVORAN OS proporciona orientación educativa de bienestar. No diagnostica, prescribe ni sustituye la atención médica autorizada.",
    update: "Actualizar incorporación"
  },
  pillars: { Metabolic: "Metabolismo", Recovery: "Recuperación", Longevity: "Longevidad", Cognitive: "Rendimiento cognitivo", Beauty: "Belleza y bienestar" },
  intensity: { Beginner: "Principiante", Intermediate: "Intermedio", Advanced: "Avanzado" }
} satisfies Dictionary;
