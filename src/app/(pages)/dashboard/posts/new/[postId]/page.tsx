import NewPostPage from "@/src/app/components/pages/Dashboard/NewPostPage";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { getPostForEditing } from "@/src/lib/queries/post";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Create Post",
};
export default async function Page({ params }: { params: { postId: string } }) {
  const postId = params.postId;
  const post = await getPostForEditing(postId);

  if (!post) {
    return <div className=" font-bold text-xl text-center">Post not found</div>;
  }
  return (
    <PermissionGuard requiredPermission={"posts:create"}>
      <NewPostPage post={post as any} />;
    </PermissionGuard>
  );
}
