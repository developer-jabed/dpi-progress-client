"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";
import { createContribution } from "@/service/contributions/contribution.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;        // UUID — userId
  numericId: number; // numeric member id
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  joinedAt: string;
}

interface FormState {
  memberId: string;  // numericId as string
  userId: string;    // UUID
  type: string;
  amount: number;
  month: string;
  year: string;
  reason: string;
  donateBy: string;
  donatepersonNUmber: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialMembers: Member[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreated?: (newContribution: any) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const INITIAL_FORM: FormState = {
  memberId: "",
  userId: "",
  type: "MembersMonthly",
  amount: 30,
  month: "",
  year: new Date().getFullYear().toString(),
  reason: "",
  donateBy: "",
  donatepersonNUmber: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContributionFormDialog({
  open,
  setOpen,
  initialMembers,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: FormErrors = {};

    if (!form.memberId) e.memberId = "Please select a member";
    if (!form.type) e.type = "Please select a contribution type";
    if (!form.amount || form.amount <= 0) e.amount = "Enter a valid amount";
    if (!form.month) e.month = "Please select a month";
    if (!form.year) e.year = "Year is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleMemberSelect(value: string) {
    const member = initialMembers.find((m) => String(m.numericId) === value);
    setForm((prev) => ({
      ...prev,
      memberId: value,           // numericId → memberId
      userId: member?.id ?? "",  // UUID      → userId
    }));
    if (errors.memberId) {
      setErrors((prev) => ({ ...prev, memberId: undefined }));
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    setOpen(false);
    setForm(INITIAL_FORM);
    setErrors({});
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await createContribution(null, form);

      if (result?.success) {
        toast.success("Contribution created successfully");
        onCreated?.(result.data ?? form);
        handleClose();
      } else {
        toast.error(result?.message ?? "Failed to create contribution");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-slate-500" />
            New Contribution
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
          {/* Member */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Member <span className="text-red-500">*</span>
            </Label>
            <Select value={form.memberId} onValueChange={handleMemberSelect}>
              <SelectTrigger className={errors.memberId ? "border-red-400" : ""}>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {initialMembers.map((member) => (
                  <SelectItem key={member.id} value={String(member.numericId)}>
                    {member.name}
                    {member.phone ? ` (${member.phone})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.memberId && (
              <p className="text-xs text-red-500">{errors.memberId}</p>
            )}
          </div>

          {/* Contribution Type */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.type}
              onValueChange={(v) => handleField("type", v)}
            >
              <SelectTrigger className={errors.type ? "border-red-400" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MembersMonthly">Monthly Fee</SelectItem>
                <SelectItem value="Donation">Donation</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          {/* Amount */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Amount (৳) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => handleField("amount", Number(e.target.value))}
              className={errors.amount ? "border-red-400" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Month <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.month}
                onValueChange={(v) => handleField("month", v)}
              >
                <SelectTrigger className={errors.month ? "border-red-400" : ""}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && (
                <p className="text-xs text-red-500">{errors.month}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Year <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={2000}
                max={2100}
                value={form.year}
                onChange={(e) => handleField("year", e.target.value)}
                className={errors.year ? "border-red-400" : ""}
              />
              {errors.year && (
                <p className="text-xs text-red-500">{errors.year}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="md:col-span-2 grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Reason / Note{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              value={form.reason}
              onChange={(e) => handleField("reason", e.target.value)}
              placeholder="e.g. Eid donation"
            />
          </div>

          {/* Donated By */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Donated By{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              value={form.donateBy}
              onChange={(e) => handleField("donateBy", e.target.value)}
              placeholder="Name of donor"
            />
          </div>

          {/* Donor Phone */}
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Donor Phone{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              type="tel"
              value={form.donatepersonNUmber}
              onChange={(e) => handleField("donatepersonNUmber", e.target.value)}
              placeholder="+880 1700-000000"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-slate-700 text-white min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Save Contribution
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}