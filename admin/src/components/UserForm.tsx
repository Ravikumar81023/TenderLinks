//@ts-nocheck
import React, { useState, useEffect } from "react";
import { CustomerUser, CustomerCreateInput } from "../store/customer";
import { useCustomerStore } from "../store/customer";
import { useSectorStore } from "../store/sector";
import { useLocationStore } from "../store/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FileUploader } from "./FileUploader";
import { DocumentViewer } from "./DocumentViewer";

interface UserFormProps {
  initialData?: CustomerUser;
  onSubmit: (formData: CustomerCreateInput) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { sectors, loading: sectorsLoading } = useSectorStore();
  const { locations, loading: locationsLoading } = useLocationStore();

  const [formData, setFormData] = useState<CustomerCreateInput>({
    email: "",
    password: "",
    companyName: "",
    phoneNumbers: [""],
    sectorId: undefined,
    locationId: undefined,
    subscriptionTier: "GUEST",
    annualTurnover: 0,
    documents: [],
  });
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const [subscriptionValidity, setSubscriptionValidity] = useState<Date | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: "",
        sectorId: initialData.sector?.id,
        locationId: initialData.location?.id,
        phoneNumbers:
          initialData.phoneNumbers.length > 0 ? initialData.phoneNumbers : [""],
        annualTurnover: initialData.annualTurnover || 0,
        documents: initialData.documents || [],
      });
      setSubscriptionValidity(
        initialData.subscriptionValidity
          ? new Date(initialData.subscriptionValidity)
          : null,
      );
      setIsDirty(false);
      setValidationErrors({});
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!initialData && !formData.password?.trim()) {
      errors.password = "Password is required for new customers";
    }

    if (!formData.companyName?.trim()) {
      errors.companyName = "Company name is required";
    }

    if (formData.phoneNumbers.some((phone) => !phone.trim())) {
      errors.phoneNumbers = "All phone numbers must be filled";
    }

    if (formData.annualTurnover < 0) {
      errors.annualTurnover = "Annual turnover cannot be negative";
    }
   

    // Add this function to check valid phone numbers
    const isValidPhoneNumber = (phone: string): boolean => {
      // Basic validation for 10 digits
      return /^\d{10}$/.test(phone);
    };
     if (
      formData.phoneNumbers.some((phone) => !isValidPhoneNumber(phone.trim()))
    ) {
      errors.phoneNumbers = "All phone numbers must be valid (10 digits)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  const handlePhoneNumberChange = (index: number, value: string) => {
    // Allow only digits in the input
    const digitsOnly = value.replace(/\D/g, "");

    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index] = digitsOnly;
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: newPhoneNumbers,
    }));
    setIsDirty(true);
  };
  const addPhoneNumber = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: [...prevFormData.phoneNumbers, ""],
    }));
  };

  const removePhoneNumber = (index: number) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: newPhoneNumbers,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  const handleFileUpload = (files: File[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: [...prevFormData.documents, ...files],
    }));
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: newDocuments,
    }));
  };
  const handleFileDelete = (index: number) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: newDocuments,
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      subscriptionValidity,
      sectorId: formData.sectorId
        ? parseInt(formData.sectorId.toString(), 10)
        : undefined,
      locationId: formData.locationId
        ? parseInt(formData.locationId.toString(), 10)
        : undefined,
    };

    try {
      await onSubmit(submissionData);
      setIsDirty(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setValidationErrors((prev) => ({
        ...prev,
        submit: "An error occurred while submitting the form",
      }));
    }
  };
  const cities = locations.filter(
    (location) =>
      location.state === selectedState &&
      location.district === selectedDistrict,
  );
  const districts = locations
    .filter((location) => location.state === selectedState)
    .map((location) => location.district)
    .filter((district, index, self) => self.indexOf(district) === index);
  const states = locations
    .map((location) => location.state)
    .filter((state, index, self) => self.indexOf(state) === index);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.submit && (
        <div className="text-red-600 bg-red-50 p-2 rounded">
          {validationErrors.submit}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email field */}
        <div>
          <Label htmlFor="email" className="text-blue-600">
            Email{" "}
            {validationErrors.email && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 ${validationErrors.email ? "border-red-500" : ""}`}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>
        {/* Password field (only for new users) */}
        {!initialData && (
          <div>
            <Label htmlFor="password" className="text-blue-600">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Company Name field */}
        <div>
          <Label htmlFor="companyName" className="text-blue-600">
            Company Name
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Numbers field */}
        <div>
          <Label className="text-blue-600">Phone Numbers</Label>
          {formData.phoneNumbers.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                value={phone}
                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                placeholder={`Phone number ${index + 1}`}
                className="flex-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removePhoneNumber(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addPhoneNumber}
            className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Add Phone Number
          </Button>
        </div>

        {/* Sector field */}
        <div>
          <Label htmlFor="sectorId" className="text-blue-600">
            Sector
          </Label>
          <Select
            value={formData.sectorId?.toString()}
            onValueChange={(value) => handleSelectChange("sectorId", value)}
          >
            <SelectTrigger className="mt-1 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select Sector" />
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

        {/* State field */}
        <div>
          <Label htmlFor="state" className="text-blue-600">
            State
          </Label>
          <Select
            value={selectedState}
            onValueChange={(value) => setSelectedState(value)}
          >
            <SelectTrigger className="mt-1 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District field */}
        <div>
          <Label htmlFor="district" className="text-blue-600">
            District
          </Label>
          <Select
            value={selectedDistrict}
            onValueChange={(value) => setSelectedDistrict(value)}
          >
            <SelectTrigger className="mt-1 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City field */}
        <div>
          <Label htmlFor="locationId" className="text-blue-600">
            City
          </Label>
          <Select
            value={formData.locationId?.toString()}
            onValueChange={(value) => handleSelectChange("locationId", value)}
          >
            <SelectTrigger className="mt-1 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Annual Turnover field */}
        <div>
          <Label htmlFor="annualTurnover" className="text-blue-600">
            Annual Turnover
          </Label>
          <Input
            id="annualTurnover"
            name="annualTurnover"
            type="number"
            value={formData.annualTurnover}
            onChange={handleInputChange}
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Subscription Tier field */}
      <div>
        <Label htmlFor="subscriptionTier" className="text-blue-600">
          Subscription Tier
        </Label>
        <Select
          value={formData.subscriptionTier}
          onValueChange={(value) =>
            handleSelectChange("subscriptionTier", value)
          }
        >
          <SelectTrigger className="mt-1 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select Subscription Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GUEST">Guest</SelectItem>
            <SelectItem value="GOLD">Gold</SelectItem>
            <SelectItem value="PLATINUM">Platinum</SelectItem>
            <SelectItem value="DIAMOND">Diamond</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscription Validity field */}
      <div>
        <Label className="text-blue-600">Subscription Validity</Label>
        <DatePicker
          selected={subscriptionValidity}
          onChange={(date: Date) => setSubscriptionValidity(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Documents field */}
      <div>
        <Label htmlFor="documents" className="text-blue-600">
          Documents
        </Label>
        <FileUploader onFileUpload={handleFileUpload} />
        {formData.documents && formData.documents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Current Documents
            </h4>
            <DocumentViewer
              documents={formData.documents}
              onDelete={handleFileDelete}
            />
          </div>
        )}
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!isDirty || window.confirm("Discard unsaved changes?")) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!isDirty}
        >
          {initialData ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
