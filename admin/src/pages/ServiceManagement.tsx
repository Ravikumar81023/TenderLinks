//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useServiceStore } from "../store/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ServiceManagement() {
  const {
    services,
    loading,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServiceStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    console.log(fetchServices());
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setMediaFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    if (mediaFile) {
      submitData.append("media", mediaFile);
    }

    if (editingService) {
      await updateService(editingService.id, submitData);
    } else {
      await createService(submitData);
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ title: "", description: "" });
    setMediaFile(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border border-blue-600 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between  text-blue-600 p-4">
          <CardTitle className="text-2xl font-bold">
            Service Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingService(null);
                  setFormData({ title: "", description: "" });
                  setMediaFile(null);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="title"
                  placeholder="Service Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="border-blue-600"
                />
                <Textarea
                  name="description"
                  placeholder="Service Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="border-blue-600"
                />
                <FileUploader onFileUpload={handleFileUpload} />
                {mediaFile && (
                  <p className="text-sm text-blue-600">
                    File selected: {mediaFile.name}
                  </p>
                )}
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingService ? "Update Service" : "Create Service"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(services) && services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.title}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>
                    {service.image && (
                      <img
                        src={`${BASE_URL}${service.image}`}
                        alt={service.title}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                    {service.video && (
                      <video
                        src={`${BASE_URL}/${service.video}`}
                        className="w-16 h-16 object-cover"
                        controls
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
