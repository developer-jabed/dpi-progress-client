/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function MyStatsCard({ title, value }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}