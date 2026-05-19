import { AuthPage } from "@/components/sections/auth-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Login",
  description: "Noirven admin login.",
  path: "/en/admin/login",
});

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthPage locale="en" mode="admin" nextPath={params?.next || "/en/admin"} error={params?.error} />;
}
