import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ProofPe pricing for public profiles, featured listings, and top placement.",
  alternates: { canonical: "/pricing" }
};

const plans = [
  {
    name: "Free",
    price: "Rs. 0",
    body: "Public profile",
    cta: "Join Free",
    href: "/submit"
  },
  {
    name: "Boost",
    price: "Rs. 999",
    body: "Featured listing",
    cta: "Request Featured",
    href: "/contact"
  },
  {
    name: "Pro",
    price: "Rs. 2999",
    body: "Top placement",
    cta: "Request Featured",
    href: "/contact"
  }
];

export default function PricingPage() {
  return (
    <section className="container-shell py-14">
      <p className="text-sm font-black uppercase tracking-wide text-mint">Pricing</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
        Clear visibility plans for startup operators.
      </h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <p className="mt-5 text-4xl font-black">{plan.price}</p>
            <p className="mt-4 text-steel">{plan.body}</p>
            <Link
              href={plan.href}
              className="mt-8 inline-flex w-full justify-center rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint"
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
