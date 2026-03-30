/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ContributionFooter from "./ContributionFooter";
import type { Contribution } from "@/types/contribution";

interface Props {
  data: Contribution[] | any;   // Allow flexible input
  onView: (data: Contribution) => void;
}

export default function ContributionTable({ data = [], onView }: Props) {
  // 🔥 Handle both direct array and wrapped response
  const contributionsList: Contribution[] = Array.isArray(data) 
    ? data 
    : (data?.contributions || data?.data || []);

 

  const columns = [
    {
      header: "Member",
      accessor: (row: Contribution) => {
        const member = row?.member;
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
      accessor: (row: Contribution) => (
        <span className="font-bold text-green-600 dark:text-green-500">
          ৳ {Number(row?.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Month",
      accessor: (row: Contribution) => (
        <span className="capitalize font-medium">{row?.month || "—"}</span>
      ),
    },
    {
      header: "Year",
      accessor: (row: Contribution) => row?.year || "—",
    },
    {
      header: "Type",
      accessor: (row: Contribution) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {row?.type || "Donation"}
        </span>
      ),
    },
    {
      header: "Paid Date",
      accessor: (row: Contribution) => {
        const dateStr = row?.paidAt || row?.createdAt;
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
      accessor: (row: Contribution) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(row)}
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-gray-800">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {contributionsList.length > 0 ? (
              contributionsList.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="py-4 px-4 align-top">
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-20 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-5xl">💰</span>
                    <p className="text-lg">No contributions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ContributionFooter data={data} />
    </div>
  );
}