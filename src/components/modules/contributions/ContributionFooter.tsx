"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ContributionFooter({ data }: any) {
  const result = data


  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-t border-gray-200 dark:border-gray-700 flex justify-between">
      <span className="font-semibold text-gray-700 dark:text-gray-200">
        Total Contributions: ৳ {result.overallTotalContribution}
      </span>
      <span className="font-semibold text-gray-700 dark:text-gray-200">
        Total Donate Count: {result.totalRecords}
      </span>
    </div>
  );
}