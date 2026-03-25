//@ts-nocheck
import type React from "react";
import { useEffect, useState } from "react";
import { useTenderStore, type Tender } from "../store/tender";
import { useSectorStore } from "../store/sector";
import { useLocationStore } from "../store/location";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import TenderDialog from "@/components/TenderDialog";
import { DocumentViewer } from "@/components/DocumentViewer";
import { Badge } from "@/components/ui/badge";

const TenderManagement: React.FC = () => {
  const {
    tenders,
    loading,
    error,
    fetchTenders,
    createTender,
    updateTender,
    deleteTender,
  } = useTenderStore();
  const { sectors, getSectors } = useSectorStore();
  const { locations, getLocations } = useLocationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenders, setSelectedTenders] = useState<Partial<Tender>[]>([]);
  const [filters, setFilters] = useState({
    sectorId: "",
    locationId: "",
  });

  useEffect(() => {
    fetchTenders();
    getSectors();
    getLocations();
  }, [fetchTenders, getSectors, getLocations]);

  const handleEdit = (tender: Tender) => {
    setSelectedTenders([{ ...tender }]); // Create a new object to avoid reference issues
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this tender?")) {
      await deleteTender(id);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchTenders(filters);
  };

  const handleSubmit = async (formDataArray: FormData[]) => {
    setIsModalOpen(false);

    for (const formData of formDataArray) {
      const id = formData.get("id");
      if (id) {
        await updateTender(Number(id), formData);
      } else {
        await createTender(formData);
      }
    }

    fetchTenders();
    setSelectedTenders([]);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Check if tender is expiring soon (within 5 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return diffDays > 0 && diffDays <= 5;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Tender Management
      </h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <Select
          onValueChange={(value) => handleFilterChange("sectorId", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Sector" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id.toString()}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange("locationId", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.city}, {location.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>

        <Button
          onClick={() => {
            setSelectedTenders([{}]);
            setIsModalOpen(true);
          }}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Tenders
        </Button>
      </div>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenders.map((tender) => (
          <Card
            key={tender.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-blue-800 flex justify-between items-start">
                <span>{tender.title || "Untitled Tender"}</span>
                {isExpiringSoon(tender.expiryDate) && (
                  <Badge className="bg-amber-500">Expiring Soon</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                ID: {tender.tenderID}
              </p>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-gray-600 mb-4">
                {tender.tenderBrief ||
                  tender.description ||
                  "No description available"}
              </p>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="text-gray-500">Tender No:</span>{" "}
                  {tender.tenderNo || "N/A"}
                </div>
                <div>
                  <span className="text-gray-500">Value:</span>{" "}
                  {tender.value ? `₹${tender.value}` : "N/A"}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-gray-500">Published:</span>{" "}
                  {formatDate(tender.publishDate)}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-gray-500">Expiry:</span>{" "}
                  {formatDate(tender.expiryDate)}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Authority:</span>{" "}
                  {tender.tenderingAuthority}
                </div>
              </div>

              {tender.documents && tender.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Documents
                  </h4>
                  <DocumentViewer documents={tender.documents || []} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(tender)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(tender.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TenderDialog
        isOpen={isModalOpen}
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
        selectedTenders={selectedTenders}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TenderManagement;
