"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { VerificationBadge } from "@/components/Badge";
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import type { Startup } from "@/lib/types";
import { formatINR } from "@/lib/utils";

type Filter = "pending" | "approved" | "rejected" | "all";

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");

  const allowedEmails = useMemo(
    () => (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
    []
  );
  const isAllowed = Boolean(user?.email && allowedEmails.includes(user.email.toLowerCase()));

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (isAllowed) void loadStartups();
  }, [isAllowed]);

  async function loadStartups() {
    if (!db) return;
    const snapshot = await getDocs(query(collection(db, "startups"), orderBy("createdAt", "desc")));
    setStartups(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Startup));
  }

  async function login() {
    if (!auth) return;
    await signInWithPopup(auth, googleProvider);
  }

  async function patchStartup(id: string, data: Partial<Startup>) {
    if (!db) return;
    await updateDoc(doc(db, "startups", id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    await loadStartups();
  }

  async function editStartup(startup: Startup) {
    const revenue = window.prompt("30-day revenue", String(startup.revenue30d));
    if (revenue === null) return;
    const mrr = window.prompt("MRR", String(startup.mrr));
    if (mrr === null) return;
    const growth = window.prompt("Growth %", String(startup.growthPercent));
    if (growth === null) return;
    await patchStartup(startup.id, {
      revenue30d: Number(revenue),
      mrr: Number(mrr),
      growthPercent: Number(growth)
    });
  }

  async function removeStartup(id: string) {
    if (!db) return;
    const confirmed = window.confirm("Delete this startup?");
    if (!confirmed) return;
    await deleteDoc(doc(db, "startups", id));
    await loadStartups();
  }

  const visible = startups.filter((startup) => {
    if (filter === "pending") return !startup.approved && !startup.rejected;
    if (filter === "approved") return startup.approved && !startup.rejected;
    if (filter === "rejected") return startup.rejected;
    return true;
  });

  if (!isFirebaseConfigured) {
    return <AdminNotice title="Firebase is not configured" body="Add Firebase env variables before using the admin dashboard." />;
  }

  if (!user) {
    return (
      <AdminNotice title="Admin sign in" body="Use a Google account listed in NEXT_PUBLIC_ADMIN_EMAILS.">
        <button onClick={login} className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint">
          Sign in with Google
        </button>
      </AdminNotice>
    );
  }

  if (!isAllowed) {
    return (
      <AdminNotice title="Not allowed" body={`${user.email ?? "This account"} is not on the admin allowlist.`}>
        <button onClick={() => auth && signOut(auth)} className="mt-5 rounded-lg border border-black/10 px-5 py-3 text-sm font-black">
          Sign out
        </button>
      </AdminNotice>
    );
  }

  return (
    <section className="container-shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-mint">Admin</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Submission review</h1>
        </div>
        <button onClick={() => auth && signOut(auth)} className="rounded-lg border border-black/10 px-5 py-3 text-sm font-black">
          Sign out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 text-sm font-black ${filter === item ? "bg-ink text-white" : "border border-black/10 bg-white"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {visible.map((startup) => (
          <article key={startup.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{startup.name}</h2>
                <p className="mt-1 text-sm text-steel">{startup.founderName} / {startup.founderEmail}</p>
                <p className="mt-3 max-w-2xl leading-7 text-steel">{startup.tagline}</p>
              </div>
              <VerificationBadge status={startup.verificationStatus} />
            </div>
            <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
              <Info label="Revenue" value={formatINR(startup.revenue30d)} />
              <Info label="MRR" value={formatINR(startup.mrr)} />
              <Info label="Growth" value={`+${startup.growthPercent}%`} />
              <Info label="Category" value={startup.category} />
            </div>
            {startup.proofImageUrl ? (
              <a href={startup.proofImageUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-black text-mint">
                View proof screenshot
              </a>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => patchStartup(startup.id, { approved: true, rejected: false })} className="rounded-lg bg-mint px-4 py-2 text-sm font-black text-white">
                Approve
              </button>
              <button onClick={() => patchStartup(startup.id, { approved: false, rejected: true, verificationStatus: "rejected" })} className="rounded-lg bg-coral px-4 py-2 text-sm font-black text-white">
                Reject
              </button>
              <button onClick={() => patchStartup(startup.id, { approved: true, rejected: false, verificationStatus: "verified" })} className="rounded-lg bg-ink px-4 py-2 text-sm font-black text-white">
                Mark verified
              </button>
              <button onClick={() => patchStartup(startup.id, { featured: !startup.featured })} className="rounded-lg border border-black/10 px-4 py-2 text-sm font-black">
                {startup.featured ? "Unfeature" : "Feature"}
              </button>
              <button onClick={() => editStartup(startup)} className="rounded-lg border border-black/10 px-4 py-2 text-sm font-black">
                Edit data
              </button>
              <button onClick={() => removeStartup(startup.id)} className="rounded-lg border border-coral/30 px-4 py-2 text-sm font-black text-coral">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminNotice({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <section className="container-shell py-14">
      <div className="rounded-lg border border-black/10 bg-white p-8 shadow-premium">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-3 text-steel">{body}</p>
        {children}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs font-black uppercase tracking-wide text-steel">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}
