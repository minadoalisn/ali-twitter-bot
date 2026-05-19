import Link from "next/link";
import { cn } from "@/lib/utils";

export function LinkButton({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-full border px-6 py-3 text-center text-[12px] font-medium uppercase tracking-[0.12em] transition sm:w-auto",
        variant === "dark" && "noir-primary-button",
        variant === "light" && "border-white/22 text-white hover:border-[var(--champagne)]",
        variant === "outline" && "border-black/16 text-black hover:border-[var(--champagne)]",
      )}
    >
      {children}
    </Link>
  );
}
