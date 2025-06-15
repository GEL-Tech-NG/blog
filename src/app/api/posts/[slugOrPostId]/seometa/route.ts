import { db } from "@/src/db";
import { postSeoMeta } from "@/src/db/schemas";
import { getPostForEditing } from "@/src/lib/queries/post";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;
    const body = await req.json();
    const { title, description, image, canonical_url, keywords } = body;

    const post = await getPostForEditing(slugOrPostId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await db
      .insert(postSeoMeta)
      .values({
        post_id: post.id,
        title,
        description,
        canonical_url,
        image,
        keywords: JSON.stringify(keywords),
      })
      .onDuplicateKeyUpdate({
        set: {
          title,
          description,
          canonical_url,
          image,
          keywords: JSON.stringify(keywords),
          updated_at: new Date(), // if you have this field
        },
      });
    const seoMeta = await db.query.postSeoMeta.findFirst({
      where: eq(postSeoMeta.post_id, post.id),
    });
    const meta = {
      ...seoMeta,
      keywords: JSON.parse(seoMeta?.keywords || "[]"),
    };
    return NextResponse.json({ message: "SEO meta saved", data: meta });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save SEO meta" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;
    const post = await getPostForEditing(slugOrPostId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const seoMeta = await db.query.postSeoMeta.findFirst({
      where: eq(postSeoMeta.post_id, post.id),
    });
    if (!seoMeta) {
      return NextResponse.json(
        { error: "SEO meta not found" },
        { status: 404 }
      );
    }
    const meta = {
      ...seoMeta,
      keywords: JSON.parse(seoMeta.keywords || "[]"),
    };
    return NextResponse.json({ message: "SEO meta fetched", data: meta });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch SEO meta" },
      { status: 500 }
    );
  }
}
