import { StaticPage, pageMetadata } from "@/components/StaticPage";

export const metadata = pageMetadata("cookie");

export default function CookiePage() {
  return <StaticPage slug="cookie" eyebrow="Legale" />;
}
