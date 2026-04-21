import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ListingBadge } from "@/components/ListingBadge";
import { VerificationBadge } from "@/components/Badge";
import type { Startup } from "@/lib/types";
import { formatCompactINR, formatINR } from "@/lib/utils";

export function MarketplaceCard({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startup/${startup.slug}`}
      className="group rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-ink text-sm font-black text-white">
            {startup.logo ?? startup.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-black">{startup.name}</h3>
            <p className="text-sm text-steel">{startup.category}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-steel transition group-hover:text-mint" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ListingBadge type={startup.listingType} />
        <VerificationBadge status={startup.verificationStatus} />
      </div>

      <p className="mt-4 min-h-16 text-sm leading-6 text-steel">{startup.tagline}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Revenue" value={formatCompactINR(startup.revenue30d)} />
        <Metric label="MRR" value={formatCompactINR(startup.mrr)} />
        <Metric
          label={startup.listingType === "directory" ? "Signal" : "Ask"}
          value={startup.listingType === "directory" ? `+${startup.growthPercent}%` : formatCompactINR(startup.askingPrice)}
        />
      </div>

      <div className="mt-5 border-t border-black/10 pt-4">
        <p className="text-xs font-black uppercase tracking-wide text-steel">30-day revenue</p>
        <p className="mt-2 text-xl font-black">{formatINR(startup.revenue30d)}</p>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-steel">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}
