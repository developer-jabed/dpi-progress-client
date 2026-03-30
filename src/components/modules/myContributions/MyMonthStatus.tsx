/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function MyMonthStatus({ paid = [], joinMonth = 1 }: any) {
    const currentMonthIndex = new Date().getMonth(); // 0-based
    const joinMonthIndex = joinMonth - 1; // convert to 0-based if passed as 1-12

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow border">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Monthly Status</h2>
                <p className="text-gray-600 font-medium dark:text-gray-400">
                    Contributions start from {allMonths[joinMonthIndex]}
                </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {allMonths.map((month, index) => {
                    let bgClass = "bg-red-100 text-red-600"; // default = not paid

                    if (paid?.includes(month)) {
                        bgClass = "bg-green-100 text-green-700"; // Paid
                    } else if (index > currentMonthIndex) {
                        bgClass = "bg-yellow-100 text-yellow-700"; // Upcoming
                    } else if (index < joinMonthIndex) {
                        bgClass = "bg-gray-100 text-gray-400"; // Before joining
                    }

                    return (
                        <div
                            key={month}
                            className={`text-center py-2 rounded-lg text-sm font-medium ${bgClass}`}
                        >
                            {month}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}