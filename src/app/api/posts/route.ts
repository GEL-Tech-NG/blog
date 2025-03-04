import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { checkPermission } from "@/src/lib/auth/check-permission";
import { getSession } from "@/src/lib/auth/next-auth";
import { getPosts } from "@/src/lib/queries/posts";
import { PostInsert } from "@/src/types";
import {
  calculateReadingTime,
  decodeAndSanitizeHtml,
  stripHtml,
} from "@/src/utils";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export const revalidate = 3600; // revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search") as string;
  const access = searchParams.get("access") as "dashboard" | "public";

  const status =
    (searchParams.get("status") as NonNullable<PostInsert["status"] | "all">) ||
    "published";
  const sortBy =
    (searchParams.get("sortBy") as "recent" | "published_at" | "popular") ||
    "recent";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const category = searchParams.get("category") as string;
  try {
    const results = await getPosts({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
      category,
      access,
    });

    return NextResponse.json({
      ...results,
      message: "All posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Something went wrong... could not fetch posts",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  await checkPermission({ requiredPermission: "posts:create" }, async () => {
    const {
      title,
      content,
      summary,
      slug,
      featured_image_id,
      status,
      author_id,
      visibility,
      category_id,
    } = await req.json();

    try {
      const post = await db.transaction(async (tx) => {
        const [insertResponse] = await tx
          .insert(posts)
          .values({
            title,
            content,
            summary,
            slug,
            featured_image_id,
            author_id,
            status,
            visibility,
            category_id,
            reading_time: calculateReadingTime(
              stripHtml(decodeAndSanitizeHtml(content))
            ),
          })
          .$returningId();
        return await tx.query.posts.findFirst({
          where: eq(posts.id, insertResponse.id),
        });
      });

      return NextResponse.json({
        data: post,
        message: "Post created successfully",
      });
    } catch (error: any) {
      return NextResponse.json({
        data: null,
        error: error?.message,
        message: "Error creating post",
      });
    }
  });
}
