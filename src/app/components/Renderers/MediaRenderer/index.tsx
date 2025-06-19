import { MediaAttrs } from "@/src/lib/editor/extensions/media-ext";
import {
  MediaComponentNew,
  type MediaNodeViewProps,
} from "@/src/lib/editor/nodes/media/MediaComponents";

export const MediaRenderer = ({
  isEditing = false,
  attrs,
  node,
}: {
  isEditing?: boolean;
  attrs?: MediaAttrs;
  node?: MediaNodeViewProps["node"];
}) => {
  return (
    <MediaComponentNew isEditing={isEditing} attrs={attrs} node={node as any} />
  );
};
