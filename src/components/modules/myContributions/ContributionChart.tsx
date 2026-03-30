"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function ContributionChart({ data = {} }: any) {
    console.log(data.contrinutions)
    // Transform API response to chart-friendly array
    const chartData = allMonths.map((month) => {
        // Sum contributions for this month
        const monthContrib = data.contributions?.filter(
            (c: any) => c.month === month
        );
        const total = monthContrib?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;

        return { month, total };
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow border">
            <h2 className="font-semibold mb-4">Monthly Contribution Overview</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <Tooltip formatter={(value: any) => `৳ ${value}`} />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#4ade80" // green
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}