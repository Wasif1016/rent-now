"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CarFront,
  Camera,
  CheckCircle2,
  X,
  Loader2,
  Save,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { useTownsLoader } from "@/hooks/use-towns-loader";

interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
}

interface VehicleType {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Vendor {
  id: string;
  name: string;
  slug: string;
}

interface AddVehicleFormProps {
  brands: VehicleBrand[];
  types: VehicleType[];
  cities: City[];
  vendors: Vendor[];
}

// Common vehicle features
const AVAILABLE_FEATURES = [
  "Air Conditioning",
  "Bluetooth",
  "GPS Navigation",
  "USB Port",
  "Sunroof",
  "Heated Seats",
  "Backup Camera",
  "Parking Sensors",
  "Cruise Control",
  "Android Auto / Apple CarPlay",
  "Tinted Windows",
  "Leather Seats",
];

export function AddVehicleForm({
  brands,
  types,
  cities,
  vendors,
}: AddVehicleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vendorId: "",
    cityId: "",
    townId: "",
    title: "",
    brand: "",
    type: "",
    images: [] as string[],
    priceWithinCity: "",
    priceOutOfCity: "",
    features: [] as string[],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [openBrandSelect, setOpenBrandSelect] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [townSearch, setTownSearch] = useState("");

  const { towns } = useTownsLoader({
    cityId: formData.cityId,
    enabled: !!formData.cityId,
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredTowns = towns.filter((town) =>
    town.name.toLowerCase().includes(townSearch.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      if (exists) {
        return {
          ...prev,
          features: prev.features.filter((f) => f !== feature),
        };
      } else {
        return { ...prev, features: [...prev.features, feature] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append(
      "folder",
      formData.vendorId ? `vendor-${formData.vendorId}` : "admin-uploads"
    );

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.vendorId ||
      !formData.title ||
      !formData.brand ||
      !formData.type ||
      formData.images.length === 0 ||
      !formData.cityId
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Logic to resolve vehicle model and create vehicle logic similar to public API
      // We can reuse the public API logic but we need to pass a constructed payload
      // OR we implement a specific admin API endpoint.
      // Reusing public API might be tricky as it expects a structured payload with vendor info.

      // Let's call a new server action or API route?
      // Or just call the same API but constructed carefully?
      // The public API creates a vendor if needed. Here we select an existing vendor.

      // I'll create a new API route: /api/admin/vehicles/create
      // It will handle the vehicle creation logic specifically for admins.

      const payload = {
        vendorId: formData.vendorId,
        cityId: formData.cityId,
        townId: formData.townId,
        title: formData.title,
        brandId: formData.brand, // Pass ID if selected from list
        brandName:
          brands.find((b) => b.id === formData.brand)?.name || formData.brand, // Fallback if custom
        typeId: formData.type, // Pass ID if selected from list
        typeName:
          types.find((t) => t.id === formData.type)?.name || formData.type, // Fallback if custom
        images: formData.images,
        priceWithinCity: formData.priceWithinCity,
        priceOutOfCity: formData.priceOutOfCity,
        features: formData.features,
      };

      const response = await fetch("/api/admin/vehicles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create vehicle");
      }

      setSuccess("Vehicle created successfully!");
      setTimeout(() => {
        router.push("/admin/vehicles");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Creation error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get brand display name
  const getBrandDisplay = () => {
    const b = brands.find((brand) => brand.id === formData.brand);
    return b ? b.name : "Select Brand";
  };

  const getTypeDisplay = () => {
    // Check if type is a valid ID
    const t = types.find((type) => type.id === formData.type);
    return t ? t.name : "Select Type";
  };

  const getCityDisplay = () => {
    const c = cities.find((city) => city.id === formData.cityId);
    return c ? c.name : "Select City";
  };

  const getVendorDisplay = () => {
    const v = vendors.find((vendor) => vendor.id === formData.vendorId);
    return v ? v.name : "Select Vendor";
  };

  const getTownDisplay = () => {
    const t = towns.find((town) => town.id === formData.townId);
    if (t) return t.name;
    if (formData.townId) return formData.townId; // Custom town name
    return "Select Town";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vendor Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
            Vendor Information
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="vendorId">Vendor *</Label>
            <Combobox
              value={formData.vendorId}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, vendorId: value || "" }));
                setVendorSearch("");
              }}
            >
              <ComboboxInput
                placeholder={getVendorDisplay()}
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full"
              />
              <ComboboxContent>
                <ComboboxList>
                  {filteredVendors.map((vendor) => (
                    <ComboboxItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="cityId">City *</Label>
              <Combobox
                value={formData.cityId}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    cityId: value || "",
                    townId: "",
                  }));
                  setCitySearch("");
                }}
              >
                <ComboboxInput
                  placeholder={getCityDisplay()}
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {filteredCities.map((city) => (
                      <ComboboxItem key={city.id} value={city.id}>
                        {city.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="townId">Town / Area</Label>
              <Combobox
                value={formData.townId}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, townId: value || "" }));
                  setTownSearch("");
                }}
                disabled={!formData.cityId}
              >
                <ComboboxInput
                  placeholder={getTownDisplay()}
                  value={townSearch}
                  onChange={(e) => setTownSearch(e.target.value)}
                  className="w-full"
                  disabled={!formData.cityId}
                />
                <ComboboxContent>
                  <ComboboxList>
                    {filteredTowns.map((town) => (
                      <ComboboxItem key={town.id} value={town.id}>
                        {town.name}
                      </ComboboxItem>
                    ))}
                    {filteredTowns.length === 0 &&
                      townSearch.trim().length > 0 && (
                        <ComboboxItem
                          value={townSearch}
                          className="italic text-slate-500"
                        >
                          <span className="mr-2">+</span> Add "{townSearch}"
                        </ComboboxItem>
                      )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
            Vehicle Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label>Brand *</Label>
              <Popover open={openBrandSelect} onOpenChange={setOpenBrandSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openBrandSelect}
                    className="w-full justify-between font-normal"
                  >
                    {getBrandDisplay()}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--anchor-width] p-0"
                  align="start"
                >
                  <div className="p-2">
                    <Input
                      placeholder="Search brand..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="mb-2 h-8"
                    />
                    <div className="max-h-[200px] overflow-y-auto space-y-1">
                      {filteredBrands.map((brand) => (
                        <div
                          key={brand.id}
                          className={cn(
                            "cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100",
                            formData.brand === brand.id &&
                              "bg-slate-100 font-medium"
                          )}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              brand: brand.id,
                            }));
                            setOpenBrandSelect(false);
                            setBrandSearch("");
                          }}
                        >
                          {brand.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Model / Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Corolla Altis 1.6"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
            Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-slate-200"
              >
                <Image
                  src={img}
                  alt={`Vehicle ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-[#C0F11C] hover:bg-slate-50 transition-colors aspect-[4/3]">
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">
                    Add Photo
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
            Pricing (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="priceWithinCity">Price Within City</Label>
              <Input
                id="priceWithinCity"
                name="priceWithinCity"
                type="number"
                value={formData.priceWithinCity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priceOutOfCity">Price Out of City</Label>
              <Input
                id="priceOutOfCity"
                name="priceOutOfCity"
                type="number"
                value={formData.priceOutOfCity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
            Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_FEATURES.map((feature) => (
              <div
                key={feature}
                onClick={() => handleFeatureToggle(feature)}
                className={cn(
                  "cursor-pointer flex items-center p-3 rounded-lg border text-sm transition-all",
                  formData.features.includes(feature)
                    ? "border-[#C0F11C] bg-[#C0F11C]/10 text-slate-900 font-medium"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border mr-3 flex items-center justify-center transition-colors",
                    formData.features.includes(feature)
                      ? "border-[#C0F11C] bg-[#C0F11C]"
                      : "border-slate-300"
                  )}
                >
                  {formData.features.includes(feature) && (
                    <Check className="w-3 h-3 text-[#1a2332]" />
                  )}
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm border border-green-100">
            {success}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#1a2332] text-white hover:bg-[#1a2332]/90 w-full sm:w-auto"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}
