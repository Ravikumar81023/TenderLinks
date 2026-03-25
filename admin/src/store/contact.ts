import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Contact {
  id: number;
  title: string;
  phoneNumber: string;
}

interface ContactStore {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  getContactById: (id: number) => Promise<Contact | null>;
  createContact: (data: Omit<Contact, "id">) => Promise<void>;
  updateContact: (id: number, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  submitComplaint: (complaint: {
    name: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    message: string;
  }) => Promise<void>;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/contact`);
      set({ contacts: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch contacts", isLoading: false });
      toast.error("Failed to fetch contacts");
    }
  },

  getContactById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/contact/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch contact", isLoading: false });
      toast.error("Failed to fetch contact");
      return null;
    }
  },

  createContact: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, data);
      set((state) => ({
        contacts: [...state.contacts, response.data],
        isLoading: false,
      }));
      toast.success("Contact created successfully");
    } catch (error) {
      set({ error: "Failed to create contact", isLoading: false });
      toast.error("Failed to create contact");
    }
  },

  updateContact: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/contact/${id}`, data);
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.id === id ? response.data : contact
        ),
        isLoading: false,
      }));
      toast.success("Contact updated successfully");
    } catch (error) {
      set({ error: "Failed to update contact", isLoading: false });
      toast.error("Failed to update contact");
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/contact/${id}`);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
        isLoading: false,
      }));
      toast.success("Contact deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete contact", isLoading: false });
      toast.error("Failed to delete contact");
    }
  },

  submitComplaint: async (complaint) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${BASE_URL}/api/contact`, complaint);
      set({ isLoading: false });
      toast.success("Complaint submitted successfully");
    } catch (error) {
      set({ error: "Failed to submit complaint", isLoading: false });
      toast.error("Failed to submit complaint");
    }
  },
}));
