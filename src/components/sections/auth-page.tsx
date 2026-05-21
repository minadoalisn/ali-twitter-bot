import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/types";

type AuthPageProps = {
  locale?: Locale;
  mode: "admin" | "account";
  nextPath: string;
  error?: string;
};

const errorCopy: Record<string, { zh: string; en: string }> = {
  invalid: {
    zh: "账号或密码不正确。",
    en: "The account or password is incorrect.",
  },
  config: {
    zh: "登录服务尚未配置，请先配置 Vercel 环境变量。",
    en: "Auth is not configured. Set the Vercel environment variables first.",
  },
  auth: {
    zh: "请先登录后继续。",
    en: "Please sign in before continuing.",
  },
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">{label}</span>
      <input
        className="mt-3 h-12 w-full border border-black/14 bg-transparent px-4 text-sm outline-none transition focus:border-[var(--champagne)]"
        name={name}
        type={type}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="noir-primary-button focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-full border px-6 py-3 text-center text-[12px] font-medium uppercase tracking-[0.12em] transition">
      {children}
    </button>
  );
}

export function AuthPage({ locale = "zh", mode, nextPath, error }: AuthPageProps) {
  const message = error ? errorCopy[error]?.[locale] : "";
  const isAdmin = mode === "admin";
  const prefix = locale === "en" ? "/en" : "";

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main className="section-shell grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
            {isAdmin ? "Noirven Admin" : "Collector Account"}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-normal leading-tight sm:text-6xl">
            {isAdmin
              ? locale === "zh"
                ? "管理员登录后，才能进入后台。"
                : "Admin access requires a password."
              : locale === "zh"
                ? "登录后，才能出价、支付与查看订单。"
                : "Sign in to bid, pay, and view orders."}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--graphite)]">
            {isAdmin
              ? locale === "zh"
                ? "后台入口已改为服务端权限保护，不再公开展示管理界面。"
                : "The admin area is now protected by server-side session checks."
              : locale === "zh"
                ? "作品浏览可以公开，涉及账户、保证金、支付、订单的操作需要登录。"
                : "Auction browsing stays public; account, deposit, payment, and order actions require authentication."}
          </p>
          {message ? <p className="mt-6 border border-[var(--signature-red)]/30 px-4 py-3 text-sm text-[var(--signature-red)]">{message}</p> : null}
        </section>

        {isAdmin ? (
          <section className="border-t border-black/12 pt-6">
            <h2 className="text-2xl">{locale === "zh" ? "后台登录" : "Admin Login"}</h2>
            <form className="mt-8 grid gap-5" action="/api/auth/admin/login" method="post">
              <input type="hidden" name="next" value={nextPath} />
              <Field label={locale === "zh" ? "管理员账号" : "Username"} name="username" autoComplete="username" />
              <Field label={locale === "zh" ? "管理员密码" : "Password"} name="password" type="password" autoComplete="current-password" minLength={8} />
              <SubmitButton>{locale === "zh" ? "进入后台" : "Enter Admin"}</SubmitButton>
            </form>
          </section>
        ) : (
          <div className="grid gap-8">
            <section className="border-t border-black/12 pt-6">
              <h2 className="text-2xl">{locale === "zh" ? "登录账户" : "Sign In"}</h2>
              <form className="mt-8 grid gap-5" action="/api/auth/user/login" method="post">
                <input type="hidden" name="next" value={nextPath} />
                <Field label={locale === "zh" ? "邮箱" : "Email"} name="email" type="email" autoComplete="email" />
                <Field label={locale === "zh" ? "密码" : "Password"} name="password" type="password" autoComplete="current-password" minLength={8} />
                <SubmitButton>{locale === "zh" ? "登录" : "Sign In"}</SubmitButton>
              </form>
            </section>
            <section className="border-t border-black/12 pt-6">
              <h2 className="text-2xl">{locale === "zh" ? "注册新账户" : "Create Account"}</h2>
              <form className="mt-8 grid gap-5" action="/api/auth/user/register" method="post">
                <input type="hidden" name="next" value={nextPath} />
                <Field label={locale === "zh" ? "公开昵称" : "Nickname"} name="nickname" autoComplete="nickname" minLength={2} />
                <Field label={locale === "zh" ? "邮箱" : "Email"} name="email" type="email" autoComplete="email" />
                <Field label={locale === "zh" ? "密码" : "Password"} name="password" type="password" autoComplete="new-password" minLength={8} />
                <SubmitButton>{locale === "zh" ? "注册并进入" : "Register"}</SubmitButton>
              </form>
            </section>
          </div>
        )}
      </main>
      <div className="section-shell">
        <Link className="text-sm text-[var(--graphite)] underline" href={`${prefix}/`}>
          {locale === "zh" ? "返回首页" : "Back to home"}
        </Link>
      </div>
      <SiteFooter locale={locale} />
    </div>
  );
}
