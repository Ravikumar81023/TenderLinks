import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Service {
  id: number;
  title: string;
  description: string;
  image: string | null;
  video: string | null;
}

interface ServiceStore {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  selectedService: Service | null;
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;

}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  isLoading: false,
  error: null,
  selectedService: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services`);
      set({ services: response.data, isLoading: false });
    } catch (error) {
      set({
        error: "Failed to fetch services",
        isLoading: false,
      });
    }
  },
  fetchServiceById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services/${id}`);
      set({ selectedService: response.data, isLoading: false });
    } catch (error) {
      set({
        error: "Failed to fetch service",
        isLoading: false,
      });
    }
  },
}));
