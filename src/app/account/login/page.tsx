import { AuthPage } from "@/components/sections/auth-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "账户登录",
  description: "Noirven 诺梵账户登录与注册。",
  path: "/account/login",
});

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthPage locale="zh" mode="account" nextPath={params?.next || "/account"} error={params?.error} />;
}
