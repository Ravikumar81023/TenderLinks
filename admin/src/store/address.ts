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

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  selectedAddress: Address | null;
  fetchAddresses: () => Promise<void>;
  fetchAddressById: (id: number) => Promise<void>;
  createAddress: (addressData: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: number, addressData: Partial<Address>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
}

const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  loading: false,
  error: null,
  selectedAddress: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/address`);
      set({ addresses: response.data, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch addresses";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchAddressById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/address/${id}`);
      set({ selectedAddress: response.data, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch address";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createAddress: async (addressData: Omit<Address, "id">) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/address`, addressData);
      set((state) => ({
        addresses: [...state.addresses, response.data],
        loading: false,
      }));
      toast.success("Address created successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create address";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  updateAddress: async (id: number, addressData: Partial<Address>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_URL}/api/address/${id}`,
        addressData
      );
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === id ? response.data : addr
        ),
        selectedAddress: response.data,
        loading: false,
      }));
      toast.success("Address updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update address";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  deleteAddress: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/address/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
        selectedAddress:
          state.selectedAddress?.id === id ? null : state.selectedAddress,
        loading: false,
      }));
      toast.success("Address deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete address";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));

export default useAddressStore;
