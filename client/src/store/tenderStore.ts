import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface ClientTender {
  id: number;
  title: string;
  description: string;
  value: number;
  sector: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    state: string;
    district: string;
    city: string;
  };
  expiryDate: string;
  tenderingAuthority: string;
  tenderNo: string;
  tenderID: string;
  tenderBrief: string;
  documentFees?: string;
  emd?: number;
  biddingType: string;
  competitionType: string;
  publishDate: string;
  lastDateOfSubmission: string;
  documents?: Array<{
    id: number;
    name: string;
    path: string;
    type: string;
  }>;
  status: "OPEN" | "CLOSED" | "UNDER_REVIEW";
}

interface ClientTenderFilters {
  sectorId?: number;
  state?: string;
  district?: string;
  city?: string;
  searchQuery?: string;
  maxValue?: number;
}

interface ClientTenderStore {
  tenders: ClientTender[];
  loading: boolean;
  error: string | null;
  filters: ClientTenderFilters;
  sectors: Array<{ id: number; name: string }>;
  locations: Array<{
    id: number;
    state: string;
    district: string;
    city: string;
  }>;
  bookmarkedTenders: number[]; // Array of tender IDs that are bookmarked
  fetchTenders: () => Promise<void>;
  fetchTenderById: (id: number) => Promise<ClientTender | null>;
  setFilters: (filters: Partial<ClientTenderFilters>) => void;
  fetchSectors: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  toggleBookmark: (tenderId: number) => void;
  isBookmarked: (tenderId: number) => boolean;
}

const useClientTenderStore = create<ClientTenderStore>((set, get) => ({
  tenders: [],
  loading: false,
  error: null,
  filters: {},
  sectors: [],
  locations: [],
  bookmarkedTenders: JSON.parse(
    localStorage.getItem("bookmarkedTenders") || "[]",
  ),

  fetchTenders: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      // Get user's annual turnover and sector from auth store
      const userAnnualTurnover =
        useAuthStore.getState().user?.annualTurnover || 0;
      const userSectorId = useAuthStore.getState().user?.sectorId;

      // Set default sector filter if not explicitly changed by user
      let effectiveFilters = { ...filters };
      if (userSectorId && effectiveFilters.sectorId === undefined) {
        effectiveFilters.sectorId = userSectorId;
      }

      const response = await axios.get(`${BASE_URL}/api/tenders`, {
        params: {
          ...effectiveFilters,
          maxValue: userAnnualTurnover, // Only fetch tenders within user's turnover range
        },
      });

      set({ tenders: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch tenders",
        loading: false,
      });
      toast.error("Failed to fetch tenders");
    }
  },

  fetchTenderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      console.log("Fetching tender with ID:", id);
      const response = await axios.get(`${BASE_URL}/api/tenders/${id}`);
      console.log("API Response:", response.data);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching tender:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch tender details",
        loading: false,
      });
      toast.error("Failed to fetch tender details");
      return null;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchTenders();
  },

  fetchSectors: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/sectors`);
      set({ sectors: response.data });
    } catch (error: any) {
      toast.error("Failed to fetch sectors");
    }
  },

  fetchLocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/locations`);
      set({ locations: response.data });
    } catch (error: any) {
      toast.error("Failed to fetch locations");
    }
  },

  toggleBookmark: (tenderId: number) => {
    set((state) => {
      const isCurrentlyBookmarked = state.bookmarkedTenders.includes(tenderId);
      let newBookmarks;

      if (isCurrentlyBookmarked) {
        newBookmarks = state.bookmarkedTenders.filter((id) => id !== tenderId);
        toast.info("Tender removed from bookmarks");
      } else {
        newBookmarks = [...state.bookmarkedTenders, tenderId];
        toast.success("Tender bookmarked successfully");
      }

      // Save to localStorage
      localStorage.setItem("bookmarkedTenders", JSON.stringify(newBookmarks));

      return { bookmarkedTenders: newBookmarks };
    });
  },

  isBookmarked: (tenderId: number) => {
    return get().bookmarkedTenders.includes(tenderId);
  },
}));

export default useClientTenderStore;
