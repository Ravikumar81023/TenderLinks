import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface SliderImage {
  id: number;
  imageUrl: string;
  createdAt: string;
}

interface SliderStore {
  images: SliderImage[];
  isLoading: boolean;
  error: string | null;
  fetchImages: () => Promise<void>;
  addImage: (file: File) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
}

export const useSliderStore = create<SliderStore>((set) => ({
  images: [],
  isLoading: false,
  error: null,

  fetchImages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<SliderImage[]>(`${BASE_URL}/api/slider`);

      
      set({ images: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch images", isLoading: false });
      toast.error("Failed to fetch images");
    }
  },

  addImage: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post<SliderImage>(
        `${BASE_URL}/api/slider`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
      );

      set((state) => ({
        images: [response.data, ...state.images].slice(0, 11),
        isLoading: false,
      }));

      toast.success("Image added successfully");
    } catch (error) {
      set({ error: "Failed to add image", isLoading: false });
      toast.error("Failed to add image");
    }
  },

  deleteImage: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/slider/${id}`);

      set((state) => ({
        images: state.images.filter((image) => image.id !== id),
        isLoading: false,
      }));

      toast.success("Image deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete image", isLoading: false });
      toast.error("Failed to delete image");
    }
  },
}));
