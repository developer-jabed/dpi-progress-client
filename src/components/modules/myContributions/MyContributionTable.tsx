"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function MyContributionTable({ data = {} }: any) {
    const history = data?.contributions || [];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">
                    📊 Contribution History
                </h2>

                <span className="text-sm text-gray-500">
                    Total: {history.length}
                </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="text-left py-3">Month</th>
                            <th className="text-left py-3">Year</th>
                            <th className="text-left py-3">Amount</th>
                            <th className="text-left py-3">Type</th>
                            <th className="text-left py-3">Donor</th>
                            <th className="text-left py-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.length > 0 ? (
                            history.map((item: any, i: number) => (
                                <tr
                                    key={i}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    {/* MONTH */}
                                    <td className="py-3 font-medium">
                                        {item.month}
                                    </td>

                                    {/* YEAR */}
                                    <td>{item.year}</td>

                                    {/* AMOUNT */}
                                    <td className="text-green-600 font-semibold">
                                        ৳ {item.amount}
                                    </td>

                                    {/* TYPE BADGE */}
                                    <td>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${item.type === "Donation"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-blue-100 text-blue-600"
                                                }`}
                                        >
                                            {item.type}
                                        </span>
                                    </td>

                                    {/* DONOR */}
                                    <td>{item.donateBy || "Self"}</td>

                                    {/* DATE */}
                                    <td className="text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    No contributions yet 😢
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* FOOTER SUMMARY */}
            {history.length > 0 && (
                <div className="mt-5 pt-4 border-t flex justify-between text-sm text-gray-600">
                    <span>
                        💰 Total Amount:{" "}
                        <b className="text-green-600">
                            ৳{" "}
                            {history.reduce(
                                (sum: number, item: any) => sum + item.amount,
                                0
                            )}
                        </b>
                    </span>

                    <span>
                        📅 Last Payment:{" "}
                        {new Date(
                            history[history.length - 1]?.createdAt
                        ).toLocaleDateString()}
                    </span>
                </div>
            )}
        </div>
    );
}