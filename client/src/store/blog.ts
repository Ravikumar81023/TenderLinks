import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    isLoading: boolean;
    error: string | null;
    selectedBlog: Blog | null;
    fetchBlogs: () => Promise<void>;
    fetchBlogById: (id: number) => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set) => ({
    blogs: [],
    isLoading: false,
    error: null,
    selectedBlog: null,

    fetchBlogs: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/blog`);
            set({ blogs: response.data, isLoading: false });
        } catch (error) {
            set({
                error: "Failed to fetch blogs",
                isLoading: false,
            });
            toast.error("Failed to fetch blogs");
        }
    },
    fetchBlogById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/blog/${id}`);
            set({ selectedBlog: response.data, isLoading: false });
        } catch (error) {
            set({
                error: "Failed to fetch blog",
                isLoading: false,
            });
            toast.error("Failed to fetch blog");
        }
    },
}));
