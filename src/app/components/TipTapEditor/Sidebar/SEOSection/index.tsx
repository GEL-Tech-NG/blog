// SEOSection.tsx
import { Stack, Text } from "@chakra-ui/react";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/Sidebar/components/FeaturedImageCard";
import { SlugInput } from "../components/SlugInput";
import { SummaryInput } from "../components/SummaryInput";

import { SectionCard } from "../../../Dashboard/SectionCard";

export const SEOSection = () => {
  return (
    <SectionCard title="Post details">
      <Stack p={4}>
        <Text as="span" fontWeight={500}>
          Banner Image:
        </Text>
        <FeaturedImageCard />
        <SlugInput />
        <SummaryInput />
      </Stack>
    </SectionCard>
  );
};
