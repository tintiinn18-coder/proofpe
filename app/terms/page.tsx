import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "ProofPe terms for founder submitted data, verification, and use of the leaderboard.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <section className="container-shell py-14">
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Terms</h1>
      <div className="mt-8 max-w-3xl space-y-5 leading-8 text-steel">
        <p>
          By submitting a startup, you confirm that you are authorized to share
          the submitted data and proof materials with ProofPe for review and
          publication.
        </p>
        <p>
          Data is founder submitted. ProofPe may run an internal verification
          process, but published information should not be treated as audited
          financial statements.
        </p>
        <p>
          ProofPe is not investment advice, legal advice, tax advice, or a
          fundraising platform. Users should do their own due diligence.
        </p>
        <p>
          ProofPe may reject, hide, edit, or delete profiles that appear false,
          misleading, unauthorized, or harmful to the integrity of the platform.
        </p>
      </div>
    </section>
  );
}
