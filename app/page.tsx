import Link from "next/link";
import { ArrowRight, ChevronRight, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { StartupCard } from "@/components/StartupCard";
import { categories, seedStartups } from "@/lib/seed";
import { formatCompactINR, formatINR } from "@/lib/utils";

const forSale = seedStartups.filter((startup) => startup.listingType === "for_sale");
const wanted = seedStartups.filter((startup) => startup.listingType === "wanted");
const openRevenue = seedStartups.filter((startup) => startup.listingType === "directory");
const featured = seedStartups.filter((startup) => startup.featured);

export default function HomePage() {
  return (
    <>
      <section className="border-b border-black/10 bg-white">
        <div className="container-shell py-12 sm:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black text-mint shadow-sm">
              Verified revenue. Buy, sell, and discover Indian startups.
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              The marketplace for startup revenue in India
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-steel sm:text-xl">
              Discover verified startups, list your company publicly, or signal that you are
              ready to buy profitable internet businesses.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white px-4 py-4 shadow-sm">
                <Search className="h-5 w-5 text-steel" />
                <span className="text-left text-sm font-bold text-steel">
                  Browse SaaS, AI, fintech, D2C, and profitable startups with public metrics
                </span>
              </div>
              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-4 text-sm font-black text-white shadow-premium hover:bg-mint"
              >
                Explore market <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-lg border border-black/15 bg-white px-6 py-4 text-sm font-black hover:border-mint hover:text-mint"
              >
                Add startup
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-steel">
              <Link href="/leaderboard" className="hover:text-ink">Buy/sell</Link>
              <span>&middot;</span>
              <Link href="/leaderboard" className="hover:text-ink">Feed</Link>
              <span>&middot;</span>
              <Link href="/leaderboard" className="hover:text-ink">Stats</Link>
              <span>&middot;</span>
              <Link href="/faq" className="hover:text-ink">How verification works</Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <SignalCard title="Recently listed" value={`${seedStartups.length} startups`} body="Live listings with public revenue, proof status, and founder context." icon={<Sparkles className="h-5 w-5" />} />
            <SignalCard title="Top 30-day revenue" value={formatINR(seedStartups[0].revenue30d)} body="Rank startups by MRR, growth, or recent traction." icon={<TrendingUp className="h-5 w-5" />} />
            <SignalCard title="Proof-first trust" value="Verified / Unverified" body="Every listing makes proof status obvious before anyone reaches out." icon={<ShieldCheck className="h-5 w-5" />} />
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeader
          eyebrow="Marketplace"
          title="Recently listed"
          href="/leaderboard"
          action="Browse all"
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {forSale.slice(0, 4).map((startup) => (
            <MarketplaceCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      <section className="container-shell py-4">
        <div className="grid gap-8 rounded-lg border border-black/10 bg-ink p-8 text-white shadow-premium lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-mint">Buy / Sell</p>
            <h2 className="mt-3 text-3xl font-black">Deal flow with public traction.</h2>
            <p className="mt-4 max-w-xl leading-8 text-white/75">
              Founders can list a company for sale, keep an open revenue profile, or signal that
              they are actively looking to acquire profitable startups.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white/8 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-white/60">For sale</p>
              <p className="mt-3 text-3xl font-black">{forSale.length}</p>
              <p className="mt-2 text-sm text-white/70">Startups with a public asking price and revenue multiple.</p>
            </div>
            <div className="rounded-lg bg-white/8 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-white/60">Looking to buy</p>
              <p className="mt-3 text-3xl font-black">{wanted.length}</p>
              <p className="mt-2 text-sm text-white/70">Operators and holding companies actively scouting deals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Open revenue profiles"
          href="/leaderboard"
          action="View leaderboard"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featured.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-mint">Browse categories</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Find the kind of startup you want.</h2>
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
        <SectionHeader
          eyebrow="Signals"
          title="What people can do on ProofPe"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ActionCard
            title="List a startup"
            body="Publish revenue, MRR, growth, category, and an optional asking price."
            href="/submit"
          />
          <ActionCard
            title="Discover deals"
            body="Browse profitable startups that are open to acquisition conversations."
            href="/leaderboard"
          />
          <ActionCard
            title="Track proof status"
            body="See who uploaded proof, who is verified, and who is still operating on trust."
            href="/faq"
          />
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="rounded-lg border border-black/10 bg-white p-8 shadow-premium">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-mint">Launch fast</p>
              <h2 className="mt-3 text-3xl font-black">Get listed now, verify later.</h2>
              <p className="mt-4 max-w-2xl leading-8 text-steel">
                ProofPe now lets founders submit first and add proof when available. That keeps the
                market active while verification continues in public.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-paper p-4">
                <p className="text-xs font-black uppercase tracking-wide text-steel">Open revenue</p>
                <p className="mt-2 text-2xl font-black">{openRevenue.length}</p>
              </div>
              <div className="rounded-lg bg-paper p-4">
                <p className="text-xs font-black uppercase tracking-wide text-steel">Public asks</p>
                <p className="mt-2 text-2xl font-black">{formatCompactINR(forSale.reduce((sum, startup) => sum + (startup.askingPrice ?? 0), 0))}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
  action
}: {
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-mint">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
      </div>
      {href && action ? (
        <Link href={href} className="hidden items-center gap-1 font-black text-mint sm:inline-flex">
          {action} <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function SignalCard({
  title,
  value,
  body,
  icon
}: {
  title: string;
  value: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black uppercase tracking-wide text-steel">{title}</p>
        <div className="text-mint">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-3 text-sm leading-6 text-steel">{body}</p>
    </div>
  );
}

function ActionCard({
  title,
  body,
  href
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-steel">{body}</p>
    </Link>
  );
}
