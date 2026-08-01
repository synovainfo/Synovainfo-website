import { TechnicalWhitepaper } from "@/components/sections/technical-whitepaper";

export const metadata = {
  title: "Enterprise Architecture & Security | Synova Infotech",
  description: "Explore the rigorous technical standards, compliance mandates (SOC2, GDPR), and architectural patterns that power Synova Infotech's most resilient solutions.",
};

export default function ArchitecturePage() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden pt-20">
      <TechnicalWhitepaper />
    </main>
  );
}
