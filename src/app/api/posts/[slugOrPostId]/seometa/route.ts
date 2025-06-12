import { db } from "@/src/db";
import { postSeoMeta } from "@/src/db/schemas";
import { getPostForEditing } from "@/src/lib/queries/post";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  const { slugOrPostId } = params;
  const body = await req.json();
  const { title, description, image, canonical_url, keywords } = body;
  const post = await getPostForEditing(slugOrPostId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  await db
    .update(postSeoMeta)
    .set({
      title,
      description,
      canonical_url,
      image,
      keywords: JSON.stringify(keywords),
    })
    .where(eq(postSeoMeta.post_id, post.id));
  return NextResponse.json(post);
}
