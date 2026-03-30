// app/(dashboard)/members/page.tsx
// ─── Server Component — fetches data, renders table ──────────────────────────

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMembers } from "@/service/members/member.service";
import { MembersTable } from "@/components/modules/members/memberTable";
export const dynamic = "force-dynamic";

function MembersTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-9 w-24 ml-auto" />
      </div>
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex gap-8">
          {[80, 200, 100, 80, 80, 80].map((w, i) => (
            <Skeleton key={i} className="h-3" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3.5 border-b border-slate-100 flex gap-8 items-center"
          >
            <Skeleton className="h-4 w-4" />
            <div className="flex items-center gap-3 w-48">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-36" />
              </div>
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-6 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inner Component (async data fetching) ────────────────────────────────────

async function MembersContent() {
  const result = await getAllMembers();
  console.log(result)

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-slate-500">
        <p className="text-sm font-medium text-red-500">Failed to load members</p>
        <p className="text-xs text-slate-400">{result.message}</p>
      </div>
    );
  }

  return <MembersTable data={result.data} total={result.data.length} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <Suspense fallback={<MembersTableSkeleton />}>
        <MembersContent />
      </Suspense>
    </div>
  );
}