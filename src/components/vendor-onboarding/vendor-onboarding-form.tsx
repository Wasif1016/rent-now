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
  Store,
  User,
  MapPin,
  CheckCircle2,
  CarFront,
  Camera,
  DollarSign,
  Plus,
  ArrowRight,
  Trash2,
  X,
  Loader2,
  Lightbulb,
  Phone,
  Flag,
  Save,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Update Vendor interface to be more flexible if needed, or just keep it and use null for prop
interface Vendor {
  id: string;
  name: string;
  phone: string | null;
  whatsappPhone: string | null;
  email: string | null;
  address: string | null;
  cityId: string | null;
  town?: string | null;
}

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

interface City {
  id: string;
  name: string;
  slug: string;
}

interface VehicleFormData {
  title: string;
  brand: string;
  type: string;
  images: string[];
  priceWithinCity: string;
  priceOutOfCity: string;
  features: string[];
}

interface VendorOnboardingFormProps {
  vendor?: Vendor | null;
  brands: VehicleBrand[];
  types: VehicleType[];
  cities: City[];
}

// Available vehicle types with branded icons
const AVAILABLE_VEHICLE_TYPES = [
  { name: "Sedan", icon: "/vehicle-types/sedan.png" },
  { name: "SUV", icon: "/vehicle-types/suv.png" },
  { name: "Hatchback", icon: "/vehicle-types/hatchback.png" },
  { name: "Van", icon: "/vehicle-types/van.png" },
  { name: "Bus", icon: "/vehicle-types/bus.png" },
  { name: "Motorcycle", icon: "/vehicle-types/motorcycle.png" },
];

