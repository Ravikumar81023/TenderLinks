import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface AboutInfo {
  id: number;
  content: string;
  totalTenderValue: string;
  totalTenderCount: number;
  socialMediaLinks: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

interface AboutStore {
  aboutInfo: AboutInfo | null;
  loading: boolean;
  error: string | null;
  fetchAboutInfo: () => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAboutStore = create<AboutStore>((set) => ({
  aboutInfo: null,
  loading: false,
  error: null,

  fetchAboutInfo: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/about`);
      set({ aboutInfo: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch about information", loading: false });
      toast.error("Failed to fetch about information");
    }
  },
}));
