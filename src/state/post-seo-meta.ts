import { create } from "zustand";

type PostSeoMetaStore = {
  title?: string;
  description?: string;
  image?: string;
  post_id: number | null;
  keywords?: string[];
  canonical_url?: string;
  setKeyValue: (
    key: keyof PostSeoMetaStore,
    value: PostSeoMetaStore[keyof PostSeoMetaStore]
  ) => void;
};

export const usePostSeoMetaStore = create<PostSeoMetaStore>((set) => ({
  title: "",
  post_id: null,
  description: "",
  image: "",
  keywords: [],
  canonical_url: "",
  setKeyValue: (key, value) => set({ [key]: value }),
}));
