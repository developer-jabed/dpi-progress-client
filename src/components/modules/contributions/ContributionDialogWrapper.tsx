/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

import ContributionTable from "./ContributionTable";
import ContributionFormDialog from "./ContributionFormDialog";
import ContributionViewModal from "./ContributionViewModal";
import type { Contribution } from "@/types/contribution";   // ← Import shared type

interface Props {
  initialMembers: any[];
  initialContributions: Contribution[];
}

export default function ContributionClient({
  initialMembers,
  initialContributions = [],
}: Props) {
  const [contributions, setContributions] = useState<Contribution[]>(initialContributions);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Contribution | null>(null);

  const handleView = (data: Contribution) => {
    setSelected(data);
    setViewOpen(true);
  };

  const handleCreated = useCallback((newContribution: Contribution) => {
    setContributions((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return [newContribution, ...current];
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">💰 Contributions</h1>
          <p className="text-gray-500 mt-1">
            Manage all member contributions • Total Records: {contributions.length}
          </p>
        </div>

        <Button onClick={() => setOpen(true)} size="lg">
          ➕ Create Contribution
        </Button>
      </div>

      <ContributionTable
        data={contributions}
        onView={handleView}
      />

      <ContributionFormDialog
        open={open}
        setOpen={setOpen}
        initialMembers={initialMembers}
        onCreated={handleCreated}
      />

      <ContributionViewModal
        open={viewOpen}
        setOpen={setViewOpen}
        data={selected}
      />
    </div>
  );
}