import Link from "next/link";

const links = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/submit", label: "Submit" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/88 backdrop-blur-xl">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm text-white">
            Pe
          </span>
          <span>ProofPe</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-steel md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/submit"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white shadow-premium hover:bg-mint"
        >
          Get ranked
        </Link>
      </div>
    </header>
  );
}
