import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ProofPe for support, featured listings, and profile questions.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <section className="container-shell grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-mint">Contact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Talk to ProofPe.</h1>
        <p className="mt-5 text-lg leading-8 text-steel">
          Questions, verification updates, featured listing requests, and
          profile changes can be sent to support@proofpe.com.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
