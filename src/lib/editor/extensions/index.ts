import { PostCardExtension } from "@/src/lib/editor/extensions/mini-post-card";
import { PenstackYouTubeExtension } from "@/src/lib/editor/extensions/youtube-embed";
import { PenstackTwitterExtension } from "@/src/lib/editor/extensions/tweet-embed";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);
import { PenstackSlashCommandExtension } from "@/src/lib/editor/extensions/slash-command";
import PenstackBlockquote from "@/src/lib/editor/extensions/blockquote";
import { PenstackCodeblock } from "@/src/lib/editor/extensions/code-block";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Media from "@/src/lib/editor/extensions/media-ext";
import { MarkdownPasteExtension } from "./markdown-paste";
import { PenstackHeadingExtension } from "./heading";

export const extensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    blockquote: false,
  }),
  MarkdownPasteExtension,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  PenstackHeadingExtension,
  PenstackBlockquote.configure(),
  Placeholder.configure({
    placeholder: "Write something…",
  }),
  Link.configure({
    HTMLAttributes: {},
    openOnClick: false,
    autolink: true,
  }),

  Typography,
  // Image,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
  CharacterCount.configure({
    limit: 100000,
  }),
  Media,
  PostCardExtension,
  PenstackCodeblock.configure({
    lowlight,
  }),
  PenstackYouTubeExtension,
  PenstackTwitterExtension,
  PenstackSlashCommandExtension,
];
