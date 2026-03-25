import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"; 

axios.defaults.withCredentials = true;

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(
            `${BASE_URL}/api/auth/admin/login`,
            { username, password },
            { withCredentials: true },
          );

          set({
            admin: response.data.user,
            isAuthenticated: true,
            error: null,
          });
          toast.success("Login successful");
        } catch (error) {
          console.error(error);
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Login failed",
              isAuthenticated: false,
            });
          }
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await axios.post(
            `${BASE_URL}/api/auth/admin/logout`,
            {},
            { withCredentials: true },
          );
          set({
            admin: null,
            isAuthenticated: false,
            error: null,
          });
          toast.success("Logged out successfully");
        } catch (error) {
          console.error("Failed to log out on the server:", error);
          toast.error("Failed to log out. Please try again.");
        }
      },
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAdminAuthStore;
