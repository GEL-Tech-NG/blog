import { Image } from "@chakra-ui/react";
import { MediaError } from "./MediaError";
import { useState } from "react";
import { MediaLoading } from "./MediaLoading";
import { MediaAspectRatios, MediaObjectFits } from "../../../types";
import { MediaAttrs } from "../../../extensions/media-ext";

const getAspectRatioClass = (aspectRatio?: MediaAspectRatios) => {
  const ratioMap: Record<string, string> = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "3/2": "aspect-[3/2]",
    "2/3": "aspect-[2/3]",
    auto: "aspect-auto",
  };
  return ratioMap[aspectRatio || "3/4"] || "aspect-[3/4]";
};

// Helper function to get object fit class
const getObjectFitClass = (objectFit?: MediaObjectFits) => {
  const fitMap: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    "scale-down": "object-scale-down",
    none: "object-none",
  };
  return fitMap[objectFit || "cover"] || "object-cover";
};
type ImageMediaProps = MediaAttrs & {
  isEditing?: boolean;
  updateAttrs?: (attrs: Partial<MediaAttrs>) => void;
  selected?: boolean;
};
export const ImageMedia = ({
  src,
  alt,
  caption,
  width = 300,
  height = 400,
  aspectRatio = "3/4",
  objectFit = "cover",
  selected,
  isEditing = true,
  updateAttrs,
}: ImageMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError) {
    return <MediaError type="image" onRetry={() => setImageError(false)} />;
  }

  const aspectClass = getAspectRatioClass(aspectRatio);
  const objectFitClass = getObjectFitClass(objectFit);

  return (
    <figure className="shrink-0">
      <div className={`overflow-hidden rounded-md relative ${aspectClass}`}>
        {imageLoading && (
          <div className="absolute inset-0 z-10">
            <MediaLoading type="image" />
          </div>
        )}
        <Image
          src={src}
          alt={alt || "Media content"}
          className={`h-full w-full ${objectFitClass}`}
          width={width}
          height={height}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground pt-2 text-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
