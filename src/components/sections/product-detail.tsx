import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { Product360Viewer } from "@/components/ui/product-360-viewer";
import { WalletConnectPanel } from "@/components/ui/wallet-connect-panel";
import { categoryLabel, formatCurrency, formatDate } from "@/lib/format";
import {
  localizedPricingBasis,
  localizedProductConcept,
  localizedProductEngraving,
  localizedProductInspiration,
  localizedProductSizing,
  localizedProductTitle,
  localizedSeries,
  localizedTerms,
} from "@/lib/localized-content";
import { getProduct, getSeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/lib/i18n";
import type { AuthSession } from "@/lib/auth";

const defaultReceivingAddress = "0xbd00c3d12dB5840A403D2880039Cb1c86155F8cC";

type ProductDetailProps = {
  slug: string;
  locale?: Locale;
  paymentStatus?: string;
  expectedAmount?: string;
  session?: Pick<AuthSession, "email" | "nickname" | "role"> | null;
};

function paymentMessage(locale: Locale, status?: string, expectedAmount?: string) {
  if (!status) return "";

  const expected = expectedAmount ? formatCurrency(Number(expectedAmount)) : "";
  const copy: Record<string, { zh: string; en: string }> = {
    auth: {
      zh: "请先登录或注册，再提交 USDT 付款凭证。",
      en: "Please sign in or create an account before submitting a USDT payment proof.",
    },
    invalid: {
      zh: "付款凭证信息不完整，请先通过钱包完成 BEP-20 USDT 转账。",
      en: "Payment proof is incomplete. Complete the BEP-20 USDT wallet transfer first.",
    },
    missing: {
      zh: "没有找到对应作品，请从顶奢作品页重新进入。",
      en: "The work was not found. Please enter again from the collection page.",
    },
    sold: {
      zh: "此件已归属，不能继续提交付款。",
      en: "This work already belongs to someone and cannot receive another payment proof.",
    },
    amount: {
      zh: `付款金额必须等于顶奢定价${expected ? `：${expected}` : "。"}。`,
      en: `Payment amount must match the ultra-luxury fixed price${expected ? `: ${expected}` : "."}`,
    },
    usdt_submitted: {
      zh: "付款凭证已提交。后台确认到账后，将登记拥有者并安排发货。",
      en: "Payment proof submitted. After manual confirmation, ownership and delivery will be registered.",
    },
  };

  return copy[status]?.[locale] || "";
}

export function ProductDetail({ slug, locale = "zh", paymentStatus, expectedAmount, session }: ProductDetailProps) {
  const product = getProduct(slug);
  if (!product) notFound();
  const rawSeries = getSeries(product.seriesId);
  const series = rawSeries ? localizedSeries(rawSeries, locale) : null;
  const productPath = withLocale(locale, `/auctions/${product.slug}`);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const pageUrl = `${baseUrl}${productPath}`;
  const imageUrl = product.image.startsWith("/") ? `${baseUrl}${product.image}` : product.image;
  const localizedTitle = localizedProductTitle(product, locale);
  const productName = `${localizedTitle} ${product.serial}`;
  const productDescription = localizedProductConcept(product, locale) || localizedProductInspiration(product, locale);
  const productMaterials = localizedTerms(product.materials, locale);
  const productCraft = localizedTerms(product.craft, locale);
  const productSizing = localizedProductSizing(product, locale);
  const productEngraving = localizedProductEngraving(product, locale);
  const productPricingBasis = localizedPricingBasis(product.pricingBasis, locale);
  const receivingAddress = process.env.BNB_USDT_RECEIVING_ADDRESS || defaultReceivingAddress;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    image: [imageUrl],
    sku: product.serial,
    brand: { "@type": "Brand", name: "Noirven" },
    category: categoryLabel(product.category, locale),
    material: productMaterials.join(" / "),
    url: pageUrl,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "USD",
      price: String(product.currentPrice),
      availability: product.status === "sold" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  } as const;
  const notice = paymentMessage(locale, paymentStatus, expectedAmount);
  const loginHref = `${withLocale(locale, "/account/login")}?error=auth&next=${encodeURIComponent(productPath)}`;

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
            <Image src={product.image} alt={`${product.serial} ${localizedTitle}`} fill priority className="object-cover" />
            <Product360Viewer
              image={product.image}
              title={localizedTitle}
              serial={product.serial}
              spinVideo={product.spinVideo}
              locale={locale}
            />
          </div>
          <div className="lg:pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
              {product.serial} / {series?.name} / {categoryLabel(product.category, locale)}
            </p>
            <h1 className="mt-5 font-serif text-6xl font-normal leading-tight">{localizedTitle}</h1>
            <p className="mt-6 text-xl leading-9 text-[var(--graphite)]">{localizedProductInspiration(product, locale)}</p>
            <div className="mt-10 grid grid-cols-2 gap-4 border-y border-black/10 py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "顶奢定价" : "Ultra-Luxury Price"}</p>
                <p className="mt-2 font-mono text-2xl">{formatCurrency(product.currentPrice)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "收款网络" : "Network"}</p>
                <p className="mt-2 text-sm leading-7">BNB Smart Chain / BEP-20 USDT</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "确认方式" : "Confirmation"}</p>
                <p className="mt-2 text-sm leading-7">{locale === "zh" ? "后台人工确认到账" : "Manual admin review"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "归属状态" : "Status"}</p>
                <p className="mt-2 text-sm leading-7">
                  {product.status === "sold" ? (locale === "zh" ? `已归于 ${product.ownerNickname}` : `Belongs to ${product.ownerNickname}`) : locale === "zh" ? "等待确认" : "Available"}
                </p>
              </div>
            </div>
            <p className="mt-8 text-base leading-8 text-[var(--graphite)]">{productDescription}</p>
            {notice ? (
              <p className="mt-6 border border-[var(--signature-red)]/30 px-4 py-3 text-sm leading-6 text-[var(--signature-red)]">
                {notice}
              </p>
            ) : null}
            {product.status === "sold" ? (
              <div className="mt-8 border-y border-black/12 py-6">
                <p className="text-sm leading-7 text-[var(--graphite)]">
                  {locale === "zh"
                    ? `此件已完成归属登记，拥有者：${product.ownerNickname}。仍可浏览材质、故事与唯一刻印档案。`
                    : `This work has completed ownership registration for ${product.ownerNickname}. Materials, story, and engraving remain visible.`}
                </p>
              </div>
            ) : !session ? (
              <div className="mt-8 border-y border-black/12 py-6">
                <p className="text-sm leading-7 text-[var(--graphite)]">
                  {locale === "zh"
                    ? "登录或注册后可提交 USDT 付款凭证。后台确认到账后，作品会显示你的拥有者昵称并进入发货流程。"
                    : "Sign in or create an account to submit a USDT payment proof. After manual confirmation, ownership and delivery will be registered."}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <LinkButton href={loginHref}>{locale === "zh" ? "登录/注册后购买" : "Sign In To Purchase"}</LinkButton>
                  <p className="text-xs leading-6 text-[var(--ash)]">
                    {locale === "zh"
                      ? "作品浏览保持公开；付款凭证、订单与发货只对登录用户开放。"
                      : "Browsing stays public; payment proofs, orders, and delivery require an account."}
                  </p>
                </div>
              </div>
            ) : (
              <form className="mt-8 border-y border-black/12 py-6" action="/api/payments/usdt" method="post">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="amountUsd" value={product.currentPrice} />
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="returnPath" value={productPath} />
                <p className="mb-5 text-xs leading-6 text-[var(--ash)]">
                  {locale === "zh"
                    ? `已登录为 ${session.email || session.nickname || "Private Collector"}。请按顶奢定价支付 USDT；钱包返回链上凭证后，系统会自动写入后台确认表单。`
                    : `Signed in as ${session.email || session.nickname || "Private Collector"}. Pay the ultra-luxury fixed price in USDT; the wallet proof is added to the admin review form automatically.`}
                </p>
                <div className="mb-5 border border-black/12 bg-[var(--ivory)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                    {locale === "zh" ? "收款地址 / BEP-20 USDT" : "Receiving Address / BEP-20 USDT"}
                  </p>
                  <p className="mt-3 break-all font-mono text-sm text-black">{receivingAddress}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">
                    {locale === "zh"
                      ? `应付金额：${formatCurrency(product.currentPrice)}，按 1 USD = 1 USDT 提交。点击下方钱包按钮会切换到 BNB Smart Chain，并发起 BEP-20 USDT 转账。`
                      : `Amount due: ${formatCurrency(product.currentPrice)}, submitted as 1 USD = 1 USDT. The wallet button switches to BNB Smart Chain and starts a BEP-20 USDT transfer.`}
                  </p>
                </div>
                <div>
                  <WalletConnectPanel locale={locale} amountUsd={product.currentPrice} receivingAddress={receivingAddress} />
                </div>
                <div className="mt-5 flex flex-col gap-3 text-sm leading-6 text-[var(--graphite)] sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    {locale === "zh"
                      ? "后台确认到账后，这件作品会显示拥有者并进入订单发货。"
                      : "After admin confirms receipt, this work will show its owner and move to delivery."}
                  </p>
                  <button className="noir-primary-button focus-ring inline-flex min-h-11 items-center justify-center rounded-full border px-6 py-3 text-center text-[12px] font-medium uppercase tracking-[0.12em] transition">
                    {locale === "zh" ? "提交付款凭证" : "Submit Proof"}
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={withLocale(locale, "/story")} variant="outline">
                {locale === "zh" ? "理解故事线" : "Read Story"}
              </LinkButton>
            </div>
          </div>
        </section>
        <section className="section-shell grid gap-10 pb-24 md:grid-cols-3">
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "材质" : "Materials"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{productMaterials.join(" / ")}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "工艺" : "Craft"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{productCraft.join(" / ")}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "归属规则" : "Belonging Rule"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">
              {product.status === "sold"
                ? `${locale === "zh" ? "此件已归于" : "Belongs to"} ${product.ownerNickname} / ${formatDate(product.soldAt ?? product.endsAt)}`
                : locale === "zh"
                  ? "顶奢定价直接出售。收到 USDT 并经后台确认后，作品只登记给一位主人，不复制、不复刻。"
                  : "Sold at an ultra-luxury fixed price. After USDT receipt is manually confirmed, the work is registered to one owner only and is never reproduced."}
            </p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "可调节规格" : "Adjustable Fit"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{productSizing}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "唯一刻印" : "Unique Engraving"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{productEngraving}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "定价依据" : "Pricing Basis"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{productPricingBasis}</p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
