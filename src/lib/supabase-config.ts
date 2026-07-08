const placeholderUrl = "https://placeholder.supabase.co";
const placeholderPublishableKey = "placeholder-publishable-key";

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || placeholderUrl;
}

export function getSupabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || placeholderPublishableKey;
}

export function getSupabaseAnonKey() {
  return getSupabasePublishableKey();
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabasePublishableKey() !== placeholderPublishableKey);
}

export function getSupabaseProjectRef() {
  try {
    return new URL(getSupabaseUrl()).hostname.split(".")[0] || "unknown";
  } catch {
    return "unknown";
  }
}

export function supabaseConfigMessage() {
  return "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart the dev server.";
}
