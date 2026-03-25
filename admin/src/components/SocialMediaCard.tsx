import React, { useState, useRef } from "react";
import { useSocialMediaStore } from "@/store/SocialMedia";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

interface SocialMedia {
  id: number;
  link: string;
  logo: string;
  platformName: string;
}

interface SocialMediaCardProps {
  socialMedia: SocialMedia[];
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ socialMedia }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { updateSocialMedia, deleteSocialMedia, loading } =
    useSocialMediaStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMedia | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    platformName: "",
    link: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number) => {
    await deleteSocialMedia(id);
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (platform: SocialMedia) => {
    setSelectedPlatform(platform);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (platform: SocialMedia) => {
    setSelectedPlatform(platform);
    setEditForm({
      platformName: platform.platformName,
      link: platform.link,
    });
    setPreviewUrl(platform.logo);
    setEditDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleEdit = async () => {
    if (selectedPlatform) {
      const formData = new FormData();
      formData.append("platformName", editForm.platformName);
      formData.append("link", editForm.link);
      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      await updateSocialMedia(selectedPlatform.id, formData);
      setEditDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  return (
    <div className="space-y-4">
      {Array.isArray(socialMedia) && socialMedia?.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <CardContent className="p-6">
            <div className="flex gap-8 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={`${BASE_URL}/uploads/${item.logo}`}
                    alt={item.platformName}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      console.log(
                        "Attempted URL:",
                        `${BASE_URL}/uploads/${item.logo}`,
                      );
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-lg text-blue-700">
                    {item.platformName}
                  </h3>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    Visit Profile <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-blue-50 text-blue-600"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-50 text-red-600"
                  onClick={() => openDeleteDialog(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-700">
              Edit Social Media Platform
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platformName" className="text-blue-600">
                Platform Name
              </Label>
              <Input
                id="platformName"
                value={editForm.platformName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    platformName: e.target.value,
                  }))
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link" className="text-blue-600">
                Profile Link
              </Label>
              <Input
                id="link"
                value={editForm.link}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    link: e.target.value,
                  }))
                }
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-blue-600">Logo</Label>
              <div className="flex flex-col items-center gap-4">
                {previewUrl && (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Logo Preview"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Logo
                </Button>
                {selectedFile && (
                  <p className="text-sm text-blue-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedFile(null);
                setPreviewUrl("");
              }}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-red-600">
              Delete Social Media Platform
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPlatform?.platformName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() =>
                selectedPlatform && handleDelete(selectedPlatform.id)
              }
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SocialMediaCard;
