import type { MemberConsent, MembershipStatus, OnboardingData, Profile } from "@/types/database";

export function calculateAge(dateOfBirth: string, today = new Date()) {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function isAtLeast21(dateOfBirth: string, today = new Date()) {
  const age = calculateAge(dateOfBirth, today);
  return age !== null && age >= 21;
}

export function maximumMemberBirthDate(today = new Date()) {
  const cutoff = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
  return cutoff.toISOString().slice(0, 10);
}

export type ProfileCompletionResult = {
  score: number;
  completedWeight: number;
  sections: Array<{ key: string; weight: number; complete: boolean }>;
};

export function calculateProfileCompletion(args: {
  profile: Profile | null;
  onboarding: OnboardingData | null;
  consent: MemberConsent | null;
  hasLabData: boolean;
  hasProtocols: boolean;
}): ProfileCompletionResult {
  const { profile, onboarding, consent, hasLabData, hasProtocols } = args;
  const hasAddress = Boolean(profile?.address_line && profile.city && profile.state_province && profile.country);
  const hasHealthMetrics = Boolean(onboarding?.disclaimer_confirmed && onboarding.height_cm && onboarding.weight_kg && onboarding.main_goal);
  const sections = [
    { key: "name", weight: 10, complete: Boolean(profile?.first_name && profile.last_name) },
    { key: "phone", weight: 10, complete: Boolean(profile?.phone_number) },
    { key: "dob", weight: 10, complete: Boolean(profile?.date_of_birth && consent?.age_certified_at) },
    { key: "address", weight: 10, complete: hasAddress },
    { key: "healthMetrics", weight: 20, complete: hasHealthMetrics },
    { key: "labData", weight: 20, complete: hasLabData },
    { key: "protocols", weight: 20, complete: hasProtocols }
  ];
  const completedWeight = sections.reduce((total, section) => total + (section.complete ? section.weight : 0), 0);
  return { score: completedWeight, completedWeight, sections };
}

export function membershipStatusTone(status: MembershipStatus) {
  if (status === "active") return "border-emeraldx/30 bg-emeraldx/10 text-emeraldx";
  if (status === "suspended") return "border-rose-300/30 bg-rose-300/10 text-rose-200";
  if (status === "expired") return "border-white/15 bg-white/5 text-chrome";
  return "border-amber-300/30 bg-amber-300/10 text-amber-200";
}
