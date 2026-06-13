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
    secureTitle: "Acceso Seguro a la Beta Privada", secureDescription: "Antes de inicializar tu perfil de inteligencia biológica, confirma que cumples con la edad mínima requerida para la membresía.", encrypted: "Punto de acceso cifrado",
    title: "Confirma tu edad", confirmation: "Confirmo que tengo 21 años de edad o más.",
    adult: "Tengo 21 años o más", underage: "Soy menor de 21 años",
    blocked: "XYVORAN OS está disponible únicamente para personas de 21 años de edad o más.",
    blockedDetail: "El registro, inicio de sesión, panel, laboratorios, protocolos y Coach de IA no están disponibles.",
    saveError: "No se pudo guardar la confirmación de edad."
  },
  landing: {
    login: "Iniciar sesión", start: "Iniciar optimización", enter: "Ir al panel",
    eyebrow: "Tu sistema operativo de optimización humana.", platform: "El sistema operativo para la optimización humana", heroAlt: "Gemelo humano digital visualizado mediante señales neuronales y biométricas",
    title: "La capa de inteligencia entre tu biología y tu potencial.",
    description: "XYVORAN OS convierte biomarcadores, señales de estilo de vida y datos de rendimiento humano en prioridades precisas, decisiones guiadas por IA y protocolos ejecutables.",
    matrix: "Matriz de pilares en vivo", pillarsTitle: "Cinco pilares de optimización", coach: "Coach de Biohacking con IA",
    intelligenceLayer: "Arquitectura de inteligencia biológica", pillarsDescription: "Un solo modelo operativo conecta las señales que definen tu rendimiento actual y tu capacidad de evolucionar con resiliencia.",
    metabolicDescription: "Estabilidad de glucosa, flexibilidad metabólica, ritmo nutricional y señales de composición corporal.",
    recoveryDescription: "Arquitectura del sueño, HRV, preparación del sistema nervioso y carga acumulada de estrés.",
    longevityDescription: "Inflamación, suficiencia de nutrientes, capacidad de movimiento y trayectoria de salud a largo plazo.",
    cognitiveDescription: "Estabilidad del enfoque, energía utilizable, calidad REM, uso de estimulantes y resiliencia mental.",
    beautyDescription: "Hidratación, profundidad del sueño, recuperación de tejidos, inflamación y ritmos que favorecen la piel.",
    signalBiomarkers: "Impulsado por biometría", signalAi: "Potenciado por IA", signalProtocols: "Listo para protocolos", signalPrivate: "Privado por diseño",
    operatingSequence: "Secuencia operativa", howTitle: "De la señal humana a la acción biológica.", howDescription: "XYVORAN crea un ciclo cerrado de inteligencia alrededor de tus objetivos, conducta, biomarcadores y respuesta.",
    stepProfile: "Mapea tu línea base", stepProfileDescription: "Define objetivos, capacidad de recuperación, patrones metabólicos y el contexto de tu estado actual.",
    stepSignals: "Conecta tus señales", stepSignalsDescription: "Agrega biomarcadores, laboratorios, sueño, HRV y hábitos para construir un gemelo digital más completo.",
    stepAction: "Ejecuta la prioridad", stepActionDescription: "Convierte tu pilar más débil y tu oportunidad de mayor impacto en un protocolo estructurado y medible.",
    coachSystem: "Inteligencia contextual de optimización",
    coachDescription: "Consulta sobre sueño, HRV, ayuno, recuperación, resiliencia al estrés, rendimiento cognitivo y longevidad. El coach utiliza tus datos dentro de límites claros de orientación educativa de bienestar.",
    membership: "Membresía privada de optimización", membershipTitle: "Construye el sistema de inteligencia personal que tu biología merece.",
    question: "¿En qué debería enfocarme esta semana para tener más energía?",
    answer: "Según tu puntuación de sueño y carga de estrés, comienza con una hora fija para despertar, luz matutina, un desayuno rico en proteína y dos bloques de movimiento de baja intensidad."
  },
  auth: {
    email: "Correo electrónico", password: "Contraseña", loginTitle: "Ingresa a XYVORAN OS", login: "Iniciar sesión", authenticating: "Verificando...",
    secureAccess: "Acceso seguro para miembros", privateEnrollment: "Registro privado de membresía", loginDescription: "Autentícate para acceder a tu entorno privado de inteligencia biológica, prioridades de optimización e historial de protocolos.", signupDescription: "Inicializa tu identidad privada de miembro y comienza a construir un modelo operativo longitudinal de tu biología.", encryptedSession: "Sesión de miembro cifrada", signalIdentity: "Identidad de miembro verificada", signalBiometrics: "Inteligencia biométrica privada", signalIntelligence: "Optimización contextual con IA",
    newHere: "¿Primera vez aquí?", createProfile: "Crea tu perfil", signupTitle: "Crea tu perfil de optimización",
    creating: "Creando...", already: "¿Ya tienes acceso?", loginFailed: "No se pudo iniciar sesión", signupFailed: "No se pudo crear la cuenta",
    confirmEmail: "Tu cuenta fue creada. Revisa tu correo para confirmarla y luego vuelve al proceso de incorporación."
  },
  nav: {
    dashboard: "Panel", biomarkers: "Biomarcadores", labs: "Laboratorios", coach: "Coach de IA", protocols: "Protocolos",
    membership: "Membresía", profile: "Perfil", settings: "Configuración", layer: "Capa de optimización", system: "SO de optimización humana",
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
    saveError: "No se pudieron guardar los datos de incorporación", memberMigration: "Ejecuta la migración de membresía de la Fase 8 antes de guardar los datos del miembro.",
    ageError: "Debes tener al menos 21 años para convertirte en miembro.", consentsRequired: "Acepta los cuatro consentimientos de membresía para continuar.",
    firstName: "Nombre", lastName: "Apellido", phone: "Número de teléfono", dob: "Fecha de nacimiento", country: "País",
    stateProvince: "Estado / Provincia", city: "Ciudad", address: "Dirección", occupation: "Ocupación (opcional)", email: "Correo electrónico",
    identityHelp: "Requerido para la identidad de membresía privada y los registros de cumplimiento.", addressHelp: "Ingresa tu dirección residencial principal.",
    ageConsent: "Certifico que tengo al menos 21 años de edad.", educationConsent: "Entiendo que XYVORAN OS proporciona únicamente contenido educativo e informativo.",
    termsConsent: "Acepto los Términos y Condiciones.", privacyConsent: "Acepto la Política de Privacidad.", legalConsents: "Consentimientos de membresía"
  },
  membership: {
    eyebrow: "Membresía privada", title: "Centro de membresía", description: "Tu identidad de miembro, estado de cumplimiento y progreso del perfil.",
    memberId: "ID de miembro", status: "Estado de membresía", joinDate: "Fecha de ingreso", language: "Preferencia de idioma", completion: "Perfil completado",
    pending: "Pendiente", active: "Activo", suspended: "Suspendido", expired: "Vencido", unavailable: "Registro de membresía no disponible",
    profileFoundation: "Perfil del miembro", healthFoundation: "Base de salud", labFoundation: "Inteligencia de laboratorio", protocolFoundation: "Historial de protocolos",
    complete: "Completo", incomplete: "Incompleto", nextStep: "Siguiente paso recomendado", updateProfile: "Completar perfil de miembro",
    addLabs: "Cargar análisis de sangre", generateProtocol: "Generar un protocolo", consentStatus: "Consentimientos de cumplimiento", consentComplete: "Todos los consentimientos requeridos están registrados",
    consentMissing: "Los consentimientos de membresía están incompletos", architectureError: "Faltan objetos del esquema de la Fase 8 en el proyecto de Supabase conectado.", dataError: "No se pudieron cargar los datos de membresía.", connectedProject: "Proyecto conectado"
  },
  dashboard: {
    missionEyebrow: "Centro de control biológico", missionTitle: "Centro de Control para tu Biología", missionDescription: "Tu vista operativa de preparación, resiliencia, señales biométricas y oportunidades de mayor impacto dentro de tu sistema de optimización.",
    healthScore: "Puntuación de Optimización Humana", biologicalAge: "Edad Biológica", years: "años", experimentalEstimate: "Estimación orientativa de bienestar basada en tus datos actuales; no es una medición clínica.",
    longevityProjection: "Proyección de Longevidad", recoveryStatus: "Estado de Recuperación", trajectoryStrong: "Trayectoria ascendente", trajectoryStable: "Trayectoria estable", trajectoryBuilding: "Construyendo fundamentos",
    systemReady: "Sistema de optimización activo", dataCoverage: "Cobertura de señales", signalConnected: "Biomarcadores conectados", signalPartial: "Solo datos de línea base", optimizationOpportunities: "Oportunidades de optimización",
    biomarkerTrends: "Flujo de señales biométricas", intelligenceFeed: "Flujo de inteligencia de IA", pillarArray: "Matriz de pilares de optimización",
    overall: "Puntuación general de optimización", weakest: "Pilar prioritario", priorities: "3 acciones prioritarias",
    latestBiomarkers: "Resumen reciente de biomarcadores", latestProtocol: "Protocolo más reciente", coachPrompts: "Consulta a tu Coach de IA",
    why: "¿Por qué esta puntuación?", positive: "Factores favorables", limiting: "Factores limitantes", risks: "Señales de atención",
    noLimit: "No se identificaron factores limitantes importantes con los datos actuales.", nextAction: "Siguiente acción sugerida",
    noBiomarkers: "Aún no hay biomarcadores registrados.", glucose: "Glucosa", restingHeartRate: "FC en reposo", sleep: "Sueño", address: "Abordar", logMetric: "Registra un nuevo biomarcador o una métrica de sueño.",
    improvePrompt: "Ayúdame a mejorar mi puntuación de {pillar} esta semana.", planPrompt: "Crea un plan de 24 horas para {goal} usando mis biomarcadores recientes.", explainPrompt: "Explica qué limita mi pilar de {pillar} y qué debo hacer primero.",
    planPrefix: "Tu plan actual está orientado a", weakestPrefix: "El pilar prioritario es", currentlyAt: "actualmente en", priority: "Prioridad", nextMoves: "Siguientes acciones",
    logBiomarkers: "Registrar biomarcadores", analyzeBloodwork: "Analizar laboratorio", askCoach: "Consultar al Coach de IA", generateProtocol: "Generar protocolo", openMembership: "Abrir centro de membresía",
    viewProtocol: "Ver protocolo", firstProtocol: "Genera tu primer protocolo", openLabs: "Abrir laboratorios", noPriorityMarkers: "Sin biomarcadores prioritarios", labConnection: "Carga análisis de sangre para conectar las señales de laboratorio con las puntuaciones por pilar y el contexto del Coach de IA.", pillarSaveError: "No se pudieron guardar las puntuaciones por pilar en Supabase"
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
    notConfigured: "El Coach de IA aún no está configurado. Agrega OPENAI_API_KEY para habilitar respuestas reales.", generatedEmpty: "No pude generar una respuesta. Inténtalo de nuevo con una pregunta más específica.", apiFailure: "El Coach de IA no pudo completar la solicitud. Revisa la facturación, la cuota y la configuración de la clave de OpenAI."
  },
  protocols: {
    missionEyebrow: "Ejecución de mejora biológica", missionPlan: "Plan de misión de optimización", title: "Motor de protocolos", description: "Planes de misión estructurados de 7 días generados con tu objetivo, biomarcadores, hábitos y pilar prioritario.",
    generate: "Generar protocolo", unable: "No se pudo generar el protocolo.", generated: "generado.", loadError: "No se pudieron cargar los protocolos",
    primaryGoal: "Objetivo principal", target: "Pilar prioritario", intensity: "Nivel de intensidad", reassess: "Cuándo reevaluar",
    plan: "Plan de 7 días", day: "Día", sleep: "Acción de sueño", nutrition: "Acción de nutrición", movement: "Acción de movimiento",
    recovery: "Acción de recuperación", tracking: "Acción de seguimiento", metrics: "Métricas a monitorear", safety: "Aviso de seguridad",
    goal: "Objetivo", weakest: "Pilar prioritario", markCompleted: "Marcar como completado", legacy: "Este protocolo utiliza el formato anterior del MVP. Genera uno nuevo para ver los detalles estructurados.",
    empty: "Aún no hay protocolos generados.", updateError: "No se pudo actualizar el estado del protocolo.", completeOnboarding: "Completa la incorporación antes de generar un protocolo.", legacyWarning: "El protocolo se guardó en el formato anterior porque faltan columnas de protocolos de la Fase 4 en la base de datos conectada."
  },
  labs: {
    eyebrow: "Inteligencia de laboratorio", title: "Análisis de laboratorio",
    intro: "Carga un reporte para extraer biomarcadores compatibles y convertirlos en señales educativas de optimización. Los resultados no diagnostican enfermedades ni sustituyen la atención médica.",
    upload: "Cargar análisis de sangre", latest: "Resumen del laboratorio más reciente", markers: "Biomarcadores principales", opportunities: "Mayores oportunidades",
    weakest: "Categoría prioritaria", priority: "Acciones prioritarias", noAnalysis: "Aún no hay un análisis completado.", extracted: "Biomarcadores extraídos",
    biomarker: "Biomarcador", category: "Categoría", current: "Valor actual", range: "Rango de referencia", status: "Estado",
    history: "Historial de cargas", noUploads: "Aún no has cargado análisis de sangre.", storageError: "El almacenamiento de laboratorios no está listo", loadError: "No se pudieron cargar los reportes de laboratorio",
    optimal: "Óptimo", attention: "Requiere atención", priorityArea: "Área prioritaria", completed: "completado", processing: "procesando", uploaded: "cargado", failed: "fallido",
    safety: "Interpretación educativa de bienestar únicamente. Consulta a un profesional médico autorizado sobre resultados anormales, síntomas, inquietudes hormonales, enfermedades crónicas o decisiones de medicación.",
    signInUpload: "Inicia sesión antes de cargar análisis de sangre.", chooseFile: "Selecciona un reporte de laboratorio en PDF, JPG, JPEG o PNG.", unsupportedFile: "Formato no compatible. Carga un archivo PDF, JPG, JPEG o PNG.", maxFileSize: "Los reportes de laboratorio deben pesar 4 MB o menos.", storeError: "No se pudo almacenar el reporte de laboratorio", missingBucket: "Falta el bucket privado lab-reports en el proyecto de Supabase conectado.", recordError: "No se pudo crear el registro del reporte de laboratorio", analysisSaveError: "El análisis terminó, pero no se pudo guardar", extractionFailed: "No se pudo extraer la información del laboratorio."
  },
  profile: { title: "Perfil", noneSelected: "Ninguno seleccionado", noneListed: "Ninguno registrado", hours: "horas" },
  settings: {
    title: "Configuración", description: "La configuración del MVP se administra mediante Supabase Auth, variables de entorno y seguridad a nivel de fila.",
    language: "Preferencia de idioma", languageHelp: "Elige el idioma de la interfaz, el Coach de IA, los protocolos y los nuevos análisis de laboratorio.",
    safetyTitle: "Límite de seguridad médica", safety: "XYVORAN OS proporciona orientación educativa de bienestar. No diagnostica, prescribe ni sustituye la atención médica autorizada.",
    update: "Actualizar incorporación"
  },
  optimization: {
    scoring: {
      optimized: "Optimizado", stable: "Estable", needsAttention: "Requiere atención", foundationFirst: "Priorizar fundamentos",
      notLogged: "sin registrar", notSet: "sin registrar", glucose: "Glucosa", sugarCravings: "Antojos de azúcar", sleepQuality: "Calidad del sueño", alcohol: "Alcohol", nicotine: "Nicotina", focus: "Enfoque", brainFog: "Niebla mental", caffeine: "Cafeína", skinQuality: "Calidad de la piel", hydration: "Hidratación", restingHeartRate: "Frecuencia cardiaca en reposo",
      glucoseFavorable: "La glucosa en ayunas está en un rango favorable de bienestar.", hba1cFavorable: "La HbA1c favorece una tendencia metabólica estable.", energyStrong: "El nivel de energía reportado es favorable.", fastingRhythm: "Un intervalo nocturno constante de 12 horas sin comer favorece el ritmo metabólico.", glucoseMissing: "La glucosa en ayunas no está registrada.", glucoseHigh: "La glucosa en ayunas está por encima del objetivo de optimización.", hba1cHigh: "La HbA1c está elevada; consulta los resultados anormales con un profesional médico autorizado.", insulinHigh: "La insulina está por encima del rango deseado de optimización.", cravingsFrequent: "Los antojos frecuentes de azúcar pueden reflejar saciedad inestable o una composición de comidas mejorable.", crashesFrequent: "Los bajones frecuentes de energía por la tarde limitan la flexibilidad metabólica.", metabolicBasis: "La puntuación metabólica considera glucosa, HbA1c, insulina y nivel de energía.", metabolicMeals: "Estructura las dos primeras comidas con proteína y fibra, y camina 10 minutos después de comer.", postMealWalk: "Camina 10 minutos después de tu comida principal.", proteinBreakfast: "Prioriza proteína y fibra en el desayuno.",
      sleepSupportive: "La calidad del sueño reportada favorece la recuperación.", sleepDurationGood: "La duración del sueño es de 7 horas o más.", hrvReady: "El HRV sugiere una buena disposición para recuperarte.", stressRecovery: "El estrés reportado es alto y probablemente limita la recuperación.", sleepDurationLow: "La duración del sueño está por debajo del objetivo de recuperación.", hrvLow: "El HRV es bajo; reduce la intensidad y prioriza la recuperación.", rhrHigh: "La frecuencia cardiaca en reposo está por encima del objetivo de optimización.", recoveryBasis: "La puntuación de recuperación considera sueño, HRV, frecuencia cardiaca en reposo y carga de estrés.", sleepOpportunity: "Protege una oportunidad de sueño de 8 horas con una hora fija para despertar y luz tenue antes de dormir.", downshiftBreaks: "Haz dos pausas de cinco minutos para bajar revoluciones y mantén hoy el entrenamiento en intensidad submáxima.", fixedWake: "Establece una hora fija para despertar y 60 minutos de relajación con luz tenue.",
      crpFavorable: "La CRP está en un rango favorable de bienestar.", vitaminDTarget: "La vitamina D está dentro del rango objetivo de optimización.", exerciseLongevity: "La frecuencia de ejercicio favorece los fundamentos de longevidad.", crpMissing: "La CRP no está registrada.", crpHigh: "La CRP está elevada; consulta este marcador inflamatorio con un profesional médico autorizado.", vitaminDLow: "La vitamina D está por debajo del rango deseado de optimización.", alcoholHigh: "La frecuencia actual de alcohol dificulta la recuperación y los fundamentos de longevidad.", nicotineRisk: "El consumo de nicotina o tabaco es una señal prioritaria para la longevidad.", familyHistory: "Los antecedentes familiares justifican conversaciones preventivas con un profesional médico autorizado.", longevityBasis: "La puntuación de longevidad considera inflamación, vitamina D y constancia del ejercicio.", nicotinePlan: "Consulta con un profesional médico autorizado sobre un plan estructurado para dejar la nicotina.", alcoholFree: "Elige tres noches sin alcohol esta semana y observa la calidad de tu sueño.", longevityTraining: "Programa dos sesiones de zona 2 y una sesión de fuerza esta semana.",
      energyCognitive: "El nivel de energía favorece el rendimiento cognitivo.", remSupportive: "El sueño REM favorece la recuperación cognitiva.", focusStrong: "La capacidad de enfoque reportada es favorable.", stressCognitive: "El estrés alto puede limitar el enfoque y la memoria de trabajo.", energyLimiting: "El nivel de energía está limitando el rendimiento cognitivo.", remLow: "El sueño REM está por debajo del objetivo de optimización.", brainFogFrequent: "La niebla mental frecuente limita la constancia cognitiva.", caffeineHigh: "El consumo elevado de cafeína puede estar ocultando presión de sueño o energía inestable.", cortisolHigh: "El cortisol parece elevado; consulta las inquietudes hormonales con un profesional médico autorizado.", cognitiveBasis: "La puntuación cognitiva considera energía, estrés, calidad del sueño y sueño REM.", caffeineDelay: "Retrasa la cafeína entre 60 y 90 minutos al despertar y registra tu enfoque antes de agregar otra porción.", cognitiveBlock: "Realiza tu bloque cognitivo más exigente antes de la segunda dosis de cafeína.",
      sleepSkin: "La calidad del sueño favorece la piel y los ritmos de recuperación.", deepSleepRepair: "El sueño profundo favorece la reparación de tejidos y la recuperación.", hydrationSupportive: "La hidratación reportada favorece el bienestar de la piel y los tejidos.", stressBeauty: "El estrés alto puede limitar la optimización de la piel y el bienestar.", deepSleepLow: "El sueño profundo está por debajo del objetivo de recuperación.", vitaminDWellnessLow: "La vitamina D está por debajo del rango deseado de bienestar.", hydrationLow: "La hidratación reportada es baja y limita los fundamentos del pilar de belleza.", skinLow: "La calidad de la piel está por debajo del nivel de bienestar deseado.", hormoneReview: "Las inquietudes hormonales deben revisarse con un profesional médico autorizado.", beautyBasis: "La puntuación de belleza considera calidad del sueño, sueño profundo, vitamina D y estrés.", hydrationAnchors: "Establece tres momentos fijos de hidratación: al despertar, al mediodía y con tu última comida.", beautyFoundations: "Prioriza hidratación, higiene de luz nocturna y horarios de sueño constantes.",
      labOptimal: "{marker} está dentro del rango configurado de optimización.", labAttention: "{marker} requiere atención según el rango configurado de optimización.", labPriority: "{marker} es un área prioritaria según el rango configurado de optimización.", labClinician: "Conviene revisar {marker} con un profesional médico autorizado."
    },
    protocol: {
      goalFatLoss: "Pérdida de grasa", goalBetterSleep: "Mejor sueño", goalMoreEnergy: "Más energía", goalCognitive: "Rendimiento cognitivo", goalRecovery: "Recuperación", goalLongevity: "Longevidad", goalMetabolic: "Salud metabólica", goalStress: "Resiliencia al estrés", goalBeauty: "Optimización de belleza y piel",
      wakeLight: "Mantén una hora constante para despertar y recibe entre 10 y 15 minutos de luz exterior durante los primeros 30 minutos del día.", windDown: "Inicia 60 minutos de relajación: reduce la luz y las pantallas, refresca la habitación y mantén constante tu horario de sueño.", protectSleep: "Protege tu horario de sueño y evita la cafeína durante las 8 horas previas a dormir.", fastingWindow: "Mantén una ventana nocturna de 12 horas sin comer y rompe el ayuno con proteína, fibra e hidratación.", balancedMeals: "Estructura cada comida con proteína, vegetales variados y carbohidratos de absorción lenta alrededor del entrenamiento o las caminatas.", skinNutrition: "Prioriza proteína, alimentos ricos en omega-3, hidratación con minerales y vegetales variados para favorecer la piel.", morningProtein: "Consume proteína dentro de los primeros 90 minutos del día y retrasa la cafeína hasta después de hidratarte y recibir luz matutina.", recoveryMeals: "Prioriza proteína en tus comidas y evita cenas abundantes que puedan limitar la recuperación.", mobilityWalk: "Completa 20 minutos de movilidad suave y una caminata relajada.", zone2Walk: "Camina entre 20 y 30 minutos en zona 2, preferentemente después de una comida.", cognitiveZone2: "Realiza 25 minutos de movimiento en zona 2 antes de tu bloque de trabajo más exigente.", strength: "Completa una sesión moderada de fuerza de cuerpo completo.", twoMealWalks: "Camina 10 minutos después de dos comidas.", advancedStrength: "Completa una sesión de fuerza con técnica controlada y descansos amplios.", steps: "Acumula entre 7,000 y 9,000 pasos con respiración nasal.", breathing: "Realiza 5 minutos de respiración nasal lenta y luego una breve secuencia de movilidad.", decompression: "Agrega 10 minutos de descarga después del trabajo: camina, respira o estira sin pantallas.", hormesis: "Usa una dosis pequeña de hormesis solo si estás recuperado: sauna, caminata rápida o una breve exposición final al frío según tolerancia.", downshift: "Programa un bloque deliberado para bajar revoluciones: respiración, movilidad o caminata tranquila al aire libre.", trackingRecovery: "Registra la duración del sueño, HRV o frecuencia cardiaca en reposo, estrés y energía. Anota una acción que haya mejorado tu día.", trackingGeneral: "Registra energía, hambre, sueño, disposición para entrenar y una tendencia de biomarcadores. Anota una acción que haya mejorado tu día.", noScoringData: "Aún no hay suficientes datos para calcular la puntuación.", completeData: "Completa la evaluación inicial y agrega biomarcadores.", safety: "Este protocolo ofrece orientación educativa de bienestar únicamente. No diagnostica enfermedades, prescribe medicamentos, proporciona dosificación de péptidos, recomienda suspender medicamentos prescritos ni sustituye la atención profesional. Consulta a un profesional médico autorizado ante biomarcadores anormales, síntomas, inquietudes hormonales, enfermedades crónicas o decisiones de prescripción.", reassess: "Reevalúa después de 7 días, o antes si empeora el sueño, el HRV cae notablemente, aparecen síntomas o hay biomarcadores anormales.", sleepMetric: "Duración y calidad del sueño", energyMetric: "Energía matutina y bajón de energía por la tarde", stressMetric: "Nivel de estrés y HRV o frecuencia cardiaca en reposo", adherenceMetric: "Adherencia a las acciones de sueño, nutrición, movimiento y recuperación", glucoseMetric: "Tendencia de glucosa en ayunas y caminatas después de comer", beautyMetric: "Sueño profundo, hidratación y notas de recuperación de la piel"
    },
    labs: {
      categoryCBC: "Hemograma", categoryCMP: "Panel metabólico", categoryLipids: "Lípidos", categoryHormones: "Hormonas", categoryInflammation: "Inflamación", categoryNutrients: "Nutrientes", categoryOther: "Otros",
      reviewResult: "{marker}: revisa el resultado, observa su tendencia y consulta los valores anormales con un profesional médico autorizado.", maintain: "Mantén los fundamentos actuales y continúa observando las tendencias de tus biomarcadores.", noRange: "No hay un rango de optimización configurado para este biomarcador.", clinicianRange: "Revísalo con un profesional médico autorizado.", withinRange: "Dentro del rango configurado de optimización de bienestar.", outsideAttention: "Fuera del rango amplio de atención. Consulta los resultados anormales con un profesional médico autorizado.", outsideTarget: "Fuera del rango objetivo configurado de optimización.", safetyFlag: "{marker}: {value} está fuera del rango configurado de atención.", summary: "Se analizaron {count} biomarcadores y se identificaron {opportunities} oportunidades de optimización. Esta es una guía educativa de bienestar, no un diagnóstico."
    }
  },
  pillars: { Metabolic: "Metabolismo", Recovery: "Recuperación", Longevity: "Longevidad", Cognitive: "Rendimiento cognitivo", Beauty: "Belleza y bienestar" },
  intensity: { Beginner: "Principiante", Intermediate: "Intermedio", Advanced: "Avanzado" }
} satisfies Dictionary;
