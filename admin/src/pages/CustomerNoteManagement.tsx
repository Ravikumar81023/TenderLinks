//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useCustomerStore } from "../store/customer";
import { useCustomerNoteStore } from "../store/customerNote";

import { Search, Plus, Pencil, Trash2, Loader2, User } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";

export default function ImprovedNoteManagement() {
  const {
    customers,
    loading: customersLoading,
    fetchCustomers,
  } = useCustomerStore();
  const {
    notes,
    loading: notesLoading,
    fetchAllNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useCustomerNoteStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchCustomers();
    fetchAllNotes();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredNotes = Array.isArray(notes) && notes.filter((note) => {
    const customer = Array.isArray(customers) && customers.find((c) => c.id === note.userId);
    return (
      customer &&
      (customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerSearchOpen(false);

    // Check if the customer already has a note
    const existingNote = notes.find(note => note.userId === customer.id);

    if (existingNote) {
      // Pre-fill with existing note content
      setEditingNote(existingNote);
      setNoteContent(existingNote.content);
    } else {
      // Clear for new note
      setEditingNote(null);
      setNoteContent("");
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();

    if (!noteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    try {
      // Check if customer already has a note
      const existingNote = notes.find(note => note.userId === selectedCustomer.id);

      if (existingNote || editingNote) {
        // Update existing note
        const noteId = editingNote ? editingNote.id : existingNote.id;
        await updateNote(noteId, noteContent);
        toast.success("Note updated successfully");
      } else {
        // Create new note
        await createNote(selectedCustomer.id, noteContent);
        toast.success("Note created successfully");
      }

      setIsNoteDialogOpen(false);
      setNoteContent("");
      setEditingNote(null);
      fetchAllNotes();
    } catch (error) {
      console.error("Failed to handle note:", error);
      toast.error("Failed to save note");
    }
  };

  const handleAddOrEditNote = () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer first");
      return;
    }

    // Check if customer already has a note
    const existingNote = notes.find(note => note.userId === selectedCustomer.id);

    if (existingNote) {
      setEditingNote(existingNote);
      setNoteContent(existingNote.content);
    } else {
      setEditingNote(null);
      setNoteContent("");
    }

    setIsNoteDialogOpen(true);
  };

  const handleEdit = (note) => {
    // Find the customer for this note
    const customer = customers.find(c => c.id === note.userId);
    if (customer) {
      setSelectedCustomer(customer);
    }

    setEditingNote(note);
    setNoteContent(note.content);
    setIsNoteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchAllNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const paginatedNotes = Array.isArray(filteredNotes) && filteredNotes.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredNotes.length / pageSize);

  if (customersLoading || notesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 bg-blue-50">
      <div className="flex items-center space-x-4">
        <Popover
          open={isCustomerSearchOpen}
          onOpenChange={setIsCustomerSearchOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] justify-start border-blue-500 text-blue-600 hover:bg-blue-100"
            >
              {selectedCustomer ? (
                <>{selectedCustomer.companyName}</>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  <span>Select a customer...</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search customers..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>No customers found.</CommandEmpty>
              <CommandGroup>
                {filteredCustomers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    onSelect={() => handleCustomerSelect(customer)}
                  >
                    <span>{customer.companyName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({customer.email})
                    </span>
                    {Array.isArray(notes)&&notes.some(note => note.userId === customer.id) && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        Has Note
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!selectedCustomer}
              onClick={handleAddOrEditNote}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {Array.isArray(notes) && notes.some(note => note.userId === selectedCustomer?.id) ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Note
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {Array.isArray(notes)&&notes.some(note => note.userId === selectedCustomer?.id)
                  ? "Edit Customer Note"
                  : "Add New Customer Note"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <Textarea
                placeholder="Enter note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[100px] border-blue-500 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {Array.isArray(notes) && notes.some(note => note.userId === selectedCustomer?.id)
                  ? "Update Note"
                  : "Create Note"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-600">Customer Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search notes or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Table>
            <TableHeader className="bg-blue-200">
              <TableRow>
                <TableHead className="text-blue-600">Customer</TableHead>
                <TableHead className="text-blue-600 w-1/2">Content</TableHead>
                <TableHead className="text-blue-600">Created At</TableHead>
                <TableHead className="text-blue-600 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNotes.length > 0 ? (
                paginatedNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      {customers.find((c) => c.id === note.userId)?.companyName || "Unknown"}
                    </TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {note.content}
                    </TableCell>
                    <TableCell>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(note)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Note</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this note? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(note.id)}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No notes found. Please create a new note.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredNotes.length > pageSize && (
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-blue-500 text-blue-600 hover:bg-blue-100"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-blue-500 text-blue-600 hover:bg-blue-100"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
