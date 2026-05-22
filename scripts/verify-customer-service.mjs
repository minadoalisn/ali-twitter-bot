import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }

  return fs.readFileSync(fullPath, "utf8");
}

function expectIncludes(label, content, needles) {
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failures.push(`${label} is missing ${JSON.stringify(needle)}`);
    }
  }
}

const packageJson = read("package.json");
const header = read("src/components/layout/site-header.tsx");
const widget = read("src/components/ui/customer-service-widget.tsx");
const inquiryRoute = read("src/app/api/inquiries/route.ts");
const inquiriesLib = read("src/lib/inquiries.ts");
const schemas = read("src/lib/schemas.ts");
const adminPage = read("src/app/admin/page.tsx");
const enAdminPage = read("src/app/en/admin/page.tsx");
const adminComponent = read("src/components/sections/admin-page.tsx");
const supabaseSchema = read("supabase/schema.sql");

expectIncludes("package scripts", packageJson, ["verify:customer-service"]);

expectIncludes("site header", header, ["CustomerServiceWidget", "<CustomerServiceWidget locale={locale} />"]);

expectIncludes("customer service widget", widget, [
  '"use client"',
  "在线客服",
  "Luxury Concierge",
  "fetch(\"/api/inquiries\"",
  "contactChannel",
  "productSerial",
  "message",
]);

expectIncludes("inquiry route", inquiryRoute, [
  "customerInquirySchema",
  "createCustomerInquiry",
  "requireAdminSession",
  "export async function POST",
  "export async function GET",
]);

expectIncludes("inquiries library", inquiriesLib, [
  "customer_inquiries",
  "createCustomerInquiry",
  "getRecentCustomerInquiries",
  "getSupabaseAdmin",
]);

expectIncludes("schemas", schemas, ["customerInquirySchema", "contactChannel", "budgetUsd", "message"]);

expectIncludes("admin routes", `${adminPage}\n${enAdminPage}`, ["getRecentCustomerInquiries", "inquiryInbox"]);

expectIncludes("admin dashboard", adminComponent, [
  "inquiryInbox",
  "询盘管理",
  "Concierge Inquiries",
  "contact_channel",
  "product_serial",
  "message",
]);

expectIncludes("supabase schema", supabaseSchema, [
  "customer_inquiries",
  "contact_channel",
  "product_serial",
  "budget_usd",
  "inquiry_status",
]);

if (failures.length > 0) {
  console.error("Customer service verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Customer service verification passed.");
