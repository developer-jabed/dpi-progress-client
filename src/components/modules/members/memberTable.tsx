"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Member } from "@/service/members/member.service";
import { MemberTableHead, MemberTableRow, MemberTableSort, SortField } from "./memberColumn";
import { CreateMemberDialog } from "./memberDialog";

const PAGE_SIZE = 10;

// ─── Helpers (outside component — React Compiler safe) ────────────────────────

function filterMembers(data: Member[], search: string): Member[] {
  const q = search.toLowerCase().trim();
  if (!q) return data;
  return data.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
  );
}

function sortMembers(data: Member[], sort: MemberTableSort): Member[] {
  if (!sort.field) return data;
  const field = sort.field;
  return [...data].sort((a, b) => {
    const av = String(a[field] ?? "");
    const bv = String(b[field] ?? "");
    const cmp = av.localeCompare(bv);
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MembersTableProps {
  data: Member[];
  total: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MembersTable({ data, total }: MembersTableProps) {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<MemberTableSort>({ field: null, direction: "asc" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  // ── Sort Handler ──────────────────────────────────────────────────────────
  function handleSort(field: SortField) {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
    setPage(1);
  }

  // ── Selection Handlers ────────────────────────────────────────────────────
  function handleSelectAll(checked: boolean) {
    if (checked) {
      const ids = new Set(paginated.map((m) => m.id));
      setSelectedIds(ids);
    } else {
      setSelectedIds(new Set<string>());
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  }

  // ── Row Action Handlers ───────────────────────────────────────────────────
  function handleView(member: Member) {
    toast.info(`Viewing ${member.name}`, { description: member.email });
  }

  function handleEdit(member: Member) {
    toast.info(`Editing ${member.name}`);
  }

  function handleDelete(member: Member) {
    toast.error(`Remove ${member.name}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          // await deleteMember(member.id)
          toast.success(`${member.name} removed`);
          router.refresh();
        },
      },
    });
  }

  // ── Derived Data (plain — React Compiler memoizes automatically) ──────────
  const searched = filterMembers(data, search);
  const filtered = sortMembers(searched, sort);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = paginated.length > 0 && paginated.every((m) => selectedIds.has(m.id));
  const someSelected = !allSelected && paginated.some((m) => selectedIds.has(m.id));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            Members
            <Badge variant="secondary" className="ml-1 text-xs font-medium">
              {total}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your team members and their access levels.
          </p>
        </div>
        <CreateMemberDialog />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 bg-white"
          />
        </div>

        {selectedIds.size > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedIds.size} selected
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <MemberTableHead
              sort={sort}
              onSort={handleSort}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={handleSelectAll}
            />
          </TableHeader>

          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((member) => (
                <MemberTableRow
                  key={member.id}
                  member={member}
                  selected={selectedIds.has(member.id)}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Users className="h-8 w-8 opacity-40" />
                    <p className="text-sm font-medium">No members found</p>
                    <p className="text-xs">
                      Try adjusting your search or add a new member.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {filtered.length === 0
            ? "No results"
            : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                page * PAGE_SIZE,
                filtered.length
              )} of ${filtered.length} member(s)`}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}