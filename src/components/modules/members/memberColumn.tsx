"use client";

import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Member } from "@/service/members/member.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortField = Extract<keyof Member, "name" | "role" | "joinedAt">;
export type SortDirection = "asc" | "desc";

export interface MemberTableSort {
  field: SortField | null;
  direction: SortDirection;
}

export interface MemberColumnHandlers {
  sort: MemberTableSort;
  onSort: (field: SortField) => void;
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Member["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  inactive: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50",
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
};

const STATUS_DOT: Record<Member["status"], string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  pending: "bg-amber-500",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "??";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SortButton({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: SortField;
  sort: MemberTableSort;
  onSort: (f: SortField) => void;
}) {
  const isActive = sort.field === field;
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto px-0 font-semibold text-slate-500 hover:text-slate-900 hover:bg-transparent"
    >
      {label}
      <ArrowUpDown
        className={`ml-2 h-3.5 w-3.5 transition-colors ${
          isActive ? "text-slate-900" : "text-slate-400"
        }`}
      />
    </Button>
  );
}

// ─── Header Row ───────────────────────────────────────────────────────────────
// Drop inside shadcn <TableHeader>

export function MemberTableHead({
  sort,
  onSort,
  allSelected,
  someSelected,
  onSelectAll,
}: Pick<
  MemberColumnHandlers,
  "sort" | "onSort" | "allSelected" | "someSelected" | "onSelectAll"
>) {
  return (
    <tr className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
      <th className="h-10 w-10 px-4">
        <Checkbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={(v) => onSelectAll(!!v)}
          aria-label="Select all"
        />
      </th>

      <th className="h-10 px-4 text-left">
        <SortButton label="Member" field="name" sort={sort} onSort={onSort} />
      </th>

      <th className="h-10 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Phone
      </th>

      <th className="h-10 px-4 text-left">
        <SortButton label="Role" field="role" sort={sort} onSort={onSort} />
      </th>

      <th className="h-10 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Status
      </th>

      <th className="h-10 px-4 text-left">
        <SortButton label="Joined" field="joinedAt" sort={sort} onSort={onSort} />
      </th>

      {/* Actions — no label */}
      <th className="h-10 w-12 px-4" />
    </tr>
  );
}

// ─── Member Row ───────────────────────────────────────────────────────────────
// Drop inside shadcn <TableBody>

export function MemberTableRow({
  member,
  selected,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}: {
  member: Member;
  selected: boolean;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (m: Member) => void;
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
}) {
  const date = new Date(member.joinedAt);

  return (
    <tr
      data-selected={selected}
      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors data-[selected=true]:bg-blue-50/40"
    >
      {/* Checkbox */}
      <td className="px-4 py-3 w-10">
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onSelectRow(member.id, !!v)}
          aria-label={`Select ${member.name}`}
        />
      </td>

      {/* Avatar + Name + Email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="h-8 w-8 border border-slate-200 shrink-0">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-semibold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 text-sm leading-tight">
              {member.name}
            </span>
            <span className="text-xs text-slate-500">{member.email}</span>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-600">
          {member.phone ?? <span className="text-slate-300 italic">—</span>}
        </span>
      </td>

     
      {/* Status Badge */}
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className={`text-xs font-medium capitalize ${STATUS_STYLES[member.status]}`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${STATUS_DOT[member.status]}`}
          />
          {member.status}
        </Badge>
      </td>

      {/* Joined Date */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-600">
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </td>

      {/* Row Actions */}
      <td className="px-4 py-3 w-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-sm cursor-pointer"
              onClick={() => onView(member)}
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm cursor-pointer"
              onClick={() => onEdit(member)}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onDelete(member)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}