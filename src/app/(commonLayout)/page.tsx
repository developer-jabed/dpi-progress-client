/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";

import { getAllMembers } from "@/service/members/member.service";
import {
   TrendingUp, Heart, Calendar,
  ArrowRight, CircleDollarSign, Trophy, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContributions } from "@/service/contributions/contribution.service";

export const dynamic = "force-dynamic";
// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.08] ${accent}`} />
      <div className={`mb-4 inline-flex rounded-xl p-2.5 ${accent}/10`}>
        <Icon className={`h-5 w-5 ${accent.replace("bg-", "text-")}`} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ totalAmount, memberCount }: { totalAmount: number; memberCount: number }) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 pt-28 pb-24 text-white sm:pt-36 sm:pb-32">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[80px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-96 rounded-full bg-cyan-500/10 blur-[60px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-800/50 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Brotherhood Fund — Active
        </span>

        <h1 className="text-5xl font-extrabold tracking-tight leading-none sm:text-7xl lg:text-8xl">
          Brothers
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent pb-2">
            Union
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400 leading-relaxed">
          A collective built on trust, contribution, and brotherhood.
          Every taka counts. Every member matters.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button className="h-11 rounded-full bg-emerald-500 px-7 text-sm font-semibold hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all">
              Join the Brotherhood
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#stats">
            <Button
              variant="outline"
              className="h-11 rounded-full border-zinc-700 bg-transparent px-7 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
            >
              View Fund Stats
            </Button>
          </Link>
        </div>

        {/* Hero quick stats */}
        <div className="mt-16 grid grid-cols-2 divide-x divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          {[
            { label: "Total Fund Raised", value: fmt(totalAmount) },
            { label: "Active Members", value: `${memberCount}` },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 px-8 py-7">
              <span className="text-3xl font-bold text-white">{item.value}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────────────────────────

function StatsSection({ summary }: { summary: any }) {
  const cards = [
    { label: "Total Fund", value: fmt(summary.totalAmount), sub: `${summary.totalCount} total contributions`, icon: CircleDollarSign, accent: "bg-emerald-500" },
    { label: "This Month", value: fmt(summary.thisMonthAmount), sub: `${summary.thisMonthCount} this month`, icon: Calendar, accent: "bg-blue-500" },
    { label: "All Donations", value: fmt(summary.donationTotal), sub: "One-time donations", icon: Heart, accent: "bg-rose-500" },
    { label: "Monthly Fees", value: fmt(summary.monthlyFeeTotal ?? summary.monthlyTotal ?? 0), sub: "Membership fees", icon: TrendingUp, accent: "bg-amber-500" },
  ];

  return (
    <section id="stats" className="bg-zinc-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Fund Overview</h2>
          <p className="mt-2 text-sm text-zinc-500">Transparent tracking of every taka collected</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

function RecentActivity({ contributions }: { contributions: any[] }) {
  if (!contributions?.length) return null;
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-zinc-500">Latest contributions from our members</p>
          </div>
          <Link href="/login" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-500">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm divide-y divide-zinc-50">
          {contributions.map((c: any, i: number) => (
            <div key={c.id ?? i} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/80 transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                {c.member
                  ? `${c.member.firstName?.[0] ?? ""}${c.member.lastName?.[0] ?? ""}`.toUpperCase()
                  : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {c.member ? `${c.member.firstName} ${c.member.lastName}` : c.user?.email ?? "Anonymous"}
                </p>
                <p className="text-xs text-zinc-400">
                  {c.type === "MembersMonthly" ? "Monthly Fee" : "Donation"}
                  {c.month && c.year ? ` · ${c.month} ${c.year}` : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                +{fmt(c.amount)}
              </span>
              <span className="shrink-0 hidden sm:flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                {timeAgo(c.paidAt ?? c.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Top Donors ───────────────────────────────────────────────────────────────

function TopDonors({ donors }: { donors: { name: string; total: number }[] }) {
  if (!donors?.length) return null;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <section className="bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Top Contributors</h2>
          <p className="mt-2 text-sm text-zinc-400">Recognising those who give the most</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {donors.map((donor, i) => (
            <div key={donor.name} className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-7 text-center transition-colors hover:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl">
                {medals[i] ?? <Trophy className="h-5 w-5 text-zinc-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{donor.name}</p>
                <p className="mt-1 text-lg font-bold text-emerald-400">{fmt(donor.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Members Section ──────────────────────────────────────────────────────────

function MembersSection({ members }: { members: any[] }) {
  if (!members?.length) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 px-6 py-20">
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glows */}
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Our Brotherhood</h2>
          <p className="mt-2 text-sm text-slate-400">{members.length} members strong and growing</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {members.slice(0, 24).map((m: any) => (
            <div
              key={m.id}
              className="flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-700/50 px-4 py-2 backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-slate-700"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                {m.name ? getInitials(m.name) : "?"}
              </div>
              <span className="text-sm font-medium text-slate-200">{m.name}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  m.status === "active" ? "bg-emerald-400" : "bg-slate-500"
                }`}
              />
            </div>
          ))}
          {members.length > 24 && (
            <div className="flex items-center rounded-full border border-slate-600/60 bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-400">
              +{members.length - 24} more
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="relative overflow-hidden bg-emerald-500 px-6 py-20">
      <div className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-950">
          Ready to contribute?
        </h2>
        <p className="mt-4 text-base text-emerald-900/75 max-w-lg mx-auto leading-relaxed">
          Log in to track your contributions, view your payment history,
          and stay connected with the brotherhood.
        </p>
        <div className="mt-8">
          <Link href="/login">
            <Button className="h-11 rounded-full bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 shadow-xl shadow-zinc-950/20 transition-all">
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [statsResult, membersResult] = await Promise.all([
    getContributions(),
    getAllMembers(),
  ]);

  const stats = statsResult?.data ?? null;
  const members = membersResult?.data ?? [];

  return (
    <main className="min-h-screen">
      <Hero
        totalAmount={stats?.overallTotalContribution ?? 0}
        memberCount={stats?.summary?.memberCount ?? members.length}
      />

      {stats?.summary && <StatsSection summary={stats.summary} />}

      {stats?.recentContributions?.length > 0 && (
        <RecentActivity contributions={stats.recentContributions} />
      )}

      {stats?.topDonors?.length > 0 && (
        <TopDonors donors={stats.topDonors} />
      )}

      <MembersSection members={members} />
      <CTA />
    
    </main>
  );
}