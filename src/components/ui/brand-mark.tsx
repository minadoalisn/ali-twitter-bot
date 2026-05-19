import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  light?: boolean;
};

export function BrandMark({ href = "/", compact = false, light = false }: BrandMarkProps) {
  const content = (
    <span className="inline-flex flex-col items-center gap-2 leading-none">
      <span
        className={cn(
          "brand-wordmark text-[18px] text-current sm:text-[22px]",
          compact && "text-[14px] sm:text-[16px]",
        )}
      >
        NOIRVEN
      </span>
      <span className="flex items-center gap-3">
        <span className={cn("h-px w-8", light ? "bg-white/34" : "bg-black/20")} />
        <span className={cn("brand-cn text-[13px]", compact && "text-[11px]")}>诺梵</span>
        <span className={cn("h-px w-8", light ? "bg-white/34" : "bg-black/20")} />
      </span>
    </span>
  );

  return (
    <Link href={href} className="focus-ring inline-flex" aria-label="Noirven 诺梵 home">
      {content}
    </Link>
  );
}

export function NMark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border font-serif text-xl",
        light ? "border-white/18 text-white" : "border-black/10 text-black",
      )}
      aria-hidden="true"
    >
      N
    </span>
  );
}
