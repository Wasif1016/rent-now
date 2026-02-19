"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-radix";
import { useAuth } from "@/contexts/auth-context";
import { buildWhatsAppChatLink } from "@/lib/whatsapp";

interface WhatsAppTemplate {
  id: string;
  name: string;
  body: string;
  isActive: boolean;
}

interface SendWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  businessName: string;
  businessPhone: string | null;
  businessEmail?: string | null;
  registrationStatus?: string | null;
  initialMessage?: string;
  password?: string;
}

export function SendWhatsAppModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  businessPhone,
  businessEmail,
  registrationStatus,
  initialMessage = "",
  password,
}: SendWhatsAppModalProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPhone = Boolean(businessPhone?.trim());
  const isAccountCreated =
    registrationStatus === "ACCOUNT_CREATED" ||
    registrationStatus === "EMAIL_SENT" ||
    registrationStatus === "ACTIVE";

  useEffect(() => {
    if (open) {
      if (initialMessage) {
        setCustomMessage(initialMessage);
        setSelectedTemplateId("custom");
      } else {
        setCustomMessage("");
        setSelectedTemplateId(""); // Or default template?
      }
      if (session?.access_token) {
        fetchTemplates();
      }
    }
  }, [open, session?.access_token, initialMessage]);

  const fetchTemplates = async () => {
    if (!session?.access_token) return;
    setLoadingTemplates(true);
    try {
      const response = await fetch("/api/admin/whatsapp-templates", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.filter((t: WhatsAppTemplate) => t.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "custom") {
      setSelectedTemplateId("");
      setCustomMessage("");
    } else {
      setSelectedTemplateId(templateId);
    }
  };

  const fetchPreview = async (): Promise<string | null> => {
    if (!session?.access_token) return null;
    const body: { whatsappTemplateId?: string; customMessage?: string } = {};
    if (selectedTemplateId && selectedTemplateId !== "custom") {
      body.whatsappTemplateId = selectedTemplateId;
    } else if (customMessage.trim()) {
      body.customMessage = customMessage.trim();
    }

    // Pass password if available (for new accounts)
    if (password) {
      (body as any).password = password;
    }
    const response = await fetch(
      `/api/admin/businesses/${businessId}/whatsapp/preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to generate preview");
    }
    return data.message ?? "";
  };

  const handleOpenInWhatsApp = async () => {
    if (!hasPhone || !businessPhone) return;
    if (!session?.access_token) {
      setError("You must be logged in");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const message = await fetchPreview();
      const link = buildWhatsAppChatLink(businessPhone, message ?? undefined);
      window.open(link, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
          <DialogDescription>
            Open WhatsApp with a pre-filled message for {businessName}. You will
            send the message from your own WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {!hasPhone && (
          <div className="p-4 bg-muted border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              No phone number on file. Add a phone or WhatsApp number to this
              business to use this feature.
            </p>
          </div>
        )}

        {hasPhone && (
          <p className="text-sm text-muted-foreground">
            Message will open in WhatsApp for: <strong>{businessPhone}</strong>
          </p>
        )}

        {!isAccountCreated && hasPhone && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              <strong>Note:</strong> Create an account first if you want to
              include login credentials in the message (same as email
              templates).
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Message template (optional)</Label>
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
                <SelectItem value="custom">Custom message</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Create templates in Admin → WhatsApp Templates. Line breaks in
              templates are preserved. Variables: {`{{business_name}}`},{" "}
              {`{{email}}`}, {`{{password}}`}, {`{{login_url}}`},{" "}
              {`{{username}}`}, {`{{vendor_listing_url}}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp-custom-message">
              Custom message (plain text)
            </Label>
            <Textarea
              id="whatsapp-custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Leave empty when using a template. Use {{business_name}}, {{email}}, {{password}}, {{login_url}}, {{username}}, {{vendor_listing_url}}."
              rows={8}
              className="font-mono text-sm"
              disabled={
                !!(selectedTemplateId && selectedTemplateId !== "custom")
              }
            />
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
            <Button
              onClick={handleOpenInWhatsApp}
              disabled={loading || !hasPhone}
            >
              {loading ? "Opening..." : "Open in WhatsApp"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
