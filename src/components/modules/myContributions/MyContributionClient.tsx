"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import MyStatsCard from "./MyStatsCard";
import MyMonthStatus from "./MyMonthStatus";
import ContributionChart from "./ContributionChart";
import MyContributionTable from "./MyContributionTable";

export default function MyContributionClient({ initialData }: any) {
    const result = initialData;
    console.log(result)

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">My Contribution Dashboard</h1>
                <p className="text-gray-500 text-sm">
                    Track your payments, analytics & performance
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MyStatsCard title="Total Paid" value={`৳ ${result?.totalContribution || 0}`} />
                <MyStatsCard title="Paid Months" value={result?.totalPaidMonths || 0} />
                <MyStatsCard title="Unpaid Months" value={result?.unpaidMonths.length || 0} />
              
            </div>

            {/* CHART */}
            <ContributionChart data={result?.monthlySummary || []} />

            {/* MONTH STATUS */}
            <MyMonthStatus paid={result?.paidMonths || []} unpaid={result?.unpaidMonths || []} />

            {/* TABLE */}
            <MyContributionTable data={result } />
        </div>
    );
}