import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { checkPermission } from "@/src/lib/auth/check-permission";
import { getSession } from "@/src/lib/auth/next-auth";
import { getPosts } from "@/src/lib/queries/posts";
import { parseHtmlHeadings } from "@/src/lib/toc-generator";
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
    const { content, ...rest } = await req.json();

    try {
      const post = await db.transaction(async (tx) => {
        const [insertResponse] = await tx
          .insert(posts)
          .values({
            ...rest,
            toc:
              rest?.generate_toc && rest?.status === "published"
                ? sql`CAST('${JSON.stringify(
                    generateToc(content, rest?.toc_depth ?? 2)
                  )}' AS JSON)`
                : null,
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
function generateToc(content: string, depth: number) {
  const toc = parseHtmlHeadings(content, {
    maxDepth: depth,
    maxLevel: 3,
  }).toc;
  return toc;
}
