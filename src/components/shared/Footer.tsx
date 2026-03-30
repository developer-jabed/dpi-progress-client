"use client";
import Link from "next/link";
import { Users, Mail, Phone, MapPin, Heart, ArrowUpRight, Github } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS: FooterSection[] = [
  {
    title: "Navigate",
    links: [
      { label: "Home",       href: "/" },
      { label: "Dashboard",  href: "/dashboard" },
      { label: "Events",     href: "/admin/dashboard/events" },
      { label: "Expenses",   href: "/admin/dashboard/expense" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In",         href: "/login" },
      { label: "My Contributions", href: "/dashboard/member/contributions" },
      { label: "Change Password",  href: "/change-password" },
      { label: "Profile",          href: "/my-profile" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub",       href: "https://github.com", external: true },
      { label: "Support",      href: "mailto:support@brothersunion.com", external: true },
    ],
  },
];

const CONTACT = [
  { icon: Mail,    label: "jabed1780@gmail.com" },
  { icon: Phone,   label: "+8801893292965" },
  { icon: MapPin,  label: "Mukundapur,Dinajpur, Bangladesh" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-white">

      {/* ── Top glow ──────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 -top-24 h-48 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* ── Dot texture ───────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="group inline-flex items-center gap-2.5 w-fit">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rotate-45 rounded-sm bg-emerald-500 transition-transform duration-500 group-hover:rotate-[225deg]" />
                <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-zinc-950" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Brothers<span className="text-zinc-400">Union</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              A brotherhood built on trust, transparency, and collective
              contribution. Every taka is tracked. Every member matters.
            </p>

            {/* Contact info */}
            <ul className="flex flex-col gap-2.5">
              {CONTACT.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-zinc-400">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                aria-label="GitHub"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:support@brothersunion.com"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {link.label}
                        <span className="inline-block h-px w-0 bg-white transition-all duration-200 group-hover:w-3" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>© {year} Brothers Union. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>and brotherhood</span>
          </div>
        </div>

      </div>
    </footer>
  );
}