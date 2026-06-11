export const ageGateCookieName = "xyvoran_age_status";
export const ageConfirmedValue = "confirmed_21_plus";
export const ageDeniedValue = "under_21";

export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
