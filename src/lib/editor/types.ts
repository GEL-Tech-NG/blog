export const mediaAspectRatios = [
  "3/2",
  "2/3",
  "16/9",
  "4/3",
  "1/1",
  "3/4",
  "auto",
] as const;
export const mediaObjectFits = [
  "cover",
  "contain",
  "fill",
  "scale-down",
  "none",
] as const;
export type MediaAspectRatios = (typeof mediaAspectRatios)[number];
export type MediaObjectFits = (typeof mediaObjectFits)[number];
