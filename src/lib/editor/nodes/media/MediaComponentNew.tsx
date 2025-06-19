import { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { MediaAspectRatios, MediaObjectFits } from "../../types";
import { Image } from "@chakra-ui/react";

// TypeScript interfaces
export interface MediaAttrs {
  src: string;
  alt?: string;
  type: "image" | "video" | "audio";
  caption?: string;
  width?: number;
  height?: number;
  aspectRatio?: MediaAspectRatios;
  objectFit?: MediaObjectFits;
}

export interface MediaNodeViewProps extends Partial<NodeViewProps> {
  node: NodeViewProps["node"] & {
    attrs: MediaAttrs;
  };
  attrs?: MediaAttrs;
  isEditing?: boolean;
}

// Error boundary component for media failures
const MediaError = ({
  type,
  onRetry,
}: {
  type: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
    <div className="text-gray-500 mb-2">Failed to load {type}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Try again
      </button>
    )}
  </div>
);

// Loading placeholder
const MediaLoading = ({ type }: { type: string }) => (
  <div className="flex items-center justify-center p-8 bg-gray-100 rounded-md animate-pulse">
    <div className="text-gray-500">Loading {type}...</div>
  </div>
);

// Helper function to get aspect ratio class
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

// Image component with error handling
const ImageMedia = ({
  src,
  alt,
  caption,
  width = 300,
  height = 400,
  aspectRatio = "3/4",
  objectFit = "cover",
}: MediaAttrs) => {
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

// Video component with error handling
const VideoMedia = ({ src }: { src: string }) => {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    return <MediaError type="video" onRetry={() => setVideoError(false)} />;
  }

  return (
    <video
      controls
      className="rounded-md max-w-full"
      onError={() => setVideoError(true)}
      preload="metadata"
      src={src}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      <source src={src} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  );
};

// Audio component with error handling
const AudioMedia = ({ src }: { src: string }) => {
  const [audioError, setAudioError] = useState(false);

  if (audioError) {
    return <MediaError type="audio" onRetry={() => setAudioError(false)} />;
  }

  return (
    <audio
      controls
      className="w-full"
      onError={() => setAudioError(true)}
      preload="metadata"
      src={src}
    >
      <source src={src} type="audio/mpeg" />
      <source src={src} type="audio/ogg" />
      <source src={src} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};

// Main MediaComponent with proper typing
export const MediaComponentNew = ({
  node,
  attrs,
  isEditing = true,
}: MediaNodeViewProps) => {
  const { src, alt, type, caption, width, height, aspectRatio, objectFit } =
    isEditing ? node.attrs : attrs || {};
  console.log({
    attrs,
  });

  // Validate required attributes
  if (!src) {
    return isEditing ? (
      <NodeViewWrapper as="div" className="p-4">
        <MediaError type="media" />
      </NodeViewWrapper>
    ) : (
      <div className="p-4">
        <MediaError type="media" />
      </div>
    );
  }

  const renderMedia = () => {
    switch (type) {
      case "image":
        return (
          <ImageMedia
            src={src}
            alt={alt}
            type="image"
            caption={caption}
            width={width}
            height={height}
            aspectRatio={aspectRatio}
            objectFit={objectFit}
          />
        );
      case "video":
        return <VideoMedia src={src} />;
      case "audio":
        return <AudioMedia src={src} />;
      default:
        return <MediaError type="unknown media type" />;
    }
  };

  const containerClass = type === "image" ? "flex w-max space-x-4 p-4" : "p-4";

  return isEditing ? (
    <NodeViewWrapper as="div" className={containerClass}>
      {renderMedia()}
    </NodeViewWrapper>
  ) : (
    <div className={containerClass}>{renderMedia()}</div>
  );
};
