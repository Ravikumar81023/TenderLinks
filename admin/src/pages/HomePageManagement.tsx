//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2, ArrowUpDown } from "lucide-react";
import { toast } from "react-toastify";
import { useSliderStore } from "@/store/herosection";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableImage component for drag-and-drop functionality
const SortableImage = ({ image, index, onDelete, BASE_URL }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group"
    >
      <div className="absolute top-0 left-0 bg-blue-600 text-white w-8 h-8 rounded-tl-md flex items-center justify-center font-bold z-10">
        {index + 1}
      </div>
      <img
        src={`${BASE_URL}${image.imageUrl}`}
        alt={`Hero ${image.id}`}
        className="w-full h-40 object-cover rounded-md shadow-md"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(image.id)}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full cursor-move"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function HomePageManagement() {
  const BASE_URL = "http://localhost:3000";
  const { images, isLoading, error, fetchImages, addImage, deleteImage } =
    useSliderStore();
  const [orderedImages, setOrderedImages] = useState([]);
  const [isReordering, setIsReordering] = useState(false);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    setOrderedImages(images);
  }, [images]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = 11 - images.length;
      const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        toast.warning("Maximum number of images (11) already reached");
        return;
      }

      // Upload each file sequentially
      let uploadCount = 0;
      for (const file of filesToUpload) {
        try {
          await addImage(file);
          uploadCount++;
        } catch (err) {
          console.error("Failed to upload image:", err);
        }
      }

      if (uploadCount > 0) {
        toast.success(`Successfully uploaded ${uploadCount} image(s)`);
      }

      // Reset the file input
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (id: number) => {
    await deleteImage(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setIsReordering(true);

      setOrderedImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      // Since we can't update the backend order directly,
      // we can visually reorder but will reset on fetch
      setTimeout(() => {
        setIsReordering(false);
        toast.info(
          "Order changes are visual only and will reset on page refresh",
          {
            autoClose: 5000,
          },
        );
      }, 500);
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">
        Home Page Management
      </h1>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-images" className="text-blue-600">
                Hero Images ({images.length}/11)
              </Label>
              <div className="flex items-center gap-4">
                {images.length < 11 && (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-32 h-32 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-8 w-8 mb-2 text-blue-500" />
                          <span className="text-sm text-blue-600">
                            Add Images
                          </span>
                          <span className="text-xs text-blue-400 mt-1">
                            Select up to {11 - images.length}
                          </span>
                        </div>
                      )}
                    </Button>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      disabled={isLoading}
                      multiple
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-blue-700">
              Current Hero Images
            </CardTitle>
            <div className="text-sm text-blue-600 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span>Drag to reorder (visual only)</span>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={Array.isArray(orderedImages)
                  ? orderedImages.map((img) => img.id)
                  : []}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  { Array.isArray(orderedImages)&&orderedImages.map((image, index) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      index={index}
                      onDelete={handleDeleteImage}
                      BASE_URL={BASE_URL}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            {images.length === 0 && (
              <p className="text-center text-blue-600">
                No images uploaded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
