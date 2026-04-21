import type { ListingType } from "@/lib/types";
import { cn, listingLabel } from "@/lib/utils";

export function ListingBadge({ type }: { type: ListingType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide",
        type === "for_sale" && "bg-gold/15 text-gold ring-1 ring-gold/30",
        type === "wanted" && "bg-coral/15 text-coral ring-1 ring-coral/30",
        type === "directory" && "bg-ink/8 text-ink ring-1 ring-black/10"
      )}
    >
      {listingLabel(type)}
    </span>
  );
}
