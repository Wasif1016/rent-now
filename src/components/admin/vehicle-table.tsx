"use client";

// Force rebuild
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteVehicleModal } from "./delete-vehicle-modal";
import {
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Search,
  MapPin,
  Tag,
  Filter,
  Car,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Vehicle {
  id: string;
  title: string;
  slug: string;
  status: string;
  isAvailable: boolean | null;
  images: any;
  vendor: {
    id: string;
    name: string;
    email: string | null;
  };
  city: {
    id: string;
    name: string;
  } | null;
  vehicleType: {
    id: string;
    name: string;
  } | null;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  total: number;
  totalPages: number;
  currentPage: number;
  cities: Array<{ id: string; name: string }>;
  vehicleTypes: Array<{ id: string; name: string }>;
  vendors: Array<{ id: string; name: string }>;
  filters: {
    vendorId?: string;
    cityId?: string;
    vehicleTypeId?: string;
    status?: string;
    search?: string;
  };
}

export function VehicleTable({
  vehicles,
  total,
  totalPages,
  currentPage,
  cities,
  vehicleTypes,
  vendors,
  filters,
}: VehicleTableProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const selectedVehicles = useMemo(
    () => vehicles.filter((v) => selectedIds.has(v.id)),
    [vehicles, selectedIds]
  );

  const allOnPageSelected =
    vehicles.length > 0 && vehicles.every((v) => selectedIds.has(v.id));

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        vehicles.forEach((v) => next.delete(v.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        vehicles.forEach((v) => next.add(v.id));
        return next;
      });
    }
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setVehicleToDelete(null);
    setDeleteModalOpen(true);
  };

  const openSingleDeleteModal = (id: string, title: string) => {
    setIsBulkDelete(false);
    setVehicleToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    if (newFilters.vendorId) params.set("vendor", newFilters.vendorId);
    if (newFilters.cityId) params.set("city", newFilters.cityId);
    if (newFilters.vehicleTypeId) params.set("type", newFilters.vehicleTypeId);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.search) params.set("search", newFilters.search);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`/admin/vehicles?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchTerm || undefined });
  };

  const handleToggleAvailability = async (
    vehicleId: string,
    currentStatus: boolean | null
  ) => {
    if (!session?.access_token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling vehicle availability:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-4 p-3 mb-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm font-medium">
            {selectedIds.size} vehicle{selectedIds.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={openBulkDeleteModal}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Plate or Model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter dropdowns - same as before */}
          <div className="flex items-center gap-2 w-[180px]">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.cityId || "all"}
              onValueChange={(value) =>
                updateFilters({
                  ...filters,
                  cityId: value !== "all" ? value : undefined,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.vendorId || "all"}
              onValueChange={(value) =>
                updateFilters({
                  ...filters,
                  vendorId: value !== "all" ? value : undefined,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Car className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.vehicleTypeId || "all"}
              onValueChange={(value) =>
                updateFilters({
                  ...filters,
                  vehicleTypeId: value !== "all" ? value : undefined,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                updateFilters({
                  ...filters,
                  status: value !== "all" ? value : undefined,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-10 p-4">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAllOnPage}
                    aria-label="Select all on page"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-sm">Preview</th>
                <th className="text-left p-4 font-semibold text-sm">
                  Vehicle Details
                </th>
                <th className="text-left p-4 font-semibold text-sm">
                  Vendor Partner
                </th>
                <th className="text-left p-4 font-semibold text-sm">
                  Current Status
                </th>
                <th className="text-left p-4 font-semibold text-sm">
                  Marketplace Access
                </th>
                <th className="text-right p-4 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const images = Array.isArray(vehicle.images)
                  ? vehicle.images
                  : [];
                const mainImage =
                  typeof images[0] === "string" ? images[0] : null;

                return (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="w-10 p-4">
                      <Checkbox
                        checked={selectedIds.has(vehicle.id)}
                        onCheckedChange={() => toggleOne(vehicle.id)}
                        aria-label={`Select ${vehicle.title}`}
                      />
                    </td>
                    <td className="p-4">
                      {mainImage ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={mainImage}
                            alt={vehicle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{vehicle.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.city?.name || "N/A"} •{" "}
                        {vehicle.vehicleType?.name || "N/A"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/businesses/${vehicle.vendor.id}`}
                        className="text-primary hover:underline"
                      >
                        {vehicle.vendor.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            vehicle.isAvailable
                              ? "bg-green-500"
                              : vehicle.status === "DRAFT"
                              ? "bg-gray-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-sm">
                          {vehicle.isAvailable
                            ? "Available"
                            : vehicle.status === "DRAFT"
                            ? "Draft"
                            : "Booked"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {vehicle.status === "PUBLISHED" ? (
                        <Badge className="bg-blue-500">ENABLED</Badge>
                      ) : (
                        <Badge variant="outline">DISABLED</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/listings/${vehicle.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Listing
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleAvailability(
                                  vehicle.id,
                                  vehicle.isAvailable
                                )
                              }
                            >
                              {vehicle.isAvailable ? (
                                <>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openSingleDeleteModal(vehicle.id, vehicle.title)
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {vehicles.length} of {total} results
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link href={`/admin/vehicles?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={`/admin/vehicles?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <DeleteVehicleModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteModalOpen(false);
            setVehicleToDelete(null);
            setIsBulkDelete(false);
          } else {
            setDeleteModalOpen(true);
          }
        }}
        vehicleId={
          !isBulkDelete && vehicleToDelete ? vehicleToDelete.id : undefined
        }
        vehicleTitle={
          !isBulkDelete && vehicleToDelete ? vehicleToDelete.title : undefined
        }
        vehicleIds={
          isBulkDelete && selectedIds.size > 0
            ? Array.from(selectedIds)
            : undefined
        }
        vehicleTitles={
          isBulkDelete && selectedVehicles.length > 0
            ? selectedVehicles.map((v) => v.title)
            : undefined
        }
      />
    </div>
  );
}
