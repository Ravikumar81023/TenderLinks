import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

interface SocialMedia {
  id: number;
  name: string;
  link: string;
  logo: string;
  platformName: string;
}

interface SocialMediaState {
  socialMedia: SocialMedia[];
  loading: boolean;
  error: string | null;
  fetchSocialMedia: () => Promise<void>;
  getSocialMediaById: (id: number) => Promise<SocialMedia | undefined>;
  createSocialMedia: (data: FormData) => Promise<void>;
  updateSocialMedia: (id: number, data: FormData) => Promise<void>;
  deleteSocialMedia: (id: number) => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL|| "http://localhost:3000";

export const useSocialMediaStore = create<SocialMediaState>()(
  persist(
    (set) => ({
      socialMedia: [],
      loading: false,
      error: null,

      fetchSocialMedia: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${BASE_URL}/api/socialmedia`);
          set({ socialMedia: response.data, loading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch social media";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      getSocialMediaById: async (id: number) => {
        try {
          const response = await axios.get(`${BASE_URL}/api/socialmedia/${id}`);
          return response.data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch social media";
          toast.error(errorMessage);
          return undefined;
        }
      },

      createSocialMedia: async (data: FormData) => {
        console.log(data);

        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${BASE_URL}/api/socialmedia`,
            data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          set((state) => ({
            socialMedia: [...state.socialMedia, response.data],
            loading: false,
          }));
          toast.success("Socialmedia created successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create socialmedia";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      updateSocialMedia: async (id: number, data: FormData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.put(
            `${BASE_URL}/api/socialmedia/${id}`,
            data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          set((state) => ({
            socialMedia: state.socialMedia.map((item) =>
              item.id === id ? response.data : item,
            ),
            loading: false,
          }));
          toast.success("Socialmedia updated successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update social media";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      deleteSocialMedia: async (id: number) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${BASE_URL}/api/socialmedia/${id}`);
          set((state) => ({
            socialMedia: state.socialMedia.filter((item) => item.id !== id),
            loading: false,
          }));
          toast.success("Social media deleted successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to delete social media";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },
    }),
    {
      name: "social-media-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

