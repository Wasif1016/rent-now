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
import { Eye, EyeOff, Copy, Check, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { buildWhatsAppChatLink } from "@/lib/whatsapp";

import { createClient } from "@/lib/supabase-client";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  whatsappPhone?: string;
}

export function ResetPasswordModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  businessEmail,
  businessPhone,
  whatsappPhone,
}: ResetPasswordModalProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleResetPassword = async () => {
    // Ensure session is fresh
    // Force refresh session to get latest token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setError("You must be logged in to reset passwords");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/businesses/${businessId}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setPassword(data.password);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
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

  const handleSendWhatsapp = () => {
    const targetPhone = whatsappPhone || businessPhone;
    if (!targetPhone || !password) return;

    const message = `Hello ${
      businessName || "Partner"
    },\n\nYour account password has been reset.\n\nNew Password: ${password}\n\nPlease login and change it immediately.`;
    const url = buildWhatsAppChatLink(targetPhone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Vendor Password</DialogTitle>
          <DialogDescription>
            Generate a new password for {businessName}
          </DialogDescription>
        </DialogHeader>

        {!password ? (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will vigorously reset the vendor's password. The old
                password will stop working immediately. A new strong password
                will be generated.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={loading}
                variant="destructive"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Login Identifier
                </label>
                <div className="mt-1 font-mono text-sm">
                  {businessEmail || businessPhone || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  New Password
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
                <strong>Important:</strong> Save this password or send it to the
                vendor immediately. It will be encrypted and cannot be retrieved
                later.
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {(whatsappPhone || businessPhone) && (
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSendWhatsapp}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send via WhatsApp
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
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
        )}
      </DialogContent>
    </Dialog>
  );
}
