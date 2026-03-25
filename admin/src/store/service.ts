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

interface ServiceStore {
  services: Service[];
  loading: boolean;
  error: string | null;
  selectedService: Service | null;
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  createService: (formData: FormData) => Promise<void>;
  updateService: (id: number, formData: FormData) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: null,
  selectedService: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services`);
      set({ services: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch services",
        loading: false,
      });
      toast.error("Failed to fetch services");
    }
  },

  fetchServiceById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/services/${id}`);
      set({ selectedService: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch service",
        loading: false,
      });
      toast.error("Failed to fetch service");
    }
  },

  createService: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/services`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        services: [response.data, ...state.services],
        loading: false,
      }));
      toast.success("Service created successfully");
    } catch (error) {
      set({
        error: "Failed to create service",
        loading: false,
      });
      toast.error("Failed to create service");
    }
  },

  updateService: async (id: number, formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_URL}/api/services/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? response.data : service,
        ),
        selectedService: null,
        loading: false,
      }));
      toast.success("Service updated successfully");
    } catch (error) {
      set({
        error: "Failed to update service",
        loading: false,
      });
      toast.error("Failed to update service");
    }
  },

  deleteService: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/services/${id}`);
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
        loading: false,
      }));
      toast.success("Service deleted successfully");
    } catch (error) {
      set({
        error: "Failed to delete service",
        loading: false,
      });
      toast.error("Failed to delete service");
    }
  },
}));
