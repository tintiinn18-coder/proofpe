import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions about ProofPe submissions, proof uploads, verification, and rankings.",
  alternates: { canonical: "/faq" }
};

const faqs = [
  ["Who can submit?", "Any Indian startup founder or authorized team member can submit a startup profile."],
  ["What counts as proof?", "A screenshot from a payment gateway, billing system, bank statement view, or internal revenue dashboard can be uploaded for review."],
  ["What does Proof Uploaded mean?", "The startup uploaded a proof screenshot, but the ProofPe admin team has not marked it verified yet."],
  ["Can I connect Razorpay?", "Razorpay connect is planned for v2. The MVP supports screenshot uploads only."],
  ["Is this investment advice?", "No. ProofPe is for discovery and transparency, not investment advice."]
];

export default function FAQPage() {
  return (
    <section className="container-shell py-14">
      <p className="text-sm font-black uppercase tracking-wide text-mint">FAQ</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Straight answers.</h1>
      <div className="mt-10 grid gap-4">
        {faqs.map(([question, answer]) => (
          <div key={question} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">{question}</h2>
            <p className="mt-3 leading-7 text-steel">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
