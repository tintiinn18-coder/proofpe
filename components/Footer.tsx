import Link from "next/link";

const links = [
  ["Leaderboard", "/leaderboard"],
  ["Submit Startup", "/submit"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
  ["Admin", "/admin"]
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-3 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm text-white">
              Pe
            </span>
            ProofPe
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-steel">
            Proof-based transparency for Indian startups. Founder submitted
            numbers, proof signals, and clean discovery.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-steel md:grid-cols-4">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-ink">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs text-steel">
        Founder submitted data. Verification is an internal review process. No
        investment advice.
      </div>
    </footer>
  );
}
