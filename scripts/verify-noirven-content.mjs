import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const requireFromScript = createRequire(import.meta.url);
const dataFile = path.join(root, "src", "lib", "noirven-data.ts");

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
  { exports: commonJsModule.exports, module: commonJsModule, require: createTsRequire(dataFile), console },
  { filename: dataFile },
);

const { products, storyChapters, dailyProductSeeds } = commonJsModule.exports;
const failures = [];
const notes = [];

const forbiddenFiles = [
  ["Stripe checkout route", path.join(root, "src", "app", "api", "payments", "stripe", "checkout", "route.ts")],
  ["Stripe deposit route", path.join(root, "src", "app", "api", "payments", "stripe", "deposit", "route.ts")],
  ["Stripe webhook route", path.join(root, "src", "app", "api", "webhooks", "stripe", "route.ts")],
  ["Stripe integration", path.join(root, "src", "lib", "integrations", "stripe.ts")],
  ["Bid API route", path.join(root, "src", "app", "api", "auctions", "bid", "route.ts")],
];

const walletConnectFile = path.join(root, "src", "components", "ui", "wallet-connect-panel.tsx");
const productDetailFile = path.join(root, "src", "components", "sections", "product-detail.tsx");
const usdtRouteFile = path.join(root, "src", "app", "api", "payments", "usdt", "route.ts");
const envExampleFile = path.join(root, ".env.example");
const expectedBnbReceivingAddress = "0xbd00c3d12dB5840A403D2880039Cb1c86155F8cC";
const expectedBscUsdtContract = "0x55d398326f99059fF775485246999027B3197955";
const jewelryCategories = new Set(["ring", "necklace", "earring", "bracelet", "watch", "stud", "brooch"]);

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

forbiddenFiles.forEach(([label, file]) => {
  if (existsSync(file)) {
    fail(`${label} must be removed for direct USDT sale flow: ${path.relative(root, file)}`);
  }
});

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
if (packageJson.dependencies?.stripe || packageJson.devDependencies?.stripe) {
  fail("stripe package dependency must be removed");
}

const packageLockFile = path.join(root, "package-lock.json");
if (existsSync(packageLockFile)) {
  const lockSource = readFileSync(packageLockFile, "utf8");
  if (lockSource.includes('"node_modules/stripe"') || lockSource.includes('"stripe":')) {
    fail("package-lock still contains stripe");
  }
}

if (!existsSync(walletConnectFile)) {
  fail("wallet connect panel is missing for MetaMask and BNB Wallet");
} else {
  const walletConnectSource = readFileSync(walletConnectFile, "utf8");
  [
    "MetaMask",
    "BNB Wallet",
    "wallet_switchEthereumChain",
    "wallet_addEthereumChain",
    "eth_sendTransaction",
    "0x38",
    "walletAddress",
    "txHash",
    "type=\"hidden\"",
    expectedBscUsdtContract,
  ].forEach((needle) => {
    if (!walletConnectSource.includes(needle)) {
      fail(`wallet connect panel must include ${needle}`);
    }
  });
}

const productDetailSource = readFileSync(productDetailFile, "utf8");
if (!productDetailSource.includes("WalletConnectPanel")) {
  fail("product detail must render the wallet connect panel in the USDT payment form");
}

if (/Transaction Hash|交易哈希|TXID/.test(productDetailSource)) {
  fail("product detail must not render a visible transaction hash input");
}

[
  ["product detail receiving address", productDetailFile],
  ["USDT payment route receiving address", usdtRouteFile],
  ["environment example receiving address", envExampleFile],
].forEach(([label, file]) => {
  const fileSource = readFileSync(file, "utf8");
  if (!fileSource.includes(expectedBnbReceivingAddress)) {
    fail(`${label} must use the official BNB receiving address`);
  }
});

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

  if (product.startPrice < 18800 || product.startPrice > 188000) {
    fail(`${product.serial} startPrice must stay in 18800-188000 USD: ${product.startPrice}`);
  }

  if (product.currentPrice !== product.startPrice) {
    fail(`${product.serial} currentPrice must equal fixed direct-sale price: ${product.currentPrice}`);
  }

  if (product.bidIncrement !== 0) {
    fail(`${product.serial} bidIncrement must be 0 after removing bidding: ${product.bidIncrement}`);
  }

  if (product.depositAmount !== 0) {
    fail(`${product.serial} depositAmount must be 0 after removing deposits: ${product.depositAmount}`);
  }

  if (product.bids !== 0) {
    fail(`${product.serial} bids must be 0 after removing auction mode: ${product.bids}`);
  }

  if (typeof product.pricingBasis === "string" && product.pricingBasis.includes("1888-5999")) {
    fail(`${product.serial} pricingBasis still references the old MVP range`);
  }

  if (typeof product.pricingBasis === "string" && /18,800|188,000|现售区间|售价区间|price range/i.test(product.pricingBasis)) {
    fail(`${product.serial} pricingBasis must not display a public sale range`);
  }

  if (typeof product.pricingBasis === "string" && /竞购|竞拍|拍卖|保证金|加价/.test(product.pricingBasis)) {
    fail(`${product.serial} pricingBasis still references auction mechanics`);
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

  if (!jewelryCategories.has(product.category)) {
    fail(`${chapter.code} must map to one jewelry product category: ${chapter.productSerial}`);
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
notes.push(`${chapters.length} story chapters checked with one product and one jewelry category each`);
notes.push(`${productsWith360Fallback} products have a 360 display source`);

if (failures.length > 0) {
  console.error("Noirven catalog verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Noirven catalog verification passed.");
notes.forEach((note) => console.log(`- ${note}`));
