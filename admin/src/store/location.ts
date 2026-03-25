import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface Location {
  id: number;
  state: string;
  district: string;
  city: string;
}

interface LocationState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  getLocations: () => Promise<void>;
  createLocation: (locationData: Omit<Location, "id">) => Promise<void>;
  updateLocation: (
    id: number,
    locationData: Partial<Omit<Location, "id">>,
  ) => Promise<void>;
  deleteLocation: (id: number) => Promise<void>;
}

const BASE_URL =import.meta.env.VITE_BASE_URL|| "http://localhost:3000";

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  loading: false,
  error: null,

  getLocations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/locations`);
      set({ locations: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch locations",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch locations");
    }
  },

  createLocation: async (locationData: Omit<Location, "id">) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/locations`,
        locationData,
      );
      set((state) => ({
        locations: [...state.locations, response.data],
        loading: false,
      }));
      toast.success("Location created successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create location",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to create location");
    }
  },

  updateLocation: async (
    id: number,
    locationData: Partial<Omit<Location, "id">>,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_URL}/api/locations/${id}`,
        locationData,
      );
      set((state) => ({
        locations: state.locations.map((location) =>
          location.id === id ? response.data : location,
        ),
        loading: false,
      }));
      toast.success("Location updated successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update location",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to update location");
    }
  },

  deleteLocation: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/locations/${id}`);
      set((state) => ({
        locations: state.locations.filter((location) => location.id !== id),
        loading: false,
      }));
      toast.success("Location deleted successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete location",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to delete location");
    }
  },
}));
