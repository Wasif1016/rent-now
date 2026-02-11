"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-radix";
import { Search, X, Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface City {
  id: string;
  name: string;
}

interface BusinessFiltersProps {
  cities: City[];
}

export function BusinessFilters({ cities }: BusinessFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minVehicles, setMinVehicles] = useState(
    searchParams.get("minVehicles") || ""
  );
  const [maxVehicles, setMaxVehicles] = useState(
    searchParams.get("maxVehicles") || ""
  );

  const hasActiveFilters =
    search || city || status || minVehicles || maxVehicles;

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (status) params.set("status", status);
    if (minVehicles) params.set("minVehicles", minVehicles);
    if (maxVehicles) params.set("maxVehicles", maxVehicles);

    router.push(`/admin/businesses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setStatus("");
    setMinVehicles("");
    setMaxVehicles("");
    router.push("/admin/businesses");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {
                    [search, city, status, minVehicles, maxVehicles].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={city || "all"}
                onValueChange={(val) => setCity(val === "all" ? "" : val)}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cities</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status || "all"}
                onValueChange={(val) => setStatus(val === "all" ? "" : val)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="NOT_REGISTERED">Not Registered</SelectItem>
                  <SelectItem value="FORM_SUBMITTED">Form Submitted</SelectItem>
                  <SelectItem value="ACCOUNT_CREATED">
                    Account Created
                  </SelectItem>
                  <SelectItem value="EMAIL_SENT">Email Sent</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minVehicles">Min Vehicles</Label>
              <Input
                id="minVehicles"
                type="number"
                min="0"
                placeholder="0"
                value={minVehicles}
                onChange={(e) => setMinVehicles(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxVehicles">Max Vehicles</Label>
              <Input
                id="maxVehicles"
                type="number"
                min="0"
                placeholder="Any"
                value={maxVehicles}
                onChange={(e) => setMaxVehicles(e.target.value)}
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
