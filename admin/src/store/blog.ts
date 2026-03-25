import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL =import.meta.env.VITE_BASE_URL ||"http://localhost:3000";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string | null;
  video: string | null;
  status: "Draft" | "Published";
  uploadDate: string;
}

interface BlogStore {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  selectedBlog: Blog | null;
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: number) => Promise<void>;
  createBlog: (formData: FormData) => Promise<void>;
  updateBlog: (id: number, formData: FormData) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;
  updateBlogStatus: (
    id: number,
    status: "Draft" | "Published",
  ) => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  loading: false,
  error: null,
  selectedBlog: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/blog`);
      set({ blogs: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch blogs",
        loading: false,
      });
      toast.error("Failed to fetch blogs");
    }
  },

  fetchBlogById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/blog/${id}`);
      set({ selectedBlog: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch blog",
        loading: false,
      });
      toast.error("Failed to fetch blog");
    }
  },

  createBlog: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/api/blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        blogs: [response.data, ...state.blogs],
        loading: false,
      }));
      toast.success("Blog created successfully");
    } catch (error) {
      set({
        error: "Failed to create blog",
        loading: false,
      });
      toast.error("Failed to create blog");
    }
  },

  updateBlog: async (id: number, formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BASE_URL}/api/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? response.data : blog,
        ),
        selectedBlog: null,
        loading: false,
      }));
      toast.success("Blog updated successfully");
    } catch (error) {
      set({
        error: "Failed to update blog",
        loading: false,
      });
      toast.error("Failed to update blog");
    }
  },

  deleteBlog: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/blog/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        loading: false,
      }));
      toast.success("Blog deleted successfully");
    } catch (error) {
      set({
        error: "Failed to delete blog",
        loading: false,
      });
      toast.error("Failed to delete blog");
    }
  },

  updateBlogStatus: async (id: number, status: "Draft" | "Published") => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`${BASE_URL}/api/blog/${id}/status`, {
        status,
      });
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? response.data : blog,
        ),
        loading: false,
      }));
      toast.success("Blog status updated successfully");
    } catch (error) {
      set({
        error: "Failed to update blog status",
        loading: false,
      });
      toast.error("Failed to update blog status");
    }
  },
}));
