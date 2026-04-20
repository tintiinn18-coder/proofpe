import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "ProofPe brings proof-based transparency to Indian startup discovery.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <section className="container-shell py-14">
      <p className="text-sm font-black uppercase tracking-wide text-mint">About</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Proof-based transparency for Indian startups.
      </h1>
      <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-steel">
        <p>
          ProofPe helps founders publicly show revenue with proof signals so
          customers, partners, operators, and talent can discover real traction.
        </p>
        <p>
          Every profile starts with founder submitted data. Verification is an
          internal review process that checks uploaded proof before a startup is
          marked verified.
        </p>
        <p>
          ProofPe is not a fundraising platform, ratings agency, or investment
          adviser. It is a transparency layer for startup discovery.
        </p>
      </div>
    </section>
  );
}