export function VendorOnboardingForm({
  vendor,
  brands,
  types,
  cities,
}: VendorOnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [vendorData, setVendorData] = useState({
    name: vendor?.name || "",
    phone: vendor?.phone || "",
    whatsappPhone: vendor?.whatsappPhone || "",
    email: vendor?.email || "",
    address: vendor?.address || "",
    cityId: vendor?.cityId || "",
  });

  const [vehicles, setVehicles] = useState<VehicleFormData[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleFormData>({
    title: "",
    brand: "",
    type: "",
    images: [],
    priceWithinCity: "",
    priceOutOfCity: "",
    features: [],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [openBrandSelect, setOpenBrandSelect] = useState(false);

  const handleVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectVendorCity = (value: string) => {
    setVendorData((prev) => ({ ...prev, cityId: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (typeName: string) => {
    const matchedType = types.find(
      (t) => t.name.toLowerCase() === typeName.toLowerCase()
    );
    const value = matchedType ? matchedType.id : typeName.toLowerCase();
    setCurrentVehicle((prev) => ({ ...prev, type: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setCurrentVehicle((prev) => {
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

  // Check if type is selected
  const isTypeSelected = (typeName: string) => {
    const currentType = currentVehicle.type;
    if (!currentType) return false;
    const dbType = types.find(
      (t) => t.name.toLowerCase() === typeName.toLowerCase()
    );
    if (dbType && dbType.id === currentType) return true;
    return currentType === typeName.toLowerCase();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "folder",
      vendor ? `vendor-${vendor.id}` : "public-uploads"
    );

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setCurrentVehicle((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setCurrentVehicle((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVehicle = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (
      !currentVehicle.title ||
      !currentVehicle.brand ||
      !currentVehicle.type ||
      currentVehicle.images.length === 0
    ) {
      setErrorMessage(
        "Please fill in all mandatory fields (Title, Brand, Type, and at least one image)."
      );
      return;
    }

    setVehicles((prev) => [...prev, currentVehicle]);
    setCurrentVehicle({
      title: "",
      brand: "",
      type: "",
      images: [],
      priceWithinCity: "",
      priceOutOfCity: "",
      features: [],
    });
    setBrandSearch("");
    setSuccessMessage("Vehicle added to list.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const removeVehicle = (index: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (vehicles.length === 0) {
      setErrorMessage("Please add at least one vehicle before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vendor: vendorData,
        vehicles: vehicles,
      };

      let response;
      if (vendor?.id) {
        response = await fetch(`/api/vendor-onboarding/${vendor.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/public/list-car`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      setSuccessMessage(
        "Your details and vehicles have been submitted successfully!"
      );
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-slate-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            RentNowPk
            <span className="text-[#C0F11C] ml-1 text-sm bg-black px-1 rounded">
              Partner
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#C0F11C]/20 flex items-center justify-center text-[#1a2332] font-semibold text-sm">
            V
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 w-full mx-auto p-4 md:p-8",
          step === 2
            ? "grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
            : "max-w-3xl py-12 md:py-16"
        )}
      >
        {/* Step 1: Business Details Layout */}
        {step === 1 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Stepper */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative max-w-lg mx-auto">
                {/* Step 1: Active */}
                <div className="flex flex-col items-center relative z-10 w-24">
                  <div className="w-10 h-10 rounded-full bg-[#1a2332] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-[#1a2332] text-center">
                    Business Details
                  </span>
                </div>
                {/* Connector */}
                <div className="flex-grow h-0.5 bg-gray-200 relative top-[-14px]">
                  <div className="h-full bg-[#1a2332] w-1/2 rounded-full"></div>
                </div>
                {/* Step 2: Pending */}
                <div className="flex flex-col items-center relative z-10 w-24">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center ring-4 ring-white">
                    <CarFront className="w-5 h-5" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-400 text-center">
                    Add Vehicles
                  </span>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-6 md:px-8 pt-8 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-serif">
                  Let&apos;s get your business set up.
                </h1>
                {vendor ? (
                  <p className="text-slate-500">
                    Review your details below. We&apos;ve pre-filled this from
                    your registration data.
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Enter your business details to get started. No account
                    needed.
                  </p>
                )}
              </div>
              <hr className="border-slate-100 mx-6 md:mx-8" />

              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-slate-700">
                    Business Name
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="w-5 h-5 text-slate-400 group-hover:text-[#C0F11C] transition-colors" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={vendorData.name}
                      onChange={handleVendorChange}
                      className="pl-10 h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]"
                      placeholder="Enter your legal business name"
                    />
                    {vendorData.name.length > 2 && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CheckCircle2 className="w-5 h-5 text-[#C0F11C]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700">
                      Contact Email
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-400 group-hover:text-[#C0F11C] transition-colors" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        value={vendorData.email || ""}
                        onChange={handleVendorChange}
                        className="pl-10 h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="whatsappPhone" className="text-slate-700">
                      WhatsApp Number
                    </Label>
                    <div className="flex rounded-lg shadow-sm group">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-sm group-hover:border-[#C0F11C] transition-colors">
                        <Flag className="w-4 h-4 mr-2" /> +92
                      </span>
                      <Input
                        id="whatsappPhone"
                        name="whatsappPhone"
                        value={vendorData.whatsappPhone || ""}
                        onChange={handleVendorChange}
                        className="rounded-l-none h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]"
                        placeholder="300 1234567"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <span className="inline-block w-4 h-4 rounded-full bg-[#1a2332]/10 text-[#1a2332] text-[10px] font-bold flex items-center justify-center mr-1">
                        i
                      </span>{" "}
                      Used for urgent booking notifications.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cityId" className="text-slate-700">
                    City
                  </Label>
                  <Select
                    value={vendorData.cityId || ""}
                    onValueChange={handleSelectVendorCity}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities &&
                        cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-slate-700">
                    Business Address
                  </Label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MapPin className="w-5 h-5 text-slate-400 group-hover:text-[#C0F11C] transition-colors" />
                    </div>
                    <Textarea
                      id="address"
                      name="address"
                      value={vendorData.address || ""}
                      onChange={handleVendorChange}
                      className="pl-10 pt-3 h-28 resize-none bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]"
                      placeholder="Street Address, City..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between border-t border-slate-100 mt-8 gap-4">
                  <Button
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-900 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-[#1a2332] hover:bg-[#1a2332]/90 text-white shadow-lg shadow-[#1a2332]/20 h-12 px-8 w-full sm:w-auto"
                  >
                    Next: Add Vehicles <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-8 mb-8">
              Need help?{" "}
              <a
                href="#"
                className="text-[#1a2332] hover:underline font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Step 2: Add Vehicles Layout */}
        {step === 2 && (
          <div className="contents animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Left Column: Form */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1a2332]">
                    Step 2 of 2
                  </span>
                  <span className="text-sm text-slate-500">
                    Vehicle Information
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C0F11C] w-full rounded-full"></div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">
                  Add your fleet
                </h1>
                <p className="text-slate-500">
                  Enter the details of the vehicle you want to list on the
                  marketplace.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                      <CarFront className="w-5 h-5 text-[#C0F11C]" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        Basic Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block">Brand</Label>
                        <Popover
                          open={openBrandSelect}
                          onOpenChange={setOpenBrandSelect}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBrandSelect}
                              className="w-full justify-between h-12 bg-slate-50 border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-normal hover:border-[#C0F11C]/50"
                            >
                              {currentVehicle.brand
                                ? brands.find(
                                    (brand) => brand.id === currentVehicle.brand
                                  )?.name
                                : "Select Brand"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0"
                            align="start"
                          >
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <input
                                  className="w-full pl-9 pr-4 py-2 text-sm bg-transparent outline-none placeholder:text-slate-400 focus:text-slate-900"
                                  placeholder="Search brand..."
                                  value={brandSearch}
                                  onChange={(e) =>
                                    setBrandSearch(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1">
                              {filteredBrands.length === 0 ? (
                                <div className="py-6 text-center text-sm text-slate-500">
                                  No brands found.
                                </div>
                              ) : (
                                filteredBrands.map((brand) => (
                                  <div
                                    key={brand.id}
                                    className={cn(
                                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 cursor-pointer",
                                      currentVehicle.brand === brand.id &&
                                        "bg-[#C0F11C]/20 text-slate-900 font-medium"
                                    )}
                                    onClick={() => {
                                      handleSelectChange("brand", brand.id);
                                      setOpenBrandSelect(false);
                                      setBrandSearch("");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 text-[#1a2332]",
                                        currentVehicle.brand === brand.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {brand.name}
                                  </div>
                                ))
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="mb-2 block">Model Name</Label>
                        <Input
                          name="title"
                          value={currentVehicle.title}
                          onChange={handleVehicleChange}
                          className="h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C]"
                          placeholder="e.g. Corolla Altis X"
                        />
                      </div>
                    </div>

                    {/* Type Selection */}
                    <div>
                      <Label className="mb-3 block">Vehicle Type</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                        {AVAILABLE_VEHICLE_TYPES.map((type) => (
                          <div
                            key={type.name}
                            onClick={() => handleTypeSelect(type.name)}
                            className={cn(
                              "cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center text-center transition-all hover:border-[#C0F11C] hover:shadow-md group h-32 relative overflow-hidden",
                              isTypeSelected(type.name)
                                ? "border-[#C0F11C] bg-[#C0F11C]/10 text-slate-900 ring-1 ring-[#C0F11C]"
                                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-white"
                            )}
                          >
                            <div className="relative mb-3 w-16 h-10">
                              <Image
                                src={type.icon}
                                alt={type.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span
                              className={cn(
                                "block text-xs font-bold uppercase tracking-wide",
                                isTypeSelected(type.name)
                                  ? "text-[#1a2332]"
                                  : ""
                              )}
                            >
                              {type.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Selection */}
                    <div>
                      <Label className="mb-3 block">Vehicle Features</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {AVAILABLE_FEATURES.map((feature) => {
                          const isSelected =
                            currentVehicle.features.includes(feature);
                          return (
                            <div
                              key={feature}
                              onClick={() => handleFeatureToggle(feature)}
                              className={cn(
                                "cursor-pointer rounded-lg border px-4 py-3 flex items-center gap-3 transition-all hover:border-[#C0F11C] group",
                                isSelected
                                  ? "border-[#C0F11C] bg-[#C0F11C]/10 text-slate-900 ring-1 ring-[#C0F11C]"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                                  isSelected
                                    ? "border-[#C0F11C] bg-[#C0F11C]"
                                    : "border-slate-300 bg-white"
                                )}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-[#1a2332]" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium transition-colors",
                                  isSelected
                                    ? "text-[#1a2332] font-semibold"
                                    : "text-slate-600"
                                )}
                              >
                                {feature}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Photos */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-[#C0F11C]" />
                        <h3 className="text-lg font-semibold text-slate-800">
                          Vehicle Photos
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        Min 1 photo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {currentVehicle.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                        >
                          <Image
                            src={img}
                            alt="Vehicle"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeImage(index)}
                              className="text-white hover:text-red-400 p-2 bg-black/20 rounded-full backdrop-blur-sm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-[#C0F11C]/5 hover:border-[#C0F11C]/50 flex flex-col items-center justify-center text-slate-400 hover:text-[#1a2332] cursor-pointer transition-colors relative group">
                        <Input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 animate-spin text-[#C0F11C]" />
                        ) : (
                          <Plus className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {uploadingImage ? "Uploading..." : "Add Photo"}
                        </span>
                      </div>
                    </div>

                    {/* Pro Tip Moved Here */}
                    <div className="bg-[#1a2332]/5 rounded-xl p-4 border border-[#1a2332]/10">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-[#1a2332] mt-0.5 fill-[#1a2332]/20" />
                        <div>
                          <h4 className="text-sm font-bold text-[#1a2332] mb-1">
                            Pro Tip
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Uploading high-quality photos from multiple angles
                            increases booking rates by up to 40%.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Pricing */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                      <DollarSign className="w-5 h-5 text-[#C0F11C]" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        Pricing Configuration
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block text-slate-700">
                          Daily Rate (Within City)
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 font-bold group-focus-within:text-[#C0F11C]">
                              Rs.
                            </span>
                          </div>
                          <Input
                            type="number"
                            name="priceWithinCity"
                            value={currentVehicle.priceWithinCity}
                            onChange={handleVehicleChange}
                            className="pl-10 h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C] font-semibold text-lg"
                            placeholder="5000"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-xs text-slate-400 font-medium">
                              /day
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block text-slate-700">
                          Daily Rate (Outstation)
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 font-bold group-focus-within:text-[#C0F11C]">
                              Rs.
                            </span>
                          </div>
                          <Input
                            type="number"
                            name="priceOutOfCity"
                            value={currentVehicle.priceOutOfCity}
                            onChange={handleVehicleChange}
                            className="pl-10 h-12 bg-slate-50 border-slate-300 focus:border-[#C0F11C] focus:ring-[#C0F11C] font-semibold text-lg"
                            placeholder="8000"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-xs text-slate-400 font-medium">
                              /day
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  {/* Back, Add, Complete */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto text-slate-400 hover:text-slate-600 text-sm h-12"
                    >
                      Back
                    </Button>
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full justify-end">
                      <Button
                        type="button"
                        onClick={addVehicle}
                        variant="outline"
                        className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 h-12 border-dashed border-2 hover:border-[#1a2332] hover:text-[#1a2332]"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add A New Vehicle
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || vehicles.length === 0}
                        className="flex-1 sm:flex-none bg-[#1a2332] hover:bg-[#1a2332]/90 text-white h-12 shadow-lg shadow-[#1a2332]/20 text-base font-semibold px-8"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" /> Publish Vehicle
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  {/* Sidebar Header */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex justify-between items-center">
                    <div>
                      <h2 className="font-bold text-lg text-slate-900">
                        Your Garage
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Summary of added vehicles
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#C0F11C]/20 text-[#1a2332] flex items-center justify-center font-bold text-sm">
                      {vehicles.length}
                    </div>
                  </div>

                  {/* List */}
                  <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
                    {vehicles.length === 0 ? (
                      <div className="text-center py-10 text-slate-300 border-2 border-dashed border-slate-100 rounded-lg">
                        <CarFront className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium text-slate-400">
                          No vehicles added yet
                        </p>
                        <p className="text-xs">
                          Fill the form to add your first car
                        </p>
                      </div>
                    ) : (
                      vehicles.map((v, i) => (
                        <div
                          key={i}
                          className="group relative bg-white rounded-lg border border-slate-200 p-3 flex gap-3 hover:border-[#C0F11C]/50 transition-colors shadow-sm"
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-100 relative border border-slate-100">
                            {v.images[0] && (
                              <Image
                                src={v.images[0]}
                                alt={v.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">
                              {v.title}
                            </h4>
                            <span className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                              {brands.find((b) => b.id === v.brand)?.name} •{" "}
                              {v.type}
                            </span>
                            <span className="text-xs font-bold text-[#1a2332] mt-1 bg-gray-100 w-fit px-1.5 rounded">
                              Rs. {v.priceWithinCity}/day
                            </span>
                          </div>
                          <button
                            onClick={() => removeVehicle(i)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
