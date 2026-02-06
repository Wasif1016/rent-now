"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId?: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessIds?: string[];
  businessNames?: string[];
}

export function CreateAccountModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  businessEmail,
  businessPhone,
  businessIds,
  businessNames,
}: CreateAccountModalProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  const isBulk = !!businessIds && businessIds.length > 0;

  const handleCreateAccount = async () => {
    if (!session?.access_token) {
      setError("You must be logged in to create accounts");
      return;
    }

    setLoading(true);
    setError(null);
    setBulkResult(null);

    try {
      if (isBulk) {
        // Bulk account creation
        const response = await fetch(
          `/api/admin/businesses/bulk-create-accounts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ businessIds }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create accounts");
        }

        setBulkResult(data);
        router.refresh();
      } else if (businessId) {
        // Single account creation
        const response = await fetch(
          `/api/admin/businesses/${businessId}/create-account`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (
            data.error?.includes("already exists") ||
            data.error?.includes("already been registered")
          ) {
            throw new Error(
              'Account already exists in Supabase. Please use "Reset Password" to generate new credentials, or contact support to link the existing account.'
            );
          }
          throw new Error(data.error || "Failed to create account");
        }

        setPassword(data.password);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isBulk ? "Create Vendor Accounts (Bulk)" : "Create Vendor Account"}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? `Create accounts for ${businessIds?.length} selected businesses`
              : `Create a Supabase account for ${businessName}`}
          </DialogDescription>
        </DialogHeader>

        {!password && !bulkResult ? (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isBulk
                  ? "This will create Supabase authentication accounts for all selected vendors. Strong passwords will be generated automatically."
                  : "This will create a Supabase authentication account for the vendor. A strong password will be generated automatically."}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAccount} disabled={loading}>
                {loading
                  ? "Creating..."
                  : isBulk
                  ? "Create All Accounts"
                  : "Create Account"}
              </Button>
            </div>
          </div>
        ) : bulkResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total:</span>
                <span className="font-mono text-sm">{bulkResult.total}</span>
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span className="text-sm font-medium">Success:</span>
                <span className="font-mono text-sm">{bulkResult.success}</span>
              </div>
              {bulkResult.failed > 0 && (
                <div className="flex items-center justify-between text-destructive">
                  <span className="text-sm font-medium">Failed:</span>
                  <span className="font-mono text-sm">{bulkResult.failed}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                <strong>Note:</strong> Passwords have been encrypted and stored.
                You can send them to vendors via email.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => {
                    setBulkResult(null);
                    router.refresh();
                  }, 100);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : password ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Login Identifier (Email/Phone)
                </label>
                <div className="mt-1 font-mono text-sm">
                  {businessEmail || businessPhone || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 font-mono text-sm bg-background px-3 py-2 rounded border border-border">
                    {showPassword ? password : "•".repeat(password.length)}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                <strong>Important:</strong> Save this password securely. It will
                be encrypted and stored. You can send it to the vendor via
                email.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  // Reset state when closing
                  setTimeout(() => {
                    setPassword(null);
                    setShowPassword(false);
                    router.refresh();
                  }, 100);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
