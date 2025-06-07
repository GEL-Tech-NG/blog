import PostPage from "@/src/app/components/pages/PostPage";

import { PostSelect } from "@/src/types";
import {
  objectToQueryParams,
  shortenText,
  stripHtml,
  decodeAndSanitizeHtml,
} from "@/src/utils";

export default function BlogPage({ post }: { post: PostSelect }) {
  return (
    <>
      <PostPage post={post as any} />;
    </>
  );
}
function generatePostDescription(post: any) {
  const description = shortenText(
    post?.summary || stripHtml(decodeAndSanitizeHtml(post?.content || "")),
    200
  );
  return description;
}
