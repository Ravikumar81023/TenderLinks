//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, ArrowDown, ArrowUp } from "lucide-react";
import { useSectorStore } from "@/store/sector";
import SectorCard from "@/components/SectorCard";

export interface Sector {
  id?: number; // Making id optional since it might not be present in the interface
  name: string;
}

// Sorting options enum
enum SortOrder {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

const SectorManage = () => {
  const { getSectors, createSector, sectors, loading } = useSectorStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Added sorting state
  const [sortedSectors, setSortedSectors] = useState<Sector[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASCENDING);

  useEffect(() => {
    getSectors();
  }, [getSectors]);

  // Sort sectors whenever the original sectors array changes or sort order changes
  useEffect(() => {
    if (sectors && sectors.length > 0) {
      const sorted = [...sectors].sort((a, b) => {
        // Handle cases where id might not exist
        const idA = a.id ?? 0;
        const idB = b.id ?? 0;

        return sortOrder === SortOrder.ASCENDING ? idA - idB : idB - idA;
      });

      setSortedSectors(sorted);
    } else {
      setSortedSectors([]);
    }
  }, [sectors, sortOrder]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Sector name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await createSector(name.trim());
      setName("");
    } catch (err) {
      setError("Failed to create sector. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === SortOrder.ASCENDING
        ? SortOrder.DESCENDING
        : SortOrder.ASCENDING,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">
        Sector Management
      </h1>
      <div className="grid gap-8 ">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Add New Sector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-600">
                  Sector Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter sector name"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Sector...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sector
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-blue-700">
              Existing Sectors
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-blue-600"
            >
              Sort by ID
              {sortOrder === SortOrder.ASCENDING ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : sortedSectors.length === 0 ? (
              <div className="text-center py-8 text-blue-600">
                No sectors found. Add your first sector.
              </div>
            ) : (
              <SectorCard sectors={sortedSectors} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SectorManage;
