import { StaticPage, pageMetadata } from "@/components/StaticPage";

export const metadata = pageMetadata("privacy");

export default function PrivacyPage() {
  return <StaticPage slug="privacy" eyebrow="Legale" />;
}
