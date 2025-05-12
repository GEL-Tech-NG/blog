import { shortenText, stripHtml, decodeAndSanitizeHtml } from ".";
import { getPostBySlug } from "../lib/queries/post";
import {
  defaultPermalinkType,
  permalinkFormats,
  matchPermalink,
  defaultPermalinkPrefix,
} from "./permalink";

export async function getData(path: string, firstSegment: string) {
  try {
    let post;
    if (defaultPermalinkType in permalinkFormats) {
      let match;
      if (
        defaultPermalinkType === "with_prefix" &&
        (await isAllowedPrefix(firstSegment))
      ) {
        match = matchPermalink(path, defaultPermalinkType, firstSegment);
      } else {
        match = matchPermalink(path, defaultPermalinkType);
      }
      if (match?.postname) {
        post = await getPostBySlug(match.postname);
      }
    }
    return post;
  } catch (error) {
    console.log(error);

    return null;
  }
}
export function generatePostDescription(post: any) {
  const description = shortenText(
    post?.summary || stripHtml(decodeAndSanitizeHtml(post?.content || "")),
    200
  );
  return description;
}
export async function isAllowedPrefix(path: string) {
  return path === defaultPermalinkPrefix;
}
