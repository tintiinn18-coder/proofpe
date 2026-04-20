"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ExternalLink, Share2 } from "lucide-react";
import { VerificationBadge } from "@/components/Badge";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Startup } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/utils";

export function StartupProfileClient({ initialStartup, slug }: { initialStartup?: Startup; slug: string }) {
  const [startup, setStartup] = useState<Startup | undefined>(initialStartup);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isFirebaseConfigured || !db) return;
      const snapshot = await getDocs(
        query(collection(db, "startups"), where("slug", "==", slug))
      );
      const match = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Startup)
        .find((item) => item.approved && !item.rejected);
      if (match) setStartup(match);
    }

    load().catch(() => undefined);
  }, [slug]);

  if (!startup) {
    return (
      <section className="container-shell py-14">
        <div className="rounded-lg border border-black/10 bg-white p-8 shadow-premium">
          <h1 className="text-3xl font-black">Startup not found</h1>
          <p className="mt-3 text-steel">This profile may still be pending review.</p>
        </div>
      </section>
    );
  }

  async function shareProfile() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${startup?.name} on ProofPe`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
    }
  }

  return (
    <section className="container-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-premium md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-ink text-xl font-black text-white">
                {startup.logo ?? startup.name.slice(0, 2)}
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">{startup.name}</h1>
                <p className="mt-2 text-steel">{startup.tagline}</p>
              </div>
            </div>
            <VerificationBadge status={startup.verificationStatus} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label="30-day revenue" value={formatINR(startup.revenue30d)} />
            <Metric label="MRR" value={formatINR(startup.mrr)} />
            <Metric label="Growth" value={`+${startup.growthPercent}%`} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-black">Description</h2>
            <p className="mt-3 leading-8 text-steel">{startup.description}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info label="Founder" value={startup.founderName} />
            <Info label="Category" value={startup.category} />
            <Info label="Country" value={startup.country} />
            <Info label="City" value={startup.city} />
            <Info label="Pricing model" value={startup.pricingModel} />
            <Info label="Proof updated" value={formatDate(startup.proofUpdatedAt)} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-black">Profile actions</h2>
            <a
              href={startup.website}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-black text-white hover:bg-mint"
            >
              Visit website <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={shareProfile}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 px-4 py-3 text-sm font-black hover:border-mint hover:text-mint"
            >
              Share profile <Share2 className="h-4 w-4" />
            </button>
            {shared ? <p className="mt-3 text-sm font-bold text-mint">Profile link copied.</p> : null}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-black">Claim profile</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              Founder claim flow is coming soon. For now, contact support@proofpe.com
              from your company email.
            </p>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-black">Social links</h2>
            <div className="mt-3 space-y-2 text-sm font-bold text-mint">
              {startup.socials?.x ? <a href={startup.socials.x}>X / Twitter</a> : null}
              {startup.socials?.linkedin ? <a className="block" href={startup.socials.linkedin}>LinkedIn</a> : null}
              {!startup.socials?.x && !startup.socials?.linkedin ? (
                <p className="text-steel">No social links added yet.</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper p-4">
      <p className="text-xs font-black uppercase tracking-wide text-steel">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-steel">{label}</p>
      <p className="mt-2 font-black">{value}</p>
    </div>
  );
}
