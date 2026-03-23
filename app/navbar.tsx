import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-white/5 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-bold text-xl tracking-tight">
              AlphaHound
            </span>
            <span className="text-xs text-muted bg-surface-light px-2 py-0.5 rounded-full">
              Beta
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Today
            </Link>
            <Link
              href="/history"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              History
            </Link>
            <Link
              href="/markets"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Markets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
