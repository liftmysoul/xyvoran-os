import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-emeraldx bg-emeraldx px-4 py-2.5 text-sm font-semibold text-obsidian shadow-[0_0_22px_rgba(0,245,212,0.12)] transition hover:border-signal hover:bg-signal disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      {...props}
    />
  );
}
