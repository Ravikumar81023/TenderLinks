import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";
import useAnalyticsStore from "./analyticsStore";
const BASE_URL =import.meta.env.VITE_BASE_URL|| "http://localhost:3000";

axios.defaults.withCredentials = true;

interface CustomerUser {
  id: number;
  username: string;
  annualTurnover: number;
  sectorId: number;
  companyName: string;
}

interface CustomerAuthState {
  isAuthenticated: boolean;
  user: CustomerUser | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          // First login request
          const response = await axios.post(
            `${BASE_URL}/api/auth/customer/login`,
            { username, password },
            { withCredentials: true },
          );

          if (response.data && response.data.user.id) {
            // Set auth state first
            set({
              isAuthenticated: true,
              user: {
                id: response.data.user.id,
                username,
                annualTurnover: response.data.user.annualTurnover,
                sectorId: response.data.user.sectorId,
                companyName: response.data.user.companyName,
              },
              loading: false,
              error: null,
            });

            try {
              // Then try analytics as a separate try-catch block
              const analyticsResponse = await axios.post(
                `${BASE_URL}/api/analytics/login`,
                {
                  userId: response.data.user.id,
                  ipAddress: await fetch("https://api.ipify.org?format=json")
                    .then((res) => res.json())
                    .then((data) => data.ip),
                  location: await fetch("https://ipapi.co/json/")
                    .then((res) => res.json())
                    .then((data) => `${data.city}, ${data.country_name}`),
                },
                { withCredentials: true },
              );

              if (analyticsResponse.data?.id) {
                useAnalyticsStore
                  .getState()
                  .setSessionId(analyticsResponse.data.id);
              }
            } catch (analyticsError) {
              // Don't let analytics errors affect the login state
              console.error("Analytics error:", analyticsError);
            }

            toast.success("Login successful");
          }
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          toast.error("Login failed");
        }
      },
      logout: async () => {
        const { user } = get();
        if (user) {
          try {
            // Sync analytics before logout
            await useAnalyticsStore.getState().syncAnalytics();

            // Record logout
            const sessionId =
              useAnalyticsStore.getState().analyticsData.currentSessionId;
            if (sessionId) {
              await axios.post(`${BASE_URL}/api/analytics/logout/${sessionId}`);
            }

            // Clear auth token
            await axios.post(
              `${BASE_URL}/api/auth/customer/logout`,
              {},
              { withCredentials: true },
            );

            set({
              isAuthenticated: false,
              user: null,
              loading: false,
              error: null,
            });
            toast.success("Logged out successfully");
          } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
          }
        }
      },
    }),
    {
      name: "customer-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);

export default useCustomerAuthStore;
