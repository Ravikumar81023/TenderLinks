//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocationStore } from "@/store/location";
import { toast } from "react-toastify";
import LocationTable from "@/components/LocationTable";
import { Loader2, Plus } from "lucide-react";

export interface LocationFormData {
  state: string;
  district: string;
  city?: string;
}

const LocationManagement = () => {
  const [formData, setFormData] = useState<LocationFormData>({
    state: "",
    district: "",
    city: "",
  });
  const [error, setError] = useState("");

  const { createLocation, getLocations, locations, loading } =
    useLocationStore();

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.state.trim() || !formData.district.trim()) {
      setError("State and District are required");
      return;
    }

    try {
      await createLocation(formData);
      toast.success("Location submitted successfully");
      setFormData({ state: "", district: "", city: "" });
    } catch (error: any) {
      setError(error.message || "Failed to create location");
      toast.error(error.message || "Failed to create location");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">
        Location Management
      </h1>
      <div className="grid gap-8">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Add New Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-blue-600">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="text-blue-600">
                  District
                </Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  placeholder="Enter district"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-blue-600">
                  City (Optional)
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Location...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Existing Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : locations.length === 0 ? (
              <div className="text-center py-8 text-blue-600">
                No locations found. Add your first location.
              </div>
            ) : (
              <LocationTable locations={locations} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationManagement;
