import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const requireFromScript = createRequire(import.meta.url);
const dataFile = path.join(root, "src", "lib", "noirven-data.ts");
const source = readFileSync(dataFile, "utf8");
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
  { exports: commonJsModule.exports, module: commonJsModule, require: requireFromScript, console },
  { filename: dataFile },
);

const { products, storyChapters, dailyProductSeeds } = commonJsModule.exports;
const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label} is not an array`);
    return [];
  }

  return value;
}

function checkUnique(items, label, keyFn) {
  const seen = new Map();

  items.forEach((item) => {
    const key = keyFn(item);
    if (!key) {
      fail(`${label} has an empty key`);
      return;
    }

    const existing = seen.get(key);
    if (existing) {
      fail(`${label} duplicate: ${key}`);
    } else {
      seen.set(key, item);
    }
  });
}

function publicPathFromImage(image) {
  if (typeof image !== "string" || !image.startsWith("/")) return null;
  return path.join(root, "public", image.replace(/^\//, ""));
}

const allProducts = assertArray(products, "products");
const chapters = assertArray(storyChapters, "storyChapters");
const seeds = assertArray(dailyProductSeeds, "dailyProductSeeds");

checkUnique(allProducts, "product serial", (product) => product.serial);
checkUnique(allProducts, "product slug", (product) => product.slug);
checkUnique(allProducts, "product id", (product) => product.id);
checkUnique(allProducts, "product image path", (product) => product.image);
checkUnique(allProducts, "Chinese product title", (product) => product.zhTitle);
checkUnique(seeds, "seed serial", (seed) => seed.serial);
checkUnique(seeds, "seed image path", (seed) => seed.image);
checkUnique(chapters, "story chapter productSerial", (chapter) => chapter.productSerial);

const productBySerial = new Map(allProducts.map((product) => [product.serial, product]));

allProducts.forEach((product) => {
  const imagePath = publicPathFromImage(product.image);
  if (!imagePath || !existsSync(imagePath)) {
    fail(`${product.serial} image is missing: ${product.image}`);
  }

  if (product.startPrice < 1888 || product.startPrice > 5999) {
    fail(`${product.serial} startPrice must stay in 1888-5999 USD: ${product.startPrice}`);
  }

  if (!product.image && !product.spinVideo) {
    fail(`${product.serial} has no image or 360 source`);
  }
});

chapters.forEach((chapter) => {
  if (!chapter.productSerial) {
    fail(`${chapter.code} has no productSerial`);
    return;
  }

  const product = productBySerial.get(chapter.productSerial);
  if (!product) {
    fail(`${chapter.code} points to missing product ${chapter.productSerial}`);
    return;
  }

  if (product.seriesId !== chapter.seriesId) {
    fail(`${chapter.code} series mismatch: story=${chapter.seriesId}, product=${product.seriesId}`);
  }

  const imagePath = publicPathFromImage(product.image);
  if (!imagePath || !existsSync(imagePath)) {
    fail(`${chapter.code} product has no existing image: ${chapter.productSerial}`);
  }
});

const hashByDigest = new Map();
allProducts.forEach((product) => {
  const imagePath = publicPathFromImage(product.image);
  if (!imagePath || !existsSync(imagePath)) return;

  const digest = createHash("sha256").update(readFileSync(imagePath)).digest("hex");
  const existing = hashByDigest.get(digest);
  if (existing) {
    fail(`duplicate image file content: ${existing.serial} and ${product.serial}`);
  } else {
    hashByDigest.set(digest, product);
  }
});

const productsWith360Fallback = allProducts.filter((product) => product.image || product.spinVideo).length;
notes.push(`${allProducts.length} products checked`);
notes.push(`${chapters.length} story chapters checked`);
notes.push(`${productsWith360Fallback} products have a 360 display source`);

if (failures.length > 0) {
  console.error("Noirven catalog verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Noirven catalog verification passed.");
notes.forEach((note) => console.log(`- ${note}`));
