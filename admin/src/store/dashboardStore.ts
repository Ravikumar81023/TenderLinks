import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface OverviewStats {
  totalUsers: number;
  totalTenders: number;
  totalDocuments: number;
  totalBlogs: number;
  totalServices: number;
  totalTenderValue: number;
}

interface UserStats {
  userStats: { subscriptionTier: string; _count: { _all: number } }[];
  activeUsers: number;
  averageAnnualTurnover: number;
  topSectors: { id: number; name: string; _count: { users: number } }[];
}

interface TenderStats {
  tenderStats: {
    sectorId: number;
    _count: { _all: number };
    _sum: { value: number };
  }[];
  upcomingTenders: number;
  averageTenderValue: number;
  topLocations: {
    id: number;
    state: string;
    district: string;
    _count: { tenders: number };
  }[];
}

interface AnalyticsStats {
  totalLogins: number;
  averageTimeSpent: number;
  topLocations: { location: string; count: number }[];
  userEngagement: {
    id: number;
    email: string;
    companyName: string | null;
    analyticsCount: number;
    lastLogin: string | null;
  }[];
}

interface DocumentStats {
  documentStats: { type: string; _count: { _all: number } }[];
  recentDocuments: {
    id: number;
    name: string;
    createdAt: string;
    user: { id: number; email: string } | null;
    tender: { id: number; title: string } | null;
  }[];
}

interface BlogStats {
  blogStats: { status: string; _count: { _all: number } }[];
  recentBlogs: {
    id: number;
    title: string;
    status: string;
    uploadDate: string;
  }[];
}

interface ServiceStats {
  totalServices: number;
  servicesWithMedia: number;
}

interface DashboardStore {
  overviewStats: OverviewStats | null;
  userStats: UserStats | null;
  tenderStats: TenderStats | null;
  analyticsStats: AnalyticsStats | null;
  documentStats: DocumentStats | null;
  blogStats: BlogStats | null;
  serviceStats: ServiceStats | null;
  loading: boolean;
  error: string | null;
  fetchOverviewStats: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchTenderStats: () => Promise<void>;
  fetchAnalyticsStats: () => Promise<void>;
  fetchDocumentStats: () => Promise<void>;
  fetchBlogStats: () => Promise<void>;
  fetchServiceStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  overviewStats: null,
  userStats: null,
  tenderStats: null,
  analyticsStats: null,
  documentStats: null,
  blogStats: null,
  serviceStats: null,
  loading: false,
  error: null,

  fetchOverviewStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/overview`);
      set({ overviewStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch overview stats", loading: false });
      toast.error("Failed to fetch overview stats");
    }
  },

  fetchUserStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/users`);
      set({ userStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch user stats", loading: false });
      toast.error("Failed to fetch user stats");
    }
  },

  fetchTenderStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/tenders`);
      set({ tenderStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch tender stats", loading: false });
      toast.error("Failed to fetch tender stats");
    }
  },

  fetchAnalyticsStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/analytics`);
      set({ analyticsStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch analytics stats", loading: false });
      toast.error("Failed to fetch analytics stats");
    }
  },

  fetchDocumentStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/documents`);
      set({ documentStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch document stats", loading: false });
      toast.error("Failed to fetch document stats");
    }
  },

  fetchBlogStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/blogs`);
      set({ blogStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch blog stats", loading: false });
      toast.error("Failed to fetch blog stats");
    }
  },

  fetchServiceStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/services`);
      set({ serviceStats: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch service stats", loading: false });
      toast.error("Failed to fetch service stats");
    }
  },
}));
