// analyticsStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  userId?: number;
}

interface Analytics {
  id: number;
  userId: number;
  ipAddress: string;
  loginTime: string;
  logoutTime: string | null;
  pageViews: number;
  timeSpent: number;
  location: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    companyName: string;
    subscriptionTier: string;
    lastLoginTime: string;
  };
}

interface AnalyticsState {
  analytics: Analytics[];
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
  fetchAnalytics: (filters?: AnalyticsFilters) => Promise<void>;
  recordLogin: (
    userId: number,
    ipAddress: string,
    location: string,
  ) => Promise<void>;
  recordLogout: (id: number) => Promise<void>;
  updatePageViews: (id: number, pageViews: number) => Promise<void>;
  updateTimeSpent: (id: number, timeSpent: number) => Promise<void>;
  setFilters: (filters: AnalyticsFilters) => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  analytics: [],
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters: AnalyticsFilters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchAnalytics(filters);
  },

  fetchAnalytics: async (filters?: AnalyticsFilters) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      const currentFilters = filters || get().filters;

      if (currentFilters.startDate) {
        queryParams.append("startDate", currentFilters.startDate.toISOString());
      }
      if (currentFilters.endDate) {
        queryParams.append("endDate", currentFilters.endDate.toISOString());
      }
      if (currentFilters.location) {
        queryParams.append("location", currentFilters.location);
      }
      if (currentFilters.userId) {
        queryParams.append("userId", currentFilters.userId.toString());
      }

      const response = await axios.get<Analytics[]>(
        `${BASE_URL}/api/analytics?${queryParams.toString()}`,
      );
      set({ analytics: response.data, loading: false });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      set({
        error: "Failed to fetch analytics",
        loading: false,
      });
      toast.error("Failed to fetch analytics data");
    }
  },

  recordLogin: async (userId: number, ipAddress: string, location: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/analytics/login`, {
        userId,
        ipAddress,
        location,
      });
      // Refresh analytics after recording login
      get().fetchAnalytics();
      return response.data;
    } catch (error) {
      console.error("Login record error:", error);
      toast.error("Failed to record login");
    }
  },

  recordLogout: async (id: number) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/analytics/logout/${id}`,
      );
      // Refresh analytics after recording logout
      get().fetchAnalytics();
      return response.data;
    } catch (error) {
      console.error("Logout record error:", error);
      toast.error("Failed to record logout");
    }
  },

  updatePageViews: async (id: number, pageViews: number) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/analytics/pageviews/${id}`,
        {
          pageViews,
        },
      );
      // Refresh analytics after updating page views
      get().fetchAnalytics();
      return response.data;
    } catch (error) {
      console.error("Page views update error:", error);
      toast.error("Failed to update page views");
    }
  },

  updateTimeSpent: async (id: number, timeSpent: number) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/analytics/timespent/${id}`,
        {
          timeSpent,
        },
      );
      // Refresh analytics after updating time spent
      get().fetchAnalytics();
      return response.data;
    } catch (error) {
      console.error("Time spent update error:", error);
      toast.error("Failed to update time spent");
    }
  },
}));
