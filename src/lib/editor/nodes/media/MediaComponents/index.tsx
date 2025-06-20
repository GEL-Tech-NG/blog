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

// Main MediaComponent with proper typing
export const MediaComponentNew = ({
  node,
  attrs,
  updateAttributes,
  selected,
  isEditing = true,
}: MediaNodeViewProps) => {
  const { src, alt, type, caption, width, height, aspectRatio, objectFit } =
    isEditing ? node.attrs : attrs || {};

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
            initialAttrs={{
              src,
              alt,
              caption,
              width,
              height,
              aspectRatio,
              objectFit,
              type: "image",
            }}
            onAttrsChange={updateAttributes}
            selected={selected}
            isEditing={isEditing}
          />
        );
      case "video":
        return <VideoMedia src={src} />;
      case "audio":
        return <AudioMedia src={src} />;
      default:
        return <MediaError type="Unknown media type" />;
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
