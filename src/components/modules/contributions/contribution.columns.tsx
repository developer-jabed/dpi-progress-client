/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const contributionColumns = (onView: (data: any) => void) => [
  {
    header: "Member",
    accessorKey: "member",
    cell: ({ row }: any) => {
      const member = row.original?.member;
      return (
        <div className="flex flex-col">
          <p className="font-semibold">
            {member?.firstName} {member?.lastName}
          </p>
          {member?.phone && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {member.phone}
            </p>
          )}
        </div>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }: any) => (
      <span className="font-bold text-green-600 dark:text-green-500">
        ৳ {Number(row.original?.amount || 0).toLocaleString()}
      </span>
    ),
  },
  {
    header: "Month",
    accessorKey: "month",
    cell: ({ row }: any) => {
      const month = row.original?.month;
      return (
        <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
          {month || "—"}
        </span>
      );
    },
  },
  {
    header: "Year",
    accessorKey: "year",
    cell: ({ row }: any) => (
      <span className="font-medium">{row.original?.year || "—"}</span>
    ),
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {row.original?.type || "Donation"}
      </span>
    ),
  },
  {
    header: "Paid Date",
    accessorKey: "createdAt",
    cell: ({ row }: any) => {
      const dateStr = row.original?.paidAt || row.original?.createdAt;
      return dateStr ? (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : (
        "—"
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }: any) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onView(row.original)}
      >
        <Eye className="w-4 h-4 mr-1.5" />
        View
      </Button>
    ),
  },
];