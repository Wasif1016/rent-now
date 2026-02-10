"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-radix";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

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

interface VehicleFormData {
  title: string;
  brand: string;
  type: string;
  images: string[];
  priceWithinCity: string;
  priceOutOfCity: string;
}

interface VendorOnboardingFormProps {
  vendor: Vendor;
  brands: VehicleBrand[];
  types: VehicleType[];
}

export function VendorOnboardingForm({
  vendor,
  brands,
  types,
}: VendorOnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [vendorData, setVendorData] = useState({
    name: vendor.name || "",
    phone: vendor.phone || "",
    whatsappPhone: vendor.whatsappPhone || "",
    email: vendor.email || "",
    address: vendor.address || "",
  });

  const [vehicles, setVehicles] = useState<VehicleFormData[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleFormData>({
    title: "",
    brand: "",
    type: "",
    images: [],
    priceWithinCity: "",
    priceOutOfCity: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `vendor-${vendor.id}`);

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
    // Validate current vehicle
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
    });
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

      const response = await fetch(`/api/vendor-onboarding/${vendor.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      setSuccessMessage(
        "Your details and vehicles have been submitted successfully!"
      );

      // Redirect to a thank you page or refresh
      setTimeout(() => {
        router.push("/"); // Redirect to home
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

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= 1
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground text-muted-foreground"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
          />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= 2
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground text-muted-foreground"
            }`}
          >
            2
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/20 text-sm">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/15 text-green-600 p-4 rounded-md border border-green-500/20 text-sm">
          {successMessage}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              Please review and update your business information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={vendorData.name}
                  onChange={handleVendorChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={vendorData.email}
                  onChange={handleVendorChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleVendorChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappPhone">WhatsApp Phone</Label>
                <Input
                  id="whatsappPhone"
                  name="whatsappPhone"
                  value={vendorData.whatsappPhone}
                  onChange={handleVendorChange}
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={vendorData.address}
                  onChange={handleVendorChange}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)}>Next: Add Vehicles</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Main Form for Adding Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle>Add a Vehicle</CardTitle>
              <CardDescription>
                Enter the details of the vehicle you want to list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Car Title/Name *</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentVehicle.title}
                  onChange={handleVehicleChange}
                  placeholder="e.g. Toyota Corolla Altis 2022"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select
                    value={currentVehicle.brand}
                    onValueChange={(val) => handleSelectChange("brand", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={currentVehicle.type}
                    onValueChange={(val) => handleSelectChange("type", val)}
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
                      {!types.find((t) => t.name.toLowerCase() === "sedan") && (
                        <SelectItem value="sedan">Sedan</SelectItem>
                      )}
                      {!types.find((t) => t.name.toLowerCase() === "suv") && (
                        <SelectItem value="suv">SUV</SelectItem>
                      )}
                      {!types.find(
                        (t) => t.name.toLowerCase() === "hatchback"
                      ) && <SelectItem value="hatchback">Hatchback</SelectItem>}
                      {!types.find((t) => t.name.toLowerCase() === "van") && (
                        <SelectItem value="van">Van</SelectItem>
                      )}
                      {!types.find((t) => t.name.toLowerCase() === "bus") && (
                        <SelectItem value="bus">Bus</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Car Pictures (At least one) *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {currentVehicle.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden border"
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
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-center aspect-video rounded-md border-2 border-dashed border-muted hover:border-primary cursor-pointer relative bg-muted/50">
                    <Input
                      type="file"
                      id="image-upload"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    <div className="text-center space-y-1">
                      {uploadingImage ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      ) : (
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Upload Image
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceWithinCity">
                    Price with driver (Within City)
                  </Label>
                  <Input
                    id="priceWithinCity"
                    name="priceWithinCity"
                    type="number"
                    value={currentVehicle.priceWithinCity}
                    onChange={handleVehicleChange}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceOutOfCity">
                    Price with driver (Outstation)
                  </Label>
                  <Input
                    id="priceOutOfCity"
                    name="priceOutOfCity"
                    type="number"
                    value={currentVehicle.priceOutOfCity}
                    onChange={handleVehicleChange}
                    placeholder="e.g. 8000"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={addVehicle}
                className="w-full"
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </CardContent>
          </Card>

          {/* List of Added Vehicles */}
          {vehicles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Vehicles to Submit ({vehicles.length})
              </h3>
              <div className="grid gap-4">
                {vehicles.map((v, index) => (
                  <Card key={index} className="relative">
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <CardContent className="p-4 flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                        {v.images[0] && (
                          <Image
                            src={v.images[0]}
                            alt={v.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{v.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {brands.find((b) => b.id === v.brand)?.name} •{" "}
                          {types.find((t) => t.id === v.type)?.name || v.type}
                        </p>
                        <div className="flex gap-4 text-xs mt-1">
                          {v.priceWithinCity && (
                            <span>City: Rs. {v.priceWithinCity}</span>
                          )}
                          {v.priceOutOfCity && (
                            <span>Outstation: Rs. {v.priceOutOfCity}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || vehicles.length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit{" "}
              {vehicles.length > 0 ? `(${vehicles.length} Vehicles)` : ""}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
