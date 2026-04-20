import type { Metadata } from "next";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Compare Indian startups by verified revenue, MRR, growth, category, and proof status.",
  alternates: { canonical: "/leaderboard" }
};

export default function LeaderboardPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-white">
        <div className="container-shell py-14">
          <p className="text-sm font-black uppercase tracking-wide text-mint">Leaderboard</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            India&apos;s most transparent startup revenue board.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-steel">
            Filter by category, proof status, and revenue range. Rank by revenue,
            MRR, growth, or newest submissions.
          </p>
        </div>
      </section>
      <LeaderboardClient />
    </>
  );
}
