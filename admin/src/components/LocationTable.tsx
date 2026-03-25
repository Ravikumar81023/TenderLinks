//@ts-nocheck
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationFormData } from "./LocationManagement";
import { useLocationStore } from "@/store/location";

interface Props {
  locations: (LocationFormData & { id?: number })[];
}

const LocationTable: React.FC<Props> = ({ locations }) => {
  const { deleteLocation, getLocations, updateLocation, isLoading } =
    useLocationStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    (LocationFormData & { id?: number }) | null
  >(null);
  const [editFormData, setEditFormData] = useState<LocationFormData>({
    state: "",
    district: "",
    city: "",
  });

  const handleEdit = (location: LocationFormData & { id?: number }) => {
    setSelectedLocation(location);
    setEditFormData({
      state: location.state,
      district: location.district,
      city: location.city || "",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteLocation(id);
    await getLocations();
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation?.id) return;
    await updateLocation(selectedLocation.id, editFormData);
    await getLocations();
    setEditDialogOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-blue-600">ID</TableHead>
            <TableHead className="text-blue-600">State</TableHead>
            <TableHead className="text-blue-600">District</TableHead>
            <TableHead className="text-blue-600">City</TableHead>
            <TableHead className="text-blue-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id} className="hover:bg-blue-50">
              <TableCell>{location.id}</TableCell>
              <TableCell>{location.state}</TableCell>
              <TableCell>{location.district}</TableCell>
              <TableCell>{location.city || "N/A"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(location)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation(location);
                      setDeleteDialogOpen(true);
                    }}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-700">
              Edit Location
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="text-blue-600">
                State
              </Label>
              <Input
                id="state"
                name="state"
                value={editFormData.state}
                onChange={handleEditChange}
                required
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
                value={editFormData.district}
                onChange={handleEditChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-blue-600">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={editFormData.city}
                onChange={handleEditChange}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-red-600">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedLocation?.id && handleDelete(selectedLocation.id)
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationTable;
