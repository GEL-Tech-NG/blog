import {
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { PermissionGuard } from "../../../PermissionGuard";
import { memo, useState } from "react";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { Link } from "@chakra-ui/next-js";
import { LuExternalLink } from "react-icons/lu";
import { generatePostUrl } from "@/src/utils";

export const ActionButtons = memo(() => {
  const isSaving = useEditorPostManagerStore((state) => state.isSaving);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });
  const postId = useEditorPostManagerStore(
    (state) => state.activePost?.post_id
  );
  const updateField = useEditorPostManagerStore((state) => state.updateField);

  function onDraft() {
    updateField("status", "draft");
  }

  function onPublish() {
    setIsPublishing(true);
    updateField("status", "published");
  }

  function onDelete() {
    updateField("status", "deleted");
  }

  const isPublishLoading = isSaving && isPublishing;

  return (
    <HStack gap={5}>
      <ButtonGroup size="sm" isAttached variant="outline">
        {/* Main Publish Button */}
        <PermissionGuard requiredPermission="posts:publish">
          <Button
            isDisabled={isPublishLoading}
            isLoading={isPublishLoading}
            loadingText="Publishing..."
            rounded="md"
            roundedRight="none"
            onClick={onPublish}
            colorScheme="blue"
            variant="solid"
            flex={1}
          >
            Publish
          </Button>
        </PermissionGuard>

        {/* Dropdown Menu */}
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            rounded="md"
            roundedLeft="none"
            colorScheme="blue"
            variant="solid"
            borderLeft="1px solid"
            borderLeftColor="blue.600"
            px={2}
            isDisabled={isPublishLoading}
          >
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onDraft} fontSize="sm">
              Save as Draft
            </MenuItem>

            <PermissionGuard requiredPermission="posts:delete">
              <MenuItem
                onClick={onDelete}
                fontSize="sm"
                color="red.500"
                _hover={{ bg: "red.50" }}
              >
                Delete Post
              </MenuItem>
            </PermissionGuard>
          </MenuList>
        </Menu>
      </ButtonGroup>
      <Button
        variant={"outline"}
        as={Link}
        href={"/posts/preview/" + postId}
        rightIcon={<LuExternalLink />}
        size="sm"
        colorScheme="blue"
        isExternal
      >
        Preview{" "}
      </Button>
    </HStack>
  );
});
ActionButtons.displayName = "ActionButtons";
