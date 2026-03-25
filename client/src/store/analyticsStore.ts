//@ts-nocheck
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useCustomerAuthStore from "./customerAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface AnalyticsData {
  pageViews: number;
  timeSpent: number;
  currentSessionId?: number;
}

interface AnalyticsStore {
  analyticsData: AnalyticsData;
  loading: boolean;
  error: string | null;
  setSessionId: (id: number) => void;
  recordPageView: () => Promise<void>;
  updateTimeSpent: (seconds: number) => Promise<void>;
  syncAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  analyticsData: {
    pageViews: 0,
    timeSpent: 0,
    currentSessionId: undefined,
  },
  loading: false,
  error: null,

  setSessionId: (id: number) => {
    set((state) => ({
      analyticsData: {
        ...state.analyticsData,
        currentSessionId: id,
      },
    }));
  },

  recordPageView: async () => {
    const { analyticsData } = get();
    if (!analyticsData.currentSessionId) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/analytics/pageviews/${analyticsData.currentSessionId}`,
        {
          pageViews: 1,
        },
        {
          withCredentials: true,
        },
      );
      set((state) => ({
        analyticsData: {
          ...state.analyticsData,
          pageViews: state.analyticsData.pageViews + 1,
        },
      }));
    } catch (error) {
      console.error("Failed to record page view:", error);
    }
  },

  updateTimeSpent: async (seconds: number) => {
    const { analyticsData } = get();
    if (!analyticsData.currentSessionId) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/analytics/timespent/${analyticsData.currentSessionId}`,
        {
          timeSpent: seconds,
        },
        {
          withCredentials: true,
        },
      );
      set((state) => ({
        analyticsData: {
          ...state.analyticsData,
          timeSpent: state.analyticsData.timeSpent + seconds,
        },
      }));
    } catch (error) {
      console.error("Failed to update time spent:", error);
    }
  },

  syncAnalytics: async () => {
    const { analyticsData } = get();
    if (!analyticsData.currentSessionId) return;

    set({ loading: true, error: null });
    try {
      await Promise.all([
        axios.put(
          `${BASE_URL}/api/analytics/pageviews/${analyticsData.currentSessionId}`,
          {
            pageViews: analyticsData.pageViews,
          },
          {
            withCredentials: true,
          },
        ),
        axios.put(
          `${BASE_URL}/api/analytics/timespent/${analyticsData.currentSessionId}`,
          {
            timeSpent: analyticsData.timeSpent,
          },
          {
            withCredentials: true,
          },
        ),
      ]);
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: "Failed to sync analytics data",
      });
      toast.error("Failed to sync analytics data");
    }
  },
}));

export default useAnalyticsStore;
