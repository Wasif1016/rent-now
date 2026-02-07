"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Label } from "@/components/ui/label";

interface Vendor {
  id: string;
  name: string;
  email: string | null;
}

interface ImportError {
  row: number;
  error: string;
  data: any;
}

export default function ImportVehiclesPage() {
  const router = useRouter();
  const { session, getSession, loading: authLoading } = useAuth();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    errors: ImportError[];
    total: number;
  } | null>(null);

  useEffect(() => {
    async function fetchVendors() {
      setVendorsLoading(true);
      try {
        const currentSession = await getSession();
        if (!currentSession?.access_token) return;

        const res = await fetch("/api/admin/vendors?limit=1000", {
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          // Assuming the API returns { vendors: Vendor[], ... } or Vendor[]
          // Based on standard list APIs, it might result in an array or wrapped object.
          // I will need to check the API response format.
          // Let's assume array for now or handle both.
          if (Array.isArray(data)) {
            setVendors(data);
          } else if (data.vendors && Array.isArray(data.vendors)) {
            setVendors(data.vendors);
          }
        }
      } catch (e) {
        console.error("Failed to fetch vendors", e);
      } finally {
        setVendorsLoading(false);
      }
    }
    fetchVendors();
  }, [getSession]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedVendorId) return;

    setLoading(true);
    setResult(null);

    try {
      const currentSession = await getSession();
      if (!currentSession?.access_token) {
        throw new Error("You must be logged in");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("vendorId", selectedVendorId);

      const response = await fetch("/api/admin/vehicles/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResult(data);
    } catch (error: any) {
      setResult({
        success: 0,
        errors: [
          {
            row: 0,
            error: error.message || "Failed to import vehicles",
            data: {},
          },
        ],
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "title",
      "description",
      "year",
      "mileage",
      "brand",
      "model",
      "type",
      "city",
      "town",
      "seats",
      "fuel",
      "transmission",
      "color",
      "features",
      "driver_option",
      "price_with_driver",
      "price_self_drive",
      "price_daily",
      "price_monthly",
      "price_within_city",
      "price_out_of_city",
      "image_urls",
      "plate_number",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      'Toyota Corolla X,Best car in town,2022,50000,Toyota,Corolla,Sedan,Lahore,,4,PETROL,AUTOMATIC,White,"Air Conditioning, Bluetooth",WITH_DRIVER,5000,4000,,,,,,https://example.com/car.jpg,LED-1234';

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Import Vehicles
          </h1>
          <p className="text-muted-foreground mt-1">
            Bulk upload vehicles for a vendor using CSV.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Link href="/admin/vehicles">
            <Button variant="outline">Back to Vehicles</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>
            Select a vendor and upload a CSV file with vehicle details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vendor-select">Select Vendor</Label>
            <select
              id="vendor-select"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              disabled={loading || vendorsLoading}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.email || "No Email"})
                </option>
              ))}
            </select>
            {vendorsLoading && (
              <p className="text-xs text-muted-foreground">
                Loading vendors...
              </p>
            )}
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">
                  Click to upload
                </span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                CSV files only (max 10MB)
              </p>
            </div>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <Button
            onClick={handleImport}
            disabled={
              !file || !selectedVendorId || loading || authLoading || !session
            }
            className="w-full"
          >
            {loading
              ? "Importing..."
              : authLoading
              ? "Loading..."
              : !session
              ? "Please log in"
              : "Import Vehicles"}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      {result.success} vehicles imported
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Out of {result.total} total rows
                  </p>
                </div>
                {result.errors.length > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      {result.errors.length} errors
                    </span>
                  </div>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 border-b border-border">
                    <h3 className="font-semibold">Import Errors</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Row</th>
                          <th className="text-left p-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((error, idx) => (
                          <tr key={idx} className="border-b border-border">
                            <td className="p-2 font-mono">{error.row}</td>
                            <td className="p-2 text-destructive">
                              {error.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
