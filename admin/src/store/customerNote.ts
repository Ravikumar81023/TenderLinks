import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface CustomerNote {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
}

interface CustomerNoteStore {
  notes: CustomerNote[];
  loading: boolean;
  error: string | null;
  fetchAllNotes: (filters?: {
    state?: string;
    sector?: string;
    district?: string;
    city?: string;
  }) => Promise<void>;
  fetchNotesByCustomer: (
    userId: number,
    filters?: {
      state?: string;
      sector?: string;
      district?: string;
      city?: string;
    },
  ) => Promise<void>;
  createNote: (userId: number, content: string) => Promise<void>;
  updateNote: (id: number, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

export const useCustomerNoteStore = create<CustomerNoteStore>((set) => ({
  notes: [],
  loading: false,
  error: null,

  // Fetch all notes with optional filters
  fetchAllNotes: async (filters) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const response = await axios.get(
        `${BASE_URL}/api/customer-notes?${queryParams.toString()}`,
      );
      set({ notes: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch all customer notes",
        loading: false,
      });
      toast.error("Failed to fetch all customer notes");
    }
  },

  // Fetch notes by a specific customer
  fetchNotesByCustomer: async (userId, filters) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const response = await axios.get(
        `${BASE_URL}/api/customer-notes/${userId}?${queryParams.toString()}`,
      );
      set({ notes: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch customer notes",
        loading: false,
      });
      toast.error("Failed to fetch customer notes");
    }
  },

  // Create a new note
  createNote: async (userId, content) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/customer-notes`, {
        userId,
        content,
      });
      set((state) => ({
        notes: [response.data, ...state.notes],
        loading: false,
      }));
      toast.success("Note created successfully");
    } catch (error) {
      set({
        error: "Failed to create note",
        loading: false,
      });
      toast.error("Failed to create note");
    }
  },

  // Update an existing note
  updateNote: async (id, content) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/customer-notes/${id}`, {
        content,
      });
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? response.data : note,
        ),
        loading: false,
      }));
      toast.success("Note updated successfully");
    } catch (error) {
      set({
        error: "Failed to update note",
        loading: false,
      });
      toast.error("Failed to update note");
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/customer-notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        loading: false,
      }));
      toast.success("Note deleted successfully");
    } catch (error) {
      set({
        error: "Failed to delete note",
        loading: false,
      });
      toast.error("Failed to delete note");
    }
  },
}));
