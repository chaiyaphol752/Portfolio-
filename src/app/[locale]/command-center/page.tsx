import { resolveLocale } from "@/lib/locale";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return <section className="container-page section"><h1 className="h1">command-center ({locale})</h1></section>;
}
