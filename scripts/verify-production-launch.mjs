import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseUrl = process.env.NOIRVEN_PRODUCTION_URL || "https://nvonly.com";

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readStringField(block, field) {
  return block.match(new RegExp(`${field}:\\s*"([^"]+)"`))?.[1] ?? "";
}

function findBraceBlock(source, startIndex) {
  const openIndex = source.lastIndexOf("{", startIndex);
  if (openIndex < 0) return "";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, index + 1);
    }
  }

  return "";
}

function loadProductFromSource(serial) {
  const dataFile = path.join(root, "src", "lib", "noirven-data.ts");
  const source = readFileSync(dataFile, "utf8");
  const seedsIndex = source.indexOf("export const dailyProductSeeds");
  if (seedsIndex < 0) throw new Error("dailyProductSeeds export not found");

  const seedSource = source.slice(seedsIndex);
  const seedEndIndex = seedSource.indexOf("export const internalProductConceptSeeds");
  const seedListSource = seedEndIndex > 0 ? seedSource.slice(0, seedEndIndex) : seedSource;
  const products = [];
  const serialPattern = /serial:\s*"(N-\d+)"/g;
  let match = null;

  while ((match = serialPattern.exec(seedListSource))) {
    const block = findBraceBlock(seedListSource, match.index);
    const product = {
      serial: readStringField(block, "serial"),
      seriesId: readStringField(block, "seriesId"),
      image: readStringField(block, "image"),
    };

    if (product.serial && product.seriesId && product.image) {
      product.slug = `${product.seriesId}-${product.serial.toLowerCase()}`;
      products.push(product);
    }
  }

  const product =
    products.find((item) => item.serial === serial) ??
    (serial
      ? null
      : products
          .slice()
          .sort((left, right) => Number(right.serial.replace(/\D/g, "")) - Number(left.serial.replace(/\D/g, "")))[0]);

  if (!product) {
    throw new Error(`Product seed not found: ${serial || "latest"}`);
  }

  const chapterPattern = new RegExp(
    `\\{[\\s\\S]*?code:\\s*"([^"]+)"[\\s\\S]*?productSerial:\\s*"${escapeRegExp(product.serial)}"[\\s\\S]*?\\}`,
  );
  product.chapterCode = source.match(chapterPattern)?.[1] ?? "";
  return product;
}

const product = loadProductFromSource(argValue("serial"));
const imageFileName = product.image.split("/").pop();
const retries = Number(argValue("retries", "6"));
const delayMs = Number(argValue("delay-ms", "10000"));

const pages = [
  { name: "home", url: `${baseUrl}/`, requireStory: false },
  { name: "auctions", url: `${baseUrl}/auctions`, requireStory: false },
  { name: "story", url: `${baseUrl}/story`, requireStory: true },
  { name: "detail", url: `${baseUrl}/auctions/${product.slug}`, requireStory: false },
];

async function checkOnce() {
  const failures = [];
  const results = [];

  for (const page of pages) {
    const response = await fetch(page.url, { redirect: "follow" });
    const html = await response.text();
    const deploymentId = html.match(/data-dpl-id="([^"]+)"/)?.[1] ?? "";
    const checks = {
      statusOk: response.status === 200,
      hasSerial: html.includes(product.serial),
      hasImage: Boolean(imageFileName && html.includes(imageFileName)),
      has360: html.includes("360"),
      noPromptLeak: !/imagePrompt|ultra-clean studio render|no logo, no text/i.test(html),
      hasStory: !page.requireStory || Boolean(product.chapterCode && html.includes(product.chapterCode)),
    };

    Object.entries(checks).forEach(([key, passed]) => {
      if (!passed) failures.push(`${page.name} failed ${key}: ${page.url}`);
    });

    results.push({ page: page.name, url: page.url, status: response.status, deploymentId, ...checks });
  }

  return { failures, results };
}

let lastResult = null;
for (let attempt = 1; attempt <= retries; attempt += 1) {
  lastResult = await checkOnce();
  if (lastResult.failures.length === 0) {
    console.log("Noirven production verification passed.");
    console.log(JSON.stringify({ serial: product.serial, slug: product.slug, image: product.image, results: lastResult.results }, null, 2));
    process.exit(0);
  }

  if (attempt < retries) {
    console.error(`Production verification attempt ${attempt}/${retries} failed; retrying in ${delayMs}ms.`);
    lastResult.failures.forEach((failure) => console.error(`- ${failure}`));
    await sleep(delayMs);
  }
}

console.error("Noirven production verification failed.");
lastResult.failures.forEach((failure) => console.error(`- ${failure}`));
console.error(JSON.stringify({ serial: product.serial, slug: product.slug, image: product.image, results: lastResult.results }, null, 2));
process.exit(1);
