import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL|| "http://localhost:3000";

interface CA {
    id: number;
    name: string;
    experience: number;
    phoneNumber: string;
    state: string;
    district: string;
    city: string;
}

interface CAStore {
    cas: CA[];
    loading: boolean;
    isloading: boolean;
    error: string | null;
    fetchCAs: () => Promise<void>;
    getCAById: (id: number) => Promise<CA | null>;
    createCA: (ca: Omit<CA, "id">) => Promise<void>;
    updateCA: (id: number, ca: Partial<CA>) => Promise<void>;
    deleteCA: (id: number) => Promise<void>;
}

export const useCAStore = create<CAStore>((set) => ({
    cas: [],
    loading: false,
    error: null,
    isloading: false,
    fetchCAs: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/ca`);
            set({ cas: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch CAs", loading: false });
            toast.error("Failed to fetch CAs");
        }
    },

    getCAById: async (id: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/ca/${id}`);
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch CA details");
            return null;
        }
    },

    createCA: async (caData) => {
        set({ isloading: true, error: null });
        try {
            const response = await axios.post(`${BASE_URL}/api/ca`, caData);
            set((state) => ({
                cas: [...state.cas, response.data],
                loading: false,
            }));
            toast.success("CA created successfully");
        } catch (error) {
            set({ error: "Failed to create CA" });
            toast.error("Failed to create CA");
        } finally {
            set({ isloading: false });
        }
    },

    updateCA: async (id, caData) => {
        set({ isloading: true, error: null });
        try {
            const response = await axios.put(`${BASE_URL}/api/ca/${id}`, caData);
            set((state) => ({
                cas: state.cas.map((ca) => (ca.id === id ? response.data : ca)),
                loading: false,
            }));
            toast.success("CA updated successfully");
        } catch (error) {
            set({ error: "Failed to update CA", isloading: false });
            toast.error("Failed to update CA");
        } finally {
            set({ isloading: false })
        }
    },

    deleteCA: async (id) => {
        set({ isloading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/api/ca/${id}`);
            set((state) => ({
                cas: state.cas.filter((ca) => ca.id !== id),
                loading: false,
            }));
            toast.success("CA deleted successfully");
        } catch (error) {
            set({ error: "Failed to delete CA", isloading: false });
            toast.error("Failed to delete CA");
        } finally {
            set({ isloading: false })
        }
    },
}));
