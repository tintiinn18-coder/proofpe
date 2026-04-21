import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Firebase Debug",
  robots: { index: false, follow: false }
};

const firebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export default function FirebaseDebugPage() {
  const rows = Object.entries(firebaseEnv).map(([key, value]) => ({
    key,
    present: Boolean(value),
    value:
      key === "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" ||
      key === "NEXT_PUBLIC_FIREBASE_PROJECT_ID" ||
      key === "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        ? value || "missing"
        : value
          ? "set"
          : "missing"
  }));

  return (
    <section className="container-shell py-14">
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        <h1 className="text-3xl font-black">Firebase Debug</h1>
        <p className="mt-3 text-sm leading-6 text-steel">
          This page only checks whether the browser build can see the required
          Firebase public environment variables.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-black/10">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid gap-3 border-b border-black/10 p-4 text-sm last:border-b-0 md:grid-cols-[1fr_120px_1fr]"
            >
              <span className="font-black">{row.key}</span>
              <span className={row.present ? "font-black text-mint" : "font-black text-coral"}>
                {row.present ? "present" : "missing"}
              </span>
              <span className="text-steel">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
