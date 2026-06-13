import type { HTMLAttributes } from "react";
import { cn } from "@/lib/format";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass overflow-hidden rounded-md p-5 shadow-glow", className)} {...props} />;
}
