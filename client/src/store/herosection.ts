import { create } from "zustand";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
interface SliderImage {
    id: number;
    imageUrl: string;
    createdAt: string;
  }
interface HeroStore {
  images: SliderImage[];
  isLoading: boolean;
  fetchimages: () => Promise<void>;
}

export const useHerostore = create<HeroStore>((set) => ({
  images: [],
  isLoading: false,

  fetchimages: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${BASE_URL}/api/slider`);
    //   console.log(response);
      set({ images: response.data });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
