import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaApple,
  FaCreditCard,
  FaWallet,
  FaShieldAlt,
  FaEnvelope,
  FaArrowRight,
  FaMobileAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

// import phoneMockup from "../assets/images/phoneMockup";
const socials = [
  { id: 1, name: "Instagram", icon: FaInstagram, href: "#" },
  { id: 2, name: "Facebook", icon: FaFacebook, href: "#" },
  { id: 3, name: "X", icon: FaXTwitter, href: "#" },
  { id: 4, name: "LinkedIn", icon: FaLinkedin, href: "#" },
  { id: 5, name: "TikTok", icon: FaTiktok, href: "#" },
];

const footerColumns = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { label: "Restaurants", href: "#" },
      { label: "Categories", href: "#" },
      { label: "Offers", href: "#" },
      { label: "Gift Cards", href: "#" },
      { label: "Become a Partner", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Investors", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Community Guidelines", href: "#" },
    ],
  },
];

const payments = [
  { id: 1, label: "Visa", icon: FaCreditCard },
  { id: 2, label: "Mastercard", icon: FaCreditCard },
  { id: 3, label: "Apple Pay", icon: FaApple },
  { id: 4, label: "Google Pay", icon: FaWallet },
  { id: 5, label: "PayPal", icon: FaWallet },
  { id: 6, label: "Cash on Delivery", icon: FaShieldAlt },
];

const countries = [
  { id: 1, name: "Pakistan", flag: "🇵🇰" },
  { id: 2, name: "UAE", flag: "🇦🇪" },
  { id: 3, name: "Saudi Arabia", flag: "🇸🇦" },
  { id: 4, name: "Qatar", flag: "🇶🇦" },
  { id: 5, name: "United Kingdom", flag: "🇬🇧" },
  { id: 6, name: "Canada", flag: "🇨🇦" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden bg-[#FAF8F4] px-6 pb-10 pt-10 text-[#0C3B2E] md:px-10">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-[#0C3B2E]/10 blur-[110px]" />
        <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#FFBA00]/15 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#1B6B52]/10 blur-[100px]" />

        <span className="absolute left-[8%] top-24 text-3xl opacity-[0.06]">🍕</span>
        <span className="absolute right-[12%] top-16 text-4xl opacity-[0.06]">🍔</span>
        <span className="absolute left-[20%] bottom-40 text-3xl opacity-[0.06]">🍣</span>
        <span className="absolute right-[22%] bottom-24 text-4xl opacity-[0.06]">🍰</span>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ================= SECTION 1 — NEWSLETTER CTA ================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0C3B2E] via-[#0C3B2E] to-[#1B6B52] px-8 py-12 shadow-[0_30px_70px_-25px_rgba(12,59,46,0.5)] sm:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFBA00]/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />

          <div className="relative z-10 flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md text-white">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Stay Hungry.
                <br />
                Stay Updated.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                Get exclusive restaurant offers, new launches and discounts,
                straight to your inbox.
              </p>
            </div>

            <div className="w-full max-w-md md:w-auto">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
                  <FaEnvelope size={16} className="shrink-0 text-white/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#FFBA00] px-6 py-3 text-sm font-semibold text-[#0C3B2E] transition-all duration-300 hover:bg-[#FFC933] hover:shadow-[0_10px_30px_-8px_rgba(255,186,0,0.6)] active:scale-95"
                >
                  Subscribe
                  <FaArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
              <p className="mt-3 text-xs text-white/50">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2 — MAIN FOOTER ================= */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-bold tracking-tight text-[#0C3B2E]">
              Bite<span className="text-[#FFBA00]">Flow</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#0C3B2E]/60">
              Delivering happiness, one order at a time.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  aria-label={s.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0C3B2E]/10 bg-white text-[#0C3B2E] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-[#FFBA00]/40 hover:bg-[#0C3B2E] hover:text-[#FFBA00] hover:shadow-[0_10px_25px_-8px_rgba(12,59,46,0.5)]"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4 — Links */}
          {footerColumns.map((col) => (
            <div key={col.id}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0C3B2E]/80">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-sm text-[#0C3B2E]/60 transition-colors duration-300 hover:text-[#0C3B2E]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#FFBA00] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      
        {/* ================= SECTION 4 — PAYMENT METHODS ================= */}
        <div className="flex flex-col items-center gap-4 py-12">
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0C3B2E]/50">
            Secure payments
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-full border border-[#0C3B2E]/10 bg-white/70 px-4 py-2 text-xs font-medium text-[#0C3B2E]/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFBA00]/40 hover:text-[#0C3B2E]"
              >
                <p.icon size={14} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 5 — COUNTRIES ================= */}
        <div className="flex flex-col items-center gap-4 border-t border-[#0C3B2E]/8 py-10">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0C3B2E]/50">
            <FaMapMarkerAlt size={13} /> Where we deliver
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {countries.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-medium text-[#0C3B2E]/70 transition-colors duration-300 hover:text-[#0C3B2E]"
              >
                <span className="text-base">{c.flag}</span>
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 6 — BOTTOM BAR ================= */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#0C3B2E]/8 pt-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-medium text-[#0C3B2E]/70">© 2026 BiteFlow</p>
            <p className="text-xs text-[#0C3B2E]/45">Made with ❤️ for food lovers.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#0C3B2E]/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#0C3B2E]/60">
              v1.0.0
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-[#0C3B2E]/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#0C3B2E]/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}