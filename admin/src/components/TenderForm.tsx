//@ts-nocheck
import type React from "react";
import { useState, useEffect } from "react";
import type { Tender } from "../store/tender";
import { useSectorStore } from "../store/sector";
import { useLocationStore } from "../store/location";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { DocumentViewer } from "./DocumentViewer";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TenderFormProps {
  initialData: Partial<Tender>;
  onChange: (updatedTender: Partial<Tender>) => void;
}

const TenderForm: React.FC<TenderFormProps> = ({ initialData, onChange }) => {
  const { sectors } = useSectorStore();
  const { locations, getLocations } = useLocationStore();
  const [formData, setFormData] = useState<Partial<Tender>>(initialData);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  // Calculate expiry date whenever lastDateOfSubmission or publishDate changes
  useEffect(() => {
    if (!formData.expiryDate) {
      calculateExpiryDate();
    }
  }, [formData.lastDateOfSubmission, formData.publishDate]);

  const calculateExpiryDate = () => {
    let newExpiryDate: Date | null = null;

    if (formData.lastDateOfSubmission) {
      // Set expiry date to 1 day after last date of submission
      const date = new Date(formData.lastDateOfSubmission);
      date.setDate(date.getDate() + 1);
      newExpiryDate = date;
    } else if (formData.publishDate) {
      // Set expiry date to 10 days after published date
      const date = new Date(formData.publishDate);
      date.setDate(date.getDate() + 10);
      newExpiryDate = date;
    }

    if (newExpiryDate) {
      const formattedDate = newExpiryDate.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, expiryDate: formattedDate }));
      onChange({ ...formData, expiryDate: formattedDate });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? Number.parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    onChange({ ...formData, [name]: updatedValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }));
    onChange({ ...formData, [name]: Number.parseInt(value) });
  };

  const handleFileUpload = (files: File[]) => {
    const updatedDocuments = [
      ...(formData.documents || []),
      ...files.map((file) => file), // Store the actual File objects
    ];
    setFormData((prev) => ({ ...prev, documents: updatedDocuments }));
    onChange({ ...formData, documents: updatedDocuments });
  };

  const handleFileDelete = (index: number) => {
    const updatedDocuments = [...(formData.documents || [])];
    updatedDocuments.splice(index, 1);
    setFormData((prev) => ({ ...prev, documents: updatedDocuments }));
    onChange({ ...formData, documents: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="value">Value (₹)</Label>
          <Input
            id="value"
            name="value"
            type="number"
            value={formData.value || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="sectorId">
            Sector <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.sectorId?.toString()}
            onValueChange={(value) => handleSelectChange("sectorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id.toString()}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="locationId">
            Location <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.locationId?.toString()}
            onValueChange={(value) => handleSelectChange("locationId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.city}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="publishDate">
            Publish Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="publishDate"
            name="publishDate"
            type="date"
            value={formData.publishDate || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastDateOfSubmission">Last Date of Submission</Label>
          <Input
            id="lastDateOfSubmission"
            name="lastDateOfSubmission"
            type="date"
            value={formData.lastDateOfSubmission || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">
            Expiry Date{" "}
            <span className="text-gray-500 text-xs">(Auto-calculated)</span>
          </Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate || ""}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="tenderingAuthority">
            Tendering Authority <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tenderingAuthority"
            name="tenderingAuthority"
            value={formData.tenderingAuthority || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="tenderNo">Tender No</Label>
          <Input
            id="tenderNo"
            name="tenderNo"
            value={formData.tenderNo || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="tenderID">
            Tender ID <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tenderID"
            name="tenderID"
            value={formData.tenderID || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="documentFees">Document Fees</Label>
          <Input
            id="documentFees"
            name="documentFees"
            value={formData.documentFees || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="emd">EMD</Label>
          <Input
            id="emd"
            name="emd"
            type="number"
            value={formData.emd || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="biddingType">Bidding Type</Label>
          <Input
            id="biddingType"
            name="biddingType"
            value={formData.biddingType || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="competitionType">Competition Type</Label>
          <Input
            id="competitionType"
            name="competitionType"
            value={formData.competitionType || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="tenderBrief">Tender Brief</Label>
        <Textarea
          id="tenderBrief"
          name="tenderBrief"
          value={formData.tenderBrief || ""}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="documents">Documents</Label>
        <FileUploader onFileUpload={handleFileUpload} />
        {formData.documents && formData.documents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Current Documents
            </h4>
            {formData.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {doc instanceof File ? doc.name : doc.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileDelete(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Note:</strong> Fields marked with{" "}
          <span className="text-red-500">*</span> are required. Expiry date will
          be automatically calculated as 1 day after Last Date of Submission (if
          provided) or 10 days after Publish Date.
        </p>
      </div>
    </div>
  );
};

export default TenderForm;
