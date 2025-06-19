import BlogPage from "@/src/app/components/blog";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { getSession } from "@/src/lib/auth/next-auth";
import { getPost } from "@/src/lib/queries/post";
import { getSettings } from "@/src/lib/queries/settings";
import { notFound } from "next/navigation";

export default async function PostPreviewPage({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const user = await getSession();
  if (!user) {
    return "Unauthorized";
  }
  try {
    const siteSettings = await getSettings();
    const post = await getPost(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    return (
      <PermissionGuard requiredPermission="posts:create" shouldRedirect>
        <BlogPage post={post} siteSettings={siteSettings} />;
      </PermissionGuard>
    );
  } catch (error) {
    return notFound();
  }
}
