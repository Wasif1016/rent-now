"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Zap, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase-client";

interface City {
  id: string;
  name: string;
  slug: string;
}

interface VehicleModel {
  id: string;
  name: string;
  slug: string;
  capacity?: number | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
}

interface PredefinedVehicle {
  id: string;
  name: string;
  slug: string;
  capacity: number | null;
  image: string | null;
  bodyType: string | null;
  doors: number | null;
  largeBags: number | null;
  defaultColor: string | null;
  defaultTransmission: string | null;
  vehicleBrand: {
    id: string;
    name: string;
    slug: string;
  };
}

interface VehicleFormProps {
  cities: City[];
  vehicleModels: VehicleModel[];
  vehicleId?: string;
  initialData?: any;
}

export function VehicleForm({
  cities,
  vehicleModels,
  vehicleId,
  initialData,
}: VehicleFormProps) {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [towns, setTowns] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [loadingTowns, setLoadingTowns] = useState(false);
  const [predefinedVehicles, setPredefinedVehicles] = useState<
    PredefinedVehicle[]
  >([]);
  const [loadingPredefined, setLoadingPredefined] = useState(true);
  const [selectedPredefinedId, setSelectedPredefinedId] = useState<string>("");
  const [useCustomVehicle, setUseCustomVehicle] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    vehicleModelId: initialData?.vehicleModelId || "",
    cityId: initialData?.cityId || "",
    townId: initialData?.townId || "",
    title: initialData?.title || "",
    transmission: initialData?.transmission || "",
    seats: initialData?.seats || "",
    seatingCapacity: initialData?.seatingCapacity ?? initialData?.seats ?? "",
    driverOption: initialData?.driverOption || "",
    priceWithDriver: initialData?.priceWithDriver || "",
    priceSelfDrive: initialData?.priceSelfDrive || "",
    priceDaily: initialData?.priceDaily || "",
    priceHourly: initialData?.priceHourly || "",
    priceMonthly: initialData?.priceMonthly || "",
    priceWithinCity: initialData?.priceWithinCity || "",
    priceOutOfCity: initialData?.priceOutOfCity || "",
    images: initialData?.images || [],
    imageUrl: "",
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      setErrors((prev) => ({
        ...prev,
        imageUpload: "You must be logged in to upload an image",
      }));
      return;
    }

    setUploadingImage(true);
    setErrors((prev) => ({ ...prev, imageUpload: "" }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const filePath = `vendor-${user.id}/${fileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      setFormData((prev) => ({
        ...prev,
        images: publicUrl ? [publicUrl] : [],
      }));
    } catch (error: any) {
      console.error("Error uploading vehicle image:", error);
      setErrors((prev) => ({
        ...prev,
        imageUpload: "Failed to upload image. Please try again.",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Fetch predefined vehicles on mount (kept for potential admin usage)
  useEffect(() => {
    fetch("/api/predefined-vehicles")
      .then((res) => res.json())
      .then((data) => {
        setPredefinedVehicles(data);
        setLoadingPredefined(false);
      })
      .catch(() => {
        setLoadingPredefined(false);
      });
  }, []);

  // Fetch towns when city changes
  useEffect(() => {
    if (formData.cityId) {
      setLoadingTowns(true);
      fetch(`/api/towns?cityId=${formData.cityId}`)
        .then((res) => res.json())
        .then((data) => {
          setTowns(data);
          setLoadingTowns(false);
        })
        .catch(() => {
          setLoadingTowns(false);
        });
    } else {
      setTowns([]);
      setFormData((prev) => ({ ...prev, townId: "" }));
    }
  }, [formData.cityId]);

  // Handle predefined vehicle selection
  const handlePredefinedSelect = (vehicle: PredefinedVehicle) => {
    setSelectedPredefinedId(vehicle.id);

    // Auto-populate all fields
    setFormData((prev) => ({
      ...prev,
      vehicleModelId: vehicle.id,
      title: `${vehicle.vehicleBrand.name} ${vehicle.name}`,
      transmission: vehicle.defaultTransmission || "",
      seats: vehicle.capacity?.toString() || "",
      images: vehicle.image ? [vehicle.image] : [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cityId) {
      newErrors.cityId = "City is required";
    }
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    if (
      !formData.seats ||
      isNaN(Number(formData.seats)) ||
      Number(formData.seats) < 1
    ) {
      newErrors.seats = "Seats (passengers) is required and must be at least 1";
    }
    if (!formData.transmission) {
      newErrors.transmission = "Transmission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors({ general: "You must be logged in to add a vehicle" });
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        vehicleModelId: formData.vehicleModelId || null,
        cityId: formData.cityId,
        townId: formData.townId || null,
        title: formData.title.trim(),
        transmission: formData.transmission,
        seats: parseInt(formData.seats),
        seatingCapacity: formData.seatingCapacity
          ? parseInt(String(formData.seatingCapacity), 10)
          : null,
        driverOption: formData.driverOption || null,
        priceWithDriver: formData.priceWithDriver
          ? parseInt(formData.priceWithDriver, 10)
          : null,
        priceSelfDrive: formData.priceSelfDrive
          ? parseInt(formData.priceSelfDrive, 10)
          : null,
        priceDaily: formData.priceDaily
          ? parseInt(formData.priceDaily, 10)
          : null,
        priceHourly: formData.priceHourly
          ? parseInt(formData.priceHourly, 10)
          : null,
        priceMonthly: formData.priceMonthly
          ? parseInt(formData.priceMonthly, 10)
          : null,
        priceWithinCity: formData.priceWithinCity
          ? parseInt(formData.priceWithinCity, 10)
          : null,
        priceOutOfCity: formData.priceOutOfCity
          ? parseInt(formData.priceOutOfCity, 10)
          : null,
        images: Array.isArray(formData.images) ? formData.images : [],
      };

      const url = vehicleId
        ? `/api/vendor/vehicles/${vehicleId}`
        : "/api/vendor/vehicles";
      const method = vehicleId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save vehicle");
      }

      const message = vehicleId
        ? "Vehicle%20updated%20successfully"
        : "Vehicle%20added%20successfully";

      router.push(`/vendor/vehicles?message=${message}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      setErrors({
        general: error.message || "Failed to save vehicle. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          You must be logged in to add a vehicle.
        </p>
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Quick Select has been disabled for vendors – all vehicles are added manually now */}

      {/* Vehicle Title - Required for custom vehicles */}
      {useCustomVehicle && (
        <div className="space-y-2">
          <Label htmlFor="title">Vehicle Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Toyota Corolla 2020"
            required
          />
          {errors.title && (
            <p className="text-xs text-red-600">{errors.title}</p>
          )}
        </div>
      )}

      {/* Custom Vehicle Image Upload */}
      {useCustomVehicle && (
        <div className="space-y-2">
          <Label htmlFor="imageFile">Vehicle Image</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          <p className="text-xs text-muted-foreground">
            Upload a clear photo of your vehicle. It will be stored securely in
            Supabase.
          </p>
          {errors.imageUpload && (
            <p className="text-xs text-red-600">{errors.imageUpload}</p>
          )}
        </div>
      )}

      {/* Preview selected image */}
      {Array.isArray(formData.images) && formData.images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Vehicle</h3>
          <div>
            <Label>Vehicle Image</Label>
            <div className="relative w-full max-w-md aspect-video bg-zinc-100 rounded overflow-hidden mt-2">
              <Image
                src={formData.images[0]}
                alt="Selected vehicle"
                fill
                className="object-contain"
              />
            </div>
            {formData.title && (
              <p className="mt-2 text-sm font-medium">{formData.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Select
              id="city"
              value={formData.cityId}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  cityId: e.target.value,
                  townId: "",
                }));
                setErrors((prev) => ({ ...prev, cityId: "" }));
              }}
              className={errors.cityId ? "border-red-500" : ""}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
            {errors.cityId && (
              <p className="text-xs text-red-600 mt-1">{errors.cityId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="town">Town</Label>
            <Select
              id="town"
              value={formData.townId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, townId: e.target.value }))
              }
              disabled={!formData.cityId || loadingTowns}
            >
              <option value="">
                {loadingTowns ? "Loading..." : "All Towns"}
              </option>
              {towns.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="seats">Seats (Passengers) *</Label>
            <Input
              id="seats"
              type="number"
              value={formData.seats}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, seats: e.target.value }));
                setErrors((prev) => ({ ...prev, seats: "" }));
              }}
              placeholder="5"
              min="1"
              required
              className={errors.seats ? "border-red-500" : ""}
            />
            {errors.seats && (
              <p className="text-xs text-red-600 mt-1">{errors.seats}</p>
            )}
          </div>

          <div>
            <Label htmlFor="transmission">Transmission *</Label>
            <Select
              id="transmission"
              value={formData.transmission}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  transmission: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, transmission: "" }));
              }}
              required
              className={errors.transmission ? "border-red-500" : ""}
            >
              <option value="">Select transmission</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </Select>
            {errors.transmission && (
              <p className="text-xs text-red-600 mt-1">{errors.transmission}</p>
            )}
          </div>

          <div>
            <Label htmlFor="seatingCapacity">
              Seating capacity (for filters)
            </Label>
            <Select
              id="seatingCapacity"
              value={formData.seatingCapacity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seatingCapacity: e.target.value,
                }))
              }
            >
              <option value="">Any</option>
              <option value="2">2 Seater</option>
              <option value="4">4 Seater</option>
              <option value="5">5 Seater</option>
              <option value="7">7 Seater</option>
              <option value="9">9 Seater</option>
              <option value="12">12 Seater</option>
              <option value="15">15 Seater</option>
              <option value="22">22 Seater</option>
              <option value="30">30+ Seater</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="driverOption">Driver option</Label>
            <Select
              id="driverOption"
              value={formData.driverOption}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  driverOption: e.target.value,
                }))
              }
            >
              <option value="">Not specified</option>
              <option value="WITH_DRIVER">With driver</option>
              <option value="WITHOUT_DRIVER">Without driver</option>
              <option value="BOTH">Both</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priceDaily">Price daily (Rs)</Label>
            <Input
              id="priceDaily"
              type="number"
              value={formData.priceDaily}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceDaily: e.target.value }))
              }
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="priceHourly">Price hourly (Rs)</Label>
            <Input
              id="priceHourly"
              type="number"
              value={formData.priceHourly}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceHourly: e.target.value,
                }))
              }
              placeholder="500"
            />
          </div>

          <div>
            <Label htmlFor="priceMonthly">Price monthly (Rs)</Label>
            <Input
              id="priceMonthly"
              type="number"
              value={formData.priceMonthly}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceMonthly: e.target.value,
                }))
              }
              placeholder="80000"
            />
          </div>

          <div>
            <Label htmlFor="priceWithDriver">Price with Driver (Rs/day)</Label>
            <Input
              id="priceWithDriver"
              type="number"
              value={formData.priceWithDriver}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceWithDriver: e.target.value,
                }))
              }
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="priceSelfDrive">Price Self Drive (Rs/day)</Label>
            <Input
              id="priceSelfDrive"
              type="number"
              value={formData.priceSelfDrive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceSelfDrive: e.target.value,
                }))
              }
              placeholder="3000"
            />
          </div>

          <div>
            <Label htmlFor="priceWithinCity">Price Within City (Rs/day)</Label>
            <Input
              id="priceWithinCity"
              type="number"
              value={formData.priceWithinCity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceWithinCity: e.target.value,
                }))
              }
              placeholder="4000"
            />
          </div>

          <div>
            <Label htmlFor="priceOutOfCity">Price Out of City (Rs/day)</Label>
            <Input
              id="priceOutOfCity"
              type="number"
              value={formData.priceOutOfCity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceOutOfCity: e.target.value,
                }))
              }
              placeholder="6000"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : vehicleId ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </div>
    </form>
  );
}
