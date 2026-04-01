"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RiskLevel } from "@/lib/trading-types";

const riskColors: Record<RiskLevel, string> = {
  Conservative: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Moderate: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Aggressive: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

export default function Navbar() {
  const pathname = usePathname();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Moderate");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tradeiq-risk") as RiskLevel | null;
    if (saved) setRiskLevel(saved);

    const handleStorage = () => {
      const updated = localStorage.getItem("tradeiq-risk") as RiskLevel | null;
      if (updated) setRiskLevel(updated);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const navLinks = [
    { href: "/", label: "דשבורד" },
    { href: "/scanner/", label: "סורק עסקאות" },
    { href: "/journal/", label: "יומן" },
    { href: "/roadmap/", label: "מפת דרכים" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              TQ
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">TradeIQ</span>
              <div className="text-gray-500 text-xs leading-none">Phase 1</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Risk indicator + mobile menu */}
          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${riskColors[riskLevel]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {riskLevel}
            </span>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-gray-700 pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${riskColors[riskLevel]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Risk: {riskLevel}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
