import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCAStore } from "@/store/ca";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const ALL_STATES = "all_states";

export function CAManagement() {
  const { cas, loading, fetchCAs, createCA, updateCA, deleteCA, isloading } =
    useCAStore();
  const [filteredCAs, setFilteredCAs] = useState<typeof cas>([]);
  const [selectedState, setSelectedState] = useState<string>(ALL_STATES);
  const [formData, setFormData] = useState({
    name: "",
    experience: 0,
    phoneNumber: "",
    state: "",
    district: "",
    city: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState = {
    name: "",
    experience: 0,
    phoneNumber: "",
    state: "",
    district: "",
    city: "",
  };

  useEffect(() => {
    fetchCAs();
  }, [fetchCAs]);

  useEffect(() => {
    filterCAs(selectedState);
  }, [cas, selectedState]);

  const states = Array.isArray(cas)
    ? Array.from(new Set(cas.map((ca) => ca?.state).filter(Boolean)))
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCA(editingId, formData);
      setEditingId(null);
    } else {
      await createCA(formData);
    }
    setFormData(initialFormState);
  };

  const handleEdit = (ca: (typeof cas)[0]) => {
    setFormData({
      name: ca.name,
      experience: ca.experience,
      phoneNumber: ca.phoneNumber,
      state: ca.state,
      district: ca.district,
      city: ca.city,
    });
    setEditingId(ca.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = async (id: number) => {
    await deleteCA(id);
  };

  const filterCAs = (state: string) => {
    setSelectedState(state);
    if (state === ALL_STATES) {
      setFilteredCAs(cas);
    } else {
      setFilteredCAs(cas.filter((ca) => ca.state === state));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-32 py-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">CA Management</h1>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">
            {editingId ? "Edit CA" : "Add New CA"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-600">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-blue-600">
                Experience (years)
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-blue-600">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-blue-600">
                State
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
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
                value={formData.district}
                onChange={handleInputChange}
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
                value={formData.city}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-x-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isloading}
              >
                {isloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : editingId ? (
                  <Pencil className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {editingId ? "Update" : "Add"} CA
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mb-4">
        <Label htmlFor="state-filter" className="text-blue-600">
          Filter by State
        </Label>
        <Select value={selectedState} onValueChange={filterCAs}>
          <SelectTrigger
            id="state-filter"
            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
          >
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATES}>All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(
          Array.isArray(filteredCAs) && filteredCAs.length > 0
            ? filteredCAs
            : Array.isArray(cas)
              ? cas
              : []
        ).map((ca) => (
          <Card
            key={ca.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">{ca.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">Experience: {ca.experience} years</p>
              <p className="text-blue-600">Phone: {ca.phoneNumber}</p>
              <p className="text-blue-600">State: {ca.state}</p>
              <p className="text-blue-600">District: {ca.district}</p>
              <p className="text-blue-600">City: {ca.city}</p>
              <div className="mt-4 space-x-2">
                <Button
                  onClick={() => handleEdit(ca)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-red-600">
                        Are you sure you want to delete this CA?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the CA's information.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(ca.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

