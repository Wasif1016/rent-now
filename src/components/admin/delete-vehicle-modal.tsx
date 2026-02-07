"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Car } from "lucide-react";
import { logActivity } from "@/lib/services/activity-log.service";

interface DeleteVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Single vehicle */
  vehicleId?: string;
  vehicleTitle?: string;
  /** Bulk vehicles */
  vehicleIds?: string[];
  vehicleTitles?: string[];
}

export function DeleteVehicleModal({
  open,
  onOpenChange,
  vehicleId,
  vehicleTitle,
  vehicleIds,
  vehicleTitles,
}: DeleteVehicleModalProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBulk = Array.isArray(vehicleIds) && vehicleIds.length > 0;
  const ids = isBulk ? vehicleIds! : vehicleId ? [vehicleId] : [];
  const titles = isBulk ? vehicleTitles! : vehicleTitle ? [vehicleTitle] : [];
  const count = ids.length;

  const handleDelete = async () => {
    if (!session?.access_token) {
      setError("You must be logged in to delete vehicles");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isBulk) {
        const response = await fetch("/api/admin/vehicles/bulk-delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete vehicles");
        }
      } else if (vehicleId) {
        // Single delete
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete vehicle");
        }
      }

      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete vehicles:", err);
      setError(err.message || "An error occurred while deleting vehicles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Vehicle{count > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {count === 1 ? (
              <strong>{titles[0]}</strong>
            ) : (
              <strong>{count} vehicles</strong>
            )}{" "}
            and all associated data (bookings, inquiries, logs).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
              <li>All associated image files</li>
              <li>Booking history specific to these vehicles</li>
              <li>Related inquiries</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading
                ? "Deleting..."
                : count > 1
                ? `Delete ${count} Vehicles`
                : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
