"use client";
import { Box } from "@chakra-ui/react";
import TipTapEditor from "@/src/app/components/TipTapEditor";
import { PermissionGuard } from "../../../PermissionGuard";
import { useAuth } from "@/src/hooks/useAuth";
import { usePenstackEditorStore } from "@/src/state/penstack-editor";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { decodeAndSanitizeHtml, sanitizeAndEncodeHtml } from "@/src/utils";
import { PostSelectForEditing } from "@/src/types";
import { usePostSeoMetaStore } from "@/src/state/post-seo-meta";

export default function NewPostPage({ post }: { post: PostSelectForEditing }) {
  useEditorPostManagerStore.getState().setPost(post!);
  return <PostEditor />;
}

export function PostEditor() {
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const activePost = useEditorPostManagerStore((state) => state.activePost);
  const setEditorContent = usePenstackEditorStore(
    (state) => state.setEditorContent
  );
  const setKeyValue = usePostSeoMetaStore((state) => state.setKeyValue);
  const setPostIdOrSlug = usePostSeoMetaStore((state) => state.setPostIdOrSlug);
  setPostIdOrSlug(activePost?.post_id || "");

  const { user } = useAuth();

  function onEditorUpdate(content: { html: string; text?: string }) {
    setEditorContent(content);
    updateField("content", sanitizeAndEncodeHtml(content.html));
  }
  return (
    <PermissionGuard
      requiredPermission={"posts:create"}
      isOwner={activePost?.author_id === user?.id}
    >
      <Box h="full" overflowY="auto">
        <TipTapEditor
          onUpdate={onEditorUpdate}
          initialContent={decodeAndSanitizeHtml(activePost?.content || "")}
        />
      </Box>
    </PermissionGuard>
  );
}
