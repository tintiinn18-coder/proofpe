import Link from "next/link";
import type { Metadata } from "next";

type SuccessPageProps = {
  searchParams: {
    slug?: string;
    message?: string;
  };
};

export const metadata: Metadata = {
  title: "Submission Received",
  description: "Your ProofPe startup submission has been received."
};

export default function SubmitSuccessPage({ searchParams }: SuccessPageProps) {
  const message =
    searchParams.message ??
    "Submitted. Your startup is now live on ProofPe.";
  const slug = searchParams.slug;

  return (
    <section className="container-shell grid gap-10 py-14 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-mint">
          Submission received
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
          Your startup is live.
        </h1>
        <p className="mt-5 text-lg leading-8 text-steel">
          Founders should be able to share a public profile immediately. You
          can always come back later to add screenshot proof or tighten the
          listing details.
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        <h2 className="text-2xl font-black">What happens next</h2>
        <p className="mt-4 text-base leading-7 text-steel">{message}</p>

        {slug ? (
          <div className="mt-6 rounded-lg bg-paper p-4 text-sm font-bold text-steel">
            Live slug: <span className="text-ink">{slug}</span>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={slug ? `/startup/${slug}` : "/"}
            className="rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint"
          >
            View profile
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg border border-black/10 px-5 py-3 text-sm font-black"
          >
            View leaderboard
          </Link>
          <Link
            href="/submit"
            className="rounded-lg border border-black/10 px-5 py-3 text-sm font-black"
          >
            Submit another startup
          </Link>
        </div>
      </div>
    </section>
  );
}
