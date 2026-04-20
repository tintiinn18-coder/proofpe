import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Startup",
  description: "Submit your startup revenue, MRR, growth, and proof screenshot to ProofPe.",
  alternates: { canonical: "/submit" }
};

export default function SubmitPage() {
  return (
    <section className="container-shell grid gap-10 py-14 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-mint">Submit startup</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
          Show real traction with proof.
        </h1>
        <p className="mt-5 text-lg leading-8 text-steel">
          Upload a revenue screenshot, enter the numbers you want to publish,
          and get reviewed for the ProofPe leaderboard.
        </p>
      </div>
      <SubmitForm />
    </section>
  );
}
