import { Box, List, Stack, useDisclosure } from "@chakra-ui/react";
import { CommentsToggle } from "./CommentsToggle";
import { MetricsItem } from "./MetricsItem";
import { PinnedToggle } from "./PinnedToggle";
import { ScheduleItem } from "./ScheduleItem";
import { StatusItem } from "./StatusItem";
import { VisibilityItem } from "./VisibilityItem";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";

export const PublishMetadata = () => {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const visibility = useEditorPostManagerStore(
    (state) => state.activePost?.visibility
  );
  const isSticky = useEditorPostManagerStore(
    (state) => state.activePost?.is_sticky
  );
  const allowComments = useEditorPostManagerStore(
    (state) => state.activePost?.allow_comments
  );
  const status = useEditorPostManagerStore((state) => state.activePost?.status);
  const scheduledAt = useEditorPostManagerStore(
    (state) => state.activePost?.scheduled_at
  );
  return (
    <Box p={4} pb={0}>
      <Stack as={List} fontSize={14} gap={2}>
        <StatusItem status={status as string} />
        <VisibilityItem visibility={visibility as string} />
        <ScheduleItem
          scheduledAt={scheduledAt as Date}
          isOpen={isOpen}
          onClose={onClose}
          onToggle={onToggle}
        />
        <MetricsItem />
        <CommentsToggle
          allowComments={allowComments as boolean}
          onChange={() => updateField("allow_comments", !allowComments)}
        />
        <PinnedToggle
          isSticky={isSticky as boolean}
          onChange={() => updateField("is_sticky", !isSticky)}
        />
      </Stack>
    </Box>
  );
};
