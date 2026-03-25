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
  createAboutInfo: (content: string) => Promise<void>;
  updateAboutInfo: (content: string) => Promise<void>;
  updateTenderStats: (
    totalTenderValue: string,
    totalTenderCount: number,
  ) => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

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

  createAboutInfo: async (content: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/about`, { content });
      set({ aboutInfo: response.data, loading: false });
      toast.success("About information created successfully");
    } catch (error) {
      set({ error: "Failed to create about information", loading: false });
      toast.error("Failed to create about information");
    }
  },

  updateAboutInfo: async (content: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/about`, { content });
      set({ aboutInfo: response.data, loading: false });
      toast.success("About information updated successfully");
    } catch (error) {
      set({ error: "Failed to update about information", loading: false });
      toast.error("Failed to update about information");
    }
  },

  updateTenderStats: async (
    totalTenderValue: string,
    totalTenderCount: number,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/about/tender-stats`, {
        totalTenderValue,
        totalTenderCount,
      });
      set({ aboutInfo: response.data, loading: false });
      toast.success("Tender statistics updated successfully");
    } catch (error) {
      set({ error: "Failed to update tender statistics", loading: false });
      toast.error("Failed to update tender statistics");
    }
  },
}));
