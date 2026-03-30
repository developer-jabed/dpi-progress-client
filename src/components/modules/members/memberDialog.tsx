"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMember, CreateMemberPayload } from "@/service/members/member.service";


interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateMemberDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setForm(INITIAL_FORM);
    setErrors({});
    setShowPassword(false);
  }

  function handleSubmit() {
    if (!validate()) return;

    startTransition(async () => {
      const toastId = toast.loading("Creating member...", {
        description: `Adding ${form.firstName} ${form.lastName} to the team`,
      });

      try {
        const payload: CreateMemberPayload = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          ...(form.phone.trim() && { phone: form.phone.trim() }),
        };

        const result = await createMember(payload);

        if (result.success) {
          toast.success("Member added successfully", {
            id: toastId,
            description: `${form.firstName} ${form.lastName} has been added`,
          });
          handleClose();
          router.refresh();
        } else {
          toast.error("Failed to add member", {
            id: toastId,
            description: result.message,
          });
        }
      } catch {
        toast.error("Something went wrong", {
          id: toastId,
          description: "Please try again later",
        });
      }
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-slate-900 hover:bg-slate-700 text-white">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add New Member
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Fill in the details below to add a new member to the team.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Sarah"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={isPending}
                className={errors.firstName ? "border-red-400 focus-visible:ring-red-300" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Johnson"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={isPending}
                className={errors.lastName ? "border-red-400 focus-visible:ring-red-300" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@company.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isPending}
              className={errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Phone{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1700-000000"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isPending}
                className={
                  errors.password
                    ? "border-red-400 focus-visible:ring-red-300 pr-10"
                    : "pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-slate-900 hover:bg-slate-700 text-white min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}