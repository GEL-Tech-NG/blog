import { MediaModal } from "@/src/app/components/Dashboard/Medias/MediaModal";
import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";
import { usePostSeoMetaStore } from "@/src/state/post-seo-meta";
import { MediaResponse } from "@/src/types";
import {
  FormControl,
  Input,
  FormLabel,
  Textarea,
  Stack,
  Box,
  Image,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import isEmpty from "just-is-empty";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";

export const SeoPanel = () => {
  return (
    <Stack gap={3} className="p-0">
      <SectionCard title="SEO Metadata">
        <Stack gap={3} px={4} py={3}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea />
          </FormControl>
          <FormControl>
            <FormLabel>Canonical URL</FormLabel>
            <Input />
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <ImageUploadAndPreview />
          </FormControl>
          <FormControl>
            <FormLabel>Keywords</FormLabel>
            <Input />
          </FormControl>
        </Stack>
      </SectionCard>
    </Stack>
  );
};
const ImageUploadAndPreview = () => {
  const image = usePostSeoMetaStore((state) => state.image);
  const setKeyValue = usePostSeoMetaStore((state) => state.setKeyValue);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleImageSelect = (media: MediaResponse) => {
    setKeyValue("image", media.url);
    onClose();
  };
  return (
    <>
      <Stack gap={3}>
        {isEmpty(image) ? (
          <Box className="flex flex-col gap-2">
            <Box className="w-full h-40 bg-gray-100 rounded-md border border-gray-200 border-dashed flex  flex-col items-center justify-center gap-1">
              <span className="text-sm text-gray-500 font-medium">
                Add Image for Open Graph
              </span>

              <span className="text-xs text-gray-500">
                Recommended size: 1200x630
              </span>
            </Box>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={onOpen}
            >
              <LuPlus className="w-4 h-4 mr-2" /> Add Image
            </Button>
          </Box>
        ) : (
          <Box className="flex flex-col gap-2">
            <Box className="w-full h-40 bg-gray-100 rounded-md">
              <Image
                src={image}
                alt="Image Upload"
                className="w-full h-full object-contain"
              />
            </Box>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              className="w-full"
              onClick={() => setKeyValue("image", "")}
            >
              <LuTrash2 className="w-4 h-4 mr-2" /> Remove Image
            </Button>
          </Box>
        )}
      </Stack>
      <MediaModal
        onClose={onClose}
        isOpen={isOpen}
        maxSelection={1}
        defaultFilters={{ type: "image" }}
        onSelect={(media) => {
          if (Array.isArray(media)) {
            handleImageSelect(media[0]);
          } else {
            handleImageSelect(media);
          }
        }}
      />
    </>
  );
};
