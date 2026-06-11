import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/Shell";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth/login");

  return <DashboardShell email={data.user.email}>{children}</DashboardShell>;
}
