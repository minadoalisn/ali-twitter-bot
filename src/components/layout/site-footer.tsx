import Link from "next/link";
import { BrandMark, NMark } from "@/components/ui/brand-mark";
import { materialLibrary } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";

export function SiteFooter({ locale = "zh" }: { locale?: Locale }) {
  const prefix = locale === "en" ? "/en" : "";

  return (
    <footer className="noir-surface mt-24 border-t dark-hairline">
      <div className="section-shell grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div className="space-y-8">
          <BrandMark href={`${prefix}/`} compact light />
          <p className="max-w-md text-sm leading-7 text-white/62">
            {locale === "zh"
              ? "每件作品都有编号。尚未归属，它继续等待；一旦被确认，它从此只归一人。"
              : "Every work is numbered. If still awaiting belonging, it waits again. Once recognized, it belongs to one person only."}
          </p>
          <div className="flex items-center gap-3">
            <NMark light />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/54">N-0001 / One of One</span>
          </div>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/46">Materials</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[...materialLibrary.metals, ...materialLibrary.stones].map((item) => (
              <span key={item} className="border border-white/12 px-3 py-2 text-xs text-white/62">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/46">Paths</h2>
          <div className="mt-5 grid gap-3 text-sm text-white/66">
            <Link href={`${prefix}/auctions`}>{locale === "zh" ? "七日拍卖" : "Auctions"}</Link>
            <Link href={`${prefix}/series`}>{locale === "zh" ? "故事系列" : "Story Series"}</Link>
            <Link href={`${prefix}/sold`}>{locale === "zh" ? "已售档案" : "Archive"}</Link>
            <Link href={`${prefix}/admin`}>{locale === "zh" ? "后台入口" : "Admin"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
