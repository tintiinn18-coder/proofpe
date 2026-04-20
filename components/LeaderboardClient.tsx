"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { VerificationBadge } from "@/components/Badge";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { categories, seedStartups } from "@/lib/seed";
import type { Startup, VerificationStatus } from "@/lib/types";
import { formatINR } from "@/lib/utils";

type SortKey = "revenue" | "mrr" | "growth" | "newest";

export function LeaderboardClient() {
  const [startups, setStartups] = useState<Startup[]>(seedStartups);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<VerificationStatus | "all">("all");
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState<SortKey>("revenue");

  useEffect(() => {
    async function load() {
      if (!isFirebaseConfigured || !db) return;
      const snapshot = await getDocs(
        query(collection(db, "startups"), orderBy("createdAt", "desc"))
      );
      const live = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Startup)
        .filter((startup) => startup.approved && !startup.rejected);
      if (live.length > 0) setStartups(live);
    }

    load().catch(() => setStartups(seedStartups));
  }, []);

  const filtered = useMemo(() => {
    return startups
      .filter((startup) => category === "all" || startup.category === category)
      .filter((startup) => status === "all" || startup.verificationStatus === status)
      .filter((startup) => {
        if (range === "under5") return startup.revenue30d < 500000;
        if (range === "5to10") return startup.revenue30d >= 500000 && startup.revenue30d < 1000000;
        if (range === "10plus") return startup.revenue30d >= 1000000;
        return true;
      })
      .sort((a, b) => {
        if (sort === "mrr") return b.mrr - a.mrr;
        if (sort === "growth") return b.growthPercent - a.growthPercent;
        if (sort === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.revenue30d - a.revenue30d;
      });
  }, [category, range, sort, startups, status]);

  return (
    <section className="container-shell py-12">
      <div className="rounded-lg border border-black/10 bg-white p-4 shadow-premium">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Category" value={category} onChange={setCategory}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select label="Verification" value={status} onChange={(value) => setStatus(value as VerificationStatus | "all")}>
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="proof_uploaded">Proof Uploaded</option>
            <option value="unverified">Unverified</option>
          </Select>
          <Select label="Revenue range" value={range} onChange={setRange}>
            <option value="all">All revenue</option>
            <option value="under5">Under Rs. 5L</option>
            <option value="5to10">Rs. 5L to Rs. 10L</option>
            <option value="10plus">Rs. 10L+</option>
          </Select>
          <Select label="Sort by" value={sort} onChange={(value) => setSort(value as SortKey)}>
            <option value="revenue">Revenue</option>
            <option value="mrr">MRR</option>
            <option value="growth">Growth</option>
            <option value="newest">Newest</option>
          </Select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-ink text-xs uppercase tracking-wide text-white">
              <tr>
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Startup Name</th>
                <th className="px-5 py-4">Founder</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">30-day Revenue</th>
                <th className="px-5 py-4">MRR</th>
                <th className="px-5 py-4">Growth</th>
                <th className="px-5 py-4">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filtered.map((startup, index) => (
                <tr key={startup.id} className="transition hover:bg-mint/5">
                  <td className="px-5 py-4 text-lg font-black">#{index + 1}</td>
                  <td className="px-5 py-4">
                    <Link href={`/startup/${startup.slug}`} className="font-black hover:text-mint">
                      {startup.name}
                    </Link>
                    <p className="text-sm text-steel">{startup.city}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{startup.founderName}</td>
                  <td className="px-5 py-4 text-sm">{startup.category}</td>
                  <td className="px-5 py-4 font-black">{formatINR(startup.revenue30d)}</td>
                  <td className="px-5 py-4 font-bold">{formatINR(startup.mrr)}</td>
                  <td className="px-5 py-4 font-bold text-mint">+{startup.growthPercent}%</td>
                  <td className="px-5 py-4">
                    <VerificationBadge status={startup.verificationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="text-xs font-black uppercase tracking-wide text-steel">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-black/10 bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:border-mint"
      >
        {children}
      </select>
    </label>
  );
}
