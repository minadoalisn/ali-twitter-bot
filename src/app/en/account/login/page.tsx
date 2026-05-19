import { AuthPage } from "@/components/sections/auth-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Account Login",
  description: "Noirven account sign in and registration.",
  path: "/en/account/login",
});

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthPage locale="en" mode="account" nextPath={params?.next || "/en/account"} error={params?.error} />;
}
