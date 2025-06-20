import {
  Image,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MediaError } from "./MediaError";
import { useState, useCallback, useMemo } from "react";
import { MediaLoading } from "./MediaLoading";
import { MediaAspectRatios, MediaObjectFits } from "../../../types";
import { MediaAttrs } from "../../../extensions/media-ext";

// Memoized aspect ratio options
const ASPECT_RATIO_OPTIONS = [
  { value: "16/9", label: "16:9 (Video)" },
  { value: "4/3", label: "4:3 (Standard)" },
  { value: "3/4", label: "3:4 (Portrait)" },
  { value: "1/1", label: "1:1 (Square)" },
  { value: "3/2", label: "3:2 (Photo)" },
  { value: "2/3", label: "2:3 (Tall)" },
  { value: "auto", label: "Auto" },
] as const;

// Memoized object fit options
const OBJECT_FIT_OPTIONS = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "fill", label: "Fill" },
  { value: "scale-down", label: "Scale Down" },
  { value: "none", label: "None" },
] as const;

const getAspectRatioClass = (aspectRatio?: MediaAspectRatios): string => {
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

const getObjectFitClass = (objectFit?: MediaObjectFits): string => {
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
  selected = false,
  isEditing = false,
  updateAttrs,
}: ImageMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Memoized classes
  const aspectClass = useMemo(
    () => getAspectRatioClass(aspectRatio),
    [aspectRatio]
  );
  const objectFitClass = useMemo(
    () => getObjectFitClass(objectFit),
    [objectFit]
  );

  // Optimized update handlers
  const handleUpdateAttrs = useCallback(
    (newAttrs: Partial<MediaAttrs>) => {
      updateAttrs?.(newAttrs);
    },
    [updateAttrs]
  );

  const handleSrcChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdateAttrs({ src: e.target.value });
    },
    [handleUpdateAttrs]
  );

  const handleAltChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdateAttrs({ alt: e.target.value });
    },
    [handleUpdateAttrs]
  );

  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdateAttrs({ caption: e.target.value });
    },
    [handleUpdateAttrs]
  );

  const handleWidthChange = useCallback(
    (valueString: string) => {
      const value = parseInt(valueString);
      if (!isNaN(value) && value > 0) {
        handleUpdateAttrs({ width: value });
      }
    },
    [handleUpdateAttrs]
  );

  const handleHeightChange = useCallback(
    (valueString: string) => {
      const value = parseInt(valueString);
      if (!isNaN(value) && value > 0) {
        handleUpdateAttrs({ height: value });
      }
    },
    [handleUpdateAttrs]
  );

  const handleAspectRatioChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleUpdateAttrs({ aspectRatio: e.target.value as MediaAspectRatios });
    },
    [handleUpdateAttrs]
  );

  const handleObjectFitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleUpdateAttrs({ objectFit: e.target.value as MediaObjectFits });
    },
    [handleUpdateAttrs]
  );

  const handleRetry = useCallback(() => {
    setImageError(false);
    setImageLoading(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const containerClasses = useMemo(() => {
    let classes = `overflow-hidden rounded-md relative ${aspectClass}`;
    if (isEditing && selected) {
      classes += " ring-2 ring-blue-500 ring-offset-2";
    }
    return classes;
  }, [aspectClass, isEditing, selected]);
  if (imageError) {
    return <MediaError type="image" onRetry={handleRetry} />;
  }

  // Determine container classes

  return (
    <VStack spacing={4} align="stretch">
      {/* Editing Controls */}
      {isEditing && (
        <VStack
          spacing={3}
          p={4}
          bg="gray.50"
          rounded="md"
          border="1px"
          borderColor="gray.200"
        >
          <Text fontWeight="semibold" fontSize="sm" color="gray.700">
            Image Settings
          </Text>

          {/* Source URL */}
          <VStack align="stretch" spacing={1}>
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              Source URL
            </Text>
            <Input
              size="sm"
              value={src || ""}
              onChange={handleSrcChange}
              placeholder="Enter image URL"
            />
          </VStack>

          {/* Alt Text */}
          <VStack align="stretch" spacing={1}>
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              Alt Text
            </Text>
            <Input
              size="sm"
              value={alt || ""}
              onChange={handleAltChange}
              placeholder="Enter alt text"
            />
          </VStack>

          {/* Caption */}
          <VStack align="stretch" spacing={1}>
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              Caption
            </Text>
            <Input
              size="sm"
              value={caption || ""}
              onChange={handleCaptionChange}
              placeholder="Enter caption"
            />
          </VStack>

          <HStack spacing={4} width="100%">
            {/* Width */}
            <VStack align="stretch" spacing={1} flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                Width (px)
              </Text>
              <NumberInput
                size="sm"
                value={width}
                min={50}
                max={2000}
                onChange={handleWidthChange}
              >
                <NumberInputField />
              </NumberInput>
            </VStack>

            {/* Height */}
            <VStack align="stretch" spacing={1} flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                Height (px)
              </Text>
              <NumberInput
                size="sm"
                value={height}
                min={50}
                max={2000}
                onChange={handleHeightChange}
              >
                <NumberInputField />
              </NumberInput>
            </VStack>
          </HStack>

          <HStack spacing={4} width="100%">
            {/* Aspect Ratio */}
            <VStack align="stretch" spacing={1} flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                Aspect Ratio
              </Text>
              <Select
                size="sm"
                value={aspectRatio}
                onChange={handleAspectRatioChange}
              >
                {ASPECT_RATIO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </VStack>

            {/* Object Fit */}
            <VStack align="stretch" spacing={1} flex={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                Object Fit
              </Text>
              <Select
                size="sm"
                value={objectFit}
                onChange={handleObjectFitChange}
              >
                {OBJECT_FIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </VStack>
          </HStack>
        </VStack>
      )}

      {/* Image Display */}
      <figure className="shrink-0">
        <div className={containerClasses}>
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
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="text-muted-foreground pt-2 text-xs">
            {caption}
          </figcaption>
        )}
      </figure>
    </VStack>
  );
};
