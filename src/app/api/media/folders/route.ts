import { db } from "@/src/db";
import { medias } from "@/src/db/schemas";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const fetchMediaFolders = unstable_cache(
  async () => {
    const folders = await db
      .selectDistinct({ folder: medias.folder })
      .from(medias)
      .orderBy(asc(medias.folder));

    return folders?.length ? folders.map((f) => f.folder) : [];
  },
  ["media-folders"],
  {
    revalidate: 60 * 60, // 1 hour
    tags: ["media-folders"],
  }
);

export async function GET(req: NextRequest) {
  try {
    const _folders = await fetchMediaFolders();

    return NextResponse.json({
      message: "Folders retrieved successfully",
      data: _folders,
    });
  } catch (error) {
    return NextResponse.json({
      error,
      data: null,
      message: "Something went wrong... Couldn't fetch folder.",
    });
  }
}
