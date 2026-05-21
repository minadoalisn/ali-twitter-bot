import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function expectIncludes(label, content, needles) {
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failures.push(`${label} is missing ${JSON.stringify(needle)}`);
    }
  }
}

const zhAdminPage = read("src/app/admin/page.tsx");
const enAdminPage = read("src/app/en/admin/page.tsx");
const adminComponent = read("src/components/sections/admin-page.tsx");

expectIncludes("Chinese admin route", zhAdminPage, [
  "cookies",
  "redirect",
  "AUTH_COOKIE",
  "verifySessionToken",
  'session?.role !== "admin"',
  "/admin/login?next=%2Fadmin",
]);

expectIncludes("English admin route", enAdminPage, [
  "cookies",
  "redirect",
  "AUTH_COOKIE",
  "verifySessionToken",
  'session?.role !== "admin"',
  "/en/admin/login?next=%2Fen%2Fadmin",
]);

expectIncludes("Admin dashboard", adminComponent, [
  "adminOrders",
  "paymentStatus",
  "reviewStatus",
  "deliveryStatus",
  "permissionMatrix",
  "Order Review",
  "Payment Proofs",
  "Manual Approval",
  "Delivery",
  "Permissions",
  "订单查看",
  "支付数据",
  "人工审核",
  "发货管理",
  "权限控制",
]);

if (failures.length > 0) {
  console.error("Admin security verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Admin security verification passed.");
