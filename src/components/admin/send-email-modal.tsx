"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-radix";
import { useAuth } from "@/contexts/auth-context";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
}

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  businessName: string;
  businessEmail: string;
  registrationStatus?: string | null;
}

export function SendEmailModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  businessEmail,
  registrationStatus,
}: SendEmailModalProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState(
    "Your Vendor Account Credentials - Rent Now"
  );
  const [body, setBody] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if account is created
  const isAccountCreated =
    registrationStatus === "ACCOUNT_CREATED" ||
    registrationStatus === "EMAIL_SENT" ||
    registrationStatus === "ACTIVE";

  // Fetch email templates
  // Fetch email templates
  const fetchTemplates = useCallback(async () => {
    if (!session?.access_token) return;

    setLoadingTemplates(true);
    try {
      const response = await fetch("/api/admin/email-templates", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.filter((t: EmailTemplate) => t.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (open && session?.access_token) {
      fetchTemplates();
    }
  }, [open, session?.access_token, fetchTemplates]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "custom") {
      setSelectedTemplateId("");
      // Reset to default values
      setSubject("Your Vendor Account Credentials - Rent Now");
      setBody("");
    } else {
      setSelectedTemplateId(templateId);
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setSubject(template.subject);
        setBody(template.body);
      }
    }
  };

  const handleSend = async () => {
    if (!session?.access_token) {
      setError("You must be logged in to send emails");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/businesses/${businessId}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            subject: subject || undefined,
            body: body || undefined,
            templateId:
              selectedTemplateId && selectedTemplateId !== "custom"
                ? selectedTemplateId
                : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Check if error is about account not created
        if (
          data.error?.includes("create account") ||
          data.error?.includes("password not found")
        ) {
          throw new Error(
            "Please create an account first before sending email. The account must be created to generate login credentials."
          );
        }
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
      // Refresh the page to update business status
      router.refresh();
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Email Sent Successfully
            </h3>
            <p className="text-sm text-muted-foreground">
              Credentials have been sent to {businessEmail}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Login Credentials</DialogTitle>
          <DialogDescription>
            Send account credentials to {businessName} via email
          </DialogDescription>
        </DialogHeader>

        {!isAccountCreated && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              <strong>Note:</strong> You need to create an account first before
              sending email. The account must be created to generate login
              credentials.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Email Template (Optional)</Label>
            <Select
              value={selectedTemplateId || "custom"}
              onValueChange={handleTemplateSelect}
              disabled={loadingTemplates}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingTemplates
                      ? "Loading templates..."
                      : "Select a template or use custom"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">
                  Custom / Default Template
                </SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select a template to auto-fill subject and body, or choose
              &quot;Custom&quot; to write your own
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body (HTML)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave empty to use default template. Use {{business_name}}, {{email}}, {{password}}, {{login_url}}, {{username}} variables."
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Available variables: {`{{business_name}}`}, {`{{email}}`},{" "}
              {`{{password}}`}, {`{{login_url}}`}, {`{{username}}`}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
