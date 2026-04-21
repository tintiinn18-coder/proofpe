import Link from "next/link";
import { categories } from "@/lib/seed";

const navigation = [
  ["Marketplace", "/"],
  ["Leaderboard", "/leaderboard"],
  ["Sell a startup", "/submit"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
];

const legal = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms", "/terms"],
  ["Admin", "/admin"]
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.1fr_2.2fr]">
        <div>
          <div className="flex items-center gap-3 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm text-white">
              Pe
            </span>
            ProofPe
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-steel">
            The marketplace for startup revenue in India. Founders can list
            publicly, buyers can discover opportunities, and everyone can see
            proof status before they reach out.
          </p>
        </div>
        <div className="grid gap-8 text-sm text-steel md:grid-cols-3">
          <div className="space-y-3">
            <p className="font-black text-ink">Navigation</p>
            {navigation.map(([label, href]) => (
              <Link key={href} href={href} className="block font-semibold hover:text-ink">
                {label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <p className="font-black text-ink">Browse categories</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category}
                  href={`/leaderboard?category=${encodeURIComponent(category)}`}
                  className="font-semibold hover:text-ink"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-black text-ink">Legal</p>
            {legal.map(([label, href]) => (
              <Link key={href} href={href} className="block font-semibold hover:text-ink">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs text-steel">
        Founder submitted data. Verification is an internal review process. No
        investment advice.
      </div>
    </footer>
  );
}
