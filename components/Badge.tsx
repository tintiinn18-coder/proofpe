import type { VerificationStatus } from "@/lib/types";
import { cn, statusLabel } from "@/lib/utils";

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        status === "verified" && "bg-mint/15 text-mint ring-1 ring-mint/30",
        status === "proof_uploaded" && "bg-aqua/15 text-aqua ring-1 ring-aqua/30",
        status === "unverified" && "bg-steel/10 text-steel ring-1 ring-steel/20",
        status === "rejected" && "bg-coral/15 text-coral ring-1 ring-coral/30"
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
