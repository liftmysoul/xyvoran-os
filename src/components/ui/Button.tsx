import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-emeraldx px-4 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-signal disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      {...props}
    />
  );
}
