export const en = {
  language: { english: "English", spanish: "Español", label: "Language" },
  legal: {
    short: "XYVORAN OS provides educational wellness guidance only and is not medical advice.",
    full: "XYVORAN OS provides educational wellness and human optimization guidance. It does not diagnose disease, prescribe medication, or replace evaluation by a licensed medical professional."
  },
  common: {
    loading: "Loading...", saving: "Saving...", updating: "Updating...", generating: "Generating...",
    continue: "Continue", back: "Back", date: "Date", status: "Status", none: "None", notSet: "Not set",
    active: "Active", completed: "Completed", archived: "Archived", save: "Save", error: "Something went wrong. Please try again."
  },
  ageGate: {
    verification: "Age Verification", restricted: "Access Restricted", beta: "Private Beta Access",
    title: "Confirm your age", confirmation: "I confirm that I am 21 years of age or older.",
    adult: "I am 21 or older", underage: "I am under 21",
    blocked: "XYVORAN OS is only available to users 21 years of age or older.",
    blockedDetail: "Signup, login, dashboard, labs, protocols, and AI Coach access are unavailable.",
    saveError: "Unable to save age confirmation."
  },
  landing: {
    login: "Login", start: "Start Optimization", enter: "Enter Dashboard",
    eyebrow: "Your Human Optimization Operating System.",
    title: "Turn your biology into a measurable optimization protocol.",
    description: "XYVORAN OS unifies lifestyle data, biomarkers, pillar scores, and an AI Biohacking Coach into one premium command center for non-medical wellness guidance.",
    matrix: "Live Pillar Matrix", pillarsTitle: "Five Optimization Pillars", coach: "AI Biohacking Coach",
    coachDescription: "Ask questions about sleep, HRV, fasting, recovery, stress resilience, cognitive performance, and longevity. The coach uses your data while staying inside clear educational wellness boundaries.",
    membership: "Membership Teaser", membershipTitle: "Private labs, advanced protocols, expert reviews.",
    question: "What should I focus on this week for more energy?",
    answer: "Based on your sleep score and stress load, start with a fixed wake time, morning light, a protein-forward breakfast, and two low-intensity movement blocks."
  },
  auth: {
    email: "Email", password: "Password", loginTitle: "Enter XYVORAN OS", login: "Login", authenticating: "Authenticating...",
    newHere: "New here?", createProfile: "Create your profile", signupTitle: "Create your optimization profile",
    creating: "Creating...", already: "Already have access?", loginFailed: "Login failed", signupFailed: "Signup failed",
    confirmEmail: "Signup succeeded. Check your email to confirm your account, then return to onboarding."
  },
  nav: {
    dashboard: "Dashboard", biomarkers: "Biomarkers", labs: "Labs", coach: "AI Coach", protocols: "Protocols",
    membership: "Membership", profile: "Profile", settings: "Settings", layer: "Optimization Layer", system: "Human Optimization OS",
    center: "Command Center", athlete: "Athlete profile", logout: "Log out"
  },
  onboarding: {
    eyebrow: "XYVORAN Optimization Intake", title: "Build your operating baseline",
    intro: "Six focused steps connect your lifestyle inputs directly to the five optimization pillars.",
    step: "Step", of: "of", progress: "Onboarding progress", complete: "Complete Intake", saving: "Saving intake...",
    disclaimerTitle: "Educational wellness disclaimer",
    disclaimer: "I understand XYVORAN OS provides educational wellness guidance only and does not diagnose disease, prescribe treatment, or replace licensed medical care.",
    disclaimerRequired: "Confirm the educational wellness disclaimer to continue.",
    signIn: "Please sign in before onboarding.", migration: "The Phase 5.5 database migration is required before saving",
    saveError: "Unable to save onboarding data", memberMigration: "Run the Phase 8 membership migration before saving member details.",
    ageError: "You must be at least 21 years old to become a member.", consentsRequired: "Accept all four membership consents to continue.",
    firstName: "First Name", lastName: "Last Name", phone: "Phone Number", dob: "Date of Birth", country: "Country",
    stateProvince: "State / Province", city: "City", address: "Address", occupation: "Occupation (optional)", email: "Email",
    identityHelp: "Required for private membership identity and compliance records.", addressHelp: "Enter your primary residential address.",
    ageConsent: "I certify that I am at least 21 years old.", educationConsent: "I understand that XYVORAN OS provides educational and informational content only.",
    termsConsent: "I agree to the Terms & Conditions.", privacyConsent: "I agree to the Privacy Policy.", legalConsents: "Membership Consents"
  },
  membership: {
    eyebrow: "Private Membership", title: "Membership Center", description: "Your membership identity, compliance status, and completion progress.",
    memberId: "Member ID", status: "Membership Status", joinDate: "Join Date", language: "Language Preference", completion: "Profile Completion",
    pending: "Pending", active: "Active", suspended: "Suspended", expired: "Expired", unavailable: "Membership record unavailable",
    profileFoundation: "Member Profile", healthFoundation: "Health Foundation", labFoundation: "Lab Intelligence", protocolFoundation: "Protocol History",
    complete: "Complete", incomplete: "Incomplete", nextStep: "Next recommended step", updateProfile: "Complete member profile",
    addLabs: "Upload bloodwork", generateProtocol: "Generate a protocol", consentStatus: "Compliance Consents", consentComplete: "All required consents recorded",
    consentMissing: "Membership consents are incomplete", architectureError: "Phase 8 schema objects are missing from the connected Supabase project.", dataError: "Membership data could not be loaded.", connectedProject: "Connected project"
  },
  dashboard: {
    overall: "Overall Optimization Score", weakest: "Weakest Pillar", priorities: "Top 3 Priority Actions",
    latestBiomarkers: "Latest Biomarker Summary", latestProtocol: "Latest Protocol", coachPrompts: "Ask Your AI Coach",
    why: "Why this score?", positive: "Positive drivers", limiting: "Limiting factors", risks: "Risk flags",
    noLimit: "No major limiting factor identified from current data.", nextAction: "Suggested next action",
    noBiomarkers: "No biomarker entry yet.", glucose: "Glucose", restingHeartRate: "RHR", sleep: "Sleep", address: "Address", logMetric: "Log one new biomarker or sleep metric.",
    improvePrompt: "Help me improve my {pillar} score this week.", planPrompt: "Build a 24-hour plan for {goal} using my latest biomarkers.", explainPrompt: "Explain what is limiting my {pillar} pillar and what to do first.",
    planPrefix: "Your current plan is tuned for", weakestPrefix: "The weakest pillar is", currentlyAt: "currently at", priority: "Priority", nextMoves: "Next Moves",
    logBiomarkers: "Log biomarkers", analyzeBloodwork: "Analyze bloodwork", askCoach: "Ask the AI Coach", generateProtocol: "Generate protocol", openMembership: "Open Membership Center",
    viewProtocol: "View protocol", firstProtocol: "Generate your first protocol", openLabs: "Open labs", noPriorityMarkers: "No priority markers", labConnection: "Upload bloodwork to connect lab signals to pillar scores and AI Coach context.", pillarSaveError: "Pillar scores could not be saved to Supabase"
  },
  biomarkers: {
    input: "Manual Biomarker Input", history: "Biomarker History", notes: "Notes", save: "Save Biomarkers",
    noEntries: "No biomarker entries yet.", historyError: "Biomarker history could not be loaded",
    sessionError: "Unable to verify your session", loginAgain: "Please log in again before saving biomarkers.", saveError: "Unable to save biomarker entry"
  },
  coach: {
    title: "AI Biohacking Coach", description: "Educational wellness guidance personalized to your profile, biomarkers, labs, and pillar scores.",
    test: "Test Coach Context", testPrompt: "Test my coach context. Reference my main goal, sleep, stress, energy, latest biomarkers, pillar scores, latest labs, and one previous chat insight if available.",
    empty: "Ask about sleep, fasting, HRV, stress resilience, cognitive performance, or a 7-day plan.",
    analyzing: "Coach is analyzing your optimization context...", placeholder: "Ask your coach...", send: "Send",
    unavailable: "Coach unavailable.", historyError: "Chat history could not be loaded",
    notConfigured: "AI Coach is not configured yet. Add OPENAI_API_KEY to enable real responses.", generatedEmpty: "I could not generate a response. Try again with a more specific question.", apiFailure: "AI Coach could not complete the OpenAI request. Check your OpenAI billing, quota, and API key settings."
  },
  protocols: {
    title: "Protocol Engine", description: "Structured 7-day protocols generated from your goal, biomarkers, lifestyle inputs, and weakest pillar.",
    generate: "Generate Protocol", unable: "Unable to generate protocol.", generated: "generated.", loadError: "Generated protocols could not be loaded",
    primaryGoal: "Primary Goal", target: "Priority Pillar", intensity: "Intensity Level", reassess: "When to Reassess",
    plan: "7-Day Action Plan", day: "Day", sleep: "Sleep Action", nutrition: "Nutrition Action", movement: "Movement Action",
    recovery: "Recovery Action", tracking: "Tracking Action", metrics: "Metrics to Monitor", safety: "Safety Notice",
    goal: "Goal", weakest: "Weakest pillar", markCompleted: "Mark Completed", legacy: "This protocol uses the legacy MVP format. Generate a new protocol for structured details.",
    empty: "No protocols generated yet.", updateError: "Unable to update protocol status.", completeOnboarding: "Complete onboarding before generating a protocol.", legacyWarning: "Protocol saved in legacy JSON mode because the connected database is missing Phase 4 protocol columns."
  },
  labs: {
    eyebrow: "Bloodwork Intelligence", title: "Lab Analysis",
    intro: "Upload a report to extract supported biomarkers and translate them into educational optimization signals. Results do not diagnose disease or replace medical care.",
    upload: "Upload Bloodwork", latest: "Latest Lab Summary", markers: "Top Biomarkers", opportunities: "Biggest Opportunities",
    weakest: "Weakest Lab Category", priority: "Priority Actions", noAnalysis: "No completed analysis yet.", extracted: "Extracted Biomarkers",
    biomarker: "Biomarker", category: "Category", current: "Current Value", range: "Reference Range", status: "Status",
    history: "Upload History", noUploads: "No bloodwork uploaded yet.", storageError: "Lab storage is not ready", loadError: "Lab reports could not be loaded",
    optimal: "Optimal", attention: "Needs Attention", priorityArea: "Priority Area", completed: "completed", processing: "processing", uploaded: "uploaded", failed: "failed",
    safety: "Educational wellness interpretation only. Consult a licensed healthcare provider about abnormal labs, symptoms, hormonal concerns, chronic disease, or medication decisions.",
    signInUpload: "Sign in before uploading bloodwork.", chooseFile: "Choose a PDF, JPG, JPEG, or PNG lab report.", unsupportedFile: "Unsupported file type. Upload PDF, JPG, JPEG, or PNG.", maxFileSize: "Lab reports must be 4 MB or smaller for production uploads.", storeError: "Unable to store lab report", missingBucket: "The private lab-reports storage bucket is missing from the connected Supabase project.", recordError: "Unable to create the lab report record", analysisSaveError: "Analysis completed but could not be saved", extractionFailed: "Lab extraction failed."
  },
  profile: { title: "Profile", noneSelected: "None selected", noneListed: "None listed", hours: "hours" },
  settings: {
    title: "Settings", description: "MVP configuration is managed through Supabase Auth, environment variables, and Row Level Security.",
    language: "Language Preference", languageHelp: "Choose the language used across the interface, AI Coach, protocols, and new lab analyses.",
    safetyTitle: "Medical Safety Boundary", safety: "XYVORAN OS provides educational wellness guidance only. It does not diagnose, prescribe, or replace licensed medical care.",
    update: "Update Onboarding"
  },
  optimization: {
    scoring: {
      optimized: "Optimized", stable: "Stable", needsAttention: "Needs attention", foundationFirst: "Foundation first",
      notLogged: "not logged", notSet: "not set", glucose: "Glucose", sugarCravings: "Sugar cravings", sleepQuality: "Sleep quality", alcohol: "Alcohol", nicotine: "Nicotine", focus: "Focus", brainFog: "Brain fog", caffeine: "Caffeine", skinQuality: "Skin quality", hydration: "Hydration", restingHeartRate: "Resting heart rate",
      glucoseFavorable: "Fasting glucose is in a favorable wellness range.", hba1cFavorable: "HbA1c supports stable metabolic trend tracking.", energyStrong: "Energy input is strong.", fastingRhythm: "A consistent 12-hour overnight fasting interval supports metabolic rhythm.", glucoseMissing: "Fasting glucose has not been logged.", glucoseHigh: "Fasting glucose is above the ideal optimization target.", hba1cHigh: "HbA1c is elevated; discuss abnormal labs with a licensed clinician.", insulinHigh: "Insulin is above the desired optimization range.", cravingsFrequent: "Frequent sugar cravings may signal inconsistent satiety or meal composition.", crashesFrequent: "Frequent afternoon energy crashes are limiting metabolic flexibility.", metabolicBasis: "Metabolic score is based on glucose, HbA1c, insulin, and energy inputs.", metabolicMeals: "Build the first two meals around protein, fiber, and a 10-minute post-meal walk.", postMealWalk: "Add a 10-minute walk after your largest meal.", proteinBreakfast: "Anchor protein and fiber at breakfast.",
      sleepSupportive: "Sleep quality input is supportive.", sleepDurationGood: "Sleep duration is at or above 7 hours.", hrvReady: "HRV suggests solid readiness.", stressRecovery: "Stress input is high and likely suppressing recovery.", sleepDurationLow: "Sleep duration is below the recovery target.", hrvLow: "HRV is low; reduce intensity and prioritize recovery.", rhrHigh: "Resting heart rate is elevated relative to the optimization target.", recoveryBasis: "Recovery score is driven by sleep, HRV, resting heart rate, and stress load.", sleepOpportunity: "Protect an 8-hour sleep opportunity with a fixed wake time and low-light wind-down.", downshiftBreaks: "Add two five-minute downshift breaks and keep training intensity submaximal today.", fixedWake: "Set a fixed wake time and a 60-minute low-light wind-down.",
      crpFavorable: "CRP is in a favorable wellness range.", vitaminDTarget: "Vitamin D is in the target optimization band.", exerciseLongevity: "Exercise frequency supports longevity fundamentals.", crpMissing: "CRP has not been logged.", crpHigh: "CRP is elevated; consult a licensed clinician for abnormal inflammatory markers.", vitaminDLow: "Vitamin D is below the desired optimization band.", alcoholHigh: "Current alcohol frequency works against recovery and longevity fundamentals.", nicotineRisk: "Nicotine or tobacco use is a high-priority longevity risk factor.", familyHistory: "Family history context supports proactive screening conversations with a licensed clinician.", longevityBasis: "Longevity score is based on inflammation, vitamin D, and exercise consistency.", nicotinePlan: "Discuss a supported nicotine cessation plan with a licensed healthcare provider.", alcoholFree: "Choose three alcohol-free recovery nights this week and track sleep quality.", longevityTraining: "Schedule two zone-2 sessions and one strength session this week.",
      energyCognitive: "Energy input supports cognitive output.", remSupportive: "REM sleep supports cognitive recovery.", focusStrong: "Reported focus capacity is strong.", stressCognitive: "High stress may impair focus and working memory.", energyLimiting: "Energy input is limiting cognitive performance.", remLow: "REM sleep is below the preferred optimization target.", brainFogFrequent: "Frequent brain fog is limiting cognitive consistency.", caffeineHigh: "High caffeine intake may be masking sleep pressure or unstable energy.", cortisolHigh: "Cortisol appears elevated; discuss hormone concerns with a licensed clinician.", cognitiveBasis: "Cognitive score reflects energy, stress, sleep quality, and REM sleep.", caffeineDelay: "Delay caffeine 60-90 minutes after waking and track focus before adding another serving.", cognitiveBlock: "Do your hardest cognitive block before caffeine dose two.",
      sleepSkin: "Sleep quality supports skin and recovery rhythms.", deepSleepRepair: "Deep sleep supports tissue repair and recovery.", hydrationSupportive: "Reported hydration consistency supports skin and tissue wellness.", stressBeauty: "High stress may work against skin and wellness optimization.", deepSleepLow: "Deep sleep is below the preferred recovery target.", vitaminDWellnessLow: "Vitamin D is below the desired wellness band.", hydrationLow: "Low reported hydration is limiting Beauty pillar fundamentals.", skinLow: "Skin quality is below the user's desired wellness baseline.", hormoneReview: "Hormonal concerns should be reviewed with a licensed clinician.", beautyBasis: "Beauty score is based on sleep quality, deep sleep, vitamin D, and stress.", hydrationAnchors: "Set three hydration anchors: waking, midday, and with your final meal.", beautyFoundations: "Prioritize hydration, evening light hygiene, and consistent sleep timing.",
      labOptimal: "{marker} is within the configured optimization range.", labAttention: "{marker} needs attention based on the configured optimization range.", labPriority: "{marker} is a priority area based on the configured optimization range.", labClinician: "{marker} should be reviewed with a licensed healthcare provider."
    },
    protocol: {
      goalFatLoss: "Fat loss", goalBetterSleep: "Better sleep", goalMoreEnergy: "More energy", goalCognitive: "Cognitive performance", goalRecovery: "Recovery", goalLongevity: "Longevity", goalMetabolic: "Metabolic health", goalStress: "Stress resilience", goalBeauty: "Beauty / skin optimization",
      wakeLight: "Lock a consistent wake time and get 10-15 minutes of outdoor light within 30 minutes of waking.", windDown: "Begin a 60-minute wind-down: dim lights, reduce screens, cool the room, and keep the sleep window consistent.", protectSleep: "Protect your current sleep window and avoid caffeine within 8 hours of bedtime.", fastingWindow: "Use a 12-hour overnight fasting window, then break the fast with protein, fiber, and hydration.", balancedMeals: "Build each meal around protein, colorful plants, and slow carbohydrates only around training or walks.", skinNutrition: "Prioritize protein, omega-3 rich foods, mineral hydration, and colorful plants for skin-supportive nutrition.", morningProtein: "Eat protein within 90 minutes of waking and delay caffeine until after hydration and morning light.", recoveryMeals: "Keep meals protein-forward and avoid large late meals that could suppress recovery.", mobilityWalk: "Complete 20 minutes of easy mobility plus a relaxed walk.", zone2Walk: "Walk 20-30 minutes in zone 2, preferably after a meal.", cognitiveZone2: "Do 25 minutes of zone 2 movement before the deepest work block.", strength: "Complete a moderate full-body strength session.", twoMealWalks: "Walk 10 minutes after two meals.", advancedStrength: "Complete a strength session with clean technique and long rests.", steps: "Accumulate 7,000-9,000 steps with nasal breathing.", breathing: "Do 5 minutes of slow nasal breathing, then a short mobility flow.", decompression: "Add a 10-minute decompression block after work: walk, breathe, or stretch without screens.", hormesis: "Use a small hormetic dose only if recovered: sauna, brisk walk, or cold finish as tolerated.", downshift: "Schedule one deliberate downshift block: breathwork, mobility, or quiet outdoor walking.", trackingRecovery: "Log sleep duration, HRV or resting heart rate, stress, and energy. Note one action that improved the day.", trackingGeneral: "Log energy, hunger, sleep, training readiness, and one biomarker trend. Note one action that improved the day.", noScoringData: "Not enough scoring data is available.", completeData: "Complete onboarding and add biomarkers.", safety: "This protocol is educational wellness guidance only. It does not diagnose disease, prescribe medication, provide peptide dosing, recommend stopping prescribed medications, or replace professional care. Consult a licensed healthcare provider for abnormal biomarkers, symptoms, hormonal concerns, chronic disease, or prescription decisions.", reassess: "Reassess after 7 days, or sooner if sleep worsens, HRV drops sharply, symptoms appear, or biomarkers are abnormal.", sleepMetric: "Sleep duration and sleep quality", energyMetric: "Morning energy and afternoon energy dip", stressMetric: "Stress level and HRV or resting heart rate", adherenceMetric: "Adherence to sleep, nutrition, movement, and recovery actions", glucoseMetric: "Fasting glucose trend and post-meal walk completion", beautyMetric: "Deep sleep, hydration, and skin recovery notes"
    },
    labs: {
      categoryCBC: "CBC", categoryCMP: "CMP", categoryLipids: "Lipids", categoryHormones: "Hormones", categoryInflammation: "Inflammation", categoryNutrients: "Nutrients", categoryOther: "Other",
      reviewResult: "{marker}: review the result, repeat or trend it as appropriate, and discuss abnormal values with a licensed healthcare provider.", maintain: "Maintain current foundations and continue trending biomarkers over time.", noRange: "No optimization range is configured for this marker.", clinicianRange: "Review with a licensed clinician.", withinRange: "Within the configured wellness optimization range.", outsideAttention: "Outside the broader attention range. Discuss abnormal results with a licensed healthcare provider.", outsideTarget: "Outside the configured optimization target range.", safetyFlag: "{marker}: {value} is outside the configured attention range.", summary: "{count} biomarkers analyzed. {opportunities} optimization opportunities identified. This is educational wellness guidance, not a diagnosis."
    }
  },
  pillars: { Metabolic: "Metabolic", Recovery: "Recovery", Longevity: "Longevity", Cognitive: "Cognitive", Beauty: "Beauty" },
  intensity: { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" }
} as const;

export type DictionaryShape<T> = { [K in keyof T]: T[K] extends string ? string : DictionaryShape<T[K]> };
export type Dictionary = DictionaryShape<typeof en>;
