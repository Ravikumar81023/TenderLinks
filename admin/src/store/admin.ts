import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AdminUser,
  AdminCreateInput,
  AdminUpdateInput,
  UserRole,
} from "../types/admin";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface AdminStore {
  admins: AdminUser[];
  loading: boolean;
  error: string | null;
  selectedAdmin: AdminUser | null;
  currentUserRole: UserRole | null;
  fetchAdmins: () => Promise<void>;
  fetchAdminById: (id: number) => Promise<void>;
  createAdmin: (data: AdminCreateInput) => Promise<void>;
  updateAdmin: (id: number, data: AdminUpdateInput) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;
  setCurrentUserRole: (role: UserRole) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  admins: [],
  loading: false,
  error: null,
  selectedAdmin: null,
  currentUserRole: null,

  setCurrentUserRole: (role: UserRole) => set({ currentUserRole: role }),

  fetchAdmins: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/admins`);
      set({ admins: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch admins",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch admins");
    }
  },

  fetchAdminById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/admins/${id}`);
      set({ selectedAdmin: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch admin",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch admin");
    }
  },

  createAdmin: async (data: AdminCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/admins`, data);
      set((state) => ({
        admins: [response.data, ...state.admins],
        loading: false,
      }));
      toast.success("Admin created successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create admin",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to create admin");
    }
  },

  updateAdmin: async (id: number, data: AdminUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/admins/${id}`, data);
      set((state) => ({
        admins: state.admins.map((admin) =>
          admin.id === id ? response.data : admin,
        ),
        selectedAdmin: null,
        loading: false,
      }));
      toast.success("Admin updated successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update admin",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to update admin");
    }
  },

  deleteAdmin: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/admins/${id}`);
      set((state) => ({
        admins: state.admins.filter((admin) => admin.id !== id),
        loading: false,
      }));
      toast.success("Admin deleted successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete admin",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to delete admin");
    }
  },
}));
