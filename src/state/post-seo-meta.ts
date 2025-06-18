import { create } from "zustand";

import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import isEmpty from "just-is-empty";
import { type DebouncedFunc } from "lodash";

type PostSeoMeta = {
  title: string;
  description: string;
  image: string;
  post_id: number | null;
  keywords?: string[];
  canonical_url?: string;
};
type PostSeoMetaStore = {
  isSaving: boolean;
  saveSeoMeta: () => DebouncedFunc<() => Promise<void>>;
  postIdOrSlug: string | null;
  error: string | null;
  isLoading: boolean;
  setPostIdOrSlug: (postIdOrSlug: string) => void;
  fetchSeoMeta: () => Promise<void>;
  setKeyValue: (
    key: keyof Partial<
      Omit<
        PostSeoMetaStore,
        "saveSeoMeta" | "setPostIdOrSlug" | "setKeyValue" | "fetchSeoMeta"
      >
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

export const usePostSeoMetaStore = create<PostSeoMetaStore & PostSeoMeta>(
  (set, get) => {
    let initialValues: PostSeoMeta | null = null;
    const debouncedSave = debounce(async () => {
      const state = get();
      const {
        title,
        description,
        image,
        keywords,
        canonical_url,
        postIdOrSlug,
        post_id,
      } = state;

      const postSeoData = {
        title,
        description,
        image,
        keywords,
        canonical_url,
        post_id,
      };

      if (!postIdOrSlug) {
        set({ error: "Post ID or slug is required to save SEO meta." });
        return;
      }
      const changedValues: Partial<PostSeoMeta> = {};
      Object.keys(postSeoData).forEach((key) => {
        // Skip excluded fields and undefined values
        if (postSeoData[key as keyof PostSeoMeta] === undefined) {
          return;
        }

        // Only include if value has changed from original
        const currentValue = postSeoData[key as keyof PostSeoMeta];
        const originalValue = initialValues?.[key as keyof PostSeoMeta];

        if (
          !isEqual(currentValue, originalValue) &&
          currentValue !== undefined &&
          currentValue !== null
        ) {
          (changedValues as any)[key as keyof PostSeoMeta] = currentValue;
        }
      });
      // If no changes, skip the API call
      if (isEmpty(changedValues)) {
        set({ isSaving: false });
        return;
      }
      console.log({ postSeoData, changedValues, initialValues });
      // Check if there are any changes from initial values
      if (isEqual(changedValues, initialValues)) {
        return; // No changes, skip saving
      }

      set({ isSaving: true });

      try {
        const response = await fetch(`/api/posts/${postIdOrSlug}/seometa`, {
          method: "POST",
          body: JSON.stringify(changedValues),
        });

        if (!response.ok) {
          throw new Error("Failed to save SEO meta");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const updatedValues = {
          post_id: data.data.post_id,
          title: data.data.title,
          description: data.data.description,
          image: data.data.image,
          keywords: data.data.keywords,
          canonical_url: data.data.canonical_url,
        };
        initialValues = { ...updatedValues }; // Update initial values after successful save
        set({
          ...updatedValues,

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
      setKeyValue: (key, value) => {
        set({ [key]: value });
        debouncedSave();
      },

      saveSeoMeta: () => debouncedSave,
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
            post_id: data.data.post_id,
            title: data.data.title,
            description: data.data.description,
            image: data.data.image,
            keywords: data.data.keywords,
            canonical_url: data.data.canonical_url,
          };
          initialValues = { ...fetchedValues }; // Set initial values for future comparisons
          set({
            ...fetchedValues,

            error: null,
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
    };
  }
);
