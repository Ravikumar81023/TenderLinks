import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  MapPin,
  Phone,
  Building,
  Pencil,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import useAddressStore from "@/store/address";

interface Address {
  id: number;
  state: string;
  district: string;
  city: string;
  phoneNumbers: string[];
  landmark: string;
  isMainOffice: boolean;
}

export default function AddressManager() {
  const {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const addressData = {
      state: formData.get("state") as string,
      district: formData.get("district") as string,
      city: formData.get("city") as string,
      phoneNumbers: [formData.get("phone") as string],
      landmark: formData.get("landmark") as string,
      isMainOffice: formData.get("isMainOffice") === "on",
    };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
      } else {
        await createAddress(addressData);
      }
      setEditingAddress(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (address: Address) => {
    setDeletingAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAddress) {
      await deleteAddress(deletingAddress.id);
      setDeletingAddress(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4 md:px-28 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">
              Address Management
            </h1>
            <p className="text-blue-600 mt-2">
              Manage your office locations and branches
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleAddNew}
              >
                <Plus size={16} />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-blue-800">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-blue-600">
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      defaultValue={editingAddress?.state || ""}
                      placeholder="Karnataka"
                      required
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-blue-600">
                      District
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      defaultValue={editingAddress?.district || ""}
                      placeholder="Bangalore Urban"
                      required
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-blue-600">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={editingAddress?.city || ""}
                      placeholder="Bangalore"
                      required
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-blue-600">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={editingAddress?.phoneNumbers[0] || ""}
                      placeholder="+91 98765 43210"
                      required
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark" className="text-blue-600">
                    Full Address
                  </Label>
                  <Textarea
                    id="landmark"
                    name="landmark"
                    defaultValue={editingAddress?.landmark || ""}
                    placeholder="Enter complete address with landmark"
                    className="h-24 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isMainOffice"
                    name="isMainOffice"
                    defaultChecked={editingAddress?.isMainOffice}
                    className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isMainOffice" className="text-blue-600">
                    Set as Main Office
                  </Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the address at{" "}
                  <span className="font-medium">
                    {deletingAddress?.landmark}
                  </span>
                  . This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDeletingAddress(null)}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Address
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(addresses)&& addresses.map((address) => (
              <Card
                key={address.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Building className="h-5 w-5 text-blue-500" />
                        {address.city}, {address.district}
                      </CardTitle>
                      {address.isMainOffice && (
                        <CardDescription className="mt-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Main Office
                          </span>
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(address)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-blue-600">{address.landmark}</p>
                      <p className="text-blue-500 text-sm">
                        {address.city}, {address.district}, {address.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-400" />
                    <p className="text-blue-600">
                      {address.phoneNumbers.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && addresses.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-700">
              No addresses yet
            </h3>
            <p className="text-blue-500 mt-2">
              Get started by adding your first address
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

