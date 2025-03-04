import "server-only";
import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert } from "@/src/types";
import { ilike, eq, sql, and, desc, asc } from "drizzle-orm";
import { getSession } from "../auth/next-auth";

export async function getPosts({
  page = 1,
  limit = 20,
  search = "",
  status = "published",
  sortBy = "recent",
  sortOrder = "desc",
  category = "",
  access,
}: {
  page?: number;
  access?: "dashboard" | "public";
  limit?: number;
  search?: string;
  status?: PostInsert["status"] | "all";
  sortBy?: "recent" | "published_at" | "popular";
  sortOrder?: "asc" | "desc";
  category?: string;
} = {}) {
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];
  if (search) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
    whereConditions.push(ilike(posts.content, `%${search}%`));
  }
  if (status && status !== "all") {
    whereConditions.push(eq(posts.status, status));
  }
  if (access === "dashboard") {
    const session = await getSession();
    if (session?.user?.role_id !== 1) {
      whereConditions.push(eq(posts.author_id, session?.user?.id as string));
    }
  }
  if (category) {
    whereConditions.push(
      sql`EXISTS (
          SELECT 1 FROM categories 
          WHERE categories.id = ${posts.category_id} 
          AND categories.name ILIKE ${`%${category}%`}
        )`
    );
  }
  try {
    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })

      .from(posts)
      .where(and(...whereConditions));
    const total = Number(totalResult[0].count);

    let orderBy;
    const popularOrderSql = sql`(SELECT COUNT(*) FROM PostViews WHERE post_id = ${posts.id})`;
    switch (sortBy) {
      case "recent":
        orderBy = [desc(posts.created_at), desc(posts.is_sticky)];
        break;
      case "popular":
        orderBy = [
          sortOrder === "desc" ? desc(popularOrderSql) : asc(popularOrderSql),
          desc(posts.is_sticky),
        ];
        break;
      default:
        orderBy = [
          sortOrder === "desc" ? desc(posts[sortBy]) : asc(posts[sortBy]),
          desc(posts.is_sticky),
        ];
        break;
    }
    const _posts = await db.query.posts.findMany({
      limit,
      offset,
      orderBy,
      where: whereConditions?.length > 0 ? and(...whereConditions) : undefined,
      with: {
        views: {
          columns: { id: true },
        },
        featured_image: {
          columns: {
            url: true,
            alt_text: true,
            caption: true,
          },
        },
        category: {
          columns: {
            name: true,
            slug: true,
            id: true,
          },
        },
        tags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        author: {
          columns: {
            auth_id: true,
            name: true,
            avatar: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    const transformedPosts = _posts.map((post) => {
      const { views, tags, ...postWithoutViews } = post;
      const viewsCount = views.length;
      const postTags = post.tags.map((t) => t.tag);
      return {
        ...postWithoutViews,
        tags: postTags,
        views: { count: viewsCount },
      };
    });
    return {
      data: transformedPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
