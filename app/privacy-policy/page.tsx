import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ProofPe privacy policy for founder submitted startup data and proof uploads.",
  alternates: { canonical: "/privacy-policy" }
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-shell py-14">
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Privacy Policy</h1>
      <div className="mt-8 max-w-3xl space-y-5 leading-8 text-steel">
        <p>
          ProofPe collects founder submitted startup data, contact details, proof
          screenshots, and operational metadata needed to review and publish
          profiles.
        </p>
        <p>
          Public profile data may include startup name, founder name, website,
          category, city, revenue, MRR, growth, and verification status. Proof
          files are used for internal verification and should not include
          sensitive information beyond what is needed for review.
        </p>
        <p>
          Verification is an internal process. ProofPe may approve, reject, edit,
          feature, or remove submissions to keep the leaderboard trustworthy.
        </p>
        <p>
          To request changes or removal, contact support@proofpe.com.
        </p>
      </div>
    </section>
  );
}
