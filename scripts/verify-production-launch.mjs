import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const requireFromScript = createRequire(import.meta.url);
const baseUrl = process.env.NOIRVEN_PRODUCTION_URL || "https://nvonly.com";

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function loadTsModule(file) {
  const source = readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const commonJsModule = { exports: {} };
  vm.runInNewContext(
    compiled,
    { exports: commonJsModule.exports, module: commonJsModule, require: createTsRequire(file), console },
    { filename: file },
  );
  return commonJsModule.exports;
}

function createTsRequire(fromFile) {
  return (id) => {
    if (id.startsWith("@/")) {
      return loadTsModule(path.join(root, "src", `${id.slice(2)}.ts`));
    }

    if (id.startsWith(".")) {
      return loadTsModule(path.join(path.dirname(fromFile), `${id}.ts`));
    }

    return requireFromScript(id);
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const dataFile = path.join(root, "src", "lib", "noirven-data.ts");
const { products, storyChapters } = loadTsModule(dataFile);
const requestedSerial = argValue("serial");
const product = requestedSerial ? products.find((item) => item.serial === requestedSerial) : products[0];

if (!product) {
  console.error(`No product found for serial: ${requestedSerial || "latest"}`);
  process.exit(1);
}

const chapter = storyChapters.find((item) => item.productSerial === product.serial);
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
      hasStory: !page.requireStory || Boolean(chapter && new RegExp(escapeRegExp(chapter.code)).test(html)),
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
