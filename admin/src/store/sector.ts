import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface Sector {
  id: number;
  name: string;
}

interface SectorState {
  sectors: Sector[];
  loading: boolean;
  error: string | null;
  getSectors: () => Promise<void>;
  createSector: (name: string) => Promise<void>;
  updateSector: (id: number, name: string) => Promise<void>;
  deleteSector: (id: number) => Promise<void>;
}

const BASE_URL =import.meta.env.VITE_BASE_URL|| "http://localhost:3000";

export const useSectorStore = create<SectorState>((set) => ({
  sectors: [],
  loading: false,
  error: null,

  getSectors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/sectors`);

      set({ sectors: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch sectors", loading: false });
      toast.error("Failed to fetch sectors");
    }
  },

  createSector: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/sectors`, { name });
      set((state) => ({
        sectors: [...state.sectors, response.data],
        loading: false,
      }));
      toast.success("Sector created successfully");
    } catch (error) {
      set({ error: "Failed to create sector", loading: false });
      toast.error("Failed to create sector");
    }
  },

  updateSector: async (id: number, name: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/sectors/${id}`, {
        name,
      });
      set((state) => ({
        sectors: state.sectors.map((sector) =>
          sector.id === id ? response.data : sector,
        ),
        loading: false,
      }));
      toast.success("Sector updated successfully");
    } catch (error) {
      set({ error: "Failed to update sector", loading: false });
      toast.error("Failed to update sector");
    }
  },

  deleteSector: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/sectors/${id}`);
      set((state) => ({
        sectors: state.sectors.filter((sector) => sector.id !== id),
        loading: false,
      }));
      toast.success("Sector deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete sector", loading: false });
      toast.error("Failed to delete sector");
    }
  },
}));
