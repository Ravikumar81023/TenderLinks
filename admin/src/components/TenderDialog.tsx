import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TenderForm from "./TenderForm";
import type { Tender } from "../store/tender";
import { Button } from "@/components/ui/button";

interface TenderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTenders: Partial<Tender>[];
  onSubmit: (formData: FormData[]) => void;
}

const TenderDialog: React.FC<TenderDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedTenders,
  onSubmit,
}) => {
  const [tenderForms, setTenderForms] = useState<Partial<Tender>[]>([]);

  useEffect(() => {
    // Initialize forms when dialog opens
    if (isOpen) {
      setTenderForms(selectedTenders);
    }
  }, [isOpen, selectedTenders]);

  const handleCancel = () => {
    setTenderForms([]);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataArray = tenderForms.map((tender) => {
      const formData = new FormData();
      Object.entries(tender).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "documents" && Array.isArray(value)) {
            value.forEach((doc) => {
              if (doc instanceof File) {
                formData.append("documents", doc);
              } else if (doc.id) {
                // Existing documents
                formData.append("existingDocuments", JSON.stringify(doc));
              }
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      return formData;
    });
    onSubmit(formDataArray);
    setTenderForms([]);
  };

  const addTenderForm = () => {
    setTenderForms([...tenderForms, {}]);
  };

  const removeTenderForm = (index: number) => {
    setTenderForms(tenderForms.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px] h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="sticky top-0 z-10 bg-white border-b">
          <DialogHeader className="p-6">
            <DialogTitle>
              {selectedTenders.length === 1 && selectedTenders[0].id
                ? "Edit Tender"
                : "Add New Tenders"}
            </DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {tenderForms.map((tender, index) => (
              <div key={index} className="mb-6 pb-6 border-b">
                <TenderForm
                  initialData={tender}
                  onChange={(updatedTender) => {
                    const newTenderForms = [...tenderForms];
                    newTenderForms[index] = updatedTender;
                    setTenderForms(newTenderForms);
                  }}
                />
                {tenderForms.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeTenderForm(index)}
                    variant="destructive"
                    className="mt-4"
                  >
                    Remove Tender
                  </Button>
                )}
              </div>
            ))}
            {!selectedTenders[0]?.id && (
              <Button type="button" onClick={addTenderForm} variant="outline">
                Add Another Tender
              </Button>
            )}
          </div>
          <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Tenders
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenderDialog;
