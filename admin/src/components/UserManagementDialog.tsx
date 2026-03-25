//@ts-nocheck
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { CustomerUser, CustomerCreateInput } from "../store/customer";
import { useCustomerStore } from "../store/customer";
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

interface UserManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: CustomerUser | null;
  onSubmit: (data: CustomerCreateInput) => void;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onSubmit,
}) => {
  const { createCustomer, updateCustomer } = useCustomerStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<CustomerCreateInput | null>(null);

  const handleSubmit = async (formData: CustomerCreateInput) => {
    try {
      if (selectedUser) {
        await updateCustomer(selectedUser.id, formData);
      } else {
        await createCustomer(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error handling submission:", error);
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px] h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6">
          <DialogTitle className="text-2xl font-bold text-blue-800">
            {selectedUser ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            {selectedUser
              ? "Update the customer information in the form below."
              : "Fill in the customer information in the form below."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <UserForm
            initialData={selectedUser || undefined}
            onSubmit={async (formData) => {
              if (selectedUser) {
                setPendingFormData(formData);
                setShowConfirmDialog(true);
              } else {
                await handleSubmit(formData);
              }
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>{" "}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Customer Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this customer's information? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingFormData && selectedUser) {
                  await handleSubmit(pendingFormData);
                  setShowConfirmDialog(false);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default UserManagementDialog;
