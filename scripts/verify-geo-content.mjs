import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function expectIncludes(label, content, needles) {
  needles.forEach((needle) => {
    if (!content.includes(needle)) failures.push(`${label} missing ${JSON.stringify(needle)}`);
  });
}

const packageJson = read("package.json");
const guideData = read("src/lib/geo-guide-content.ts");
const guidePage = read("src/components/sections/geo-guide-page.tsx");
const zhRoute = read("src/app/guides/private-high-jewelry-buying/page.tsx");
const enRoute = read("src/app/en/guides/private-high-jewelry-buying/page.tsx");
const sitemap = read("src/app/sitemap.ts");
const footer = read("src/components/layout/site-footer.tsx");

expectIncludes("package scripts", packageJson, ["verify:geo"]);

expectIncludes("GEO guide data", guideData, [
  "geoQuestions",
  "communityAnswerDrafts",
  "private-high-jewelry-buying",
  "宝石级稀缺",
  "稀世珍宝",
  "保值",
  "USDT",
  "insured logistics",
  "gem-grade rarity",
  "long-horizon value",
]);

expectIncludes("GEO guide page", guidePage, [
  "FAQPage",
  "Article",
  "BreadcrumbList",
  "application/ld+json",
  "communityAnswerDrafts",
  "No automatic posting",
]);

expectIncludes("guide routes", `${zhRoute}\n${enRoute}`, [
  "createMetadata",
  "GeoGuidePage",
  "/guides/private-high-jewelry-buying",
  "/en/guides/private-high-jewelry-buying",
]);

expectIncludes("sitemap", sitemap, [
  "/guides/private-high-jewelry-buying",
]);

expectIncludes("footer", footer, [
  "/guides/private-high-jewelry-buying",
  "购买指南",
  "Buying Guide",
]);

if (/subreddit|reddit/i.test(guidePage) && /auto|bot|post/i.test(guidePage)) {
  failures.push("GEO page must not describe automated Reddit posting.");
}

if (failures.length > 0) {
  console.error("GEO content verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("GEO content verification passed.");
