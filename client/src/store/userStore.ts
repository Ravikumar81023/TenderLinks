import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserDetails {
  id: number;
  email: string;
  companyName: string;
  phoneNumbers: string[];
  sector?: {
    id: number;
    name: string;
  };
  location?: {
    id: number;
    state: string;
    district: string;
    city: string;
  };
  subscriptionTier: "GUEST" | "GOLD" | "PLATINUM" | "DIAMOND";
  annualTurnover: number;
  lastLoginTime?: string;
}

interface UserStore {
  userDetails: UserDetails | null;
  loading: boolean;
  error: string | null;
  fetchUserDetails: (userId: number) => Promise<void>;
  clearUserDetails: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  userDetails: null,
  loading: false,
  error: null,

  fetchUserDetails: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/customers/${userId}`);
      set({ userDetails: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch user details", loading: false });
      toast.error("Failed to fetch user details");
    }
  },

  clearUserDetails: () => {
    set({ userDetails: null, loading: false, error: null });
  },
}));

export default useUserStore;
