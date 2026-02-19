"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface CredentialViewerProps {
  value: string;
  label?: string;
  isPassword?: boolean;
}

export function CredentialViewer({
  value,
  label,
  isPassword = true,
}: CredentialViewerProps) {
  const [visible, setVisible] = useState(!isPassword);
  const [copied, setCopied] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-muted-foreground mb-1 block">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={visible ? "text" : "password"}
            value={value}
            readOnly
            className="pr-10 font-mono bg-muted/50"
          />
        </div>
        {isPassword && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVisibility}
            type="button"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          type="button"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
