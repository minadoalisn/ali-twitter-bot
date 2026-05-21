import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { adminMetrics, materialLibrary, storySeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";

export function AdminPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main className="section-shell py-20">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Noirven Admin</p>
          <form action="/api/auth/logout" method="post">
            <input type="hidden" name="next" value={locale === "zh" ? "/admin/login" : "/en/admin/login"} />
            <button className="focus-ring rounded-full border border-black/14 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:border-[var(--champagne)]">
              {locale === "zh" ? "退出后台" : "Sign Out"}
            </button>
          </form>
        </div>
        <h1 className="mt-5 max-w-4xl font-serif text-6xl font-normal leading-tight">
          {locale === "zh" ? "后台以故事线、作品编号和支付审计为核心。" : "Admin is organized by storylines, serials, and payment audit."}
        </h1>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {adminMetrics.map((metric) => (
            <section key={metric.label} className="border-t border-black/12 pt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{metric.label}</p>
              <p className="mt-3 font-mono text-3xl">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">{metric.detail}</p>
            </section>
          ))}
        </div>
        <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-3xl">{locale === "zh" ? "生成式设计工作流" : "Generative Design Workflow"}</h2>
            <ol className="mt-6 space-y-4 text-sm leading-7 text-[var(--graphite)]">
              <li>01. {locale === "zh" ? "选择故事系列、品类、材质和灵感词。" : "Choose story series, category, materials, and inspiration."}</li>
              <li>02. {locale === "zh" ? "组合 Story Lock、Style Lock 和禁止仿牌规则。" : "Combine Story Lock, Style Lock, and anti-imitation rules."}</li>
              <li>03. {locale === "zh" ? "生成四张概念图，管理员精选一张。" : "Generate four concepts and curate one."}</li>
              <li>04. {locale === "zh" ? "生成标题、编号、SEO 描述，进入七日归属。" : "Create title, serial, SEO copy, and start the seven-day belonging window."}</li>
            </ol>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-3xl">{locale === "zh" ? "物料库" : "Material Library"}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {[...materialLibrary.metals, ...materialLibrary.stones, ...materialLibrary.craft].map((item) => (
                <span key={item} className="border border-black/10 px-3 py-2 text-xs text-[var(--graphite)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-16 border-t border-black/12 pt-6">
          <h2 className="text-3xl">{locale === "zh" ? "故事线管理" : "Storyline Management"}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {storySeries.map((series) => (
              <div key={series.id} className="border border-black/10 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">{series.name}</p>
                <h3 className="mt-3 text-2xl">{series.zhName}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{series.ipHook}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
