import { Spinner, Stack, Text, HStack } from "@chakra-ui/react";

import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";

import { LuCheck } from "react-icons/lu";
import { CategorySection } from "../../CategorySection";
import { TagsSection } from "../../TagsSection";
import { SEOSection } from "../../SEOSection";
import { ActionButtons } from "../../components/ActionButtons";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { PublishMetadata } from "../../components/PublishMetadata";

export const PublishPanel = () => {
  const isSaving = useEditorPostManagerStore((state) => state.isSaving);

  return (
    <Stack
      gap={3}
      flexShrink={0}
      maxW={360}
      minW={300}
      width={{ base: "100%" }}
      overflowY={"auto"}
    >
      <SectionCard
        title="Publish"
        header={
          <>
            <HStack>
              {" "}
              {isSaving ? (
                <Spinner size="xs" />
              ) : (
                <Stack
                  align={"center"}
                  justify={"center"}
                  w={"14px"}
                  h={"14px"}
                  rounded="full"
                  bg="green.400"
                >
                  <LuCheck size={12} color="white" />
                </Stack>
              )}
              <Text as="span" color={isSaving ? "gray.300" : undefined}>
                {" "}
                {isSaving ? "Saving..." : "Saved"}
              </Text>
            </HStack>
          </>
        }
        footer={<ActionButtons />}
      >
        <PublishMetadata />
      </SectionCard>

      <SEOSection />

      <CategorySection />
      <TagsSection />
    </Stack>
  );
};
