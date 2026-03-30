"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContributionViewModal({ open, setOpen, data }: any) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl max-w-2xl p-6">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            💰 Contribution Details
          </DialogTitle>
        </DialogHeader>

        {/* MEMBER INFO CARD */}
        <div className="mt-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border">
          <p className="text-lg font-semibold">
            {data.member?.firstName} {data.member?.lastName}
          </p>
          <p className="text-sm text-gray-500">
            📞 {data.member?.phone || "No phone"}
          </p>
          <p className="text-sm text-gray-500">
            📧 {data.user?.email}
          </p>
        </div>

        {/* GRID DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="font-bold text-green-600 text-lg">৳ {data.amount}</p>
          </div>

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Month</p>
            <p className="font-semibold">{data.month}</p>
          </div>

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Year</p>
            <p className="font-semibold">{data.year}</p>
          </div>

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Type</p>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
              {data.type || "Donation"}
            </span>
          </div>

          <div className="p-3 border rounded-xl md:col-span-2">
            <p className="text-gray-500 text-sm">Reason</p>
            <p className="font-medium">
              {data.reason || "No reason provided"}
            </p>
          </div>

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Donate By</p>
            <p className="font-medium">
              {data.donateBy || "Self"}
            </p>
          </div>

          <div className="p-3 border rounded-xl">
            <p className="text-gray-500 text-sm">Payment Date</p>
            <p className="font-medium">
              {new Date(data.paidAt).toLocaleDateString()}
            </p>
          </div>

        </div>

        {/* FOOTER CARD */}
        <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total Donated by Member
          </p>
          <p className="text-lg font-bold text-green-600">
            ৳ {data.totalDonatedByThisMember || data.amount}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}