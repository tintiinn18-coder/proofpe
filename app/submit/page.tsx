import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Startup",
  description: "List your startup on ProofPe with revenue, MRR, growth, and an optional proof screenshot.",
  alternates: { canonical: "/submit" }
};

export default function SubmitPage() {
  return (
    <section className="container-shell grid gap-10 py-14 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-mint">Submit startup</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
          List your startup like a real market asset.
        </h1>
        <p className="mt-5 text-lg leading-8 text-steel">
          Publish your revenue, MRR, growth, and listing intent. Add screenshot
          proof when available, then use your public profile to attract buyers,
          partners, and trust.
        </p>
      </div>
      <SubmitForm />
    </section>
  );
}
