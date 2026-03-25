import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Service {
  id: number;
  title: string;
  description: string;
  image: string | null;
  video: string | null;
}

interface CA {
  name: string;
  experience: number;
  phoneNumber: string;
  state: string;
  district: string;
  city: string;
}

interface CombinedStore {
  services: Service[];
  cas: CA[];
  isLoadingServices: boolean;
  isLoadingCAs: boolean;
  error: string | null;
  selectedService: Service | null;
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  fetchCAs: () => Promise<void>;
}

export const useCombinedStore = create<CombinedStore>((set) => ({
  services: [],
  cas: [],
  isLoadingServices: false,
  isLoadingCAs: false,
  error: null,
  selectedService: null,

  fetchServices: async () => {
    set({ isLoadingServices: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services`);
      set({ services: response.data, isLoadingServices: false });
    } catch (error) {
      set({
        error: "Failed to fetch services",
        isLoadingServices: false,
      });
      toast.error("Failed to fetch services");
    }
  },

  fetchServiceById: async (id: number) => {
    set({ isLoadingServices: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services/${id}`);
      set({ selectedService: response.data, isLoadingServices: false });
    } catch (error) {
      set({
        error: "Failed to fetch service",
        isLoadingServices: false,
      });
      toast.error("Failed to fetch service details");
    }
  },

  fetchCAs: async () => {
    set({ isLoadingCAs: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/ca`);
      set({ cas: response.data, isLoadingCAs: false });
    } catch (error) {
      set({
        error: "Failed to fetch CAs",
        isLoadingCAs: false,
      });
      toast.error("Failed to fetch CAs");
    }
  },
}));
