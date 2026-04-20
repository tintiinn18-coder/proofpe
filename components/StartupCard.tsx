import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VerificationBadge } from "@/components/Badge";
import type { Startup } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startup/${startup.slug}`}
      className="group rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ink text-sm font-black text-white">
            {startup.logo ?? startup.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-black">{startup.name}</h3>
            <p className="text-sm text-steel">{startup.category}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-steel transition group-hover:text-mint" />
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-steel">{startup.tagline}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-steel">
            30-day revenue
          </p>
          <p className="text-xl font-black">{formatINR(startup.revenue30d)}</p>
        </div>
        <VerificationBadge status={startup.verificationStatus} />
      </div>
    </Link>
  );
}
