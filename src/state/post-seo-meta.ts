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
  isLoading: boolean;
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
  // Internal state to track initial values
  _initialValues: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string[];
    canonical_url?: string;
  };
};

export const usePostSeoMetaStore = create<PostSeoMetaStore>((set, get) => {
  // Create debounced save function
  const debouncedSave = debounce(async () => {
    const state = get();
    const {
      title,
      description,
      image,
      keywords,
      canonical_url,
      postIdOrSlug,
      _initialValues,
    } = state;

    const currentValues = {
      title,
      description,
      image,
      keywords,
      canonical_url,
    };
    console.log({ currentValues, _initialValues });
    // Check if there are any changes from initial values
    if (isEqual(currentValues, _initialValues)) {
      return; // No changes, skip saving
    }

    set({ isSaving: true });

    try {
      const response = await fetch(`/api/posts/${postIdOrSlug}/seometa`, {
        method: "POST",
        body: JSON.stringify(currentValues),
      });

      if (!response.ok) {
        throw new Error("Failed to save SEO meta");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const updatedValues = {
        title: data.data.title,
        description: data.data.description,
        image: data.data.image,
        keywords: data.data.keywords,
        canonical_url: data.data.canonical_url,
      };

      set({
        ...updatedValues,
        _initialValues: { ...updatedValues }, // Update initial values after successful save
        isSaving: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isSaving: false,
      });
    }
  }, 1000);

  return {
    title: "",
    post_id: null,
    description: "",
    image: "",
    keywords: [],
    canonical_url: "",
    isSaving: false,
    postIdOrSlug: null,
    error: null,
    isLoading: false,
    _initialValues: {
      title: "",
      description: "",
      image: "",
      keywords: [],
      canonical_url: "",
    },

    setKeyValue: (key, value) => {
      set({ [key]: value });
      debouncedSave();
    },

    saveSeoMeta: debouncedSave,

    setPostIdOrSlug: (postIdOrSlug: string) => {
      set({ postIdOrSlug });
    },

    fetchSeoMeta: async () => {
      set({ isLoading: true });
      try {
        const { postIdOrSlug } = get();
        const response = await fetch(`/api/posts/${postIdOrSlug}/seometa`);

        if (!response.ok) {
          throw new Error("Failed to fetch SEO meta");
        }

        const data = await response.json();
        const fetchedValues = {
          title: data.data.title,
          description: data.data.description,
          image: data.data.image,
          keywords: data.data.keywords,
          canonical_url: data.data.canonical_url,
        };

        set({
          ...fetchedValues,
          _initialValues: { ...fetchedValues }, // Set initial values when fetching
          error: null,
        });
      } catch (error: any) {
        set({ error: error.message });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
