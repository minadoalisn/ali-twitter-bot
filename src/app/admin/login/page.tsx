import { AuthPage } from "@/components/sections/auth-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "管理员登录",
  description: "Noirven 诺梵后台登录。",
  path: "/admin/login",
});

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthPage locale="zh" mode="admin" nextPath={params?.next || "/admin"} error={params?.error} />;
}
