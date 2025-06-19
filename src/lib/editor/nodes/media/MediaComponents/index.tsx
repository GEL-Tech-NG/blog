import { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { MediaAspectRatios, MediaObjectFits } from "../../../types";
import { Image } from "@chakra-ui/react";
import { MediaError } from "./MediaError";
import { ImageMedia } from "./ImageMedia";
import { VideoMedia } from "./VideoMedia";
import { AudioMedia } from "./AudioMedia";

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

// Loading placeholder

// Helper function to get aspect ratio class

// Image component with error handling

// Video component with error handling

// Audio component with error handling

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
