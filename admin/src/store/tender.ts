import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export interface Tender {
  id: number;
  title: string;
  description: string;
  value: number;
  sectorId: number;
  locationId: number;
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
  documents?: Array<
    | File
    | {
        id: number;
        name: string;
        path: string;
        type: string;
      }
  >;
}
interface TenderState {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
  fetchTenders: (filters?: Partial<Tender>) => Promise<void>;
  createTender: (tender: FormData) => Promise<void>;
  updateTender: (id: number, tender: FormData) => Promise<void>;
  deleteTender: (id: number) => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useTenderStore = create<TenderState>((set) => ({
  tenders: [],
  loading: false,
  error: null,

  fetchTenders: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/tenders`, {
        params: filters,
      });
      set({ tenders: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch tenders",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch tenders");
    }
  },

  createTender: async (tenderData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/tenders`, tenderData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        tenders: [...state.tenders, response.data],
        loading: false,
      }));
      toast.success("Tender created successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create tender",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to create tender");
    }
  },

  updateTender: async (id, tenderData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_URL}/api/tenders/${id}`,
        tenderData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      set((state) => ({
        tenders: state.tenders.map((t) => (t.id === id ? response.data : t)),
        loading: false,
      }));
      toast.success("Tender updated successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update tender",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to update tender");
    }
  },
  deleteTender: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/tenders/${id}`);
      set((state) => ({
        tenders: state.tenders.filter((t) => t.id !== id),
        loading: false,
      }));
      toast.success("Tender deleted successfully");
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete tender",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to delete tender");
    }
  },
}));
