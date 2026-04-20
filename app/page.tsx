import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, IndianRupee, ShieldCheck, UploadCloud } from "lucide-react";
import { StartupCard } from "@/components/StartupCard";
import { categories, seedStartups } from "@/lib/seed";
import { formatINR } from "@/lib/utils";

const featured = seedStartups.filter((startup) => startup.featured);

export default function HomePage() {
  return (
    <>
      <section className="grid-bg border-b border-black/10 bg-white/70">
        <div className="container-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black text-mint shadow-sm">
              Proof-based transparency for Indian startups
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              India&apos;s Verified Startup Revenue Leaderboard
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-steel">
              Show your revenue publicly. Build trust. Get visibility.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-4 text-sm font-black text-white shadow-premium hover:bg-mint"
              >
                View Leaderboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-lg border border-black/15 bg-white px-6 py-4 text-sm font-black hover:border-mint hover:text-mint"
              >
                Submit Startup
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-premium">
            <div className="rounded-lg bg-ink p-5 text-white">
              <p className="text-sm font-bold text-white/70">Live revenue signal</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black">{formatINR(1840000)}</p>
                  <p className="mt-1 text-sm text-white/70">Top 30-day revenue</p>
                </div>
                <BarChart3 className="h-12 w-12 text-mint" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {seedStartups.slice(0, 4).map((startup, index) => (
                <Link
                  key={startup.id}
                  href={`/startup/${startup.slug}`}
                  className="flex items-center justify-between rounded-lg border border-black/10 p-4 hover:border-mint"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-steel">#{index + 1}</span>
                    <span className="font-black">{startup.name}</span>
                  </div>
                  <span className="font-black">{formatINR(startup.revenue30d)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Razorpay-first", IndianRupee],
            ["Proof-based verification", ShieldCheck],
            ["India-focused", BadgeCheck]
          ].map(([label, Icon]) => (
            <div key={String(label)} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-mint" />
              <p className="mt-3 font-black">{String(label)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-wide text-mint">How it works</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Submit, prove, rank.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Submit", "Add your startup profile, founder details, category, and public metrics."],
            ["Upload proof", "Attach a revenue screenshot. Razorpay and Stripe connections are coming soon."],
            ["Get ranked", "Approved profiles appear on the leaderboard with clear verification status."]
          ].map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-steel">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-mint">Featured startups</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Numbers worth trusting.</h2>
          </div>
          <Link href="/leaderboard" className="hidden font-black text-mint sm:block">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featured.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-mint">Categories</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Find traction by market.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                href={`/leaderboard?category=${encodeURIComponent(category)}`}
                key={category}
                className="rounded-lg border border-black/10 bg-white p-4 text-sm font-black shadow-sm hover:border-mint hover:text-mint"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="rounded-lg bg-ink p-8 text-white shadow-premium md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-mint">Pricing preview</p>
              <h2 className="mt-3 text-3xl font-black">Start free. Boost when visibility matters.</h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Public profiles are free. Featured listings and top placement are available for launch campaigns.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-black text-ink"
            >
              See pricing <UploadCloud className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
