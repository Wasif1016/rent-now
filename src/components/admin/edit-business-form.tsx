"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

import { ResetPasswordModal } from "@/components/admin/reset-password-modal";
import { CreateAccountModal } from "@/components/admin/create-account-modal";

interface City {
  id: string;
  name: string;
  slug: string;
  province: string | null;
}

interface Business {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsappPhone: string | null;
  personName: string | null;
  cityId: string | null;
  town: string | null;
  province: string | null;
  address: string | null;
  description: string | null;
  googleMapsUrl: string | null;
  supabaseUserId: string | null;
}

interface EditBusinessFormProps {
  business: Business;
}

export function EditBusinessForm({ business }: EditBusinessFormProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  const [name, setName] = useState(business.name || "");
  const [email, setEmail] = useState(business.email || "");
  const [phone, setPhone] = useState(business.phone || "");
  const [whatsappPhone, setWhatsappPhone] = useState(
    business.whatsappPhone || ""
  );
  const [personName, setPersonName] = useState(business.personName || "");
  const [cityId, setCityId] = useState(business.cityId || "");
  const [town, setTown] = useState(business.town || "");
  const [province, setProvince] = useState(business.province || "");
  const [address, setAddress] = useState(business.address || "");
  const [description, setDescription] = useState(business.description || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    business.googleMapsUrl || ""
  );

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        if (res.ok) {
          const data = await res.json();
          setCities(data);
        }
      } catch {
        setCities([]);
      }
    };
    loadCities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Business name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!session?.access_token) {
        setError("You must be logged in to update a business");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          whatsappPhone: whatsappPhone.trim() || null,
          personName: personName.trim() || null,
          cityId: cityId || null,
          town: town.trim() || null,
          province: province.trim() || null,
          address: address.trim() || null,
          description: description.trim() || null,
          googleMapsUrl: googleMapsUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your session may have expired. Please log in again."
          );
        }
        if (response.status === 403) {
          throw new Error("Admin access required.");
        }
        throw new Error(data.error || "Failed to update business");
      }

      router.push(`/admin/businesses/${business.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/businesses/${business.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Business</h1>
          <p className="text-muted-foreground mt-1">
            Update details for {business.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>Update the information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Business name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Car Rentals"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92-300-1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappPhone">WhatsApp Phone</Label>
                <Input
                  id="whatsappPhone"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+92-300-1234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personName">Contact person name</Label>
              <Input
                id="personName"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Manager name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cityId">City</Label>
                <select
                  id="cityId"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.province ? ` (${c.province})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="town">Town / area</Label>
                <Input
                  id="town"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="e.g. Gulberg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Punjab"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short business description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
              <Input
                id="googleMapsUrl"
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update business"}
              </Button>
              <Link href={`/admin/businesses/${business.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Access</CardTitle>
          <CardDescription>Manage password and account access.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div>
              <h3 className="font-medium">
                {business.supabaseUserId ? "Reset Password" : "Create Account"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {business.supabaseUserId
                  ? "Generate a new password for this vendor."
                  : "This vendor does not have an account yet. Create one now."}
              </p>
            </div>
            {business.supabaseUserId ? (
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  setResetModalOpen(true);
                }}
              >
                Reset Password
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setCreateAccountOpen(true);
                }}
              >
                Create Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ResetPasswordModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        businessId={business.id}
        businessName={business.name}
        businessEmail={business.email || undefined}
        businessPhone={business.phone || undefined}
        whatsappPhone={business.whatsappPhone || undefined}
      />
    </div>
  );
}
