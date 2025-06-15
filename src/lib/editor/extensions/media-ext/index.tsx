import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

// TypeScript interfaces
interface MediaAttrs {
  src: string;
  alt?: string;
  type: "image" | "video" | "audio";
  caption?: string;
  width?: number;
  height?: number;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1", "3/4", "auto"
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
}

interface MediaNodeViewProps extends NodeViewProps {
  node: {
    attrs: MediaAttrs;
  };
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
const getAspectRatioClass = (aspectRatio?: string) => {
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
const getObjectFitClass = (objectFit?: string) => {
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
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+WVsTpn2kd7+aq18L4Q="
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
    >
      <source src={src} type="audio/mpeg" />
      <source src={src} type="audio/ogg" />
      <source src={src} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};

// Main MediaComponent with proper typing
const MediaComponent = ({ node }: MediaNodeViewProps) => {
  const { src, alt, type, caption, width, height, aspectRatio, objectFit } =
    node.attrs;

  // Validate required attributes
  if (!src) {
    return (
      <NodeViewWrapper as="div" className="p-4">
        <MediaError type="media" />
      </NodeViewWrapper>
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

  return (
    <NodeViewWrapper as="div" className={containerClass}>
      {renderMedia()}
    </NodeViewWrapper>
  );
};

// The TipTap extension with improved validation
const Media = Node.create({
  name: "media",
  group: "block",
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        renderHTML: (attrs) => ({ src: attrs.src }),
        parseHTML: (element) => element.getAttribute("src") || "",
      },
      alt: {
        default: null,
        renderHTML: (attrs) => (attrs.alt ? { alt: attrs.alt } : {}),
        parseHTML: (element) => element.getAttribute("alt"),
      },
      type: {
        default: "image",
        renderHTML: (attrs) => ({ "data-type": attrs.type }),
        parseHTML: (element) => {
          const type = element.getAttribute("data-type");
          return ["image", "video", "audio"].includes(type as string)
            ? type
            : "image";
        },
      },
      caption: {
        default: null,
        renderHTML: (attrs) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
        parseHTML: (element) => element.getAttribute("data-caption"),
      },
      width: {
        default: 300,
        renderHTML: (attrs) => ({ "data-width": attrs.width }),
        parseHTML: (element) => {
          const width = element.getAttribute("data-width");
          return width ? parseInt(width, 10) : 300;
        },
      },
      height: {
        default: 400,
        renderHTML: (attrs) => ({ "data-height": attrs.height }),
        parseHTML: (element) => {
          const height = element.getAttribute("data-height");
          return height ? parseInt(height, 10) : 400;
        },
      },
      aspectRatio: {
        default: "3/4",
        renderHTML: (attrs) => ({ "data-aspect-ratio": attrs.aspectRatio }),
        parseHTML: (element) => {
          const ratio = element.getAttribute("data-aspect-ratio");
          const validRatios = [
            "16/9",
            "4/3",
            "3/4",
            "1/1",
            "3/2",
            "2/3",
            "auto",
          ];
          return validRatios.includes(ratio as string) ? ratio : "3/4";
        },
      },
      objectFit: {
        default: "cover",
        renderHTML: (attrs) => ({ "data-object-fit": attrs.objectFit }),
        parseHTML: (element) => {
          const fit = element.getAttribute("data-object-fit");
          const validFits = ["cover", "contain", "fill", "scale-down", "none"];
          return validFits.includes(fit as string) ? fit : "cover";
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "media-node",
        getAttrs: (element) => {
          // Validate that we have at least a src attribute
          const src = element.getAttribute("src");
          return src ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["media-node", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaComponent);
  },

  // Add commands for programmatic insertion
  addCommands() {
    return {
      insertMedia:
        (attributes: Partial<MediaAttrs>) =>
        ({ commands }) => {
          if (!attributes.src) {
            console.warn("Media insertion requires src attribute");
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});

export default Media;
export type { MediaAttrs, MediaNodeViewProps };
