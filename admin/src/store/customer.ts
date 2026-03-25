//@ts-nocheck
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface CustomerUser {
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
  documents: Array<{
    id: number;
    name: string;
    path: string;
    type: string;
  }>;
  subscriptionValidity?: Date;
  subscriptionTier: "GUEST" | "GOLD" | "PLATINUM" | "DIAMOND";
  annualTurnover: number;
  customerNotes: Array<{
    id: number;
    content: string;
    createdAt: Date;
  }>;
  lastLoginTime?: Date;
  mostUsedIpAddress?: string;
  serviceValidity?: Date;
}

interface CustomerCreateInput {
  email: string;
  password: string;
  companyName?: string;
  phoneNumbers: string[];
  sectorId?: number;
  locationId?: number;
  subscriptionTier?: "GUEST" | "GOLD" | "PLATINUM" | "DIAMOND";
  annualTurnover: number;
  documents?: File[];
}

interface CustomerStore {
  customers: CustomerUser[];
  loading: boolean;
  error: string | null;
  selectedCustomer: CustomerUser | null;
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: number) => Promise<void>;
  createCustomer: (data: CustomerCreateInput) => Promise<void>;
  updateCustomer: (
    id: number,
    data: Partial<CustomerCreateInput>,
  ) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  addCustomerNote: (customerId: number, content: string) => Promise<void>;
  updateSubscriptionTier: (
    customerId: number,
    tier: "GUEST" | "GOLD" | "PLATINUM" | "DIAMOND",
    subscriptionValidity: Date,
  ) => Promise<void>;
  terminateCustomerService: (id: number, password: string) => Promise<void>;
  getCustomerAnalytics: (
    id: number,
    startDate?: Date,
    endDate?: Date,
  ) => Promise<any>;
}
const BASE_URL = import.meta.env.VITE_BASE_URL||"http://localhost:3000";

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  selectedCustomer: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/customers`);
      set({
        customers: response.data.map((customer: CustomerUser) => ({
          ...customer,
          sector: customer.sector || { id: "_none", name: "Unnamed Sector" },
          location: customer.location || {
            id: "_none",
            state: "",
            district: "",
            city: "Unnamed Location",
          },
        })),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch customers", loading: false });
      toast.error("Failed to fetch customers");
    }
  },

  fetchCustomerById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/customers/${id}`);
      set({ selectedCustomer: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch customer", loading: false });
      toast.error("Failed to fetch customer");
    }
  },

  createCustomer: async (data: CustomerCreateInput) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "documents" && value) {
          value.forEach((file: File) => {
            formData.append("documents", file);
          });
        } else if (key === "phoneNumbers") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (data.sectorId === "_none") {
        formData.delete("sectorId");
      }
      if (data.locationId === "_none") {
        formData.delete("locationId");
      }

      const response = await axios.post(`${BASE_URL}/api/customers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        customers: [response.data, ...state.customers],
        loading: false,
      }));
      toast.success("Customer created successfully");
    } catch (error) {
      set({ error: "Failed to create customer", loading: false });
      toast.error("Failed to create customer");
    }
  },

  updateCustomer: async (id: number, data: Partial<CustomerCreateInput>) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();

      // Handle all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "documents" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("documents", file);
            }
          });
        } else if (key === "phoneNumbers" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString());
        }
      });

      // Handle special cases for sector and location
      if (data.sectorId === "_none") {
        formData.delete("sectorId");
      }
      if (data.locationId === "_none") {
        formData.delete("locationId");
      }

      const response = await axios.put(
        `${BASE_URL}/api/customers/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Update the customers list and selected customer
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? response.data : customer,
        ),
        selectedCustomer: response.data,
        loading: false,
      }));

      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Error updating customer:", error);
      set({ error: "Failed to update customer", loading: false });
      toast.error("Failed to update customer");
      throw error; // Re-throw to handle in the component
    }
  },
  deleteCustomer: async (id: number) => {
    set({ loading: true, error: null });
    try {
      console.log(id);

      await axios.delete(`${BASE_URL}/api/customers/${id}`);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        loading: false,
      }));
      toast.success("Customer deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete customer", loading: false });
      toast.error("Failed to delete customer");
    }
  },

  addCustomerNote: async (customerId: number, content: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/customers/${customerId}/notes`,
        { content },
      );
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                customerNotes: [
                  response.data,
                  ...(customer.customerNotes || []),
                ],
              }
            : customer,
        ),
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              customerNotes: [
                response.data,
                ...(state.selectedCustomer.customerNotes || []),
              ],
            }
          : null,
        loading: false,
      }));
      toast.success("Note added successfully");
    } catch (error) {
      set({ error: "Failed to add note", loading: false });
      toast.error("Failed to add note");
    }
  },

  updateSubscriptionTier: async (
    customerId: number,
    tier: "GUEST" | "GOLD" | "PLATINUM" | "DIAMOND",
    subscriptionValidity: Date,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/customers/${customerId}/subscription-tier`,
        { tier, subscriptionValidity },
      );
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId ? response.data : customer,
        ),
        selectedCustomer: response.data,
        loading: false,
      }));
      toast.success("Subscription tier updated successfully");
    } catch (error) {
      set({ error: "Failed to update subscription tier", loading: false });
      toast.error("Failed to update subscription tier");
    }
  },

  terminateCustomerService: async (id: number, password: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/customers/${id}/terminate`, {
        data: { password },
      });
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        loading: false,
      }));
      toast.success("Customer service terminated successfully");
    } catch (error) {
      set({ error: "Failed to terminate customer service", loading: false });
      toast.error("Failed to terminate customer service");
    }
  },

  getCustomerAnalytics: async (
    id: number,
    startDate?: Date,
    endDate?: Date,
  ) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      const response = await axios.get(
        `${BASE_URL}/api/customers/${id}/analytics?${params.toString()}`,
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch customer analytics", loading: false });
      toast.error("Failed to fetch customer analytics");
      return [];
    }
  },
}));
