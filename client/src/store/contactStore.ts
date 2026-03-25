// contactStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Address {
  id: number;
  state: string;
  district: string;
  city: string;
  phoneNumbers: string[];
  landmark: string;
  isMainOffice: boolean;
}

interface Contact {
  id: number;
  title: string;
  phoneNumber: string;
}

interface SocialMedia {
  id: number;
  name: string;
  link: string;
  logo: string;
  platformName: string;
}

interface ContactStore {
  addresses: Address[];
  contacts: Contact[];
  socialMedia: SocialMedia[];
  isLoading: boolean;
  error: string | null;
  fetchAllData: () => Promise<void>;
}

export const useContactStore = create<ContactStore>((set) => ({
  addresses: [],
  contacts: [],
  socialMedia: [],
  isLoading: false,
  error: null,

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [addressesRes, contactsRes, socialMediaRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/address`),
        axios.get(`${BASE_URL}/api/contact`),
        axios.get(`${BASE_URL}/api/socialmedia`),
      ]);

      set({
        addresses: addressesRes.data,
        contacts: contactsRes.data,
        socialMedia: socialMediaRes.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch contact data";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
}));
