import { create } from "zustand";

import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import isEmpty from "just-is-empty";

type PostSeoMetaStore = {
  title?: string;
  description?: string;
  image?: string;
  post_id: number | null;
  keywords?: string[];
  canonical_url?: string;
  isSaving: boolean;
  saveSeoMeta: () => Promise<void>;
  postIdOrSlug: string | null;
  error: string | null;
  setPostIdOrSlug: (postIdOrSlug: string) => void;
  fetchSeoMeta: () => Promise<void>;
  setKeyValue: (
    key: keyof Omit<
      PostSeoMetaStore,
      "saveSeoMeta" | "setPostIdOrSlug" | "setKeyValue" | "fetchSeoMeta"
    >,
    value: Omit<
      PostSeoMetaStore,
      "saveSeoMeta" | "setPostIdOrSlug" | "setKeyValue" | "fetchSeoMeta"
    >[keyof Omit<
      PostSeoMetaStore,
      "saveSeoMeta" | "setPostIdOrSlug" | "setKeyValue" | "fetchSeoMeta"
    >]
  ) => void;
};

export const usePostSeoMetaStore = create<PostSeoMetaStore>((set, get) => ({
  title: "",
  post_id: null,
  description: "",
  image: "",
  keywords: [],
  canonical_url: "",
  isSaving: false,
  postIdOrSlug: null,
  error: null,
  setKeyValue: (key, value) => {
    set({ [key]: value });
    get().saveSeoMeta();
  },
  saveSeoMeta: async () => {
    const { title, description, image, keywords, canonical_url, postIdOrSlug } =
      get();
    const seoMeta = { title, description, image, keywords, canonical_url };
    const debouncedSave = debounce(async () => {
      try {
        const response = await fetch(`/api/posts/${postIdOrSlug}/seometa`, {
          method: "POST",
          body: JSON.stringify(seoMeta),
        });
        if (!response.ok) {
          throw new Error("Failed to save SEO meta");
        }
        const data = await response.json();
        set({
          title: data.data.title,
          description: data.data.description,
          image: data.data.image,
          keywords: data.data.keywords,
          canonical_url: data.data.canonical_url,
        });
        if (data.error) {
          throw new Error(data.error);
        }
        set({ isSaving: false });
      } catch (error: any) {
        set({ error: error.message });
        set({ isSaving: false });
      }
    }, 1000);
    debouncedSave();
  },
  setPostIdOrSlug: (postIdOrSlug: string) => {
    set({ postIdOrSlug });
  },
  fetchSeoMeta: async () => {
    try {
      const { postIdOrSlug } = get();
      const response = await fetch(`/api/posts/${postIdOrSlug}/seometa`);
      if (!response.ok) {
        throw new Error("Failed to fetch SEO meta");
      }
      const data = await response.json();
      set({
        title: data.data.title,
        description: data.data.description,
        image: data.data.image,
        keywords: data.data.keywords,
        canonical_url: data.data.canonical_url,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
