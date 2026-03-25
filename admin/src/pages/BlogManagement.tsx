//@ts-nocheck
import React, { useEffect, useState,useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useBlogStore } from "@/store/blog";
import { Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  status: "Draft" | "Published";
  media: File | null;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  status: "Draft",
  media: null,
};

const BlogManagement = () => {
  const BASE_URL = "http://localhost:3000";
  const {
    blogs,
    loading,
    error,
    selectedBlog,
    fetchBlogs,
    fetchBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useBlogStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (selectedBlog && isEditing) {
      setFormData({
        title: selectedBlog.title,
        description: selectedBlog.description,
        status: selectedBlog.status as "Draft" | "Published",
        media: null,
      });
      setMediaType(selectedBlog.image ? "image" : "video");
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedBlog, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({ ...prev, media: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (value: "Draft" | "Published") => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleMediaTypeChange = (value: "image" | "video") => {
    setMediaType(value);
    setFormData((prev) => ({ ...prev, media: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("status", formData.status);

    if (formData.media) {
      formPayload.append("media", formData.media);
    }

    try {
      if (isEditing && selectedBlog) {
        await updateBlog(selectedBlog.id, formPayload);
      } else {
        await createBlog(formPayload);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (blogId: number) => {
    fetchBlogById(blogId);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete);
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setMediaType("image");
  };

  if (loading && !blogs.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Blog Management</h1>
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">
            {isEditing ? "Edit Blog" : "Create New Blog"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-600">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Blog Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-600">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Blog Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-blue-600">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-blue-600">Media Type</Label>
              <RadioGroup
                value={mediaType}
                onValueChange={handleMediaTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
              </RadioGroup>

              <Input
                type="file"
                name="media"
                onChange={handleInputChange}
                accept={mediaType === "image" ? "image/*" : "video/*"}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditing ? "Update Blog" : "Create Blog"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(blogs)&&blogs.map((blog) => (
          <Card
            key={blog.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">
                {blog.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blog.image && (
                <img
                  src={`${BASE_URL}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              {blog.video && (
                <video
                  src={`${BASE_URL}${blog.video}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  controls
                />
              )}
              <p className="text-sm mb-2 text-gray-600">{blog.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${blog.status === "Published" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {blog.status}
                  </span>
                </p>
                <p>
                  Upload Date: {new Date(blog.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(blog.id)}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setBlogToDelete(blog.id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagement;
