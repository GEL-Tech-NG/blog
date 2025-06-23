import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";
import { MediaFields } from "@/src/lib/editor/nodes/media/MediaComponents/MediaFields";

export const BlockPanel = () => {
  return (
    <SectionCard title="Block Settings" roundedTop={0}>
      <MediaFields />
    </SectionCard>
  );
};
