"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Key } from "lucide-react";
import { changePassword } from "@/service/auth/auth.service";

// ─── Component ────────────────────────────────────────────────────────────────

const ChangePasswordPage = () => {
  const [state, action, isPending] = useActionState(changePassword, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-muted-foreground mt-1">Update your account password</p>
      </div>

      <form action={action}>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error banner */}
            {state && !state.success && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {state.message}
              </div>
            )}

            {/* Success banner */}
            {state?.success && (
              <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-md text-sm">
                {state.message}
              </div>
            )}

            <div className="grid gap-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  placeholder="Enter current password"
                  required
                  disabled={isPending}
                  // Restore value after failed submission
                  defaultValue={state?.formData?.oldPassword ?? ""}
                />
                {state?.errors?.find((e) => e.field === "oldPassword") && (
                  <p className="text-xs text-destructive">
                    {state.errors.find((e) => e.field === "oldPassword")?.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  required
                  disabled={isPending}
                  defaultValue={state?.formData?.newPassword ?? ""}
                />
                {state?.errors?.find((e) => e.field === "newPassword") && (
                  <p className="text-xs text-destructive">
                    {state.errors.find((e) => e.field === "newPassword")?.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  required
                  disabled={isPending}
                  defaultValue={state?.formData?.confirmPassword ?? ""}
                />
                {state?.errors?.find((e) => e.field === "confirmPassword") && (
                  <p className="text-xs text-destructive">
                    {state.errors.find((e) => e.field === "confirmPassword")?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ChangePasswordPage;