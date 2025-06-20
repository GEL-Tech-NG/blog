import { create } from "zustand";
import { type MediaAttrs } from "../nodes/media/MediaComponents";
import { type MediaAspectRatios, type MediaObjectFits } from "../types";

interface MediaState extends MediaAttrs {
  // UI state
  isEditing: boolean;
  selected: boolean;
  imageError: boolean;
  imageLoading: boolean;

  // Actions
  updateAttrs: (attrs: Partial<MediaAttrs>) => void;
  setEditing: (editing: boolean) => void;
  setSelected: (selected: boolean) => void;
  setImageError: (error: boolean) => void;
  setImageLoading: (loading: boolean) => void;
  resetImageState: () => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  // Default values
  src: "",
  alt: "",
  caption: "",
  width: 300,
  height: 400,
  aspectRatio: "3/4" as MediaAspectRatios,
  objectFit: "cover" as MediaObjectFits,
  type: "image",
  // UI state
  isEditing: false,
  selected: false,
  imageError: false,
  imageLoading: true,

  // Actions
  updateAttrs: (attrs) => set((state) => ({ ...state, ...attrs })),

  setEditing: (editing) => set({ isEditing: editing }),

  setSelected: (selected) => set({ selected }),

  setImageError: (error) => set({ imageError: error }),

  setImageLoading: (loading) => set({ imageLoading: loading }),

  resetImageState: () => set({ imageError: false, imageLoading: true }),
}));

// Selector hooks for performance optimization
export const useMediaAttrs = () => {
  const state = useMediaStore.getState();
  return {
    src: state.src,
    alt: state.alt,
    caption: state.caption,
    width: state.width,
    height: state.height,
    aspectRatio: state.aspectRatio,
    objectFit: state.objectFit,
  };
};

export const useMediaUI = () => {
  const state = useMediaStore.getState();
  return {
    isEditing: state.isEditing,
    selected: state.selected,
    imageError: state.imageError,
    imageLoading: state.imageLoading,
  };
};

export const useMediaActions = () => {
  const state = useMediaStore.getState();
  return {
    updateAttrs: state.updateAttrs,
    setEditing: state.setEditing,
    setSelected: state.setSelected,
    setImageError: state.setImageError,
    setImageLoading: state.setImageLoading,
    resetImageState: state.resetImageState,
  };
};
