import PostPage from "@/src/app/components/pages/PostPage";

import { PostSelect, SiteSettings } from "@/src/types";

export default function BlogPage({
  post,
  siteSettings,
}: {
  post: PostSelect;
  siteSettings: SiteSettings;
}) {
  return (
    <>
      <PostPage post={post as any} siteSettings={siteSettings} />;
    </>
  );
}
