import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, PencilIcon, Loader2, Plus } from "lucide-react";
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
import { useContactStore } from "@/store/contact";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const {
    contacts,
    isLoading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  } = useContactStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", phoneNumber: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateContact(editingId, formData);
      setEditingId(null);
    } else {
      await createContact(formData);
      setIsCreating(false);
    }
    setFormData({ title: "", phoneNumber: "" });
  };

  const handleEdit = (contact: {
    id: number;
    title: string;
    phoneNumber: string;
  }) => {
    setEditingId(contact.id);
    setFormData({ title: contact.title, phoneNumber: contact.phoneNumber });
    setIsCreating(false);
  };

  const openDeleteDialog = (id: number) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (contactToDelete) {
      await deleteContact(contactToDelete);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const contactForm = (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-blue-600">
          Name
        </Label>
        <Input
          id="title"
          placeholder="Name"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {editingId ? "Update" : "Add"} Contact
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", phoneNumber: "" });
            setIsCreating(false);
          }}
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto my-8 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-blue-700">Contacts</CardTitle>
            {!isCreating && !editingId && (
              <Button
                onClick={() => setIsCreating(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(isCreating || editingId) && contactForm}

          <div className="space-y-4">
            {Array.isArray(contacts) && contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-blue-700">{contact.title}</h3>
                  <p className="text-sm text-blue-600">{contact.phoneNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(contact)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDeleteDialog(contact.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {contacts.length === 0 && !isCreating && (
              <div className="text-center py-8 text-blue-600">
                No contacts found. Add a new contact to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-red-600">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setContactToDelete(null)}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Contact;

