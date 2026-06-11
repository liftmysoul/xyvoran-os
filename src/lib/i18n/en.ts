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
    consentMissing: "Membership consents are incomplete", architectureError: "Membership infrastructure is not ready. Run the Phase 8 Supabase migration."
  },
  dashboard: {
    overall: "Overall Optimization Score", weakest: "Weakest Pillar", priorities: "Top 3 Priority Actions",
    latestBiomarkers: "Latest Biomarker Summary", latestProtocol: "Latest Protocol", coachPrompts: "Ask Your AI Coach",
    why: "Why this score?", positive: "Positive drivers", limiting: "Limiting factors", risks: "Risk flags",
    noLimit: "No major limiting factor identified from current data.", nextAction: "Suggested next action"
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
    notConfigured: "AI Coach is not configured yet. Add OPENAI_API_KEY to enable real responses."
  },
  protocols: {
    title: "Protocol Engine", description: "Structured 7-day protocols generated from your goal, biomarkers, lifestyle inputs, and weakest pillar.",
    generate: "Generate Protocol", unable: "Unable to generate protocol.", generated: "generated.", loadError: "Generated protocols could not be loaded",
    primaryGoal: "Primary Goal", target: "Priority Pillar", intensity: "Intensity Level", reassess: "When to Reassess",
    plan: "7-Day Action Plan", day: "Day", sleep: "Sleep Action", nutrition: "Nutrition Action", movement: "Movement Action",
    recovery: "Recovery Action", tracking: "Tracking Action", metrics: "Metrics to Monitor", safety: "Safety Notice",
    goal: "Goal", weakest: "Weakest pillar", markCompleted: "Mark Completed", legacy: "This protocol uses the legacy MVP format. Generate a new protocol for structured details.",
    empty: "No protocols generated yet.", updateError: "Unable to update protocol status.", completeOnboarding: "Complete onboarding before generating a protocol."
  },
  labs: {
    eyebrow: "Bloodwork Intelligence", title: "Lab Analysis",
    intro: "Upload a report to extract supported biomarkers and translate them into educational optimization signals. Results do not diagnose disease or replace medical care.",
    upload: "Upload Bloodwork", latest: "Latest Lab Summary", markers: "Top Biomarkers", opportunities: "Biggest Opportunities",
    weakest: "Weakest Lab Category", priority: "Priority Actions", noAnalysis: "No completed analysis yet.", extracted: "Extracted Biomarkers",
    biomarker: "Biomarker", category: "Category", current: "Current Value", range: "Reference Range", status: "Status",
    history: "Upload History", noUploads: "No bloodwork uploaded yet.", storageError: "Lab storage is not ready",
    optimal: "Optimal", attention: "Needs Attention", priorityArea: "Priority Area",
    safety: "Educational wellness interpretation only. Consult a licensed healthcare provider about abnormal labs, symptoms, hormonal concerns, chronic disease, or medication decisions."
  },
  profile: { title: "Profile", noneSelected: "None selected", noneListed: "None listed", hours: "hours" },
  settings: {
    title: "Settings", description: "MVP configuration is managed through Supabase Auth, environment variables, and Row Level Security.",
    language: "Language Preference", languageHelp: "Choose the language used across the interface, AI Coach, protocols, and new lab analyses.",
    safetyTitle: "Medical Safety Boundary", safety: "XYVORAN OS provides educational wellness guidance only. It does not diagnose, prescribe, or replace licensed medical care.",
    update: "Update Onboarding"
  },
  pillars: { Metabolic: "Metabolic", Recovery: "Recovery", Longevity: "Longevity", Cognitive: "Cognitive", Beauty: "Beauty" },
  intensity: { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" }
} as const;

export type DictionaryShape<T> = { [K in keyof T]: T[K] extends string ? string : DictionaryShape<T[K]> };
export type Dictionary = DictionaryShape<typeof en>;
