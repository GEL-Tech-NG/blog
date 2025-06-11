"use client";
import { Spinner, Stack, Text, HStack } from "@chakra-ui/react";

import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";

import { LuCheck } from "react-icons/lu";
import { CategorySection } from "./CategorySection";
import { TagsSection } from "./TagsSection";
import { SEOSection } from "./SEOSection";
import { ActionButtons } from "./components/ActionButtons";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { PublishMetadata } from "./components/PublishMetadata";
import { EditorSidebarTabPanels } from "./TabPanels";

export const SidebarContent = () => {
  const isSaving = useEditorPostManagerStore((state) => state.isSaving);

  return (
    <>
      <EditorSidebarTabPanels />
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
